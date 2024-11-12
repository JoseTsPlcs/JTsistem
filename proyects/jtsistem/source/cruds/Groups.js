
function gp_conect_md({parentName}) {
    
    

}

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

//---------------------

function Build_salesControl({userData,pageData,title="lista de ventas",fpay,fstate}) {
    

    var CustomerJoinSale = {
        main:{table:sch_sales.table,field:sch_customers.fieldPrimary},
        join:{table:sch_customers.table,field:sch_customers.fieldPrimary},
        tipe:"LEFT",
    };
    
    var group = new CrudsGroup({
    userData,pageData,parent:pageData.body,
    layers:[
        {
            grid:{
                parent:pageData.body,
                items:[
                {name:"prnt-sales",col:12},
                {name:"prnt-md-sale",col:12},
                ],
            }
        },
        //-----sale list-----
        {
            crud:{
                name:"cr-sales",parent:"prnt-sales",
                title,schema:sch_sales,recordName:"venta",
                config:{show:false},
                selects:[
                    {table:sch_customers.table,field:"NAME",as:"CUS-NAME"},
                ],
                joins:[
                    {
                        main:{table:sch_sales.table,field:sch_customers.fieldPrimary},
                        join:{table:sch_customers.table,field:sch_customers.fieldPrimary},
                        tipe:"LEFT",
                    }
                ],
                panels:[
                {
                    tipe:"table",head:false,
                    fields:[
                        {name:"customer",title:"nombre del cliente",select:"CUS-NAME",box:{tipe:0,class:"w-100"},attributes:[{name:"style",value:"min-width:300px"}]},
                    ],
                    fieldsSet:[
                    //{value:"customer"},
                    {value:"status",state:"edit",filter:{value:fstate}},
                    {value:"pay",state:"show",minWidth:100,filter:{value:fpay}},
                    {value:"total",state:"show"},
                    {value:"comment",state:"edit",minWidth:300},
                    {value:"emmit",state:"show",minWidth:200},
                    ],
                },
                ],
                filters:[
                    {name:"cliente",box:{tipe:1,class:"w-100"},select:{table:sch_customers.table,field:"NAME"}},
                ],
                states:[
                {
                    name:"reload",
                    tools:[
                    {name:"insert",show:false},
                    {name:"sizes",show:false,value:999},
                    {name:"pages",show:false},
                    {name:"tutorial",show:true},
                    {name:"config",show:true},
                    ]
                }
                ],
                events:[
                    {
                        name:"stateSetFirst",
                        actions:[{
                          action:()=>{}
                        }]
                    },
                ],
            },
        },
        //-----detail-------
        {modal:{size:"xl",parent:"prnt-md-sale",name:"md-sale"}},
        {
        //sale
            crud:{
                parent:"md-sale",title:"venta",recordName:"venta",
                schema:sch_sales,name:"cr-sale",
                selects:[
                    {table:sch_customers.table,field:"NAME",as:"CUS-NAME"},
                    {table:sch_customers.table,field:"COMPANY",as:"CUS-COMPANY"},
                    {table:sch_customers.table,field:"NRO_DOCUMENT",as:"CUS-DOCUMENT"},
                    {table:sch_customers.table,field:"PHONE",as:"CUS-PHONE"},
                    {table:sch_customers.table,field:"DIRECCION",as:"CUS-DIR"},
                    {table:sch_customers.table,field:"EMAIL",as:"CUS-EMAIL"},
                ],
                joins:[
                CustomerJoinSale,
                ],
                panels:[
                {
                    tipe:"form",head:true,title:"informacion",col:6,
                    fieldsSet:[
                    {value:"emmit"},
                    {value:"status"},
                    {value:"pay"},
                    {value:"doc"},
                    {value:"totaldscto"},
                    {value:"dscto"},
                    {value:"total"},                  
                    ],
                },
                {
                    tipe:"form",head:true,title:"cliente",col:6,
                    fields:GetInfoBySchema({
                    schema:sch_customers,userData,
                    fieldsSet:[
                        {value:"name",select:"CUS-NAME"},
                        {value:"document",select:"CUS-COMPANY"},
                        {value:"nroDoc",select:"CUS-DOCUMENT"},
                        {value:"cel",select:"CUS-PHONE"},
                        {value:"dir",select:"CUS-DIR"},
                        {value:"email",select:"CUS-EMAIL"},
                    ],
                    }).fields,
                },
                {
                    tipe:"form",head:true,title:"detalle",
                    fieldsSet:[
                    {action:"div",name:"fld-detail"},
                    
                    ],
                }
                ],
                states:[
                {
                    name:"reload",
                    tools:[
                        {name:"tutorial",show:true},
                        {name:"reload",show:true},
                        {name:"cancel",show:true},
                    ]
                }
                ],
            }
        },
        {
        //sale items
            crud:{
                parent:"fld-detail",head:false,recordName:"item",
                name:"cr-sale-items",schema:sch_sales_products,
                panels:[{
                head:false,tipe:"table",
                fieldsSet:[
                    {value:"item"},
                    {value:"cant"},
                    {value:"priceUnit"},
                    {value:"priceTotal"},
                ]
                }],
                states:[
                {
                    name:"reload",
                    tools:[{name:"sizes",value:999,show:false}],
                },
                ],
            }
        }
    ],
    conections:[
        {
            masterName:"cr-sale",
            masterSelect:"ID_SALE",
            event:"cnx",type:"show",
            maidDelete:false,
            maidName:"cr-sale-items",
            maidSelect:"ID_SALE",
        },
        {
            masterName:"cr-sales",
            masterSelect:"ID_SALE",
            event:"cnx",masterAction:"show",
            maidName:"cr-sale",
            maidSelect:"ID_SALE",
        },
        {
            masterName:"cr-sales",
            event:"send",
            page:"saleNew2",
            select:"ID_SALE",
            param:"saleID",
        },
    ]
    });

    PlayTutorialInPage({group,pageData});
}

function Build_Control({schema,schemaItems}) {
    
    var layers = [{
        grid:{items:[{name:"prnt-main",col:12}]}
    }];
    var conections = [];
    var groups = [];

    //main crud
    var mainInfo = getInfoOfSchema({schema,userData});
    var mainCrud = {
        title:schema.recordName,recordName:schema.recordName,
        parent:"prnt-main",schema,name:"cr-"+schema.table,
        loads:mainInfo.loads,
        selects:mainInfo.selects,
        panels:[
            {
                tipe:"form",col:5,title:"informacion",
                fields:mainInfo.fields.filter(f=>f.panelName=="info"),
            },
            {
                tipe:"form",col:7,title:"conecciones",
                fields:[
                    {action:"div",name:"fld-conec",tipe:0,box:{tipe:0,class:"w-100 m-0 p-0"}},
                ],
            },
            {
                tipe:"form",col:12,title:"total",
                fields:mainInfo.fields.filter(f=>f.panelName=="total"),
            },
        ],
    };
    layers.push({
        crud:mainCrud,
    });


    //steps
    layers.push({
        steps:{
            parent:"fld-conec",
            items:[
                {name:"stp-items",head:false,title:"items"},
                {name:"stp-pays",head:false,title:"pagos"},
            ],
        }
    });

    //items
    var itemsCrud = getCrudType({schema:schemaItems,userData,type:"table"});
    itemsCrud.parent = "stp-items"; 
    itemsCrud.states = [
        {
            name:"reload",
            tools:[
                {name:"load",show:true},
                {name:"sizes",value:999,show:false},
                {name:"pages",show:false},
                {name:"tutorial",show:true},
                {name:"insert",show:true},
            ],
        }
    ];
    layers.push({crud:itemsCrud});
    conections.push({
        event:"cnx",
        masterName:mainCrud.name,
        masterSelect:schema.fieldPrimary,
        maidName:itemsCrud.name,
        maidSelect:schema.fieldPrimary,
    });

    //pays
    groups.push({
        ...gp_pays({
            parent:"stp-pays",
            masterTable:schemaPays.table,
            masterFieldPrimary:schemaPays.fieldPrimary,
            masterFieldJoin:schema.fieldPrimary,
            sch_join:schemaPays,
            masterCrud:mainCrud.name,
            tagValue:payTag,
          }),
    });

    BuildPage({
        crudsGroup:{layers,conections,groups},
        userData,pageData,test,
    });
}

function Build_New({userData,pageData,schema,schemaItems,schemaPays,payTag="venta",test=false}) {
    
    var layers = [{
        grid:{items:[{name:"prnt-main",col:12}]}
    }];
    var conections = [];
    var groups = [];

    //main crud
    var mainInfo = getInfoOfSchema({schema,userData});
    var mainCrud = {
        title:schema.recordName,recordName:schema.recordName,
        parent:"prnt-main",schema,name:"cr-"+schema.table,
        loads:mainInfo.loads,
        selects:mainInfo.selects,
        panels:[
            {
                tipe:"form",col:5,title:"informacion",
                fields:mainInfo.fields.filter(f=>f.panelName=="info"),
            },
            {
                tipe:"form",col:7,title:"conecciones",
                fields:[
                    {action:"div",name:"fld-conec",tipe:0,box:{tipe:0,class:"w-100 m-0 p-0"}},
                ],
            },
            {
                tipe:"form",col:12,title:"total",
                fields:mainInfo.fields.filter(f=>f.panelName=="total"),
            },
        ],
    };
    layers.push({
        crud:mainCrud,
    });

    return;
    //steps
    layers.push({
        steps:{
            parent:"fld-conec",
            items:[
                {name:"stp-items",head:false,title:"items"},
                {name:"stp-pays",head:false,title:"pagos"},
            ],
        }
    });

    //items
    var itemsCrud = getCrudType({schema:schemaItems,userData,type:"table"});
    itemsCrud.parent = "stp-items"; 
    itemsCrud.states = [
        {
            name:"reload",
            tools:[
                {name:"load",show:true},
                {name:"sizes",value:999,show:false},
                {name:"pages",show:false},
                {name:"tutorial",show:true},
                {name:"insert",show:true},
            ],
        }
    ];
    layers.push({crud:itemsCrud});
    conections.push({
        event:"cnx",
        masterName:mainCrud.name,
        masterSelect:schema.fieldPrimary,
        maidName:itemsCrud.name,
        maidSelect:schema.fieldPrimary,
    });

    //pays
    groups.push({
        ...gp_pays({
            parent:"stp-pays",
            masterTable:schemaPays.table,
            masterFieldPrimary:schemaPays.fieldPrimary,
            masterFieldJoin:schema.fieldPrimary,
            sch_join:schemaPays,
            masterCrud:mainCrud.name,
            tagValue:payTag,
          }),
    });

    BuildPage({
        crudsGroup:{layers,conections,groups},
        userData,pageData,test,
    });

}

//------

class BuildPage extends ODD {

    constructor(i) {
        
        i.className = "buildPage";
        super(i);

        this.#Build(i);
    }

