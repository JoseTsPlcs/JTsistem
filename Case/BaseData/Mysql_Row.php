<?php

require 'Mysql_Conection.php';

$send = array();
while ($row = mysqli_fetch_assoc($consult)) {

  array_push($send, $row);
}
$resp['send'] = $send;


echo json_encode($resp);

 ?>
