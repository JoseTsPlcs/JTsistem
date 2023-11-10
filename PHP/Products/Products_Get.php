<?php

include 'Conection.php';

$product = $_POST['product'];

$products = array(
  'product' => array(),
  '100g' => array(),
  '250g' => array(),
  '500g' => array(),
  '1kg' => array(),
  'one' => array(),
  'stock' => array()
);

$db_productos =  mysqli_query($conexion,"SELECT * FROM productos WHERE '$product' ");
  while($row = mysqli_fetch_assoc($db_productos)){
    array_push($products['product'],$row['PRODUCTO']);
    array_push($products['100g'],$row['100g']);
    array_push($products['250g'],$row['250g']);
    array_push($products['500g'],$row['500g']);
    array_push($products['1kg'],$row['1000g']);
    array_push($products['one'],$row['ONE']);
    array_push($products['stock'],$row['STOCK']);
  }
  
echo json_encode($products);


 ?>
