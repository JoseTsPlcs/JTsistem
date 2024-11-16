

function gp_item({parentName,itemEvents=[]}) {
    
    return {
        layers:[
            {
                grid:{
                    parent:parentName,
                    items:[
                        {name:"prnt-md-item",col:12},
                        {name:"prnt-md-tags",col:12},
                        {name:"prnt-md-unids",col:12},
                    ],       
                },
            },
            {modal:{parent:"prnt-md-item",name:"md-item"}},
            {
                crud:{
                  parent:"md-item",name:"cr-item",recordName:"item",
                  title:"item",schema:sch_items,head:false,
                  panels:[
                    {
                        tipe:"form",title:"informacion general",
                        fieldsSet:[
                            {value:"name",state:"edit",boxValue:"nombre del paquete",col:12},
                            {value:"active",state:"edit",boxValue:1,col:6,tipe:0},
                            {value:"tipe",state:"edit",col:6},
    
                            {value:"unid",state:"edit",col:6,tipe:0},
                            {value:"tag",state:"tag",state:"edit",col:6,tipe:0},
    
                            {value:"price",state:"edit",col:12},
                            {value:"costUnit",state:"edit",col:12},
                        ],
                    },
                    {
                        tipe:"form",head:false,h:0,title:"stock",name:"stock",
                        fieldsSet:[
    
                            {value:"stock",state:"edit",boxValue:999,col:6},
                            {value:"limit",state:"edit",boxValue:-999,col:6},
                        ],
                    },
                    {
                        tipe:"form",title:"receta",name:"recipe",
                        fieldsSet:[
                            {value:"produccionAutomate",state:"edit",col:7,tipe:2},
                            {value:"cantRecipe",state:"edit",col:5,tipe:2},
                            {name:"prnt-recipe-inputs",action:"div"},
                        ],
                    },
                  ],
                  stateStart:"block",
                  afterUpdate:"block",
                  afterInsert:"block",
                  states:[
                    {
                      name:"reload",
                      tools:[
                        {name:"title",show:true,value:"item"},
                        {name:"tutorial",show:true},
                        //{name:"reload",show:true},
                        {name:"update",show:true},
                        {name:"cancel",show:true},
                      ],
                    },
                    {
                      name:"new",
                      tools:[
                        {name:"title",show:true,value:"item"},
                        {name:"tutorial",show:true},
                        //{name:"reload",show:true},
                        {name:"insert",show:true},
                        {name:"cancel",show:true},
                      ],
                    }
                  ],
                  events:[
                    {
                        name:"boxUpdate",
                        actions:[{
                            action:({field,k})=>{
    
                                if(field.name=="tipe") k.CallEvent({name:"filterItem"});
                            }
                        }]
                    },
                    {
                        name:"printAfter",
                        actions:[{
                            order:-999,
                            action:({k})=>{
    
                                k.CallEvent({name:"filterItem"});
                            }
                        }]
                    },
                    {
                        name:"newAfter",
                        actions:[{
                            action:({k})=>{
    
                                k.CallEvent({name:"filterItem"});
                            }
                        }]
                    },
                    {
                        name:"recipeShowGet",
                        actions:[{
                            action:({k})=>{

                                var body = k.bodyGet();
                                var tipe = body.fieldGetValues({fieldName:"tipe"})[0];
                                var wStock = body.panelGetBuild({panelName:"stock"});
                                wStock.Conteiner_Show({
                                    show:(tipe!=1&&tipe!=5&&tipe!=4),
                                    slow:false,
                                    ignoreBlock:true
                                });

                                var wRecipe = body.panelGetBuild({panelName:"recipe"});
                                return (tipe==5||tipe==4);
                            }
                        }]
                    },
                    {
                        name:"filterItem",
                        actions:[{
                            action:({k})=>{
    
                                var body = k.bodyGet();
                                var tipe = body.fieldGetValues({fieldName:"tipe"})[0];
                                var wStock = body.panelGetBuild({panelName:"stock"});
                                wStock.Conteiner_Show({
                                    show:(tipe!=1&&tipe!=5&&tipe!=4),
                                    slow:false,
                                    ignoreBlock:true
                                });

                                var wRecipe = body.panelGetBuild({panelName:"recipe"});
                                var showRecipe = (tipe==5||tipe==4);
                                wRecipe.Conteiner_Show({
                                    show:showRecipe,
                                    slow:false,
                                    ignoreBlock:true
                                });
                                wRecipe.Head_Show({
                                    show:showRecipe,
                                    slow:false,
                                });

                                //group.crudGetBuild({crudName:"cr-recipe-inputs"}).tutorialSetBlock({block:!showRecipe});
                            }
                        }]
                    },
                    ...itemEvents,
                  ],
                  tutorials:[
                    {
                        value:"deliv",show:"¿como ingreso delivery?",active:true,
                        elementsInfo:({k})=>{

                            var elementsInfo = [];

                            var actionsSet=[
                                {fieldName:"name",value:"delivery a [zona]",descripcion:"ingresa el nombre de la zona del delivery"},
                                {fieldName:"tipe",value:1,descripcion:"selecciona servicio"},
                                {fieldName:"tag",valueSearch:"delivery",descripcion:"selecciona como etiqueta: delivery"},
                                {fieldName:"price",value:1,descripcion:"ingresa el precio del delivery"},
                                {toolName:"update"},
                                {toolName:"new"},
                            ];

                            actionsSet.forEach(act => {
                               
                                if(act.fieldName){

                                    var elementInfo = k.bodyGet().fieldGetElementTutorial({fieldName:act.fieldName});
                                    if(act.descripcion != null) elementInfo.descripcion = act.descripcion;
                                    elementInfo.action = ({})=>{

                                        if(act.value) k.bodyGet().fieldSetValues({fieldName:act.fieldName,values:[act.value]});
                                        if(act.valueSearch){

                                            var box = k.bodyGet().fieldGetBoxes({fieldName:act.fieldName})[0];
                                            var findOption = box.optionsGet().find(op=>op.show==act.valueSearch);

                                            if(findOption!=null) box.SetValue(findOption.value);
                                            else console.log("erro no found value:",act.valueSearch," in field:",act.fieldName);
                                        }
                                    };

                                    elementsInfo.push(elementInfo);
                                }

                                if(act.toolName){

                                    var tool = k.bodyGet().toolGet({toolName:act.toolName});
                                    if(tool.show){

                                        var elementInfo = k.bodyGet().toolGetElementTutorial({toolName:act.toolName});
                                        elementsInfo.push(elementInfo);
                                    }
                                    
                                }
                                
                            });

                            //nombre
                            //servicio
                            //etiqueta
                            //insert/update

                            console.log("delivery info",elementsInfo);
                            

                            return elementsInfo;
                        },
                    },
                  ],
                }
            },
            {
                crud:{
                  parent:"prnt-recipe-inputs",name:"cr-recipe-inputs",head:false,
                  title:"lista de insumos",schema:sch_recipe_inputs,recordName:"insumo",
                  panels:[
                    {
                      tipe:"table",head:false,h:400,
                      fieldsSet:[
                        {value:"supplie",state:"edit"},
                        {value:"cant",state:"edit"},
                      ],
                    }
                  ],
                  states:[
                    {
                      name:"reload",
                      tools:[
                        {name:"insert",show:true},
                        {name:"sizes",show:false,value:999},
                        {name:"load",show:false},
                      ]
                    }
                  ]
                }
            },
            //------------tags---------
            {modal:{parent:"prnt-md-tags",name:"md-tags"}},
            {
                crud:{
                    parent:"md-tags",title:"etiqueta",
                    schema:sch_items_tag,name:"cr-tag",recordName:"etiqueta de item",
                    panels:[{
                        tipe:"form",head:false,
                        fieldsSet:[
                            {value:"name",state:"edit"},
                        ]
                    }],
                    stateStart:"block",
                    stateTools:[
                        {
                            name:"reload",
                            tools:[
                                {name:"update",show:true},
                                {name:"cancel",show:true},
                            ]
                        },
                        {
                            name:"new",
                            tools:[
                                {name:"insert",show:true},
                                {name:"cancel",show:true},
                            ],
                        }
                    ],
                    events:[
                      {
                        name:"insertAfter",
                        actions:[{
                          action:({k})=>{

                            k.SetState({stateName:"block"});
                            k.group.crudGetBuild({crudName:"cr-item"}).Load_Reset({});
                          }
                        }]
                      }
                    ],
                }
            },
            {modal:{parent:"prnt-md-unids",name:"md-unids"}},
            {
                crud:{
                    parent:"md-unids",title:"unidad",recordName:"unidad",
                    schema:sch_unids,name:"cr-unid",
                    panels:[{
                        tipe:"form",head:false,
                        fieldsSet:[
                            {value:"name",state:"edit"},
                            {value:"simbol",state:"edit"},
                        ]
                    }],
                    stateStart:"block",
                    stateTools:[
                        {
                            name:"reload",
                            tools:[
                                {name:"update",show:true},
                                {name:"cancel",show:true},
                            ]
                        },
                        {
                            name:"new",
                            tools:[
                                {name:"insert",show:true},
                                {name:"cancel",show:true},
                            ],
                        }
                    ],
                    events:[
                      {
                        name:"insertAfter",
                        actions:[{
                          action:({k})=>{

                            k.SetState({stateName:"block"});
                            k.group.crudGetBuild({crudName:"cr-item"}).Load_Reset({});
                          }
                        }]
                      }
                    ],
                }
            },
            
        ],
        conections:[
            {
                event:"cnx",
                masterName:"cr-item",
                masterSelect:"ID_PRODUCT",
                maidName:"cr-recipe-inputs",
                maidSelect:"ID_PRODUCT",
            },
            {
                event:"cnx",
                masterName:"cr-item",
                masterFieldName:"tag",
                maidName:"cr-tag",
                maidSelect:"ID_PRODUCT_TAG",
            },
            {
                event:"cnx",
                masterName:"cr-item",
                masterFieldName:"unid",
                maidName:"cr-unid",
                maidSelect:"ID_UNID",
            },
        ]
    }

}

