<?php
require_once __DIR__ . '/config.php';

// Activation flow has been disabled. If the front-end still calls this endpoint,
// return a harmless success message so older activation links don't break the UX.
$token = $_GET['token'] ?? null;
if ($token) {
    echo json_encode(['success' => true, 'message' => 'Activation disabled on this server; account is already active.']);
} else {
    echo json_encode(['success' => true, 'message' => 'Activation disabled on this server.']);
}

?>
