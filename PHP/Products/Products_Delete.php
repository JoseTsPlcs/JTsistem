<?php
include '../Conection.php';

$id = $_POST['id'];

$sql = "DELETE FROM `productos` WHERE ID LIKE '$id'";
$rst =  mysqli_query($conexion,$sql);

echo json_encode("delete");

 ?>
