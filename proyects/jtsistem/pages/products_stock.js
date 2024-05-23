
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      new Crud_set({
    
        title:"stock de productos",
        panels:[{col:12,y:0,title:"main",tipe:"table"}],
        stateTools:stTls_tb,
        configShow:true,
    
        tableMain:"products",
        selects:[
          {table:'products', field:'ID_PRODUCT',primary:true},
          {table:'products', field:'NAME'},
          {table:'products', field:'ID_PRODUCT_TIPE'},
          {table:'products', field:'UNID_ID'},
          {table:'products', field:'STOCK_TOTAL'},
          {table:'products', field:'STOCK_LIMIT'},
          {table:'products', field:'STOCK_ONLIMIT'},
          {table:'products', field:'ACTIVE'},
          {table:'products_tags', field:'NAME',as:"TAG_NAME"},
    
        ],
        joins:[
          {
            main:{table:"products",field:"ID_PRODUCT_TAG"},
            join:{table:"products_tags",field:"ID_PRODUCT_TAG"},
            tipe:"LEFT",
          }
        ],
        loads:[
          ld_unids,
          ld_products_tags,
        ],
    
        filters:[
          {name:"producto",box:bx_input,select:{table:"products",field:"NAME"}},
          {name:"tipo",box:{tipe:4,options:op_products_tipe,value:["producto","insumo"]},select:{table:"products",field:"ID_PRODUCT_TIPE"}},
          {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"}},
          {name:"activo",box:{tipe:4,options:op_active,value:["activo"]},select:{table:"products",field:"ACTIVE"}},
          {name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"}},
          {name:"en limite",box:{tipe:4,options:[{value:0,show:"fuera de limite"},{value:1,show:"en limite"}]},select:{table:"products",field:"STOCK_ONLIMIT"}},
        ],
        fields:[
          //{panel:"main",...fld_delete},
          {panel:"main",name:"insumo",box:bx_shw,select:"NAME"},
          {panel:"main",name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
          {panel:"main",name:"etiqueta",box:bx_shw,select:"TAG_NAME"},
    
          {panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
          {panel:"main",name:"stock",box:bx_input,select:"STOCK_TOTAL"},
          {panel:"main",name:"limite",box:bx_input,select:"STOCK_LIMIT"},
          {panel:"main",name:"en limite",box:{tipe:0,options:[{value:0,show:"-",class:"rounded text-center bg-success text-white"},{value:1,show:"limit!",class:"rounded text-center bg-danger text-white"}]},select:"STOCK_ONLIMIT"},
          
          {panel:"main",name:"activa",box:bx_active_show,select:"ACTIVE"},
        ],
    
    
      });
    }
  });
  

});
