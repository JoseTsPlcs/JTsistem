<?php
include '../Conection.php';

$id = $_POST['id'];
$product = $_POST['product'];
$one = $_POST['one'];
$g100 = $_POST['100g'];
$g250 = $_POST['250g'];
$g500 = $_POST['500g'];
$kg1 = $_POST['1kg'];
$kg1up = $_POST['1kg>'];
$kg5up = $_POST['5kg>'];
$stock = $_POST['stock'];

$mss = "";


$db_productos =  mysqli_query($conexion,"SELECT * FROM productos WHERE ID LIKE '$id'");
if(mysqli_num_rows($db_productos) > 0){

  //UPDATE

  $sql = "UPDATE `productos` SET
  `PRODUCTO`='$product',
  `100g`='$g100',
  `250g`='$g250',
  `500g`='$g500',
  `1000g`='$kg1',
  `1000g>`='$kg1up',
  `5000g>`='$kg5up',
  `ONE`='$one',
  `STOCK`='$stock'
  WHERE ID = '$id'";
  $resp = mysqli_query($conexion , $sql);
  $mss = "updated";

}else {

  //ADD

  //NEW ID
  $id = 0;
  $sql = "SELECT ID FROM productos";
  $rst = mysqli_query($conexion, $sql);
  while($row = mysqli_fetch_assoc($rst)){
    $id = $row['ID'];
  }
  $id++;

  $sql = "INSERT INTO `productos`
  (`ID`, `PRODUCTO`, `100g`, `250g`, `500g`, `1000g`, `1000g>`, `5000g>`, `ONE`, `STOCK`)
  VALUES ('$id','$product','$g100','$g250','$g500','$kg1','$kg1up','$kg5up','$one','$stock')";
  $rsp = mysqli_query($conexion,$sql);

  $mss = "added";
}

echo json_encode($mss);


 ?>
