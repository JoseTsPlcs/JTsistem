<?php

$resp = array('resp'=>false, 'msg'=>array(), 'send'=>array());

//get conection to database
$servidor = 'localhost';
$usuario = 'QHALIKAY2020';
$pass = 'QKESLOMAXIMO';
$baseDatos ='qk';

$conexion = new mysqli($servidor,$usuario,$pass,$baseDatos);

if ($conexion->connect_errno) {

  /* Use your preferred error logging method here */
  $resp['resp'] = false;
  array_push($resp['msg'],'Connection error: ' . $conexion->connect_errno);
  return $resp;
}
else
{

  
  $resp['resp'] = true;
  array_push($resp['msg'],'conected');
}

//consult by sql
$sql = $_POST['sql'];
$consult = mysqli_query($conexion, $sql);

if ($consult) {
  
  $resp['resp'] = true;
  array_push($resp['msg'], 'SUCCESS: '.$sql);
}
else
{
  $resp['resp'] = false;
  array_push($resp['msg'],"Error message: %s\n". mysqli_error($conexion));
  return $resp;
}




 ?>
