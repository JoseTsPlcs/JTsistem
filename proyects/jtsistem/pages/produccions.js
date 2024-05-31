
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({
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
                {panel:"main",name:"fecha de emision",box:bx_date,select:"DATE_EMMIT"},
                {panel:"main",name:"producto",box:{tipe:3},select:"ID_PRODUCT",load:{name:"products",show:"show"}},
                {panel:"main",name:"unidad",box:{tipe:0},select:"SIMBOL"},
                {panel:"main",name:"cantidad total",box:bx_cant,select:"RESULT_CANT"},
              ],
            }
          },
          {
            name:"orden-fm",
            active:true,
            script:{

              parent:prnt_fm,
              title:"orden de produccion",
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              //stateTools:stTls_tb,
              stateStart:"block",
              //afterInsert:"block",
              //afterUpdate:"block",
              afterDelete:"block",
              afterCancel:"block",
              //afterReload:"block",
    
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
                {panel:"main",name:"producto",box:{tipe:3},select:"ID_PRODUCT",load:{name:"products",show:"show"}},
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
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateTools:stTls_tb,
              stateStart:"block",
              
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
                ld_supplies,
              ],
    
    
              fields:[
                {panel:"main",...fld_delete},
                //{panel:"main",name:"id produccion entrada",box:{tipe:0},select:"ID_PRODUCCION_INPUT"},
                //{panel:"main",name:"id produccion",box:{tipe:0},select:"ID_PRODUCCION"},
                {panel:"main",name:"insumo",box:{tipe:3},select:"ID_INPUT",load:{name:"supplies",show:"show"}},
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
                {col:9,panel:"main",name:"cantidad",box:bx_shw,select:"RECIPE_CANT"},
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
                //{panel:"main",...fld_delete},
                //{panel:"main",name:"id product",box:{tipe:0},select:"ID_PRODUCT"},
                {panel:"main",name:"input",box:bx_shw,select:"ID_INPUT",load:{name:"supplies",show:"show"}},
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
