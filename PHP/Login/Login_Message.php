<?php
include '../Conection.php';

$user = $_POST['user'];
$password = $_POST['password'];
$message = false;

$db_usuarios =  mysqli_query($conexion,"SELECT * FROM usuarios WHERE USER = '$user' ");
if(mysqli_num_rows($db_usuarios) > 0){
  $message = true;
}else {
  $message = false;
}

echo json_encode($message);

 ?>
