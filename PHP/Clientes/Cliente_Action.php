<?php

function Cliente_Add($conexion, $info)
{

  $resp = array(
    'success' => false,
    'msg' => "",
    'new' => null
  );

  if(!$info){

    $resp['success'] = false;
    $resp['msg'] = "se necesita informacion para agregar cliente";

    return $resp;
  }

  $id = 0;
  //NEW ID
  $id_sql = "SELECT ID FROM clientes";
  $id_resp = mysqli_query($conexion, $id_sql);
  while($row = mysqli_fetch_assoc($id_resp)){
    $id = $row['ID'];
  }
  $id +=1;

  $activo = array_key_exists('activo', $info) ? $info['activo'] : 1;
  $name = array_key_exists('name', $info) ? $info['name'] : "";
  $etiqueta = array_key_exists('etiqueta', $info) ? $info['etiqueta'] : 0;
  $metodo = array_key_exists('metodo', $info) ? $info['metodo'] : "Efectivo";
  $recoge = array_key_exists('recoge', $info) ? $info['recoge'] : 0;

  $zone_id = array_key_exists('zone_id', $info) ? $info['zone_id'] : -1;
  $dir = array_key_exists('dir', $info) ? $info['dir'] : "";
  $ref = array_key_exists('ref', $info) ? $info['ref'] : "";
  $cel = array_key_exists('cel', $info) ? $info['cel'] : "";
  $gps = array_key_exists('gps', $info) ? $info['gps'] : "";

  if($name == ""){

    $resp['success'] = false;
    $resp['msg'] = "se necesita un nombre para agregar un cliente";

    return $resp;
  }

  $add_sql = "INSERT INTO clientes
  (`ID`, `ACTIVO`, `NAME`, `DIR`, `ZONE`, `REF`, `CEL`, `GPS`, `METODO`, `RECOGE`)
  VALUES
  ('$id','$activo','$name','$dir','$zone_id','$ref','$cel','$gps','$metodo','$recoge')";
  $add_resp = mysqli_query($conexion,$add_sql);

  $resp['success'] = true;
  $resp['msg'] = "se ha agregado un cliente";

  $info += ['id' => $id];
  $resp['new'] = $info;

  return $resp;
}

function Cliente_Search($conexion, $info)
{

  $resp = array(
    'success' => false,
    'msg' => '',
    'found' => null
  );

  if(array_key_exists('id', $info)){

    $id = $info['id'];

    $search_sql = "SELECT c.ID AS CLIENTE_ID, c.ACTIVO, c.NAME, c.DIR, c.ZONE AS ZONE_ID, c.REF, c.CEL, c.GPS, c.METODO, c.RECOGE,
    z.ID, z.ZONE
    FROM clientes c
    LEFT JOIN zonas z ON z.ID = c.ZONE
    WHERE c.ID LIKE '$id'";

    $search_resp = mysqli_query($conexion,$search_sql);
    while ($row = mysqli_fetch_assoc($search_resp)){

      $resp['success'] = true;
      $resp['msg'] = "cliente encontrado";

      $resp['found'] = array(
        'id' => $row['CLIENTE_ID'],
        'activo' => $row['ACTIVO'],
        'name' => $row['NAME'],
        'cel' => $row['CEL'],
        'metodo' => $row['METODO'],
        'recoge' => $row['RECOGE'],

        'zone_id' => $row['ZONE_ID'],
        'zone' => $row['ZONE'],
        'dir' => $row['DIR'],
        'ref' => $row['REF'],
        'gps' => $row['GPS']
      );
    }

  }else {

    $resp['success'] = false;
    $resp['msg'] = "Se necesita id para buscar cliente";
  }

  return $resp;
}

function Cliente_Save($conexion, $info)
{

  $resp = array(
    'success' => false,
    'msg' => '',
    'save' => $info
  );

  if(array_key_exists('id', $info)){

    $id = $info['id'];

    Cliente_Save_Key($conexion, 'name', $info, 'NAME', $id);
    Cliente_Save_Key($conexion, 'cel', $info, 'CEL', $id);
    Cliente_Save_Key($conexion, 'metodo', $info, 'METODO', $id);
    Cliente_Save_Key($conexion, 'recoge', $info, 'RECOGE', $id);

    Cliente_Save_Key($conexion, 'zone_id', $info, 'ZONE', $id);
    Cliente_Save_Key($conexion, 'dir', $info, 'DIR', $id);
    Cliente_Save_Key($conexion, 'gps', $info, 'GPS', $id);
    Cliente_Save_Key($conexion, 'ref', $info, 'REF', $id);

    $resp['success'] = true;
    $resp['msg'] = "Se ha guardado el cliente";

  }else {

    $resp['success'] = false;
    $resp['msg'] = "Se necesita id para guardar un cliente";
  }

  return $resp;
}

function Cliente_Save_Key($conexion, $info_key, $info, $db_key, $id)
{

  if(array_key_exists($info_key, $info)){

    $save = $info[$info_key];
    $search_sql = "UPDATE `clientes` SET `$db_key`='$save' WHERE ID LIKE $id";
    $search_resp = mysqli_query($conexion, $search_sql);
  }
}

 ?>
