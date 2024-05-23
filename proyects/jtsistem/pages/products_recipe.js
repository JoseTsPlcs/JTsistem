
$(document).ready(function() {

  new Pag_Base({});


  var gr = new Grid({
    cols:[[12],[12],[12],[12]],
  });

  new ConsCruds({

    cruds:[
      {
        name:"products",
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
            ld_unids,
          ],

          configShow:true,
          filters:config_filters_products,
          fields:[
            {panel:"main",...fld_edit},
            {panel:"main",name:"producto",box:bx_shw,select:"NAME"},
            {panel:"main",name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
            {panel:"main",name:"cantidad",box:bx_cant,select:"RECIPE_CANT"},
            {panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"unids",show:"show"}},
            {panel:"main",name:"activo",box:bx_shw_active,select:"ACTIVE"},
          ],
        }
      },
      {
        name:"recipes-input",
        script:{
          parent:gr.GetColData({x:0,y:1}).col,
          title:"lista de inputs",
          panels:[{col:12,y:0,title:"main",tipe:"table"}],
          stateTools:stTls_tb,

          tableMain:"recipe_input",
          selects:[
            {table:'recipe_input', field:'ID_RECIPE_INPUT',primary:true},
            {table:'recipe_input', field:'ID_PRODUCT'},
            {table:'recipe_input', field:'ID_INPUT'},
            {table:'recipe_input', field:'CANT'},
            {table:'recipe_input', field:'COST_UNIT'},
            {table:'recipe_input', field:'COST_TOTAL'},
          ],
          loads:[
            ld_supplies,
          ],

          fields:[
            {panel:"main",...fld_delete},
            {panel:"main",name:"id product",box:{tipe:0},select:"ID_PRODUCT"},
            {panel:"main",name:"input",box:bx_op({ops:[]}),select:"ID_INPUT",load:{name:"supplies",show:"show"}},
            {panel:"main",name:"cantidad",box:bx_input,select:"CANT"},
          ],
        }
      },
    ],

    conections:[
      {
        tipe:"tb-tb",
        master:"products",
        masterField:"ID_PRODUCT",
        maid:"recipes-input",
        maidField:"ID_PRODUCT",
      },
    ],
  });
  

});
