<?php

require '../Conection.php';

$anular = $_POST['anular'];
$nro = $_POST['nro'];

$action = array(
  'success' => false,
  'msg' => ""
);

$rst =  mysqli_query($conexion,"SELECT * FROM ventas WHERE NRO = '$nro'");

//ANULAR REGISTRO
while($row = mysqli_fetch_assoc($rst)){

  $anulado = $row['ANULADO'];
  $anulado = ($anular ? 1 : 0);

  $sql = "UPDATE `ventas` SET `ANULADO`= '$anulado' WHERE NRO = '$nro'";
  mysqli_query($conexion,$sql);

  $action['success'] = true;
  $action['msg'] = "anulacion exitosa";
}

//STOCK
$sql = "SELECT * FROM mercaderia_productos WHERE NRO = '$nro'";
$rst = mysqli_query($conexion , $sql);

while($row = mysqli_fetch_assoc($rst)){

  $producto = $row['MERCADERIA'];
  $count = $row['COUNT'];
  //ADD OR DELETE
  $count = $count * ($anulado == 0 ? 1 : -1);

  mysqli_query($conexion , "UPDATE productos SET STOCK = STOCK + '$count' WHERE ID = '$producto'");
}

echo json_encode($action);

 ?>
