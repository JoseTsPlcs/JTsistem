<?php

session_start();

$user_id = $_POST['user_id'];
$_SESSION['user_id'] = $user_id;
$_SESSION['LAST_ACTIVITY'] = time();

echo json_encode($user_id);

 ?>
