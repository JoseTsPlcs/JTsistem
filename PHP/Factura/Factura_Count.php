<?php

include '../Conection.php';

echo json_encode(mysqli_num_rows(mysqli_query($conexion,"SELECT * FROM ventas")));

 ?>
