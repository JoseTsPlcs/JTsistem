<?php

include '../Conection.php';

$nro = $_POST['nro'];

$registro = array(
  'success' => false,
  'msg' => "",

  'anulado' => "",
  'date' => "",

  'products' => array()
);

//FIND
$sql = "SELECT NRO FROM mercaderia_registro WHERE NRO = '$nro'";
$rst = mysqli_query($conexion, $sql);
$find = mysqli_num_rows($rst);

if($find > 0){

  //REGISTRO
  $rst =  mysqli_query($conexion,"SELECT * FROM mercaderia_registro WHERE NRO LIKE '$nro'");

  $fct['products'] = array();
  while($row = mysqli_fetch_assoc($rst)){
    $registro['date'] = $row['DATE'];
    $registro['anulado'] = $row['ANULADO'];
  }

  //MATERIALES
  $sql = "SELECT m.NRO, m.MERCADERIA, m.COUNT, m.COSTO_TOTALXPRODUCTO , i.ID , i.PRODUCTO, i.UNIDAD
  FROM mercaderia_productos m
  LEFT JOIN productos i ON  m.MERCADERIA = i.ID
  WHERE NRO = '$nro'";

  $rst =  mysqli_query($conexion,$sql);
  while($row = mysqli_fetch_assoc($rst)){

    $prd = array(
      'product' => $row['PRODUCTO'],
      'unidad' => $row['UNIDAD'],
      'count' => $row['COUNT'],
      'cost' => $row['COSTO_TOTALXPRODUCTO']
    );
    array_push($registro['products'],$prd);
  }

  $registro['success'] = true;
  $registro['msg'] = "FIND";

}else {
  $registro['success'] = false;
  $registro['msg'] = "NO FIND";
}

echo json_encode($registro);

 ?>
