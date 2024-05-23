<!DOCTYPE html>
<html lang="es" dir="ltr">
  <head>
    
    <?php include '../../aaa_css.php'?>

    <title></title>
  </head>
  <body>

    <?php session_start();$_SESSION['user_id']=null;session_destroy(); ?>

    <?php include '../../aaa_js.php';?>

  </body>
</html>