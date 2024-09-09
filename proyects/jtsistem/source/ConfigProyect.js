
const primaryShow = true;

/* 
ideas para accesos
->que cada crud pregunte si puede Crear Reload Update Delete
->si el modulo no esta activado entonces que los subs access no funcionen

*descuento X
*asignar item
*item (veh,inm) ?
*editar cerrado de caja x
*asignar trabajador a venta x
*asignar trabajador a item x
*compras x
*usar insumos? cre que eso viene con las recetas?
*recetas x
*editar stock de los products
*editar precio de los productos
*editar unidades/etiquetas de los productos 
*produccion de items
*/

var modulos = [
    {
        value:"md-sale",
        show:"Módulo de Ventas",
        access:[
            {value:"dscto",show:"descuento"},
        ],
    },
    {
        value:"md-box",
        show:"Módulo de Caja",
        pages:["box","cashConfig"],
        access:[
            {value:"edit",show:"editar control de caja"},
        ],
    },
    {
        value:"md-customer",
        show:"Módulo de Clientes",
        access:[
            {value:"cel",show:"celular"},
            {value:"dir",show:"direccion"},
            {value:"email",show:"correo"},
            {value:"coment",show:"comentario"},
        ],
    },
    {
        value:"md-buy",
        show:"Módulo de Compras",
        pages:["buyControl","buyNew","provieeders","informFlujo"],
        access:[
        ],
    },
    {
        value:"md-items",
        show:"Módulo de Ítems",
        access:[
            {value:"sale-price",show:"asignar precio en ventas"},
            {value:"sale-add",show:"añadir/editar items en ventas"},
            {value:"stock",show:"editar stock de items",pages:["stock"]},
            {value:"config",show:"configurirar unidades/etiquetas",pages:["itemsConfig"]},
        ],
    },
    {
        value:"md-build",
        show:"Módulo de Producción",
        pages:["recipe","produccion"],
        access:[
            
        ],
    },
    {
        value:"md-bills",
        show:"Módulo de Facturación",
        pages:["bills"/*,"informAccounts"*/],
        access:[
            {value:"rucs",show:"multiples rucs"},
        ],
    },
    {
        value:"md-workers",
        show:"modulo de trabajadores",
        access:[
            {value:"sale",show:"asignar trabajador a venta"},
            {value:"item",show:"asignar trabajador a item"},
        ],
    },
    {
        value:"md-deliv",
        show:"modulo de delivery",
        access:[],
    }
];

/*var fm_customer = {
    name:"",
    title:"cliente",
    fieldsSet:[],
};*/

