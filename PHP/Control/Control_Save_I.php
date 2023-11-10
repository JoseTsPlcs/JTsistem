<?php

require '../Conection.php';

$resp = array(
  'success' => false,
  'msg' => "",
  'saved' => null
);

function Update_Post($conexion, $nro, $pst, $db)
{
  if(isset($_POST[$pst])){

    $save = $_POST[$pst];
    $save_sql = "UPDATE `ventas` SET $db = '$save' WHERE NRO = '$nro'";
    $save_resp = mysqli_query($conexion , $save_sql);
  }

}

//UPDATE VENTA
$nro = $_POST['nro'];

if(isset($_POST['nro'])){

  Update_Post($conexion, $nro, 'entregado', "ENTREGADO");
  Update_Post($conexion, $nro, 'cancelado', "CANCELADO");

  Update_Post($conexion, $nro, 'time_a', "TIME_A");
  Update_Post($conexion, $nro, 'time_b', "TIME_B");

  Update_Post($conexion, $nro, 'metodo', "METODO");
  Update_Post($conexion, $nro, 'trabajador', "TRABAJADOR");

  Update_Post($conexion, $nro, '', "");
  Update_Post($conexion, $nro, '', "");


  $metodo_i = Post_Ready('metodo', "Efectivo");
  $user_i = Post_Ready('user', -1);
  $comment_i = Post_Ready('comment', "");

  $time_a = Post_Ready('time_a', "00:00:00");
  $time_b = $times_b[$i];

  //$user_i = -1;
  $cancelado_i = $cancelado[$i];
  $entregado_i = $entregado[$i];

  $sql = "UPDATE `ventas` SET
  ENTREGADO ='$entregado_i',
  CANCELADO ='$cancelado_i',
  TIME_A ='$time_a',
  TIME_B ='$time_b',
  METODO ='$metodo_i',
  TRABAJADOR ='$user_i',
  COMMENT = '$comment_i'
  WHERE NRO = '$nro_i'";
  $resp = mysqli_query($conexion , $sql);

  $name = strtoupper($names[$i]);
  $metodo = $metodo_i;

  //include '../Clientes/Cliente_Update.php';


  $resp['success'] = true;
  $resp['msg'] = "se ha guardado control " + $nro_i;
}else {

  $resp['success'] = false;
  $resp['msg'] = "se necesita id para guardar control";
}

echo json_encode($resp);

 ?>
