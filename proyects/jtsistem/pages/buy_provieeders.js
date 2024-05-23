
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({
        cols:[[12],[12]],
      });
      var md = new Modal({
        parent:gr.GetColData({x:0,y:1}).col,
      });
    
      new ConsCruds({
    
        cruds:[
          {
            name:"proveedores",
            active:true,
            script:{
              parent:gr.GetColData({x:0,y:0}).col,
              title:"lista de proveedores",
              panels:[{col:12,y:0,tipe:"table",title:"main"}],
              stateTools:stTls_tb,
    
              tableMain:"provideers",
              selects:[
                {table:'provideers', field:'ID_PROVIDEER',primary:true},
                {table:'provideers', field:'NAME'},
                {table:'provideers', field:'ID_PROVIDEER_TIPE'},
                {table:'provideers', field:'RUC'},
              ],
              conditions:[
                {
                  table:"provideers",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:userData.company.id,
                }
              ],
              inserts:[
                {field:"ID_COMPANY",value:userData.company.id}
              ],
    
              fields:[
                {panel:"main",...fld_delete},
                //{panel:"main",...fld_edit},
                {panel:"main",name:"nombre",box:bx_input,select:"NAME"},
                {panel:"main",name:"ruc",box:bx_input,select:"RUC"},
              ],
            }
          },
        ],
    
    
      });

    }
  });

  
  

});