    #group = {
        script:{
            layers:[{
                grid:{
                    items:[
                        {name:"prnt-main",col:12},
                    ],
                },
            }],
            conections:[],
            groups:[],
        },
        build:null,
    }
    groupGet(){return this.#group.build;}

    #setCrudMain({mainCrud}){

        mainCrud.parent = "prnt-main";
        this.#group.script.layers.push({crud:mainCrud});
    }

    #addCrudToGrid({crud,modal=false}){

        var crudParentName = "";

        var parentName = "prnt-"+crud.name;
        crudParentName = parentName;
        this.#group.script.layers[0].grid.items.push({name:parentName,col:12});

        if(modal==true){

            var modalName = "md-"+crud.name;
            this.#group.script.layers.push({modal:{parent:parentName,name:modalName,size:"xl"}});
            crudParentName = modalName;
        }

        crud.parent = crudParentName;
        this.#group.script.layers.push({crud});
    }

    #setGroupScript(i){

        switch (i.type) {
            case "new":
                this.#setGroupScriptNew(i);
            break;
        
            case "control":
                this.#setGroupScriptControl(i);
            break;

            case "list":
                this.#setGroupScriptList(i);
            break;

            case "simple":
                this.#setGroupScriptSimple(i);
            break;

            case "free":
                this.#setGroupScriptFree(i);
            break;
        }
    }

    #setGroupScriptNew({schema,mainModVisual,mainTotalVisual,schemaItems,schemaPays,userData,payTag,mainFieldTotal,itemFieldTotal,mainFieldDscto=null,mainFieldTotalDscto=null,mainFieldPay=null,objectInfo,moduloDeliv=false}){
    

        let u = this;

        var acc_pay = Access_Get(userData.access,"md-box-general");
        var acc_add_item = (testNewSetAddItem ? testNewSetAddItemValue : Access_Get(userData.access,"md-items-sale-add"));
        if(testPay) acc_pay = testPaySet;

        //main crud
        var mainCrud = {
            title:schema.record.title,recordName:schema.record.title,head:false,
            parent:"prnt-main",schema,name:"cr-"+schema.record.name,
            loads:[],
            selects:[],
            panels:[
                {
                    tipe:"form",col:5,title:"informacion",
                    fields:[],
                    descripcion:"En esta sección se ingresa la información general de la "+schema.record.title,
                },
                {
                    tipe:"form",col:7,title:"detalle",h:0,
                    fields:[
                        {action:"div",name:"fld-conec",tipe:0,box:{tipe:0,class:"w-100 m-0 p-0"}},
                    ],
                    descripcion:"En esta sección se muestra los detalles de la " + schema.record.title,
                },
                {
                    tipe:"form",col:12,title:"total",
                    fields:[],
                    descripcion:"Muestra los detalles del monto de la "+schema.record.title,
                },
            ],
            states:[
                {
                    name:"reload",
                    tools:[
                        {name:"title",show:true,value:schema.record.title},
                        {name:"tutorial",show:true},
                        {name:"load",show:false},
                        {name:"update",show:true},
                        {name:"cancel",show:true},
                    ]
                },
                {
                    name:"block",
                    tools:[
                        {name:"title",show:true,value:schema.record.title},
                        {name:"tutorial",show:true},
                        {name:"insert",show:true},
                    ]
                },
            ],
            stateStart:(testNew?"reload":"block"),
            afterUpdate:"block",
            tutorials:[],
            events:[
                {
                    name:"tutorialGetElementsInfo",
                    actions:[{
                        action:({value,elementsInfo=[]})=>{

                            if(value=="use"){

                                var stepsBuild = u.#group.build.parentGet({parentName:"stps"}).build;
                                var stepsData = stepsBuild.stepsGet();

                                for (let stp = 0; stp < stepsData.length; stp++) {

                                    const stepInfo = stepsData[stp];
                                    elementsInfo.splice((2+stp+stp*1),0,{
                                        id:stepInfo.stepButton.Blocks_Get()[0].id,
                                        descripcion:stepInfo.descripcion,
                                        action:({element})=>{

                                            element.click();
                                        }
                                    });
                                    elementsInfo.splice((3+stp+stp*1),0,{
                                        id:stepInfo.conteinerDom.id,
                                        descripcion:(stp==0?"en esta seccion se muestra a detalle los items":"en esta seccion se muestra los pagos"),
                                        action:({element})=>{

                                            element.click();
                                        }
                                    });
                                }
                            }

                            return {elementsInfo};
                        }
                    }]
                },
                {
                    name:"tutorialEnd",
                    actions:[{
                        action:({value})=>{

                            if(value=="use"){

                                playTutorialToStep({stepName:"stp-items",crudName:"cr-items",descripcion:"se muestra el detalle de los items de la venta"});
                            }
                        }
                    }]
                }
            ],
        };
        mainCrud.panels[0].fields = mainModVisual.fields.map(fv=>{

            var fsch = schema.fields.find(fsch=>fsch.value==fv.value);
            if(getAccessOfField({fieldSchema:fsch,userData})){
                
                var bxstate = (acc_pay&&mainFieldPay==fv.value) ? "show" : fv.state;
                var info = getInfoByField({table:schema.table,f:fsch,userData,state:bxstate,box:fv.box});
                
                mainCrud.selects = [...mainCrud.selects,info.select];
                mainCrud.loads = [...mainCrud.loads,info.load];
                
                return info.field;
            }
            else return null;            
        }).filter(fv=>fv!=null);
        mainCrud.panels[2].fields = mainTotalVisual.fields.map(fv=>{

            var fsch = schema.fields.find(fsch=>fsch.value==fv.value);
            var info = getInfoByField({table:schema.table,f:fsch,userData,state:fv.state,box:fv.box});
            mainCrud.selects = [...mainCrud.selects,info.select];
            mainCrud.loads = [...mainCrud.loads,info.load];
            
            return info.field;
        });
        mainCrud.events = [
          {
            name:"boxUpdate",
            actions:[{
                action:({field})=>{

                    if(mainFieldDscto!=null&&field.name==mainFieldDscto)  CalculateTotal();
                }
            }]
          },
          {
            name:"setStateAfter",
            actions:[{
              action:({k,stateName})=>{

                var open = stateName!="block";
                k.bodyGet().panelsGet().forEach(panel => {

                    var build = panel.build.buildGet();
                    if(build instanceof Window){
                                                     
                        build.Conteiner_Show({show:open,slow:open,ignoreBlock:true});
                    }
                });
            }
            }]
          },
          {
            name:"tutorialInsertEnd",
            actions:[{
              action:({k})=>{

                k.tutorialPlay({value:"use"});
              }
            }]
          }
        ];

        //object
        if(objectInfo && Access_Get(userData.access,"md-vehicle-general")){

          //load
          var objLd = {...objectInfo.load};
          if(objectInfo.schema.company){

            if(objLd.conditions==null) objLd.conditions = [];
            objLd.conditions.push({
              before:(objLd.conditions.length>0?" AND ":""),
              table:objectInfo.schema.table,
              field:"ID_COMPANY",
              inter:"=",
              value:userData.company.id,
            });
          }
          mainCrud.loads.push(objLd);
          

          //field
          mainCrud.panels[0].fields.push({
            name:objectInfo.name,title:objectInfo.title,
            box:{tipe:8,class:"w-100"},
            load:{name:objLd.name,value:"value",show:"show"},
          });

          //mod
          var objCrud = {
            head:false,
            ...getCrudMult({
              schemaMain:objectInfo.schema,userData,tipe:"form",filters:false,
              fields:objectInfo.schema.fields.map(f=>{return {value:f.value,state:"edit"}}),
            }),
            states:[
              {
                name:"reload",
                tools:[
                  {name:"title",show:true,value:objectInfo.title},
                  {name:"tutorial",show:true},
                  {name:"update",show:true},
                  {name:"cancel",show:true},
                ],
              },
              {
                name:"new",
                tools:[
                  {name:"title",show:true,value:objectInfo.title},
                  {name:"tutorial",show:true},
                  {name:"insert",show:true},
                  {name:"cancel",show:true},
                ],
              },
            ],
          };
          this.#addCrudToGrid({
            crud:objCrud,
            modal:true,
          });
          this.#group.script.conections.push({
            event:"formForm",
            masterName:mainCrud.name,masterFieldName:objectInfo.name,
            masterSelect:"ID_ITEM",
            maidName:objCrud.name,
            maidSelect:objectInfo.schema.fieldPrimary,
          });

        }
        

        this.#setCrudMain({mainCrud});
        this.#group.script.conections.push({
            event:"search",masterName:mainCrud.name,
            masterSelect:schema.fieldPrimary,
            searchValue:schema.fieldPrimary,
        });
        
        //conections
        schema.fields.filter(f=>f.conect&& f.conect.type=="edit" && mainCrud.panels[0].fields.find(fc=>fc.name==f.value)).forEach(f => {
                        
            var crudConect = getCrudType({
                schema:f.conect.schema,tipe:"form",
                dependence:true,state:"edit",
                userData,modal:true,
                visualInfo:{fields:f.conect.schema.fields.map(f=>{return {value:f.value,state:(f.calculate?"show":"edit")};})},
            });
            
            this.#addCrudToGrid({
                modal:true,
                crud:crudConect
            });

            this.#group.script.conections.push({
                event:"formForm",
                masterFieldName:f.value,
                masterName:mainCrud.name,
                masterSelect:schema.fieldPrimary,
                maidName:crudConect.name,
                maidSelect:f.conect.schema.fieldPrimary,
            });
        });
        
        //steps
        this.#group.script.layers.push({
            steps:{
                name:"stps",
                parent:"fld-conec",
                items:[
                    {name:"stp-items",head:false,title:'<i class="bi bi-card-list"></i> items',descripcion:"selecciona para ver los items de la "+ schema.record.title,h:0},
                    (acc_pay?{name:"stp-pays",head:false,title:'<i class="bi bi-currency-dollar"></i> pagos',descripcion:"selecciona para ver los pagos realizados a la "+ schema.record.title,h:0}:null),
                ],
            }
        });
    
        //items
        this.#group.script.layers.push({
          grid:{
            parent:"stp-items",
            items:[
              (acc_add_item?{name:"prnt-new",col:3,name:"item-new",tipe:0,box:{tipe:5,value:"ingresar item",class:"btn btn-primary",update:()=>{u.#group.build.crudGetBuild({crudName:"cr-item"}).SetState({stateName:"new"})}}}:null),
              (acc_add_item?{name:"prnt-item-md",col:9,tipe:0,box:{tipe:0}}:null),
              {name:"prnt-items",col:12},
            ],
          }
        });
        

        var itemsCrud = getCrudType({
            schema:schemaItems,userData,
            visualInfo:{
              fields:schemaItems.fields.filter(f=>f.tipe!="key").map(f=>{return{value:f.value,state:"edit",line0:true}})
            },
            dependence:true,tipe:"table",state:"edit"
        });

        //sale-add
        if(acc_add_item){

          this.#group.script.groups.push({
            ...gp_item({
              parentName:"prnt-item-md",
              itemEvents:[
                {
                  name:"insertAfter",
                  actions:[{
                    action:({k})=>{

                      console.log("insert after block cr-item",k);
                      
                      //k.SetState({stateName:"block"});
                      u.#group.build.crudGetBuild({crudName:itemsCrud.name}).Load_Reset({});
                      //k.SetState({stateName:"new"});
                    }
                  }]
                },
                {
                  name:"updateAfter",
                  actions:[{
                    action:({k})=>{

                      u.#group.build.crudGetBuild({crudName:itemsCrud.name}).Load_Reset({});
                    }
                  }]
                }
              ],
            })
          });
          this.#group.script.conections.push({
            event:"cnx",masterAction:"edit",
            masterName:itemsCrud.name,
            masterSelect:"sales_products-ID_PRODUCT",
            maidName:"cr-item",
            maidSelect:"ID_PRODUCT",
          });
          
        }

        itemsCrud.line0 = true;
        itemsCrud.panels.forEach(pn=>{pn.fields.forEach(f=>{f.attributes=[{name:"class",value:"m-0 py-0 px-1"}]})});

        itemsCrud.parent = "prnt-items"; 
        itemsCrud.panels[0].h=600;
        itemsCrud.states.forEach(st=>{
            var toolInsert = st.tools.find(t=>t.name=="insert");
            if(toolInsert) toolInsert.value = '<i class="bi bi-plus-circle"></i> ingresar item';
        });

        itemsCrud.events = [
            {
                name:"printAfter",
                actions:[{
                    action:()=>{CalculateTotal()}
                }]
            }
        ];

        this.#group.script.layers.push({crud:itemsCrud});
        this.#group.script.conections.push({
            event:"cnx",
            masterName:mainCrud.name,
            masterSelect:schema.fieldPrimary,
            maidName:itemsCrud.name,
            maidSelect:schema.fieldPrimary,
        });

        if(acc_pay){

            //pays
            this.#group.script.groups.push({
                ...gp_pays({
                    parent:"stp-pays",
                    masterTable:schemaPays.table,
                    masterFieldPrimary:schemaPays.fieldPrimary,
                    masterFieldJoin:schema.fieldPrimary,
                    sch_join:schemaPays,
                    masterCrud:mainCrud.name,
                    tagValue:payTag,
                    listEvents:[{
                        name:"printAfter",
                        actions:[{
                            action:()=>{

                                CalculateTotal();
                            }
                        }]
                    }],
                    formEvents:[{
                        name:"newAfter",
                        actions:[{
                            action:({k})=>{

                                var total = parseFloat(u.#group.build.crudGetBuild({crudName:mainCrud.name}).bodyGet().fieldGetValues({fieldName:mainFieldTotal})[0]);
                                var payTotal = CrudSum({crudName:"cr-list-pays",fieldName:"total"}).total;
                                var less = total - payTotal;
                                if(less < 0) less = 0;
                                less = parseFloat(less.toFixed(2));
                                k.bodyGet().fieldSetValues({fieldName:"total",values:[less]});
                            }
                        }]
                    }]
                }),
            });
        }    
        
        function CrudSum({crudName,fieldName}) {

            var crud = u.#group.build.crudGetBuild({crudName});
            var totals = crud.bodyGet().fieldGetValues({fieldName});
            var total = totals.reduce((acc,v)=>{return acc + parseFloat(v)},0);

            return {crud,total};
        }
        
        function CalculateTotal() {
            
            var crMain = u.#group.build.crudGetBuild({crudName:mainCrud.name});
            var crItems = u.#group.build.crudGetBuild({crudName:itemsCrud.name});

            var itemsTotals = crItems.bodyGet().fieldGetValues({fieldName:itemFieldTotal});
            var total = itemsTotals.reduce((acc,v)=>{return acc + parseFloat(v)},0);

            if(mainFieldTotalDscto!=null) {

                crMain.bodyGet().fieldSetValues({fieldName:mainFieldTotalDscto,values:[total]});
                crMain.Update_AddChangeField({fieldName:mainFieldTotalDscto,value:total,y:0});
            }

            if(mainFieldDscto!=null){

                var dscto = parseFloat(crMain.bodyGet().fieldGetValues({fieldName:mainFieldDscto})[0]);
                total = total * (1-dscto/100);
                total = parseFloat(total.toFixed(2));
            }
            
            crMain.bodyGet().fieldSetValues({fieldName:mainFieldTotal,values:[total]});
            crMain.Update_AddChangeField({fieldName:mainFieldTotal,value:total,y:0});

            if(acc_pay && mainFieldPay!=null){

                var crPays = u.#group.build.crudGetBuild({crudName:"cr-list-pays"});
                var paysTotals = crPays.bodyGet().fieldGetValues({fieldName:"total"});
                var totalPay = paysTotals.reduce((acc,v)=>{return acc + parseFloat(v)},0);

                var payState = totalPay == total ? 1 : 0;
                crMain.bodyGet().fieldSetValues({fieldName:mainFieldPay,values:[payState]});
                crMain.Update_AddChangeField({fieldName:mainFieldPay,value:payState,y:0});
            }

        }
    }

    #setGroupScriptControl({pageData,schema,mainControlVisual,mainDetailVisual,itemDetailVisual,schemaItems,userData,page,filters=[],fieldTotalName,eventPdf}){

        //main
        var mainCrud = getCrudType({
            schema,type:"control",
            userData,visualInfo:mainControlVisual,
            tipe:"table",state:"edit",dependence:false,fieldTotalName
        });
        mainCrud.title = pageData.title;
        mainCrud.states = [{
            name:"reload",
            tools:[
                {name:"reload",show:true},
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"sizes",show:false,value:999},
            ]
        }];
        this.#setCrudMain({mainCrud});
        this.#group.script.conections.push({
            event:"send",masterName:mainCrud.name,
            page,param:schema.fieldPrimary,
            select:schema.fieldPrimary,
        });
        //filters set value
        filters.forEach(flt => {
                    
            var fltcrud = mainCrud.filters.find(fltc=>fltc.name==flt.name);
            if(fltcrud) fltcrud.box.value = flt.value;
        });
        
        //detail
        var showCrud = getCrudType({
            schema,type:"show",visualInfo:mainDetailVisual,
            userData,visual:"control-detail",
            tipe:"form",state:"show",dependence:true,modal:true,
            eventPdf,
        });
        showCrud.events.push({
          name:"userData",
          actions:[{action:()=>{return userData;}}]
        });
        showCrud.events.push({
          name:"getGroupBuild",
          actions:[{action:()=>{return this.#group.build;}}]
        });

        this.#addCrudToGrid({crud:showCrud,modal:true});
        this.#group.script.conections.push({
            event:"cnx",masterAction:"show",
            masterName:mainCrud.name,
            masterSelect:schema.fieldPrimary,
            maidName:showCrud.name,
            maidSelect:schema.fieldPrimary,
        });

        
        //items
        showCrud.panels.push({
            tipe:"form",title:"conecciones",head:false,
            fields:[{
                name:"prnt-cnx0",tipe:0,action:"div",
                box:{tipe:0,class:"w-100 m-0 p-0"},
            }],
        });
        var itemsCrud = getCrudType({
            schema:schemaItems,visualInfo:itemDetailVisual,
            userData,visual:"detail-show",state:"show",
            tipe:"table",dependence:true
        });
        itemsCrud.parent = "prnt-cnx0";
        itemsCrud.panels[0].fields.forEach(f=>f.attributes=[{name:"class",value:"m-0 py-0 px-1"}/*,{name:"style",value:"min-width: 200px"}*/]);
        
        console.log(showCrud,itemsCrud);
        
        this.#group.script.layers.push({crud:itemsCrud});
        this.#group.script.conections.push({
            event:"cnx",type:"show",
            masterName:showCrud.name,
            masterSelect:schema.fieldPrimary,
            maidName:itemsCrud.name,
            maidSelect:schema.fieldPrimary
        });
        
    }

    #setGroupScriptList({schema,userData}){

        let u = this;

        var list = getCrudType({
            schema,userData,total:false,
            visual:"control",tipe:"table",
            state:"edit",dependence:false,
            visualInfo:{fields:schema.fields.filter(f=>f.tags&&f.tags.find(tg=>tg=="main")).map(f=>{return{value:f.value,state:"show"}})}
        });
        list.states = [{
            name:"reload",
            tools:[
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"sizes",value:10,show:true},
                {name:"pages",show:true},
                {name:"reload",show:true},
                {name:"new",show:true},
            ],
        }];
        list.tutorials=[{
          value:"insert-n",show:"¿como ingreso [registro]?",active:true,
          elementsInfo:({k})=>{

            return [{
              ...k.bodyGet().toolGetTutorialElement({toolName:"new"}),
              eventNext:()=>{

                k.bodyGet().toolGet({toolName:"new"}).dom.Blocks_Get()[0].click();
                console.log("use",u.#group.build.crudGetBuild({crudName:detail.name}));
                setTimeout(()=>{u.#group.build.crudGetBuild({crudName:detail.name}).tutorialPlay({value:"use"});},1000)
              }
            }]
          }
        }];

        this.#setCrudMain({
            mainCrud:list,
        });

        var detail = getCrudType({
            schema,userData,tipe:"form",
            visual:"detail-edit",state:"edit",
            dependence:true,modal:true,
            visualInfo:{fields:schema.fields.map(f=>{return{value:f.value,state:"edit"}})}
        });
        detail.afterUpdate = "block";
        detail.afterInsert = "block";

        this.#addCrudToGrid({
            modal:true,
            crud:detail,
        });

        this.#group.script.conections.push({
            event:"cnx",masterAction:"edit",
            masterName:list.name,masterSelect:schema.fieldPrimary,
            maidName: detail.name,maidSelect:schema.fieldPrimary,
        });
        this.#group.script.conections.push({
            event:"cnx",masterAction:"new",
            masterName:list.name,masterSelect:schema.fieldPrimary,
            maidName: detail.name,maidSelect:schema.fieldPrimary,
        });

    }

    #setGroupScriptSimple({schema,userData,simpleEvents=[]}){

        var simpleCrud = getCrudType({
            schema,userData,total:false,
            visual:"modulo",tipe:"table",
            state:"edit",dependence:false,
            visualInfo:{fields:schema.fields.map(f=>{return{value:f.value,state:"edit"}})}
        });
        simpleCrud.states = [{
            name:"reload",
            tools:[
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"reload",show:true},
                {name:"insert",show:true},
                {name:"pages",show:true},
                {name:"sizes",show:true,value:10},
            ]
        }]

        this.#setCrudMain({
            mainCrud:simpleCrud
        });

        if(simpleCrud.events==null) simpleCrud.events = [];
        simpleCrud.events = [...simpleCrud.events,...simpleEvents];
    }

    #setGroupScriptFree({script,layers,conections,groups,userData,pageData}){

        this.#group.script.layers = layers;
        this.#group.script.conections = conections;
        this.#group.script.groups = groups;

        if(script!=null){

            var scriptGet = script({userData,build:this,pageData});
            if(scriptGet !=null){

                this.#group.script.layers = scriptGet.layers;
                this.#group.script.conections = scriptGet.conections;
                this.#group.script.groups = scriptGet.groups;
            }
        }
    }

    #setCalculates({calculates=[]}){

        return;
        let u = this;
        var cruds = this.#group.script.layers.filter(ly=>ly.crud!=null).map(ly=>{return ly.crud;});
        this.#group.script.groups.forEach(gp => {
            
            gp.layers.filter(ly=>ly.crud!=null).forEach(ly=>{cruds.push(ly.crud);});
        });

        calculates.forEach(calc => {

            const eventAction = ({k})=>{

                console.log("trigger>---------"+calc.name+"------------");


                var total = 0;
                calc.actions.forEach(act => {
                    
                    var crudBuild = null;
                    if(act.crud){

                        crudBuild =  u.#group.build.crudGetBuild({crudName:act.crud});
                        if(!crudBuild) console.log("error no found crud " + act.crud, "cruds",cruds);
                    }

                    switch (act.cal) {
                        case "total":

                            if(crudBuild){

                                total = crudBuild.bodyGet().fieldGetValues({fieldName:act.field})[0];
                            }
                            else total = act.value;

                            
                        break;

                        case "sum":
                            var values = crudBuild.bodyGet().fieldGetValues({fieldName:act.field});
                            total = values.reduce((acc,v)=>{return acc+parseFloat(v)},0);
                        break;

                        case "dscto":
                            var dscto = crudBuild.bodyGet().fieldGetValues({fieldName:act.field})[0];
                            total = total * (1-parseFloat(dscto)/100);
                            total = parseFloat(total.toFixed(2));
                        break;

                        case "result":
                            
                            crudBuild.bodyGet().fieldSetValues({fieldName:act.field,values:[total]});
                            crudBuild.Update_AddChangeField({fieldName:act.field,value:total,y:0});

                        break;

                        case "comparate":
                            
                            var comparate = parseFloat(crudBuild.bodyGet().fieldGetValues({fieldName:act.field})[0]);
                            total = comparate==total ? 1 : 0;
                        break;
                    }

                    //console.log("total",total,"action",act.cal,"crud",act.crud,"field",act.field);
                });
            };
            
            calc.triggers.forEach(tg => {

                var eventName = tg.field!=null?"boxUpdate":"printAfter";

                var crudTrigger = cruds.find(cr=>cr.name==tg.crud);
                if(crudTrigger){

                    if(crudTrigger.events==null) crudTrigger.events = [];
                    crudTrigger.events.push({
                        name:eventName,
                        actions:[{action:eventAction}],
                    });
                }
                else console.log("error no found trigger crud " + tg.crud, cruds);
                
                
            });

        });
        
    }

    #Build(i){

      let k = this;
      let u = this;

      this.#setGroupScript(i);
      this.#setCalculates(i);

      //tutorial

      var cruds = this.#group.script.layers.filter(ly=>ly.crud!=null);
      if(cruds.length>0){

        var mainCrudScript = cruds[0].crud;
        
        var tutorialPlayed = false;
        const playTut = ()=>{

          if(!tutorialPlayed){

            PlayTutorialInPage({
              group:k.#group.build,
              pageData:i.pageData,
              crudName:mainCrudScript.name,
            });
            tutorialPlayed = true;
          }
        }

        if(mainCrudScript.stateStart == null || mainCrudScript.stateStart == "reload" || mainCrudScript.stateStart == "block"){

          console.log("play tutorial delay");
          
          if(mainCrudScript.events == null) mainCrudScript.events = [];
          mainCrudScript.events.push({
            name:mainCrudScript.stateStart=="block"?"blockAfter":"printAfter",
            actions:[{
              action:()=>{

                console.log("------play tutorial!!!");
                
                playTut();
              }
            }]
          });
        }
        else playTut();

        //tutorial - actions
        if(i.actionsActive==true){

          var conectionMasterMaid = this.#group.script.conections.find(cnx=>cnx.masterName==mainCrudScript.name);
          if(conectionMasterMaid && conectionMasterMaid.event=="cnx" && conectionMasterMaid.masterAction=="new"){

            if(mainCrudScript.events==null) mainCrudScript.events = [];
            mainCrudScript.events.push({
              name:"tutorialInsertEnd",
              actions:[{
                action:({})=>{

                  setTimeout(()=>{

                    var maidCrudBuild = u.#group.build.crudGetBuild({crudName:conectionMasterMaid.maidName});
                    maidCrudBuild.tutorialPlay("insert");

                  },1000);
                }
              }]
            });
          }

        }
      }
      

      //------

      this.#group.build = new CrudsGroup({
          ...this.#group.script,
          ...i,parent:i.pageData.body,test,
      });
        
    }
}

