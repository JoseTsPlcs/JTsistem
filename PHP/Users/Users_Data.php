<?php

include 'Users_Base.php';

$sql = "SELECT `ID` , `USER` FROM `usuarios`";
$rst =  mysqli_query($conexion, $sql);
while($row = mysqli_fetch_assoc($rst)){
  array_push($users['id'],$row['ID']);
  array_push($users['user'],$row['USER']);
}

echo json_encode($users);

 ?>
