<?php

$nro = $_POST['nro'];
$action = $_POST['action'];

$resp = array(
  'success' => false,
  'msg' => ""
);

switch ($action) {
  case 1:
    // CONFIRM
    $action_db = mysqli_query($conexion , "UPDATE `ventas` SET CONFIRM = '1' WHERE NRO LIKE '$nro'");
    $resp['success'] = true;
    $resp['msg'] = "nro :".$nro. " confirm";
    break;

    case 2:
      // DES CONFIRM
      $action_db = mysqli_query($conexion , "UPDATE `ventas` SET CONFIRM = '0' WHERE NRO LIKE '$nro'");
      $resp['success'] = true;
      $resp['msg'] = "nro :".$nro. " desconfirm";
      break;

      case 3:
        // ANULADO
        $action_db = mysqli_query($conexion , "UPDATE `ventas` SET ANULADO = '1' WHERE NRO LIKE '$nro'");
        $resp['success'] = true;
        $resp['msg'] = "nro :".$nro. " anulado";
        break;

        case 4:
          // DES ANULADO
          $action_db = mysqli_query($conexion , "UPDATE `ventas` SET ANULADO = '0' WHERE NRO LIKE '$nro'");
          $resp['success'] = true;
          $resp['msg'] = "nro :".$nro. " desanulado";
          break;



  default:
      $resp['success'] = false;
      $resp['msg'] = "no se encontro action -> ".$action;
    break;
}

echo json_encode($resp);


 ?>
