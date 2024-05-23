
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      new Crud_set({
    
        title:"lista de precios",
        panels:[{col:12,y:0,title:"main",tipe:"table"}],
        stateTools:stTls_tb,
    
        tableMain:"products",
        selects:[
          {table:'products', field:'ID_PRODUCT',primary:true},
          {table:'products', field:'NAME'},
          {table:'products', field:'ID_PRODUCT_TIPE'},
          {table:'products_tags', field:'NAME',as:"TAG_NAME"},
          {table:'products', field:'UNID_ID'},
          {table:'products', field:'PRICE_UNIT'},
          {table:'products', field:'COST_UNIT'},
          //{table:'products', field:'STOCK_TOTAL'},
          //{table:'products', field:'STOCK_LIMIT'},
          //{table:'products', field:'STOCK_ONLIMIT'},
          {table:'products', field:'ACTIVE'},
        ],
        joins:[
          {
            main:{table:"products",field:"ID_PRODUCT_TAG"},
            join:{table:"products_tags",field:"ID_PRODUCT_TAG"},
            tipe:"LEFT",
          }
        ],
        conditions:cnds_products,

        loads:[
          ld_unids,
          ld_products_tags,
        ],
    
        configShow:true,
        filters:[
          {name:"producto",box:bx_input,select:{table:"products",field:"NAME"}},
          {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"}},
          {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"}},
          {name:"activo",box:{tipe:4,options:op_active,value:["activo"]},select:{table:"products",field:"ACTIVE"}},
          //{name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"unids",show:"show"}},
        ],
        fields:[
          {panel:"main",name:"producto",box:bx_shw,select:"NAME"},
          {panel:"main",name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
          {panel:"main",name:"etiqueta",box:bx_shw,select:"TAG_NAME"},
          //{panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"unids",show:"show"}},
    
          {panel:"main",name:"precio unitario",box:bx_input,select:"PRICE_UNIT"},
          {panel:"main",name:"costo unitario",box:bx_input,select:"COST_UNIT"},
    
          {panel:"main",name:"activa",box:bx_active_show,select:"ACTIVE"},
        ],
    
    
      });
    }
  });
  

});
