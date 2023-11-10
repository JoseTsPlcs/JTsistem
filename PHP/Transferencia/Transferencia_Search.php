<?php

require '../Conection.php';
include 'Transferencia_Action.php';

echo json_encode(Transferencia_Search($conexion, $_POST));

 ?>
