<?php

if(isset($material) && $material != ""){

  $sql = mysqli_query($conexion,"SELECT * FROM materia WHERE MATERIAL LIKE '$material'");
  $find = mysqli_num_rows($sql);

  if ($find >= 1){

    $action = "UPDATED";
    //UPDATE
    if(isset($unidad)){
      $sql = "UPDATE `materia` SET UNIDAD ='$unidad' WHERE MATERIAL LIKE '$material'";
      $resp = mysqli_query($conexion , $sql);
    }
    if(isset($etiqueta)){
      $sql = "UPDATE `materia` SET ETIQUETA ='$etiqueta' WHERE MATERIAL LIKE '$material'";
      $resp = mysqli_query($conexion , $sql);
    }
    if(isset($almacen1)){
      $sql = "UPDATE `materia` SET ALMACEN1 = '$almacen1' WHERE MATERIAL LIKE '$material'";
      $resp = mysqli_query($conexion , $sql);
      $action = "UPDATED almacen";
    }
    //
    echo json_encode($action);

  }else
  {
    //ADD
    include 'Materiales_Add.php';
  }

}


 ?>
