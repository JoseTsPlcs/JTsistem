<?php

require '../Conection.php';

$filter = isset($_POST['filter']) ? $_POST['filter'] : "";

$send = array(
  'success' => false,
  'msg' => '',
  'data' => array()
);

$data_sql = "SELECT c.ID AS CLIENTE_ID, c.ACTIVO, c.NAME, c.DNI, c.DIR, c.ZONE AS ZONE_ID, c.REF, c.CEL, c.GPS, c.METODO, c.RECOGE,
z.ID, z.ZONE
FROM clientes c
LEFT JOIN zonas z ON z.ID = c.ZONE
WHERE NAME LIKE '%$filter%'";
$data_resp = mysqli_query($conexion, $data_sql);

while ($row = mysqli_fetch_assoc($data_resp)) {

  $line = array(
    'id' => $row['CLIENTE_ID'],
    'name' => $row['NAME'],
    'dni' => $row['DNI'],
    'cel' => $row['CEL'],
    'metodo' => $row['METODO'],
    'recoge' => $row['RECOGE'],

    'zone_id' => $row['ZONE_ID'],
    'zone' => $row['ZONE'],
    'dir' => $row['DIR'],
    'ref' => $row['REF'],
    'gps' => $row['GPS']

  );
  array_push($send['data'] , $line);
}

$send['success'] = true;
$send['msg'] = "Clientes cargado correctamente";

echo json_encode($send);


 ?>
