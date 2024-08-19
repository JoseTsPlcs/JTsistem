
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      new Crud_set({
        parent:pageData.body,
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
    
        configShow:false,
        filters:[          
          {name:"producto",box:bx_input,select:{table:"products",field:"NAME"},descripcion:"buscar por nombre de producto/servicio/insumo"},
          {name:"tipo",box:{tipe:4,options:op_products_tipe,value:["producto","insumo"]},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
          {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"},
          {name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"},descripcion:"buscar por unidad"},
        ],
        fields:[
          
          {panel:"main",...fld_edit,descripcion:"editar informacion del producto/servicio/insumo"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_shw,select:"NAME",descripcion:"nombre del producto/servicio/insumo"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE",descripcion:"puede ser producto/servicio/insumo"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"etiqueta",box:bx_shw,select:"TAG_NAME",descripcion:"etiqueta del producto/servicio/insumo"},
    
          {panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"},descripcion:"unidad del producto/servicio/insumo"},
          
          {panel:"main",name:"precio unitario",box:bx_input,select:"PRICE_UNIT",descripcion:"precio unitario de venta"},
          {panel:"main",name:"costo unitario",box:bx_input,select:"COST_UNIT",descripcion:"costo unitario, este campo se actualiza de acuerdo a las compras"},
          
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"activa",box:bx_active_show,select:"ACTIVE",descripcion:"si el producto/servicio/insumo esta activo, se puede vender o usar"},
        ],
    
    
      });
    }
  });
  

});
