<?php

require '../Conection.php';
include 'Macro_Action.php';

echo json_encode(Macro_Save($conexion, array(
  'id' => $_POST['id'],
  'macro' => $_POST['macro']
)));


 ?>
