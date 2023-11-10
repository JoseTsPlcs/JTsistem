<?php

require '../Classes/PHPExcel.php';
include '../Conection.php';

if(isset($_GET['dateA']) && isset($_GET['dateB'])){

  $dateA = $_GET['dateA'];
  $dateB = $_GET['dateB'];

  $sql = "SELECT v.NRO , v.DATE, v.NAME , v.ENTREGADO , v.RECOGE, v.DELIVERY,v.TOTAL, v.TRABAJADOR,v.CANCELADO,v.ENTREGADO,v.METODO,v.DOCUMENT,
  c.NAME , c.ZONE
  FROM ventas v
  INNER JOIN clientes c ON v.NAME = c.NAME
  WHERE v.DATE BETWEEN '$dateA' AND '$dateB'";
  $db_report =  mysqli_query($conexion,$sql);

  $objPHPExcel = new PHPExcel();
  $objPHPExcel->getProperties()->setCreator("Alonso Torres ")->setDescription("Reporte de Productos");
  $objPHPExcel->setActiveSheetIndex(0);
  $objPHPExcel->getActiveSheet()->setTitle("Ventas");

  $objPHPExcel->getActiveSheet()->setCellValue('A1','NRO');
  $objPHPExcel->getActiveSheet()->setCellValue('B1','FECHA');
  $objPHPExcel->getActiveSheet()->setCellValue('C1','NOMBRE');
  $objPHPExcel->getActiveSheet()->setCellValue('D1','TOTAL');
  $objPHPExcel->getActiveSheet()->setCellValue('E1','ENTREGADO');
  $objPHPExcel->getActiveSheet()->setCellValue('F1','CANCELADO');
  $objPHPExcel->getActiveSheet()->setCellValue('G1','DELIVERY');
  $objPHPExcel->getActiveSheet()->setCellValue('H1','MEDIO DE PAGO');
  $objPHPExcel->getActiveSheet()->setCellValue('I1','DOCUMENTO');
  $objPHPExcel->getActiveSheet()->setCellValue('J1','TRABAJADOR');
  $objPHPExcel->getActiveSheet()->setCellValue('K1','ZONA');
  $objPHPExcel->getActiveSheet()->setCellValue('L1','RECOGE');

  $fila = 2;
  while($row = mysqli_fetch_assoc($db_report)){
    $objPHPExcel->getActiveSheet()->setCellValue('A'.$fila,$row['NRO']);
    $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila,$row['DATE']);
    $objPHPExcel->getActiveSheet()->setCellValue('C'.$fila,$row['NAME']);
    $objPHPExcel->getActiveSheet()->setCellValue('D'.$fila,$row['TOTAL']);
    $objPHPExcel->getActiveSheet()->setCellValue('E'.$fila,$row['ENTREGADO'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('F'.$fila,$row['CANCELADO'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('G'.$fila,$row['DELIVERY']);
    $objPHPExcel->getActiveSheet()->setCellValue('H'.$fila,$row['METODO']);
    $objPHPExcel->getActiveSheet()->setCellValue('I'.$fila,$row['DOCUMENT']);
    $objPHPExcel->getActiveSheet()->setCellValue('J'.$fila,$row['TRABAJADOR']);
    $objPHPExcel->getActiveSheet()->setCellValue('K'.$fila,$row['ZONE']);
    $objPHPExcel->getActiveSheet()->setCellValue('L'.$fila,$row['RECOGE'] == 0 ?"FALSO" : "VERDAD");
    $fila++;
  }

// Redirigir la salida al navegador web de un cliente ( Excel5 )
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="reporte.xls"');
header('Cache-Control: max-age=0');
// Si usted está sirviendo a IE 9 , a continuación, puede ser necesaria la siguiente
header('Cache-Control: max-age=1');

// Si usted está sirviendo a IE a través de SSL , a continuación, puede ser necesaria la siguiente
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$objWriter->save('php://output');
exit;

}

?>