function getInfoOfSchema({schema,userData,type="select"}) {

    var info = {
        name:"cr-"+schema.recordName,
        selects:[],
        fields:[],
        loads:[],
        joins:[],
        filters:[],
    };
    
    schema.fields.forEach(f=>{

        //selects
        var selectAs = schema.table+"-"+f.select;
        info.selects.push({
            table:schema.table,
            field:f.select,
            as:selectAs,
        });

        //conection -> load, join, select, field
        var loadName = null;
        if(f.conect!=null){

            switch (type) {
                case "select":                

                loadName = "ld-"+f.conect.schema.table;
                info.loads.push({
                    name:loadName,
                    tableMain:f.conect.schema.table,
                    selects:[
                        {table:f.conect.schema.table,field:f.conect.schema.fieldPrimary,as:"value"},
                        {table:f.conect.schema.table,field:f.conect.schema.fields.find(fld=>fld.detail=="main").select,as:"show"},
                    ],
                    conditions:[(f.conect.schema.company?{
                        table:f.conect.schema.table,
                        field:"ID_COMPANY",
                        inter:"=",
                        value:userData.company.id,
                    }:null)],
                });
                    
                break;
            
                case "join":

                //conect join
                var cntInfo = getInfoOfConection({
                    schemaMain:schema,
                    schemaJoin:f.conect.schema,
                });

                info.joins = [...info.joins,...cntInfo.joins];
                info.selects = [...info.selects,...cntInfo.selects];
                info.fields = [...info.fields,...cntInfo.fields];

                break;
            }

           

        }

        //fields
        info.fields.push({
            ...crudScriptGetField({field:f,box:fieldTypeGet({tipe:f.tipe}).edit.box}),
            select:selectAs,
            load:(loadName?{name:loadName,value:"value",show:"show"}:null),
            panelName:f.panel,
        });

        
    });

    return info;
}

function getCrudType({schema,userData,visualInfo=null,tipe="table",state="edit",dependence=false,modal=false,fieldTotalName=null,line0=false,eventPdf}) {

    var total = true;
    if(tipe=="form" || dependence==true) total = false;
    
    //var visualInfo = schema.visuals.find(v=>v.name==visual);
    if(!visualInfo) console.log("no found visual: "+visualInfo,"schema:",schema);
    

    var useFilters = tipe == "table" && dependence == false;
    var useTitleMain = dependence == false;
    
    var multipleRecords = tipe=="table";
    var title = visualInfo.title ? visualInfo.title : (multipleRecords?"lista de "+schema.record.title+"s":schema.record.title);
    var crud = {
        title,head:useTitleMain,
        name:"cr-"+schema.record.name+(multipleRecords?"s":""),
        tableMain:schema.table,
        selects:[{table:schema.table,field:schema.fieldPrimary,primary:true}],
        joins:[],
        loads:[],
        filters:[],
        panels:[],
        conditions:[],
        inserts:[],
        events:[],
    };

    var panelInfo = {tipe,title:"informacion",fields:[]};
    crud.panels.push(panelInfo);
    visualInfo.fields.forEach(fv => {
            
        var f = schema.fields.find(fsch=>fsch.value==fv.value);
        //get access
        if(getAccessOfField({fieldSchema:f,userData})){

            var fieldState = f.calculate == true ? "show" : fv.state;  
            if(f.value==fieldTotalName&&tipe=="table"&&dependence==false&&Access_Get(userData.access,"md-box-general")) fieldState = "show";
            
            var fieldInfo = getInfoByField({
                table:schema.table,f,
                state:fieldState,
                userData
            });  

            if((f.conect==null && fieldState == "show") || fieldState=="edit"){           

                panelInfo.fields.push(fieldInfo.field);
                crud.selects.push(fieldInfo.select);
                if(useFilters && fv.filter!=false) fieldInfo.filters.forEach(flt=>{crud.filters.push(flt);});
                if(fieldInfo.load) crud.loads.push(fieldInfo.load);
            }
            else
            {
                //return;
                var joinFound = crud.joins.find(jn=>jn.join.table==f.conect.schema.table);
                if(!joinFound){

                    crud.joins.push({
                        main:{table:schema.table,field:f.select},
                        join:{table:f.conect.schema.table,field:f.conect.schema.fieldPrimary},
                        tipe:"LEFT",
                    });
                }

                var panelOfModulo = panelInfo;
                //add panel
                if(tipe=="form"){

                    panelOfModulo = {tipe:"form",title:f.name,head:true,fields:[]};
                    crud.panels.push(panelOfModulo);
                    
                }
                
                if(tipe=="table"){

                    crud.selects.push(fieldInfo.select);
                    crud.loads.push(fieldInfo.load);
                    panelOfModulo.fields.push(fieldInfo.field);
                }
                
                f.conect.schema.fields.forEach(fv=>{

                    if(getAccessOfField({fieldSchema:fv,userData})){

                        var fieldInfo = getInfoByField({table:f.conect.schema.table,f:fv,userData});

                        if(tipe=="form" && fv.tags!=null && fv.tags.find(tg=>tg=="main")){
                            
                            fieldInfo.field.title = f.name +" " + fv.name;
                            crud.selects.push(fieldInfo.select);
                            panelOfModulo.fields.push(fieldInfo.field);
                        }
                        
                        if(useFilters && fv.tags!=null && fv.tags.find(tg=>tg=="main-flt")){

                            fieldInfo.filters.forEach(flt=>{
        
                                flt.title = f.name + " " + fv.name;
                                crud.filters.push(flt);
                            });
                        }
                    }
                });
            }
        }
        
    });

    //inserts
    if(schema.company){

        crud.inserts.push({
            table:schema.table,
            field:"ID_COMPANY",
            value:userData.company.id,
        });
    }

    //conditions
    if(schema.company){

        crud.conditions.push({
            table:schema.table,
            field:"ID_COMPANY",
            inter:"=",
            value:userData.company.id,
        });
    }

    crud.states = [
        {
            name:"reload",
            tools:[
                {name:"title",show:!useTitleMain,value:(!useTitleMain?crud.title:"")},
                {name:"tutorial",show:state=="edit"},
                {name:"config",show:useFilters},

                {name:"sizes",show:total,value:(total?999:(tipe=="table"?10:1))},
                {name:"pages",show:total},

                {name:"insert",show:(tipe=="table"&&state=="edit"&&dependence)},
                {name:"reload",show:useFilters},
                {name:"update",show:(dependence&&state=="edit"&&modal)},
                {name:"cancel",show:modal},
                {name:"pdf",show:eventPdf!=null},
            ],
        },
        {
            name:"new",
            tools:[
                {name:"title",show:!useTitleMain,value:(!useTitleMain?crud.title:"")},
                {name:"tutorial",show:state=="edit"},
                {name:"config",show:useFilters},

                {name:"sizes",show:false,value:999},

                {name:"insert",show:(dependence&&state=="edit")},
                {name:"cancel",show:modal},
            ],
        },
    ];
    if(crud.panels.length==1&&crud.panels[0].tipe=="form") crud.panels[0].head=false;

    if(eventPdf!=null){

      crud.events.push({
        name:"toolUpdate",
        actions:[{
          action:({k,tool})=>{

            if(tool.name=="pdf") eventPdf({k});
          }
        }]
      });
    }

    return crud;

}

function getAccessOfField({fieldSchema,userData}) {
    
    if(fieldSchema.access == null) return true;

    if(typeof fieldSchema.access === "boolean") return fieldSchema.access;

    return typeof fieldSchema.access === "string" && Access_Get(userData.access,fieldSchema.access);
}

function getInfoByTable({table,fields}) {
    
    var info = {
        selects:[],
        filters:[],
        fields:[],
        loads:[],
    };

    fields.forEach(f => {
        
        var fieldInfo = getInfoByField({table,f});
        info.selects.push(fieldInfo.select);
        info.fields.push(fieldInfo.field);
        fieldInfo.filters.forEach(flt => { info.filters.push(flt)}); 

    });    

    return info;
}

function getInfoByField({table,f,state="show",box=null,userData}) {
    
    //select
    var selectAs = table+"-"+f.select;
    var select = {
        table,
        field:f.select,
        as:selectAs,
    };
    
    //load
    var load = null;
    if(f.load&&f.load.schema){

        load = {...f.load};        
        if(load.schema.company){
            
            if(load.conditions==null) load.conditions = [];
            load.conditions.push({
                table:load.schema.table,
                field:"ID_COMPANY",
                inter:"=",value:userData.company.id,
            });
        }
    }

    //fields
    var ftype = fieldTypeGet({tipe:f.tipe});
    var boxField = box != null ? box : state == "show" ? ftype.show.box : ftype.edit.box;

    if(state=="edit" && f.states!=null&&f.states.edit!=null&&f.states.edit.access!=null&&!Access_Get(userData.access,f.states.edit.access)) state="show";

    var attributes = [];
    var minWidth = null;
    if(f.minWidth != null) minWidth = f.minWidth;
    if(minWidth) attributes.push({name:"style",value:"min-width:"+minWidth+"px;"});

    var maxWidth = null;
    if(f.maxWidth != null) maxWidth = f.maxWidth;
    if(maxWidth) attributes.push({name:"style",value:"max-width:"+maxWidth+"px;"});
    if(maxWidth) console.log("SET MAX WITH!!!!",f);
    

    var fieldBox = {...boxField,options:f.options};
    if(fieldBox.options!=null) fieldBox.value = fieldBox.options[0].value;

    var field = {
        name:f.value,title:f.name,
        box:{...fieldBox},
        select:selectAs,
        load:(load?{name:load.name,value:"value",show:"show"}:null),
        attributes,
        descripcion:f.descripcion,
    };

    //filter
    var filters = [];
    if(ftype.filter){

        filters.push({
            name:f.value,title:f.name,
            box:{...ftype.filter.box,options:f.options},
            select:{
                table,
                field:f.select,
            }
        });
    }
    if(f.tipe=="date"){

        filters.push({
            title:"fecha minima",name:f.value+"-min",
            box:{...bx_date_start},col:6,
            select:{
                table,
                field:f.select,
                tipe:"min",
            },
        });

        filters.push({
            title:"fecha maxima",name:f.value+"-max",
            box:{...bx_date_end},col:6,
            select:{
                table,
                field:f.select,
                tipe:"max",
            },
        });
    }

    return {select,field,filters,load};
}

function getGroupBySchema({parentName,schema,userData}) {
    
    var layers = [
        {
            grid:{
                parent:parentName,
                items:[],
            },
        }
    ];
    var conections = [];
    
    function addToGrid({crudScript,type="grid"}) {

        var gridName = "prnt-" + crudScript.name;
        layers[0].grid.items.push({name:gridName,col:12});

        var crudParentName = gridName;

        if(type=="modal"){

            var modalName = "md-" + crudScript.name;
            layers.push({modal:{parent:gridName,name:modalName,size:"xl"}});
            crudParentName = modalName;
        }
        
        crudScript.parent = crudParentName;
        layers.push({crud:{...crudScript}});
    }

    var mainCrud = getCrudType({schema,userData,type:"form"});
    addToGrid({crudScript:mainCrud,type:"grid"});
    

    //conections by field
    schema.fields.filter(f=>f.conect!=null).forEach(f=>{

        var cnxCrud = getCrudType({schema:f.conect.schema,userData,type:"form"});
        addToGrid({crudScript:cnxCrud,type:"modal"});

        conections.push({
            event:"formForm",masterFieldName:f.value,
            masterName:mainCrud.name,
            masterSelect:f.select,
            maidName:cnxCrud.name,
            maidSelect:f.conect.schema.fieldPrimary,
        });
    });

    //conections by schema
    schema.conections.forEach(cn=>{

        var cnCrud = getCrudType({schema:cn.schema,userData,type:"table"});
        addToGrid({crudScript:cnCrud});

        conections.push({
            event:"cnx",
            masterName:mainCrud.name,
            masterSelect:schema.fieldPrimary,
            maidName:cnCrud.name,
            maidSelect:schema.fieldPrimary,
        });
    });

    return {layers,conections}

}

//

function getCrudMult({schemaMain,fields,tipe="table",filters=true,userData,eventEnd}) {
  
  if(!userData)console.log("ERROR IN CRUD MULT, no exist userData");
  

  var crud = {
    tableMain:schemaMain.table,
    selects:[{table:schemaMain.table,field:schemaMain.fieldPrimary,primary:true}],
    loads:[],
    joins:[],
    filters:[],
    panels:[{tipe:tipe,title:"informacion",head:false,fields:[]}],
    inserts:[(schemaMain.company?{table:schemaMain.table,field:"ID_COMPANY",value:userData.company.id}:null)],
    conditions:[(schemaMain.company?{table:schemaMain.table,field:"ID_COMPANY",inter:"=",value:userData.company.id}:null)]
  };

  fields.forEach(f => {
    
    if(f.type==null){

      var fsch = schemaMain.fields.find(fsch=>fsch.value==f.value);
      if(fsch==null) console.log("field "+f.value + " no found in schema",schemaMain.fields);
      
      var facc = (fsch.access !=null && typeof fsch.access === "string") ? Access_Get(userData.access,fsch.access) : true;
      if(facc){

        var sch_conect = fsch.conect ? fsch.conect.schema : null;

        //type of conect
        if(f.fields!=null){

          //join
          var joinExist = crud.joins.find(jn=>jn.join.table==sch_conect.table);
          if(!joinExist){

            crud.joins.push({
              main:{table:schemaMain.table,field:fsch.select},
              join:{table:sch_conect.table,field:sch_conect.fieldPrimary},
              tipe:"LEFT",
            });
          }

          f.fields.forEach(fcnx => {
            
            var fcnxsch = sch_conect.fields.find(f=>f.value==fcnx);
            var fcnxacc = typeof fcnxsch.access === "string" ? Access_Get(userData.access,fcnxsch.access) : true;
            if(fcnxacc){

              //select
              var selectAscnx = sch_conect.table + "-" + fcnxsch.select;
              crud.selects.push({
                table:sch_conect.table,
                field:fcnxsch.select,
                as:selectAscnx,
              });

              //fields
              var fcnxtype = fieldTypeGet({tipe:fsch.tipe});

              crud.panels[0].fields.push({
                name:fsch.value+"-"+fcnxsch.value,
                title:fsch.name+"-"+fcnxsch.name,
                box:{...fcnxtype.show.box},
                select:selectAscnx,
              });

              //filter
              if(filters && fcnxtype.filter){

                crud.filters.push({
                  name:fsch.value+"-"+fcnxsch.value,
                  title:fsch.name+"-"+fcnxsch.name,
                  box:{...fcnxtype.filter.box},
                  select:{
                    table:sch_conect.table,
                    field:fcnxsch.select,
                  }
                });
              }
              

            }

          });

        }
        else
        {

          //load
          var fld = null;
          if(f.load != null){

            fld = {...f.load};
            if(sch_conect.company){

              if(fld.conditions==null)fld.conditions=[];
              fld.conditions.push({
                before:(fld.conditions.length>0?" AND ":""),
                table:sch_conect.table,
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              });
            }
          }
          else
          {
            if(sch_conect!=null){

              var loadSelectShow = sch_conect.selectShow? sch_conect.selectShow :"NAME";
              fld = {
                name:"ld-"+sch_conect.table,
                tableMain:sch_conect.table,
                selects:[
                  {table:sch_conect.table,field:sch_conect.fieldPrimary,as:"value"},
                  {table:sch_conect.table,field:loadSelectShow,as:"show"},
                ],
                conditions:[(sch_conect.company?{
                  table:sch_conect.table,
                  field:"ID_COMPANY",
                  inter:"=",
                  value:userData.company.id,
                }:null)]
              }
            }
          }
          if(fld) crud.loads.push(fld); 

          //select
          var selectAs = schemaMain.table + "-" + fsch.select;
          crud.selects.push({
            table:schemaMain.table,
            field:fsch.select,
            as:selectAs,
          });

          //field
          var ftype = fieldTypeGet({tipe:fsch.tipe});

          fstate = f.state ? f.state : "show";
          var fbox = {...(fstate=="show"?ftype.show.box:ftype.edit.box)};
          if(fsch.options!=null){

            fbox.options = fsch.options;
            fbox.value = fbox.options[0].value;
          }
          crud.panels[0].fields.push({
            panel:f.panel,
            name:fsch.value,
            title:fsch.name,
            box:fbox,col:f.col?f.col:12,
            select:selectAs,
            attributes:f.attributes?f.attributes:[],
            load:(fld?{name:fld.name,show:"show",value:"value"}:null),
          });


          //filter
          if(filters && f.filter != false){

            var flts = [];
            if(ftype.filter){

              fltbx = {...ftype.filter.box};
              if(f.filter!=null&&f.filter.boxTipe!=null) fltbx.tipe = f.filter.boxTipe;
              if(fsch.options!=null) fltbx.options = fsch.options;

              flts.push({
                name:fsch.value,title:fsch.name,
                box:fltbx,
                select:{
                  table:schemaMain.table,
                  field:fsch.select,
                },
                load:(fld?{name:fld.name,show:"show",value:"value"}:null),
              });
            }
            if(fsch.value=="date"){

              flts.push({
                name:"min-"+fsch.value,title:"fecha minima "+fsch.name,
                box:{...bx_date_start},col:6,
                select:{
                  table:schemaMain.table,
                  field:fsch.select,
                  tipe:"min",
                },
              });

              flts.push({
                name:"max-"+fsch.value,title:"fecha maxima "+fsch.name,
                box:{...bx_date_end},col:6,
                select:{
                  table:schemaMain.table,
                  field:fsch.select,
                  tipe:"max",
                },
              });
            }

            flts.forEach(flt => {crud.filters.push(flt)});
            
          }

        }

      }
    }
    else
    {

      var ftype = {
        name:f.name,action:f.type,
        panel:f.panel,
        box:{},
      };

      switch (f.type) {
        case "div":

          ftype.tipe=2;
          ftype.box.tipe=0;
          ftype.box.class="w-100 p-0 m-0";

        break;
      }

      crud.panels[0].fields.push(ftype);
    }

  });

  if(eventEnd!=null){

    var cr = eventEnd({crud});    
    crud = cr;
  }

  return crud;

}


