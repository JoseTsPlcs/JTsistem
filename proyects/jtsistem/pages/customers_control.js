
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      //pageBuildCruds({userData,pageData});
      new CrudsGroup({
        userData,
        parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"main",col:12},
                {name:"prnt-md",col:12},
              ],
            }
          },
          {
            crud:{
              parent:"main",name:"cr-cus-tb",
              schema:sch_customers,title:"lista de clientes",
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"document",state:"show"},
                    {value:"nroDoc",state:"show"},
                    {value:"cel",state:"show"},
                    {value:"dir",state:"show"},
                    {value:"email",state:"show"},
                    {value:"comment",state:"show"},
                  ],
                }
              ],
            }
          },
        ],
        groups:[
          {
            ...gp_customer({parentName:"prnt-md",masterCrud:"cr-cus-tb"}),
          }
        ],
      })
    }
  });

  
  

});
