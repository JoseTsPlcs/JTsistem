
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var group = new CrudsGroup({
        userData,parent:pageData.body,
        pageData,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-prod",col:12},
                {name:"prnt-prod-md",col:12},
              ],
            },
          },
          {modal:{parent:"prnt-prod-md",name:"md-prod",size:"xl"}},
          {
            steps:{
              parent:"md-prod",
              items:[
                {name:"stp-prod",title:"produccion"},
                {name:"stp-recipe",title:"receta"},
              ],
            },
          },
          //-----produccion --- table
          {
            crud:{
              parent:"prnt-prod",name:"cr-produccions",
              title:"ordenes de produccion",schema:sch_produccion,
              panels:[
                {
                  tipe:"table",head:false,
                  fieldsSet:[
                    {value:"dateEmmit",state:"show",asc:false},
                    {value:"productResult",state:"show"},
                    {value:"cantResult",state:"show"},
                    {value:"comment",state:"show"},
                  ],
                }
              ],
            }
          },
          //----produccion ---- edit
          {
            crud:{
              parent:"stp-prod",name:"cr-prod-fm",modal:"md-prod",
              title:"orden de produccion",schema:sch_produccion,
              panels:[
                {
                  tipe:"form",head:false,
                  fieldsSet:[
                    {value:"dateEmmit",state:"edit"},
                    {
                      value:"productResult",state:"edit",
                      update:({groups,crudBuild,field})=>{
                        
                        group.CrudJoin({
                          masterCrud:"cr-prod-fm",
                          masterFieldValue:"productResult",
                          maidCrud:"cr-recipe",
                          maidSelect:"ID_PRODUCT",
                        });

                      }
                    },
                    {value:"cantResult",state:"edit"},
                    {action:"div",name:"prnt-prod-inputs"},
                    {value:"comment",state:"edit"},
                  ],
                }
              ],
              events:[
                {
                  name:"filterRecipe",
                  actions:[{
                    action:({k})=>{

                      group.CrudJoin({
                        masterCrud:"cr-prod-fm",
                        masterFieldValue:"productResult",
                        maidCrud:"cr-recipe",
                        maidSelect:"ID_PRODUCT",
                      });
                    }
                  }]
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{

                      k.CallEvent({name:"filterRecipe"});
                    }
                  }]
                },
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({k,field})=>{

                      if(field.name=="productResult") k.CallEvent({name:"filterRecipe"});
                    }
                  }]
                },
              ],
            }
          },
          {
            crud:{
              parent:"prnt-prod-inputs",name:"cr-prod-inputs-tb",
              title:"lista de insumos",schema:sch_produccion_inputs,
              panels:[
                {
                  tipe:"table",head:false,h:400,
                  fieldsSet:[
                    {value:"input",state:"edit"},
                    {value:"cant",state:"edit"},
                  ],
                }
              ]
            }
          },
          //-----recipe------
          {
            crud:{
              parent:"stp-recipe",name:"cr-recipe",
              title:"receta",schema:sch_items,stateStart:"block",
              panels:[
                {
                  tipe:"form",head:false,
                  fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"unid",state:"show"},
                    {value:"cantRecipe",state:"show"},
                    {action:"div",name:"div-recipe-inputs"},
                  ],
                }
              ],
            },
          },
          {
            crud:{
              parent:"div-recipe-inputs",name:"cr-recipe-inputs",
              title:"lista de insumos",schema:sch_recipe_inputs,
              panels:[
                {
                  tipe:"table",head:false,h:400,
                  fieldsSet:[
                    {value:"supplie",state:"show",minWidth:0},
                    {value:"cant",state:"show"},
                  ],
                }
              ],
            }
          }

        ],
        conections:[
          {
            masterName:"cr-produccions",
            masterSelect:"ID_PRODUCCION",
            event:"tableForm",
            maidName:"cr-prod-fm",
            maidSelect:"ID_PRODUCCION",
          },
          {
            masterName:"cr-prod-fm",
            masterSelect:"ID_PRODUCCION",
            event:"list",
            maidName:"cr-prod-inputs-tb",
            maidSelect:"ID_PRODUCCION",
          },
          /*{
            masterName:"cr-produccions",
            masterSelect:"ID_PRODUCT",
            event:"tableForm",type:"show",
            maidName:"cr-recipe",
            maidSelect:"ID_PRODUCT",
          },*/
          {
            masterName:"cr-recipe",
            masterSelect:"ID_PRODUCT",
            event:"list",type:"show",
            maidName:"cr-recipe-inputs",
            maidSelect:"ID_PRODUCT",
          }
        ],
      });

      PlayTutorialInPage({group,pageData});
    }
  });

});
