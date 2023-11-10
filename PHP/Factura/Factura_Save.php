<?php

require 'Factura_Addbase.php';

//ACEPT?
$db_ventas =  mysqli_query($conexion,"SELECT * FROM ventas WHERE NRO LIKE '$nro'");


if(mysqli_num_rows($db_ventas) > 0){

  //VENTAS DE PRODUCTOS
  $db_ventas_productos =  mysqli_query($conexion, "SELECT * FROM ventas_productos WHERE NRO LIKE '$nro'");

  //ANULAR
  $anulado_action = 0;
  // 1 => ANULAR
  // -1 => DESANULAR
  while($row = mysqli_fetch_assoc($db_ventas)){

    if($row['ANULADO'] == 1 && $anulado == 0){

      $anulado_action = -1;
      break;
    }else {

      if($row['ANULADO'] == 0 && $anulado == 1){

        $anulado_action = 1;
        break;
      }
    }
  }
  
  //STOCK REMOVE
  if($anulado_action == 0 || $anulado_action == -1){

     
    for ($i=0; $i < $prd_count; $i++) {
      $i_product = $fct['products'][$i]['product'];
      $i_stock = floatval($fct['products'][$i]['stock']);

      if($i_product != ""){
        $sql = "UPDATE productos SET
        STOCK = STOCK - '$i_stock'
        WHERE PRODUCTO = '$i_product'";
        $resp = mysqli_query($conexion,$sql);
        
        //LIMIT STOCK ON
        $db_limiton =  mysqli_query($conexion, "SELECT STOCK, STOCK_LIMIT FROM productos WHERE PRODUCTO = '$i_product'");
        while($row = mysqli_fetch_assoc($db_limiton)){
            
            $limit = $row['STOCK'] < $row['STOCK_LIMIT'] ? 1 : 0;
            mysqli_query($conexion, "UPDATE productos SET STOCK_ONLIMIT = $limit WHERE PRODUCTO = '$i_product'");
        }
      }
    }
  }
  
  //ADD STOCK
  if($anulado_action == 0 || $anulado_action == 1){
      
    $db_productos_ventas_last =  mysqli_query($conexion, "SELECT
        ventas_productos.PRODUCTO,
        ventas_productos.CANTIDAD,
	      ventas_productos.UNIDAD,
        productos.ID
    FROM
        ventas_productos
    LEFT JOIN productos ON ventas_productos.PRODUCTO = productos.PRODUCTO
    WHERE
        ventas_productos.NRO LIKE '$nro'");
        
    while($row = mysqli_fetch_assoc($db_productos_ventas_last)){
        
        $pi_id = $row['ID'];
        
        if($pi_id != null){
            
          $pi_stock = $row['UNIDAD'];
          $resp = mysqli_query($conexion, "
          UPDATE productos SET
          STOCK = STOCK + '$pi_stock'
          WHERE ID = '$pi_id'
          ");
          
          //LIMIT STOCK ON
        $db_limiton =  mysqli_query($conexion, "SELECT STOCK, STOCK_LIMIT FROM productos WHERE ID = '$pi_id'");
        while($row1 = mysqli_fetch_assoc($db_limiton)){
            
            $limit = $row1['STOCK'] < $row1['STOCK_LIMIT'] ? 1 : 0;
            mysqli_query($conexion, "UPDATE productos SET STOCK_ONLIMIT = $limit WHERE ID = '$pi_id'");
        }
        
        
        }
    }
      
      
    //for ($i=0; $i < $prd_count; $i++) {
      //$i_product = $fct['products'][$i]['product'];
      //$i_stock = floatval($fct['products'][$i]['stock']);

      //if($i_product != ""){
        //$sql = "UPDATE productos SET
        //STOCK = STOCK + '$i_stock'
        //WHERE PRODUCTO = '$i_product'";
        //$resp = mysqli_query($conexion,$sql);
      //}
    //}

  }
  
  //VENTAS PRODUCTS -> DELETE
  $resp = mysqli_query($conexion , "DELETE FROM ventas_productos WHERE NRO LIKE '$nro'");
  
  //VENTAS PRODUCTS -> ADD
  for ($i=0; $i < $prd_count; $i++) {

    $i_info = $fct['products'][$i]['info'];
    $i_id = $fct['products'][$i]['id'];
    $i_product = $fct['products'][$i]['product'];
    $i_count = $fct['products'][$i]['count'];
    $i_price = $fct['products'][$i]['price'];
    $i_stock = $fct['products'][$i]['stock'];
    $i_iter = $fct['products'][$i]['iter'];

    if($i_product !=""){
      $sql = "INSERT INTO `ventas_productos` (`NRO`, `LINE`, `INFO`, `PRODUCTO`, `PRODUCTO_ID`, `PRECIO`, `CANTIDAD`, `UNIDAD`,`ITERACTION`)
      VALUES ('$nro' , '$i', '$i_info', '$i_product','$i_id', '$i_price', '$i_count', '$i_stock' , '$i_iter')";
      $resp = mysqli_query($conexion,$sql);
    }
  }

  //VENTAS UPDATE
  $sql = "UPDATE `ventas` SET
  `DATE` ='$date',
  CONFIRM = '$confirm',
  NAME ='$cliente_id',
  TOTAL ='$total',
  DELIVERY ='$delivery',
  CANCELADO = '$cancelado',
  CAJERO = '$cajero',
  ENTREGADO ='$entregado',
  RECOGE ='$recoge',
  METODO ='$metodo',
  COMMENT = '$comment',
  DOCUMENT = '$documento',
  ANULADO = '$anulado',
  ARMADO = '$armado',
  TRABAJADOR = '$trabajador_delivery',
  DELIVERY_GRATIS = '$deliv_free'
  WHERE NRO = '$nro'";
  $resp = mysqli_query($conexion , $sql);


}else {
  $fct['data']['nro'] = -1;
}

echo json_encode($fct);

 ?>
