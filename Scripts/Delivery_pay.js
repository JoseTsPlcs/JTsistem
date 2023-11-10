
var nro = location.search.substring(("?nro=").length);

var input_name = document.getElementById("name");
var input_cel = document.getElementById("cel");

var input_zone = document.getElementById("zone");
var input_dir = document.getElementById("dir");
var input_ref = document.getElementById("ref");
var input_gps = document.getElementById("gps");

var input_position = document.getElementById("PutPosition");
var input_map = document.getElementById("ShowMap");
var input_save = document.getElementById("SaveCliente");

var input_comment = document.getElementById("comment");
var input_total = document.getElementById("total");
var input_metodo = document.getElementById("metodo");
var input_cancelado = document.getElementById("cancelado");
var input_efectivo = document.getElementById('efectivo');

var show_efectivo = document.getElementById('efectivo_show');

var input_pay = document.getElementById('Pay');

GETZONES();

//

$(document).ready(function() {

  function SaveCliente(){

    var datos = new FormData();

    datos.append("name" , input_name.innerHTML);
    datos.append("zone" , input_zone.value);
    datos.append("dir" , input_dir.value);
    datos.append("ref" , input_ref.value);
    datos.append("cel" , input_cel.value);
    datos.append("gps" , input_gps.innerHTML);
    datos.append("metodo" , input_metodo.innerHTML);


    $('#screen_load').show();
    fetch('PHP/Clientes/Cliente_Update_Post.php',{
      method : 'POST',
      body : datos,
    })
    .then(response => response.json())
    .then(data => {
      console.log("Clientes Saved");
      console.log(data);

      $('#screen_load').hide();
    })

  }

  function PutPosition() {
    if(confirm("¿Seguro de cambiar la ubicacion?") == true){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          input_gps.innerHTML = position.coords.latitude + "," + position.coords.longitude;
          SaveCliente();
        });
      } else {
        alert("no puedo tener las coordenadas");
      }
    }
  }

  function DeletePosition() {
    if(confirm("¿Seguro de Borrar la posicion actual?") == true){
      input_gps.innerHTML = "";
      SaveCliente();
    }
  }

  function ShowMap() {
    var location = input_gps.innerHTML.split(',');
    console.log(location);
    if(location.length == 2){
        var rf = String("https://www.google.com/maps/search/?api=1&query=" + location[0] + "," + location[1]);
        console.log(rf);
        window.open(rf);
        //setTimeout(rf,0);
    }
  }

  function Pay() {
    datos = new FormData();

    datos.append('nro', nro);
    datos.append('efectivo', input_efectivo.checked);
    datos.append('uss', Data['user']['id']);

    datos.append('name' , input_name.innerHTML);
    datos.append('zone' , input_zone.value);
    datos.append('dir' , input_dir.value);
    datos.append('ref' , input_ref.value);
    datos.append('gps' , input_gps.innerHTML);

    console.log(datos.get('nro'));
    console.log(datos.get('uss'));
    console.log(datos.get('efectivo'));

    if(input_pay.value == "Cancelar Entrega"){
      fetch('PHP/Delivery/DeliveryPay_Cancel.php',{
        method : 'POST',
        body : datos,
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          var rf = String("location.href='Delivery.php?'");
          setTimeout(rf,0);
      })
    }else {
      fetch('PHP/Delivery/DeliveryPay_Pay.php',{
        method : 'POST',
        body : datos,
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          SaveCliente();

          var rf = info['recoge'] == 1 ? String("location.href='Recoge.php?'")  : String("location.href='Delivery.php?'");
          setTimeout(rf,0);
      })
    }

  }

  datos = new FormData();
  datos.append('nro', nro);
  console.log(datos.get("nro"));

  let info = null;

  fetch('PHP/Delivery/DeliveryPay.php',{
    method : 'POST',
    body : datos,
  })
  .then(response => response.json())
  .then(data => {

    console.log("deliveried");
    console.log(data);
    info = data;
    save = data;
    //console.log(save);

    if(data['recoge'] == 1){
      //$('#cel').hide();
      $('#delivery_dir').hide();
    }

    input_name.innerHTML = data['name'];
    input_cel.value = data['cel'];

    input_zone.value = data['zone'];
    input_dir.value = data['dir'];
    input_ref.value = data['ref'];
    input_gps.innerHTML = data['gps'];
    if(!Coord_Is(data['gps'])){
      input_map.setAttribute("class","d-none");
    }

    input_comment.innerHTML = data['comment'];
    input_total.innerHTML = Format_Money(data['total']);
    input_metodo.innerHTML = data['metodo'];
    input_cancelado.innerHTML = (data['cancelado'] == 1 ? "PAGADO":"PENDIENTE");

    input_cancelado.setAttribute("style","color:" + ((data['cancelado'] == 1 ?"green":"red")));
    if(data['cancelado'] == 1){
      let show_efectivo = document.getElementById("efectivo_show");
      show_efectivo.setAttribute("class" ,"d-none");
    }

    //if(data['metodo'] != "Efectivo") show_efectivo.setAttribute("class", "d-none");

    input_pay.value = data['entregado'] == 1 ? "Cancelar Entrega" : "Entregado";

    $('#screen_load').hide();
  })

  input_zone.addEventListener('keyup', function() {Selection_Zone(input_zone.value , "zone" , null)});

  input_map.addEventListener('click' , ShowMap);
  input_position.addEventListener('click', PutPosition);
  $('#DeletePosition').click(DeletePosition);
  input_save.addEventListener('click', SaveCliente);

  input_pay.addEventListener('click',Pay);


});
