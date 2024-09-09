<?php

session_start();

// Verificar si la sesión está iniciada y si existe la variable 'userData'
if (isset($_SESSION['userData'])) {
    $userData = $_SESSION['userData'];
    echo json_encode($userData);
} else {
    // Si la sesión o 'userData' no existen, devolver un mensaje de error
    echo json_encode(['error' => 'Sesión no iniciada o datos de usuario no disponibles']);
}

?>

