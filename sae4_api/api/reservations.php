<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../JWT-en-PHP-main/includes/config.php';
require_once __DIR__ . '/../JWT-en-PHP-main/classes/JWT.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// ============================================================
// Helpers JWT
// ============================================================

function getJwtUserId(): ?int {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['HTTP_X_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? getenv('HTTP_AUTHORIZATION')
        ?? null;

    if (!$authHeader && function_exists('getallheaders')) {
        $headers    = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    }

    if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $m)) return null;

    $jwtLib = new JWT();
    $token  = $m[1];

    if (!$jwtLib->isValid($token) || !$jwtLib->check($token, SECRET) || $jwtLib->isExpired($token)) return null;

    return $jwtLib->getPayload($token)['sub'] ?? null;
}

function getUserRoleById(int $id): ?string {
    global $db;
    $stmt = $db->prepare('SELECT role FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row['role'] ?? null;
}

// ============================================================
// Modèle Reservation
// ============================================================

function reservationBaseSQL(): string {
    return "SELECT r.*, u.email, u.firstname, u.lastname,
                   ts.label AS time_slot_label,
                   pc.code  AS promo_code
            FROM reservations r
            LEFT JOIN users       u  ON r.user_id       = u.id
            LEFT JOIN time_slots  ts ON r.time_slot_id  = ts.id
            LEFT JOIN promo_codes pc ON r.promo_code_id = pc.id";
}

function getAllReservations(): array {
    global $db;
    $stmt = $db->prepare(reservationBaseSQL() . " ORDER BY r.reservation_date DESC, ts.start_time ASC");
    $stmt->execute();
    return $stmt->fetchAll();
}

function getOneReservation(int $id): array|false {
    global $db;
    $stmt = $db->prepare(reservationBaseSQL() . " WHERE r.id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
}

function getReservationsByUserId(int $user_id): array {
    global $db;
    $stmt = $db->prepare(
        "SELECT r.*, ts.label AS time_slot_label, pc.code AS promo_code
         FROM reservations r
         LEFT JOIN time_slots  ts ON r.time_slot_id  = ts.id
         LEFT JOIN promo_codes pc ON r.promo_code_id = pc.id
         WHERE r.user_id = ?
         ORDER BY r.reservation_date DESC, ts.start_time ASC"
    );
    $stmt->execute([$user_id]);
    return $stmt->fetchAll();
}

function findPromoByCode(?string $code): array|false {
    global $db;
    if (!$code) return false;
    $stmt = $db->prepare("SELECT * FROM promo_codes WHERE code = ? AND active = 1 LIMIT 1");
    $stmt->execute([$code]);
    return $stmt->fetch();
}

function findTimeSlotIdByLabel(?string $label): int|false {
    global $db;
    if (!$label) return false;
    $stmt = $db->prepare("SELECT id FROM time_slots WHERE label = ? LIMIT 1");
    $stmt->execute([$label]);
    $row = $stmt->fetch();
    return $row ? (int) $row['id'] : false;
}

function createReservation(
    int     $user_id,
    string  $contact_firstname,
    string  $contact_lastname,
    string  $contact_email,
    string  $language,
    string  $reservation_date,
            $time_slot,
    array   $tickets = [],
    string  $reservation_type = 'standard',
    ?string $promo_code = null
): int|false {
    global $db;

    $time_slot_id    = is_numeric($time_slot) ? (int) $time_slot : findTimeSlotIdByLabel($time_slot);
    $promo           = findPromoByCode($promo_code);
    $promo_code_id   = $promo ? $promo['id'] : null;
    $discountPercent = $promo ? (int) $promo['discount_percent'] : 0;

    $nb_people = 0;
    $subtotal  = 0.0;
    foreach ($tickets as $t) {
        $nb_people += (int)   $t['quantity'];
        $subtotal  += (float) $t['unit_price'] * (int) $t['quantity'];
    }

    $discountAmount = round($subtotal * ($discountPercent / 100), 2);
    $total          = round($subtotal - $discountAmount, 2);
    $reference      = 'RES-' . date('Ymd') . '-' . bin2hex(random_bytes(3));

    $stmt = $db->prepare(
        "INSERT INTO reservations
            (user_id, contact_firstname, contact_lastname, contact_email, language,
             reservation_date, time_slot_id, nb_people, reservation_type, promo_code_id,
             subtotal, discount_amount, total_amount, status, reference, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, NOW())"
    );
    $stmt->execute([
        $user_id, $contact_firstname, $contact_lastname, $contact_email, $language,
        $reservation_date, $time_slot_id, $nb_people, $reservation_type, $promo_code_id,
        $subtotal, $discountAmount, $total, $reference,
    ]);

    $reservationId = (int) $db->lastInsertId();

    $stmtLine = $db->prepare(
        "INSERT INTO reservation_tickets (reservation_id, ticket_type, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?)"
    );
    foreach ($tickets as $t) {
        $lineTotal = round((float) $t['unit_price'] * (int) $t['quantity'], 2);
        $stmtLine->execute([$reservationId, $t['ticket_type'], $t['unit_price'], $t['quantity'], $lineTotal]);
    }

    return $reservationId;
}

function updateReservation(int $id, array $fields): bool {
    global $db;

    $allowed = ['reservation_date', 'time_slot_id', 'nb_people', 'reservation_type',
                'status', 'promo_code_id', 'subtotal', 'discount_amount', 'total_amount'];
    $sets   = [];
    $values = [];

    foreach ($fields as $k => $v) {
        if (in_array($k, $allowed, true)) {
            $sets[]   = "$k = ?";
            $values[] = $v;
        }
    }

    if (empty($sets)) return false;

    $values[] = $id;
    $stmt = $db->prepare("UPDATE reservations SET " . implode(', ', $sets) . ", updated_at = NOW() WHERE id = ?");
    return $stmt->execute($values);
}

function deleteReservation(int $id): bool {
    global $db;
    $stmt = $db->prepare("DELETE FROM reservations WHERE id = ?");
    return $stmt->execute([$id]);
}

// ============================================================
// Contrôleur
// ============================================================

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':
        if (isset($_GET['id']))
            echo json_encode(getOneReservation((int) $_GET['id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        elseif (isset($_GET['user_id']))
            echo json_encode(getReservationsByUserId((int) $_GET['user_id']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        else
            echo json_encode(getAllReservations(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;

    case 'POST':
        $userId = getJwtUserId();
        if (!$userId) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentification requise']);
            break;
        }

        $data = json_input();

        if (empty($data['reservation_date']) || empty($data['time_slot']) || empty($data['tickets'])
            || empty($data['contact_firstname']) || empty($data['contact_lastname']) || empty($data['contact_email'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Données manquantes (contact, date, créneau, tickets)']);
            break;
        }

        $reservationId = createReservation(
            $userId,
            $data['contact_firstname'],
            $data['contact_lastname'],
            $data['contact_email'],
            $data['language']         ?? 'fr',
            $data['reservation_date'],
            $data['time_slot'],
            $data['tickets'],
            $data['reservation_type'] ?? 'standard',
            $data['promo_code']       ?? null
        );

        http_response_code(201);
        echo json_encode(['success' => true, 'reservation_id' => $reservationId, 'message' => 'Réservation créée'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;

    case 'PUT':
        $jwtId = getJwtUserId();
        if (!$jwtId || getUserRoleById($jwtId) !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Non autorisé']);
            break;
        }

        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID manquant']);
            break;
        }

        $data = json_input();
        if (updateReservation($id, $data)) {
            echo json_encode(['success' => true, 'message' => 'Réservation mise à jour'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour']);
        }
        break;

    case 'DELETE':
        $jwtId = getJwtUserId();
        if (!$jwtId) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentification requise']);
            break;
        }

        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID manquant']);
            break;
        }

        $stmt = $db->prepare('SELECT user_id FROM reservations WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        if (!$row) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Réservation introuvable']);
            break;
        }

        if ($row['user_id'] != $jwtId && getUserRoleById($jwtId) !== 'admin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Non autorisé']);
            break;
        }

        if (deleteReservation($id)) {
            echo json_encode(['success' => true, 'message' => 'Réservation supprimée'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Méthode non supportée']);
}