<?php

include 'Materiales_Post.php';

$id = $_POST['id'];

$sql = mysqli_query($conexion,"SELECT * FROM materia WHERE ID = '$id'");
$find = mysqli_num_rows($sql);

if ($find >= 1){

  //SAVE
  if(isset($material)){
    $sql = "UPDATE `materia` SET MATERIAL ='$material' WHERE  ID = '$id'";
    $resp = mysqli_query($conexion , $sql);
  }

  if(isset($unidad)){
    $sql = "UPDATE `materia` SET UNIDAD ='$unidad' WHERE ID = '$id'";
    $resp = mysqli_query($conexion , $sql);
  }
  if(isset($etiqueta)){
    $sql = "UPDATE `materia` SET ETIQUETA ='$etiqueta' WHERE ID = '$id'";
    $resp = mysqli_query($conexion , $sql);
  }
  if(isset($almacen1)){
    $sql = "UPDATE `materia` SET ALMACEN1 = '$almacen1' WHERE ID = '$id'";
    $resp = mysqli_query($conexion , $sql);
  }

  $action = "SAVED";
  //

}else
{
  $action = "NO FIND";
}

echo json_encode($action);


 ?>
