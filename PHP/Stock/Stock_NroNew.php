<?php

include '../Conection.php';

$nro = 0;

$sql = "SELECT NRO FROM mercaderia_registro";
$rst = mysqli_query($conexion, $sql);
while($row = mysqli_fetch_assoc($rst)){
  $nro = $row['NRO'];
}
$nro += 1;

echo json_encode($nro);
 ?>
