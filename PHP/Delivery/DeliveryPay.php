<?php

include '../Conection.php';

$nro = $_POST['nro'];

$info = array(
  'name' => '',
  'cel' => '',

  'recoge' => 0,
  'zone' => '',
  'dir' => '',
  'ref' => '',
  'gps' => '',

  'comment' => '',
  'total' => 0,
  'metodo' => '',
  'entregado' => 0,
  'cancelado' => ''
);

$sql = "SELECT v.NAME, v.METODO, v.TOTAL, v.CANCELADO, v.ENTREGADO, v.RECOGE, v.COMMENT,
c.ID, c.NAME AS CLIENTE_NAME, c.DIR, c.REF, c.CEL, c.GPS,
z.ID, z.ZONE AS ZONE_NAME
FROM ventas v
LEFT JOIN clientes c ON v.NAME = c.ID
LEFT JOIN zonas z ON c.ZONE = z.ID
WHERE v.NRO LIKE '$nro'";

$db = mysqli_query($conexion,$sql);
while($row = mysqli_fetch_assoc($db)){
  $info['name'] = $row['CLIENTE_NAME'];

  $info['metodo'] = $row['METODO'];
  $info['total'] = $row['TOTAL'];
  $info['cancelado'] = $row['CANCELADO'];
  $info['entregado'] = $row['ENTREGADO'];
  $info['recoge'] = $row['RECOGE'];
  $info['comment'] = $row['COMMENT'];

  $info['zone'] = $row['ZONE_NAME'];
  $info['dir'] = $row['DIR'];
  $info['ref'] = $row['REF'];
  $info['cel'] = $row['CEL'];
  $info['gps'] = $row['GPS'];
}

echo json_encode($info);

?>
