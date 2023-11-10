<?php

include 'Stock_Post.php';

//SAVE

$nro = $_POST['nro'];

//FIND
$sql = "SELECT NRO , ANULADO FROM mercaderia_registro WHERE NRO = '$nro'";
$rst = mysqli_query($conexion, $sql);
$find = mysqli_num_rows($rst);

if($find > 0){

  $anulado = 0;
  while($row = mysqli_fetch_assoc($rst)){
    $anulado = $row['ANULADO'];
  }

  //DELETE STOCK
  if($anulado == 0){
    $sql = "SELECT * FROM mercaderia_productos WHERE NRO = '$nro'";
    $rst = mysqli_query($conexion,$sql);
  }

  while($row = mysqli_fetch_assoc($rst)){
    $producto = $row['MERCADERIA'];
    $count = $row['COUNT'];
    mysqli_query($conexion , "UPDATE `productos` SET STOCK = STOCK - '$count' WHERE ID = '$producto'");
  }

  //DELETE PRODUCTOS
  $rst = mysqli_query($conexion , "DELETE FROM mercaderia_productos WHERE NRO LIKE '$nro'");

  //ADD NEW PRODUCTOS
  $costo_total = 0;
  for ($i = 0; $i < count($products) ; $i++) {

    $producto = $products[$i]['product'];
    $count = $products[$i]['count'];
    $cost = $products[$i]['cost'];

    if($producto != "" && $count > 0){
      //MATERIALES
      $sql = "INSERT INTO `mercaderia_productos` (`NRO`,`MERCADERIA`, `COUNT`, `COSTO_TOTALXPRODUCTO`)
      VALUES ('$nro' , '$producto' , '$count' , '$cost')";
      $resp = mysqli_query($conexion , $sql);

      $costo_total += $cost;
    }

    if($anulado == 0){
      //ADD STOCK
      $sql = "UPDATE `productos` SET STOCK = STOCK + '$count' WHERE ID = '$producto'";
      $rst = mysqli_query($conexion , $sql);
    }
  }

  //UPDATE REGISTRO

  $sql = "UPDATE `mercaderia_registro` SET COSTO_TOTAL = '$costo_total' , DATE = '$date' WHERE NRO = '$nro'";
  $rst = mysqli_query($conexion , $sql);

  $action['success'] = true;
  $action['msg'] = "guardado con exito";
}
else {
  $action['success'] = false;
  $action['msg'] = "no se encontrar";
}

echo json_encode($action);

 ?>
