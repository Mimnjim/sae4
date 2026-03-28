<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non supportée']);
    exit;
}

$data      = json_input();
$email     = trim($data['email']     ?? '');
$password  = $data['password']       ?? '';
$firstname = trim($data['firstname'] ?? '');
$lastname  = trim($data['lastname']  ?? '');

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email et mot de passe requis']);
    exit;
}

$stmt = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Cet email est déjà utilisé']);
    exit;
}

function hasColumn(PDO $db, string $table, string $column): bool {
    $dbName = $db->query('SELECT DATABASE()')->fetchColumn();
    $stmt   = $db->prepare('SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?');
    $stmt->execute([$dbName, $table, $column]);
    return (bool) $stmt->fetchColumn();
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$now          = date('Y-m-d H:i:s');

$cols         = ['firstname', 'lastname', 'email', 'password', 'created_at'];
$placeholders = array_fill(0, count($cols), '?');
$values       = [$firstname, $lastname, $email, $passwordHash, $now];

if (hasColumn($db, 'users', 'is_verified')) {
    array_splice($cols,         4, 0, 'is_verified');
    array_splice($placeholders, 4, 0, '?');
    array_splice($values,       4, 0, 1);
}

$sql  = 'INSERT INTO users (' . implode(', ', $cols) . ') VALUES (' . implode(', ', $placeholders) . ')';
$stmt = $db->prepare($sql);
$stmt->execute($values);
$userId = $db->lastInsertId();

http_response_code(201);
echo json_encode(['success' => true, 'user_id' => $userId]);