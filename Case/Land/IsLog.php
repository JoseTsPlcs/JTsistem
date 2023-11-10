<?php

session_start();

$user_id = null;

$user_id = $_SESSION['user_id'];


echo json_encode($user_id);

 ?>
