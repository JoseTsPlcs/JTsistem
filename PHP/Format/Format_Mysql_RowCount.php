<?php

require 'Format_Mysql.php';

$count = 0;
while ($row = mysqli_fetch_assoc($resp)) {

  $count += 1;
}

echo json_encode($count);

 ?>
