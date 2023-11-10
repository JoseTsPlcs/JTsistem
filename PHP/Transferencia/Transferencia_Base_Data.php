<?php

require '../Conection.php';

include '../Base_Resp.php';
$resp['data'] = array();


$emisor_id = $_POST['emisor_id'];
$dateA = $_POST['date_a'];
$dateB = $_POST['date_b'];

//FILTER
$filter = isset($_POST['filter']) ? $_POST['filter'] : "";
$tags = explode(" ", strtolower($filter));

$f_metodo = "";
for ($i=0; $i < count($tags); $i++) {
  if(strpos($tags[$i], "metodo_") !== false){
    $f_metodo = str_replace("metodo_", "", $tags[$i]);
    //$f_trabajador = "alonso";
    $f_metodo = mb_strtolower($f_metodo);
    $filter = "";
    break;
  }
}

$data_sql = "SELECT t.ID AS TRANS_ID, t.DATE, t.CONFIRM, t.EMISOR, t.METODO, t.RECEPTOR, t.METODO, t.TOTAL, t.COMMENT, t.ANULADO,
u.ID , u.USER AS USER_EMISOR,
ur.ID, ur.USER AS USER_RECEPTOR
FROM transferencias t
LEFT JOIN usuarios u ON u.ID = t.EMISOR
LEFT JOIN usuarios ur ON ur.ID = t.RECEPTOR
WHERE t.DATE >= '$dateA' AND  t.DATE <='$dateB'
AND (t.EMISOR LIKE '$emisor_id' OR t.RECEPTOR LIKE '$emisor_id')
AND (t.METODO LIKE '%$f_metodo%')";
$data_resp = mysqli_query($conexion,$data_sql);

while ($row = mysqli_fetch_assoc($data_resp)) {

  $line = array(

    'venta' => false,

    'date' => $row['DATE'],
    'id' => $row['TRANS_ID'],

    'emisor' => $row['USER_EMISOR'],
    'emisor_id' => $row['EMISOR'],

    'metodo' => $row['METODO'],

    'receptor' => $row['USER_RECEPTOR'],
    'receptor_id' => $row['RECEPTOR'],

    'confirm' => $row['CONFIRM'],
    'anulado' => $row['ANULADO'],

    'total' => $row['TOTAL'],
    'comment' => $row['COMMENT']

  );

  array_push($resp['data'] , $line);
}

//VENTAS POR AHORA

$data_sql = "SELECT v.NRO, v.CONFIRM, v.TIME_A, v.TIME_B , v.NAME AS CLIENTE_ID , v.CANCELADO, v.CAJERO , v.ENTREGADO, v.METODO, v.TOTAL,v.ANULADO,v.RECOGE,v.ARMADO,v.TRABAJADOR,v.DATE,v.COMMENT,v.DELIVERY,
  c.ID, c.NAME AS CLIENTE_NAME, c.ZONE,
  u.USER AS TRABAJADOR_USER, u.ID,
  uc.USER AS CAJERO_USER, uc.ID,
  z.ZONE AS ZONE_NAME, z.MACRO,
  m.ID, m.MACRO AS MACRO_NAME
  FROM ventas v
  LEFT JOIN clientes c ON v.NAME = c.ID
  LEFT JOIN usuarios u ON v.TRABAJADOR = u.ID
  LEFT JOIN usuarios uc ON v.CAJERO = uc.ID
  LEFT JOIN zonas z ON c.ZONE = z.ID
  LEFT JOIN macro m ON z.MACRO = m.ID
  WHERE
  v.DATE >= '$dateA' AND  v.DATE <='$dateB' AND v.CAJERO LIKE '$emisor_id' AND (v.METODO LIKE '%$f_metodo%')";
$data_resp = mysqli_query($conexion,$data_sql);

while ($row = mysqli_fetch_assoc($data_resp)) {

  $line = array(

    'venta' => true,

    'date' => $row['DATE'],
    'id' => $row['NRO'],

    'emisor' => $row['CLIENTE_NAME'],
    'emisor_id' => $row['CLIENTE_ID'],

    'metodo' => $row['METODO'],

    'receptor' => $row['CAJERO_USER'],
    'receptor_id' => $row['CAJERO'],

    'confirm' => $row['CANCELADO'],
    'anulado' => $row['ANULADO'],

    'total' => $row['TOTAL'],
    'comment' => "venta #".$row['NRO']

  );

  array_push($resp['data'] , $line);
}


//ORDER POR FECHA
function sksort(&$array, $subkey="id", $sort_ascending=false) {

    if (count($array))
        $temp_array[key($array)] = array_shift($array);

    foreach($array as $key => $val){
        $offset = 0;
        $found = false;
        foreach($temp_array as $tmp_key => $tmp_val)
        {
            if(!$found and strtolower($val[$subkey]) > strtolower($tmp_val[$subkey]))
            {
                $temp_array = array_merge(    (array)array_slice($temp_array,0,$offset),
                                            array($key => $val),
                                            array_slice($temp_array,$offset)
                                          );
                $found = true;
            }
            $offset++;
        }
        if(!$found) $temp_array = array_merge($temp_array, array($key => $val));
    }

    if ($sort_ascending) $array = array_reverse($temp_array);

    else $array = $temp_array;
}

if($resp['data']) sksort($resp['data'], "date", true);

$resp['success'] = true;
$resp['msg'] = "Transacciones cargadas correctamente";

echo json_encode($resp);

 ?>
