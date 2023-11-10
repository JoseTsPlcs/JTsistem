<?php


require '../Classes/PHPExcel.php';
include '../Conection.php';

if(isset($_GET['dateA']) && isset($_GET['dateB'])){

  //$data = $_POST['']

  $dateA = $_GET['dateA'];
  $dateB = $_GET['dateB'];

  $sql = "SELECT p.NRO AS NRO_I , p.INFO, p.PRODUCTO , p.PRECIO , p.CANTIDAD, p.UNIDAD ,p.CANTIDAD,
  c.ID, c.NAME AS CLIENTE_NAME, c.ZONE,
  z.ID, z.ZONE AS ZONE_NAME,
  u.ID, u.USER,
  v.NRO , v.DATE, v.NAME , v.ENTREGADO , v.RECOGE, v.DELIVERY,v.TOTAL, v.TRABAJADOR,v.CANCELADO,v.ENTREGADO,v.METODO,v.DOCUMENT,v.ANULADO,
  k.ACTIVO,
  t.TIPO
  FROM ventas_productos p
  LEFT JOIN ventas v ON v.NRO = p.NRO
  LEFT JOIN clientes c ON v.NAME = c.ID
  LEFT JOIN zonas z ON c.ZONE = z.ID
  LEFT JOIN usuarios u ON u.ID = v.TRABAJADOR
  LEFT JOIN productos k ON k.PRODUCTO = p.PRODUCTO
  LEFT JOIN productos_tipo t ON t.ID = k.TIPO_ID
  WHERE v.DATE BETWEEN '$dateA' AND '$dateB' ORDER BY p.NRO DESC";
  $db_report =  mysqli_query($conexion,$sql);

  $objPHPExcel = new PHPExcel();
  $objPHPExcel->getProperties()->setCreator("Alonso Torres ")->setDescription("Reporte de Productos");
  $objPHPExcel->setActiveSheetIndex(0);
  $objPHPExcel->getActiveSheet()->setTitle("Ventas");

  $objPHPExcel->getActiveSheet()->setCellValue('A1','NRO');

  $objPHPExcel->getActiveSheet()->setCellValue('B1','AÑO');
  $objPHPExcel->getActiveSheet()->setCellValue('C1','MES');
  $objPHPExcel->getActiveSheet()->setCellValue('D1','FECHA');

  $objPHPExcel->getActiveSheet()->setCellValue('E1','INFO');
  $objPHPExcel->getActiveSheet()->setCellValue('F1','PRODUCTO');

  $objPHPExcel->getActiveSheet()->setCellValue('G1','CANTIDAD');
  $objPHPExcel->getActiveSheet()->setCellValue('H1','PRECIO UNITARIO');
  $objPHPExcel->getActiveSheet()->setCellValue('I1','TOTAL');

  $objPHPExcel->getActiveSheet()->setCellValue('J1','NOMBRE');
  $objPHPExcel->getActiveSheet()->setCellValue('K1','ENTREGADO');
  $objPHPExcel->getActiveSheet()->setCellValue('L1','CANCELADO');
  $objPHPExcel->getActiveSheet()->setCellValue('M1','DELIVERY');
  $objPHPExcel->getActiveSheet()->setCellValue('N1','MEDIO DE PAGO');
  $objPHPExcel->getActiveSheet()->setCellValue('O1','DOCUMENTO');
  $objPHPExcel->getActiveSheet()->setCellValue('P1','TRABAJADOR');
  $objPHPExcel->getActiveSheet()->setCellValue('Q1','ZONA');
  $objPHPExcel->getActiveSheet()->setCellValue('R1','RECOGE');
  $objPHPExcel->getActiveSheet()->setCellValue('S1','ANULADO');

  $objPHPExcel->getActiveSheet()->setCellValue('T1','PRODUCTO INFO');
  $objPHPExcel->getActiveSheet()->setCellValue('U1','UNIDAD');
  $objPHPExcel->getActiveSheet()->setCellValue('V1','UNIDAD COUNT');
  $objPHPExcel->getActiveSheet()->setCellValue('W1','UNIDAD COUNT TOTAL');
  $objPHPExcel->getActiveSheet()->setCellValue('X1','ACTIVO');
  $objPHPExcel->getActiveSheet()->setCellValue('Y1','TIPO');


  $fila = 2;
  while($row = mysqli_fetch_assoc($db_report)){

    $objPHPExcel->getActiveSheet()->setCellValue('A'.$fila,$row['NRO_I']);

    $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila,date("Y",strtotime($row['DATE'])));
    $objPHPExcel->getActiveSheet()->setCellValue('C'.$fila,date("M",strtotime($row['DATE'])));
    $objPHPExcel->getActiveSheet()->setCellValue('D'.$fila,$row['DATE']);

    $objPHPExcel->getActiveSheet()->setCellValue('E'.$fila,$row['INFO']);
    $objPHPExcel->getActiveSheet()->setCellValue('F'.$fila,$row['PRODUCTO']);

    $objPHPExcel->getActiveSheet()->setCellValue('G'.$fila,$row['CANTIDAD']);
    $objPHPExcel->getActiveSheet()->setCellValue('H'.$fila,$row['PRECIO']);
    $objPHPExcel->getActiveSheet()->setCellValue('I'.$fila,$row['TOTAL']);


    $objPHPExcel->getActiveSheet()->setCellValue('J'.$fila,$row['CLIENTE_NAME']);
    $objPHPExcel->getActiveSheet()->setCellValue('K'.$fila,$row['ENTREGADO'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('L'.$fila,$row['CANCELADO'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('M'.$fila,$row['DELIVERY']);
    $objPHPExcel->getActiveSheet()->setCellValue('N'.$fila,$row['METODO']);
    $objPHPExcel->getActiveSheet()->setCellValue('O'.$fila,$row['DOCUMENT']);
    $objPHPExcel->getActiveSheet()->setCellValue('P'.$fila,$row['USER']);
    $objPHPExcel->getActiveSheet()->setCellValue('Q'.$fila,$row['ZONE_NAME']);
    $objPHPExcel->getActiveSheet()->setCellValue('R'.$fila,$row['RECOGE'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('S'.$fila,$row['ANULADO'] == 0 ?"FALSO" : "VERDAD");

    $objPHPExcel->getActiveSheet()->setCellValue('T'.$fila,$row['PRODUCTO']." ".$row['INFO']);
    $objPHPExcel->getActiveSheet()->setCellValue('U'.$fila,$row['INFO'] == "" ? "UNIDAD" : "KILO");
    $unidad_count = 1;
    switch ($row['INFO']) {
      case '1kg':
        $unidad_count = 1;
        break;
        case '500g':
          $unidad_count = 0.5;
          break;
          case '250g':
            $unidad_count = 0.25;
            break;
            case '100g':
              $unidad_count = 0.1;
              break;
              case '5kg>':
                $unidad_count = 1;
                break;
                case '2kg:4kg':
                  $unidad_count = 1;
                  break;
                  case '':
                    $unidad_count = 1;
                    break;
      default:
        $unidad_count="ERROR";
        break;
    }
    $objPHPExcel->getActiveSheet()->setCellValue('V'.$fila,$unidad_count);
    $objPHPExcel->getActiveSheet()->setCellValue('W'.$fila,$unidad_count * $row['CANTIDAD']);
    $objPHPExcel->getActiveSheet()->setCellValue('X'.$fila,$row['ACTIVO']);
    $objPHPExcel->getActiveSheet()->setCellValue('Y'.$fila,$row['TIPO']);




    $fila++;
  }

include '../ExcelDownland.php';

exit;

}

?>
