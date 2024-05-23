<?php

session_start();

$userData = $_SESSION['userData'];


echo json_encode($userData);

 ?>
