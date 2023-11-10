
//Selection
function SetBar_db_Key(id , ops, key, action) {

  var br = document.getElementById(id);
  var br_rst = document.getElementById(id + "_result");

  //console.log("test br on bar id: " + i);
  //console.log(br);

  var tx = br.value;
  br_rst.innerHTML = "";

  if(tx != ""){
    for (let op of ops) {

      op_ok = false;
      op_array = op[key].split(" ");
      //console.log("op[key]: " + op[key]);

      for (var i = 0; i < op_array.length; i++) {

        if(op_array[i].toLowerCase().substr(0,tx.length) == tx.toLowerCase()){

          //TEXTO DE OPCIONES
          let txt_op =  "";
          //TEXTO EN NEGRITA
          for (var u = 0; u < op_array.length; u++) {
            if(u == i) txt_op += "<b>" + op_array[u].substr(0,tx.length) + "</b>" + op_array[u].substr(tx.length) + " ";
            else txt_op += op_array[u] + " ";
          }

          //ADD OPTION
          AddOptionBar(br, br_rst, txt_op, op[key], op, action);

          break;
        }
      }

    }
  }


  //if(i == "")br_rst.innerHTML="";

}

function SetBar_db(id , ops , action) {

  var br = document.getElementById(id);
  var br_rst = document.getElementById(id + "_result");

  //console.log("test br on bar id: " + i);
  //console.log(br);

  var tx = br.value;
  br_rst.innerHTML = "";

  if(tx != ""){
    for (let op of ops) {

      op_ok = false;
      op_array = op.split(" ");

      for (var i = 0; i < op_array.length; i++) {
        if(op_array[i].toLowerCase().substr(0,tx.length) == tx.toLowerCase()){

          //TEXTO DE OPCIONES
          let txt_op =  "";
          //TEXTO EN NEGRITA
          for (var u = 0; u < op_array.length; u++) {
            if(u == i) txt_op += "<b>" + op_array[u].substr(0,tx.length) + "</b>" + op_array[u].substr(tx.length) + " ";
            else txt_op += op_array[u] + " ";
          }

          //ADD OPTION
          AddOptionBar(br, br_rst, txt_op, op, op, action);

          break;
        }
      }

    }
  }


  //if(i == "")br_rst.innerHTML="";

}

function SetBar_wait(i) {

  var br = document.getElementById(i);
  var br_rst = document.getElementById(i + "_result");

  //console.log("test br on bar id: " + i);
  //console.log(br);

  var tx = br.value;
  br_rst.innerHTML = "Loading...";
}

function SetBar_db_All(id , ops , update) {

  var br = document.getElementById(id);
  var br_rst = document.getElementById(id + "_result");

  var tx = br.value;
  br_rst.innerHTML = "";

  for (let op of ops) AddOptionBar(br, br_rst, op, op, op, update);

}

function AddOptionBar(br, br_rst, txt_op, txt_resp, op, action) {

  //CREAR ITEM
  var item = document.createElement("li");
  item.setAttribute("class", "text-left");

  //MODIFICAR ITEM
  item.innerHTML = txt_op;
  item.addEventListener('click',function() {
    br.value = txt_resp;
    br_rst.innerHTML = "";
    if(action != null) action(op);
  });

  //AGREGAR ITEM
  br_rst.appendChild(item);
}

function Selection_Name(nm, id, update) {

  var datos = new FormData();
  datos.append('name', nm);
  //console.log(datos.get('name'));

  SetBar_wait(id);

  fetch('PHP/Clientes/Cliente_Get.php',{
    method : 'POST',
    body : datos,
  })
  .then(response => response.json())
  .then(data => {
    SetBar_db(id,data['name'],update);
  })

}

function Selection_Zone(zn , id , update) {
  SetBar_db(id,Data['zones']['zones'],update,true,false);
}

function Selection_Products(prd , id , update) {
  SetBar_db(id, Data['products']['product'], update,true,false);
}

function Selection_Materiales(mtr , id , update) {
  SetBar_db(id, Data['materiales']['material'], update,true,false);
}

