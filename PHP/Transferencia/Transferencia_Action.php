<?php

function Transferencia_Add($conection, $info)
{

  include '../Base_Resp.php';

  if(
    isset($info['date']) &&
    isset($info['confirm']) &&

    isset($info['emisor']) &&
    isset($info['metodo']) &&
    isset($info['receptor']) &&

    isset($info['total']) &&
    isset($info['comment'])
  ){

    //NEW ID
    $id = 0;
    $id_sql = "SELECT ID FROM transferencias";
    $id_resp = mysqli_query($conection, $id_sql);
    while($row = mysqli_fetch_assoc($id_resp)){
      $id = $row['ID'];
    }
    $id +=1;

    $date = $info['date'];
    $confirm = $info['confirm'];

    $emisor = $info['emisor'];
    $metodo = $info['metodo'];

    $receptor = $info['receptor'];

    $total = $info['total'];
    $comment = $info['comment'];

    $add_sql = "INSERT INTO `transferencias`
    (`ID`, `DATE`, `EMISOR`, `METODO`, `RECEPTOR`, `TOTAL`, `COMMENT`,`CONFIRM`)
    VALUES ('$id','$date', '$emisor', '$metodo', '$receptor', '$total', '$comment', '$confirm')";
    $add_resp = mysqli_query($conection, $add_sql);

    $resp['new'] = $info;
    $resp['success'] = true;
    $resp['msg'] = "se ha añadido transferencia con exito";
  }

  return $resp;
}

function Transferencia_Search($conection, $info)
{
  include '../Base_Resp.php';

  if(isset($info['nro'])){

    $id = $info['nro'];

    $save_sql = "SELECT t.ID AS TRANS_ID, t.DATE, t.CONFIRM, t.EMISOR, t.METODO, t.RECEPTOR, t.METODO, t.TOTAL, t.COMMENT, t.ANULADO,
    u.ID , u.USER AS USER_EMISOR,
    ur.ID, ur.USER AS USER_RECEPTOR
    FROM transferencias t
    LEFT JOIN usuarios u ON u.ID = t.EMISOR
    LEFT JOIN usuarios ur ON ur.ID = t.RECEPTOR
    WHERE t.ID LIKE '$id'";
    $save_resp = mysqli_query($conection,$save_sql);

    while ($row = mysqli_fetch_assoc($save_resp)){

      $resp['success'] = true;
      $resp['msg'] = "transaccion ".$id." fue encontrada";

      $resp['found'] = array(
        'id' => $row['TRANS_ID'],
        'date' => $row['DATE'],

        'emisor_id' => $row['EMISOR'],
        'emisor' => $row['USER_EMISOR'],

        'metodo' => $row['METODO'],

        'receptor_id' => $row['RECEPTOR'],
        'receptor' => $row['USER_RECEPTOR'],

        'total' => $row['TOTAL'],
        'comment' => $row['COMMENT'],

        'confirm' => $row['CONFIRM'],
        'anulado' => $row['ANULADO'],
      );
    }

  }else {

    $resp['success'] = false;
    $resp['msg'] = "se necesita un nro para encontrar transferencia";
  }

  return $resp;
}

function Transferencia_Save($conection, $info)
{
  include '../Base_Resp.php';

  if(isset($info['id'])){

    //NEW ID
    $id = $info['id'];

    Transferencia_Save_Key($conection, $info, $id, 'date', 'DATE');
    Transferencia_Save_Key($conection, $info, $id, 'confirm', 'CONFIRM');

    Transferencia_Save_Key($conection, $info, $id, 'emisor', 'EMISOR');
    Transferencia_Save_Key($conection, $info, $id, 'metodo', 'METODO');
    Transferencia_Save_Key($conection, $info, $id, 'receptor', 'RECEPTOR');

    Transferencia_Save_Key($conection, $info, $id, 'total', 'TOTAL');
    Transferencia_Save_Key($conection, $info, $id, 'comment', 'COMMENT');

    Transferencia_Save_Key($conection, $info, $id, 'anulado', 'ANULADO');


    $resp['saved'] = $info;
    $resp['success'] = true;
    $resp['msg'] = "se ha guardado la transferencia con exito";
  }else {

    $resp['success'] = false;
    $resp['msg'] = "se necesita de un id para guardar la transferencia";
  }

  return $resp;
}

function Transferencia_Save_Key($conection, $info, $id, $key, $db)
{

  if(isset($info[$key])){

    $val = $info[$key];
    $key_sql = "UPDATE `transferencias` SET
    `$db`='$val'
    WHERE ID LIKE '$id'";
    $key_resp = mysqli_query($conection,$key_sql);
  }
}

 ?>
