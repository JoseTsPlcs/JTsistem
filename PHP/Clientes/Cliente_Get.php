<?php

include 'Cliente_base.php';

$name = $_POST['name'];

if($name != ""){
  $sql = "SELECT c.ID AS CLIENTE_ID ,c.NAME, c.DNI, c.ZONE, c.DIR, c.REF, c.CEL, c.GPS, c.METODO,c.RECOGE, c.DOCUMENT,
  z.ID AS ZONE_ID, z.ZONE
  FROM clientes c
  LEFT JOIN zonas z ON c.ZONE = z.ID
  WHERE c.NAME LIKE '%$name%'";
  $db_clientes =  mysqli_query($conexion, $sql);
  while($row = mysqli_fetch_assoc($db_clientes)){
     
    array_push($clientes['documento'],$row['DOCUMENT']);
    array_push($clientes['cliente_id'],$row['CLIENTE_ID']);
    array_push($clientes['name'],$row['NAME']);
    array_push($clientes['dni'],$row['DNI']);
    array_push($clientes['zone_id'],$row['ZONE_ID']);
    array_push($clientes['zone'],$row['ZONE']);
    array_push($clientes['dir'],$row['DIR']);
    array_push($clientes['ref'],$row['REF']);
    array_push($clientes['cel'],$row['CEL']);
    array_push($clientes['gps'],$row['GPS']);
    array_push($clientes['metodo'],$row['METODO']);
    array_push($clientes['recoge'],$row['RECOGE']);
    
  }
}

echo json_encode($clientes);

 ?>
