<?php

require '../Conection.php';
include 'Transferencia_Action.php';

echo json_encode(Transferencia_Add($conexion, $_POST));

 ?>
