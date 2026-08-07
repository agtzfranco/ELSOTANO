<?php
session_start();
header('Content-Type: application/json');
if (!empty($_SESSION['usuario_id'])) {
    echo json_encode(['usuario' => ['id' => $_SESSION['usuario_id'], 'nombre' => $_SESSION['usuario_nombre']]]);
} else {
    echo json_encode(['usuario' => null]);
}