
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      new Crud_set({
    
        title:"lista de productos",
        panels:[{col:12,y:0,title:"main",tipe:"table"}],
        stateTools:stTls_tb,
    
        tableMain:"products",
        selects:[
          {table:'products', field:'ID_PRODUCT',primary:true},
          {table:'products', field:'NAME'},
          {table:'products', field:'ID_PRODUCT_TIPE'},
          {table:'products', field:'ID_PRODUCT_TAG'},
          {table:'products', field:'UNID_ID'},
          {table:'products', field:'ACTIVE'},
        ],
        loads:[
          ld_unids,
          ld_products_tags,
        ],
        conditions:cnds_products,
        inserts:ins_general,

        configShow:false,
        filters:[
          {name:"producto",box:bx_input,select:{table:"products",field:"NAME"}},
          {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"}},
          {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"}},
          {name:"activo",box:{tipe:4,options:op_active},select:{table:"products",field:"ACTIVE"}},
          {name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"}},
        ],
        fields:[
          {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_input,select:"NAME"},
          {panel:"main",name:"tipo",box:bx_op({ops:op_products_tipe}),select:"ID_PRODUCT_TIPE"},
          {panel:"main",name:"etiqueta",box:bx_op({ops:op_products_tipe}),select:"ID_PRODUCT_TAG",load:{name:"ld-products_tags",show:"show"}},
          {panel:"main",name:"unidad",box:bx_op({ops:[]}),select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
          {panel:"main",name:"activo",box:bx_active_input,select:"ACTIVE"},
        ],
    
    
      });
    }
  });
  

});
