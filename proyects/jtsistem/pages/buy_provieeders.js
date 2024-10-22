
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var group = new CrudsGroup({
        userData,pageData,
        layers:[
          {
            crud:{
              parent:pageData.body,
              name:"cr-provieeders",
              title:"lista de proveedores",
              schema:sch_provideers,
              panels:[
                {
                  tipe:"table",
                  fields:[
                    {...fld_delete},
                    //{panel:"main",name:"nombre",attributes:[{name:"style",value:"min-width: 200px;"}],box:bx_input,select:"NAME",descripcion:"nombre del proveedor"},
                    //{panel:"main",name:"ruc",attributes:[{name:"style",value:"min-width: 150px;"}],box:bx_input,select:"RUC",descripcion:"ruc del proveedor"},
                  ],
                  fieldsSet:[
                    //{action:"delete"},
                    {value:"name",state:"edit"},
                    {value:"ruc",state:"edit"},
                  ],
                }
              ],
              
              
            }
          }
        ],
      });
    
      PlayTutorialInPage({group,pageData});
    }
  });

  
  

});
