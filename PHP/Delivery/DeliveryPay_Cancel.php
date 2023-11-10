<?php

include '../Conection.php';

$nro = $_POST['nro'];

$sql = "UPDATE `ventas` SET
ENTREGADO = 0,
CANCELADO = 0,
TRABAJADOR =''
WHERE NRO = '$nro'";
$resp = mysqli_query($conexion , $sql);

echo json_encode("canceled");
 ?>
