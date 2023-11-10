<?php

include 'Materiales_Post.php';

if($material == ""){
  $action = "FALTA EL NOMBRE!!";
}
else {
  //GET NEW ID
  $sql = "SELECT ID FROM materia";
  $rst = mysqli_query($conexion, $sql);
  while($row = mysqli_fetch_assoc($rst)){
    $id = $row['ID'];
  }
  $id += 1;

  if(!isset($etiqueta)) $etiqueta = "OTROS";
  if(!isset($unidad)) $unidad = "UNIDAD";
  if(!isset($almacen1)) $almacen1 = 0;


  $sql = "INSERT INTO `materia` (`ID`,`MATERIAL`, `ETIQUETA`, `UNIDAD`, `ALMACEN1`)
  VALUES ('$id' , '$material' , '$etiqueta' , '$unidad' , '$almacen1')";
  $resp = mysqli_query($conexion , $sql);

  $action = "ADDED";
}

echo json_encode($action);

 ?>
