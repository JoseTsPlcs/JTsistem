<?php

include 'Stock_Post.php';

//ADD

//NEW NRO
$sql = "SELECT NRO FROM mercaderia_registro";
$rst = mysqli_query($conexion, $sql);
while($row = mysqli_fetch_assoc($rst)){
  $nro = $row['NRO'];
}
$nro += 1;

//FOR EACH MATERIAL
$costo_total = 0;
for ($i=0; $i < count($products) ; $i++) {

  $product = $products[$i]['product'];
  $count = $products[$i]['count'];
  $costo = $products[$i]['cost'];

  if($product != -1 && $count > 0 && $costo > 0){

    //MATERIALES
    $sql = "INSERT INTO `mercaderia_productos` (`NRO`,`MERCADERIA`, `COUNT`, `COSTO_TOTALXPRODUCTO`)
    VALUES ('$nro' , '$product' , '$count' , '$costo')";
    $resp = mysqli_query($conexion , $sql);

    //STOCK ADD
    $sql = "UPDATE `productos` SET STOCK = STOCK + '$count' WHERE ID = '$product'";
    $rst = mysqli_query($conexion , $sql);

    $costo_total += $costo;
  }

}

//REGISTRO
if($costo_total > 0){
  $sql = "INSERT INTO `mercaderia_registro` (`NRO`,`DATE`, `COSTO_TOTAL`)
  VALUES ('$nro' , '$date' , '$costo_total')";
  $resp = mysqli_query($conexion , $sql);

  $action['success'] = true;
  $action['msg'] = "Añadido con exito";
}

echo json_encode($action);

 ?>
