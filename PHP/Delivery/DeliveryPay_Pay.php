<?php

include '../Conection.php';

$nro = $_POST['nro'];
$uss = $_POST['uss'];
$efectivo = $_POST['efectivo'];

$sql = "UPDATE `ventas` SET
ENTREGADO = 1,
ARMADO = 1,
TRABAJADOR ='$uss'
WHERE NRO = '$nro'";
$resp = mysqli_query($conexion , $sql);

if($efectivo == "true"){

  $sql = "UPDATE `ventas` SET
  CANCELADO = 1,
  METODO ='Efectivo'
  WHERE NRO = '$nro'";
  $resp = mysqli_query($conexion , $sql);
}

echo json_encode("payed");

 ?>
