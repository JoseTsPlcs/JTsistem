<?php

require '../Conection.php';

$send = array(
  'success' => true,
  'msg' => "zones cargado correctamente",
  'data' => array()
);

$filter = isset($_POST['filter']) ? $_POST['filter'] : "";

$data_sql = "SELECT z.ID AS ZONE_ID, z.ZONE, z.MACRO  AS MACRO_ID, z.ACTIVO, z.DELIVERY,
m.ID, m.MACRO
FROM zonas z
LEFT JOIN macro m ON m.ID = z.MACRO
WHERE ZONE LIKE '%$filter%' OR m.MACRO LIKE '%$filter%'";
$data_resp = mysqli_query($conexion,$data_sql);

while ($row = mysqli_fetch_assoc($data_resp)) {

  $line = array(
    'id' => $row['ZONE_ID'],
    'zone' => $row['ZONE'],
    'macro_id' => $row['MACRO_ID'],
    'macro' => $row['MACRO'],
    'delivery' => $row['DELIVERY'],
    'activo' => $row['ACTIVO']
  );
  array_push($send['data'] , $line);
}

echo json_encode($send);

 ?>
