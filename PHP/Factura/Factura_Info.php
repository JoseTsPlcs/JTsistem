<?php
include '../Conection.php';

$info = array(
  'count' => 0,
  'clientes' => array(
    'name' => array(),
    'zone' => array(),
    'dir' => array(),
    'ref' => array(),
    'cel' => array(),
    'gps' => array()
   ),
  'product' => array(
      'product' => array(),
      '100g' => array(),
      '250g' => array(),
      '500g' => array(),
      '1kg' => array(),
      'one' => array(),
      'stock' => array()
   )
);

$info['count'] =  mysqli_num_rows(mysqli_query($conexion,"SELECT * FROM ventas"));

/*$db_clientes =  mysqli_query($conexion,"SELECT * FROM clientes");
while($row = mysqli_fetch_assoc($db_clientes)){
  array_push($info['clientes']['name'],$row['NAME']);
  array_push($info['clientes']['zone'],$row['ZONE']);
  array_push($info['clientes']['dir'],$row['DIR']);
  array_push($info['clientes']['ref'],$row['REF']);
  array_push($info['clientes']['cel'],$row['CEL']);
  array_push($info['clientes']['gps'],$row['GPS']);
}*/

$db_productos =  mysqli_query($conexion,"SELECT * FROM productos");
while($row = mysqli_fetch_assoc($db_productos)){
  array_push($info['product']['product'],$row['PRODUCTO']);
  array_push($info['product']['100g'],$row['100g']);
  array_push($info['product']['250g'],$row['250g']);
  array_push($info['product']['500g'],$row['500g']);
  array_push($info['product']['1kg'],$row['1000g']);
  array_push($info['product']['one'],$row['ONE']);
  array_push($info['product']['stock'],$row['STOCK']);
}

echo json_encode($info);

 ?>
