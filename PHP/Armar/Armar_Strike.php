<?php
include '../Conection.php';

$nro = $_POST['nro'];
$line = $_POST['line'];
$strike = $_POST['strike'];

$update = "UPDATE `ventas_productos` SET `STRIKE`= '$strike' WHERE `NRO` = '$nro' AND `LINE` = '$line'";
$update_cnx = mysqli_query($conexion,$update);


echo json_encode("Ok");



 ?>