function gp_customer({parentName,masterCrud,masterFieldName=null}) {
  
    return {
      layers:[
          {modal:{parent:parentName,name:"md-cust"}},
          {
            crud:{
              parent:"md-cust",name:"cr-cus-fm",recordName:"cliente",
              schema:sch_customers,title:"cliente",
              panels:[
                {
                  tipe:"form",head:false,
                  fieldsSet:[
                    {value:"name",state:"edit"},
                    {value:"document",state:"edit",tipe:2,col:3},
                    {value:"nroDoc",state:"edit",tipe:2,col:9},
                    {value:"cel",state:"edit"},
                    {value:"dir",state:"edit"},
                    {value:"email",state:"edit"},
                    {value:"comment",state:"edit"},
                  ],
                }
              ],
              states:[
                {
                    name:"reload",
                    tools:[
                        {name:"tutorial",show:true},
                        {name:"update",show:true},
                        {name:"cancel",show:true},
                        
                    ],
                },
                {
                    name:"new",
                    tools:[
                        {name:"tutorial",show:true},
                        {name:"insert",show:true},
                        {name:"cancel",show:true},
                        
                    ],
                },
              ],
            }
          }
      ],
      conections:[
          {
              masterName:masterCrud,
              masterSelect:"ID_CUSTOMER",
              masterFieldName,masterAction:"edit",
              event:(masterFieldName?"formForm":"cnx"),
              maidName:"cr-cus-fm",
              maidSelect:"ID_CUSTOMER",
          },
      ],
    }
}
  
