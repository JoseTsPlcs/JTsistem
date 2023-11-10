<?php

$servidor = 'localhost';
$usuario = 'QHALIKAY2020';
$pass = 'QKESLOMAXIMO';
$baseDatos ='qk';

$conexion = new mysqli($servidor,$usuario,$pass,$baseDatos);

$products = array(
  'id' => array(),
  'product' => array(),
  '100g' => array(),
  '250g' => array(),
  '500g' => array(),
  '1kg' => array(),
  'one' => array(),
  'stock' => array()
);

echo "<table>";

echo "<thead>";
echo "<tr>";
echo "<th>ID</th>";
echo "<th>PRODUCTO</th>";
echo "<th>100g</th>";
echo "<th>250g</th>";
echo "<th>500g</th>";
echo "<th>1kg</th>";
echo "<th>Unitario</th>";
echo "<th>STOCK</th>";
echo "</tr>";
echo "</thead>";

echo "<tbody>";
$db_productos =  mysqli_query($conexion,"SELECT * FROM productos WHERE ACTIVO = 1");
while($row = mysqli_fetch_assoc($db_productos)){
      
    array_push($products['id'],$row['ID']);
    array_push($products['product'],$row['PRODUCTO']);
    array_push($products['100g'],$row['100g']);
    array_push($products['250g'],$row['250g']);
    array_push($products['500g'],$row['500g']);
    array_push($products['1kg'],$row['1000g']);
    array_push($products['one'],$row['ONE']);
    array_push($products['stock'],$row['STOCK']);
    
    echo"<tr>";
    
        echo"<td>".$row['ID']."</th>";
        echo"<td>".$row['PRODUCTO']."</th>";
        echo"<td>".$row['100g']."</th>";
        echo"<td>".$row['250g']."</th>";
        echo"<td>".$row['500g']."</th>";
        echo"<td>".$row['1000g']."</th>";
        echo"<td>".$row['ONE']."</th>";
        echo"<td>".$row['STOCK']."</th>";
    
    echo"</tr>";
}
echo "</tbody>";  

//echo json_encode($products);

echo "</table>"

 ?>