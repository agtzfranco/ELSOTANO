<?php
require 'config.php';
header('Content-Type: application/json');

$servicio = $_GET['servicio'] ?? '';
$fecha    = $_GET['fecha'] ?? '';

if (!$servicio || !$fecha) {
    echo json_encode(['error' => 'Faltan servicio o fecha']);
    exit;
}

// Traer las reservas ocupadas de ese día (pendientes y confirmadas bloquean el horario)
$stmt = $pdo->prepare("
    SELECT hora_inicio, hora_fin 
    FROM reservaciones 
    WHERE servicio = ? AND fecha = ? AND estado != 'cancelada'
");
$stmt->execute([$servicio, $fecha]);
$reservas = $stmt->fetchAll();

// Generar horarios de 11:00 a 22:00 (última hora que inicia antes del cierre 23:00)
$slots = [];
for ($hora = 11; $hora < 23; $hora++) {
    $inicioSlot = $hora;
    $finSlot    = $hora + 1;
    $ocupado    = false;

    foreach ($reservas as $r) {
        $rInicio = (int)substr($r['hora_inicio'], 0, 2);
        $rFin    = (int)substr($r['hora_fin'], 0, 2);
        // Detectar traslape: si la reserva empieza antes de que termine el slot
        // y termina después de que inicie el slot, está ocupado
        if ($inicioSlot < $rFin && $finSlot > $rInicio) {
            $ocupado = true;
            break;
        }
    }

    $slots[] = [
        'hora'    => sprintf('%02d:00', $hora),
        'ocupado' => $ocupado
    ];
}

echo json_encode([
    'servicio' => $servicio,
    'fecha'    => $fecha,
    'slots'    => $slots
]);