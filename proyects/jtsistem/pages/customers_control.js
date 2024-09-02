
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
          {modal:{parent:"prnt-md",name:"md-cust"}},
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
          {
            crud:{
              parent:"md-cust",name:"cr-cus-fm",
              schema:sch_customers,title:"cliente",
              panels:[
                {
                  tipe:"form",head:false,
                  fieldsSet:[
                    {value:"name",state:"edit"},
                    {value:"document",state:"edit"},
                    {value:"nroDoc",state:"edit"},
                    {value:"cel",state:"edit"},
                    {value:"dir",state:"edit"},
                    {value:"email",state:"edit"},
                    {value:"comment",state:"edit"},
                  ],
                }
              ],
            }
          }
        ],
        conections:[
          {
            masterName:"cr-cus-tb",
            masterSelect:"ID_CUSTOMER",
            event:"tableForm",
            maidName:"cr-cus-fm",
            maidSelect:"ID_CUSTOMER",
          }
        ],
      })
    }
  });

  
  

});
