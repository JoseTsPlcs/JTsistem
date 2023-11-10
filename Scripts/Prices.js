
$(document).ready(function() {

  new Pag_Base({
    success:()=>{

      new Form_Table({

        title:'productos',
        tables:['productos'],
        states:[
          {name:'reload',tools:[{name:'delete',show:false}]},
        ],
        filters:[
          {name:'producto',box:{tipe:1,class:'w-100'},conection:{table:0,field:1,inter:'LIKE'}},
          {name:'activo',box:{...Box_MutipleDual({show:'activo'}),default:['activo']},conection:{table:0,field:12,inter:'='}},
          {name:'publico',box:{...Box_MutipleDual({show:'publico',show2:'oculto'}),default:['publico']},conection:{table:0,field:17,inter:'='}},
        ],
        fields:[
          {name:'producto',box:{tipe:0,class:'w-100'},conection:{table:0,field:1},attributes:[{name:'style',value:'min-width:400px'}]},

          {name:'1kg',conection:{table:0,field:5},attributes:[{name:'style',value:'min-width:70px'}],box:{tipe:1,class:'w-100'}},
          {name:'500g',conection:{table:0,field:4},attributes:[{name:'style',value:'min-width:70px'}],box:{tipe:1,class:'w-100'}},
          {name:'250g',conection:{table:0,field:3},attributes:[{name:'style',value:'min-width:70px'}],box:{tipe:1,class:'w-100'}},
          {name:'100g',conection:{table:0,field:2},attributes:[{name:'style',value:'min-width:70px'}],box:{tipe:1,class:'w-100'}},

          
          {name:'1kg>',conection:{table:0,field:6},attributes:[{name:'style',value:'min-width:70px'}],box:{tipe:1,class:'w-100'}},
          {name:'5kg>',conection:{table:0,field:7},attributes:[{name:'style',value:'min-width:70px'}],box:{tipe:1,class:'w-100'}},
          
          {name:'unidad',conection:{table:0,field:8},attributes:[{name:'style',value:'min-width:70px'}],box:{tipe:1,class:'w-100'}},

          {name:'activo',box:Box_Dual({show:'activo'}),conection:{table:0,field:12}},
          {name:'publico',box:Box_Dual({show:'publico'}),conection:{table:0,field:17}},
        ],
      });
    }
  });

});
