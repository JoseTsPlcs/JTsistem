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

// Conectar a la base de datos
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    exit();
}

// Obtener company_id de la solicitud
$companyId = isset($_GET['company_id']) ? (int)$_GET['company_id'] : 0;

// Consulta para obtener información de la compañía
$sqlCompany = "
    SELECT 
        ID_COMPANY, NAME, RUC, TELF
    FROM companies
    WHERE ID_COMPANY = :companyId
";

$stmtCompany = $pdo->prepare($sqlCompany);
$stmtCompany->bindParam(':companyId', $companyId, PDO::PARAM_INT);
$stmtCompany->execute();
$companyInfo = $stmtCompany->fetch(PDO::FETCH_ASSOC);

// Consulta para obtener productos de la compañía
$sqlProducts = "
    SELECT 
        ID_PRODUCT, NAME, ID_PRODUCT_TIPE, ID_PRODUCT_TAG, UNID_ID, PRICE_UNIT, ACTIVE
    FROM products
    WHERE ID_COMPANY = :companyId
";

$stmtProducts = $pdo->prepare($sqlProducts);
$stmtProducts->bindParam(':companyId', $companyId, PDO::PARAM_INT);
$stmtProducts->execute();
$productsInfo = $stmtProducts->fetchAll(PDO::FETCH_ASSOC);

// Estructurar la respuesta
$response = [
    'company' => $companyInfo,
    'products' => $productsInfo
];

// Devolver los resultados como JSON
header('Content-Type: application/json');
echo json_encode($response);

// Cerrar la conexión
$pdo = null;
?>
