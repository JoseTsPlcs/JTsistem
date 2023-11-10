<?php

require '../Conection.php';
include 'Macro_Action.php';

$info = array(
  'macro' => $_POST['macro']
);

echo json_encode(Macro_Add($conexion, $info));

 ?>
