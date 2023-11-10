<?php

require '../Conection.php';
include 'Zone_Action.php';

$info = array(
  'zone' => isset($_POST['zone']) ?  $_POST['zone'] : "",
  'macro_id' => isset($_POST['macro_id']) ?  $_POST['macro_id'] : 0,
  'delivery' => isset($_POST['delivery']) ?  $_POST['delivery'] : 0,
  'activo' => isset($_POST['activo']) ?  $_POST['activo'] : 1
);

echo json_encode(Zone_Add($conexion, $info));

 ?>
