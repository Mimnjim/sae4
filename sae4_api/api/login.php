<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../JWT-en-PHP-main/includes/config.php';
require_once __DIR__ . '/../JWT-en-PHP-main/classes/JWT.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non supportée']);
    exit;
}

function loginUser(string $email, string $password): array {
    global $db;

    $stmt = $db->prepare("SELECT id, email, password, firstname, lastname FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        return ['success' => false, 'message' => 'Identifiants invalides'];
    }

    $jwtLib = new JWT();
    $token = $jwtLib->generate(
        ['alg' => 'HS256', 'typ' => 'JWT'],
        [
            'sub'       => $user['id'],
            'email'     => $user['email'],
            'firstname' => $user['firstname'],
            'lastname'  => $user['lastname'],
        ],
        SECRET,
        3600
    );

    return [
        'success' => true,
        'token'   => $token,
        'user'    => [
            'id'        => $user['id'],
            'email'     => $user['email'],
            'firstname' => $user['firstname'],
            'lastname'  => $user['lastname'],
        ],
    ];
}

$data = json_input();

if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email et mot de passe requis']);
    exit;
}

echo json_encode(loginUser($data['email'], $data['password']), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);