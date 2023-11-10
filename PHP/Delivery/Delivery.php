<?php

include '../Conection.php';

$recoge = $_POST['recoge'];
$dateA = $_POST['dateA'];
$filter =  $_POST['filter'];
$f_cancelado = $filter;

if($filter == "entregado"){
  $f_cancelado = 1;
}
if($filter == "pendiente"){
  $f_cancelado = 0;
}

$delivery = array(
  'nro' => array(),
  'name' => array(),

  'time_b' => array(),

  'cel' => array(),
  'zone' => array(),
  'macro' => array(),

  'armado' => array(),
  'entregado' => array(),

  'cancelado' => array(),
  'metodo' => array(),
  'total' => array(),
  'comment' => array(),

  'trabajador' =>array(),
  'delivery' => array(),
  'gps' => array()
);

$sql = "SELECT v.COMMENT, v.TIME_B, v.NRO , v.DATE, v.NAME , v.ENTREGADO , v.RECOGE, v.DELIVERY, v.TRABAJADOR, v.ANULADO, v.ARMADO, v.CANCELADO, v.METODO, v.TOTAL, v.CONFIRM,
  c.ID,c.NAME AS CLIENTE_NAME , c.ZONE, c.GPS, c.CEL,
  z.ID,z.ZONE AS ZONE_NAME,
  m.ID, m.MACRO AS MACRO_NAME,
  u.ID, u.USER
  FROM ventas v
  LEFT JOIN clientes c ON v.NAME = c.ID
  LEFT JOIN zonas z ON c.ZONE = z.ID
  LEFT JOIN usuarios u ON v.TRABAJADOR = u.ID
  LEFT JOIN macro m ON z.MACRO = m.ID
  WHERE v.ANULADO LIKE '0' AND v.CONFIRM LIKE '1' AND v.DATE LIKE '$dateA' AND v.RECOGE LIKE $recoge AND
  ( u.USER LIKE '%$filter%' OR
    v.NRO LIKE '%$filter%' OR
    c.NAME LIKE '%$filter%' OR
    z.ZONE LIKE '%$filter%' OR
   v.ENTREGADO LIKE '%$f_cancelado%'
 ) ORDER BY v.TIME_B, v.ENTREGADO, v.ARMADO, m.MACRO DESC";

$db = mysqli_query($conexion,$sql);

while($row = mysqli_fetch_assoc($db)){

    array_push($delivery['nro'],$row['NRO']);

    array_push($delivery['time_b'],$row['TIME_B']);

    array_push($delivery['name'],$row['CLIENTE_NAME']);
    array_push($delivery['cel'],$row['CEL']);
    array_push($delivery['zone'],$row['ZONE_NAME']);
    array_push($delivery['macro'],$row['MACRO_NAME']);

    array_push($delivery['armado'],$row['ARMADO']);
    array_push($delivery['entregado'],$row['ENTREGADO']);

    array_push($delivery['cancelado'],$row['CANCELADO']);
    array_push($delivery['metodo'],$row['METODO']);
    array_push($delivery['total'],$row['TOTAL']);
    array_push($delivery['comment'],$row['COMMENT']);

    array_push($delivery['trabajador'],$row['USER']);
    array_push($delivery['delivery'],$row['DELIVERY']);

    array_push($delivery['gps'],$row['GPS']);
}


echo json_encode($delivery);

 ?>
