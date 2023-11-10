<?php

include 'Recetas_Post.php';
$action = "NONE";

if($receta != ""){

  include '../Conection.php';

  //NEW ID
  $id = 0;
  $sql = "SELECT ID FROM recetas";
  $rst = mysqli_query($conexion, $sql);
  while($row = mysqli_fetch_assoc($rst)){
    $id = $row['ID'];
  }
  $id += 1;

  //PRODUCTO
  if($tipo == 1){
    //ADD EACH MERCADERIA
    $costo_total = 0;
    for ($i=0; $i < count($mercaderia_ids); $i++) {

      $mrc_id = $mercaderia_ids[$i];
      $mrc_cnt = $mercaderia_counts[$i];
      $mrc_cst = $mercaderia_costos[$i];

      if($mrm_id != "" && $mrc_cnt > 0){

        //MERCADERIA
        $sql = "INSERT INTO `recetas_mercaderia` (`ID`,`MERCADERIA`, `CANTIDAD`, `COSTO`)
        VALUES ('$id' , '$mrc_id' , '$mrc_cnt' , '$mrc_cst')";
        $resp = mysqli_query($conexion , $sql);

        $costo_total += $mrc_cst;
      }
    }

    //ADD RECETA
    if($costo_total > 0){
      $sql = "INSERT INTO `recetas` (`ID`,`RECETA`, `TIPO`, `ETIQUETA`, `PRECIO`)
      VALUES ('$id' , '$receta' , '$tipo' , '$etiqueta', '$precio')";
      $resp = mysqli_query($conexion , $sql);
    }
  }

  //MERCADERIA
  if($tipo = 0){
    $sql = "INSERT INTO `recetas` (`ID`,`RECETA`, `TIPO`, `ETIQUETA`, `PRECIO`, `COSTO`)
    VALUES ('$id' , '$receta' , '$tipo' , '$etiqueta', '$precio', '$costo_total')";
    $resp = mysqli_query($conexion , $sql);
  }

  $action = "ADDED";
}

echo json_encode($action);
 ?>
