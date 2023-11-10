<?php
include '../Conection.php';

$name = $_POST['name'];
$dni = $_POST['dni'];
$zone = $_POST['zone'];
$dir = $_POST['dir'];
$ref = $_POST['ref'];
$cel = $_POST['cel'];
$gps = $_POST['gps'];

include '../Clientes/Cliente_Update.php';


echo json_encode("ok");


 ?>
