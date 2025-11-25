<?php

// This file tests CORS configuration
header('Content-Type: application/json');

echo json_encode([
    'message' => 'CORS test successful',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
        'request_headers' => getallheaders()
    ]
]);
