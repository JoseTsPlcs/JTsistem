<?php

include '../Conection.php';

$materiales = array(
  'id' => array(),
  'material' => array(),
  'etiqueta' => array(),
  'unidad' => array(),
  'almacen1' => array()
);

$material = $_POST['material'];

if($name != ""){

  $sql = "SELECT * WHERE MATERIAL LIKE '%$material%'";

  $rst =  mysqli_query($conexion, $sql);
  while($row = mysqli_fetch_assoc($rst)){
    array_push($materiales['id'],$row['ID']);
    array_push($materiales['material'],$row['MATEIR']);
    array_push($materiales['etiqueta'],$row['ETIQUETA']);
    array_push($materiales['unidad'],$row['UNIDAD']);
    array_push($materiales['almacen1'],$row['ALMACEN1']);
  }
}

echo json_encode($materiales);

 ?>
