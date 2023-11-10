<?php

require '../Classes/PHPExcel.php';
include '../Conection.php';

$dateA = $_GET['dateA'];
$dateB = $_GET['dateB'];

$sql = "SELECT v.NRO, v.NAME, v.DATE, v.TOTAL, v.ENTREGADO, v.CANCELADO, v.DELIVERY,v.METODO,v.DOCUMENT,v.TRABAJADOR,v.ZONE,
c.ID,c.NAME AS CLIENTE_NAME,
z.ID,z.ZONE AS ZONE_NAME
FROM ventas v
LEFT JOIN clientes c ON c.ID = v.NAME
LEFT JOIN zones z ON z.ID = v.ZONE
WHERE DATE >= '$dateA' AND DATE <= '$dateB'";
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
$objPHPExcel->getActiveSheet()->setCellValue('J1','ZONE');

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
  $objPHPExcel->getActiveSheet()->setCellValue('J'.$fila,$row['ZONE_NAME']);
  $fila++;
}

header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header('Content-Disposition: attachment;filename="QKReporte_of_'.$dateA.'_to_'.$dateB.'.xlsx"');
header('Cache-Control: max-age=0');

$objWrite = new PHPExcel_Writer_Excel2007($objPHPExcel);
$objWrite->save('php://output');

//echo json_encode("lol");
?>