//------page build config-----------


function script_bills({userData,build}){

    const fieldCopy = [
        {fieldName:"nroDoc",copyName:"copy-doc"},
        {fieldName:"item",copyName:"copy-item"},
        {fieldName:"cant",copyName:"copy-cant"},
        {fieldName:"priceUnit",copyName:"copy-price-unit"}
      ];

    function fieldCopyClipboard({crudBuild,field,y=0}) {
    
    var fieldCopyFound = fieldCopy.find(cp=>cp.copyName==field.name);
    
    if(fieldCopyFound){

        navigator.clipboard.writeText(crudBuild.bodyGet().fieldGetValues({fieldName:fieldCopyFound.fieldName})[y]);
    }       
    }

    var customerJoin = GetInfoBySchema({
    userData,
    schema:sch_customers,
    fieldsSet:[
        {value:"name"},
        {value:"nroDoc"},
    ],
    });
    customerJoin.join = {
    main:{table:sch_sales.table,field:sch_customers.fieldPrimary},
    join:{table:sch_customers.table,field:sch_customers.fieldPrimary},
    tipe:"LEFT",
    };

    return {
        layers:[
            {
            grid:{
                items:[
                {name:"prnt-card",col:12},
                {name:"prnt-bills",col:12},
                {name:"prnt-md-bill"},
                ]
            }
            },
            {
            crud:{
                title:"lista de facturas",schema:sch_sales,
                parent:"prnt-bills",name:"cr-bills",
                joins:[customerJoin.join],
                selects:[...customerJoin.selects],
                states:[
                {
                    name:"reload",
                    tools:[
                        {name:"reload",show:true},
                        {name:"config",show:true},
                        {name:"tutorial",show:true},
                        {name:"sizes",show:false,value:999},
                    ],
                }
                ],
                panels:[{
                tipe:"table",
                fields:[
                    customerJoin.fields.find(f=>f.name=="name"),
                ],
                fieldsSet:[
                    {value:"status",filter:{value:op_sales_status.filter(op=>op.value!=5).map(op=>{return op.show;})}},
                    {value:"pay"},
                    {value:"total"},
                    {value:"doc",filter:{value:op_sales_document.filter(op=>op.value!=1).map(op=>op.show)}},
                    {value:"emmit"},
                    {value:"emit",state:"edit",filter:{value:[op_sales_emitsunat.find(op=>op.value==0).show]}},
                    {value:"ruc",state:"edit"},
                ],
                }],
            },
            },
            {modal:{parent:"prnt-md-bill",name:"md-bill",size:"xl"}},
            {
            crud:{
                parent:"md-bill",title:"detalle de factura",head:false,
                schema:sch_sales,name:"cr-bill",
                joins:[
                customerJoin.join,
                ],
                selects:[...customerJoin.selects,],
                panels:[{
                tipe:"form",title:"informacion",
                fields:[
                    customerJoin.fields.find(f=>f.name=="name"),
                    {...customerJoin.fields.find(f=>f.name=="nroDoc"),col:10},
                ],
                fieldsSet:[
                    {action:"button",name:"copy-doc",title:"copiar item",value:fld_copy.box.value,col:2},
                    {value:"total"},
                    {value:"emmit"},
                    {value:"emit",state:"edit"},
                    {value:"ruc",state:"edit"},
                    {action:"div",name:"prnt-bill-detail"},
                ],
                }],
                states:[
                {
                    name:"reload",
                    tools:[
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                    {name:"tutorial",show:true},
                    ],
                }
                ],
                events:[{
                name:"boxUpdate",
                actions:[{
                    action:({k,field,y})=>{
    
                    fieldCopyClipboard({crudBuild:k,field,y});
                    }
                }]
                }]
            },
            },
            {
            crud:{
                parent:"prnt-bill-detail",title:"detalle de factura",
                schema:sch_sales_products,name:"cr-bill-detail",
                states:[],
                selects:[
                {table:sch_items.table,field:"NAME",as:"ITEM-NAME"},
                ],
                joins:[
                {
                    main:{table:sch_sales_products.table,field:sch_items.fieldPrimary},
                    join:{table:sch_items.table,field:sch_items.fieldPrimary},
                    tipe:"LEFT",
                },
                ],
                panels:[{
                tipe:"table",
                fields:[
                    {name:"item",box:{tipe:0},select:"ITEM-NAME",attributes:att_ln},
                ],
                fieldsSet:[
                    //{value:"item"},
                    {action:"button",name:"copy-item",title:"copiar item",value:fld_copy.box.value},
                    {value:"cant"},
                    {action:"button",name:"copy-cant",title:"copiar cant.",value:fld_copy.box.value},
                    {value:"priceUnit"},
                    {action:"button",name:"copy-price-unit",title:"copiar prec. unit.",value:fld_copy.box.value},
                ],
                }],
                states:[
                {
                    name:"reload",
                    tools:[
                    {name:"sizes",show:false,value:999},
                    ],
                }
                ],
                events:[{
                name:"boxUpdate",
                actions:[{
                    action:({k,field,y})=>{
    
                    fieldCopyClipboard({crudBuild:k,field,y});
                    }
                }]
                }],
            }
            }
        ],
        conections:[
            {
            event:"cnx",masterAction:"show",
            masterName:"cr-bills",
            masterSelect:"ID_SALE",
            maidName:"cr-bill",
            maidSelect:"ID_SALE",
            },
            {
            event:"cnx",type:"show",
            masterName:"cr-bill",
            masterSelect:"ID_SALE",
            maidName:"cr-bill-detail",
            maidSelect:"ID_SALE",
            }
        ]
    }
}

function script_box({userData,build}) {
 
    function AccountGetId(){
        
        return build.groupGet().crudGetBuild({crudName:"cr-boxs"}).bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"cuenta"}).GetValue();
    }

    var acc_edit = Access_Get(userData.access,"md-box-edit");

    return {
        layers:[
            {
              grid:{
                items:[
                  {name:"prnt-control",col:12},
                  {name:"prnt-control-md",col:12},
                  {name:"prnt-pay-md",col:12},
                ],
              },
            },
            //-----control------
            {
              crud:{
                parent:"prnt-control",name:"cr-boxs",recordName:"control de caja",
                title:"lista de control de caja",schema:sch_control_accounts,
                insertToEnd:false,
                config:{show:true},
                panels:[
                  {
                    tipe:"table",
                    fieldsSet:[
                      {value:"account",filter:{type:"unique"},minWidth:120},
                      {value:"status"},
                      {value:"open_emmit"},
                      {value:"open_total",state:(acc_edit?"edit":"show")},
                      {value:"close_emmit",filter:true},
                      {value:"close_total"},
                      {value:"comment",state:"edit"},
                    ]
                  }
                ],
                filters:[
                    {name:"fecha min",box:{...bx_date_start},select:{table:sch_control_accounts.table,field:"DATE_EMMIT_OPEN",tipe:"min"},col:6},
                    {name:"fecha max",box:{...bx_date_end},select:{table:sch_control_accounts.table,field:"DATE_EMMIT_OPEN",tipe:"max"},col:6},
                ],
                stateStart:"reload",
                states:[
                  {
                    name:"reload",
                    tools:[
                      {name:"insert",show:true,value:'<i class="bi bi-plus-circle"></i> abrir caja'},
                      {name:"sizes",show:true,value:10},
                      {name:"pages",show:true},
                      {name:"reload",show:false},
                      {name:"tutorial",show:true},
                    ]
                  },
                ],
                inserts:[
                  {
                    field:"OPEN",tipe:"values",
                    value:"1",
                  }
                ],
                events:[
                  {
                    name:"insertAfter",
                    actions:[{
                      action:()=>{
    
                        //var crudAccount = group.crudGetBuild({crudName:"cr-account"});
                        //crudAccount.bodyGet().fieldSetValues({fieldName:"open",values:[1]});
                      }
                    }]
                  },
                  {
                    name:"insertBefore",
                    actions:[{
                      action:({inserts})=>{
    
                        //var crudAccount = group.crudGetBuild({crudName:"cr-account"});
                        //var open = crudAccount.bodyGet().fieldGetValues({fieldName:"open"})[0] == "1";
    
                        //if(open) alert("no se puede abrir una caja que ya esta abierta");
    
                        //var inserts = [{field:"OPEN",value:1}];
    
                        inserts = [{
                          field:"ID_ACCOUNT",
                          value:AccountGetId(),
                        }]
    
                        return {block:open,inserts};
                      }
                    }]
                  }
                ],
                orders:[
                  {
                    table:sch_control_accounts.table,
                    field:"DATE_EMMIT_OPEN",asc:false,
                  }
                ],
              }
            },
            {modal:{parent:"prnt-control-md",name:"md-control",size:"xl"}},
            //control form
            {
              crud:{
                parent:"md-control",name:"cr-control-fm",recordName:"control de caja",
                title:"control de caja",schema:sch_control_accounts,
                panels:[
                  {
                    tipe:"form",title:"informacion",col:12,
                    fieldsSet:[
                      {value:"account",state:"show"},
                      {value:"status",state:"show"},
                      {value:"comment",state:"edit"},
                    ]
                  },
                  {
                    tipe:"form",title:"apertura de caja",col:6,
                    fieldsSet:[
                      {value:"open_emmit",state:"show"},
                      {value:"open_total",state:(acc_edit?"edit":"show")},
                    ]
                  },
                  {
                    tipe:"form",title:"cierre de caja",col:6,
                    fieldsSet:[
                      {value:"close_emmit",state:"show"},
                      {value:"close_total",state:"show"},
                    ]
                  },
                  {
                    tipe:"form",title:"lista de ingresos/egresos",head:false,
                    fieldsSet:[
                      {action:"div",name:"prnt-pays"},
                    ],
                  },
                  {
                    tipe:"form",head:false,name:"actions",
                    fieldsSet:[
                      {action:"button",name:"close",title:"cerrar caja",value:"CERRAR CAJA",class:"w-100 btn btn-danger m-1 btn",descripcion:"una vez cerrada la caja, no se puede modificar ingresos/egresos"},
                      {action:"button",name:"modif",title:"modificar saldo",value:"MODIFICAR SALDO",class:"w-100 btn btn-primary m-1 btn",descripcion:"ingresar/retirar saldo de caja"},
                    ],
                  }
                ],
                events:[
                  {
                    name:"reloadAfter",
                    actions:[{
                      action:({k})=>{
    
                        var cr_pays = k.group.crudGetBuild({crudName:"cr-pays"});
                        cr_pays.SetState({stateName:"reload"});
                        
                      }
                    }]
                  },
                  {
                    name:"newAfter",
                    actions:[{
                      action:()=>{
    
                        var cr_pays = k.group.crudGetBuild({crudName:"cr-pays"});
                        cr_pays.SetState({stateName:"block"});
                      }
                    }]
                  },
                  {
                    name:"boxUpdate",
                    actions:[{
                      action:({field,k})=>{
    
                        if(field.name == "close"){
    
                          k.Update_AddChangeField({
                            fieldName:"status",
                            value:0,
                            y:0,
                          });
                          k.Update({success:()=>{
    
                            k.SetState({stateName:"block"});
                            //group.crudGetBuild({crudName:"cr-account"}).SetState({stateName:"reload"});
                          }});
                        }
    
                        if(field.name=="modif"){
    
                          var crud_pay = k.group.crudGetBuild({crudName:"cr-pay"}); 
                          crud_pay.SetState({stateName:"new"});
                          crud_pay.bodyGet().fieldSetValues({fieldName:"account",values:[AccountGetId()]});
                        }
                      }
                    }]
                  },
                  {
                    name:"printAfter",
                    actions:[{
                      action:({k})=>{
    
                        var body = k.bodyGet();
                        var open = body.fieldGetValues({fieldName:"status"})[0] == 1;                      
                        var panelActions = body.panelGet({panelName:"actions"}).build.buildGet();
                        panelActions.Conteiner_Show({show:open,slow:false,ignoreBlock:true});
                      }
                    }]
                  },
                  {
                    name:"updateAfter",
                    actions:[{
                      action:({k})=>{
    
                        k.group.crudGetBuild({crudName:"cr-boxs"}).SetState({stateName:"reload"});
                      }
                    }]
                  }
                ],
                afterCancel:"block",
                afterUpdate:"block",
                states:[
                  {
                    name:"reload",
                    tools:[
                      //{name:"load",show:true},
                      {name:"tutorial",show:true},
                      {name:"cancel",show:true},
                      {name:"update",show:true},
                    ],
                  }
                ],
              }
            },
            //----lista de pagos de control
            {
              crud:{
                parent:"prnt-pays",name:"cr-pays",
                title:"lista de ingresos/egresos",
                tableMain:sch_pays.table,
                selects:[
                  {table:sch_pays.table,field:sch_pays.fieldPrimary,primary:true},
                  //{table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"ACCOUNT_ID"},
                  //{table:sch_accounts.table,field:"NAME",as:"ACCOUNT"},
                  {table:sch_pays.table,field:"DATE_EMMIT"},
                  {table:sch_pays.table,field:"TOTAL"},
                  {table:sch_pays.table,field:"INCOME"},
                  {table:sch_pays.table,field:"NOTE"},
                  {table:shc_pay_tag.table,field:"NAME",as:"TAG"},
                ],
                joins:[
                  {
                    main:{table:sch_pays.table,field:sch_accounts.fieldPrimary},
                    join:{table:sch_accounts.table,field:sch_accounts.fieldPrimary},
                    tipe:"LEFT",
                  },
                  {
                    main:{table:sch_pays.table,field:shc_pay_tag.fieldPrimary},
                    join:{table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary},
                    tipe:"LEFT",
                  },
                ],
                events:[
                  {
                    name:"reloadConditionsAfter",
                    actions:[{
                      action:({conditions=[],k})=>{
    
                        if(k.group){
    
                          var cr_control_fm = k.group.crudGetBuild({crudName:"cr-control-fm"});
                          var open_date = cr_control_fm.bodyGet().fieldGetValues({fieldName:"open_emmit"})[0];
                          var close_date = cr_control_fm.bodyGet().fieldGetValues({fieldName:"close_emmit"})[0];
                          var account_id = cr_control_fm.bodyGet().fieldGetValues({fieldName:"account"})[0];
    
                          conditions.push({
                            table:sch_pays.table,
                            field:sch_accounts.fieldPrimary,
                            inter:"=",
                            value:account_id,
                          });
    
                          if(open_date != ""){
    
                            conditions.push({
                              before:" AND ",
                              table:"payments",
                              field:"DATE_EMMIT",
                              inter:">=",
                              value:open_date,
                            });
                          }
    
                          if(close_date != "" && close_date != null){
    
                            conditions.push({
                              before:" AND ",
                              table:"payments",
                              field:"DATE_EMMIT",
                              inter:"<=",
                              value:close_date,
                            });
                          }
                        }
    
                        return {conditions};
                      }
                    }]
                  },
                  {
                    name:"printBefore",
                    actions:[{
                      action:({result,k})=>{
    
                        var cr_control_fm = k.group.crudGetBuild({crudName:"cr-control-fm"});
                        var openDate = cr_control_fm.bodyGet().fieldGetValues({fieldName:"open_emmit"})[0];
                        var totalCurrent = cr_control_fm.bodyGet().fieldGetValues({fieldName:"open_total"})[0];
                        totalCurrent = parseFloat(totalCurrent);
    
                        var closeDate = "";
    
                        result.unshift({
                          DATE_EMMIT:openDate,
                          INCOME_TOT:0,
                          EGRESO_TOT:0,
                          SALDO:totalCurrent,
                          TAG:"ABRIO CAJA",
                          DESCRIPCION:"",
                        });
    
                        for (let rst = 1; rst < result.length; rst++) {
                          
                          var values = result[rst];
                          var total = parseFloat(values["TOTAL"]);
                          var income = values["INCOME"] == "1";
                          total = (income ? 1 : -1 ) * total;
    
                          values["INCOME_TOT"] = income ? total : 0;
                          values["EGRESO_TOT"] = !income ? total : 0;
    
                          totalCurrent += total;
                          values["SALDO"] = totalCurrent;
    
                        }
    
                        result.push({
                          DATE_EMMIT:closeDate,
                          INCOME_TOT:0,
                          EGRESO_TOT:0,
                          SALDO:totalCurrent,
                          TAG:"CERRAR CAJA",
                          DESCRIPCION:"",
                        });
    
                        return {data:result};
                      }
                    }]
                  },
                ],
                panels:[{
                  tipe:"table",
                  fields:[
                    //{name:"cuenta id",select:"ACCOUNT_ID",box:{...bx_shw}},
                    //{name:"cuenta",select:"ACCOUNT",box:{...bx_shw}},
                    {name:"fecha",select:"DATE_EMMIT",box:{...bx_shw}},
                    {name:"ingeso",select:"INCOME_TOT",box:{...bx_income}},
                    {name:"egreso",select:"EGRESO_TOT",box:{...bx_income}},
                    {name:"saldo",select:"SALDO",box:{...bx_saldo}},
                    {name:"etiqueta",select:"TAG",box:{...bx_shw}},
                    {name:"comentario",select:"NOTE",box:{...bx_shw}},
                  ],
                }],
                stateStart:"block",
                states:[
                  {
                    name:"reload",
                    tools:[
                      {name:"reload",show:false},
                      {name:"new",show:false},
                      {name:"sizes",value:10,show:false},
                    ],
                  }
                ],
              }
            },
            //-----pay--------
            {modal:{parent:"prnt-pay-md",name:"md-pay"}},
            {
              crud:{
                name:"cr-pay",title:"transaccion",recordName:"transaccion",
                schema:sch_pays,parent:"md-pay",head:false,
                panels:[{
                  tipe:"form",head:false,
                  fieldsSet:[
                    {value:"date"},
                    {value:"account",state:"show"},
                    {value:"tag",state:"edit"},
                    {value:"total",state:"edit"},
                    {value:"comment",state:"edit"},
                    {value:"income"},
                  ],
                }],
                states:[
                  {
                    name:"new",
                    tools:[
                      {name:"title",show:true,value:"transaccion"},
                      {name:"tutorial",show:true},
                      {name:"load",show:false},
                      {name:"cancel",show:true},
                      {name:"insert",show:true},
                    ],
                  }
                ],
                loads:[
                  {
                    name:"ld-tag",
                    tableMain:shc_pay_tag.table,
                    selects:[
                        {table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary,as:"value"},
                        {table:shc_pay_tag.table,field:"NAME",as:"show"},
                        {table:shc_pay_tag.table,field:"INCOME",as:"income"},
                    ],
                    conditions:[
                      {
                        before:" ( ",
                        table:shc_pay_tag.table,
                        field:"NAME",
                        inter:"=",
                        value:"RETIRO DE CAJA",
                      },
                      {
                        before:" OR ",
                        table:shc_pay_tag.table,
                        field:"NAME",
                        inter:"=",
                        value:"INGRESO DE CAJA",
                        after:" ) "
                      },
                      {
                        before:" AND ",
                        table:shc_pay_tag.table,
                        field:"ID_COMPANY",
                        inter:"=",
                        value:userData.company.id,
                      },
                    ],
                  },
                  {
                    name:"ld-account",
                    tableMain:sch_accounts.table,
                    selects:[
                        {table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"value"},
                        {table:sch_accounts.table,field:"NAME",as:"show"},
                    ],
                    conditions:[
                      {
                        table:sch_accounts.table,
                        field:"ID_COMPANY",
                        inter:"=",
                        value:userData.company.id,
                      },
                    ],
                  },
                ],
                stateStart:"block",
                afterCancel:"block",
                afterInsert:"block",
                events:[
                  {
                    name:"filterIncome",
                    actions:[{
                      action:({k})=>{
    
                        var tagId = k.bodyGet().fieldGetValues({fieldName:"tag"})[0];
                        var loadResult = k.Loaded_GetLoadData({loadName:"ld-tag"}).result;
                        var tagInfo = loadResult.find(rst=>rst.value == tagId);
                        if(tagInfo){
    
                          var tagIncome = tagInfo.income == "1" ? 1 : 0;
                          k.bodyGet().fieldSetValues({fieldName:"income",values:[tagIncome]});
                          k.Update_AddChangeField({
                            fieldName:"income",
                            value:tagIncome,
                            y:0,
                          });
                        }                     
    
                      }
                    }],
                  },
                  {
                    name:"boxUpdate",
                    actions:[{
                      action:({field,k})=>{
    
                        if(field.name == "tag") k.CallEvent({name:"filterIncome"});
                      }
                    }]
                  },
                  {
                    name:"newAfter",
                    actions:[{
                      action:({k})=>{
    
                        k.CallEvent({name:"filterIncome"});
                      }
                    }]
                  },
                  {
                    name:"insertBefore",
                    actions:[{
                      action:({k},inserts=[])=>{
    
                        k.bodyGet().fieldsGet().forEach(field => {
                          
                          if(field.box.tipe == 0 && field.name != "date"){
    
                            var income = k.bodyGet().fieldGetValues({fieldName:field.name})[0];
                            inserts.push({
                              table:sch_pays.table,
                              field:field.select,tipe:"values",
                              value:income,
                            });
                          }
                        });   
    
                        return {inserts}
                      }
                    }]
                  },
                  {
                    name:"insertAfter",
                    actions:[{
                      action:({k})=>{
    
                        k.group.crudGetBuild({crudName:"cr-control-fm"}).SetState({stateName:"reload"});
                      }
                    }]
                  }
                ],
              }
            }
        ],
        conections:[
            {
                masterName:"cr-boxs",
                masterSelect:"ID_CONTROL_ACCOUNT",
                masterAction:"edit",
                event:"cnx",
                maidName:"cr-control-fm",
                maidSelect:"ID_CONTROL_ACCOUNT",
            },
        ],
    }
}

