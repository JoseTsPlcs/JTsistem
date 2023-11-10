<?php

require '../Conection.php';

$filter = isset($_POST['filter']) ? $_POST['filter'] : "";

$send = array(
  'success' => false,
  'msg' => '',
  'data' => array()
);

$data_sql = "SELECT * FROM `macro` WHERE MACRO LIKE '%$filter%'";
$data_resp = mysqli_query($conexion, $data_sql);

while ($row = mysqli_fetch_assoc($data_resp)) {

  $line = array(
    'id' => $row['ID'],
    'macro' => $row['MACRO']
  );
  array_push($send['data'] , $line);
}

$send['success'] = true;
$send['msg'] = "Macros cargado correctamente";

echo json_encode($send);
 ?>
