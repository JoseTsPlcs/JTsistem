<?php

include 'Zone_base.php';

//$zone_id
//$delivery

if(isset($zone) && isset($zone_id) && $zone != ""){

  $zone = strtoupper($zone);

  $db_zones = mysqli_query($conexion ,"SELECT * FROM zonas WHERE ZONE LIKE '$zone'");
  $find = mysqli_num_rows($db_zones);

  if($find >= 1) {
    while ($row = mysqli_fetch_assoc($db_zones)) {
      $zone_id = $row['ID'];
    }
    if($delivery > 0){
      //UPDATE
      $sql = "UPDATE `zonas` SET
      DELIVERY ='$delivery',
      ZONE = '$zone'
      WHERE ZONE LIKE '$zone'";
      $resp = mysqli_query($conexion , $sql);
    }
  }else {

  if($find == 0){
      //ADD
      if($zone != ""){
        $zone_id = 0;
        $id_sql = "SELECT ID FROM zonas";
        $id_cnx = mysqli_query($conexion, $id_sql);

        while($row = mysqli_fetch_assoc($id_cnx)){
          $zone_id = $row['ID'];
        }
        $zone_id +=1;
        $sql = "INSERT INTO `zonas` (`ID`,`ZONE`, `DELIVERY`) VALUES ('$zone_id','$zone', '$delivery')";
        $resp = mysqli_query($conexion,$sql);
      }
    }
  }
}

//echo json_encode("ok");

 ?>
