<?php

require '../Conection.php';

$action = $_POST['action'];
// 1 -> get base data
// 2 -> update by primary
// 3 -> add
// 4 -> total

$table = $_POST['table'];
$headers = $_POST['headers'];
$condition = $_POST['condition'];
$conections = isset($_POST['conections']) ? $_POST['conections'] : null;
$conections_on = $conections != null && count($conections) > 0;

//headers -> array of dates that want of the data base
// db : title of the data in base data
// primary : boolean to know if is primary to search
// value : the value to update or search

$header_count = count($headers);
$header_primary = null;
$header_noprimary = array();
for ($i=0; $i < $header_count; $i++) {

  $h_i = $headers[$i];
  if($h_i['primary'] == 'true'){

    $header_primary = $h_i;
  }else {

    array_push($header_noprimary, $h_i);
  }
}


switch ($action) {

  //GET BASE DATA
  case 1:

  $data_sql = "SELECT ";
  $h_count = count($headers);
  for ($i=0; $i < $h_count; $i++) {

    $h = $headers[$i];
    $data_sql .= " ".$table.".".$h['db'].($i < $h_count-1 ? ',':'');
  }

  if($conections_on){

    $data_sql .= ", ";
    for ($i=0; $i < count($conections); $i++) {

      $c_i = $conections[$i];
      $t_c_i = $c_i['external_table'];
      $hm_c_i = $c_i['main_head_conect']['db'];
      $hc_c_i = $c_i['external_head_conect']['db'];
      $hs_c_i = $c_i['external_head_show']['db'];

      $data_sql.= $t_c_i.".".$hc_c_i." AS ".$t_c_i."_".$hc_c_i.", ";
      $data_sql .=$t_c_i.".".$hs_c_i." AS ".$t_c_i."_".$hs_c_i;
      $data_sql .=($i < count($conections)-1 ? ',':'');
    }
  }

  $data_sql .=" FROM ".$table;

  if($conections_on){

    for ($i=0; $i < count($conections); $i++) {

      $c_i = $conections[$i];
      $t_c_i = $c_i['external_table'];
      $hm_c_i = $c_i['main_head_conect']['db'];
      $hc_c_i = $c_i['external_head_conect']['db'];
      $hs_c_i = $c_i['external_head_show']['db'];

      $data_sql.= " LEFT JOIN ".$t_c_i." ON ".$table.".".$hm_c_i."=".$t_c_i.".".$hc_c_i."";
    }
  }

  if($condition != null)  $data_sql = $data_sql.$condition;
  $data_resp = mysqli_query($conexion, $data_sql);

  $send = array();
  while ($row = mysqli_fetch_assoc($data_resp)) {

    $line = array();
    for ($i=0; $i < count($headers); $i++) {

      $h = $headers[$i];
      $line[$h['db']] = $row[$h['db']];
    }

    array_push($send , $line);
  }

  echo json_encode($send);
  //echo $data_sql;

  break;

  case 2:

  $data_sql = "UPDATE ".$table." SET ";
  $h_count = count($headers);
  $h_key = null;
  for ($i=0; $i < $h_count; $i++) {

    $h = $headers[$i];
    if($h['primary'] == 'true'){

      $h_key = $h;
    }else {

      $data_sql = $data_sql.$h['db'].' = '.'"'.$h['value'].'"'.($i < $h_count-2 ? ',':'');
    }
  }

  $data_sql = $data_sql." WHERE ".$h_key['db']." = ".$h_key['value'];
  $data_resp = mysqli_query($conexion, $data_sql);

  echo json_encode($data_sql." success:".($data_resp?'true':'false'));

  break;

  case 3:

  $data_sql = "INSERT INTO ".'`'.$table.'`'." (";
  $h_count = count($header_noprimary);
  for ($i=0; $i < $h_count; $i++) {

    $h = $header_noprimary[$i];
    $data_sql = $data_sql.'`'.$h['db'].'`'.($i < $h_count-1 ? ',':'');
  }
  $data_sql = $data_sql.')';

  $data_sql = $data_sql.' VALUES (';

  $h_count = count($header_noprimary);
  for ($i=0; $i < $h_count; $i++) {

    $h = $header_noprimary[$i];
    $data_sql = $data_sql."'".$h['value']."'".($i < $h_count-1 ? ',':'');
  }
  $data_sql = $data_sql.')';

  $data_resp = null;
  $data_resp = mysqli_query($conexion, $data_sql);

  echo json_encode($data_sql." success:".($data_resp?'true':'false'));

  break;

  case 4:

  $data_sql = "SELECT COUNT(".$table."."."ID) AS 'count' ";
  $data_sql .= "FROM ".$table;

  if($conections_on){

    for ($i=0; $i < count($conections); $i++) {

      $c_i = $conections[$i];
      $t_c_i = $c_i['external_table'];
      $hm_c_i = $c_i['main_head_conect']['db'];
      $hc_c_i = $c_i['external_head_conect']['db'];
      $hs_c_i = $c_i['external_head_show']['db'];

      $data_sql.= " LEFT JOIN ".$t_c_i." ON ".$table.".".$hm_c_i."=".$t_c_i.".".$hc_c_i."";
    }
  }

  if($condition != null)  $data_sql = $data_sql.$condition;


  $data_resp = mysqli_query($conexion, $data_sql);
  $row = mysqli_fetch_assoc($data_resp);

  echo json_encode($row['count']);
  //echo json_encode($data_sql);

  break;
}




 ?>
