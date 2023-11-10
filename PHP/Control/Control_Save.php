<?php

include '../Conection.php';

$nro = $_POST['nro'];
$metodos = $_POST['metodo'];
$times_a = $_POST['time_a'];
$times_b = $_POST['time_b'];
$cancelado = $_POST['cancelado'];
$cajero = $_POST['cajero'];
$entregado = $_POST['entregado'];
$names = $_POST['name'];
$comments = $_POST['comment'];
$users = $_POST['users'];

for ($i=0; $i < count($nro); $i++) {

  //UPDATE VENTA
  $nro_i = $nro[$i];
  $metodo_i = $metodos[$i];
  $user_i = $users[$i];
  $comment_i = $comments[$i];

  $time_a = $times_a[$i];
  $time_b = $times_b[$i];

  //$user_i = -1;
  $cajero_i = $cajero[$i];
  $cancelado_i = $cancelado[$i];
  $entregado_i = $entregado[$i];

  $sql = "UPDATE `ventas` SET
  ENTREGADO ='$entregado_i',
  CANCELADO ='$cancelado_i',
  CAJERO ='$cajero_i',
  TIME_A ='$time_a',
  TIME_B ='$time_b',
  METODO ='$metodo_i',
  TRABAJADOR ='$user_i',
  COMMENT = '$comment_i'
  WHERE NRO = '$nro_i'";
  $resp = mysqli_query($conexion , $sql);

  $name = strtoupper($names[$i]);
  $metodo = $metodo_i;

  include '../Clientes/Cliente_Update.php';
}

echo json_encode($users);

 ?>