function Selection_Users(uss , id , update) {
  var datos = new FormData();
  datos.append('user', uss);
  //console.log(datos.get('name'));

  fetch('PHP/Users/Users_Get.php',{
    method : 'POST',
    body : datos,
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data['user']);
    SetBar_db(id,data['user'],update);
  })
}
function Open_Users(id , update) {
  SetBar_db_All(id,Data['metodo'],update);
}

function Selection_Metodo(id , update) {
  SetBar_db(id,Data['metodo'],update);
}
function Open_Metodo(id , update) {
  SetBar_db_All(id,Data['metodo'],update);
}

function Selection_Documento(id , update) {
  SetBar_db(id,Data['documento'],update);
}
function Open_Documento(id , update) {
  SetBar_db_All(id,Data['documento'],update);
}

function Selection_Info(id , update) {
  SetBar_db(id,Data['info']['show'],update,true,false);
}
function Open_Info(id , update) {
    SetBar_db_All(id,Data['info']['show'],update);
}

function Edit_Select_AddOptions(select , options, ids) {

  for (var i = 0; i < options.length; i++) {

    var op =  document.createElement("option");

    op.value = ids == null ? i : ids[i];
    op.innerHTML = options[i];
    select.appendChild(op);
  }

}

//SHOW

var SHOWING = {
  entregado : ["PENDIENTE", "ENTREGADO"],
  cancelado : ["PENDIENTE", "PAGADO"]
}

function ShowState_Cancelado(id, extraclass) {
  let clss = "text-center " + extraclass + " alert ";
  ShowState(SHOWING['cancelado'][0],SHOWING['cancelado'][1], clss + "alert-danger","alert-primary");
}

function ShowState(ok,error,id,okclass,errorclass) {
  let btn = document.getElementById(id);
  if(btn){
    if(btn.innerHTML == ok){
      btn.setAttribute("class",errorclass);
      btn.innerHTML = error;
    }else {
      btn.setAttribute("class",okclass);
      btn.innerHTML = ok;
    }
  }
}

function ShowAlert(id, show , extraclass) {
  var div = document.getElementById(id);
  if(div){
    if(show){
      div.setAttribute("class", "d-block " + extraclass);
    }else {
      div.setAttribute("class", "d-none");
    }
  }
}

function States_Change(dom , active , active_nm , active_attr , disactive_nm , disactive_attr) {
  if(active){
    dom.innerHTML = active_nm;
    dom.setAttribute("class" , active_attr);
  }else {
    dom.innerHTML = disactive_nm;
    dom.setAttribute("class" , disactive_attr);
  }
}

function States_PutChange(dom , active_nm , active_attr , disactive_nm , disactive_attr) {

  var change = dom.innerHTML == active_nm;
  States_Change(dom, !change , active_nm , active_attr , disactive_nm , disactive_attr);

}

//Formats

var Format_Money = function(money){

  /*var mn_array = money.split(".");
  if(mn_array.length == 1){
    money += ".0";
  }*/

  return Data['money'] + money;
}

var Format_Count = function(cnt) {
  if(cnt == "" || cnt == " "){
    return 0;
  }else {
    return parseFloat(cnt);
  }
}

var Date_Today = function() {
  var today = new Date();
  return today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}

var Date_Time = function() {

  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  return time;
}

function Today_Time(seconds) {

  var today = new Date();
  return ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2) + (seconds ? ( ":" + ('0' + today.getSeconds()).slice(-2)) : "");
}

function Today_Date() {

  var today = new Date();
  return today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
}

function Today_Date_Time(seconds) {

  var today = new Date();
  var date = Today_Date();
  var time = Today_Time(seconds);
  var dateTime = date+'T'+time;
  return dateTime;
}

var Time_Lapse = function(start, end) {

  var st = start.getTime();
  var e = end.getTime();
  var dif = e - st;

  if(dif <= 0){
    return "00:00";
  }else {

    // console.log(st);
    // console.log(e);

    var t_h = (dif /(1000 * 60 * 60)).toFixed(0);
    var t_m = dif /(1000 * 60);
    if(t_m > 59) t_m -=  t_h * 60;
    t_m = t_m.toFixed(0);

    return t_h.padStart(2,"0") + ":" + t_m.padStart(2,"0");
  }

  var time = today.getHours() + ":" + today.getMinutes();
  return time;
}

