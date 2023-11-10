<?php

include '../Conection.php';

$db = array();

$rst =  mysqli_query($conexion,"SELECT PRODUCTO, UNIDAD, STOCK FROM productos");
while($row = mysqli_fetch_assoc($rst)){
  $prd = array(
    'producto' => $row['PRODUCTO'],
    'unidad' => $row['UNIDAD'],
    'stock' => $row['STOCK']
  );
  array_push($db, $prd);
}

echo json_encode($db);
 ?>
