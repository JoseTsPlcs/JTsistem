
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      new Form_Table({

        title:'proveedores por productos',
        h_min:500,
        tables:['providers_products','providers','productos','unidades'],
        states:[{name:'reload',tools:[{name:'new',show:true}]}],
        joins:[
          {main:{table:0,field:1},join:{table:1,field:0}},
          {main:{table:0,field:2},join:{table:2,field:0}},
          {main:{table:2,field:10},join:{table:3,field:0}},
        ],
        loads:[
          {
            table_main:1,
            selects:[
              {table:1,field:0,as:'value'},
              {table:1,field:1,as:'show'},
            ],
          },
          {
            table_main:2,
            selects:[
              {table:2,field:0,as:'value'},
              {table:2,field:1,as:'show'},
            ],
          },
        ],
        /*orders:[
          {table:1,field:1,asc:true},
        ],*/
        filters:[
          {name:'proveedor',conection:{table:1,field:1,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'producto',conection:{table:2,field:1,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'stock min',conection:{table:2,field:9,inter:'>='},box:{tipe:1,default:-999}},
          {name:'stock max',conection:{table:2,field:9,inter:'<='},box:{tipe:1,default:999}},
        
          {name:'stock on limit',box:{...Box_MutipleDual({show:'on limit',show2:'in limit'})},conection:{table:2,field:15}},
          {name:'activo',box:{...Box_MutipleDual({show:'activo'}),default:['activo']},conection:{table:2,field:12,inter:'='}},
          {name:'publico',box:{...Box_MutipleDual({show:'publico',show2:'oculto'}),default:['publico','oculto']},conection:{table:2,field:17,inter:'='}},
        ],
        fields:[
          {delete:true},
          {name:'proveedor',conection:{table:0,field:1},attributes:[{name:'style',value:'min-width:220px'}],box:{tipe:8,class:'w-100'},load:0},
          {name:'producto',conection:{table:0,field:2},attributes:[{name:'style',value:'min-width:220px'}],box:{tipe:8,class:'w-100'},load:1},
          
          {name:'unidad',conection:{table:3,field:2}},
          {name:'stock',conection:{table:2,field:9},attributes:[{name:'style',value:'min-width:70px'}]},
          {name:'stock limit',conection:{table:2,field:14},attributes:[{name:'style',value:'min-width:70px'}]},
          {name:'stock on limit',conection:{table:2,field:15},box:{...Box_Dual({show:'onLimit',show2:'-',colorinverse:true})},attributes:[{name:'style',value:'min-width:70px'}]},
          {name:'activo',box:Box_Dual({show:'activo'}),conection:{table:2,field:12}},
          {name:'publico',box:Box_Dual({show:'publico'}),conection:{table:2,field:17}},
        ],
      });
    }
  });

});
