<?php

include 'Page_Library.php';


session_start();

if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 60 * 60 * 24)) {
    // last request was more than 30 minutes ago
    session_unset();     // unset $_SESSION variable for the run-time
    session_destroy();   // destroy session data in storage
}
$_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp

$info = array(
  'user' => "",
  'estado' => "ACTIVO",
  'id' => 0,
  'class' => "",
  'pages' => array(),

  'users' => array(
    'id' => array(),
    'user' => array()
  )
);

//secure
if(empty($_SESSION['user'])){
  //header('Location: Login.php');
}else {

  include '../Conection.php';
  $info['user'] = $_SESSION['user'];
  $user = $info['user'];
  $db_usuarios =  mysqli_query($conexion,"SELECT * FROM usuarios WHERE USER LIKE '$user'");
  while($row = mysqli_fetch_assoc($db_usuarios)){
    $info['class'] = $row['CLASS'];
    $info['id'] = $row['ID'];
    $info['estado'] = $row['ACTIVO'];
  }

  $info['pages'] = PagesByClass($info['class']);
}

echo json_encode($info);

//echo json_encode("hola");


 ?>
