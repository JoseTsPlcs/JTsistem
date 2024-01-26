
$(document).ready(function() {

    new Pag_Base({
  
      success:({page})=>{
  
        var panel = new Grid({
          cols:[[12],[12]],
          labels:[
            {name:"total de ventas",attributes:[{name:"class",value:"h1"}],x:0,y:0,box:{...Box_Soles(),class:"h1 text-success",default:0}}
          ],
        });

        new Crud_Table({
          parent:panel.GetColData({x:0,y:1}).col,
          title:'control de compras',
          tables:['buys','providers'],
          /*loads:[
            {table:1},
          ],
          joins:[
            {main:{table:0,field:1},join:{table:1,field:0}},
          ],
          filters:[
            {name:'fecha emision min',box:{tipe:2,default:Date_FirstOfMoth()},conection:{table:0,field:2,inter:'>='}},
            {name:'fecha emision max',box:{tipe:2,default:Date_LastOfMoth()},conection:{table:0,field:2,inter:'<='}},
            {name:'proveedor',box:{tipe:1,class:'w-100'},conection:{table:1,field:1,inter:'LIKE'}},
            {name:'confirmado',box:Box_MutipleDual({show:'confirmado'}),conection:{table:0,field:3,inter:'='}},
            {name:'pagado',box:Box_MutipleDual({show:'pagado'}),conection:{table:0,field:4,inter:'='}},
            {name:'entregado',box:Box_MutipleDual({show:'entregado'}),conection:{table:0,field:7,inter:'='}},
            //{name:'fecha entrega min',box:{tipe:2,default:Date_FirstOfMoth()}},
            //{name:'fecha entrega max',box:{tipe:2,default:Date_LastOfMoth()}},
          ],*/
          fields:[
            {edit:true},

            {name:'proveedor',attributes:[{name:'style',value:'min-width:220px'}],sql:{table:0,field:1},load:0},
            {name:'fecha de emision',size:120,box:{tipe:2},sql:{table:0,field:2}},
            {name:'confirmado',box:{tipe:6},sql:{table:0,field:3}},
            {name:'pagado',box:{tipe:6},sql:{table:0,field:4}},
            {name:'total',box:Box_Soles(),sql:{table:0,field:5}},
            {name:'costo de transporte',box:Box_Soles(),sql:{table:0,field:6}},

            {name:'entregado',box:Box_Dual({show:'entregado'}),sql:{table:0,field:7},attributes:[{name:'style',value:'min-width:130px'}]},
            {name:'fecha de entrega',size:120,box:{tipe:2},sql:{table:0,field:8}},
          ],
        });
        
      }
    })
  
  });