function pageConfig_saleControls({filters,dateFilter=true}) {
  

  const eventPdf = ({k})=>{

    var userData = k.CallEvent({name:"userData"});
    var dataMain = k.Reload_GetData();
    var crudList = k.CallEvent({name:"getGroupBuild"}).crudGetBuild({crudName:"cr-items"});
    var dataList = crudList.Reload_GetData();

    console.log("DOWLAND PDF OF SALE!!!",dataMain,dataList);

    var invoiceData = {
    title:"venta",
    invoiceNumber: '001-001-000000'+dataMain[0]['ID_SALE'],
    invoiceDate: dataMain[0]['sales-DATE_EMMIT'],
    companyName: userData.company.nameReal,
    companyRUC: userData.company.ruc,
    companyAddress: userData.company.direccion,
    companyPhone: userData.company.telf,
    companyLogo:userData.company.logo,
    customerName: dataMain[0]['customers-NAME'],
    customerDocumentType: 'dni',
    customerDocumentNumber: dataMain[0]['customers-NRO_DOCUMENT'],
    customerPhone: dataMain[0]['customers-PHONE'],
    customerAddress: dataMain[0]['customers-DIRECCION'],
    items: [
        { detail: 'Servicio de Consultoría', type: 'Servicio', quantity: 1, unitPrice: 150, totalPrice: 150 },
    ],
    dscto:0,
    };

    var itemOptions = crudList.Loaded_GetLoadOptions({loadName:"ld-item",loadShow:"show"});
    

    invoiceData.items = dataList.map(d=>{

      return {detail:itemOptions.find(op=>op.value==d["sales_products-ID_PRODUCT"])["show"],type:"",quantity:d["sales_products-CANT"],unitPrice:parseFloat(d["sales_products-PRICE_UNIT"]),totalPrice:parseFloat(d["sales_products-PRICE_TOTAL"])};
    })

    generateInvoicePDF(invoiceData);
  }

  return {
    type:"control",
    schema:sch_sales,
    mainControlVisual:{
        fields:[
            {value:"customer",state:"show"},
            {value:"status",state:"edit"},
            {value:"pay",state:"edit"},
            {value:"total",state:"show"},
            {value:"comment",state:"edit"},
            {value:"emmit",state:"edit",filter:dateFilter},
            {value:"worker",state:"edit"},
        ],
    },
    filters,
    mainDetailVisual:{
        fields:[
            {value:"emmit",state:"show"},
            {value:"customer",state:"show"},
            {value:"status",state:"show"},
            {value:"pay",state:"show"},
            {value:"total",state:"show"},
        ],
    },

    schemaItems:sch_sales_products,
    itemDetailVisual:{
        fields:[
            {value:"item",state:"show"},
            {value:"cant",state:"show"},
            {value:"priceUnit",state:"show"},
            {value:"priceTotal",state:"show"},
        ],
    },

    page:"sale-new",
    fieldTotalName:"pay",

    eventPdf,
  }
}

function pageConfig_items({title,fields=[]}) {
  
  return {
    layers:[
      {
        grid:{
          items:[
            {name:"main",col:12},
          ]
        }
      },
      {
        crud:{
          recordName:"item",parent:"main",
          name:"cr-items",title,
          schema:sch_items,
          panels:[
            {
              tipe:"table",
              fieldsSet:[
                {value:"name"},
                {value:"tipe"},
                {value:"tag"},
                ...fields,
                {value:"active"},
              ],
            }
          ],
          states:[
            {
              name:"reload",
              tools:[
                {name:"reload",show:true},
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"sizes",show:true,value:10},
                {name:"pages",show:true},
              ]
            }
          ]
        }
      }
    ],
  }
}

function pageConfig_inform_sales({}) {
  
    return {
        type:"free",
        
        script:({userData,pageData})=>{
            
            return {
                layers:[
                    {
                      crud:{
                        name:"cr-sales",
                        parent:pageData.body,
                        title:"reporte de ventas",recordName:"venta",
                        tableMain:sch_sales.table,
                        selects:[
                          {table:sch_sales.table,field:"ID_SALE",primary:true},
                          {table:sch_sales.table,field:"DATE_EMMIT"},
                          {table:sch_sales.table,field:"TOTAL"},
                        ],
                        conditions:[
                          {
                            table:sch_sales.table,
                            field:"ID_COMPANY",
                            inter:"=",
                            value:userData.company.id,
                          }
                        ],
                        filters:[
                          {...flt_period,box:{...flt_period.box,value:"day"}},
                          {col:6,name:"fecha min",box:{tipe:2,value:Date_FirstOfMoth()},select:{table:sch_sales.table,field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha minima de venta"},
                          {col:6,name:"fecha max",box:{tipe:2,value:Date_LastOfMoth()},select:{table:sch_sales.table,field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha maxima de venta"},
                          {name:"estado",box:{tipe:4,options:op_sales_status,value:op_sales_status.filter(op=>op.value!=5).map(op=>{return op.show;})},select:{table:sch_sales.table,field:"ID_STATUS"},descripcion:"busca por estado de ventas"},
                          {name:"pagado",box:{tipe:4,options:op_sales_paid,value:[op_sales_paid.find(op=>op.value==1).show]},select:{table:sch_sales.table,field:"PAID"},descripcion:"busca por ventas pagadas o pendientes de pago"},
                        ],
                        config:{show:false},
                        states:[
                          {
                            name:"reload",
                            tools:[
                              {name:"reload",show:true},
                              {name:"config",show:true},
                              {name:"tutorial",show:true},
                              {name:"sizes",value:999,show:false},
                            ]
                          },
                        ],
                        panels:[
                          {
                            title:"grafico",tipe:"form",head:false,
                            fields:[
                              {action:"div",name:"prnt-sale",box:{tipe:0,class:"conteiner w-100 m-0 p-0"},tipe:0},
                            ],
                          },
                          /*{
                            tipe:"table",title:"detalle de ventas",
                            fields:[
                              {name:"id",select:"ID_SALE",box:{tipe:0}},
                              {name:"sale date",select:"DATE_EMMIT",box:{tipe:0}},
                              {name:"total",select:"TOTAL",box:{tipe:0}},
                            ],
                          },*/
                        ],
                        events:[
                          {
                            name:"printAfter",
                            actions:[{
                              action:({k})=>{
          
                                var labelsCal = DataGetCalculateByLabel({
                                  data:k.Reload_GetData(),
                                  labelField:"DATE_EMMIT",
                                  period:k.bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"periodo"}).GetValue(),
                                  calcField:"TOTAL",
                                });
                                console.log(labelsCal);                      
          
                                var chart_evol = k.group.parentGetBuild({parentName:"chart-evol"});
                                chart_evol.fieldSetValues({
                                  fieldName:"labels",
                                  values:labelsCal.map(lb=>{return lb.value}),
                                });
                                chart_evol.fieldSetValues({
                                  fieldName:"ventas",
                                  values:labelsCal.map(lb=>{return lb.sum}),
                                });
          
                                var tot_v = parseFloat(labelsCal.reduce((acum,v)=>{return acum+v.sum;},0).toFixed(2));
                                var prom_v = tot_v/(labelsCal.reduce((acum,v)=>{return acum+v.count;},0));
          
                                k.group.parentGetBuild({parentName:"kpi-tot"}).fieldSetValues({fieldName:"tot",values:[tot_v]});
                                k.group.parentGetBuild({parentName:"kpi-prom"}).fieldSetValues({fieldName:"prom",values:[prom_v]});
                                
                              }
                            }]
                          },
                          {
                            name:"stateSetFirst",
                            actions:[{
                              action:({k})=>{}
                            }]
                          },
                        ],
                      }
                    },
                    {
                      grid:{
                        parent:"prnt-sale",
                        items:[
                          {col:6,name:"prnt-tot"},
                          {col:6,name:"prnt-prom"},
                          {col:12,name:"prnt-evol"},
                        ],
                      }
                    },
                    {panel:{name:"kpi-tot",parent:"prnt-tot",tipe:"kpi",fields:[{name:"tot",title:"total vendido",box:{...bx_moneyh1}}]}},
                    {panel:{name:"kpi-prom",parent:"prnt-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio vendido",box:{...bx_moneyh1}}]}},
                    {
                      panel:{
                        tipe:"chart",parent:"prnt-evol",name:"chart-evol",title:"evolutivo de ventas",
                        fields:[
                          {name:"labels",values:["month1","month2","month3",]},
                          {name:"ventas",values:[100,200,300]},
                        ],
                      }
                    }
                ],
            }
        }
    }
}