function gp_pays({parent,masterTable,masterFieldPrimary,masterFieldJoin,masterCrud,sch_join,tagValue,listEvents=[],formEvents=[]}) {
      
    return {
        layers:[
            {
                grid:{
                    parent,name:"gr-list-pays",
                    items:[
                        {name:"prnt-list-pays-tb",col:12},
                        {name:"prnt-list-pay-fm-md",col:12},
                    ],
                }
            },
            //list
            {
                crud:{
                    line0:true,
                    parent:"prnt-list-pays-tb",name:"cr-list-pays",h:0,recordName:"pago",
                    title:"lista de pagos",tableMain:masterTable,schema:sch_join,head:false,
                    selects:[
                        {table:masterTable,field:masterFieldPrimary,primary:true},
                        {table:masterTable,field:"ID_PAY"},
                        {table:sch_pays.table,field:"TOTAL"},
                        {table:sch_accounts.table,field:"NAME"},
                        {table:shc_pay_tag.table,field:"NAME",as:"TAGNAME"},
                        {table:sch_pays.table,field:"INCOME"},
                    ],
                    joins:[
                        {
                        main:{table:masterTable,field:"ID_PAY"},
                        join:{table:sch_pays.table,field:"ID_PAY"},
                        tipe:"LEFT",
                        },
                        {
                        main:{table:sch_pays.table,field:"ID_ACCOUNT"},
                        join:{table:sch_accounts.table,field:"ID_ACCOUNT"},
                        tipe:"LEFT",
                        },
                        {
                        main:{table:sch_pays.table,field:shc_pay_tag.fieldPrimary},
                        join:{table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary},
                        tipe:"LEFT",
                        }
                    ],
                    panels:[
                        {
                            tipe:"table",head:false,
                            fields:[
                                {name:"total",title:"total",box:{...bx_money},select:"TOTAL",attributes:[{name:"style",value:"min-width:100px"}]},
                                {name:"account",title:"cuenta",box:{...bx_shw},select:"NAME",attributes:[{name:"style",value:"min-width:150px"}]},
                                {name:"tag",title:"etiqueta",box:{...bx_shw},select:"TAGNAME"},
                                {name:"income",title:"ingreso",box:{...bx_shw,options:[{value:0,show:"egreso"},{value:1,show:"ingreso"}]},select:"INCOME"},
                            ],
                        }
                    ],
                    events:[
                        ...listEvents,
                    ],
                    states:[
                        {
                            name:"reload",
                            tools:[
                                {name:"title",show:true,value:"lista de pagos"},
                                {name:"tutorial",show:true},
                                {name:"new",show:true,value:'<i class="bi bi-plus-circle"></i> ingresar pago'},
                                {name:"sizes",show:false,value:999},
                            ]
                        }
                    ],
                }
            },
            //form
            {modal:{parent:"prnt-list-pay-fm-md",name:"md-pay-fm"}},
            {
                crud:{
                    parent:"md-pay-fm",name:"cr-list-pay",head:false,
                    title:"pago",schema:sch_pays,recordName:"pago",
                    panels:[
                        {
                        tipe:"form",head:false,
                        fieldsSet:[
                            {value:"date",state:"edit"},
                            {
                            value:"account",state:"edit",
                            load:{
                                name:"ld-accounts",
                                tableMain:sch_accounts.table,
                                selects:[
                                {table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"value"},
                                {table:sch_accounts.table,field:"NAME",as:"show"},
                                {table:sch_accounts.table,field:"CONTROL_BY_OPEN",as:"control"},
                                {table:sch_accounts.table,field:"OPEN",as:"open"},
                                ],
                            }
                            },
                            {value:"total",state:"edit"},
                            {
                            value:"tag",state:"show",
                            load:{
                                name:"ld-tags",
                                tableMain:shc_pay_tag.table,
                                selects:[
                                    {table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary,as:"value"},
                                    {table:shc_pay_tag.table,field:"NAME",as:"show"},
                                    {table:shc_pay_tag.table,field:"INCOME",as:"income"},
                                ],
                            },
                            },
                            {value:"comment",state:"edit"},
                            {value:"income",state:"show"},
                        ],
                        }
                    ],
                    states:[
                        {
                            name:"new",
                            tools:[
                                {name:"title",show:true,value:"pago"},
                                {name:"tutorial",show:true},
                                {name:"load",show:true},
                                {name:"insert",show:true},
                                {name:"cancel",show:true},
                            ],
                        },
                        {
                            name:"reload",
                            tools:[
                                {name:"title",show:true,value:"pago"},
                                {name:"tutorial",show:true},
                                {name:"load",show:true},
                                {name:"update",show:true},
                                {name:"cancel",show:true},
                            ],
                        }
                    ],
                    events:[
                        {
                            name:"insertBefore",
                            actions:[{
                                action:({k,inserts})=>{

                                var accountLoadInfo = k.Loaded_GetLoadData({loadName:"ld-accounts"});
                                var accountID = k.bodyGet().fieldGetValues({fieldName:"account"})[0];
                                var accountInfo = accountLoadInfo.result.find(rst=>rst["value"] == accountID);
                                
                                var block = accountInfo.control == "1" && accountInfo.open == "0"; 
                                if(block) alert('no se puede usar la cuenta ' + accountInfo.show + ' sin abrirla antes');

                                var tagID = k.bodyGet().fieldGetValues({fieldName:"tag"})[0];
                                var incomeID = k.bodyGet().fieldGetValues({fieldName:"income"})[0];

                                inserts = [
                                    {field:"ID_PAY_TAG",value:tagID,tipe:"value"},
                                    {field:"INCOME",value:incomeID,tipe:"value"},
                                ];

                                return {block,inserts};
                                }
                            }],
                        },
                        {
                            name:"newAfter",
                            actions:[{
                                action:({k})=>{
                                
                                    var tagLoadInfo = k.Loaded_GetLoadData({loadName:"ld-tags"});
                                    var tagInfo = tagLoadInfo.result.find(rst=>rst["show"] == tagValue);
                                    if(tagInfo){

                                        k.bodyGet().fieldSetValues({fieldName:"tag",values:[tagInfo.value]});
                                        k.bodyGet().fieldSetValues({fieldName:"income",values:[tagInfo.income]});
                                    }
                                    else console.log("tag: "+tagValue+" no exist",tagLoadInfo);
                                    
                                }
                            }]
                        },
                        ...formEvents,
                    ],
                }
            },
        ],
        conections:[
            {
                masterName:masterCrud,
                masterSelect:masterFieldJoin,
                event:"list",
                maidName:"cr-list-pays",
                maidSelect:masterFieldJoin,
            },
            {
                masterName:"cr-list-pays",
                masterSelect:"ID_PAY",
                event:"tableForm",masterAction:"new",
                maidName:"cr-list-pay",
                maidSelect:"ID_PAY",
            }
        ],
    }
}

