<?php

require 'Caja_Base.php';

$sql = "SELECT * FROM caja_chica WHERE ID LIKE '$id'";
$db =  mysqli_query($conexion,$sql);

if(mysqli_num_rows($db_ventas) > 0){
  while($row = mysqli_fetch_assoc($db)){
    $info['id'] = $row['ID'];
    $info['date'] = $row['DATE'];
    $info['description'] = $row['DESCRIPCION'];
    $info['data'] = $row['INGRESO'];
    $info['data'] = $row['CHECK'];
  }
}

echo json_encode($info);


 ?>
