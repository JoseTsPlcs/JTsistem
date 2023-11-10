<?php

$cliente_id = -1;
$name = $_POST['name'];
$cel = $_POST['cel'];
$zone_id = -1;
$zone = isset($_POST['zone']) ? $_POST['zone'] : "";
$dir = isset($_POST['dir']) ? $_POST['dir'] : "";
$dni = isset($_POST['dni']) ? $_POST['dni'] : 0;
$ref = isset($_POST['ref']) ? $_POST['ref'] : "";
$gps = isset($_POST['gps']) ? $_POST['gps'] : "";
$metodo = isset($_POST['metodo']) ? $_POST['metodo'] : "Efectivo";
$delivery = isset($_POST['delivery']) ? $_POST['delivery'] : 0;
$recoge = isset($_POST['recoge']) ? $_POST['recoge'] : 0;


//include 'Cliente_base.php';
include 'Cliente_Update.php';

echo json_encode($clientes);

 ?>
