<?php

include '../Base_Resp.php';
require '../Conection.php';

$resp['nro'] = mysqli_num_rows(mysqli_query($conexion,"SELECT ID FROM transferencias")) + 1;

$resp['success'] = true;
$resp['msg'] = "nro nuevo de transferencias: ".$resp['nro'];

echo json_encode($resp);
 ?>
