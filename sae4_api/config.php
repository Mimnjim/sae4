<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Authorization');

date_default_timezone_set('UTC');

$db = new PDO('mysql:host=localhost;dbname=musee_api', 'root', 'root');

function json_input(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}