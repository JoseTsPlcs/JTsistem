<?php

include 'Control_Base.php';

$dateA = $_POST['dateA'];
$dateB = $_POST['dateB'];
$filter =  $_POST['filter'];

//TAGS
$tags = explode(" ", strtolower($filter));

$f_pg_0 = 0;
$f_pg_1 = 1;
if(array_search("pagado_0", $tags) > -1){
  $f_pg_0 = 0;
  $f_pg_1 = 0;
  $filter = "";
}
if(array_search("pagado_1", $tags) > -1){
  $f_pg_0 = 1;
  $f_pg_1 = 1;
  $filter = "";
}

$dlv = 0;
$rcg = 1;
if(array_search("despacho_1", $tags) > -1){
  $dlv = 1;
  $rcg = 1;
  $filter = "";
}
if(array_search("despacho_0", $tags) > -1){
  $dlv = 0;
  $rcg = 0;
  $filter = "";
}

$f_enter_0 = 0;
$f_enter_1 = 1;
if(array_search("entregado_1", $tags) > -1){
  $f_enter_0 = 1;
  $f_enter_1 = 1;
  $filter = "";
}
if(array_search("entregado_0", $tags) > -1){
  $f_enter_0 = 0;
  $f_enter_1 = 0;
  $filter = "";
}

$f_anulado_0 = 0;
$f_anulado_1 = 1;
if(array_search("anulado_1", $tags) > -1){
  $f_anulado_0 = 1;
  $f_anulado_1 = 1;
  $filter = "";
}
if(array_search("anulado_0", $tags) > -1){
  $f_anulado_0 = 0;
  $f_anulado_1 = 0;
  $filter = "";
}

$f_armado_0 = 0;
$f_armado_1 = 1;
if(array_search("armado_1", $tags) > -1){
  $f_armado_0 = 1;
  $f_armado_1 = 1;
  $filter = "";
}
if(array_search("armado_0", $tags) > -1){
  $f_armado_0 = 0;
  $f_armado_1 = 0;
  $filter = "";
}

$order_tim_max = false;
if(array_search("order_time", $tags) > -1){
  $order_tim_max = true;
  $filter = "";
}

$f_trabajador = "";
for ($i=0; $i < count($tags); $i++) {
  if(strpos($tags[$i], "delivery_") !== false){
    $f_trabajador = str_replace("trabajador_", "", $tags[$i]);
    //$f_trabajador = "alonso";
    $f_trabajador = mb_strtoupper($f_trabajador);
    $filter = "";
    break;
  }
}

$f_metodo = "";
for ($i=0; $i < count($tags); $i++) {
  if(strpos($tags[$i], "metodo_") !== false){
    $f_metodo = str_replace("metodo_", "", $tags[$i]);
    //$f_trabajador = "alonso";
    $f_metodo = mb_strtolower($f_metodo);
    $filter = "";
    break;
  }
}

$f_macro = "";
for ($i=0; $i < count($tags); $i++) {
  if(strpos($tags[$i], "macro_") !== false){
    $f_macro = str_replace("macro_", "", $tags[$i]);
    //$f_trabajador = "alonso";
    $f_macro = mb_strtolower($f_macro);
    $filter = "";
    break;
  }
}


$sql = "SELECT v.NRO, v.CONFIRM, v.TIME_A, v.TIME_B , v.NAME , v.CANCELADO, v.CAJERO , v.ENTREGADO, v.METODO, v.TOTAL,v.ANULADO,v.RECOGE,v.ARMADO,v.TRABAJADOR,v.DATE,v.COMMENT,v.DELIVERY,
  c.ID, c.NAME AS CLIENTE_NAME, c.ZONE,
  u.USER, u.ID,
  z.ZONE AS ZONE_NAME, z.MACRO,
  m.ID, m.MACRO AS MACRO_NAME
  FROM ventas v
  LEFT JOIN clientes c ON v.NAME = c.ID
  LEFT JOIN usuarios u ON v.TRABAJADOR = u.ID
  LEFT JOIN zonas z ON c.ZONE = z.ID
  LEFT JOIN macro m ON z.MACRO = m.ID
  WHERE
  v.DATE >= '$dateA' AND  v.DATE <='$dateB'
  AND (v.ANULADO = '$f_anulado_0' OR v.ANULADO = '$f_anulado_1')
  AND (v.CANCELADO = '$f_pg_0' OR v.CANCELADO = '$f_pg_1')
  AND (v.ENTREGADO = '$f_enter_0' OR v.ENTREGADO = '$f_enter_1')
  AND (v.RECOGE = '$rcg' OR v.RECOGE = '$dlv')
  AND (v.ARMADO = '$f_armado_0' OR v.ARMADO = '$f_armado_1')
  AND (u.USER LIKE '%$f_trabajador%' ".($f_trabajador == "" ? "OR u.USER IS NULL" : "").")
  AND (v.METODO LIKE '%$f_metodo%' ".($f_metodo == "" ? "OR v.METODO IS NULL" : "").")
  AND (m.MACRO LIKE '%$f_macro%'".($f_macro == "" ? "OR m.MACRO IS NULL" : "").")
  AND (v.NRO LIKE '%$filter%' OR c.NAME LIKE '%$filter%')"
  .($order_tim_max ? "ORDER BY v.TIME_B" : "");

$db_ventas =  mysqli_query($conexion,$sql);
while($row = mysqli_fetch_assoc($db_ventas)){

  array_push($report['nro'],$row['NRO']);
  array_push($report['date'],$row['DATE']);
  array_push($report['name'],$row['CLIENTE_NAME']);
  array_push($report['comment'],$row['COMMENT']);
  array_push($report['confirm'],$row['CONFIRM']);
  array_push($report['time_a'],$row['TIME_A']);
  array_push($report['time_b'],$row['TIME_B']);

  array_push($report['cancelado'],$row['CANCELADO']);
  array_push($report['cajero'],$row['CAJERO']);
  array_push($report['entregado'],$row['ENTREGADO']);
  array_push($report['recoge'],$row['RECOGE']);
  array_push($report['delivery'],$row['DELIVERY']);

  array_push($report['armado'],$row['ARMADO']);
  array_push($report['metodo'],$row['METODO']);
  array_push($report['total'],$row['TOTAL']);

  array_push($report['anulado'],$row['ANULADO']);

  array_push($report['trabajador'],$row['TRABAJADOR']);
  array_push($report['zone'],$row['ZONE_NAME']);
  array_push($report['macro'],$row['MACRO_NAME']);
}


echo json_encode($report);

 ?>
