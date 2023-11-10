<?php

require '../Conection.php';
include 'Cliente_Action.php';

echo json_encode(Cliente_Save($conexion, $_POST['send']));
 ?>
