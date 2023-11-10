<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <link rel="stylesheet" href="Styles/Styles.css">
    <title>Armar</title>
  </head>
  <body>

  <nav id='navegator'></nav>

    <div class="row w-100 p-1 m-0">
      <div class="col-sm-3 m-0 p-0 m-1">
        <input class="w-100 h-100" type="date" id = "dateA">
      </div>
      <div class="col-sm-3 m-0 p-0 m-1">
        <input class="w-100 h-100" type="text" id = "filter" placeholder="buscar...">
      </div>
      <div class="col-sm-3 m-0 p-0 m-1">
        <input class = "w-100 h-100 btn btn-outline-success" type="button" id ="Armar" value="Armar">
      </div>
    </div>

    <div class="row w-100 mx-0">

      <div class="col-sm-7">
        <div class="table-responsive">
          <table class="table" id="facturas">

          </table>
        </div>
      </div>

      <div class="col-sm-5">
        <div class="table-responsive">
          <table class="table" id = "total">
            <tr>
              <td>Producto</td>
              <td>Cantidad</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <?php $carp='Case/'; include 'Case/aa_case.php';include 'Case/aa_librarys.php'; $carp=''; ?>
    <script src="Scripts/Base.js"></script>
    <script src="Scripts/Armar.js"></script>
  </body>
</html>
