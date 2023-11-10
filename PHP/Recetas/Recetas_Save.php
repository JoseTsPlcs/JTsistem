<?php
include 'Recetas_Post.php';
$action = "NONE";
$id = $_POST['id'];

$sql = "SELECT * FROM recetas WHERE ID = '$id'";
$rst = mysqli_query($conexion, $sql);
$find = mysqli_num_rows($rst);

if($find > 0){

  //DELETE EACH MERCADERIA
  $sql = "DELETE FROM `recetas_mercaderia` WHERE ID = '$id'";
  $rst = mysqli_query($conexion, $sql);

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

  //SAVE RECETA
  $sql = "UPDATE `recetas` SET
  `RECETA`= $receta,
  `TIPO`= $tipo,
  `ETIQUETA`= $etiqueta,
  `PRECIO`= $precio,
  `COSTO`= $costo_total
  WHERE ID = '$id'";
  $rst = mysqli_query($conexion, $sql);

}else {
  $receta['action'] = "NO FIND";
};


echo json_encode($action);
 ?>
