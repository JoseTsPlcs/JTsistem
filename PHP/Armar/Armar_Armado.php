<?php
include '../Conection.php';

$nro = $_POST['nro'];
$armado_end = 0;

//ARMADO = 1
$db = "SELECT ARMADO FROM ventas WHERE NRO LIKE '$nro'";
$cnx = mysqli_query($conexion,$db);

while($row =  mysqli_fetch_assoc($cnx)){
  $armado = $row['ARMADO'] == 1 ? 0 : 1;

  $update = "UPDATE `ventas` SET `ARMADO`= '$armado' WHERE NRO = '$nro'";
  $update_cnx = mysqli_query($conexion,$update);

  $armado_end = $armado;
}

//PRODUCTOS ITERACTION
if($armado_end == 1){
  $update = "UPDATE `ventas_productos` SET `ITERACTION`= '0', `STRIKE`= '1' WHERE NRO = '$nro'";
  $update_cnx = mysqli_query($conexion,$update);
}else {
  $update = "UPDATE `ventas_productos` SET `STRIKE`= '0' WHERE NRO = '$nro'";
  $update_cnx = mysqli_query($conexion,$update);
}

echo json_encode("Ok");

 ?>
