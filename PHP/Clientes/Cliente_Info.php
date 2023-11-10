<?php

include 'Cliente_base.php';

$db_clientes =  mysqli_query($conexion,"SELECT * FROM clientes");
while($row = mysqli_fetch_assoc($db_clientes)){
  array_push($clientes['name'],$row['NAME']);
  array_push($clientes['zone'],$row['ZONE']);
  array_push($clientes['dir'],$row['DIR']);
  array_push($clientes['ref'],$row['REF']);
  array_push($clientes['cel'],$row['CEL']);
  array_push($clientes['gps'],$row['GPS']);
}

echo json_encode($clientes);


 ?>
