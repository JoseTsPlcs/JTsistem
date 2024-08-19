
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var gr = new Grid({
        parent:pageData.body,
        cols:[[12],[6,3,3]],
      });

      var test = false;

      var md_prod = new Modal({parent:gr.GetColData({x:0,y:1}).col});
      var md_tags = new Modal({parent:gr.GetColData({x:1,y:1}).col});
      var md_unds = new Modal({parent:gr.GetColData({x:2,y:1}).col});

      var prnt_prod = test ? gr.GetColData({x:0,y:1}).col : md_prod.GetContent();
      var prnt_tags = test ? gr.GetColData({x:1,y:1}).col : md_tags.GetContent();
      var prnt_unds = test ? gr.GetColData({x:2,y:1}).col : md_unds.GetContent();

      new ConsCruds({
        
        cruds:[
          {
            name:"products",
            active:true,
            script:{
              parent:gr.GetColData({x:0,y:0}).col,
              title:pageData.title,
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
              ],
              fields:[
                {panel:"main",...fld_edit,descripcion:"editar informacion del producto/servicio/insumo"},
                {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_shw,select:"NAME",descripcion:"nombre del producto/servicio/insumo"},
                {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE",descripcion:"puede ser producto/servicio/insumo"},
                {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"etiqueta",box:bx_shw,select:"TAG_NAME",descripcion:"etiqueta del producto/servicio/insumo"},
          
                {panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"},descripcion:"unidad del producto/servicio/insumo"},
                //{panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock total",box:(acc_stock_update?bx_input:{tipe:0,class:"text-center"}),select:"STOCK_TOTAL"},
                //{panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock minimo",box:{tipe:0,class:"text-center"},select:"STOCK_LIMIT"},
                //{panel:"main",name:"limite",box:{tipe:0,options:[{value:0,show:"-",class:"rounded text-center bg-success text-white"},{value:1,show:"limit!",class:"rounded text-center bg-danger text-white"}]},select:"STOCK_ONLIMIT"},
                
                {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"activa",box:bx_active_show,select:"ACTIVE",descripcion:"si el producto/servicio/insumo esta activo, se puede vender o usar"},
              ],
            },
          },
          {
            name:"fm-product",
            active:true,
            script:{
              parent:prnt_prod,
              title:"producto",
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:true},
                        {name:"update",show:true},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:true},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],
              stateStart:"block",
              afterUpdate:"block",
              afterInsert:"block",
              afterCancel:"block",
          
              tableMain:"products",
              selects:[
                {table:'products', field:'ID_PRODUCT',primary:true},
                {table:'products', field:'NAME'},
                {table:'products', field:'ID_PRODUCT_TIPE'},
                {table:'products', field:'ID_PRODUCT_TAG'},
                {table:'products', field:'UNID_ID'},
                {table:'products', field:'ACTIVE'},
                {table:'products', field:'COST_UNIT'},
                {table:'products', field:'PRICE_UNIT'},
                {table:'products', field:'STOCK_TOTAL'},
                {table:'products', field:'STOCK_LIMIT'},
              ],
              loads:[
                ld_unids,
                ld_products_tags,
              ],
              /*conditions:[
                {
                  table:"products",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],*/
              inserts:ins_general,
              
              fields:[
                {panel:"main",col:9,tipe:1,name:"producto",box:{...bx_input,value:"nombre del producto"},select:"NAME",descripcion:"nombre del producto/servicio/insumo"},
                {panel:"main",col:3,tipe:0,name:"activo",box:{...bx_active_input,value:1},select:"ACTIVE",descripcion:"activo del producto/servicio/insumo, si esta activo se puede vender o usar"},
                
                {panel:"main",col:12,tipe:1,name:"tipo",box:{...bx_op({ops:op_products_tipe})},select:"ID_PRODUCT_TIPE",descripcion:"seleccionar si es producto/servicio/insumo"},

                {panel:"main",col:8,tipe:1,colAllLevel:true,name:"etiqueta",box:{tipe:3,value:1},select:"ID_PRODUCT_TAG",load:{name:"ld-products_tags",show:"show"},descripcion:"seleccionar etiqueta"},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"edit-tag",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-pencil-square"></i>'},action:"edit-tag",descripcion:"editar etiqueta"},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"add-tag",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-plus-circle"></i>'},action:"add-tag",descripcion:"añadir etiqueta"},

                {panel:"main",col:8,tipe:1,colAllLevel:true,name:"unidad",box:{...bx_op({ops:[]})},select:"UNID_ID",load:{name:"ld-unids",show:"show"},descripcion:"seleccionar unidad"},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"edit-und",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-pencil-square"></i>'},action:"edit-und",descripcion:"editar unidad"},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"add-und",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-plus-circle"></i>'},action:"add-und",descripcion:"añadir unidad"},

                {panel:"main",col:6,tipe:1,name:"costo unitario",box:{tipe:1,value:0},select:"COST_UNIT",descripcion:"costo unitario, este campo se actualiza de acuerdo a las compras"},
                {panel:"main",col:6,tipe:1,name:"precio unitario",box:{tipe:1,value:0},select:"PRICE_UNIT",descripcion:"precio unitario de venta"},

                {panel:"main",col:6,tipe:1,name:"stock total",box:{tipe:1,value:999},select:"STOCK_TOTAL",descripcion:"stock actual del producto/insumo/servicio"},
                {panel:"main",col:6,tipe:1,name:"stock minimo",box:{tipe:1,value:1},select:"STOCK_LIMIT",descripcion:"stock minimo del producto/insumo/servicio, en caso el stock sea menor o igual, se lanza una alerta"},
              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      if(!test) md_prod.SetActive({active});
                    }
                  }]
                },
              ],
            }
          },
          {
            name:"fm-tags",
            active:true,
            script:{
              parent:prnt_tags,
              title:"lista de etiquetas",
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:true},
                        {name:"update",show:true},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:true},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],
              stateStart:"block",
              afterUpdate:"block",
              afterInsert:"block",
              afterCancel:"block",              
    
              tableMain:"products_tags",
              selects:[
                {table:'products_tags', field:'ID_PRODUCT_TAG',primary:true},
                {table:'products_tags', field:'NAME'},
              ],
              /*conditions:[{
                //before:" AND ",
                table:"products_tags",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],*/
              inserts:[{
                field:"ID_COMPANY",
                value:userData.company.id,
              }],
    
              fields:[
                //{panel:"main",...fld_delete},
                {panel:"main",col:12,name:"etiqueta",box:bx_input,select:"NAME",descripcion:"nombre de la etiqueta del producto/servicio/insumo"},
              ],
              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      if(!test) md_tags.SetActive({active});
                    }
                  }]
                }
              ],
            }
          },
          {
            name:"fm-und",
            active:true,
            script:{

              title:"lista de unidades",blocked:false,
              parent:prnt_unds,
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:true},
                        {name:"update",show:true},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:true},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],
              stateStart:"block",
              afterUpdate:"block",
              afterInsert:"block",
              afterCancel:"block",              
    
              tableMain:"unids",
              selects:[
                {table:'unids', field:'ID_UNID',primary:true},
                {table:'unids', field:'NAME'},
                {table:'unids', field:'SIMBOL'},
              ],
              /*conditions:[{
                //before:" AND ",
                table:"unids",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],*/
              inserts:[{
                field:"ID_COMPANY",
                value:userData.company.id,
              }],
    
              fields:[
                //{panel:"main",...fld_delete},
                {panel:"main",name:"unidad",box:bx_input,select:"NAME",descripcion:"nombre de la unidad"},
                {panel:"main",name:"simbolo",box:bx_input,select:"SIMBOL",descripcion:"simbolo de la unidad"},
              ],
              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      if(!test) md_unds.SetActive({active});
                    }
                  }]
                },
              ],
            }
          }
        ],

        conections:[
          {
            tipe:"tb-fm",
            master:"products",
            masterField:"ID_PRODUCT",
            maid:"fm-product",
            maidField:"ID_PRODUCT",
          },
          {
            tipe:"fm-fm",
            master:"fm-product",
            masterActionEdit:"edit-tag",
            masterActionAdd:"add-tag",
            masterField:"etiqueta",
            maid:"fm-tags",
            maidField:"ID_PRODUCT_TAG",
          },
          {
            tipe:"fm-fm",
            master:"fm-product",
            masterActionEdit:"edit-und",
            masterActionAdd:"add-und",
            masterField:"unidad",
            maid:"fm-und",
            maidField:"ID_UNID",
          },
        ],
      });
    }
  });
  

});