function pageConfig_inform_products({}) {

    return {
        type:"free",
        script:({userData,pageData,build})=>{

            
            const group = ()=>{return build.groupGet();}
            const EvolProduct = ({productName})=>{
        
                var crud = group().parentGet({parentName:"cr-items"}).build;
                var dataset = crud.ReloadDataSetGet({dataSetName:"products"});
                var productData = dataset.result.find(rst=>rst.name == productName);
                console.log("EVOL PRODUCT",productData);
        
                //-----cant----
                
                var kpi_cant_total = group().parentGet({parentName:"kpi-cant-tot"}).build;
                kpi_cant_total.fieldSetValues({fieldName:"tot",values:[productData.cant]});
        
                var kpi_cant_prom = group().parentGet({parentName:"kpi-cant-prom"}).build;
                kpi_cant_prom.fieldSetValues({fieldName:"prom",values:[productData.cantProm]});
        
                var chr_cant = group().parentGet({parentName:"chrt-cant-evol"}).build;
                chr_cant.titleSet({title:"evolutivo de cantidades del producto: " + productName});
                chr_cant.fieldSetValues({fieldName:"labels",values:productData.dates.map(d=>{return d.label;})});
                chr_cant.fieldSetValues({fieldName:"cant",values:productData.dates.map(d=>{return d.cant;})});
        
                //-----sale----
        
                var kpi_sale_total = group().parentGet({parentName:"kpi-sale-tot"}).build;
                kpi_sale_total.fieldSetValues({fieldName:"tot",values:[productData.money]});
        
                var kpi_sale_prom = group().parentGet({parentName:"kpi-sale-prom"}).build;
                kpi_sale_prom.fieldSetValues({fieldName:"prom",values:[productData.moneyProm]});
        
                var chr_sale = group().parentGet({parentName:"chrt-sale-evol"}).build;
                chr_sale.titleSet({title:"evolutivo de ventas del producto: " + productName});
                chr_sale.fieldSetValues({fieldName:"labels",values:productData.dates.map(d=>{return d.label;})});
                chr_sale.fieldSetValues({fieldName:"sale",values:productData.dates.map(d=>{return d.money;})});
        
            };
            return {
                layers:[
                    {
                      crud:{
                        name:"cr-items",
                        parent:pageData.body,
                        title:pageData.title,
                        states:[
                            {
                              name:"reload",
                              tools:[
                                  {name:"sizes",show:false,value:999},
                                  {name:"pages",show:false},
                                  {name:"reload",show:true},
                                  {name:"tutorial",show:true},
                                  {name:"config",show:true},
                              ],
                            },
                            {
                              name:"block",
                              tools:[
                                {name:"reload",show:true},
                              ],
                            }
                        ],
                        stateStart:"reload",
                    
                        tableMain:"sales_products",
                        selects:[
                            {table:'sales_products', field:'ID',primary:true},
                            {table:'sales',field:'DATE_EMMIT'},
                            {table:'sales_products',field:'ID_SALE'},
                            {table:'sales_products',field:'ID_PRODUCT'},
                            {table:'products',field:'NAME',as:'pNAME'},
                            {table:'products_tags',field:'NAME',as:'tNAME'},
                            {table:'unids',field:'SIMBOL',as:'uNAME'},
                            {table:'sales_products',field:'CANT'},
                            {table:'sales_products',field:'PRICE_UNIT'},
                            {table:'sales_products',field:'PRICE_TOTAL'},    
                        ],
                        joins:[
                            {
                              main:{table:"sales_products",field:"ID_PRODUCT"},
                              join:{table:"products",field:"ID_PRODUCT"},
                              tipe:"LEFT",
                            },
                            {
                              main:{table:"products",field:"ID_PRODUCT_TAG"},
                              join:{table:"products_tags",field:"ID_PRODUCT_TAG"},
                              tipe:"LEFT",
                            },
                            {
                              main:{table:"products",field:"UNID_ID"},
                              join:{table:"unids",field:"ID_UNID"},
                              tipe:"LEFT",
                            },
                            {
                              main:{table:"sales_products",field:"ID_SALE"},
                              join:{table:"sales",field:"ID_SALE"},
                              tipe:"LEFT",
                            }
                        ],
                        loads:[
                            //ld_unids,
                            {
                              name:"ld-products_tags",
                              tableMain:"products_tags",
                              selects:[
                                {table:"products_tags",field:"ID_PRODUCT_TAG",as:"value"},
                                {table:"products_tags",field:"NAME",as:"show"},
                              ],
                              conditions:[
                                {
                                  table:"products_tags",
                                  field:"ID_COMPANY",
                                  inter:"=",
                                  value:userData.company.id,
                                },
                              ],
                            }
                        ],
                        conditions:[
                          {
                            table:"sales",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:userData.company.id,
                          },
                        ],
          
                        configShow:true,    
                        filters:[
                            {...flt_period},
                            {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
                            {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
                            {name:"producto",box:bx_input,select:{table:"products",field:"NAME"},descripcion:"buscar por nombre de producto/servicio/insumo"},
                            {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
                            {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"},
                            {name:"pagado",box:{tipe:4,options:op_sales_paid,value:[op_sales_paid.find(op=>op.value==1).show]},select:{table:"sales",field:"PAID"}},
                            {name:"estado de ventas",box:{tipe:4,options:op_sales_status,value:op_sales_status.filter(st=>st.value!=5).map(st=>{return st.show})},select:{table:"sales",field:"ID_STATUS"}},
                        ],
                        panels:[
                          {
                            head:false,tipe:"form",col:12,
                            fields:[
                              {name:"prnt-top",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}},
                            ],
                          },
                          {
                            head:false,col:12,tipe:"form",
                            fields:[
                              {name:"prnt-evol",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}},
                            ],
                          }
                        ],
          
                        events:[
                          {
                            name:"printBefore",
                            actions:[{
                              action:({result,k})=>{
          
                                var period = k.bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"periodo"}).GetValue();
                                console.log("PRINT BEFORE",period, result);
          
                                var products = [];
                                var dates = [];
          
                                result.forEach(rst => {
                                  
                                  var dateLabel = Date_GetLabel({dateString:rst["DATE_EMMIT"],period});
                                  
                                  if(!dates.find(d=>d==dateLabel)) dates.push(dateLabel);
          
                                  var productFound = products.find(p=>p.id == rst["ID_PRODUCT"]);
                                  var money = parseFloat(rst["PRICE_TOTAL"]);
                                  var cant = parseFloat(rst["CANT"]);
                                  
          
                                  if(!productFound){
          
                                    products.push({
                                      id:rst["ID_PRODUCT"],
                                      name:rst["pNAME"],
                                      unid:rst["uNAME"],
                                      count:1,
                                      money,
                                      cant,
                                      dates:[{
                                        label:dateLabel,
                                        cant,
                                        money,
                                      }],
                                    });
          
                                  }
                                  else
                                  {
          
                                    productFound.count++;
                                    productFound.money += money;
                                    productFound.cant += cant;
          
                                    var productDate = productFound.dates.find(d=>d.label == dateLabel);
                                    if(productDate){
          
                                      productDate.cant += cant;
                                      productDate.money += money;
                                    }
                                    else
                                    {
                                      productFound.dates.push({
                                        label:dateLabel,
                                        cant,
                                        money,
                                      });
                                    }
          
                                  }
          
                                });
          
                                products.forEach(prd => {
                                  
                                  prd.moneyProm = (prd.money/prd.dates.length).toFixed(2);
                                  prd.cantProm = (prd.cant/prd.dates.length).toFixed(2) + " " + prd.unid;
                                  prd.cant += " " + prd.unid;
          
                                });
          
                                products.sort((a, b) => b.money - a.money);
          
                                console.log("TRANSFORM DATA",products,dates);
                                k.ReloadDataSetAdd({dataSetName:"products",result:products});
                                
                                if(products.length > 0) EvolProduct({productName:products[0].name,group:k.group});
          
                                //-----print top list-----
          
                                var tb_top = k.group.parentGet({parentName:"tb-top"}).build;
                                tb_top.fieldSetValues({
                                  fieldName:"product",
                                  values:products.map(p=>{return p.name}),
                                });
                                tb_top.fieldSetValues({
                                  fieldName:"total",
                                  values:products.map(p=>{return p.money}),
                                });
                                tb_top.fieldSetValues({
                                  fieldName:fld_search.name,
                                  values:Array(products.length).fill(fld_search.box.value),
                                });
          
                                return {data:products};
          
                              }
                            }]
                          }
                        ],
                      }
                    },
                    //window top
                    {
                      panel:{
                        parent:"prnt-top",
                        tipe:"form",title:"top de productos",
                        fields:[
                          {action:"div",name:"div-top",tipe:0,box:{tipe:0,class:"w-100 conteiner"}},
                        ],
                      }
                    },
                    //top
                    {
                      panel:{
                        parent:"div-top",tipe:"table",maxH:200,name:"tb-top",
                        fields:[
                          {name:"product",title:"producto",attributes:att_ln},
                          {name:"total",title:"total vendido",box:{...bx_money},attributes:att_ln},
                          {...fld_search,attributes:att_btn},
                        ],
                        events:[
                          {
                            name:"boxUpdate",
                            actions:[{
                              action:({k,field,y,value})=>{
          
                                if(field.action == "search"){
                                  
                                  EvolProduct({productName:k.fieldGetValues({fieldName:"product"})[y],group:k.group});
                                }
          
                              }
                            }]
                          }
                        ],
                      }
                    },
                    //evol
                    {grid:{parent:"prnt-evol",items:[{name:"div-cant",col:6},{name:"div-sale",col:6}]}},
                    {
                      panel:{
                        parent:"div-cant",title:"evolutivo de cantidades",tipe:"form",blocked:false,
                        fields:[{name:"stp-cant",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}}]},
                    },
                    {
                      panel:{
                        parent:"div-sale",title:"evolutivo de ventas",tipe:"form",blocked:false,
                        fields:[{name:"stp-sale",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}}]
                      }
                    },
                    //evol - cant
                    {
                      grid:{
                        parent:"stp-cant",
                        items:[
                          {name:"prnt-cant-tot",col:6},
                          {name:"prnt-cant-prom",col:6},
                          {name:"prnt-cant-evol",col:12},
                        ],
                      }
                    },
                    {panel:{parent:"prnt-cant-tot",name:"kpi-cant-tot",tipe:"kpi",fields:[{name:"tot",title:"total vendido",box:{tipe:0,class:"w-100 text-center h1",value:0}}]}},
                    {panel:{parent:"prnt-cant-prom",name:"kpi-cant-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio vendido",box:{tipe:0,class:"w-100 text-center h1",value:0}}]}},
                    {
                      panel:{
                        parent:"prnt-cant-evol",name:"chrt-cant-evol",
                        tipe:"chart",title:"evolutivo del producto seleccionado",
                        fields:[
                          {name:"labels",values:["mes1","mes2"]},
                          {name:"cant",values:[1,2]},
                        ],
                      }
                    },
                    //evol - sale
                    {
                      grid:{
                        parent:"stp-sale",
                        items:[
                          {name:"prnt-sale-tot",col:6},
                          {name:"prnt-sale-prom",col:6},
                          {name:"prnt-sale-evol",col:12},
                        ],
                      }
                    },
                    {panel:{parent:"prnt-sale-tot",name:"kpi-sale-tot",tipe:"kpi",fields:[{name:"tot",title:"total vendido",box:{...bx_money,class:"w-100 text-center h1",value:0}}]}},
                    {panel:{parent:"prnt-sale-prom",name:"kpi-sale-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio vendido",box:{...bx_money,class:"w-100 text-center h1",value:0}}]}},
                    {
                      panel:{
                        parent:"prnt-sale-evol",name:"chrt-sale-evol",
                        tipe:"chart",title:"evolutivo del producto seleccionado",
                        fields:[
                          {name:"labels",values:["mes1","mes2"]},
                          {name:"sale",values:[1,2]},
                        ],
                      }
                    },
                  ],
            }
        }
    }

    
}

