<?php

require '../Conection.php';
include 'Cliente_Action.php';


echo json_encode(Cliente_Add($conexion, isset($_POST['send']) ? $_POST['send'] : null));
//echo json_encode(array('success' => false, 'msg' => "pos te envio esto"));

 ?>
