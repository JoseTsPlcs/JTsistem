<?php
$ruc = $_POST['ruc'];
$data = file_get_contents("https://api.sunat.cloud/ruc/".$ruc);
$info = json_decode($data, true);

if($data==='[]' || $info['fecha_inscripcion']==='--'){
	$datos = array(0 => 'nada');
	echo json_encode($datos);
}else{
$datos = array(
	0 => $info['ruc'],
	1 => $info['razon_social'],
	2 => date("d/m/Y", strtotime($info['fecha_actividad'])),
	3 => $info['contribuyente_condicion'],
	4 => $info['contribuyente_tipo'],
	5 => $info['contribuyente_estado'],
	6 => date("d/m/Y", strtotime($info['fecha_inscripcion'])),
	7 => $info['domicilio_fiscal'],
	8 => date("d/m/Y", strtotime($info['emision_electronica']))
);
	echo json_encode($datos);
}
?>