function pageConfig_inform_customer({}) {
        
    return {
        type:"free",
        script:({userData,pageData,build})=>{

            const group = ()=>{return build.groupGet();}
            return {
                layers:[
                    {
                      crud:{
                        parent:pageData.body,name:"cr-customers",
                        title:pageData.title,
                        states:[
                            {
                              name:"reload",
                              tools:[
                                  {name:"tutorial",show:true},
                                  {name:"config",show:true},
                                  //{name:"load",show:true},
                                  {name:"sizes",show:false,value:999},
                                  {name:"reload",show:true},
                              ],
                            },
                            {
                              name:"block",
                              tools:[
                                {name:"sizes",show:false,value:999},
                                {name:"reload",show:true},
                              ],
                            }
                        ],
                        stateStart:"reload",
          
                        tableMain:"sales",
                        selects:[
                            {table:'sales', field:'ID_SALE',primary:true},
                            {table:'sales',field:'DATE_EMMIT'},
                            {table:'sales',field:"TOTAL"},
                            {table:'customers',field:"NAME"}, 
                        ],
                        joins:[
                            {
                              main:{table:"sales",field:"ID_CUSTOMER"},
                              join:{table:"customers",field:"ID_CUSTOMER"},
                              tipe:"LEFT",
                            },
                        ],
                        conditions:[
                          {
                            table:"sales",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:company_id,
                          },
                        ],
          
                        configShow:false,    
                        filters:[
                            //{name:"periodo",box:{tipe:3,options:op_date_ranges,value:op_date_ranges[2].value}},
                            {name:"cliente",box:{tipe:1,class:"w-100"},select:{table:"customers",field:"NAME",inter:"LIKE"}},
                            {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
                            {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
                            {name:"pagado",box:{tipe:4,options:op_sales_paid,value:[op_sales_paid[0].show]},select:{table:"sales",field:"PAID"}},
                            {name:"estado de ventas",box:{tipe:4,options:op_sales_status,value:op_sales_status.filter(st=>st.value!=5).map(st=>{return st.show})},select:{table:"sales",field:"ID_STATUS"}},
                        ],
          
                        events:[
                          {
                            name:"printBefore",
                            actions:[{
                              action:({k,result})=>{
          
                                console.log("TRANSFORM DATA",result);
          
                                var customers = [];
                                var datesTotal = [];
          
                                result.forEach(rst => {
                                  
                                  var rstName = rst["NAME"];
                                  var rstDate = rst["DATE_EMMIT"];
                                  var rstDateLabel = Date_GetLabel({dateString:rstDate,period:"day"});
                                  var rstTotal = parseFloat(rst["TOTAL"]);
          
                                  var custFound = customers.find(cst=>cst.name == rstName);
                                  if(!custFound){
          
                                    customers.push({
                                      name:rstName,
                                      total:rstTotal,
                                      dates:[
                                        {
                                          label:rstDateLabel,
                                          total:rstTotal,
                                        }
                                      ],
                                    });
                                  }
                                  else
                                  {
                                    custFound.total += rstTotal;
                                    var custFounDate = custFound.dates.find(dt=>dt.label == rstDateLabel);
                                    if(custFounDate) custFounDate.total += rstTotal;
                                    else
                                    {
                                      custFound.dates.push({
                                        label:rstDateLabel,
                                        total:rstTotal,
                                      });
                                    }
                                  }
          
                                  var dateTotalFound = datesTotal.find(dt=>dt.label == rstDateLabel);
                                  if(dateTotalFound) dateTotalFound.total += rstTotal;
                                  else{
          
                                    datesTotal.push({
                                      label:rstDateLabel,
                                      total:rstTotal,
                                    });
                                  }
                                  
                                });
          
                                customers.forEach(cust => {
                                  
                                  cust.prom = cust.total/cust.dates.length;
                                });
          
                                customers.sort((a,b)=>{return -a.total + b.total});
          
                                console.log("TRANSFORMED DATA",customers,datesTotal);
          
                                k.ReloadDataSetAdd({dataSetName:"customers",result:customers});
          
                                //customers = customers.slice(0,10);
                                var tb_lst = k.group.parentGet({parentName:"tb-list"}).build;
                                tb_lst.fieldSetValues({fieldName:"cliente",values:customers.map(ct=>{return ct.name})});
                                tb_lst.fieldSetValues({fieldName:"total",values:customers.map(ct=>{return ct.total})});
                                tb_lst.fieldSetValues({fieldName:fld_search.name,values:Array(customers.length).fill(fld_search.box.value),})
          
                                k.CallEvent({name:"customerEvol",params:{customerName:customers[0].name}});
                                
                                
                                return null;
                              }
                            }]
                          },
                          {
                            name:"customerEvol",
                            actions:[{
                              action:({k,customerName})=>{
          
                                var customers = k.ReloadDataSetGet({dataSetName:"customers"}).result;
                                var datacustomer = customers.find(cus=>cus.name == customerName);
          
                                var chr_evol = k.group.parentGet({parentName:"chr-evol"}).build;
                                
                                chr_evol.titleSet({title:"Evolutivo de compras del cliente: " + customerName});
                                chr_evol.fieldSetValues({fieldName:"labels",values:datacustomer.dates.map(dt=>{return dt.label})});
                                chr_evol.fieldSetValues({fieldName:"total",values:datacustomer.dates.map(dt=>{return dt.total})});
          
                                var kpi_tot = k.group.parentGet({parentName:"kpi-tot"}).build;
                                kpi_tot.fieldSetValues({fieldName:"tot",values:[datacustomer.total]});
          
                                var kpi_prom = k.group.parentGet({parentName:"kpi-prom"}).build;
                                kpi_prom.fieldSetValues({fieldName:"prom",values:[datacustomer.prom]});
          
                              }
                            }]
                          },
                        ],
          
                        panels:[
                          {
                            tipe:"form",head:false,
                            fields:[
                              {name:"inform",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100 p-0 m-0"}},
                            ],
                          }
                        ],
                        
                        configShow:true,
                      }
                    },
                    {
                      grid:{
                        parent:"inform",
                        items:[
                          {name:"prnt-cust",col:8},
                          {name:"prnt-tb",col:4},
                        ]
                      }
                    },
                    {
                      grid:{
                        parent:"prnt-cust",
                        items:[
                          {name:"prnt-tot",col:6},
                          {name:"prnt-prom",col:6},
                          {name:"prnt-chr",col:12},
                        ],
                      }
                    },
                    {panel:{name:"kpi-tot",parent:"prnt-tot",tipe:"kpi",fields:[{name:"tot",title:"total comprado",box:{...bx_moneyh1}}]}},
                    {panel:{name:"kpi-prom",parent:"prnt-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio comprado",box:{...bx_moneyh1}}]}},
                    {
                      panel:{
                        parent:"prnt-tb",
                        tipe:"form",title:"top de clientes",
                        fields:[{action:"div",name:"prnt-top",tipe:0,box:{tipe:0,class:"w-100 conteiner"}}],
                      }
                    },
                    {
                      panel:{
                        parent:"prnt-top",name:"tb-list",
                        tipe:"table",maxH:300,
                        fields:[
                          {...fld_search},
                          {name:"total",box:{...bx_money}},
                          {name:"cliente",box:{...bx_shw}},
                        ],
                        events:[
                          {
                            name:"boxUpdate",
                            actions:[{
                              action:({field,y})=>{
                                
                                if(field.action == fld_search.action){
          
                                  var cr_main = group().parentGet({parentName:"cr-customers"}).build;
                                  
                                  var customers = cr_main.ReloadDataSetGet({dataSetName:"customers"}).result;
                                  cr_main.CallEvent({name:"customerEvol",params:{customerName:customers[y].name}});
                                }
                              }
                            }]
                          }
                        ],
                      }
                    },
                    {
                      panel:{
                        name:"chr-evol",
                        parent:"prnt-chr",
                        tipe:"chart",
                        fields:[
                          {name:"labels",title:"meses",values:["mes1","mes2","mes3","mes4","mes5"]},
                          {name:"total",title:"total de venta",values:[123,243,245,234,100]},
                        ],
                      }
                    }
                ],
            }
        }
    }
}

function pageConfig_inform_flujo({}) {
    
    return {
        type:"free",
        script:({userData,pageData,build})=>{

            const group = ()=>{return build.groupGet()};

            var lines = [
                "VENTAS",
                "COMPRAS",
                "UTILIDAD BRUTA",
              ];

            return {

                layers:[
                    {
                      crud:{
                        name:"cr-main",
                        parent:pageData.body,
                        title:pageData.title,
                        states:[
                            {
                              name:"reload",
                              tools:[
                                  {name:"tutorial",show:true},
                                  {name:"config",show:true},
                                  {name:"sizes",show:false,value:999},
                                  {name:"pages",show:false},
                                  {name:"reload",show:true},
                              ],
                            },
                            {
                              name:"block",
                              tools:[
                                {name:"reload",show:true},
                              ],
                            }
                        ],
                        stateStart:"reload",
                    
                        tableMain:sch_sales.table,
                        selects:[
                            {table:sch_sales.table,field:sch_sales.fieldPrimary,primary:true},
                            {table:'sales',field:'DATE_EMMIT'},
                            {table:sch_sales.table,field:"TOTAL"},
                        ],
                        conditions:[
                          {
                            table:"sales",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:userData.company.id,
                          },
                        ],
          
                        configShow:true,    
                        filters:[
                            {name:"periodo",box:{tipe:3,options:op_date_ranges,value:op_date_ranges[2].value}},
                            {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
                            {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
                            {name:"venta - pagado",box:{tipe:4,options:op_sales_paid,value:[op_sales_paid[0].show]},select:{table:"sales",field:"PAID"}},
                            {name:"venta - estado",box:{tipe:4,options:op_sales_status,value:op_sales_status.filter(st=>st.value!=5).map(st=>{return st.show})},select:{table:"sales",field:"ID_STATUS"}},
                            {name:"compra - estado",box:{tipe:4,options:op_buys_status,value:op_buys_status.filter(st=>st.value!=5&&st.value!=1).map(st=>{return st.show})}},
                        ],
                        events:[
                          {
                            name:"reloadAfter",
                            actions:[{
                              action:({k})=>{
          
                                
                                var windowFilters = k.bodyGet().configGetWindowFilters();
          
                                var period = windowFilters.Filter_GetBox({filterName:"periodo"}).GetValue();
          
                                var sales = [];
                                var salesResult = k.Reload_GetData();
                                salesResult.forEach(rst => {
                                  
                                  var date = Date_GetLabel({dateString:rst["DATE_EMMIT"],period});
                                  var total = parseFloat(parseFloat(rst["TOTAL"]).toFixed(2));
          
                                  var dateFound = sales.find(s => s.date == date);
                                  if(!dateFound){
          
                                    sales.push({
                                      date,
                                      total,
                                    });
                                  }else dateFound.total += total;
          
                                });
          
                                k.ReloadDataSetAdd({dataSetName:"sales",result:sales});
          
                                var cnx = k.Conection_Get();
                                var fechMax = windowFilters.Filter_GetBox({filterName:"fecha max"}).GetValue();
                                var fechMin = windowFilters.Filter_GetBox({filterName:"fecha min"}).GetValue();
                                var status = windowFilters.Filter_GetBox({filterName:"compra - estado"}).GetValue();
          
                                var conditions = [
                                  {
                                    table:sch_buys.table,
                                    field:"DATE_EMMIT",
                                    inter:">=",
                                    value:fechMin,
                                  },
                                  {
                                    before:" AND ",
                                    table:sch_buys.table,
                                    field:"DATE_EMMIT",
                                    inter:"<=",
                                    value:fechMax,
                                  },
                                  {
                                    before:" AND ",
                                    table:sch_buys.table,
                                    field:"ID_COMPANY",
                                    inter:"=",
                                    value:userData.company.id,
                                  },
                                ];
                                
                                for (let st = 0; st < status.length; st++) {
          
                                  const statu = status[st];
                                  conditions.push({
                                    before:(st==0?" AND (":" OR "),
                                    table:sch_buys.table,
                                    field:"ID_BUY_STATUS",
                                    inter:"=",
                                    value:statu,
                                    after:(status.length-1==st?")":"")
                                  });
                                }
                                
          
                                //load buys
                                var buySql = cnx.GetSql_Select({
                                  tableMain:sch_buys.table,
                                  selects:[
                                    {table:sch_buys.table,field:"DATE_EMMIT"},
                                    {table:sch_buys.table,field:"TOTAL"},
                                  ],
                                  conditions,
                                });
                                
                                k.bodyGet().LoadingScreenActive({active:true});
          
                                cnx.Request({
                                  php:"row",name:"",
                                  sql:buySql,
                                  success:(result)=>{
          
                                    console.log("LOADED BUY RESULT:",result,"sql:",buySql);
          
                                    var buysResult = result;
                                    var buys = [];
                                    buysResult.forEach(rst => {
                                      
                                      var date = Date_GetLabel({dateString:rst["DATE_EMMIT"],period});
                                      var total = parseFloat(parseFloat(rst["TOTAL"]).toFixed(2));
          
                                      var dateFound = buys.find(s => s.date == date);
                                      if(!dateFound){
          
                                        buys.push({
                                          date,
                                          total,
                                        });
                                      }else dateFound.total += total;
          
                                    });
                                    
                                    k.ReloadDataSetAdd({dataSetName:"buys",result:buys});
                                    k.bodyGet().LoadingScreenActive({active:false});
                                    k.CallEvent({name:"printData"});
                                  }
                                });
                              }
                            }],
                          },
                          {
                            name:"printData",
                            actions:[{
                              action:({k})=>{
          
                                //get data to transform
                                var sales = k.ReloadDataSetGet({dataSetName:"sales"});
                                var buys = k.ReloadDataSetGet({dataSetName:"buys"});
          
                                console.log("sales",sales,"buys",buys);
          
                                //transform data
                                var tableData = [
                                  {
                                    name:"detail",
                                    title:"detalle",
                                    values:[...lines],
                                  },
                                ];
          
                                function addData({detail,date,total}) {
                                  
                                  var detailIndex = tableData[0].values.findIndex(v=>v==detail);
                                  if(detailIndex == -1){
          
                                    tableData[0].values.push(detail);
                                    detailIndex = tableData[0].values.length-1;
                                  }
          
                                  var dateIndex = tableData.findIndex(d=>d.title==date);
          
          
                                  if(dateIndex == -1){
          
                                    var values = [];
                                    for (let v = 0; v < tableData[0].values.length; v++) {
          
                                      values.push(v == detailIndex ? total :0);                       
                                    }
          
                                    tableData.push({
                                      name:"period" + (tableData.length),
                                      title:date,
                                      values,
                                    });
                                  }
                                  else
                                  {                          
                                    tableData[dateIndex].values[detailIndex] += total;
                                  }
                                }
          
                                sales.result.forEach(sale => {
                                  
                                  addData({
                                    detail:tableData[0].values[0],
                                    date:sale.date,
                                    total:sale.total,
                                  });
          
                                });
          
                                buys.result.forEach(buy => {
                                  
                                  addData({
                                    detail:tableData[0].values[1],
                                    date:buy.date,
                                    total:buy.total*-1,
                                  });
          
                                });
          
                                //calculate utilidad
                                for (let p = 1; p < tableData.length; p++) {
                                  var tbField = tableData[p];
                                  var util = tbField.values[0] + tbField.values[1];
                                  addData({
                                    detail:lines[2],
                                    date:tbField.title,
                                    total:util,
                                  });
                                }
          
                                console.log("TRANSOFMR DATA",tableData);
                                
                                
                                //print table
                                var table = group().parentGet({parentName:"detail-tb"}).build;
                                var tableFields = table.fieldsGet();
                                for (let f = 0; f < tableFields.length; f++) {
          
                                  if(f >= tableData.length){
          
                                    var field = tableFields[f];
                                    table.fieldSetTitle({fieldName:field.name,title:""});
                                    table.fieldSetValues({fieldName:field.name,values:Array(lines.length).fill(0)}); 
                                  }
                                  else
                                  {
                                    var field = tableData[f];
                                    table.fieldSetTitle({fieldName:field.name,title:field.title});
                                    table.fieldSetValues({fieldName:field.name,values:field.values}); 
                                  }
                                  
                                }
          
                                //print chart
                                var chart = group().parentGet({parentName:"detail-chart"}).build;
          
                                var labesValues = [];
                                for (let tb = 1; tb < tableData.length; tb++) labesValues.push(tableData[tb].title);
                                chart.fieldSetValues({fieldName:"labels",values:labesValues});
          
                                var detailsValues = tableData[0].values;
                                for (let dt = 0; dt < detailsValues.length; dt++) {
                                  
                                  var detail = detailsValues[dt];
                                  var values = [];
          
                                  for (let lb = 1; lb < tableData.length; lb++) {
          
                                    var label = tableData[lb];
                                    var value = label.values[dt];
                                    values.push(value);
                                  }
          
                                  console.log("INDEX:",dt,"DETAIL:",detail,"VALUES:",values);
                                  chart.fieldSetValues({fieldName:detail,values});
                                  
                                  //chart.fieldSetTitle({fieldName:"utilidad",title:detail});
                                }
                                
                              }
                            }]
                          }
                        ],
                        panels:[
                          {
                            title:"grafico",tipe:"form",head:false,
                            fields:[
                              {action:"div",name:"div-chart",box:{tipe:0,class:"conteiner w-100 m-0 p-0"},tipe:0},
                            ],
                          },
                          {
                            title:"detalle",tipe:"form",
                            fields:[
                              {action:"div",name:"div-detail",box:{tipe:0,class:"conteiner w-100 m-0 p-0"},tipe:0},
                            ],
                          },
                        ],
                      }
                    },
                    {
                      panel:{
                        tipe:"chart",parent:"div-chart",name:"detail-chart",
                        fields:[
                          {name:"labels",values:["month1","month2","month3",]},
                          {name:lines[0],values:[100,200,300]},
                          {name:lines[1],values:[120,100,30]},
                          {name:lines[2],values:[40,200,250]},
                        ],
                      }
                    },
                    {
                      panel:{
                        tipe:"table",parent:"div-detail",name:"detail-tb",
                        fields:[
                          {name:"detail",title:"detalle",box:{...bx_shw}},
                          {name:"period1",title:"",box:{...bx_income}},
                          {name:"period2",title:"",box:{...bx_income}},
                          {name:"period3",title:"",box:{...bx_income}},
                          {name:"period4",title:"",box:{...bx_income}},
                          {name:"period5",title:"",box:{...bx_income}},
                          {name:"period6",title:"",box:{...bx_income}},
                          {name:"period7",title:"",box:{...bx_income}},
                          {name:"period8",title:"",box:{...bx_income}},
                          {name:"period9",title:"",box:{...bx_income}},
                          {name:"period10",title:"",box:{...bx_income}},
                          {name:"period11",title:"",box:{...bx_income}},
                          {name:"period12",title:"",box:{...bx_income}},
                        ],
                      }
                    }
                  ],
            }
        }
    }
}

function pageConfig_produccion({}) {
  
  return {
    type:"free",
    script:({userData,pageData,build})=>{

      return {
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
                {name:"stp-prod",title:"produccion",head:false},
                {name:"stp-recipe",title:"receta",head:false},
              ],
            },
          },
          //-----produccion --- table
          {
            crud:{
              parent:"prnt-prod",name:"cr-produccions",head:true,
              title:"ordenes de produccion",schema:sch_produccion,
              insertToEnd:false,
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
              title:"orden de produccion",schema:sch_produccion,head:false,
              panels:[
                {
                  tipe:"form",head:false,
                  fieldsSet:[
                    {value:"dateEmmit",state:"edit"},
                    {
                      value:"productResult",state:"edit",
                      update:({groups,crudBuild,field})=>{
                        
                        build.groupGet().CrudJoin({
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
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"tutorial",show:true},
                    {name:"title",show:true,value:"orden de produccion"},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                  ],
                }
              ],
              events:[
                {
                  name:"filterRecipe",
                  actions:[{
                    action:({k})=>{

                      build.groupGet().CrudJoin({
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
              parent:"prnt-prod-inputs",name:"cr-prod-inputs-tb",head:false,
              title:"lista de insumos",schema:sch_produccion_inputs,
              panels:[
                {
                  tipe:"table",head:false,h:400,
                  fieldsSet:[
                    {value:"input",state:"edit"},
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
                  ],
                }
              ],
            }
          },
          //-----recipe------
          {
            crud:{
              parent:"stp-recipe",name:"cr-recipe",head:false,
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
              states:[{
                name:"reload",
                tools:[
                  {name:"title",show:true,value:"receta"},
                  {name:"reload",show:true}
                ]
              }],
            },
          },
          {
            crud:{
              parent:"div-recipe-inputs",name:"cr-recipe-inputs",
              title:"lista de insumos",schema:sch_recipe_inputs,head:false,
              states:[{name:"reload",tools:[{name:"sizes",value:999,show:false}]}],
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
      }
    }
  }
}

function pageConfig_payments({}) {
  
  return {
    type:"free",
    actionsActive:true,
    actions:["see","update","insert"],
    /*record:{
      name:"tranference",
      titleOne:"transferencia",
      titleMult:"transferencias",
    },*/
    script:({userData,pageData,build})=>{

      return {
        layers:[
          {
            grid:{
              parent:pageData.body,
              items:[
                {name:"prnt-main",col:12},
                {name:"prnt-md-detail",col:12},
              ]
            }
          },
          {
            crud:{
              title:"lista de transferencias",
              parent:"prnt-main",name:"cr-pays",
              ...getCrudMult({
                userData,
                schemaMain:sch_pays,
                fields:[
                  {value:"account",filter:{boxTipe:3}},
                  {value:"income"},
                  {value:"total"},
                  {value:"tag"},
                  {value:"date",filter:true},
                ],
              }),
              config:{show:true},
              orders:[{field:"DATE_EMMIT",asc:false}],
              insertToEnd:false,
              states:[{
                name:"reload",
                tools:[
                  {name:"tutorial",show:true},
                  {name:"config",show:true},
                  {name:"sizes",show:true,value:10},
                  {name:"reload",show:true},
                  {name:"new",show:true},
                  {name:"pages",show:true},
                ],
              }],
              events:[
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{

                      var tagLoad = k.Loaded_GetLoadData({loadName:"ld-pay_tag"});                      
                      var tagValues = k.bodyGet().fieldGetValues({fieldName:"tag"});

                      var fieldsBoxes = k.bodyGet().fieldsGet().map(f=>{

                        return k.bodyGet().fieldGetBoxes({fieldName:f.name});
                      });

                      for (let tg = 0; tg < tagValues.length; tg++) {

                        const tagValue = tagValues[tg];
                        var tagShow = tagLoad.result.find(rst=>rst.value==tagValue).show;
                        var tagIsDefault = pay_tags_default.find(tgf=>tgf.name==tagShow)!=null;
                        
                        fieldsBoxes.forEach(fbxs => {

                          fbxs[tg].Block({active:tagIsDefault});
                        });
                      }                     
                    }
                  }]
                }
              ]
            }
          },
          {modal:{parent:"prnt-md-detail",name:"md-detail"}},
          {
            crud:{
              parent:"md-detail",title:"transaccion",name:"cr-pay",head:false,
              ...getCrudMult({
                userData,tipe:"form",
                schemaMain:sch_pays,
                fields:[
                  {value:"date"},
                  {value:"account",state:"edit"},
                  {value:"tag",state:"edit"},
                  {value:"total",state:"edit"},
                  {value:"comment",state:"edit"},
                  {value:"income",state:"show"},
                ],
                eventEnd:({crud})=>{

                  crud.panels[0].head=false;
                  console.log(crud.loads);                  
                  crud.loads.find(ld=>ld.name=="ld-pay_tag").selects.push({
                    table:"pay_tag",
                    field:"INCOME",
                    as:"income",
                  });
                  return crud;
                }
              }),
              afterInsert:"block",
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"title",show:true,value:"transaccion"},
                    {name:"tutorial",show:true},
                    {name:"load",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                  ],
                },
                {
                  name:"new",
                  tools:[
                    {name:"title",show:true,value:"transaccion"},
                    {name:"tutorial",show:true},
                    {name:"load",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                  ],
                },
              ],
              events:[
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({field,k})=>{

                      if(field.name=="tag"){

                        var tagValue = k.bodyGet().fieldGetValues({fieldName:field.name})[0];
                        var ld_tag =  k.Loaded_GetLoadData({loadName:"ld-pay_tag"});
                        var tagData = ld_tag.result.find(rst=>rst.value==tagValue);
                        k.bodyGet().fieldSetValues({fieldName:"income",values:[tagData.income]});
                        k.Update_AddChangeField({fieldName:"income",value:tagValue,y:0});

                      }
                    }
                  }]
                },
                {
                  name:"insertBefore",
                  actions:[{
                    action:({k,inserts=[]})=>{

                      inserts.push({
                        field:"INCOME",
                        value:k.bodyGet().fieldGetValues({fieldName:"income"})[0],
                      });

                      return {inserts};
                    }
                  }]
                },
                {
                  name:"insertAftert",
                  actions:[{action:(k)=>{k.SetState({stateName:"block"});}}]
                },
              ]
            }
          },
        ],
        conections:[
          {
            event:"cnx",masterAction:"new",
            masterName:"cr-pays",
            masterSelect:"ID_PAY",
            maidName:"cr-pay",
            maidSelect:"ID_PAY",
          },
          {
            event:"cnx",masterAction:"edit",
            masterName:"cr-pays",
            masterSelect:"ID_PAY",
            maidName:"cr-pay",
            maidSelect:"ID_PAY",
          },
        ],
      }
    }
  }
}

function pageConfig_vehicles({}) {

  return {
    type:"free",
    actionsActive:true,
    actions:["see","update","insert"],
    record:{
      name:"vehicle",
      titleOne:"vehiculo",
      titleMult:"vehiculos",
    },
    script:({userData,pageData,build})=>{

      return {
        layers:[
          {
            grid:{
              parent:pageData.body,
              items:[
                {name:"prnt-main",col:12},
                {name:"prnt-md-detail",col:12},
              ]
            }
          },
          {
            crud:{
              parent:"prnt-main",title:"lista de vehiculos",
              name:"cr-vehicles",
              ...getCrudMult({
                schemaMain:sch_vehicles,
                userData,tipe:"table",
                fields:[
                  {value:"customer",fields:["name"]},
                  {value:"placa"},
                  {value:"marca"},
                  {value:"modelo"},
                  {value:"anio"},
                  {value:"color"},
                ],
              }),
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"config",show:true},
                    {name:"tutorial",show:true},
                    {name:"sizes",show:true,value:10},
                    {name:"reload",show:true},
                    {name:"new",show:true},
                    {name:"pages",show:true},
                  ],
                }
              ],
            }
          },
          {modal:{parent:"prnt-md-detail",name:"md-detail"}},
          {
            crud:{
              parent:"md-detail",title:"lista de vehiculos",
              name:"cr-vehicle",head:false,
              ...getCrudMult({
                schemaMain:sch_vehicles,
                userData,tipe:"form",
                fields:[
                  {value:"customer",state:"edit"},
                  {value:"placa",state:"edit"},
                  {value:"marca",state:"edit"},
                  {value:"modelo",state:"edit"},
                  {value:"anio",state:"edit"},
                  {value:"color",state:"edit"},
                ],
                eventEnd:({crud})=>{

                  crud.panels[0].head=false;
                  return crud;
                }
              }),
              afterUpdate:"block",afterInsert:"block",
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"title",show:true,value:"vehiculo"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                  ],
                },
                {
                  name:"new",
                  tools:[
                    {name:"title",show:true,value:"vehiculo"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                  ],
                },
              ],
            }
          },
        ],
        conections:[
          {
            event:"cnx",masterAction:"edit",
            masterName:"cr-vehicles",
            masterSelect:"ID_VEHICLE",
            maidName:"cr-vehicle",
            maidSelect:"ID_VEHICLE",
          },
          {
            event:"cnx",masterAction:"new",
            masterName:"cr-vehicles",
            masterSelect:"ID_VEHICLE",
            maidName:"cr-vehicle",
            maidSelect:"ID_VEHICLE",
          }
        ],
      }
    }
  }
}