function gp_pg_recipe({pageData,userData,title,itemOption,test=true}) {
    
    return {
        userData,parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-items",col:12},
                {name:"prnt-md-recipe",col:12},
                {name:"prnt-item-edit",col:12},
              ],
            }
          },
          //{modal:{parent:"prnt-md-recipe",name:"md-recipe"}},
          //--------list------
          {
            crud:{
              parent:"prnt-items",name:"cr-items",
              title,schema:sch_items,
              stateType:"show",
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"tipe",state:"show",filter:{value:[itemOption.show]}},
                    {value:"tag",state:"show"},
                    {value:"unid",state:"show"},
                    {value:"produccionAutomate",state:"show"},
                    {value:"active",state:"show"},
                  ],
                }
              ],
              stateTools:[
                {
                  name:"reload",
                  tools:[
                    {name:"reload",show:true},
                    {name:"insert",show:true},
                    {name:"sizes",value:999,show:false},
                  ]
                }
              ],
              inserts:[
                {field:"NAME",value:"nombre del paquete"},
                {field:"ID_PRODUCT_TIPE",value:itemOption.value},
                {field:"PRODUCCION_AUTOMATE",value:1},
                {field:"CANT_RECIPE",value:1},
              ]
            }
          },
          //--------form------
          /*{
            crud:{
              parent:"md-recipe",name:"cr-recipe",
              title:"receta",schema:sch_items,
              panels:[
                {
                    tipe:"form",title:"informacion general",
                    fieldsSet:[
                        {value:"name",state:"edit",boxValue:"nombre del paquete",col:12},
                        {value:"active",state:"edit",boxValue:1,col:6,tipe:0},
                        {value:"tipe",state:"edit",col:6},

                        {value:"unid",state:"edit",col:6,tipe:0},
                        {value:"tag",state:"tag",state:"edit",col:6,tipe:0},

                        {value:"price",state:"edit",col:12},
                        {value:"costUnit",state:"edit",col:12},
                    ],
                },
                {
                    tipe:"form",head:false,h:0,title:"stock",name:"stock",
                    fieldsSet:[

                        {value:"stock",state:"edit",boxValue:999,col:6},
                        {value:"limit",state:"edit",boxValue:-999,col:6},
                    ],
                },
                {
                    tipe:"form",title:"receta",name:"recipe",
                    fieldsSet:[

                        {value:"produccionAutomate",state:"edit",col:7,tipe:2},
                        {value:"cantRecipe",state:"edit",col:5,tipe:2},
                        {name:"prnt-recipe-inputs",action:"div"},
                    ],
                }
              ],
              stateTools:[
                {
                  name:"reload",
                  tools:[
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                  ],
                }
              ],
              events:[
                {
                    name:"boxUpdate",
                    actions:[{
                        action:({field,k})=>{

                            if(field.name=="tipe") k.CallEvent({name:"filterItem"});
                        }
                    }]
                },
                {
                    name:"printAfter",
                    actions:[{
                        action:({k})=>{

                            k.CallEvent({name:"filterItem"});
                        }
                    }]
                },
                {
                    name:"newAfter",
                    actions:[{
                        action:({k})=>{

                            k.CallEvent({name:"filterItem"});
                        }
                    }]
                },
                {
                    name:"filterItem",
                    actions:[{
                        action:({k})=>{

                            var body = k.bodyGet();
                            var tipe = body.fieldGetValues({fieldName:"tipe"})[0];
                            var wStock = body.panelGetBuild({panelName:"stock"});
                            wStock.Conteiner_Show({
                                show:(tipe!=1&&tipe!=5&&tipe!=4),
                                slow:false,
                                ignoreBlock:true
                            });
                            var wRecipe = body.panelGetBuild({panelName:"recipe"});
                            var showRecipe = (tipe==5||tipe==4);
                            wRecipe.Conteiner_Show({
                                show:showRecipe,
                                slow:false,
                                ignoreBlock:true
                            });
                            wRecipe.Head_Show({
                                show:showRecipe,
                                slow:false,
                            });
                        }
                    }]
                }
              ],
            }
          },
          {
            crud:{
              parent:"prnt-recipe-inputs",name:"cr-recipe-inputs",head:false,
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
              stateTools:[
                {
                  name:"reload",
                  tools:[
                    {name:"insert",show:true},
                    {name:"sizes",show:false,value:999},
                    {name:"load",show:false},
                  ]
                }
              ]
            }
          }*/
        ],
        conections:[
          {
            event:"cnx",
            masterName:"cr-items",
            masterSelect:"ID_PRODUCT",
            masterAction:"edit",
            maidName:"cr-item",
            maidSelect:"ID_PRODUCT",
          },
          /*{
            event:"cnx",
            masterName:"cr-recipe",
            masterSelect:"ID_PRODUCT",
            maidName:"cr-recipe-inputs",
            maidSelect:"ID_PRODUCT",
          }*/
        ],
        groups:[
          {
            ...gp_item({
              parentName:"prnt-item-edit",
            }),
          }
        ],
    }
}




