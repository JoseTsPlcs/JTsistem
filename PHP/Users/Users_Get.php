<?php

include 'Users_base.php';

$user = $_POST['user'];

$sql = "SELECT `ID` , `USER` FROM `usuarios` WHERE USER LIKE '%$user%'";
$db_users =  mysqli_query($conexion, $sql);
while($row = mysqli_fetch_assoc($db_users)){
  array_push($users['id'],$row['ID']);
  array_push($users['user'],$row['USER']);
}

echo json_encode($users);

 ?>
