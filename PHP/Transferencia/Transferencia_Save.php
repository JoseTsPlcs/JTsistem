<?php

require '../Conection.php';
include 'Transferencia_Action.php';

echo json_encode(Transferencia_Save($conexion, $_POST));

 ?>
