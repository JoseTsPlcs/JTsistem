<!DOCTYPE html>
<html lang="es" dir="ltr">
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <link rel="stylesheet" href="Styles/Styles.css">
    <title>Facturas</title>
  </head>

  <body>

    <nav id='navegator'></nav>
    <div id="screen_load" class="loader">
      <div class="preloader"></div>
    </div>

    <form class="row m-1"  id="factura" autocomplete="off">
      <!--ANULADO -->
      <div class="col-12 alert alert-danger p-0 text-center d-none" id="anulado alert">
        ANULADO
      </div>
      <!--DATA -->
      <div class="row w-100 m-0">
        <div class="col-md-2 col-sm-3 col-6 p-1 text-center">
          <input class="w-100 h-100 p-10 m-0" type="Date" id = "date" name="date">
        </div>
        <div class="col-md-1 col-sm-2 col-6 p-1 text-center">
          <input class="w-100 h-100 p-0 m-0" type="text" id = "nro" name="nro" placeholder="Nro">
        </div>
      </div>
      <!-- COMPRADOR -->
      <div class="row w-100 m-0 ">
        <!-- CLIENTE -->
        <div id = "cliente_show" class="row w-100 mx-1 my-0">
          <!-- NAME -->
          <div class="col-sm-12 col-12 p-0 m-0 mt-1 pr-sm-1 pr-0">
            <input class="w-100 h-100 p-10 m-0" type="text" id = "name" name="name" placeholder="Nombre">
            <div class="dropdown-mn">
                <div class="dropdown-conteiner" id="name_result"></div>
            </div>
          </div>

          <!-- CEL -->


          <div class="col-sm-6 col-12 p-0 m-0 mt-1 row">

             <div class="col-2 p-0 m-0">Celular:</div>
             <div class="col-10 p-0 m-0">
                 <input class="w-100 h-100" type="text" id="cel" name="cel" placeholder="Celular">
             </div>


          </div>

          <!-- DNI -->
          <div class="col-sm-6 col-12 p-0 m-0 mt-1 row">
            <div class="col-2 p-0 m-0 mt-1">Dni/Ruc:</div>
            <div class="col-10 p-0 m-0 mt-1">
                <input class="w-100 h-100" type="text" id="dni" name="dni" placeholder="Dni">
            </div>
          </div>

        </div>
        <!-- EMPRESA -->
        <div id = "empresa_show" class="row w-100 mx-1 my-0">
          <div class="col-12 p-0 m-0">
            <input class="w-100 p-10 mt-1" type="text" id = "ruc" name="ruc" placeholder="RUC/DNI">
            <input class="w-100 p-10 mt-1" type="text" id="empresa_dir" placeholder="Direccion">
            <input class="w-100 p-10 mt-1" type="text" id="empresa_raz" placeholder="Razon Social">
            <input class = "w-100 mt-1 btn btn-outline-success btn-sm col-12"  type="button" id="Sunat" value="Consultar">
          </div>
        </div>

        <!-- RECOGE -->
        <div class="d-flex align-items-center col-12 p-1">
          <input type="checkbox" id="recoge" name="recoge">
          <label class="ml-1 my-0" for="recoge">Recoge</label>
        </div>
      </div>
      <!-- DESPACHO -->
      <div class="row w-100 m-0" id="cliente_Info_delivery">
        <!-- DELIVERY -->
        <div class="col-sm-6 col-12 p-1">
          <select class="w-100 h-100" id="trabajador_delivery">
            <option value="0">DELIVERY 1</option>
            <option value="1">DELIVERY 2</option>
            <option value="2">DELIVERY 3</option>
            <option value="3">DELIVERY 4</option>
          </select>
        </div>
        <!-- ZONE -->
        <div class="col-sm-6 col-12 p-1">
          <input class="w-100 h-100" type="text" id="zone" name="zone" placeholder="Zona">
          <div class="dropdown-mn">
              <div class="dropdown-conteiner" id="zone_result"></div>
          </div>
        </div>
        <!-- DIR -->
        <div class="col-md-6 p-1 m-0">
          <div class="col-12 m-0 p-0">
            <input class="w-100 h-100" type="text" id="dir" name="dir" placeholder="Direccion">
          </div>
        </div>
        <!-- GPS -->
        <div class="col-md-6 p-1 m-0">
          <div class="col-12 p-0 m-0">
            <div class="col-12 m-0 p-0">
              <input class="w-100 h-100" type="text" id="gps" name="gps" placeholder="GPS">
            </div>
            <div class="col-12 m-0 p-0 my-1">
              <label class="w-100 h-100 text-center p-0 m-0 alert d-none" id="gps_result">empty</label>
            </div>
          </div>
        </div>
        <!-- REF -->
        <div class="col-12 p-1">
          <div class="w-100 h-100 m-0 p-0">
            <textarea class="w-100 h-100" id="ref" name="ref" placeholder="Referencia"></textarea>
          </div>
        </div>
        <!-- DELIVERY GRATIS -->
        <div class="col-sm-6 col-12 p-1">
          <input type="checkbox" id="deliv_free" name="deliv_free">
          <label class="ml-1 my-0" for="deliv_free">Delivery Gratis</label>
        </div>
      </div>
      <!-- METODO -->
      <div class="row w-100 m-0" id = "Metodo">

        <div class="col-md-6 p-1">
          <textarea class="w-100 h-100" id = "comment" name="name" rows="3" placeholder="Comentario..."></textarea><br>
        </div>

        <div class="row w-100 m-0">
          <!-- METODO -->
          <div class="col-sm-4 col-4 p-1 mx-0">
            <select class="w-100" id = "metodo">
              <option value="0"> METODO 1 </option>
              <option value="1"> METODO 2 </option>
              <option value="2"> METODO 3 </option>
              <option value="3"> METODO 4 </option>
            </select>
          </div>
          <!-- DOCUMENTO -->
          <div class="col-sm-4 col-4 p-1 mx-0">
            <select class="w-100" id = "documento">
              <option value="0"> DOCUMENTO 1 </option>
              <option value="1"> DOCUMENTO 2 </option>
              <option value="2"> DOCUMENTO 3 </option>
              <option value="3"> DOCUMENTO 4 </option>
            </select>
            <!-- <input class="w-100" value ="boleta" type="text" id="documento" name="metodo" placeholder="documento"><br>
            <div class="dropdown-mn">
              <div class="dropdown-conteiner" id="documento_result"></div>
            </div> -->
          </div>
          <!-- CAJERO -->
          <div class="col-sm-4 col-4 p-1 mx-0">
            <select class="w-100" id = "cajero">
              <option value="0"> CAJERO 1 </option>
              <option value="1"> CAJERO 2 </option>
              <option value="2"> CAJERO 3 </option>
              <option value="3"> CAJERO 4 </option>
            </select>
            <!-- <input class="w-100" value ="boleta" type="text" id="documento" name="metodo" placeholder="documento"><br>
            <div class="dropdown-mn">
              <div class="dropdown-conteiner" id="documento_result"></div>
            </div> -->
          </div>
          <!-- PAGADO -->
          <div class="col-sm-3 col-6 p-1 mx-0">
            <div class=" d-flex align-items-center col-12 p-0">
              <input type="checkbox" id="cancelado" name="cancelado">
              <label class="w-100 mx-1 my-0" for="cancelado">Pagado</label>
            </div>
          </div>
          <!-- ENTREGADO -->
          <div class="col-sm-3 col-6 p-1 mx-0">
            <div class="d-flex align-items-center col-12 p-0">
              <input type="checkbox" id="entregado" name="entregado">
              <label class="ml-1 my-0" for="entregado">Entregado</label>
            </div>
          </div>
          <!-- ARMADO -->
          <div class="col-sm-3 col-6 p-1 mx-0">
            <div class="d-flex align-items-center col-12 p-0">
              <input type="checkbox" id="armado" name="armado">
              <label class="ml-1 my-0" for="armado">Armado</label>
            </div>
          </div>
          <!-- CONFIRMADO -->
          <div class="col-sm-3 col-6 p-1 mx-0">
            <div class="d-flex align-items-center col-12 p-0">
              <input type="checkbox" id="confirmado" name="confirmado">
              <label class="ml-1 my-0" for="confirmado">Confirmado</label>
            </div>
          </div>
        </div>
      </div>
      <!-- PRODUCTOS -->
      <div class="row w--100 m-0 p-1">

        <div class="row w-100 p-0 m-0" id="Venta">
          <div class="text-center border border-dark col-1 m-0 p-0 text-center">
            cant
          </div>
          <div class="text-center border border-dark col-2 m-0 p-0 text-center">
            Info
          </div>
          <div class="text-center border border-dark col-7 m-0 p-0 text-center">
            Producto
          </div>
          <div class="text-center border border-dark col-1 text-center p-0 m-0 d-md-block d-none">
            Precio
          </div>
          <div class="text-center border border-dark col-md-1 col-2 text-center p-0 m-0">
            Total
          </div>
        </div>

        <button type="button" class="my-1 btn btn-success col-12" id="AddProduct">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
              </svg>
              Add Product
            </button>

        <div class="row w-100 m-0">
           <div class="col-12 p-1" id="delivery_show">
             <label>Delivery:</label>
             <input class="col-1 text-center p-0" type="text" id = "delivery" name = "delivery" value="0">
           </div>
           <div class="col-12 p-1" id="descuento_show">
             <label>Descuento %:</label>
             <input class="col-1 text-center p-0" type="text" id = "descuento" name = "descuento" value="0">
           </div>
           <div class="col-12 p-1" id="subtotal_show">
             <label>SubTotal:</label>
             <label id="subtotal">0S/.</label>
           </div>
           <div class="col-12 p-1" id="igv_show">
             <label>IGV:</label>
             <label id="igv">0S/.</label>
           </div>
           <div class="col-12 p-1">
             <label>Total:</label>
             <label id="total">0S/.</label>
           </div>
         </div>

      </div>
      <!-- BUTTONS -->
      <div class ="row w-100 m-0 d-flex justify-content-center" id ="buttons">
        <input class = "my-1 btn btn-outline-success btn-lg col-sm-3"  type="button" id="Add" value="Nuevo">
        <input class = "my-1 btn btn-outline-success btn-lg col-sm-3" type="button" id="Search" value="Buscar">
        <input class = "my-1 btn btn-outline-success btn-lg col-sm-3" type="button" id="Clear" value="Limpiar">
        <input class = "d-none my-1 btn btn-outline-danger btn-lg col-sm-3" type="button" id="Anulado" value="Anulado">
      </div>

    </form>

    <?php $carp='Case/'; include 'Case/aa_case.php';include 'Case/aa_librarys.php'; $carp=''; ?>
    <script src="Scripts/Base.js"></script>
    <script src="Scripts/Factura.js"></script>
  </body>
</html>
