<?php

require '../Conection.php';
include 'Cliente_Action.php';

echo json_encode(Cliente_Search($conexion, $_POST['send']));

 ?>
