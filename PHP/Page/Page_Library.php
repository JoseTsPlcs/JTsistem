<?php

$pages = array(
  array(
    'id' => 0,
    'page' => "Facturas",
    'url' => "Factura.php",
    'class' => array(0,3)
  ),
  array(
    'id' => 1,
    'page' => "Control",
    'url' => "Control.php",
    'class' => array(0,3)
  ),
  array(
    'id' => 2,
    'page' => "Reporte",
    'url' => "Report.php",
    'class' => array(0,3)
  ),
  array(
    'id' => 3,
    'page' => "Clientes",
    'url' => "Clientes.php",
    'class' => array(0,3)
  ),
  array(
    'id' => 4,
    'page' => "Productos",
    'url' => "Products.php",
    'class' => array(0,3)
  ),
  array(
    'id' => 5,
    'page' => "Armar",
    'url' => "Armar.php",
    'class' => array(0,1)
  ),
  array(
    'id' => 6,
    'page' => "Delivery",
    'url' => "Delivery.php",
    'class' => array(0,2)
  ),
  array(
    'id' => 7,
    'page' => "Recetas",
    'url' => "Recetas.php",
    'class' => array()
  ),
  array(
    'id' => 8,
    'page' => "LogOut",
    'url' => "LogOut.php",
    'class' => array(-1,0,1,2,3)
  ),
  array(
    'id' => 9,
    'page' => "Materiales",
    'url' => "Materiales.php",
    'class' => array()
  ),
  array(
    'id' => 10,
    'page' => "Caja",
    'url' => "Caja.php",
    'class' =>  array(-1,0,1,2,3)
  ),
  array(
    'id' => 11,
    'page' => "Pagos",
    'url' => "Pay.php",
    'class' =>  array(-1,0,1,2,3)
  ),
  array(
    'id' => 12,
    'page' => "Recoge",
    'url' => "Recoge.php",
    'class' => array(-1,0,1,2,3)
  ),
  array(
    'id' => 13,
    'page' => "Almacen",
    'url' => "Almacen.php",
    'class' => array(0)
  ),
  array(
    'id' => 14,
    'page' => "Zonas",
    'url' => "Zone.php",
    'class' => array(0,3)
  ),
  array(
    'id' => 15,
    'page' => "Transacciones",
    'url' => "Transacciones.php",
    'class' => array(0,3)
  ),
  array(
    'id' => 16,
    'page' => "Movimientos",
    'url' => "Movimientos.php",
    'class' => array(0,3)
  )
);

$classes = array("MAMALUCHONA","CHEF","DELIV","ADMIN");

function Array_IndexOf($nm, $array)
{
  for ($i=0; $i < count($array); $i++) {
    if($array[$i] == $nm){
      return $i;
    }
  }
  return -1;
}

function PagesByClass($clss)
{
  $pgs = array();

  $class = Array_IndexOf($clss,$GLOBALS['classes']);
  //echo "class: ".$row['CLASS']." id: " .$class;

  if($class !== -1){
    for ($i=0; $i < count($GLOBALS['pages']); $i++) {
      $add = Array_IndexOf($class,$GLOBALS['pages'][$i]['class']);
      //$add = boolval($add) ? "true" : "false";
      //echo "<br>".$GLOBALS['pages'][$i]['page']." " .$add;
      if($add !== -1){
          array_push($pgs, $GLOBALS['pages'][$i]);
      }
    }
  }

  return $pgs;
}

function ClassByUser($user)
{
  include '../Conection.php';
  $class = "";
  $db_usuarios =  mysqli_query($conexion,"SELECT * FROM ususarios WHERE USER LIKE '$user'");
  while($row = mysqli_fetch_assoc($db_usuarios)){
    $class = $row['CLASS'];
  }
  return $class;
}

 ?>
