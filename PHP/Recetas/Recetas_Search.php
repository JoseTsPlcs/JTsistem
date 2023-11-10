<?php

$receta = array(
  'action' => "NONE",

  'id' => "",
  'receta' => "",
  'tipo' => "",
  'etiqueta' => "",
  'precio' => "",
  'costo_total' => "",

  'mrc_ids' => array(),
  'mrc_counts' => array(),
  'mrc_costos' => array()
);

$id = $_POST['id'];

$sql = "SELECT * FROM recetas WHERE ID = '$id'";
$rst = mysqli_query($conexion, $sql);
$find = mysqli_num_rows($rst);

if($find > 0){

  //RECETA
  while($row = mysqli_fetch_assoc($rst)){
    $receta['id'] = $row['ID'];
    $receta['receta'] = $row['RECETA'];
    $receta['tipo'] = $row['TIPO'];
    $receta['etiqueta'] = $row['ETIQUETA'];
    $receta['precio'] = $row['PRECIO'];
    $receta['costo_total'] = $row['COSTO_TOTAL'];
  }

  $sql = "SELECT * FROM recetas_mercaderia WHERE ID = '$id'";
  $rst = mysqli_query($conexion, $sql);

  //RECETA MERCADERIA
  while($row = mysqli_fetch_assoc($rst)){
    array_push($receta['mrc_ids'],$row['MERCADERIA']);
    array_push($receta['mrc_counts'],$row['CANTIDAD']);
    array_push($receta['mrc_costos'],$row['COSTO']);
  }

}else {
  $receta['action'] = "NO FIND";
};

echo json_encode($action);
 ?>
