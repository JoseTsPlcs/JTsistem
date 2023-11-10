<?php

include 'Factura_base.php';

$sql = "SELECT v.NRO, v.CONFIRM, v.DATE, v.NAME, v.RECOGE, v.COMMENT, v.ARMADO, v.METODO, v.TRABAJADOR, v.CANCELADO,v.CAJERO, v.ENTREGADO, v.DOCUMENT, v.DELIVERY,v.ANULADO,v.DELIVERY_GRATIS,v.DESCUENTO,
c.ID, c.NAME AS CLIENTE_NAME
FROM ventas v
LEFT JOIN clientes c ON v.NAME = c.ID
WHERE v.NRO LIKE '$nro'";

$db_ventas =  mysqli_query($conexion,$sql);

if(mysqli_num_rows($db_ventas) > 0){

  //GET INFO OF VENTAS
  while($row = mysqli_fetch_assoc($db_ventas)){
    $fct['data']['nro'] = $row['NRO'];
    $fct['data']['confirm'] = $row['CONFIRM'];
    $fct['data']['date'] = $row['DATE'];
    $fct['data']['deliv_free'] = $row['DELIVERY_GRATIS'];
    $fct['data']['descuento'] = $row['DESCUENTO'];

    $fct['cliente']['name'] = $row['CLIENTE_NAME'];
    $fct['cliente']['recoge'] = $row['RECOGE'];

    $fct['cliente']['trabajador_delivery'] = $row['TRABAJADOR'];

    $fct['pay']['comment'] = $row['COMMENT'];
    $fct['pay']['metodo'] = $row['METODO'];
    $fct['pay']['cancelado'] = $row['CANCELADO'];
    $fct['pay']['entregado'] = $row['ENTREGADO'];
    $fct['pay']['documento'] = $row['DOCUMENT'];
    $fct['pay']['cajero'] = $row['CAJERO'];

    $fct['armado'] = $row['ARMADO'];
    $fct['anulado'] = $row['ANULADO'];

    $fct['delivery'] = $row['DELIVERY'];
  }

  //GET INFO OF PRODUCTOS
  $db_ventas_productos =  mysqli_query($conexion,"SELECT * FROM ventas_productos WHERE NRO LIKE '$nro'");
  $fct['products'] = array();
  while($row = mysqli_fetch_assoc($db_ventas_productos)){
    $prd = array(
      'info' => $row['INFO'],
      'id' => $row['PRODUCTO_ID'],
      'product' => $row['PRODUCTO'],
      'count' => $row['CANTIDAD'],
      'price' => $row['PRECIO'],
      'stock' => $row['UNIDAD'],
      'iter' => $row['ITERACTION']
    );
    array_push($fct['products'], $prd);
  }

}else {
  $fct['data']['nro'] = -1;
}

echo json_encode($fct);

 ?>
