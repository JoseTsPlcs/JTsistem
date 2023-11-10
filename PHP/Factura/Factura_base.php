<?php

include '../Conection.php';

$fct = array(
  'data' => $_POST['data'],
  'cliente' => $_POST['cliente'],
  'pay' => $_POST['pay'],
  'products' =>  $_POST['products'],
  'delivery' => $_POST['delivery'],
  'armado' => $_POST['armado'],
  'anulado' => $_POST['anulado']
);

//dates

$confirm = $fct['data']['confirm'];
$uss = $fct['data']['uss'];
$date = $fct['data']['date'];
//$time_a = $fct['data']['time_a'];
//$time_b = $fct['data']['time_b'];
$nro = $fct['data']['nro'];
$deliv_free = $fct['data']['deliv_free'];
$descuento = $fct['data']['descuento'];

$recoge = $fct['cliente']['recoge'];

$cliente_id = $fct['cliente']['cliente_id'];
$name = $fct['cliente']['name'];
$dni = $fct['cliente']['dni'];
$cel = $fct['cliente']['cel'];

$trabajador_delivery = $fct['cliente']['trabajador_delivery'];
$zone_id = $fct['cliente']['zone_id'];
$zone = $fct['cliente']['zone'];
$dir = $fct['cliente']['dir'];
$ref = $fct['cliente']['ref'];
$gps = $fct['cliente']['gps'];

$comment = $fct['pay']['comment'];
$metodo = $fct['pay']['metodo'];
$documento = $fct['pay']['documento'];
$cancelado = $fct['pay']['cancelado'];
$entregado = $fct['pay']['entregado'];
$cajero = $fct['pay']['cajero'];

$armado = $fct['armado'];
$armado = $entregado == 1 ? 1 : $armado;

$anulado = $fct['anulado'];

$delivery = $fct['delivery'];
$total = $delivery;

//calculate total

$prd_count = count($fct['products']);

for ($i=0; $i < $prd_count; $i++) {
  $total += $fct['products'][$i]['count'] * $fct['products'][$i]['price'];
}

$total = $total * (1-$descuento/100);


/*$fct['nro'] = $_GET['nro'];
$fct['date'] = $_GET['date'];

$fct['name'] = $_GET['name'];
$fct['dir'] = $_GET['dir'];
$fct['zone'] = $_GET['zone'];
$fct['ref'] = $_GET['ref'];

$fct['total'] = $_GET['total'];*/


//echo json_encode('ok');


 ?>
