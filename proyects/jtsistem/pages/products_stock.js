
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
              schema:sch_items,title:"lista de stock",
              stateType:"show",recordName:"item",
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"unid",state:"show"},
                    {value:"stock",state:"edit"},
                    {value:"limit",state:"edit"},
                    {value:"limitOn",state:"show"},

                    {value:"tipe",state:"show",filter:{value:op_products_tipe.filter(op=>op.value!=1).map(op=>{return op.show})}},
                    {value:"tag",state:"show"},
                    {value:"active",state:"show"},
                  ],
                }
              ],
              tutorials:[
                {
                  value:"limit",show:"¿como veo los productos que se estan acabando?",active:true,
                  elementsInfo:({k})=>{

                    return TutorialGetElementInfoByActions({
                      k,
                      actions:[
                        {toolName:"config",click:true},
                        {filterName:"limite",value:1},
                        {toolName:"reload",click:true},
                      ],
                    });
                  }
                },
              ],
            }
          }
        ],
      });

      PlayTutorialInPage({pageData,group});

    }
  });
  

});
