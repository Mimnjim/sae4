<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../JWT-en-PHP-main/includes/config.php';
require_once __DIR__ . '/../JWT-en-PHP-main/classes/JWT.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

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
// Authentification obligatoire
// ============================================================

$userId = getJwtUserId();
if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authentification requise']);
    exit;
}

$currentRole = getUserRoleById($userId);

// ============================================================
// Contrôleur
// ============================================================

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        if (isset($_GET['all']) && $currentRole === 'admin') {
            $stmt = $db->prepare('SELECT id, email, firstname, lastname, role FROM users ORDER BY id DESC');
            $stmt->execute();
            echo json_encode(['success' => true, 'users' => $stmt->fetchAll()], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            break;
        }

        $stmt = $db->prepare('SELECT id, email, firstname, lastname, role FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode(['success' => true, 'user' => $user], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Utilisateur introuvable']);
        }
        break;

    case 'PUT':
        $data   = json_input();
        $fields = [];
        $values = [];

        if (!empty($data['email']))     { $fields[] = 'email = ?';     $values[] = $data['email']; }
        if (!empty($data['firstname'])) { $fields[] = 'firstname = ?'; $values[] = $data['firstname']; }
        if (!empty($data['lastname']))  { $fields[] = 'lastname = ?';  $values[] = $data['lastname']; }
        if (!empty($data['password']))  { $fields[] = 'password = ?';  $values[] = password_hash($data['password'], PASSWORD_DEFAULT); }

        if (!empty($data['role']) && $currentRole === 'admin') {
            $fields[] = 'role = ?';
            $values[] = $data['role'];
        }

        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Aucune donnée à mettre à jour']);
            break;
        }

        $targetId = $userId;
        if (!empty($_GET['id']) && $currentRole === 'admin') {
            $targetId = (int) $_GET['id'];
        }

        $values[] = $targetId;
        $stmt = $db->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($values);

        $stmt2 = $db->prepare('SELECT id, email, firstname, lastname, role FROM users WHERE id = ? LIMIT 1');
        $stmt2->execute([$targetId]);
        echo json_encode(['success' => true, 'user' => $stmt2->fetch()], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;

    case 'DELETE':
        if ($currentRole !== 'admin') {
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

        $stmt = $db->prepare('DELETE FROM users WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Utilisateur supprimé'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Méthode non supportée']);
}