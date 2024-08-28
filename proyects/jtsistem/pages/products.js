
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var gr = new Grid({
        parent:pageData.body,
        cols:[[12],[6,3,3]],
      });

      var test = false;

      var acc_item_config = Access_Get(userData.access,"md-items-config");

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
                      {name:"sizes",show:true,value:10},
                      {name:"reload",show:true},
                      {name:"new",show:true},
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
              conditions:[
                {
                  table:"products",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:userData.company.id,
                }
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
                {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
                (acc_item_config?{name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"}:null),
                {name:"activo",box:{tipe:4,options:op_active,value:["activo"]},select:{table:"products",field:"ACTIVE"},descripcion:"buscar si el producto/servicio/insumo esta activo"},
                (acc_item_config?{name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"},descripcion:"buscar por unidad"}:null),
              ],
              fields:[
                {panel:"main",...fld_edit,descripcion:"editar informacion del producto/servicio/insumo"},
                {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_shw,select:"NAME",descripcion:"nombre del producto/servicio/insumo"},
                {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE",descripcion:"puede ser producto/servicio/insumo"},
                (acc_item_config?{panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"etiqueta",box:bx_shw,select:"TAG_NAME",descripcion:"etiqueta del producto/servicio/insumo"}:null),
          
                (acc_item_config?{panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"},descripcion:"unidad del producto/servicio/insumo"}:null),
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
              ...src_item_fm({userData}),
              parent:prnt_prod,
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
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:true},
                        {name:"update",show:true},
                        {name:"cancel",show:true},
                    ],
                },
                {
                  name:"new",
                  tools:[
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
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
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:true},
                        {name:"update",show:true},
                        {name:"cancel",show:true},
                    ],
                },
                {
                  name:"block",
                  tools:[
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
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
