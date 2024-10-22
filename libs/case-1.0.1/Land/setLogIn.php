<?php

session_start();

$_SESSION['userData'] = $_POST['userData'];
$_SESSION['LAST_ACTIVITY'] = time();

echo json_encode($user_id);

 ?>
