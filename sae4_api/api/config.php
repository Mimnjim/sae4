<?php
// Minimal DB config — update with your environment settings
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Authorization');

date_default_timezone_set('UTC');

try {
    $dbHost = getenv('DB_HOST') ?: '127.0.0.1';
    $dbPort = getenv('DB_PORT') ?: 8889; // common MAMP default
    // The shipped SQL file creates database `musee_api` (see database.sql)
    $dbName = getenv('DB_NAME') ?: 'musee_api';
    $dbUser = getenv('DB_USER') ?: 'root';
    $dbPass = getenv('DB_PASS') ?: 'root';

    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";

    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'DB connection error', 'error' => $e->getMessage()]);
    exit;
}

// Helper to read JSON body
function json_input() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

?>
