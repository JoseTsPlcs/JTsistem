
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({
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
                {panel:"main",...fld_edit},
                {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_input,select:"NAME"},
                {panel:"main",name:"tipo",box:bx_op({ops:op_products_tipe}),select:"ID_PRODUCT_TIPE"},
                {panel:"main",name:"etiqueta",box:bx_op({ops:op_products_tipe}),select:"ID_PRODUCT_TAG",load:{name:"ld-products_tags",show:"show"}},
                {panel:"main",name:"unidad",box:bx_op({ops:[]}),select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
                {panel:"main",name:"activo",box:bx_active_input,select:"ACTIVE"},
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
                {panel:"main",col:9,tipe:1,name:"producto",box:bx_input,select:"NAME"},
                {panel:"main",col:3,tipe:0,name:"activo",box:bx_active_input,select:"ACTIVE"},
                
                {panel:"main",col:12,tipe:1,name:"tipo",box:bx_op({ops:op_products_tipe}),select:"ID_PRODUCT_TIPE"},

                {panel:"main",col:8,tipe:1,colAllLevel:true,name:"etiqueta",box:{tipe:3},select:"ID_PRODUCT_TAG",load:{name:"ld-products_tags",show:"show"}},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"edit-tag",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-pencil-square"></i>'},action:"edit-tag"},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"add-tag",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-plus-circle"></i>'},action:"add-tag"},

                {panel:"main",col:8,tipe:1,colAllLevel:true,name:"unidad",box:bx_op({ops:[]}),select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"edit-und",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-pencil-square"></i>'},action:"edit-und"},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"add-und",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-plus-circle"></i>'},action:"add-und"},

                {panel:"main",col:6,tipe:1,name:"costo unitario",box:{tipe:1,value:0},select:"COST_UNIT"},
                {panel:"main",col:6,tipe:1,name:"precio unitario",box:{tipe:1,value:0},select:"PRICE_UNIT"},

                {panel:"main",col:6,tipe:1,name:"stock total",box:{tipe:1,value:0},select:"STOCK_TOTAL"},
                {panel:"main",col:6,tipe:1,name:"stock limite",box:{tipe:1,value:0},select:"STOCK_LIMIT"},
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
                {panel:"main",col:12,name:"etiqueta",box:bx_input,select:"NAME"},
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
                {panel:"main",name:"unidad",box:bx_input,select:"NAME"},
                {panel:"main",name:"simbolo",box:bx_input,select:"SIMBOL"},
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
