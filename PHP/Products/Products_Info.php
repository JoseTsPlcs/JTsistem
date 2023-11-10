<?php

include '../Conection.php';

$products = array(
  'id'=> array(),
  'product' => array(),
  '100g' => array(),
  '250g' => array(),
  '500g' => array(),
  '1kg' => array(),
  '1kg>' => array(),
  '5kg>' => array(),
  'one' => array(),
  'stock' => array(),
  'unidad' => array(),
);


header("Content-Type: text/html;charset=utf-8"); 
//mysql_query("SET NAMES 'utf8'");

$sql = "SELECT ID, 100g, 250g, 500g, 1000g, 1000gM, 5000g, ONE, STOCK, UNIDAD_ID, PRODUCTO FROM productos WHERE ACTIVO = 1 AND MOSTRAR = 1";
$db_productos =  mysqli_query($conexion,$sql);
while($row = mysqli_fetch_assoc($db_productos)){
  array_push($products['id'],$row['ID']);
  array_push($products['product'],$row['PRODUCTO']);
  array_push($products['100g'],$row['100g']);
  array_push($products['250g'],$row['250g']);
  array_push($products['500g'],$row['500g']);
  array_push($products['1kg'],$row['1000g']);
  array_push($products['1kg>'],$row['1000gM']);
  array_push($products['5kg>'],$row['5000g']);
  array_push($products['one'],$row['ONE']);
  array_push($products['stock'],$row['STOCK']);
  array_push($products['unidad'],$row['UNIDAD_ID']);
}

echo json_encode($products);
