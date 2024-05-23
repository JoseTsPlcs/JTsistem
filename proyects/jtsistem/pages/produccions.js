
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({
        cols:[[12],[6,6],[12],[12]],
      });
    
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
            name:"produccions-inputs",
            active:true,
            script:{
    
              parent:gr.GetColData({x:0,y:2}).col,
              title:"entradas de produccion",
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateTools:stTls_tb,
              
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
          }
        ],
    
        conections:[
          {
            tipe:"tb-tb",
            master:"produccions",
            masterField:"ID_PRODUCCION",
            maid:"produccions-inputs",
            maidField:"ID_PRODUCCION",
          }
        ],
      });
      
    }
  });

});
