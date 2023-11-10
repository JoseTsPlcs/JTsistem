<?php

include '../conection.php';

$materiales = array(
  'id' => array(),
  'material' => array(),
  'etiqueta' => array(),
  'unidad' => array(),
  'almacen1' => array()
);

$sql = "SELECT * FROM materia";
$rst = mysqli_query($conexion, $sql);
while($row = mysqli_fetch_assoc($rst)){
  array_push($materiales['id'], $row['ID']);
  array_push($materiales['material'], $row['MATERIAL']);
  array_push($materiales['etiqueta'], $row['ETIQUETA']);
  array_push($materiales['unidad'], $row['UNIDAD']);
  array_push($materiales['almacen1'], $row['ALMACEN1']);
}

echo json_encode($materiales);


 ?>
