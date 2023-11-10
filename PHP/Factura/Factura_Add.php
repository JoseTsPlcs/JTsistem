<?php

require 'Factura_Addbase.php';

//VENTAS
$fct['data']['nro'] = mysqli_num_rows(mysqli_query($conexion,"SELECT * FROM ventas")) + 1;
$nro = $fct['data']['nro'];

$sql = "INSERT INTO `ventas` (`NRO`, `CONFIRM`, `DATE`, `NAME`, `TOTAL`, `METODO`, `DELIVERY`, `TRABAJADOR`, `CANCELADO`, `CAJERO`, `ENTREGADO`, `RECOGE`,`COMMENT`,`DOCUMENT`,`ARMADO`,`DELIVERY_GRATIS`,`DESCUENTO`)
VALUES ('$nro', '$confirm', '$date', '$cliente_id', '$total', '$metodo', '$delivery', '$trabajador_delivery', '$cancelado', '$cajero', '$entregado', '$recoge', '$comment','$documento', '$armado','$deliv_free',$descuento)";
$resp = mysqli_query($conexion,$sql);

//PRODUCTOS
for ($i=0; $i < $prd_count; $i++) {

  $i_info = $fct['products'][$i]['info'];
  $i_id = $fct['products'][$i]['id'];
  $i_product = $fct['products'][$i]['product'];
  $i_count = $fct['products'][$i]['count'];
  $i_price = $fct['products'][$i]['price'];
  $i_stock = $fct['products'][$i]['stock'];

  if($i_product !=""){
    $sql = "INSERT INTO `ventas_productos` (`NRO` , `LINE`, `INFO`, `PRODUCTO`,`PRODUCTO_ID`, `PRECIO`, `CANTIDAD`, `UNIDAD`, `ITERACTION`, `STRIKE`)
    VALUES ('$nro' , '$i', '$i_info', '$i_product','$i_id', '$i_price', '$i_count','$i_stock' , 0, 0)";
    $resp = mysqli_query($conexion,$sql);
  }
}

//STOCK
for ($i=0; $i < $prd_count; $i++) {
  $i_product = $fct['products'][$i]['product'];
  $i_stock = floatval($fct['products'][$i]['stock']);

  if($i_product != ""){
    $sql = "UPDATE productos SET
    STOCK = STOCK - '$i_stock'
    WHERE PRODUCTO = '$i_product'";
    $resp = mysqli_query($conexion,$sql);
    
    //LIMIT STOCK ON
    $db_limiton =  mysqli_query($conexion, "SELECT STOCK, STOCK_LIMIT FROM productos WHERE PRODUCTO LIKE '$i_product'");
    while($row = mysqli_fetch_assoc($db_limiton)){
            
        $limit = $row['STOCK'] < $row['STOCK_LIMIT'] ? 1 : 0;
        mysqli_query($conexion, "UPDATE productos SET STOCK_ONLIMIT = $limit WHERE PRODUCTO LIKE '$i_product'");
    }
  }
}


echo json_encode($fct);

?>
