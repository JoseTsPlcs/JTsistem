
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
                {name:"item",col:12},
              ]
            }
          },
          {
            crud:{
              recordName:"item",
              parent:"main",
              name:"cr-items",title:"lista de items",
              schema:sch_items,
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"name"},
                    {value:"tipe"},
                    {value:"tag"},
                    {value:"active"},
                  ],
                }
              ],
            }
          }
        ],
        conections:[
          {
            event:"cnx",
            masterName:"cr-items",masterAction:"edit",
            masterSelect:"ID_PRODUCT",
            maidName:"cr-item",
            maidSelect:"ID_PRODUCT",
          }
        ],
        groups:[
          {
            ...gp_item({
              parentName:"item",
              itemEvents:[
                {
                  name:"filterItem",
                  actions:[{
                    action:({k})=>{

                      var cr_item = group.crudGetBuild({crudName:"cr-item"});
                      console.log(cr_item);
                      
                      var recipeShow = cr_item.CallEvent({name:"recipeShowGet"});
                      var cr_recipe = group.crudGetBuild({crudName:"cr-recipe-inputs"});
                      cr_recipe.tutorialSetBlock({block:!recipeShow});
                    }
                  }]
                },
                {
                  name:"updateAfter",
                  actions:[{
                    action:({})=>{

                      group.crudGetBuild({crudName:"cr-items"}).SetState({stateName:"reload"});
                    }
                  }]
                }
              ],
            }),
          }
        ],
      });

      PlayTutorialInPage({pageData,group});
    }
  });
  

});
