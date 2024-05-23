
$(document).ready(function() {

  new Pag_Base({});

  new Crud_set({

    title:"lista de tipos cliente",
    panels:[{col:12,y:0,title:"main",tipe:"table"}],
    stateTools:stTls_tb,
    configShow:false,

    tableMain:"customers_tipe",
    selects:[
      {table:'customers_tipe', field:'ID_CUSTOMER_TIPE',primary:true},
      {table:'customers_tipe', field:'NAME'},
      {table:'customers_tipe', field:'ACTIVE'},
    ],

    fields:[
      //{panel:"main",...fld_delete},
      {panel:"main",name:"nombre",box:bx_input,select:"NAME"},
      {panel:"main",name:"activo",box:{tipe:6,name:"activo",value:1},select:"ACTIVE"},
    ],
  });
  

});
