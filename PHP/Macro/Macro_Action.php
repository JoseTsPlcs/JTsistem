<?php

function Macro_Add($conexion, $info)
{
  $resp = array(
    'success' => false,
    'msg' => '',
    'new' => null
  );

  $id = 0;
  $macro = $info['macro'];

  if($macro == ""){

    $resp['success'] = false;
    $resp['msg'] = "debe tener nombre";
  }else {

    //NEW ID
    $id_sql = "SELECT ID FROM macro";
    $id_resp = mysqli_query($conexion, $id_sql);
    while($row = mysqli_fetch_assoc($id_resp)){
      $id = $row['ID'];
    }
    $id +=1;

    //ADD
    $add_sql = "INSERT INTO `macro`(`ID`, `MACRO`) VALUES ('$id','$macro')";
    $add_resp = mysqli_query($conexion, $add_sql);

    $resp['success'] = true;
    $resp['msg'] = "se ha añadido correctamente";

    $info += ['id' => $id];
    $resp['new'] = $info;
  }

  return $resp;

}

function Macro_Save($conexion, $info)
{

  $resp = array(
    'success' => true,
    'msg' => 'ha sido actualizado'
  );

  $id = $info['id'];
  $macro = $info['macro'];

  $save_sql = "UPDATE `macro` SET `MACRO`= '$macro' WHERE ID LIKE '$id'";
  $save_resp = mysqli_query($conexion, $save_sql);

  return $resp;

}


 ?>
