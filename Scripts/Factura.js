let products_count = 0;
var venta = document.getElementById("Venta");

$(document).ready(function() {

  new Pag_Base({
    
    success:({recive})=>{

        //BUILD
        function BUILD_AddProduct(t) {

          for (var i = products_count; i < products_count + t; i++) {

            var div = document.createElement("div");
            div.setAttribute("class" , "row m-0 w-100");

            //INFO

            var info = document.createElement("div");
            info.setAttribute("class","col-2 m-0 p-0 text-center");

            var info_select = document.createElement("select");
            info_select.setAttribute("class", "w-100 h-100");
            info_select.setAttribute("id", "info" + i);

            for (var k = 0; k < Data['info']['show'].length; k++) {
              var info_op = document.createElement("option");
              info_op.value = info_op.innerHTML = Data['info']['show'][k];
              info_select.appendChild(info_op);
            }

            info.appendChild(info_select);

            //-----------

            var prd = document.createElement("div");
            prd.setAttribute("class","col-7 m-0 p-0 text-center");

            var prd_input =  document.createElement("input");
            prd_input.setAttribute("class","w-100 h-100");
            prd_input.setAttribute("type","text");
            prd_input.setAttribute("value","");
            prd_input.setAttribute("name","product" + i);
            prd_input.setAttribute("id","product" + i);

            var prd_mn = document.createElement("div");
            prd_mn.setAttribute("class","dropdown-mn");

            var prd_rst =  document.createElement("div");
            prd_rst.setAttribute("class","dropdown-conteiner");
            prd_rst.setAttribute("id","product" + i +"_result");

            prd.appendChild(prd_input);
            prd_mn.appendChild(prd_rst);
            prd.appendChild(prd_mn);

            //-----------

            var cnt = document.createElement("input");
            cnt.setAttribute("class","col-1 m-0 p-0 text-center ");
            cnt.setAttribute("type","number");
            cnt.setAttribute("value",0);
            cnt.setAttribute("name","count" + i);
            cnt.setAttribute("id","count" + i);

            var prc = document.createElement("label");
            prc.setAttribute("class","col-1 text-center px-0 m-0 d-md-block d-none border border-dark");
            prc.innerHTML = Format_Money(0);
            prc.setAttribute("id", "price" + i);

            var total = document.createElement("input");
            total.setAttribute("class","col-md-1 col-2 text-center px-0 m-0 border border-dark");
            total.setAttribute("disabled", "");
            total.innerHTML = 0;
            total.setAttribute("id", "total" + i);

            var v = document.getElementById("Venta");
            v.appendChild(div)

            div.appendChild(cnt);
            div.appendChild(info);
            div.appendChild(prd);
            div.appendChild(prc);
            div.appendChild(total);
            venta.appendChild(div);

            //ADD FILTER

            addfilter_product(i);
            function addfilter_product(u) {

              $('#info' + u).change(Factura_Calculate);
              $('#product' + u).keyup(function() {
                Selection_Products($('#product' + u).val(), "product" + u , Factura_Calculate);
                Factura_Calculate();
              });
              $('#count' + u).keyup(Factura_Calculate);
            }
          }

          products_count += t;
          console.log("Products total: " + products_count);
        }
        BUILD_AddProduct(12);

        //DATA
        function DATA_GetAll(action) {

          GETFACTURACOUNT(function() {
            console.log("factura count");
            GETPRODUCTS(function() {
              console.log("load products");
              GETZONES(function() {
                GETUSERS(function () {

                  console.log("data:");
                  console.log(Data);

                  if(action != null) action();
                });
              });
            });
          })
        }
        DATA_GetAll(function() {
          $('#screen_load').hide();
          Start();
          StartSearch();
        });

        var Factura_Save = {

          anulado : 0,

          cliente_id : -1,
          zone_id : -1,

          prd_id : [],
          prd_price : [],
          prd_total : [],
          prd_unidad : [],
          prd_stock : [],
          total : 0
        }

        var factura_data = {
          clientes : null,
          zones : null,
          metodos : null,
          documentos : null
        }
        var factura_save = {

        }
        var factura_form = {

        }
        var showlog = {

          data : true,
          build_line : true,
          build_line_total : true,
        }

        function Start(action) {

          Cliente_Find = false;
          searching = false;

          $('#nro').val(Data['count'] + 1);
          $('#date').val(Date_Today());

          //CLIENTE
          $('#name').keyup(function() {Selection_Name($('#name').val(),"name", function() {
            Factura_Cliente_Filter(false);
            //Factura_Zone_Filter();
          })})
          $('#zone').keyup(function() {Selection_Zone($('#zone').val(),"zone", Factura_Zone_Filter)});
          $('#gps').keyup(Factura_GPS_Filter);

          //DELIVERY
          $('#trabajador_delivery').html("");
          Edit_Select_AddOptions(document.getElementById("trabajador_delivery"), Data['Users']['user'], Data['Users']['id']);
          document.getElementById("trabajador_delivery").value = 9;

          //METODO
          var metodo_selec = document.getElementById("metodo");
          metodo_selec.innerHTML = "";
          for (var i = 0; i < Data['metodo'].length; i++) {

            var metodo_op = document.createElement("option");
            metodo_op.value = metodo_op.innerHTML = Data['metodo'][i];
            metodo_selec.appendChild(metodo_op);
          }

          //DOCUMENTO
          var documento_selec = document.getElementById("documento");
          documento_selec.innerHTML = "";
          for (var i = 0; i < Data['documento'].length; i++) {

            var documento_op = document.createElement("option");
            documento_op.value = documento_op.innerHTML = Data['documento'][i];
            documento_selec.appendChild(documento_op);
          }

          $('#documento').change(function() {

            Filter_Documento();
          });
          Filter_Documento();

          //CAJERO
          $('#cajero').html("");
          Edit_Select_AddOptions(document.getElementById("cajero"), Data['Users']['user'], Data['Users']['id']);



          //DELIVERY
          $('#delivery').keyup(Factura_Calculate);
          $('#descuento').keyup(function(){
              
              console.log("cambiar descuento")
              Factura_Calculate();
          });

          //BUTTON
          $('#Add').val("Añadir");

          Factura_Calculate();

          if(action != null) action();
        }

        function LoadData() {

        }


        //FILTER
        function Filter_Documento() {

          $('#empresa_show').hide();

          if($('#documento').val() == Data['documento'][2]){
            //$('#empresa_show').show("slow");
            //$('#cliente_show').hide();

            //$('#subtotal_show').show();
            //$('#igv_show').show();
          }else {
            //$('#empresa_show').hide("slow");
            //$('#cliente_show').show();

            $('#subtotal_show').hide();
            $('#igv_show').hide();
          }

          //console.log($('#empresa_show'));
          //console.log($('#cliente_show'));

          switch ($('#documento').val()) {
            case Data['documento'][0]:
              //NOTA DE PAGO
            break;
            case Data['documento'][1]:
              //BOLETA
            break;
            case Data['documento'][2]:
              //FACTURA
            break;

          }
          Factura_Calculate();

          console.log("changed to " + $('#documento').val());

        }

        function Filter_Sunat() {

        }

        function Filter_Recoge(action) {
          if($('#recoge').prop("checked")){
            $('#cliente_Info_delivery').hide("slow");
            //$('#deliv')
          }else {
            $('#cliente_Info_delivery').show("slow");
          }

          if(action!=null) action;
        }

        function Factura_Cliente_Filter(print , action) {

          var datos = new FormData();
          datos.append('name', $('#name').val());
          //console.log(datos.get('name'));

          $('#screen_load').show();
          fetch('PHP/Clientes/Cliente_Get.php',{
            method : 'POST',
            body : datos,
          })
          .then(response => response.json())
          .then(data => {
            //cliente
            
            console.log(data);

            var cliente_i = data['name'].indexOf($('#name').val());
            if(cliente_i!==-1){


              console.log(data['dni'][cliente_i]);

              Factura_Save['cliente_id'] = data['cliente_id'][cliente_i];
              $('#zone').val(data['zone'][cliente_i]);
              $('#dir').val(data['dir'][cliente_i]);
              $('#dni').val(data['dni'][cliente_i]);
              $('#ref').val(data['ref'][cliente_i]);
              $('#cel').val(data['cel'][cliente_i]);
              $('#gps').val(data['gps'][cliente_i]);
              $('#metodo').val(data['metodo'][cliente_i]);
              $('#documento').val(data['documento'][cliente_i]);
              $('#recoge').prop("checked",data['recoge'][cliente_i] == 1);

              if(!print && data['recoge'][cliente_i] == 0) Factura_Zone_Filter();
            }

            $('#screen_load').hide();

            Filter_Recoge();
            Factura_DelivFree_Filter();

            if(action != null) action();
          })
        }

        function Factura_Zone_Filter(action) {

          var datos = new FormData();
          datos.append('zone', $('#zone').val());
          //console.log(datos.get('zone'));

          if($('#recoge').prop('checked')){
              $('#delivery').val(0);
              if(action!=null)action();
          }else {
            fetch('PHP/Zone/Zone_Get.php',{
              method : 'POST',
              body : datos,
            })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              if(data['delivs'].length > 0){
                console.log(data['id'][0]);
                Factura_Save['zone_id'] = data['id'][0];
                $('#delivery').val(data['delivs'][0]);
                Factura_Calculate();

                if(action!=null)action();
              }
            })
          }

        }

        function Factura_GPS_Filter() {
          Coord_Alert("gps_result","gps","w-100 h-100");
        }

        function Factura_DelivFree_Filter(){
            
            
            if($('#deliv_free').prop("checked")){
                
                //ocultar delivery
                $('#delivery_show').hide();
                
            }else{
                
                
                //mostrar delivery
                $('#delivery_show').show();
            }
            
            
            
        }

        //ACTION
        function Factura_Calculate() {

          var is_factura = $('#documento').val() == Data['documento'][2];

          Factura_Save['total'] = 0;

          //sumar productos
          for (var i = 0; i < products_count; i++) {

            //GET PRODUCT
            let product_val = $('#product' + i).val();
            let product_i = -1;
            if(product_val != "") product_i = Data['products']['product'].indexOf(product_val);

            if(product_i !== -1){
                
              //GET ID
              Factura_Save['prd_id'][i] = Data['products']['id'][product_i];
                
              //EXIT PRODUCT
              let product_unidad = Data['products']['unidad'][product_i];
              Factura_Save['prd_unidad'][i] = product_unidad;

              //INFO
              let i_info = $('#info' + i).val();
              let info_index = Data['info']['show'].indexOf(i_info);

              //LIST PRICE
              var list_price = Data['products']['one'];
              if(info_index != -1){
                let price_table = Data['info']['table'][info_index];
                list_price = Data['products'][price_table];
                //console.log(price_table);
                //console.log(list_price);
              }

              //GET PRICE
              Factura_Save['prd_price'][i] = list_price[product_i];

              //COUNT
              let i_count = $('#count' + i);
              if(i_count.val() != ""){

                let info_min = 1;
                let info_max = 999;

                if(info_index != -1){
                  info_min = Data['info']['min'][info_index];
                  info_max = Data['info']['max'][info_index];
                }

                if(i_count.val() < info_min)i_count.val(info_min);
                if(i_count.val() > info_max)i_count.val(info_max);
              }

              //CONFIRM IF STOCK IS OUT
              var stockout = false;
              if(info_index >= 0){
                console.log(Data);
                var stockin = parseFloat(Data['products']['stock'][info_index]);
                stockout = stockin <= 1;
                //if(stockout) alert(Data['products']['product'][info_index] + " stock: " + stockin + "kg");
              }

              //STOCK
              let i_stock = 0;
              if(info_index >= 0){
                i_stock = Data['info']['count'][info_index] * i_count.val();
              }
              Factura_Save['prd_stock'][i] = i_stock;

              if(i_stock < 0) window.alert(product_val + " stock: " + i_stock);

            }
            else {
              
              Factura_Save['prd_id'][i] = null;
              Factura_Save['prd_price'][i] = 0;
              Factura_Save['prd_stock'][i] = 0;
            }

            //TOTAL CALCULATE

            //console.log("count " + i  + " : " + $('#count' + i).val());
            Factura_Save['prd_total'][i] = Factura_Save['prd_price'][i] * Format_Count($('#count' + i).val());
            Factura_Save['total'] += Factura_Save['prd_total'][i];

            //TOTAL PRINT

            var vl_total = Factura_Save['prd_total'][i]
            if(is_factura && false) vl_total = (Factura_Save['prd_total'][i] / 1.18).toFixed(3);
            //vl_total = vl_total.toFixed(2);

            var prd_IDK = product_i !==-1 && vl_total == 0;
            var prd_NoStock = !prd_IDK && Data['products']['stock'][product_i] < Factura_Save['prd_stock'][i];

            if(prd_IDK || prd_NoStock){
              if(prd_IDK){
                vl_total ="I dont know"
              }else {
                if(prd_NoStock){
                  vl_total = "No Stock";
                }
              }
            }else {
              // if(!is_factura)
              //vl_total = Format_Money(vl_total);

            }


            if(is_factura && false){
              //console.log("CALCULATE in documento 2");
              $('#price' + i).text(Format_Money((Factura_Save['prd_price'][i]/1.18).toFixed(3)));
              $('#total' + i).val(vl_total);

            }else {
              $('#price' + i).text(Format_Money(Factura_Save['prd_price'][i]));
              $('#total' + i).val(vl_total);


            }

            //console.log("line "+ i + " price: " + Factura_Save['prd_price'][i] + " total: " + vl_total);

          }

          //sumar delivery si NO es delivery gratis
          if(!$('#deliv_free').prop("checked")){
              
              var deliv = $('#delivery').val() == "" ? 0 : parseFloat($('#delivery').val());
              Factura_Save['total'] += deliv;
          }

          //aplicar descuentos
          var desc = $('#descuento').val();
          if(desc == "") desc = 0;
          
          console.log("descuento%: " + desc)
          
          Factura_Save['total'] *= (1- desc/100);


          if(is_factura && false){
            var igv_total = Factura_Save['total'] - deliv;
            var igv_subtotal = igv_total/1.18;
            var igv = igv_total - igv_subtotal;
            $('#igv').text(Format_Money(igv.toFixed(2)));
            $('#subtotal').text(Format_Money(igv_subtotal.toFixed(2)));
            $('#total').text(Format_Money(igv_total.toFixed(2)));
            
          }else {
              
              
              
            $('#total').text(Format_Money(Factura_Save['total'].toFixed(2)));
          }


          console.log("CALCULATE");
          console.log(Factura_Save);
        }

        function Factura_Print(fct , action) {

          console.log("print");
          console.log(fct);

          $('#nro').val(fct['data']['nro']);
          $('#date').val(fct['data']['date']);
          $('#confirmado').prop("checked",fct['data']['confirm'] == 1);
          $('#time_a').val(fct['data']['time_a']);
          $('#time_b').val(fct['data']['time_b']);
          $('#deliv_free').prop("checked",fct['data']['deliv_free'] == 1);

          $('#name').val(fct['cliente']['name']);
          $('#dni').val(fct['cliente']['dni']);
          $('#cel').val(fct['cliente']['cel']);
          $('#recoge').prop("checked",fct['cliente']['recoge'] == 1);

          $('#trabajador_delivery').val(fct['cliente']['trabajador_delivery']);
          $('#zone').val(fct['cliente']['zone']);
          $('#dir').val(fct['cliente']['dir']);
          $('#ref').val(fct['cliente']['ref']);
          $('#gps').val(fct['cliente']['gps']);
          
          //$('#deliv_free').prop("checked",fct['cliente']['recoge'] == 1);


          $('#comment').val(fct['pay']['comment']);
          $('#metodo').val(fct['pay']['metodo']);
          $('#cancelado').prop("checked",fct['pay']['cancelado'] == 1);
          $('#entregado').prop("checked",fct['pay']['entregado'] == 1);
          $('#documento').val(fct['pay']['documento']);
          $('#cajero').val(fct['pay']['cajero']);

          $('#armado').prop("checked",fct['armado'] == 1);

          var prd_df = fct['products'].length - products_count;
          if(prd_df > 0) BUILD_AddProduct(prd_df);

          for (var i = 0; i < products_count; i++) {
            if(i < fct['products'].length){
              $('#info' + i).val(fct['products'][i]['info']);
              $('#product' + i).val(true ? fct['products'][i]['product'] : fct['products'][i]['id']);
              $('#count' + i).val(fct['products'][i]['count']);
            }
          }

          /*if(fct['anulado'] > 0){
            $('anulado alert').setAttribute();
          }*/

          Factura_Cliente_Filter(true);

          $('#delivery').val(fct['delivery']);
          $('#descuento').val(fct['data']['descuento'])
          //$('#delivery').val(999);

          Factura_Save['anulado'] = fct['anulado'];
          Anulado_Show();

          Filter_Documento();
          Factura_Calculate();

          if(action!= null)action();
        }

        var Factura_Send = function(){

          var fct = {
            data : {
              nro : $('#nro').val(),
              date : $('#date').val(),
              uss : -1,
              time_a : $('#time_a').val(),
              time_b : $('#time_b').val(),
              confirm : $('#confirmado').prop("checked")? 1 : 0,
              deliv_free : $('#deliv_free').prop("checked") ? 1 : 0,
              descuento: $('#descuento').val(),
            },
            cliente :{

              cliente_id:  Factura_Save['cliente_id'],
              name : $('#name').val(),
              dni : $('#dni').val(),
              cel : $('#cel').val(),
              recoge : $('#recoge').prop("checked") ? 1 : 0,

              trabajador_delivery : $('#trabajador_delivery').val(),
              zone_id:  Factura_Save['zone_id'],
              zone : $('#zone').val(),
              dir : $('#dir').val(),
              ref : $('#ref').val(),
              gps : '',
            },
            pay :{
              comment : $('#comment').val(),
              metodo : $('#metodo').val(),
              cancelado : $('#cancelado').prop("checked")? 1 : 0,
              entregado : $('#entregado').prop("checked")? 1 : 0,
              documento : $('#documento').val(),
              cajero : $('#cajero').val()
            },
            products : [],
            armado : $('#armado').prop("checked")? 1 : 0,
            anulado : Factura_Save['anulado'],
            delivery : $('#delivery').val()
          }

          //console.log("print found");
          //console.log(Factura_Found ? Factura_Found['products'][0]['iter'] : "");

          for (var i = 0; i < products_count; i++) {
            fct['products'].push({
              id : Factura_Save['prd_id'][i],
              info : $('#info' + i).val(),
              product : $('#product' + i).val(),
              count : $('#count' + i).val(),
              price : Factura_Save['prd_price'][i],
              stock : Factura_Save['prd_stock'][i],
              iter : (Factura_Found ? (i < Factura_Found['products'].length ?  Factura_Found['products'][i]['iter'] : (Factura_Found['armado'] == 1 ? 1 : 0)) : 0)
            });
          }

          var gps_i = Coord($('#gps').val());
          if(Coord_Is(gps_i))  fct['cliente']['gps'] = gps_i;

          return fct;
        }

        function Anulado_Show() {

          if(searching){
            if(Factura_Save['anulado'] == 1){
              ShowAlert("anulado alert", true, "col-12 alert alert-danger p-0 text-center");
              $('#Anulado').val("Desanular");
            }else {
              ShowAlert("anulado alert", false, "col-12 alert alert-danger p-0 text-center");
              $('#Anulado').val("Anular");
            }
            //Add();
          }
        }

        //FACTURA

        $('#recoge').click(Filter_Recoge);
        $('#deliv_free').click(function(){
            Factura_DelivFree_Filter();
            Factura_Calculate();
        });
        
          
        
        $('#Add').click(Add);
        $('#Clear').click(Clear);
        $('#Search').click(function(){ChangePage(0,0,"?nro=" + $('#nro').val())});
        $('#Anulado').click(function(){
          if(Factura_Save['anulado'] == 0){
            Factura_Save['anulado'] = 1;
          }else {
            Factura_Save['anulado'] = 0;
          }
          Anulado_Show();
          Add();
        })
        $('#recoge').click(function(){

          if($('#recoge').prop('checked')){
            $('#delivery').val(0);
          }else {
            Factura_Zone_Filter();
          }

          Factura_Calculate();
        })
        $('#AddProduct').click(function(){
          BUILD_AddProduct(1);
          //Start();
        });

        function Clear() {
          //ChangePage(0,0,"");
          location.reload();
        }

        function Add() {

          var data = Factura_Send();

          //filter
          //if(!searching) Factura_Cliente_Filter();
          Factura_Calculate();

          var nro_mx = Data['count'] + 1;
          if($('#nro').val() < nro_mx){
            if(!searching){
              Search();
              return;
            }
          }else {
            if(searching){
              Clear();
              return;
            }else {
              $('#nro').val(nro_mx);
            }
          }

          //if(Factura_Save['total'] == 0){
            //alert("necesitamos comer!!");
            //return;
          //}

          //add or save

          console.log(searching ?"Save:" : "Add:");
          console.log(data);

          $('#screen_load').show();

          if(searching){

            console.log("LAST FACTURA");
            console.log(Factura_Found);
            $.post('PHP/Factura/Factura_Save.php',data,function(resp) {

              //console.log(resp);
              var fct = JSON.parse(resp);
              console.log("SAVED:");
              console.log(fct);

              $('#screen_load').hide();
              if(fct['data']['nro'] > 0){
                //Clear();
                history.back();
              }
              else {
                alert("Error al guardar");
              }
            })


          }else {

            $.post('PHP/Factura/Factura_Add.php',data,function(resp) {
              var cliente_data = JSON.parse(resp);
              console.log("ADDED:");
              console.log(cliente_data);
              location.reload();
              //Clear();
              //history.back();

              $('#screen_load').hide();
            })
          }

        }

        function Save() {

        }

        var Factura_Found;

        function Search() {

          var data = Factura_Send();

          console.log("search");
          console.log(data);

          $('#screen_load').show();

          $.post('PHP/Factura/Factura_Search.php',data,function(resp) {
            var fct = JSON.parse(resp);

            console.log("searched");
            console.log(fct);

            if(fct['data']['nro'] !== -1){
              searching = true;
              ShowAlert("Anulado",true,"my-1 btn btn-outline-danger btn-lg col-sm-3");

              //STOCK FALSE
              //console.log("FALSE STOCK:");
              //console.log(fct['products'].length);
              for (var i = 0; i < fct['products'].length; i++) {
                //console.log("scr:");
                //console.log(fct['products'][i]['stock']);
                //console.log(Data['products']['stock']);
                let prd_index = Data['products']['product'].indexOf(fct['products'][i]['product']);
                if(prd_index!=-1){
                  Data['products']['stock'][prd_index] = parseFloat(Data['products']['stock'][prd_index]);
                  //console.log(Data['products']['stock'][prd_index]);
                  Data['products']['stock'][prd_index] += parseFloat(fct['products'][i]['stock']);
                  //console.log(Data['products']['stock'][prd_index]);
                }
              }

              Factura_Found = fct;
              console.log("found");
              console.log(Factura_Found);

              Factura_Print(fct , function() {
                $('#screen_load').hide();
              });
              $('#Add').val("Guardar");

            }else {
              console.log(fct);
              alert("no find");
            }
          })

        }

        //start search

        function StartSearch() {
          let nro = location.search.substring(("?nro=").length);
          //console.log(nro);
          if(nro != ""){
            $('#nro').val(nro);
            Search();
          }
        }
      
    }
  });

})
