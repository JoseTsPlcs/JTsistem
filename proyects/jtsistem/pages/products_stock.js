
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var acc_stock_update = userData.access.find(acc=>acc.value=="acc-9") && userData.access.find(acc=>acc.value=="acc-9").active == "true"; 
      
      new Crud_set({
    
        title:"stock de productos",
        panels:[{col:12,y:0,title:"main",tipe:"table"}],
        stateTools:stTls_tb,
    
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

        configShow:false,    
        filters:[
          {name:"producto",box:bx_input,select:{table:"products",field:"NAME"}},
          {name:"tipo",box:{tipe:4,options:op_products_tipe,value:["producto","insumo"]},select:{table:"products",field:"ID_PRODUCT_TIPE"}},
          {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"}},
          {name:"activo",box:{tipe:4,options:op_active,value:["activo"]},select:{table:"products",field:"ACTIVE"}},
          {name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"}},
          {name:"en el minimo",box:{tipe:4,options:[{value:0,show:"fuera del minimo"},{value:1,show:"en el minimo"}]},select:{table:"products",field:"STOCK_ONLIMIT"}},
        ],
        fields:[
          //{panel:"main",...fld_delete},
          {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_shw,select:"NAME"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"etiqueta",box:bx_shw,select:"TAG_NAME"},
    
          {panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
          {panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock",box:(acc_stock_update?bx_input:bx_show),select:"STOCK_TOTAL"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock minimo",box:bx_show,select:"STOCK_LIMIT"},
          {panel:"main",name:"limite",box:{tipe:0,options:[{value:0,show:"-",class:"rounded text-center bg-success text-white"},{value:1,show:"limit!",class:"rounded text-center bg-danger text-white"}]},select:"STOCK_ONLIMIT"},
          
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"activa",box:bx_active_show,select:"ACTIVE"},
        ],
    
    
      });
    }
  });
  

});
