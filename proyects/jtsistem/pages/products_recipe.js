
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      new CrudsGroup({
        userData,parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-items",col:12},
                {name:"prnt-md-recipe",col:12},
              ],
            }
          },
          {modal:{parent:"prnt-md-recipe",name:"md-recipe"}},
          {
            crud:{
              parent:"prnt-items",name:"cr-items",
              title:"lista de recetas",schema:sch_items,
              stateType:"show",
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"tipe",state:"show",filter:{value:[op_products_tipe[1].show,op_products_tipe[2].show]}},
                    {value:"tag",state:"show"},
                    {value:"unid",state:"show"},
                  ],
                }
              ],
            }
          },
          {
            crud:{
              parent:"md-recipe",name:"cr-recipe",
              title:"receta",schema:sch_items,
              panels:[
                {
                  tipe:"form",head:false,
                  fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"tipe",state:"show"},
                    {value:"cantRecipe",state:"edit",col:12},
                    {value:"unid",state:"show",col:12,tipe:0},
                    {name:"prnt-recipe-inputs",action:"div"},
                  ],
                }
              ],
            }
          },
          {
            crud:{
              parent:"prnt-recipe-inputs",name:"cr-recipe-inputs",
              title:"lista de insumos",schema:sch_recipe_inputs,
              panels:[
                {
                  tipe:"table",head:false,h:400,
                  fieldsSet:[
                    {value:"supplie",state:"edit"},
                    {value:"cant",state:"edit"},
                  ],
                }
              ],
            }
          }
        ],
        conections:[
          {
            masterName:"cr-items",
            masterSelect:"ID_PRODUCT",
            event:"tableForm",
            maidName:"cr-recipe",
            maidSelect:"ID_PRODUCT",
          },
          {
            masterName:"cr-recipe",
            masterSelect:"ID_PRODUCT",
            event:"list",
            maidName:"cr-recipe-inputs",
            maidSelect:"ID_PRODUCT",
          }
        ],
      })
      

    }

  });
  

});
