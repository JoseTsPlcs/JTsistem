<?php

require 'Format_Mysql.php';

$send = array();
while ($row = mysqli_fetch_assoc($resp)) {

  array_push($send, $row);
}


echo json_encode($send);


 ?>
