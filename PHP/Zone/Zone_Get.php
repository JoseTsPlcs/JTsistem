<?php

include 'Zone_base.php';

$zone = $_POST['zone'];

if($zone != ""){
  $db_zones =  mysqli_query($conexion,"SELECT * FROM zonas WHERE ZONE LIKE '$zone%'");
  while($row = mysqli_fetch_assoc($db_zones)){
    array_push($zones['id'],$row['ID']);
    array_push($zones['zones'],$row['ZONE']);
    array_push($zones['delivs'],$row['DELIVERY']);
  }
}

echo json_encode($zones);

 ?>
