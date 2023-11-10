<?php

require 'Caja_Base.php';

$date = $_POST['date'];
$description =  $_POST['decription'];
$ingreso =  $_POST['ingreso'];


$id = mysqli_num_rows(mysqli_query($conexion,"SELECT ID FROM caja_chica")) + 1;

$sql = "INSERT INTO `ventas` (`ID`, `DATE`, `DESCRIPCION`, `INGRESO`, `CHECK`)
VALUES ('$id', '$date', '$description', '$ingreso' , '0')";
$resp = mysqli_query($conexion,$sql);

echo json_encode("Added");

 ?>
