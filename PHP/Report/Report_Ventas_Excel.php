<?php

require '../Classes/PHPExcel.php';
include '../Conection.php';

if(isset($_GET['dateA']) && isset($_GET['dateB'])){

  $dateA = $_GET['dateA'];
  $dateB = $_GET['dateB'];

  $sql = "SELECT v.NRO , v.DATE, v.NAME , v.ENTREGADO , v.RECOGE, v.DELIVERY,v.TOTAL, v.TRABAJADOR,v.CANCELADO,v.ENTREGADO,v.METODO,v.DOCUMENT,v.ANULADO,
  c.ID, c.NAME AS CLIENTE_NAME, c.ZONE,
  z.ID, z.ZONE AS ZONE_NAME,
  m.MACRO,
  u.ID, u.USER
  FROM ventas v
  LEFT JOIN clientes c ON v.NAME = c.ID
  LEFT JOIN zonas z ON c.ZONE = z.ID
  LEFT JOIN macro m ON z.MACRO = m.ID
  LEFT JOIN usuarios u ON u.ID = v.TRABAJADOR
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
  $objPHPExcel->getActiveSheet()->setCellValue('M1','ANULADO');
    $objPHPExcel->getActiveSheet()->setCellValue('N1','MACRO');

  $fila = 2;
  while($row = mysqli_fetch_assoc($db_report)){
    $objPHPExcel->getActiveSheet()->setCellValue('A'.$fila,$row['NRO']);
    $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila,$row['DATE']);
    $objPHPExcel->getActiveSheet()->setCellValue('C'.$fila,$row['CLIENTE_NAME']);
    $objPHPExcel->getActiveSheet()->setCellValue('D'.$fila,$row['TOTAL']);
    $objPHPExcel->getActiveSheet()->setCellValue('E'.$fila,$row['ENTREGADO'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('F'.$fila,$row['CANCELADO'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('G'.$fila,$row['DELIVERY']);
    $objPHPExcel->getActiveSheet()->setCellValue('H'.$fila,$row['METODO']);
    $objPHPExcel->getActiveSheet()->setCellValue('I'.$fila,$row['DOCUMENT']);
    $objPHPExcel->getActiveSheet()->setCellValue('J'.$fila,$row['USER']);
    $objPHPExcel->getActiveSheet()->setCellValue('K'.$fila,$row['ZONE_NAME']);
    $objPHPExcel->getActiveSheet()->setCellValue('L'.$fila,$row['RECOGE'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('M'.$fila,$row['ANULADO'] == 0 ?"FALSO" : "VERDAD");
    $objPHPExcel->getActiveSheet()->setCellValue('N'.$fila,$row['MACRO']);
    $fila++;
  }

include '../ExcelDownland.php';

exit;

}

?>
