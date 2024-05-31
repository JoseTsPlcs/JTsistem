
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({
        cols:[[6,6]],
        attributes:[
          {x:0,y:0,attributes:[{name:"class",value:"col-12 col-md-6"}]},
          {x:1,y:0,attributes:[{name:"class",value:"col-12 col-md-6"}]},
        ],
      });
    
      new ConsCruds({
    
        cruds:[
          {
            name:"unids",
            active:true,
            script:{
              parent:gr.GetColData({x:0,y:0}).col,
              title:"lista de unidades",blocked:false,
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateTools:stTls_tb,
    
              tableMain:"unids",
              selects:[
                {table:'unids', field:'ID_UNID',primary:true},
                {table:'unids', field:'NAME'},
                {table:'unids', field:'SIMBOL'},
              ],
              conditions:[{
                //before:" AND ",
                table:"unids",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],
              inserts:[{
                field:"ID_COMPANY",
                value:userData.company.id,
              }],
    
              fields:[
                //{panel:"main",...fld_delete},
                {panel:"main",name:"unidad",box:bx_input,select:"NAME"},
                {panel:"main",name:"simbolo",box:bx_input,select:"SIMBOL"},
              ],
            }
          },
          {
            name:"tags",
            active:true,
            script:{
              parent:gr.GetColData({x:1,y:0}).col,
              title:"lista de etiquetas",blocked:false,
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateTools:stTls_tb,
    
              tableMain:"products_tags",
              selects:[
                {table:'products_tags', field:'ID_PRODUCT_TAG',primary:true},
                {table:'products_tags', field:'NAME'},
              ],
              conditions:[{
                //before:" AND ",
                table:"products_tags",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],
              inserts:[{
                field:"ID_COMPANY",
                value:userData.company.id,
              }],
    
              fields:[
                //{panel:"main",...fld_delete},
                {panel:"main",name:"etiqueta",box:bx_input,select:"NAME"},
              ],
            }
          },
        ],
      });
    }
  });
  

});
