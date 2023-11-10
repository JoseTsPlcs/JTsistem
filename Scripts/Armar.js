

$(document).ready(function() {

  new Pag_Base({

    success:()=>{

      
    }
  });

$('#dateA').val(Date_Today);
$('#Armar').click(Armar);
//$('#filter').keyup(Armar);

let info = null;

function GetInfo(update) {

  //console.log("armar");
  var datos = new FormData();
  datos.append('dateA',dateA.value);
  datos.append('filter',filter.value);
  //console.log(datos.get("filter"));

  fetch('PHP/Armar/Armar.php',{
    method : 'POST',
    body : datos,
  })
  .then(response => response.json())
  .then(data => {

    info = data;
    console.log("----INFO----");
    console.log(info);

    if(update) update();

  })

}

function GetInfo_BuildIndexByNro(nro) {

  for (var i = 0; i < build_info.length; i++) {
    // console.log(build_info['data'][i]);
    if(build_info[i]['nro'] == nro){
      return i;
    }
  }
  return -1;
}

function GetInfo_BuildByNro(nro){
  // console.log("search build with nro " + nro);
  for (var i = 0; i < build_info.length; i++) {
    // console.log(build_info['data'][i]);
    if(build_info[i]['nro'] == nro){
      return build_info[i];
    }
  }
  return null;
}

function GetInfo_InfoByNro(nro){
  for (var i = 0; i < info.length; i++) {
    if(info[i]['nro'] == nro){
      return info[i];
    }
  }

  return null;
}

function Build_Clear() {
  build_info['started'] = false;
  build_info['total'] = 0;
  build_info['data'] = [];

  $('#facturas').html("");
}

var build_started = false;
var build_info = [];

function Build() {

  if(info != null){

    //console.log("info");
    //console.log(info);

    for (var i = 0; i < info.length; i++) {

      //FIND BUILD WITH SAME NRO
      var build = GetInfo_BuildByNro(info[i]['nro']);

      //EXIST?
      if(!build){
        //ADD
        Build_Nro_Add(info[i]);
      }else {
        //UPDATE
        Build_Nro_Update(info[i]);
      }

    }

    //console.log("builds:");

    //console.log(build_info);

    //REMOVE EXTRA BUILDS
    for (var i = 0; i < build_info.length; i++) {

      //console.log("info: " + build_info[i]['nro']);
      var inf = GetInfo_InfoByNro(build_info[i]['nro']);
      //console.log(inf);
      if(!inf) Build_Nro_Remove(build_info[i]);
    }

    //console.log("builds:");
    //console.log(build_info);


    //Build_Clear();
    //for (var i = 0; i < info.length; i++) Build_Nro_Add(info[i])

    build_started = true;


  }else {

    console.log("info is null");
  }

}

//BUILD NRO

function Build_Nro_Add(fct) {

  console.log("ADD " + fct['name']);

  Build_Nro_Create(fct);

  if(build_started)$('#table' + fct['nro']).hide();
  Build_Nro_Print(fct);

  if(build_started) $('#table' + fct['nro']).show("slow");

  //DATA
  build_info.push(fct);

}

function Build_Nro_Create(fct) {

  var k = fct['nro'];
  //console.log(fct);
  //console.log("CREATE " + k);

  var bd_fct = document.getElementById("facturas");
  var bd_total = document.getElementById("total");

  //TABLE
  var table = document.createElement("div");
  table.setAttribute("id" , "table" + k);
  table.setAttribute("class"," m-1 border");
  bd_fct.appendChild(table);

  //HEADER
  var tr_h = document.createElement("div");
  tr_h.setAttribute("id","show" + k);
  tr_h.setAttribute("class","d-flex justify-content-start border-danger border border-dark text-black");
  table.appendChild(tr_h);

  //NAME
  var tb_name = document.createElement("div");
  tb_name.setAttribute("id", k + "name");
  tb_name.setAttribute("class","col-4 text-center m-0");
  //tb_name.innerHTML = (fct['name'] ? fct['name'].toLowerCase() : "") + " (" + (fct['products'].length) + ")";
  tr_h.appendChild(tb_name);

  //ZONE
  var tb_zone = document.createElement("div");
  tb_zone.setAttribute("id",k + "zone");
  tb_zone.setAttribute("class","col-4 text-center m-0");
  // let i_zn = fct['zone'] ? fct['zone'].toLowerCase() : "";
  // if(fct['recoge'] == 1) i_zn = "Recoge";
  //tb_zone.innerHTML = i_zn;
  tr_h.appendChild(tb_zone);

  //METODO DE PAGO
  var tb_pago = document.createElement("span");
  tb_pago.setAttribute("id",k + "pago");
  tb_pago.setAttribute("class","col-4 align-middle m-0");
  //tb_pago.innerHTML = fct['cancelado'] == 1 ? "PAGADO" : ("PAGA EN " + fct['metodo'].toUpperCase());
  tr_h.appendChild(tb_pago);

  //BODY
  var tr_body = document.createElement("div");
  tr_body.setAttribute("id", "body" + k);
  table.appendChild(tr_body);

  $('#body' + k).hide();
  $('#show' + k).click(function() {
    $('#body' + k).toggle("slow" , Calculate);
  });

  var arm_btn = document.createElement("div");
  arm_btn.setAttribute("id", "btn" + k);
  arm_btn.setAttribute("class" , "col-12");
  let i_nro = fct['nro'];
  arm_btn.addEventListener('click',function() {
    let d_armado = new FormData();
    d_armado.append('nro', i_nro);

    fetch('PHP/Armar/Armar_Armado.php',{
      method : 'POST',
      body : d_armado,
    })
    .then(response => response.json())
    .then(info => {
      Armar();
      $('#body' + k).hide("slow");
      //location.reload();
    })
  })
  tr_body.appendChild(arm_btn);

  //PRODUCTOS
  var prd_div = document.createElement("div");
  prd_div.setAttribute("class" , "col-12 m-0 p-0");
  prd_div.setAttribute("id", "products" + k);
  tr_body.appendChild(prd_div);

  for (var u = 0; u < fct['products'].length; u++) {
     Build_Line_Add(k , u, fct['products'][u], false);
  }

  //DELIVERY
  var tr_delivery = document.createElement("div");
  tr_delivery.setAttribute("id",k + "deliv")
  tr_delivery.setAttribute("class", "col-12 text-left border border-dark")
  //tr_delivery.innerHTML = "Delivery: " + Format_Money(fct['delivery']);
  tr_body.appendChild(tr_delivery);

  //TOTAL
  var tr_total = document.createElement("div");
  tr_total.setAttribute("id",k + "total");
  tr_total.setAttribute("class", "col-12 text-left border border-dark");
  //tr_total.innerHTML = "Total: " + Format_Money(fct['total']);
  tr_body.appendChild(tr_total);

  //COMMENT
  var tb_comment = document.createElement("div");
  var tb_comment_content = document.createElement("div");
  tb_comment.appendChild(tb_comment_content);
  tb_comment.setAttribute("id", k + "comment");
  tb_comment.setAttribute("class", "border border-dark p-1 text-center");
  tb_comment_content.innerHTML = fct['comment'];
  tr_body.appendChild(tb_comment);

}

function Build_Nro_Print(fct) {

  Build_Nro_Print_Products(fct);
  Build_Nro_Print_HeaderTotal(fct);

}

function Build_Nro_Print_HeaderTotal(fct) {

  var nro = fct['nro'];

 //HEADER
 tr_h = document.getElementById("show" + nro);
 tr_h.setAttribute("class","d-flex justify-content-start border-danger border border-dark " + (fct['armado'] == 1 ? "bg-success text-white" : "bg-danger text-white"));

 var arm_btn = document.getElementById("btn" + nro);
 arm_btn.innerHTML = fct['armado'] == 1 ? "DESARMAR" : "ARMAR";
 arm_btn.setAttribute("class" , "col-12 btn btn-outline-" + (fct['armado'] == 1 ? "danger" : "success"));

 $('#' + nro + "name").html((fct['name'] ? fct['name'].toLowerCase() : "") + " (" + fct['products'].length + ")");
 $('#' + nro + "zone").html(fct['recoge'] == 1 ? "RECOGE" : (fct['zone']  ? fct['zone'].toLowerCase() : ""));

 $('#' + nro + "pago").html(fct['confirm'] == 1 ? "CONFIRMADO" : "FALTA CONFIRMAR");

 //TOTAL
 $('#' + nro + "deliv").html("Delivery: " + Format_Money(fct['delivery']));
 $('#' + nro + "total").html("Total: " + Format_Money(fct['total']));

 if(fct['comment'] == "") $('#' + nro + "comment").hide("slow");
 else{
   $('#' + nro + "comment").html(fct['comment']);
   $('#' + nro + "comment").show("slow");
 }

}

function Build_Nro_Print_Products(fct) {

  //PRODUCTS
  for (var i = 0; i < fct['products'].length; i++) {

    Build_Line_Print(fct['nro'] , i , fct['products'][i]);
  }

}

function Build_Nro_Update(fct) {

  var nro = fct['nro'];
  var bld = GetInfo_BuildByNro(nro);

  if(!bld) console.log("ERROR " + nro + " NO EXIST, CANT UPDATE");
  else console.log("UPDATE " + fct['name']);

  //UPDATE
  Build_Nro_Print_HeaderTotal(fct);


  //REMOVE OR ADD PRODUCTS
  var mx = fct['products'].length > bld['products'].length ? fct['products'].length : bld['products'].length;
  for (var i = 0; i < mx; i++) {

    var prd_fct = i < fct['products'].length ? fct['products'][i] : null;
    var prd_bld = i < bld['products'].length ? bld['products'][i] : null;

    if(prd_bld || prd_fct){

      if(prd_bld && prd_fct){
        //UPDATE
        Build_Line_Print(nro , i , prd_fct);
      }

      if(!prd_bld && prd_fct){
        //ADD
        Build_Line_Add(nro , i , fct['products'][i]);
      }

      if(prd_bld && !prd_fct){
        //REMOVE
        Build_Line_Remove(nro , i);
      }

    }
  }

  var bld_index = GetInfo_BuildIndexByNro(nro);
  build_info[bld_index] = fct;

}

function Build_Nro_Remove(fct) {

  var nro = fct['nro']
  console.log("REMOVE " + fct['name']);
  //$('#table'+nro).remove();

  // console.log("after: " + build_info.length );
  // console.log(build_info);

  var index = build_info.indexOf(fct);
  build_info.splice(index, 1);

  $('#table'+nro).hide("slow", function() {
    $('#table'+nro).remove();
  })

  // console.log("before: " + build_info.length);
  // console.log(build_info);

}

//BUILD LINE

function Build_Line_Add(k, u, prd) {

  console.log("Add Line " + u);

  Build_Line_Create(k,u);
  if(build_started) $('#line' + u + "of" + k).hide();

  Build_Line_Print(k,u,prd);
  if(build_started) $('#line' + u + "of" + k).show("slow");

}

function Build_Line_Create(k , u) {

  //console.log("Create Line " + u);

  var id = "line"+u+"of"+k;

   //DIV
  var tr_p = document.createElement("div");
  tr_p.setAttribute("class","d-flex justify-content-start border border-dark");
  tr_p.setAttribute("id", id);

  var tb_prd = document.createElement("div");
  tb_prd.setAttribute("id" , "prd"+id);

  var tb_cnt = document.createElement("div");
  tb_cnt.setAttribute("id" , "cnt"+id);

  var tb_info = document.createElement("div");
  tb_info.setAttribute("id" , "info"+id);

  var tb_total = document.createElement("div");
  tb_total.setAttribute("id" , "total"+id);

  tb_prd.setAttribute("class", "col-8 p-0 text-center");
  tb_info.setAttribute("class", "col-1 p-0 text-center");
  tb_cnt.setAttribute("class", "col-1 p-0 text-center");
  // if(u_count > 1) tb_cnt.setAttribute("style", "font-weight: bold ; font-size: 1.1rem");
  tb_total.setAttribute("class", "col-2 p-0 text-center");

  //var u_total = u_price * u_count;
  //if(u_iter > 0) tr_p.setAttribute("class","d-flex justify-content-start border border-dark bg-warning");

  // tb_info.innerHTML = u_info;
  // tb_prd.innerHTML = u_product;
  // tb_cnt.innerHTML =  u_count + "x";
  // tb_total.innerHTML = Format_Money(u_total);

  tr_p.appendChild(tb_cnt);
  tr_p.appendChild(tb_info);
  tr_p.appendChild(tb_prd);
  tr_p.appendChild(tb_total);
  //tr_body.appendChild(tr_p);

  tb_prd.addEventListener("click", function() {

    var info = GetInfo_InfoByNro(k);
    if(info){
      console.log("Line " + u  + " of " + k);
      console.log("strike: " + info['products'][u]['strike']);

      $.post('PHP/Armar/Armar_Strike.php', {nro : k , line : u , strike : (info['products'][u]['strike'] == 1 ? 0 : 1)} , Armar);
    }else {
      console.log("hay algun error");
    }

  })

  var table = document.getElementById("products" + k);
  table.appendChild(tr_p);

  if(build_info['started']){
    //console.log("slow line " + u + " of table(" + k + ")");
    $('#'+id).hide();
    $('#'+id).show("slow");
  }

}

function Build_Line_Print(k , u, prd){

  //console.log("Print Line " + u);
  //console.log(prd);
  //console.log("line " + u + " prd: " + prd['product'] + " count: x" + prd['count'] + " info: " + prd['info']);

  var u_count = prd['count'];
  var u_info = prd['info'];
  var u_product = prd['product'];
  var u_price = prd['price'];
  var u_iter = prd['iter'];
  var id = "line"+u+"of"+k;

   //DIV

  var tb_prd = document.getElementById("prd"+ id);
  var tb_info = document.getElementById("info"+ id);
  var tb_total = document.getElementById("total"+ id);
  var tb_cnt = document.getElementById("cnt"+ id);

  tb_prd.setAttribute("class" , "col-8 p-0 text-center " + (prd['strike'] == 1 ? "crossup" : ""));

  if(u_count > 1) tb_cnt.setAttribute("style", "font-weight: bold ; font-size: 1.1rem");
  else tb_cnt.setAttribute("style", "");

  var u_total = u_price * u_count;

  var tr_p = document.getElementById(id);
  tr_p.setAttribute("class","d-flex justify-content-start border border-dark " + (u_iter > 0 ? " bg-warning" : ""));

  tb_info.innerHTML = u_info;
  tb_prd.innerHTML = u_product;
  tb_cnt.innerHTML =  u_count + "x";
  tb_total.innerHTML = Format_Money(u_total);

}

function Build_Line_Remove(k, u) {

  //console.log("REMOVE LINE " + u + " of " + k);

  var id = u + "of" + k;
  $('#line' + id).hide("slow", function() {
    $('#line' + id).remove();
  })
}

//CALCULATE

function Calculate() {

  var total = [];
  for (var i = 0; i < info.length; i++) {

    var fct =  info[i]
    var hidden = $('#body' + info[i]['nro']).css("display") == "none";
    // console.log("factura " + i + " " +(hidden ? "hidden" : "showed"));

    if(!hidden && fct['armado'] == 0)
    {
      //PRODUCTOS
      for (var u = 0; u < fct['products'].length; u++) {
         //ADD TO TOTAL
         var product_find = false;

         for (var k = 0; k < total.length; k++) {
           if(total[k]['product'] + " " + total[k]['info'] ==  fct['products'][u]['product'] + " " + fct['products'][u]['info']){
             product_find = true;
             total[k]['count'] += parseFloat(fct['products'][u]['count']);
           }
         }

         if(!product_find){

           var total_prd = {
             product : fct['products'][u]['product'],
             info : fct['products'][u]['info'],
             count : parseFloat(fct['products'][u]['count']),
             one : fct['products'][u]['info'] == "",
             printed : false
           };

           total.push(total_prd);
         }
      }
    }


  }

  //TOTAL

  //ORDER TO ABC

  total.sort(function (a, b) {

    var a1 = a.product.trim();
    var b1 = b.product.trim();

    if (a1>b1) {
    return 1;
  }
  if (a1<b1) {
    return -1;
  }
  // a must be equal to b
  return 0;
  });

  // console.log("total");
  // console.log(total);

  var bd_total = $('#total');
  bd_total.html(`
    <tr>
      <th class="text-center">Count</th>
      <th class="text-center">Info</th>
      <th class="text-center">Producto</th>
    </tr>
  `);

  //PRINT
  for (var i = 0; i < total.length; i++) {

    var tr = document.createElement("tr");
    var td_product = document.createElement("td");
    var td_info = document.createElement("td");
    var td_count = document.createElement("td");

    td_product.innerHTML = total[i]['product'];
    td_info.innerHTML = total[i]['info'];
    td_count.innerHTML = "x" + total[i]['count'];
    if(total[i]['count'] > 1) td_count.setAttribute("style", "font-weight: bold  ; font-size: 1.1rem");

    tr.appendChild(td_count);
    tr.appendChild(td_info);
    tr.appendChild(td_product);


    bd_total.append(tr);
  }

}

function Calculate_Global(prd) {

  //EACH FACTURA
  console.log(prd);

  var total = [];
  for (var i = 0; i < info.length; i++) {
    var nro_added = false;

    //EACH PRODUCT OF FACTURA
    for (var k = 0; k < info[i]['products'].length; k++) {

      if(info[i]['products'][k]['product'] == prd){

        if(!nro_added) console.log(info[i]['name'] + " " + info[i]['zone']);

        console.log("x" + info[i]['products'][k]['count'] + " " + info[i]['products'][k]['info']);

        //ADD TO TOTAL

        //SEARCH INDEX
        var total_index = -1;
        for (var inx = 0; inx < total.length; inx++) {
          if(total[inx]['info'] == info[i]['products'][k]['info']){
            total_index = inx;
            break;
          }
        }

        //ADD
        if(total_index < 0){
          total.push({info : info[i]['products'][k]['info'] , count : parseFloat(info[i]['products'][k]['count'])})
        }else {
          total[total_index]['count'] += parseFloat(info[i]['products'][k]['count']);
        }

        nro_added = true;
      }
    }

    if(nro_added) console.log(info[i]['comment']);

  }

  //TOTAL
  console.log("TOTAL DE " + prd.toUpperCase().trim() + ":");
  for (var i = 0; i < total.length; i++) {
    console.log("x" + total[i]['count'] + " " + total[i]['info']);
  }

}

Armar();
setInterval(Armar, 10 * 1000);

function Armar() {

  console.log("----ARMAR----");

  GetInfo(function() {
    //Build_Clear();
    Build();
    Calculate();
  });
}

})
