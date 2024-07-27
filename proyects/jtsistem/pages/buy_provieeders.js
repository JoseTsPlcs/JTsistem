
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var gr = new Grid({
        parent:pageData.body,
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
                //{table:'provideers', field:'ID_PROVIDEER_TIPE'},
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
              
              filters:[
                {name:"nombre",box:{tipe:1},select:{table:"provideers",field:"NAME"}},
                {name:"ruc",box:{tipe:1},select:{table:"provideers",field:"RUC"}},
              ],
              fields:[
                {panel:"main",...fld_delete},
                //{panel:"main",...fld_edit},
                {panel:"main",name:"nombre",attributes:[{name:"style",value:"min-width: 200px;"}],box:bx_input,select:"NAME"},
                {panel:"main",name:"ruc",attributes:[{name:"style",value:"min-width: 150px;"}],box:bx_input,select:"RUC"},
              ],
            }
          },
        ],
    
    
      });

    }
  });

  
  

});
