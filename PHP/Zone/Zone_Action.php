<?php

function Zone_Add($conexion, $info)
{

  $resp = array(
    'success' => true,
    'msg' => "Zona Añadida",
    'new' => null
  );

  $id = 0;
  $zone = $info['zone'];
  $macro_id = $info['macro_id'];
  $delivery = $info['delivery'];
  $activo = $info['activo'];

  //NEW ID
  $id_sql = "SELECT ID FROM zonas";
  $id_resp = mysqli_query($conexion, $id_sql);
  while($row = mysqli_fetch_assoc($id_resp)){
    $id = $row['ID'];
  }
  $id +=1;

  //ADD
  $add_sql = "INSERT INTO `zonas` (`ID`, `ZONE`, `MACRO`, `DELIVERY`, `ACTIVO`) VALUES ('$id', '$zone', '$macro_id', '$delivery', '$activo')";
  $add_resp = mysqli_query($conexion,$add_sql);

  $info += ['id' => $id];
  $resp['new'] = $info;

  return $resp;
}

function Zone_Save($conexion, $info)
{

  $resp = array(
    'success' => false,
    'msg' => ""
  );

  $id = $info['id'];
  $zone = $info['zone'];
  $macro_id = $info['macro_id'];
  $delivery = $info['delivery'];
  $activo = $info['activo'];

  if($id != null){

    if($zone != null){

      $save_zone_sql = "UPDATE `zonas` SET ZONE = '$zone' WHERE ID LIKE '$id'";
      $save_zone_resp = mysqli_query($conexion , $save_zone_sql);
    }

    if($macro_id != null){

      $save_macro_sql = "UPDATE `zonas` SET MACRO = '$macro_id' WHERE ID LIKE '$id'";
      $save_macro_resp = mysqli_query($conexion , $save_macro_sql);
    }

    if($delivery != null && $delivery > 0){

      $save_delivery_sql = "UPDATE `zonas` SET DELIVERY = '$delivery' WHERE ID LIKE '$id'";
      $save_delivery_resp = mysqli_query($conexion , $save_delivery_sql);
    }

    if($activo != null){

      $save_estado_sql = "UPDATE `zonas` SET ACTIVO = '$activo' WHERE ID LIKE '$id'";
      $save_estado_resp = mysqli_query($conexion , $save_estado_sql);
    }

    $resp['success'] = true;
    $resp['msg'] = "guardado exitoso";

  }
  else {

    $resp['success'] = false;
    $resp['msg'] = "se necesita un id";
  }

  return $resp;
}

function Zone_Search($conexion, $info)
{

  $resp = array(
    'success' => false,
    'msg' => "zona no encontrada",
    'found' => null
  );

  $id = $info['id'];

  $save_sql = "SELECT z.ID AS ZONE_ID, z.ZONE, z.MACRO  AS MACRO_ID, z.ACTIVO, z.DELIVERY,
  m.ID, m.MACRO
  FROM zonas z
  LEFT JOIN macro m ON m.ID = z.MACRO
  WHERE ZONE_ID LIKE '$id'";

  $save_resp = mysqli_query($conexion,$save_sql);

  while ($row = mysqli_fetch_assoc($save_resp)){

    $resp['success'] = true;
    $resp['msg'] = "zona encontrada";

    $resp['found'] = array(
      'id' => $row['ZONE_ID'],
      'zone' => $row['ZONE'],
      'macro_id' => $row['MACRO_ID'],
      'macro' => $row['MACRO'],
      'delivery' => $row['DELIVERY'],
      'activo' => $row['ACTIVO']
    );
  }

  return $resp;
}

 ?>
