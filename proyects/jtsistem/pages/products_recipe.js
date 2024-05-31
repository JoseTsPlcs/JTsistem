
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({
        cols:[[12],[12],[12],[12]],
      });

      var md1 = new Modal({
        parent:gr.GetColData({x:0,y:1}).col,
        size:"lg",
      });
      var md1Gr = new Grid({
        parent:md1.GetContent(),
        cols:[[12],[12]],
      });
      var prt_rec_fm = md1Gr.GetColData({x:0,y:0}).col;
      var prt_rec_tb= md1Gr.GetColData({x:0,y:1}).col;
    
      new ConsCruds({
    
        cruds:[
          {
            name:"products",
            active:true,
            script:{
              parent:gr.GetColData({x:0,y:0}).col,
              title:"lista de recetas",
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
                      
                      {name:"pages",show:false},
                  ],
              }
              ],
    
              tableMain:"products",
              selects:[
                {table:'products', field:'ID_PRODUCT',primary:true},
                {table:'products', field:'NAME'},
                {table:'products', field:'ID_PRODUCT_TIPE'},
                {table:'products', field:'UNID_ID'},
                {table:'products', field:'RECIPE_CANT'},
                {table:'products', field:'ACTIVE'},
              ],
              loads:[
                {
                  name:"ld-unids",
                  tableMain:"unids",
                  selects:[
                      {table:'unids', field:'ID_UNID',as:"value"},
                      {table:'unids', field:'SIMBOL',as:"show"},
                  ],
                  conditions:[
                    {
                      table:"unids",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:userData.company.id,
                    }
                  ]
                },
                {
                  name:"ld-products_tags",
                  tableMain:"products_tags",
                  selects:[
                    {table:'products_tags', field:'ID_PRODUCT_TAG',as:"value"},
                    {table:'products_tags', field:'NAME',as:"show"},
                  ],
                  conditions:[
                    {
                      table:"products_tags",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:userData.company.id,
                    }
                  ]
                }
              ],
    
              configShow:false,
              filters:[
                {name:"producto",box:bx_input,select:{table:"products",field:"NAME"}},
                {name:"tipo",box:{tipe:4,options:op_products_tipe,value:["producto"]},select:{table:"products",field:"ID_PRODUCT_TIPE"}},
                //{name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"}},
                {...flt_active,select:{table:"products",field:"ACTIVE"}},
                //{name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"}},
              ],
              fields:[
                {panel:"main",...fld_edit},
                {panel:"main",name:"producto",box:bx_shw,select:"NAME"},
                {panel:"main",name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
                //{panel:"main",name:"cantidad",box:bx_cant,select:"RECIPE_CANT"},
                //{panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
                {panel:"main",name:"activo",box:bx_active_show,select:"ACTIVE"},
              ],
            }
          },
          {
            name:"recipes-fm",
            active:true,
            script:{
              parent:prt_rec_fm,
              title:"receta",
              panels:[{col:12,y:0,title:"main",tipe:"form",head:false}],
              stateStart:"block",
    
              tableMain:"products",
              selects:[
                {table:'products', field:'ID_PRODUCT',primary:true},
                {table:'products', field:'NAME'},
                {table:'products', field:'ID_PRODUCT_TIPE'},
                {table:'products', field:'UNID_ID'},
                {table:'products', field:'RECIPE_CANT'},
                {table:'products', field:'ACTIVE'},
              ],
              loads:[
                {
                  name:"ld-unids",
                  tableMain:"unids",
                  selects:[
                      {table:'unids', field:'ID_UNID',as:"value"},
                      {table:'unids', field:'SIMBOL',as:"show"},
                  ],
                  conditions:[
                    {
                      table:"unids",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:userData.company.id,
                    }
                  ]
                },
                {
                  name:"ld-products_tags",
                  tableMain:"products_tags",
                  selects:[
                    {table:'products_tags', field:'ID_PRODUCT_TAG',as:"value"},
                    {table:'products_tags', field:'NAME',as:"show"},
                  ],
                  conditions:[
                    {
                      table:"products_tags",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:userData.company.id,
                    }
                  ]
                }
              ],
    
              fields:[
                {panel:"main",name:"producto",box:bx_shw,select:"NAME"},
                //{panel:"main",name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
                {col:9,panel:"main",name:"cantidad",box:bx_cant,select:"RECIPE_CANT"},
                {col:3,panel:"main",tipe:0,name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
                //{panel:"main",name:"activo",box:bx_active_show,select:"ACTIVE"},
              ],
              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md1.SetActive({active});
                    }
                  }]
                }
              ],
            }
          },
          {
            name:"recipes-tb",
            active:true,
            script:{
              parent:prt_rec_tb,
              title:"lista de inputs",head:false,
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateStart:"block",
    
              tableMain:"recipe_input",
              selects:[
                {table:'recipe_input', field:'ID_RECIPE_INPUT',primary:true},
                {table:'recipe_input', field:'ID_PRODUCT'},
                {table:'recipe_input', field:'ID_INPUT'},
                {table:'recipe_input', field:'CANT'},
                {table:'recipe_input', field:'COST_UNIT'},
                {table:'recipe_input', field:'COST_TOTAL'},
                {table:"unids",field:"SIMBOL",as:"UNID"},
              ],
              joins:[
                {
                  main:{table:"recipe_input",field:"ID_PRODUCT"},
                  join:{table:"products",field:"ID_PRODUCT"},
                  tipe:"LEFT",
                },
                {
                  main:{table:"products",field:"UNID_ID"},
                  join:{table:"unids",field:"ID_UNID"},
                  tipe:"LEFT",
                },
              ],
              loads:[
                ld_supplies,
              ],
    
              fields:[
                {panel:"main",...fld_delete},
                {panel:"main",name:"id product",box:{tipe:0},select:"ID_PRODUCT"},
                {panel:"main",name:"input",box:bx_op({ops:[]}),select:"ID_INPUT",load:{name:"supplies",show:"show"}},
                {panel:"main",name:"cantidad",box:bx_input,select:"CANT"},
                {panel:"main",name:"unidad",box:bx_shw,select:"UNID"},
              ],
            }
          },
        ],
    
        conections:[
          {
            tipe:"tb-fm",
            master:"products",
            masterField:"ID_PRODUCT",
            maid:"recipes-fm",
            maidField:"ID_PRODUCT",
          },
          {
            tipe:"fm-tb",
            master:"recipes-fm",
            masterField:"ID_PRODUCT",
            maid:"recipes-tb",
            maidField:"ID_PRODUCT",
          },
        ],
      });
    }

  });
  

});
