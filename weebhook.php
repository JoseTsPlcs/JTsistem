<?php

// Configurar el encabezado para devolver JSON
header("Content-Type: application/json");

// Iniciar la sesión para acceder a las variables de sesión
session_start();

// Conexión a la base de datos
$servername = "ser-jtsistem.mysql.database.azure.com";
$username = "Lip_Alonso";
$password = "kfEq2Li-xwv3L]rP";
$dbname = "lip_dv";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Leer el cuerpo de la solicitud (payload) de Dialogflow
$requestBody = file_get_contents('php://input');

// Decodificar el JSON recibido
$data = json_decode($requestBody, true);

// Verificar si se decodificó correctamente
if ($data === null) {
    echo json_encode(['error' => 'Error al decodificar el JSON']);
    exit;
}

// Obtener el ID del usuario de la sesión
$userid = 1; // Valor predeterminado en caso de que no se encuentre el ID del usuario
if (isset($_SESSION['userData']) && is_array($_SESSION['userData'])) {
    $userData = $_SESSION['userData'];
    if (isset($userData['id'])) {
        $userid = $userData['id'];
    }
}

// Convertir el array a formato JSON
$jsonData = json_encode($data);

// Preparar la consulta para insertar en la tabla notifications
$sql = "INSERT INTO notifications (ID_USER, TYPE, MESSAGE) VALUES (?, 'dialogflow', ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $userid, $jsonData);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Notificación insertada correctamente']);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

// Cerrar la conexión
$stmt->close();
$conn->close();

?>
