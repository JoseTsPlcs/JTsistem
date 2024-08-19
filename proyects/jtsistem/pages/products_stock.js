
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var acc_stock_update = userData.access.find(acc=>acc.value=="acc-9") && userData.access.find(acc=>acc.value=="acc-9").active == "true"; 
      
      new Crud_set({
        parent:pageData.body,
        title:"stock de productos",
        panels:[{col:12,y:0,title:"main",tipe:"table"}],
        stateTools:[
          {
            name:"reload",
            tools:[
                {name:"config",show:true},
                {name:"load",show:true},
                
                {name:"excel",show:false},
                {name:"pdf",show:false},
    
                {name:"sizes",show:true,value:10},
                {name:"reload",show:true},
                {name:"update",show:false},
                {name:"new",show:false},
                {name:"insert",show:false},
                {name:"cancel",show:false},
                
                {name:"pages",show:true},
            ],
          }
        ],
    
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
          {name:"producto",box:bx_input,select:{table:"products",field:"NAME"},descripcion:"buscar por nombre de producto/servicio/insumo"},
          {name:"tipo",box:{tipe:4,options:op_products_tipe,value:["producto","insumo"]},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
          {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"},
          {name:"activo",box:{tipe:4,options:op_active,value:["activo"]},select:{table:"products",field:"ACTIVE"},descripcion:"buscar si el producto/servicio/insumo esta activo"},
          {name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"},descripcion:"buscar por unidad"},
          {name:"en el minimo",box:{tipe:4,options:[{value:0,show:"fuera del minimo"},{value:1,show:"en el minimo"}]},select:{table:"products",field:"STOCK_ONLIMIT"},descripcion:"los productos/servicio/insumo que tiene un stock menor o igual al minimo"},
        ],
        fields:[
          {panel:"main",...fld_edit,descripcion:"editar informacion del producto/servicio/insumo"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_shw,select:"NAME",descripcion:"nombre del producto/servicio/insumo"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE",descripcion:"puede ser producto/servicio/insumo"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"etiqueta",box:bx_shw,select:"TAG_NAME",descripcion:"etiqueta del producto/servicio/insumo"},
    
          {panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"},descripcion:"unidad del producto/servicio/insumo"},
          
          {panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock total",box:(acc_stock_update?bx_input:{tipe:0,class:"text-center"}),select:"STOCK_TOTAL",descripcion:"stock actual del producto/insumo/servicio"},
          {panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock minimo",box:{tipe:0,class:"text-center"},select:"STOCK_LIMIT",descripcion:"stock minimo del producto/insumo/servicio, en caso el stock sea menor o igual, se lanza una alerta"},
          {panel:"main",name:"limite",box:{tipe:0,options:[{value:0,show:"-",class:"rounded text-center bg-success text-white"},{value:1,show:"limit!",class:"rounded text-center bg-danger text-white"}]},select:"STOCK_ONLIMIT",descripcion:"los productos/servicio/insumo que tiene un stock menor o igual al minimo"},
          
          {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"activa",box:bx_active_show,select:"ACTIVE",descripcion:"si el producto/servicio/insumo esta activo, se puede vender o usar"},
        ],
    
    
      });

      /*new Crud_set({
        ...src_items_tb({
          userData,
        }),
        parent:pageData.body,
        title:"stock de productos",
      });*/

    }
  });
  

});
