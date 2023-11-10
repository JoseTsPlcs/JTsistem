<?php

require '../Conection.php';
include 'Zone_Action.php';

echo json_encode(Zone_Search($conexion, array(
  'info' => isset($_POST['id']) ? $_POST['id'] : -1;
)));

 ?>
