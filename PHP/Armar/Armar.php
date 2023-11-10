<?php

include '../Conection.php';

$dateA = $_POST['dateA'];
$filter = $_POST['filter'];
$armar = array();

$sql = "SELECT v.CONFIRM, v.COMMENT, v.ARMADO, v.RECOGE, v.NRO , v.DATE, v.NAME,v.ANULADO, v.ENTREGADO,v.DELIVERY,v.TOTAL,v.METODO,v.CANCELADO,
  c.ID, c.NAME AS CLIENTE_NAME , c.ZONE,
  z.ID , z.ZONE AS ZONE_NAME
  FROM ventas v
  LEFT JOIN clientes c ON v.NAME = c.ID
  LEFT JOIN zonas z ON c.ZONE = z.ID
  WHERE v.ANULADO LIKE '0' AND v.DATE LIKE '$dateA' AND v.ENTREGADO LIKE 0 AND
  ( v.NRO LIKE '%$filter%' OR
    c.NAME LIKE '%$filter%' OR
    z.ZONE LIKE '%$filter%'
 ) ORDER BY v.ARMADO";

$db = mysqli_query($conexion,$sql);
while($row = mysqli_fetch_assoc($db)){
  $nro = $row['NRO'];
  $fct = array(
    'nro' => $nro,
    'name' => $row['CLIENTE_NAME'],
    'confirm' => $row['CONFIRM'],
    //'time_a' => $row['TIME_A'],
    //'time_b' => $row['TIME_B'],
    'zone' => $row['ZONE_NAME'],
    'delivery' => $row['DELIVERY'],
    'total' => $row['TOTAL'],
    'recoge' => $row['RECOGE'],
    'armado'=> $row['ARMADO'],
    'comment'=> $row['COMMENT'],
    'metodo'=> $row['METODO'],
    'cancelado'=> $row['CANCELADO'],
    'products' => array()
  );

  $db_ventas_productos =  mysqli_query($conexion,"SELECT * FROM ventas_productos WHERE NRO = '$nro'");
  while($row2 = mysqli_fetch_assoc($db_ventas_productos)){
    $product = array(
      'product' => $row2['PRODUCTO'],
      'info' => $row2['INFO'],
      'count' => $row2['CANTIDAD'],
      'price' => $row2['PRECIO'],
      'iter' => $row2['ITERACTION'],
      'strike' => $row2['STRIKE']
    );
    array_push($fct['products'] , $product);
  }

  array_push($armar , $fct);
}

echo json_encode($armar);

 ?>
