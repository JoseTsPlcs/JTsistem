
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var gr = new Grid({
        parent:pageData.body,
        cols:[
          [12],//0
          [6,6],//1
          [12],//2
          [12],//3
          [12],//4
        ],
      });

      var md1 = new Modal({
        parent:gr.GetColData({x:0,y:4}).col,
        size:"lg",
      });

      var md1stp = new Steps({
        parent:md1.GetContent(),
        steps:[
          {
            name:"orden",
            window:{grid:{cols:[[12],[12]]}}
          },
          {
            name:"receta",
            window:{grid:{cols:[[12],[12]]}}
          },
        ]
      });

      var stpOrden = md1stp.GetStep({stepName:"orden"});
      var prnt_fm = stpOrden.window.Conteiner_GetColData({x:0,y:0}).col;
      var prnt_tb = stpOrden.window.Conteiner_GetColData({x:0,y:1}).col;
      
      var stpRec = md1stp.GetStep({stepName:"receta"});
      var prt_rec_fm = stpRec.window.Conteiner_GetColData({x:0,y:0}).col;
      var prt_rec_tb = stpRec.window.Conteiner_GetColData({x:0,y:1}).col;

    
      new ConsCruds({
    
        cruds:[
          {
            name:"produccions",
            active:true,
            script:{
    
              parent:gr.GetColData({x:0,y:0}).col,
              title:"ordenes de produccion",
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateTools:stTls_tb,
    
              tableMain:"produccions",
              selects:[
                {table:'produccions', field:'ID_PRODUCCION',primary:true},
                {table:'produccions', field:'DATE_EMMIT'},
                {table:'produccions', field:'ID_PRODUCT'},
                {table:'produccions', field:'RESULT_CANT'},
                {table:"unids",field:"SIMBOL"},
              ],
              joins:[
                {
                  main:{table:"produccions",field:"ID_PRODUCT"},
                  join:{table:"products",field:"ID_PRODUCT"},
                  tipe:"LEFT"
                },
                {
                  main:{table:"products",field:"UNID_ID"},
                  join:{table:"unids",field:"ID_UNID"},
                  tipe:"LEFT"
                }
              ],
              orders:[{field:"DATE_EMMIT",asc:false}],
              loads:[
                {
                  name:"products",
                  tableMain:"products",
                  selects:[
                      {table:'products', field:'ID_PRODUCT',as:"value"},
                      {table:'products', field:'NAME',as:"show"},
                  ],
                  conditions:[
                    {
                      table:"products",
                      field:"ID_PRODUCT_TIPE",
                      inter:"=",
                      value:3,
                    },
                    ...cnds_products,
                  ],
                }
              ],
              conditions:[{
                before:" AND ",
                table:"produccions",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],
              inserts:ins_general,
    
              configShow:true,
              filters:[
                {name:"fecha min",box:bx_date_start,select:{table:"produccions",field:"DATE_EMMIT",tipe:"min"}},
                {name:"fecha max",box:bx_date_end,select:{table:"produccions",field:"DATE_EMMIT",tipe:"max"}},
              ],
              fields:[
                {panel:"main",...fld_delete},
                {panel:"main",...fld_edit},
                {panel:"main",name:"fecha de emision",box:bx_shw,select:"DATE_EMMIT"},
                {panel:"main",name:"producto",box:{tipe:0},select:"ID_PRODUCT",load:{name:"products",show:"show"}},
                {panel:"main",name:"unidad",box:{tipe:0},select:"SIMBOL"},
                {panel:"main",name:"cantidad total",box:bx_shw,select:"RESULT_CANT"},
              ],
            }
          },
          {
            name:"orden-fm",
            active:true,
            script:{

              parent:prnt_fm,
              title:"orden de produccion",head:false,
              panels:[{col:12,y:0,title:"main",tipe:"form",head:false}],
              //stateTools:stTls_tb,
              stateStart:"block",
              //afterInsert:"block",
              //afterUpdate:"block",
              afterDelete:"block",
              afterCancel:"block",
              //afterReload:"block",
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:1},
                        {name:"reload",show:true},
                        {name:"update",show:true},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:true},
                        
                        {name:"pages",show:false},
                    ],
                },
              ],
    
              tableMain:"produccions",
              selects:[
                {table:'produccions', field:'ID_PRODUCCION',primary:true},
                {table:'produccions', field:'DATE_EMMIT'},
                {table:'produccions', field:'ID_PRODUCT'},
                {table:'produccions', field:'RESULT_CANT'},
                {table:"unids",field:"SIMBOL"},
              ],
              joins:[
                {
                  main:{table:"produccions",field:"ID_PRODUCT"},
                  join:{table:"products",field:"ID_PRODUCT"},
                  tipe:"LEFT"
                },
                {
                  main:{table:"products",field:"UNID_ID"},
                  join:{table:"unids",field:"ID_UNID"},
                  tipe:"LEFT"
                }
              ],
              loads:[
                {
                  name:"products",
                  tableMain:"products",
                  selects:[
                      {table:'products', field:'ID_PRODUCT',as:"value"},
                      {table:'products', field:'NAME',as:"show"},
                  ],
                  conditions:[
                    {
                      table:"products",
                      field:"ID_PRODUCT_TIPE",
                      inter:"=",
                      value:3,
                    },
                    {
                      before:" AND ",
                      table:"products",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:userData.company.id,
                    },
                  ],
                }
              ],
              conditions:[{
                before:" AND ",
                table:"produccions",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],
              inserts:ins_general,

              fields:[
                {panel:"main",name:"fecha de emision",box:bx_date,select:"DATE_EMMIT"},
                {panel:"main",name:"producto",box:{tipe:8,class:"w-100"},select:"ID_PRODUCT",load:{name:"products",show:"show"}},
                {panel:"main",name:"unidad",box:{tipe:0},select:"SIMBOL"},
                {panel:"main",name:"cantidad total",box:bx_cant,select:"RESULT_CANT"},
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
            name:"orden-tb",
            active:true,
            script:{
    
              parent:prnt_tb,
              title:"entradas de produccion",head:false,
              panels:[{col:12,y:0,title:"main",tipe:"table",head:false,h:500}],
              stateTools:stTls_tb,
              stateStart:"block",
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:true},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:false},
                        {name:"update",show:false},
                        {name:"new",show:true},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                },
                {
                  name:"new",
                  tools:[
                      {name:"config",show:false},
                      {name:"load",show:true},
                      
                      {name:"excel",show:false},
                      {name:"pdf",show:false},
          
                      {name:"sizes",show:false,value:999},
                      {name:"reload",show:false},
                      {name:"update",show:false},
                      {name:"new",show:false},
                      {name:"insert",show:true},
                      {name:"cancel",show:true},
                      {name:"addLine",show:true},
                      
                      {name:"pages",show:false},
                  ],
              },
              ],
              
              tableMain:"produccions_input",
              selects:[
                {table:'produccions_input', field:'ID_PRODUCCION_INPUT',primary:true},
                {table:'produccions_input', field:'ID_PRODUCCION'},
                {table:'produccions_input', field:'ID_INPUT'},
                {table:'produccions_input', field:'CANT_TOTAL'},
                {table:"unids",field:"SIMBOL"},
              ],
              joins:[
                {main:{table:"produccions_input",field:"ID_INPUT"},join:{table:"products",field:"ID_PRODUCT"},tipe:"LEFT"},
                {main:{table:"products",field:"UNID_ID"},join:{table:"unids",field:"ID_UNID"},tipe:"LEFT"}
              ],
              loads:[
                ld_supplies_products,
              ],
    
    
              fields:[
                {panel:"main",...fld_delete},
                //{panel:"main",name:"id produccion entrada",box:{tipe:0},select:"ID_PRODUCCION_INPUT"},
                //{panel:"main",name:"id produccion",box:{tipe:0},select:"ID_PRODUCCION"},
                {panel:"main",name:"insumo",box:{tipe:8,class:"w-100"},select:"ID_INPUT",load:{name:"ld-supplies-products",show:"show"}},
                {panel:"main",name:"unidad",box:{tipe:0},select:"SIMBOL"},
                {panel:"main",name:"cantidad total",box:bx_cant,select:"CANT_TOTAL"},
              ],
    
    
            }
          },
          {
            name:"recipes-fm",
            active:true,
            script:{
              parent:prt_rec_fm,
              title:"receta",head:false,
              panels:[{col:12,y:0,title:"main",tipe:"form",head:false}],
              stateStart:"block",
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:1},
                        {name:"reload",show:true},
                        {name:"update",show:false},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                },
                {
                  name:"new",
                  tools:[
                      {name:"config",show:false},
                      {name:"load",show:false},
                      
                      {name:"excel",show:false},
                      {name:"pdf",show:false},
          
                      {name:"sizes",show:false,value:1},
                      {name:"reload",show:false},
                      {name:"update",show:false},
                      {name:"new",show:false},
                      {name:"insert",show:false},
                      {name:"cancel",show:false},
                      
                      {name:"pages",show:false},
                  ],
              },
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
                ld_unids,
              ],
    
              fields:[
                {panel:"main",name:"producto",box:bx_shw,select:"NAME"},
                {col:9,panel:"main",name:"cantidad",box:bx_shw,select:"RECIPE_CANT"},
                {col:3,panel:"main",tipe:0,name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
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
              panels:[{col:12,y:0,title:"main",tipe:"table",head:false}],
              stateStart:"block",
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:false},
                        {name:"update",show:false},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                },
              ],
    
              tableMain:"recipe_input",
              selects:[
                {table:'recipe_input', field:'ID_RECIPE_INPUT',primary:true},
                {table:'recipe_input', field:'ID_PRODUCT'},
                {table:'recipe_input', field:'ID_INPUT'},
                {table:'recipe_input', field:'CANT'},
                {table:'recipe_input', field:'COST_UNIT'},
                {table:'recipe_input', field:'COST_TOTAL'},
                {table:"unids",field:"SIMBOL",as:"UNID"},
                {table:"products",field:"NAME",as:"PRODUCT_NAME"},
              ],
              joins:[
                {
                  main:{table:"recipe_input",field:"ID_INPUT"},
                  join:{table:"products",field:"ID_PRODUCT"},
                  tipe:"LEFT",
                },
                {
                  main:{table:"products",field:"UNID_ID"},
                  join:{table:"unids",field:"ID_UNID"},
                  tipe:"LEFT",
                },
              ],
    
              fields:[
                //{panel:"main",...fld_delete},
                //{panel:"main",name:"id product",box:{tipe:0},select:"ID_PRODUCT"},
                {panel:"main",name:"input",box:bx_shw,select:"PRODUCT_NAME"},
                {panel:"main",name:"cantidad",box:bx_shw,select:"CANT"},
                {panel:"main",name:"unidad",box:bx_shw,select:"UNID"},
              ],
            }
          },
        ],
    
        conections:[
          {
            tipe:"tb-fm",
            master:"produccions",
            masterField:"ID_PRODUCCION",
            maid:"orden-fm",
            maidField:"ID_PRODUCCION",
          },
          {
            tipe:"fm-tb",
            master:"orden-fm",
            masterField:"ID_PRODUCCION",
            maid:"orden-tb",
            maidField:"ID_PRODUCCION",
          },

          {
            tipe:"tb-fm",
            master:"produccions",
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
