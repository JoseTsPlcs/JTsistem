<?php

require 'Conection.php';

$db = "SELECT * FROM ventas_productos";
$cnx = mysqli_query($conexion,$db);

$nro = -1;
$id = 0;

while($row =  mysqli_fetch_assoc($cnx)){

  if($nro != $row['NRO']){
    $nro = $row['NRO'];
    $id = 0;
  }



  $armado = $row['ARMADO'] == 1 ? 0 : 1;

  $update = "UPDATE `ventas` SET `ARMADO`= '$armado' WHERE NRO = '$nro'";
  $update_cnx = mysqli_query($conexion,$update);

  $armado_end = $armado;
}

 ?>