var Coord = function (url) {
  //url = "https://maps.google.com/maps?q=-5.1522885%2C-80.6243902&z=17&hl=es";
  //url = "https://www.google.com/maps/place/Arctic+Pixel+Digital+Solutions/@63.6741553,-164.9587713,4z/data=!3m1!4b1!4m5!3m4!1s0x5133b2ed09c706b9:0x66deacb5f48c5d57!8m2!3d64.751111!4d-147.3494442";
  var regex = new RegExp('@(.*),(.*),');
  var lon_lat_match = url.match(regex);
  if(lon_lat_match != null && lon_lat_match.length >= 3){
    var lon = lon_lat_match[1];
    var lat = lon_lat_match[2];
    return lon + "," + lat;
  }else {
    var regex = new RegExp('q=(.*)%2C(.*)&z=');
    var lon_lat_match = url.match(regex);
    if(lon_lat_match != null && lon_lat_match.length >= 3){
      var lon = lon_lat_match[1];
      var lat = lon_lat_match[2];
      return lon + "," + lat;
    }else {
      return url;
    }
  }
}

var Coord_Is = function(coord) {

  if(coord != null){

    var array_coord = coord.split(",");
    return array_coord.length == 2 ? true : false;
  }else {

    return false;
  }
}

function Coord_Alert(id , gps , extraclass) {
  let alert = document.getElementById(id);
  let input = document.getElementById(gps);
  if(alert && input){
    coord = Coord(input.value);
    if(coord == ""){
      alert.setAttribute("class","d-none");
    }else {
      if(!Coord_Is(coord)){
        alert.setAttribute("class",extraclass + " text-center p-0 m-0 alert alert-danger");
        alert.innerHTML = "unknown coord";
        //alert.innerHTML = coord;
      }else {
        alert.setAttribute("class",extraclass + " text-center p-0 m-0 alert alert-primary");
        alert.innerHTML = coord;
      }
    }
  }
}

var Clear_array = function(array) {
  var nr = [];
  for (var i = 0; i < array.length; i++) {
     if(array[i] != ""){

       var add = true;
       for (var u = 0; u < nr.length; u++) {
         if(nr[u].toLowerCase() == array[i].toLowerCase()){
           add = false;
           break;
         }
       }

       if(add){
          nr.push(array[i]);
       }

     }
  }
  return nr;
}

var Split_array = function(txt , separadores){
  let array = [];
  for (let sep of separadores) {
    for (let op of  txt.split(sep)) {
      array.push(op);
    }
  }
  array = Clear_array(array);
  return array;
}

//ARRAY OBJECT

var ArrayOfKey = function(array , key){

  let arr = [];
  for (var i = 0; i < array.length; i++) {
    arr.push(array[i][key]);
  }
  return arr;
}

//Data

Data = {
  user : {
    user : "",
    estado : "ACTIVO",
    id : 0,
    class : ""
  },
  pages : [],
  Page_ID : 0,
  users: {
    Id: [],
    User: []
  },

  money : "S/.",

  count: 0,
  documento : ["nota de pago","boleta","factura"],
  metodo : ["Efectivo" , "BCP", "BBVA" , "Interbank"],
  info : {
    unidad : ["UNIDAD","KILO","KILO","KILO","KILO","KILO","KILO"],
    table : ["one","100g","250g","500g","1kg","1kg>","5kg>"],
    show : ["","100g","250g","500g","1kg","3kg>","5kg>"],
    showtable : ["One","100g","250g","500g","1kg","2kg:4kg","5kg>"],
    count : [1,0.1,0.25,0.5,1,1,1],
    min : [1,1,1,1,1,3,5],
    max : [999,999,999,999,999,4,999]
  },
  unidad : ["KILO","UNIDAD"],
  products : [],
  materiales : [],

  zones : [],
  delivs : []
}

