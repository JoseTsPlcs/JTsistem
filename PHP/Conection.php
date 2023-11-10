<?php

$servidor = 'localhost';
$usuario = 'QHALIKAY2020';
$pass = 'QKESLOMAXIMO';
$baseDatos ='qk';

$conexion = new mysqli($servidor,$usuario,$pass,$baseDatos);


if(!$conexion){
  echo "Error Conexion";
}
else {
  //echo "todo ok";
}


 ?>
