<?php
include 'Cliente_base.php';

//$cliente_id
//$name
//$dni
//$cel
//$zone
//$zone_id
//$dir
//$ref
//$gps
//$metodo

//zone
include '../Zone/Zone_Update.php';

if(isset($name) && $name != ""){

  $name = strtoupper($name);

  $db_clientes = mysqli_query($conexion,"SELECT * FROM clientes WHERE NAME LIKE '$name'");
  $find = mysqli_num_rows($db_clientes);

  if ($find >= 1){

    //UPDATE
    //CONFIRM DATA
    
    if(isset($dni)){
      $sql = "UPDATE `clientes` SET DNI ='$dni' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }

    
    if(isset($dir)){
      $sql = "UPDATE `clientes` SET DIR ='$dir' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }

    if(isset($zone_id) && $zone_id >= 0){
      $sql = "UPDATE `clientes` SET ZONE ='$zone_id' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }

    if(isset($ref)){
      $sql = "UPDATE `clientes` SET REF ='$ref' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }

    if(isset($cel)){
      $sql = "UPDATE `clientes` SET CEL ='$cel' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }

    if(isset($gps)){
      $sql = "UPDATE `clientes` SET GPS ='$gps' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }

    if(isset($recoge)){
      $sql = "UPDATE `clientes` SET RECOGE ='$recoge' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }

    if(isset($metodo) && $metodo != "Efectivo"){
      $sql = "UPDATE `clientes` SET METODO = '$metodo' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }
    
    if(isset($documento)){
      $sql = "UPDATE `clientes` SET DOCUMENT = '$documento' WHERE NAME LIKE '$name'";
      $resp = mysqli_query($conexion , $sql);
    }

    if(isset($zone_id)) array_push($clientes['cliente_id'],"updated" ,$zone_id);

  }else
  {
    //ADD

    //NEW ID
    $cliente_id = 0;
    $add_sql = "SELECT ID FROM clientes";
    $add_rst = mysqli_query($conexion, $add_sql);
    while($row = mysqli_fetch_assoc($add_rst)){
      $cliente_id = $row['ID'];
    }
    $cliente_id += 1;

    //CONFIRM DATA
    if(!isset($dir)) $dir = "";
    if(!isset($zone)) $zone_id = "";
    if(!isset($ref)) $ref = "";
    if(!isset($cel)) $cel = "";
    if(!isset($gps)) $gps = "";
    if(!isset($metodo)) $metodo = "Efectivo";
    if(!isset($recoge)) $recoge = 0;

    $sql = "INSERT INTO `clientes` (`ID`,`NAME`, `DIR`, `ZONE`, `REF`, `CEL`, `GPS`, `METODO`, `RECOGE`,`DNI`)
    VALUES ('$cliente_id', '$name', '$dir', '$zone_id', '$ref', '$cel' , '$gps', '$metodo' , '$recoge','$dni')";
    $resp = mysqli_query($conexion , $sql);
    array_push($clientes['cliente_id'],"added",$name ,$cliente_id);
  }

}


 ?>
