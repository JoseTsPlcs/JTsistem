
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var group = new CrudsGroup({
        userData,pageData,
        parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"main",col:12},
              ],
            }
          },
          {
            crud:{
              parent:"main",name:"cr-items",
              schema:sch_items,title:"lista de precios",
              stateType:"show",
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"unid",state:"show"},
                    {value:"price",state:"edit"},
                    {value:"costUnit",state:"edit"},
                    {value:"tipe",state:"show"},
                    {value:"tag",state:"show"},
                    {value:"active",state:"show"},
                  ],
                }
              ],
            }
          }
        ],
      });

      PlayTutorialInPage({pageData,group});
    }

  });
  

});
