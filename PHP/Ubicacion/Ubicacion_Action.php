<?php

function Ubicacion_Add($conexion, $info)
{
  $send = array(
    'success' => false,
    'msg' => '',
    'new' => null
  );

  //$ = $info[''];
  $title = $info['title'];
  $zone_id = $info['zone'];
  $macro_id = $info['macro'];
  $dir = $info['dir'];
  $ref = $info['ref'];
  $gps = $info['gps'];

  //NEW ID
  $id = 0;
  $id_sql = "SELECT ID FROM  ubicacion";
  $id_resp = mysqli_query($conexion, $id_sql);

  //ADD

  $send['success'] = true;
  $send['msg'] = "ha sido añadido";

  $inf += ['id' => $id];
  $send['new'] = $info;

  return $send;
}

function Ubicacion_Save($conexion, $info)
{

  $send = array(
    'success' => false,
    'msg' => '',
    'new' => null
  );

  $id = $info['id'];

  if($id != null){

    // $title = $info['title'];
    // $zone_id = $info['zone'];
    // $macro_id = $info['macro'];
    // $dir = $info['dir'];
    // $ref = $info['ref'];
    // $gps = $info['gps'];

    Ubicacion_Save_I($conexion, $id, $info['title'], "TITLE");
    Ubicacion_Save_I($conexion, $id, $info['zone'], "ZONE");
    Ubicacion_Save_I($conexion, $id, $info['macro'], "MACRO");
    Ubicacion_Save_I($conexion, $id, $info['dir'], "DIR");
    Ubicacion_Save_I($conexion, $id, $info['ref'], "REF");
    Ubicacion_Save_I($conexion, $id, $info['gps'], "GPS");


  }else {

    $send['success'] = false;
    $send['msg'] = "se requiere de una id";
  }

  return $send;
}

function Ubicacion_Save_I($conexion, $id, $i, $k)
{
  if($i != null){
    $save_sql = "UPDATE `zonas` SET `$k` = '$i' WHERE ID LIKE '$id'";
    $save_resp = mysqli_query($conexion , $save_sql);
  }
}


 ?>
