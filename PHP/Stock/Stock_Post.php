<?php

include '../Conection.php';

// ACTION = 0 -> NONE
// ACTION = 1 -> SUCCESS

$action = array(
  'success' => false,
  'msg' => ''
);

$nro = -1;
$date = $_POST['date'];
$products = $_POST['products'];

 ?>
