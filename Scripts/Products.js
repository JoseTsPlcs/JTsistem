
$(document).ready(function() {

  new Pag_Base({
    success:()=>{

      new Form_Table({

        title:'productos',
        tables:['productos','productos_tipo','unidades'],
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
        states:[
          {name:'reload',tools:[
                {name:'delete',show:false},
                {name:'add',show:true}
              ]},
        ],
        filters:[
          {name:'producto',box:{tipe:1,class:'w-100'},conection:{table:0,field:1,inter:'LIKE'}},
          {name:'tipo',box:{tipe:1,class:'w-100'},box:{tipe:4},load:0,conection:{table:0,field:18,inter:'='}},
          {name:'unidad',box:{tipe:1,class:'w-100'},box:{tipe:4},load:1,conection:{table:0,field:10,inter:'='}},
          {name:'activo',box:{...Box_MutipleDual({show:'activo'}),default:['activo']},conection:{table:0,field:12,inter:'='}},
          {name:'publico',box:{...Box_MutipleDual({show:'publico',show2:'oculto'}),default:['publico']},conection:{table:0,field:17,inter:'='}},
        ],
        fields:[
          {name:'producto',box:{tipe:1,class:'w-100'},conection:{table:0,field:1},attributes:[{name:'style',value:'min-width:400px'}]},
          {name:'tipo',conection:{table:0,field:18},load:0,box:{tipe:3}},
          {name:'unidad',conection:{table:0,field:10},load:1,box:{tipe:3}},
          {name:'activo',box:{tipe:6,name:'activo'},conection:{table:0,field:12}},
          {name:'publico',box:{tipe:6,name:'publico'},conection:{table:0,field:17}},
        ],
      });
    }
  });

});