function pageConfig_ordenWork({}) {
  
  var front = null;

  return {
    type:"free",
    actionsActive:true,
    actions:["see","update","insert"],
    record:{
      name:"checkin-vehicle",
      titleOne:"orden de trabajo",
      titleMult:"orden de trabajos",
    },
    script:({userData,pageData,build})=>{

      return {
        layers:[
          {
            grid:{
              parent:pageData.body,
              items:[
                {name:"prnt-main",col:12},
                {name:"prnt-md-detail",col:12},
                {name:"prnt-md-cus",col:12},
                {name:"prnt-md-sol",col:12},
                {name:"prnt-md-vehi",col:12},
              ]
            }
          },
          {modal:{parent:"prnt-md-detail",name:"md-detail",size:"xl"}},          
          {modal:{parent:"prnt-md-cus",name:"md-cus"}},         
          {modal:{parent:"prnt-md-sol",name:"md-sol"}},
          {modal:{parent:"prnt-md-vehi",name:"md-vehi"}},
          {
            crud:{
              parent:"prnt-main",title:"ordenes de trabajo",
              name:"cr-orders",config:{show:true},
              ...getCrudMult({
                schemaMain:sch_checkin_vehicles,
                userData,tipe:"table",
                fields:[
                  {value:"customer",fields:["name","cel"]},
                  {value:"vehicle",fields:["placa","marca","modelo"]},
                ],
              }),
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"config",show:true},
                    {name:"tutorial",show:true},
                    {name:"sizes",show:true,value:10},
                    {name:"reload",show:true},
                    {name:"new",show:true},
                    {name:"pages",show:true},
                  ],
                }
              ],
            }
          },
          {
            crud:{
              parent:"md-detail",name:"cr-order",head:false,
              ...getCrudMult({
                schemaMain:sch_checkin_vehicles,tipe:"form",
                userData,
                fields:[
                  {value:"customer",state:"edit",panel:"recep"},
                  {value:"receptor-customer",state:"edit",panel:"recep"},
                  {value:"receptor-user",state:"edit",panel:"recep"},

                  {value:"vehicle",state:"edit",panel:"info",load:{
                    name:"ld-vehicle",
                    tableMain:sch_vehicles.table,
                    selects:[
                      {table:sch_vehicles.table,field:sch_vehicles.fieldPrimary,as:"value"},
                      {sql:"CONCAT(items_vehicles.PLACA,' ',items_vehicles.MARCA) AS 'show'"},
                      {table:sch_customers.table,field:sch_customers.fieldPrimary,as:"customer-id"},
                    ],
                    joins:[
                      {
                        main:{table:sch_vehicles.table,field:"ID_CUSTOMER"},
                        join:{table:sch_customers.table,field:sch_customers.fieldPrimary},
                        tipe:"LEFT",
                      }
                    ],
                  }},
                  {value:"date_enter",state:"edit",panel:"info",col:6},
                  {value:"date-out",state:"edit",panel:"info",col:6},
                  {value:"fuel",state:"edit",panel:"info"},
                  {value:"milage",state:"edit",panel:"info"},
                  {value:"milage-prox",state:"edit",panel:"info"},
                  {value:"comment",state:"edit",panel:"info"},

                  {value:"check_1",state:"edit",panel:"check"},
                  {value:"check_2",state:"edit",panel:"check"},
                  {value:"check_3",state:"edit",panel:"check"},
                  {value:"check_4",state:"edit",panel:"check"},
                  {value:"check_5",state:"edit",panel:"check"},
                  {value:"check_6",state:"edit",panel:"check"},
                  {value:"check_7",state:"edit",panel:"check"},
                  {value:"check_8",state:"edit",panel:"check"},
                  {value:"check_9",state:"edit",panel:"check"},
                  {value:"check_10",state:"edit",panel:"check"},
                  {value:"check_11",state:"edit",panel:"check"},
                  {value:"check_12",state:"edit",panel:"check"},
                  {value:"check_13",state:"edit",panel:"check"},
                  {value:"check_14",state:"edit",panel:"check"},
                  {value:"check_15",state:"edit",panel:"check"},
                  {value:"check_16",state:"edit",panel:"check"},
                  {value:"check_17",state:"edit",panel:"check"},
                  {value:"check_18",state:"edit",panel:"check"},
                  {value:"check_19",state:"edit",panel:"check"},
                  {value:"check_20",state:"edit",panel:"check"},
                  {value:"check_21",state:"edit",panel:"check"},
                  {value:"check_22",state:"edit",panel:"check"},
                  {value:"check_23",state:"edit",panel:"check"},
                  {value:"check_24",state:"edit",panel:"check"},
                  {value:"check_25",state:"edit",panel:"check"},
                  {value:"check_26",state:"edit",panel:"check"},

                  {name:"front",type:"div",panel:"vehi"},
                  {value:"observations",state:"edit",panel:"vehi"},
                ],
                eventEnd:({crud})=>{

                  crud.selects.push({
                    table:sch_checkin_vehicles.table,
                    field:"IMG_FRONT",
                  });
                  crud.panels[0].title = "Datos del Cliente";
                  crud.panels[0].head = true;
                  var fields = crud.panels[0].fields;
                  crud.panels[0].fields = fields.filter(f=>f.panel=="recep"),

                  crud.panels.push({
                    tipe:"form",title:"Datos del Vehiculo",
                    fields:fields.filter(f=>f.panel=="info"),
                  });
                  crud.panels.push({
                    tipe:"form",title:"Inventario de Recepcion",col:4,
                    fields:fields.filter(f=>f.panel=="check"),
                  });
                  crud.panels.push({
                    tipe:"form",title:"Chasis",col:8,
                    fields:fields.filter(f=>f.panel=="vehi"),
                  });

                  sch_vehicles.fields.forEach(fveh => {
                    
                    crud.selects.push({
                      table:sch_vehicles.table,
                      field:fveh.select,
                      as:sch_vehicles.table+"-"+fveh.select,
                    });
                  });
                  
  
                  return crud;
                }
              }),
              joins:[{
                main:{table:sch_checkin_vehicles.table,field:"ID_VEHICLE"},
                join:{table:sch_vehicles.table,field:"ID_VEHICLE"},
                tipe:"LEFT",
              }],
              afterUpdate:"block",
              afterInsert:"block",
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"title",show:true,value:"orden de trabajo"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                    {name:"pdf",show:true},
                  ],
                },
                {
                  name:"new",
                  tools:[
                    {name:"title",show:true,value:"orden de trabajo"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                  ],
                },
              ],
              events:[
                {
                  name:"setStateAfter",
                  actions:[{
                    action:({k,stateName})=>{

                      if(stateName == "new"){

                        var box = k.bodyGet().fieldGetBoxes({fieldName:"front"})[0];
                        var content = box.Blocks_Get()[0];
                        content.innerHTML = "";
                        front = new EditableImage({
                          parent:content,
                          imageUrl:"../imagenes/vehiculo_4ruedas.png",
                        });

                      }

                    }
                  }]
                },
                {
                  name:"insertBefore",
                  actions:[{
                    action:({k,inserts})=>{

                      inserts.push({
                        field:"IMG_FRONT",
                        value:front.ImageGet(),
                        tipe:"values",
                      });

                      return {inserts};
                    }
                  }]
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k,result})=>{

                      var box = k.bodyGet().fieldGetBoxes({fieldName:"front"})[0];
                      var content = box.Blocks_Get()[0];                      
                      content.innerHTML = "";
                      var img = result[0]["IMG_FRONT"];
                      //console.log("load imgage:",img);

                      front = new EditableImage({
                        parent:content,
                        imageUrl:"../imagenes/vehiculo_4ruedas.png",
                      });

                      if(img!=null) front.loadImage(img);
                    }
                  }],
                },
                {
                  name:"updateBefore",
                  actions:[{
                    action:({k,conditions=[],sets=[]})=>{

                      if(conditions.length==0){

                        conditions.push({
                          table:"checkin_vehicles",
                          field:"ID_CHECKIN_VEHICLE",
                          inter:"=",
                          value:k.Reload_GetData_Primarys({})[0],
                        });
                      }

                      if(front){

                        sets.push({
                          field:"IMG_FRONT",
                          value:front.ImageGet(),
                        });
                      }

                      return {conditions, sets};
                    }
                  }],
                },
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({field,k})=>{

                      if(field.name=="vehicle"){

                        var vehiResult = k.Loaded_GetLoadData({loadName:"ld-vehicle"}).result;
                        var vehiValue = k.bodyGet().fieldGetValues({fieldName:"vehicle"})[0];
                        
                        var vehiCustomerID = null;
                        var vehiInfo = vehiResult.find(rst=>rst.value==vehiValue);
                        if(vehiInfo !=null) vehiCustomerID = vehiInfo["customer-id"];
                        k.bodyGet().fieldSetValues({fieldName:"customer",values:[vehiCustomerID]});                       

                      }

                      if(field.name=="customer"){

                        var vehiResult = k.Loaded_GetLoadData({loadName:"ld-vehicle"}).result;
                        var customerId = k.bodyGet().fieldGetValues({fieldName:"customer"})[0];
                        var vehixCustomer = vehiResult.filter(rst=>rst["customer-id"]==customerId);
                        
                        var options = vehixCustomer.length > 0 ? vehixCustomer.map(rst=>{return {value:rst.value,show:rst.show}}):[{value:"null",show:"no hay vehiculos asignados a este cliente"}];
                        
                        k.bodyGet().fieldSetOptions({fieldName:"vehicle",options});
                      }

                    }
                  }]
                },
                {
                  name:"toolUpdate",
                  actions:[{
                    action:({tool,k})=>{

                      if(tool.name=="pdf"){

                        var cr_checkin = k.group.crudGetBuild({crudName:"cr-order"});
                        var data = cr_checkin.Reload_GetData({})[0];
                        console.log("ORDER DATA",data);
                        

                        var checkInData = {
                          logo:userData.company.logo,
                          checkInNumber: data["ID_CHECKIN_VEHICLE"],
                          checkInDate: data["checkin_vehicles-DATE_ENTER"],
                          checkOutDate: data["checkin_vehicles-DATE_OUT"],
                          customerName: data["checkin_vehicles-CUSTOMER_NAME"],
                          customerId:(data["CUSTOMER_COMPANY"]=="1"?"RUC":"DNI") + " " + data["CUSTOMER_NRO"],
                          customerPhone: data["CUSTOMER_CEL"],
                          customerAddress: data["CUSTOMER_DIR"],
                          companyName: userData.company.nameReal,
                          companyRUC: userData.company.ruc,
                          companyAddress: userData.company.email,
                          companyPhone: userData.company.telf,
                          receptor:{
                            name:data["WORKER_NAME"],
                            cel:data["WORKER_CEL"],
                          },
                          vehicle: {
                              fuel: data["checkin_vehicles-FUEL"],
                              mileage: data["checkin_vehicles-MILEAGE"],
                              mileage_prox: data["checkin_vehicles-MILEAGE_PROX"],
                              plate: data["items_vehicles-PLACA"],
                              brand: data["items_vehicles-MARCA"],
                              model: data["items_vehicles-MODELO"],
                              engineNumber: data["items_vehicles-NRO_MOTO"],
                              vinNumber: data["items_vehicles-NRO_VIN"],
                              year: data["items_vehicles-ANIO"],
                              color: data["items_vehicles-COLOR"],
                          },
                          comments: data["checkin_vehicles-COMENT"],
                          observations: data["checkin_vehicles-OBSERVATIONS"],
                          items: [
                              { detail: 'Oil level', check: true, comment: 'Good condition' },
                              { detail: 'Brake fluid', check: false, comment: 'Needs replacement' },
                              { detail: 'Tire pressure', check: true, comment: 'Checked' },
                              // More items...
                          ],
                          imageUrl: front.ImageGet() // Ruta de la imagen
                        };

                        checkInData.items = [];
                        for (let num = 1; num <= 26; num++) {
                          //console.log("num",num);
                          checkInData.items.push({
                            detail:cr_checkin.bodyGet().fieldGet({fieldName:"check_"+num}).title,
                            check:data["checkin_vehicles-CHECK_"+num]=="1",
                          });
                          
                        }
                        
                        generateCheckInPDF(checkInData);
                      }
                      
                      //SavePdf();
                    }
                  }]
                }
              ],
            }
          },
          {
            crud:{
              parent:"md-cus",name:"cr-cus",head:false,
              ...getCrudMult({
                schemaMain:sch_customers,userData,tipe:"form",filters:false,
                fields:sch_customers.fields.filter(f=>f.value!="dateInsert").map(f=>{return {value:f.value,state:"edit"}}),
                eventEnd:({crud})=>{crud.panels[0].head=false; return crud;}
              }),
              afterInsert:"block",
              afterUpdate:"block",
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"title",show:true,value:"cliente"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                  ],
                },
                {
                  name:"new",
                  tools:[
                    {name:"title",show:true,value:"cliente"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                  ],
                },
              ],
            }
          },
          {
            crud:{
              parent:"md-sol",name:"cr-sol",head:false,
              ...getCrudMult({
                schemaMain:sch_customers,userData,tipe:"form",filters:false,
                fields:sch_customers.fields.filter(f=>f.value!="dateInsert").map(f=>{return {value:f.value,state:"edit"}}),
                eventEnd:({crud})=>{crud.panels[0].head=false; return crud;}
              }),
              afterInsert:"block",
              afterUpdate:"block",
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"title",show:true,value:"solicitante"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                  ],
                },
                {
                  name:"new",
                  tools:[
                    {name:"title",show:true,value:"solicitante"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                  ],
                },
              ],
            }
          },
          {
            crud:{
              parent:"md-vehi",name:"cr-vehi",head:false,
              ...getCrudMult({
                tipe:"form",schemaMain:sch_vehicles,filters:false,userData,
                fields:sch_vehicles.fields.map(f=>{return {value:f.value,state:"edit"}}),
              }),
              afterInsert:"block",
              afterUpdate:"block",
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"title",show:true,value:"vehiculo"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                  ],
                },
                {
                  name:"new",
                  tools:[
                    {name:"title",show:true,value:"vehiculo"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                  ],
                },
              ],
              events:[{
                name:"setStateAfter",
                actions:[{
                  action:({stateName,k})=>{

                    if(stateName=="new"){

                      var customer_id = build.groupGet().crudGetBuild({crudName:"cr-order"}).bodyGet().fieldGetValues({fieldName:"customer"})[0];
                      if(customer_id) k.bodyGet().fieldSetValues({fieldName:"customer",values:[customer_id]});
                    }
                  }
                }]
              }],
            }
          }
        ],
        conections:[
          {
            event:"cnx",masterAction:"edit",
            masterName:"cr-orders",
            masterSelect:"ID_CHECKIN_VEHICLE",
            maidName:"cr-order",
            maidSelect:"ID_CHECKIN_VEHICLE",
          },
          {
            event:"cnx",masterAction:"new",
            masterName:"cr-orders",
            masterSelect:"ID_CHECKIN_VEHICLE",
            maidName:"cr-order",
            maidSelect:"ID_CHECKIN_VEHICLE",
          },
          {
            event:"formForm",masterFieldName:"customer",
            masterName:"cr-order",
            masterSelect:"ID_CUSTOMER",
            maidName:"cr-cus",
            maidSelect:"ID_CUSTOMER",
          },
          {
            event:"formForm",masterFieldName:"receptor-customer",
            masterName:"cr-order",
            masterSelect:"ID_CUSTOMER_RECEPTOR",
            maidName:"cr-sol",
            maidSelect:"ID_CUSTOMER",
          },
          {
            event:"formForm",masterFieldName:"vehicle",
            masterName:"cr-order",
            masterSelect:"ID_VEHICLE",
            maidName:"cr-vehi",
            maidSelect:"ID_VEHICLE",
          },
        ],
      }
    }
  }
}

