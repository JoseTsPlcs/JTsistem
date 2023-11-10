<?php

require '../Conection.php';

$send = array(
  'success' => true,
  'info' => array()
);

$info_sql = "SELECT * FROM macro";

$info_resp = mysqli_query($conexion,$info_sql);
while ($row = mysqli_fetch_assoc($info_resp)) {

  $line = array(
    'id' => $row['ID'],
    'macro' => $row['MACRO']
  );
  array_push($send['info'] , $line);
}

echo json_encode($send);
 ?>
