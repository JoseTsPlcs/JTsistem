
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      new Form_Table({

        title:'lista de clientes',
        tables:['clientes','zonas','customers_types'],
        loads:[{table:2}],
        joins:[
          {main:{table:0,field:6},join:{table:1,field:0}},
        ],
        filters:[
          {name:'nombre',conection:{table:0,field:3,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'tipo',conection:{table:0,field:13},box:{tipe:4},load:0},
          {name:'dni',conection:{table:0,field:4,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'celular',conection:{table:0,field:8,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'despacho',conection:{table:0,field:11},box:Box_MutipleDual({show:'recoge',show2:'delivery'})},
          {name:'zona',conection:{table:1,field:1,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'activo',conection:{table:0,field:2},box:Box_MutipleDual({show:'activo'})},
        ],
        fields:[
          {delete:true},
          {edit:true,send:{page:page, url:'Customers_Add.php', send:{name:'search'}}},
          {name:'nombre',conection:{table:0,field:3},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:250px'}]},
          {name:'tipo',box:{tipe:3},load:0,conection:{table:0,field:13}},
          {name:'dni',conection:{table:0,field:4},box:{tipe:1}},
          {name:'celular',conection:{table:0,field:8},box:{tipe:1}},
          {name:'despacho',conection:{table:0,field:11},box:{tipe:0,options:Options_Dual({show:'recoge',show2:'delivery'})}},
          {name:'zona',conection:{table:1,field:1},attributes:[{name:'style',value:'min-width:250px'}]},
          {name:'activo',conection:{table:0,field:2},box:{tipe:6,name:'activo'}},
        ],
      });
    }
  });

});