var pages= [
    {
        value:"recipe",
        layers:[
            {
                grid:{
                    items:[
                        {name:"gr1",col:12},
                        {name:"gr-modal",col:12},
                    ],
                }
            },
            {
                modal:{
                    size:"xl",
                    parent:"gr-modal",
                    name:"md-one",
                },
            },
            {
                grid:{
                    parent:"md-one",
                    items:[
                        {name:"gr2",col:12},
                        {name:"gr3",col:12},
                    ],
                }
            }
        ],
        cruds:[
            {
                parent:"gr1",
                title:"lista de recetas",
                name:"tb-items",
                schema:sch_items,
                panelTipe:"table",
                fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"tipe",state:"show",filter:{value:[op_products_tipe[2].show]}},
                    {value:"tag",state:"show"},
                    {value:"unid",state:"show"},
                    {value:"active",state:"show",filter:{value:[op_active[1].show]}},
                ],
                conections:[
                    {main:{event:"edit",select:"ID_PRODUCT"},join:{crud:"md-item",select:"ID_PRODUCT"}},
                ],
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"sizes",show:true,value:10},
                            {name:"reload",show:true},
                            {name:"pages",show:true},
                        ],
                    }
                ],
            },
            {
                parent:"gr2",
                title:"receta",
                modal:"md-one",
                name:"md-item",
                schema:sch_items,
                panelTipe:"form",
                fieldsSet:[
                    {value:"name",state:"show",col:8,label:2},
                    {value:"cantRecipe",state:"edit",col:2,label:2},
                    {value:"unid",state:"show",col:2,label:2},
                ],
                conections:[
                    {main:{event:"reload",select:"ID_PRODUCT"},join:{crud:"md-insumos",select:"ID_PRODUCT"}},
                ],
                stateStart:"block",
                afterCancel:"block",
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"sizes",value:1,show:false},
                            {name:"reload",show:true},
                            {name:"cancel",show:true},
                            {name:"update",show:true},
                            {name:"question",show:false},
                            {name:"load",show:false},
                        ],
                    }
                ],
            },
            {
                parent:"gr3",
                title:"lista de insumos",
                name:"md-insumos",h:350,
                schema:sch_recipe_inputs,
                delete:true,
                fieldsSet:[
                    {value:"supplie",state:"edit",width:300},
                    {value:"cant",state:"edit",width:70},
                ],
                stateStart:"block",
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"sizes",value:999,show:false},
                            {name:"reload",show:false},
                            {name:"new",show:true},
                            {name:"question",show:false},
                            {name:"load",show:false},
                        ],
                    },
                    {
                        name:"new",
                        tools:[
                            {name:"insert",show:true},
                            {name:"cancel",show:true},
                            {name:"question",show:false},
                            {name:"load",show:false},
                        ],
                    }
                ],
            }
        ],
    },
    {
        value:"produccion",
        layers:[
            {
                grid:{
                    items:[
                        //{name:"btn-add-product",box:{tipe:5,value:"añadir nuevo producto",class:"btn btn-primary btn-sm"},tipe:0},
                        {name:"gr-main",col:12},
                        {name:"gr-modal",col:12},
                    ],
                }
            },
            {
                modal:{
                    size:"xl",
                    parent:"gr-modal",
                    name:"md-main",
                },
            },
            {
                grid:{
                    parent:"md-main",
                    items:[
                        {name:"stp-edit",title:"editar",col:8},
                        {name:"stp-recipe",title:"receta",col:4},
                    ],
                }
            },
            {
                grid:{
                    parent:"stp-edit",
                    items:[
                        {name:"gr1",col:12},
                        {name:"gr2",col:12},
                    ],
                }
            },
            {
                grid:{
                    parent:"stp-recipe",
                    items:[
                        {name:"gr-recipe-1",col:12},
                        {name:"gr-recipe-2",col:12},
                    ],
                }
            },
        ],
        cruds:[
            {
                parent:"gr-main",
                title:"lista de odenes de produccion",
                schema:sch_produccion,
                fieldsSet:[
                    {value:"dateEmmit",state:"show"},
                    {value:"productResult",state:"show"},
                    {value:"cantResult",state:"show"},
                ],
                panelTipe:"table",
                //delete:true,
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"reload",show:true},
                            {name:"sizes",show:true,value:10},
                            {name:"pages",show:true},
                            {name:"new",show:true},
                        ],
                    }
                ],
                conections:[
                    {main:{event:"edit",select:"ID_PRODUCCION"},join:{crud:"fm-orden",select:"ID_PRODUCCION"}},
                ],
            },
            {
                parent:"gr1",modal:"md-main",
                name:"fm-orden",
                title:"orden de produccion",
                schema:sch_produccion,
                fieldsSet:[
                    {value:"dateEmmit",state:"edit"},
                    {value:"productResult",state:"edit",label:2,col:10},
                    {value:"cantResult",state:"edit",label:2,col:2},
                ],
                conections:[
                    {main:{event:"reload",select:"ID_PRODUCCION"},join:{crud:"tb-inputs",select:"ID_PRODUCCION"}},
                    {main:{event:"reload",select:"ID_PRODUCT"},join:{crud:"fm-recipe",select:"ID_PRODUCT"}},
                    //{main:{event:"block"},join:{crud:"tb-inputs",event:"block"}},
                ],
                panelTipe:"form",
                stateStart:"block",
                afterCancel:"block",
                afterUpdate:"block",
                afterDelete:"block",
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"reload",show:true},
                            {name:"cancel",show:true},
                            {name:"update",show:true},
                            {name:"delete",show:true},
                            {name:"load",show:false},
                            {name:"question",show:false},
                        ],
                    },
                    {
                        name:"new",
                        tools:[
                            {name:"insert",show:true},
                            {name:"cancel",show:true},
                            {name:"load",show:false},
                            {name:"question",show:false},
                        ],
                    }
                ],
            },
            {
                parent:"gr2",title:"lista de productos/insumos",
                name:"tb-inputs",h:350,
                schema:sch_produccion_inputs,
                fieldsSet:[
                    {value:"input",state:"edit"},
                    {value:"cant",state:"edit"},
                ],
                delete:true,
                stateStart:"block",
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"reload",show:false},
                            {name:"sizes",show:false,value:999},
                            {name:"new",show:true},
                            {name:"load",show:false},
                            {name:"question",show:false},
                        ],
                    },
                    {
                        name:"new",
                        tools:[
                            {name:"insert",show:true},
                            {name:"cancel",show:true},
                            {name:"load",show:false},
                            {name:"question",show:false},
                        ],
                    }
                ],
            },
            {
                parent:"gr-recipe-1",title:"receta",
                name:"fm-recipe",panelTipe:"table",
                schema:sch_items,
                fieldsSet:[],
                tableMain:sch_items.table,
                selects:[
                    {table:sch_items.table,field:"ID_PRODUCT",primary:true},
                    {sql:("CONCAT("+sch_items.table+".NAME,' X ',"+sch_items.table+".RECIPE_CANT,'(',unids.SIMBOL,')') AS 'supplie'")},
                ],
                joins:[
                    {
                        main:{table:sch_items.table,field:"UNID_ID"},
                        join:{table:"unids",field:"ID_UNID"},
                        tipe:"LEFT",
                    }
                ],
                conections:[
                    {main:{event:"reload",select:"ID_PRODUCT"},join:{select:"ID_PRODUCT",crud:"tb-recipe-inputs"}},
                ],
                stateStart:"block",
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"load",show:false},
                            {name:"question",show:false},
                        ],
                    }
                ],
                panels:[
                    {
                        tipe:"table",
                        fields:[
                            {name:"producto de receta",select:"supplie",box:{...bx_shw}},
                        ],
                    }
                ],
            },
            {
                parent:"gr-recipe-2",title:"lista de insumos",head:false,
                name:"tb-recipe-inputs",//modal:"md-main",
                schema:sch_recipe_inputs,panelTipe:"table",
                fieldsSet:[],

                tableMain:sch_recipe_inputs.table,
                selects:[
                    {table:sch_recipe_inputs.table,field:"ID_RECIPE_INPUT",primary:true},
                    {sql:("CONCAT("+sch_items.table+".NAME,' X ',"+sch_recipe_inputs.table+".CANT,'(',unids.SIMBOL,')') AS 'supplie'")},
                ],
                joins:[
                    {
                        main:{table:sch_recipe_inputs.table,field:"ID_INPUT"},
                        join:{table:sch_items.table,field:sch_items.fieldPrimary},
                        tipe:"LEFT",
                    },
                    {
                        main:{table:sch_items.table,field:"UNID_ID"},
                        join:{table:"unids",field:"ID_UNID"},
                        tipe:"LEFT",
                    }
                ],
                panels:[
                    {
                        tipe:"table",
                        fields:[
                            {name:"producto/insumo receta",select:"supplie",box:{...bx_shw}},
                        ],
                    }
                ],
                stateStart:"block",
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"sizes",value:999,show:false},
                            {name:"load",show:false},
                            {name:"question",show:false},
                        ],
                    },
                ],
                events:[
                    {
                        name:"printBefore",
                        actions:[{
                            action:({result})=>{

                                result.forEach(rst => {
                                    
                                    var id_input = rst["ID_INPUT"];
                                });

                                return {data:result};
                            }
                        }]
                    }
                ],
            },
        ],
    },
    {
        value:"customers",
        layers:[
            {
                grid:{
                    items:[
                        {name:"gr-main",col:12},
                    ],
                }
            }
        ],
        cruds:[
            {
                parent:"gr-main",
                title:"lista de clientes",
                schema:sch_customers,
                fieldsSet:[
                    {value:"name",state:"edit"},
                    {value:"company",state:"edit"},
                    {value:"nroDoc",state:"edit"},
                    {value:"cel",state:"edit"},
                    {value:"dir",state:"edit"},
                    {value:"email",state:"edit"},
                    {value:"comment",state:"edit"},
                ],
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"reload",show:true},
                            {name:"new",show:true},
                            {name:"sizes",show:true,value:10},
                            {name:"pages",show:true},
                        ],
                    },
                    {
                        name:"new",
                        tools:[
                            {name:"insert",show:true},
                            {name:"cancel",show:true},
                        ],
                    },
                ],
            }
        ],
    },
    {
        value:"prices",
        layers:[
            {
                grid:{
                    items:[
                        {name:"main",col:12},
                    ]
                }
            }
        ],
        cruds:[
            {
                parent:"main",
                title:"lista de precios",
                schema:sch_items,
                fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"tipe",state:"show"},
                    {value:"tag",state:"show"},
                    {value:"price",state:"edit"},
                    {value:"costUnit",state:"edit"},
                    {value:"active",state:"show"},
                ],
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"reload",show:true},
                            {name:"sizes",show:true,value:10},
                            {name:"pages",show:true},
                        ]
                    }
                ],
            }
        ]
    },
    {
        value:"stock",
        layers:[
            {
                grid:{
                    items:[
                        {name:"main",col:12},
                    ]
                }
            }
        ],
        cruds:[
            {
                parent:"main",
                title:"stock de items",
                schema:sch_items,
                fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"tipe",state:"show"},
                    {value:"tag",state:"show"},
                    {value:"unid",state:"show"},
                    {value:"stock",state:"edit"},
                    {value:"limit",state:"edit"},                    
                    {value:"limitOn",state:"show"},
                    {value:"active",state:"show"},
                ],
                statetools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"reload",show:true},
                            {name:"sizes",show:true,value:10},
                            {name:"pages",show:true},
                        ]
                    }
                ],
            }
        ]
    },
    {
        ...salenew2_page,
    },
];