Show = {
  buttons : {
    add : "Añadir",
    search : "Buscar",
    save : "Guardar",
    clear: "Limpiar",
    anular : "Anular",
    cancel_anulado : "Cancelar Anulado"
  },
  factura :{
    products : {
      info : "info",
      count : "cantidad",
      idk : "I dont Know",
      nostock : "no stock"
    }
  },
}

// fetch('PHP/Page/Page_UserInfo.php')
// .then(response => response.json())
// .then(data => {
//   //console.log(data);
//   Data['user']['user'] = data['user'];
//   Data['user']['estado'] = data['estado'];
//   Data['user']['id'] = data['id'];
//   Data['user']['class'] = data['class'];
//   Data['pages'] = data['pages'];
//   //console.log("all data get");
//   //console.log(data);
//
//   if(data['user'] == "" || data['estado'] != "ACTIVO"){
//     setTimeout("location.href='Login.php?'",0);
//   }else {
//     CreateNav(Data['pages']);
//   }
// })

function GETZONES(update){
  //console.log("zones");
  fetch('PHP/Zone/Zone_Info.php')
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    Data['zones'] = data;
    //console.log(Data);

    if(update != null) update();
  })
}

function ZONEID_BYNAME(zn) {
  //console.log("Zone: " + zn + " by ID ");
  zone_index = Data['zones']['zones'].indexOf(zn);
  if(zone_index!=-1){
    let id = Data['zones']['id'][zone_index];
    //console.log("id of " +zn);
    //console.log(id);
    return id;
  }
  return -1;
}

function GETUSERS(action) {

  fetch('PHP/Users/Users_Data.php')
  .then(response => response.json())
  .then(data => {
    //console.log("Users:");
    //console.log(data);

    Data['Users'] = data;

    if(action!= null) action();
  })
}

function GETPRODUCTS(update) {
  console.log(".....get products");
  fetch('PHP/Products/Products_Info.php')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    Data['products'] = data;
    console.log("Lista de Productos:");
    //console.log(Data['products']);
    if(update!= null) update();
  })
}

function GETMATERIALES(update) {

  fetch('PHP/Materiales/Materiales_Data.php')
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    Data['materiales'] = data;
    //console.log("Lista de Materiales:");
    //console.log(Data['materiales']);
    if(update!= null) update();
  })
}

function GETFACTURACOUNT(action) {
  fetch('PHP/Factura/Factura_Count.php')
  .then(response => response.json())
  .then(data => {
    Data['count'] = data;
    if(action != null) action();
  })
}

//NAVEGATION
function ChangePage(id, t , extra){
  for (var i = 0; i <   Data['pages'].length; i++) {
      if(Data['pages'][i]['id'] == id){
        let link = String("location.href='" + Data['pages'][i]['url'] + extra + "'");
        setTimeout(link,t);
        return;
      }
  }
  console.log("no access to " + id);
}

