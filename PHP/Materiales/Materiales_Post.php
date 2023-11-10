<?php

include '../Conection.php';

$material = strtoupper($_POST['material']);
$etiqueta = strtoupper($_POST['etiqueta']);
$unidad = strtoupper($_POST['unidad']);
$almacen1 = isset($_POST['almacen1']) ? $_POST['almacen1'] : 0;

$action = "start";

//echo json_encode($action);

 ?>
