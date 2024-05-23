<!DOCTYPE html>
<html lang="es" dir="ltr">
  <head>
    

    <title></title>
  </head>
  <body>

  <?php
// Configuración de la conexión a la base de datos MySQL en Azure
$server = "ser-jtsistem.mysql.database.azure.com";    // Nombre del servidor MySQL en Azure
$username = "Lip_Alonso";                // Nombre de usuario
$password = "kfEq2Li-xwv3L]rP";                        // Contraseña
$database = "lip_dv";                                 // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($server, $username, $password, $database);

// Verificar la conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

echo "Conexión exitosa a la base de datos";

// Cerrar conexión
$conn->close();
?>





   

  </body>
</html>