//---------set------------

modulos.forEach(md => {
   
    md.access.forEach(acc => {
        
        acc.value = md.value + "-" + acc.value;
    });
});

var op_modulos = modulos.map(md=>{return {value:md.value,show:md.show}});
var op_access = [];
modulos.forEach(md => {
    
    op_access.push({
        value:md.value+"-general",
        show:md.show,
    });

    md.access.forEach(acc => {
        
        op_access.push({
            value:acc.value,
            show:acc.show,
        });
    });
});

//console.log("----acces lits:",op_access);


function Access_Get(accessList,accessValue) {
    
    var arrayValue = accessValue.split("-");
    if(accessValue && arrayValue.length >= 3){

        var valueGeneral = arrayValue[0]+"-"+arrayValue[1]+"-general";
        var accGeneral = accessList.find(acc=>acc.value==valueGeneral);
        //console.log("......acess get","valueGeneral:",valueGeneral,"accGeneral:",accGeneral);
        
        if(!accGeneral || accGeneral.active != "true") return false;
    }

    var acc = accessList.find(acc=>acc.value==accessValue);
    var active = acc != null && acc.active == "true";
    //if(accessValue=="md-buy-all") console.log("get access: " + accessValue,acc,active,accessList);
    return active;
}

function PageActiveByAccess({accessList,pageName}){

    var access = false;
    modulos.forEach(md => {

        //if(pageName=="stock") console.log("----------------asdnajisndjnasdas stock:");
        

        if(md.pages && md.pages.find(pg=>pg==pageName)){

            access = Access_Get(accessList, md.value+"-general");            
        }

        if(!access){ 
            
            if(pageName=="stock") console.log("-------!!!!! pageNAME is no access in  stock go by access in modulo");
            

            md.access.forEach(acc => {
                
                if(pageName=="stock" && acc.value=="md-items-stock") console.log("----no access pagename:",pageName,acc);
                
                if(acc.pages && acc.pages.find(pg=>pg==pageName)){

                    access = Access_Get(accessList, acc.value);
                    if(acc.value == "md-items-stock") console.log("-------------.!!!!!",acc.pages,"access:",access);
                }
            });
        }else if(pageName=="stock") console.log("-------!!!!! pageNAME is yes access in  stock go by access in modulo", md);
    });

    return access;

}

//--------


self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('mi-app-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/Index.html',
        ]);
      })
    );
});
  
self.addEventListener('fetch', function(event) {
event.respondWith(
    caches.match(event.request).then(function(response) {
    return response || fetch(event.request);
    })
);
});
  
  