
$(document).ready(function() {

  new Pag_Base({
    success:({screenload})=>{

      const g = new Grid({
        cols:[[12],[12]],
        attributes:[
          {x:0,y:0,attributes:[{name:'class',value:'p-2'}]},
          {x:0,y:1,attributes:[{name:'class',value:'p-2'}]},
        ],
        boxs:[
          {x:0,y:0,box:{tipe:5,default:('update limits of products'+ icons.edit),class:'btn btn-outline-primary btn ', update:()=>{

            screenload.SetState({state:true});
            const ld = new Load();
            ld.LoadTables({
              tables:['productos'],
              success:(k)=>{

                k.Update_Sql({
                  table_main:0,
                  sets:[
                    {table:0,field:15,value:1},
                  ],
                  success:()=>{

                    screenload.SetState({state:false});
                  }
                });
              }
            });
          }}}
        ],
      });

      new Form_Table({
        parent:g.GetColData({x:0,y:1}).col,
        title:'control de stock',
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
          {name:'reload',tools:[{name:'delete',show:false}]},
        ],
        filters:[
          {name:'producto',box:{tipe:1,class:'w-100'},conection:{table:0,field:1,inter:'LIKE'}},
          {name:'tipo',box:{tipe:1,class:'w-100'},box:{tipe:4},load:0,conection:{table:0,field:18,inter:'='}},
          {name:'unidad',box:{tipe:1,class:'w-100'},box:{tipe:4},load:1,conection:{table:0,field:10,inter:'='}},
          {name:'stock on limit',box:{...Box_MutipleDual({show:'on limit',show2:'in limit'})},conection:{table:0,field:15}},
          {name:'activo',box:{...Box_MutipleDual({show:'activo'}),default:['activo']},conection:{table:0,field:12,inter:'='}},
          {name:'publico',box:{...Box_MutipleDual({show:'publico',show2:'oculto'}),default:['publico','oculto']},conection:{table:0,field:17,inter:'='}},
        ],
        fields:[
          {name:'producto',box:{tipe:0,class:'w-100'},conection:{table:0,field:1},attributes:[{name:'style',value:'min-width:400px'}]},
          {name:'tipo',conection:{table:0,field:18},load:0,box:{tipe:0},attributes:[{name:'style',value:'min-width:150px'}]},
          {name:'stock',conection:{field:9},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:110px'}]},
          {name:'stock limit',field:14,box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:110px'}]},
          {name:'stock on limit',field:15,box:Box_Dual({show2:'-',show:'on limit',colorinverse:true}),attributes:[{name:'style',value:'min-width:150px'}]},
          {name:'unidad',conection:{table:0,field:10},load:1,box:{tipe:0}},
          {name:'activo',box:Box_Dual({show:'activo'}),conection:{table:0,field:12}},
          {name:'publico',box:Box_Dual({show:'publico'}),conection:{table:0,field:17}},
        ],
      });
    }
  });

});
