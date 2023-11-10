<?php

require '../Conection.php';
include 'Zone_Action.php';


$info = array(
  'id' => isset($_POST['id']) ? $_POST['id'] : null,
  'zone' => isset($_POST['zone']) ?  $_POST['zone'] : null,
  'macro_id' => isset($_POST['macro_id']) ?  $_POST['macro_id'] : null,
  'delivery' => isset($_POST['delivery']) ?  $_POST['delivery'] : null,
  'activo' => isset($_POST['activo']) ?  $_POST['activo'] : null
);

echo json_encode(Zone_Save($conexion, $info));

 ?>
