<?php

  $carp='';

  /*
  last
  echo '<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>';
  echo '<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>';
  echo '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>';

  new
  echo'<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>';
  echo'<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>';
  echo'<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>';

  echo'<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>';
  */

  /*
  echo '<script src="'.$carp.'SystemCase/Scripts/BaseData/BaseData.js"></script>';
  echo '<script src="'.$carp.'SystemCase/Scripts/BaseData/Sql.js"></script>';
  echo '<script src="'.$carp.'SystemCase/Scripts/BaseData/Sql_Select.js"></script>';
  echo '<script src="'.$carp.'SystemCase/Scripts/BaseData/Table.js"></script>';
  echo '<script src="'.$carp.'SystemCase/Scripts/BaseData/Data.js"></script>';
  echo '<script src="'.$carp.'SystemCase/Scripts/BaseData/Table_Data.js"></script>';*/

  //get Sources (forms defalults)


  //get CASE framework
  $carp = 'Case/';
  include 'Case/aa.php';

  echo '<script src="Source/DataBase.js"></script>';

  //get page script
  echo '<script>const carp="'.$carp.'"</script>';
  echo '<script src="aaa_.js"></script>';
  

?>