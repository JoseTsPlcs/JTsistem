
$(document).ready(function() {
  
    new Pag_Base({
  
        success:({page})=>{
    
          new Form_Table({
  
            title:'control de entradas de productos',
            tables:['buys','providers'],
            loads:[{table:1},],
            joins:[
              {main:{table:0,field:1},join:{table:1,field:0}},
            ],
            filters:[
              {name:'fecha recepcion min',box:{tipe:2,default:Date_FirstOfMoth()},conection:{table:0,field:8,inter:'>='}},
              {name:'fecha recepcion max',box:{tipe:2,default:Date_LastOfMoth()},conection:{table:0,field:8,inter:'<='}},
              {name:'proveedor',box:{tipe:1,class:'w-100'},conection:{table:1,field:1,inter:'LIKE'}},
              {name:'confirmado',box:Box_MutipleDual({show:'confirmado'}),conection:{table:0,field:3,inter:'='}},
              {name:'entregado',box:Box_MutipleDual({show:'entregado'}),conection:{table:0,field:7,inter:'='}},
            ],
            fields:[
              {edit:true, send:{page:page,url:'Store_Enter.php',send:{name:'search'}}},
  
              {name:'proveedor',attributes:[{name:'style',value:'min-width:220px'}],conection:{table:0,field:1},load:0},
              {name:'confirmado',box:Box_Dual({show:'confirmado'}),conection:{table:0,field:3}},
              {name:'pagado',box:Box_Dual({show:'pagado'}),conection:{table:0,field:4}},

              
              {name:'total',box:Box_Soles(),conection:{table:0,field:5}},
              {name:'costo de transporte',box:Box_Soles(),conection:{table:0,field:6}},

              {name:'fecha de recepcion',attributes:[{name:'style',value:'min-width:120px'}],box:{tipe:0},conection:{table:0,field:8}},
              {name:'entregado',box:Box_Dual({show:'entregado'}),conection:{table:0,field:7},attributes:[{name:'style',value:'min-width:130px'}]},
            ],
          });
          
        }
      })
  
  });