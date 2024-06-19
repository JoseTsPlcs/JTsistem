<?php

  $srcPathReturn = "../../../";
  /*jquery*/echo '<script src="'.$srcPathReturn.'libs/jquery-3.7.1/jquery-3.7.1.min.js"></script>';

  /*popper-necesario para select*/echo '<script src="'.$srcPathReturn.'libs/popper/popper.min.js"></script>';
  /*boostrap*/echo '<script src="'.$srcPathReturn.'libs/bootstrap-4.0.0-dist/js/bootstrap.bundle.min.js"></script>';
  
  /*select*/echo '<script src="'.$srcPathReturn.'libs/bootstrap-select-1.13.14/dist/js/bootstrap-select.js"></script>';
  /*graficos*/echo '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>';
  /*pdf*/ //echo '<script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.16.0/dist/pdf-lib.js"></script>';

  echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>';
  echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>';
  echo '<script src="https://cdn.jsdelivr.net/npm/xlsx@0.17.0/dist/xlsx.full.min.js"></script>';


  $src= $srcPathReturn."libs/case-1.0.1/"; 
  include $srcPathReturn.'libs/case-1.0.1/case.php';

  echo '<script src="../source/ConfigProyect.js"></script>';
  echo '<script src="../source/Constans.js"></script>';
  echo '<script src="../source/ListOfPaginas.js"></script>';
  echo '<script src="../source/ListOfConections.js"></script>';
  echo '<script src="../source/ListOfForms.js"></script>';
  echo '<script src="../source/LoadPage.js"></script>';
  
  //return;
  $url = $_SERVER["REQUEST_URI"];
  $parts = explode("/", $url);
  $page = str_replace(".php", "", end($parts));  


  echo '<script src="'.$page.'.js"></script>';

  
  

?>