function CreateNav(pages) {

  var nav = document.getElementsByTagName('nav')[0];
  //console.log(nav);

  nav.setAttribute("class", "navbar navbar-expand-lg navbar-dark bg-success");

  nav.innerHTML += `
  <span class="navbar-brand mb-0 h1">QK</span>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">

      <!-- VENTAS -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="Control.php" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Ventas
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="Factura.php" id="page_0">Venta</a>
          <a class="dropdown-item disabled" href="#" id="page_">Horario</a>
        </div>
      </li>

      <!-- CONTROL -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="Control.php" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Control
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="Control.php" id="page_1">Control</a>
          <a class="dropdown-item" href="Report.php" id="page_2">Reporte</a>
          <a class="dropdown-item" href="Facturacion.php" id="page_33">Facturacion</a>
          <a class="dropdown-item" href="Caja.php" id="page_10">Caja Chica</a>
          <a class="dropdown-item" href="Transacciones.php" id="page_15">Transacciones</a>
          <a class="dropdown-item disabled" href="Movimientos.php" id="page_16">Movimientos</a>
        </div>
      </li>

      <!-- CLIENTES -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Clientes
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="Clientes.php" id="page_3">Clientes</a>
          <a class="dropdown-item disabled" href="#">Entes</a>
          <a class="dropdown-item disabled" href="#">Ubicaciones</a>
        </div>
      </li>

      <!-- ARMAR -->
      <li class="nav-item">
        <a class="nav-link" href="Armar.php" id="page_5">Armar</a>
      </li>

      <!-- PRODUCTOS -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Productos
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="Products.php" id="page_4">Productos</a>
          <a class="dropdown-item disabled" href="#">Recetas</a>
          <a class="dropdown-item disabled" href="#">Mercancia</a>
        </div>
      </li>

      <!-- ALMACEN -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Almacen
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="Almacen.php" id="page_13">Almacenes</a>
        </div>
      </li>

      <!-- DESPACHO -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Despacho
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="Delivery.php" id="page_6">Delivery</a>
          <a class="dropdown-item disabled" href="#">Carreras</a>
          <a class="dropdown-item" href="Recoge.php" id="page_11">Recoge</a>
          <a class="dropdown-item" href="Zone.php" id="page_14">Zonas</a>
        </div>
      </li>

      <!-- USERS -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="Control.php" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Usuario
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item disabled" href="#">Perfil</a>
          <a class="dropdown-item disabled" href="#">Paginas</a>
          <a class="dropdown-item" href="LogOut.php" id="page_8">Salir</a>
        </div>
      </li>

    </ul>
    <!-- <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form> -->
  </div>
  `;

  for (var i = 0; i < 20; i++) {

    var pag = document.getElementById("page_" + i);
    if(pag){

      var find = false;
      for (var p = 0; p < pages.length; p++) {
        if(pages[p]['id'] == i){
          find = true;
          break;
        }
      }

      if(find){

      }else {
        pag.className += " disabled";
      }

    }

  }

  //console.log("Pages:");
  //console.log(pages);

}

//CREATE
function Create_Selection(options, update , clear , start) {

  //SELECT
  let select = document.createElement("select");
  select.addEventListener("change" , update);

  select.setAttribute("class" , "form-control form-control-sm");

  for (var i = 0; i < options.length; i++) {
    let op = document.createElement("option");
    op.innerHTML =  options[i];
    select.appendChild(op);
  }

  if(clear) select.appendChild(document.createElement("option"));

  select.value = start;

  return select;
}

function CreateSelection_User(update , start , clear) {
  return Create_Selection(Data['Users']['user'], update , clear, start);
}

function CreateSelection_Metodo(update, start) {
  return Create_Selection(Data['metodo'], update, false, start);
}

function CreateHeader(head, at , vl){
  let hd = document.createElement("th");
  for (var i = 0; i < at.length; i++) {
    hd.setAttribute(at[i],vl[i]);
  }
  hd.setAttribute("class","text-center");
  hd.innerHTML = head;
  return hd;
}

function Createtd(html , at , vl) {
  let td = document.createElement("td");
  td.innerHTML = html;
  for (var i = 0; i < at.length; i++) {
    td.setAttribute(at[i],vl[i]);
  }
  return td;
}

function CreateInput(i_value, at , vl){
  let input = document.createElement("input");
  input.value = i_value;
  for (var i = 0; i < at.length; i++) {
    input.setAttribute(at[i],vl[i]);
  }
  input.setAttribute("type","text");
  return input;
}

function CreateTableInput(i_value , at, vl){
  let input = CreateInput(i_value , at, vl);
  let td = document.createElement("td");
  td.appendChild(input);
  return td;
}

function CreateInputOp(id , value , update) {

  let bd = document.createElement("div");

  let input = document.createElement("input");
  input.value = value;
  input.setAttribute("id" , id);
  input.addEventListener('keyup',update);

  let mn = document.createElement("div");
  mn.setAttribute("class","dropdown-mn");

  let rst = document.createElement("div");
  rst.setAttribute("id", id+"_result");

  mn.appendChild(rst);
  bd.appendChild(input);
  bd.appendChild(mn);

  return bd;

}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

//CREATE START


//NEW
