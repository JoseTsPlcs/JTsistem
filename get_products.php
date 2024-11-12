<?php
// Permitir solicitudes desde cualquier origen (puedes restringirlo a un dominio específico si es necesario)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");


// Configuración de la base de datos
$host = 'ser-jtsistem.mysql.database.azure.com';         // Por ejemplo: 'localhost' o la dirección de tu base de datos en Azure
$db_name = 'lip_dv';
$username = 'Lip_Alonso';
$password = 'kfEq2Li-xwv3L]rP';

// Crear conexión
$conn = new mysqli($host, $username, $password, $db_name);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error de conexión: ' . $conn->connect_error]));
}

// Obtener el company_id de la solicitud
$company_id = isset($_GET['company_id']) ? intval($_GET['company_id']) : 0;

if ($company_id === 0) {
    die(json_encode(['error' => 'company_id es requerido']));
}

// Consultar la lista de productos filtrados por company_id
$sql = "SELECT ID_PRODUCT, NAME, PRICE_UNIT FROM products WHERE ID_COMPANY = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $company_id); // Bind the parameter
$stmt->execute();
$result = $stmt->get_result();

$products = [];
if ($result->num_rows > 0) {
    // Recorrer los resultados y construir el array
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            'id' => $row['ID_PRODUCT'],
            'name' => $row['NAME'],
            'price' => $row['PRICE_UNIT'],
            'tag' => ''
        ];
    }
}

// Devolver la respuesta en formato JSON
echo json_encode($products);

// Cerrar la conexión
$conn->close();
?>
