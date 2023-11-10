<?php

require '../Conection.php';

$sql = $_POST['sql'];
$resp = mysqli_query($conexion, $sql);

 ?>
