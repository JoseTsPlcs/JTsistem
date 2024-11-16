
const primaryShow = false;
const ambient = 'dev';
const test = true;
const testNew = true;

const testNewSetAddItem = false;
const testNewSetAddItemValue = false;

const testPay = false;
const testPaySet = false;
const testAccess = false;

var modulos = [
    {
        value:"md-sale",
        show:"Módulo de Ventas",
        access:[
            {value:"dscto",show:"descuento"},
            {value:"day",show:"ventas del día"},
        ],
        recordName:"venta",
    },
    {
        value:"md-box",
        show:"Módulo de Caja",
        recordName:"caja",
        pages:["box","cashConfig"],
        access:[
            {value:"edit",show:"editar control de caja"},
        ],
    },
    {
        value:"md-customer",
        recordName:"cliente",
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
        recordName:"item",
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
        recordName:"produccion",
        show:"Módulo de Producción",
        pages:["recipe","produccion"],
        access:[
            
        ],
    },
    {
        value:"md-bills",
        recordName:"factura",
        show:"Módulo de Facturación",
        pages:["bills"/*,"informAccounts"*/],
        access:[
            {value:"rucs",show:"multiples rucs"},
        ],
    },
    {
        value:"md-workers",
        recordName:"trabajador",
        show:"modulo de trabajadores",
        access:[
            {value:"sale",show:"asignar trabajador a venta"},
            {value:"item",show:"asignar trabajador a item"},
        ],
    },
    {
        value:"md-deliv",
        recordName:"delivery",
        show:"modulo de delivery",
        access:[],
    },
    {
        value:"md-vehicle",
        recordName:"vehiculo",
        show:"modulo de taller",
        access:[],
    },
    {
        value:"property",
        recordName:"inmbueble",
        show:"modulo de inmuebles",
        access:[],
    }
];

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

function moduloGet({moduloName}) {
    
    return modulos.find(md=>md.value==moduloName);
}

//access

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

        if(md.pages && md.pages.find(pg=>pg==pageName)){

            access = Access_Get(accessList, md.value+"-general");            
        }

        if(!access){ 

            md.access.forEach(acc => {
                
                if(acc.pages && acc.pages.find(pg=>pg==pageName)){

                    access = Access_Get(accessList, acc.value);
                }
            });
        }
    });

    return access;

}

//app

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('mi-app-cache').then(function(cache) {
        return cache.addAll([
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
  

//tutorial

var tutorialsData = [];

var items = [
    {
        value:"sale",access:true,
        recordName:"venta",
        pages:[
            {name:"saleNew2",actions:["insert"]},
            {name:"salesCotizacion",actions:["edit","search"]},
            {name:"informSales",actions:["inform"]},
        ],
    },
    {
        value:"customer",access:true,
        recordName:"cliente",
        pages:[
            {name:"customers",actions:["insert","edit","search"]},
            {name:"informCustomers",actions:["inform"]},
        ],
        schema:sch_customers,
    },
    {
        value:"box",access:"md-box-general",
        recordName:"control de caja",
        pages:[
            {name:"box",actions:["insert","edit","search"]},
        ],
    },
    {
        value:"account",access:"md-box-general",
        recordName:"cuenta/caja",
        pages:[
            {name:"cashConfig",actions:["insert","edit","search"]},
        ],
    },
    {
        value:"pay-tag",access:"md-box-general",
        recordName:"etiqueta de transacciones",
        pages:[
            {name:"cashConfig",actions:["insert","edit","search"]},
        ],
    },
    {
        value:"buy",access:"md-buy-general",
        recordName:"compra",
        pages:[
            {name:"buyControl",actions:["edit","search"]},
            {name:"buyNew",actions:["insert"]},
        ],
    },
    {
        value:"provideer",access:"md-buy-general",
        recordName:"proveedor",
        pages:[
            {name:"provieeders",actions:["insert","edit","search"]},
        ],
    },
    {
        value:"item",access:true,
        recordName:"producto/servicio",
        pages:[
            {name:"items",actions:["insert","edit","search"]},
            {name:"informProducts",actions:["inform"]},
        ],
    },
    {
        value:"item-tag",access:true,
        recordName:"etiqueta de item",
        pages:[
            {name:"itemsConfig",actions:["insert","edit","search"]},
        ],
    },
    {
        value:"unid",access:true,
        recordName:"producto/servicio",
        pages:[
            {name:"itemsConfig",actions:["insert","edit","search"]},
        ],
    },
    {
        value:"vehicles",access:false,
        recordName:"vehiculo",
        pages:[
            {name:"vehicles",actions:["insert","edit","search"]},
        ],
        schema:sch_vehicles,
    },
    {
        value:"checkin-vehicle",access:false,
        recordName:"orden de trabajo",
        pages:[
            {name:"orders",actions:["insert","edit","search"]},
        ],
        schema:sch_checkin_vehicles,
    }
];

items.filter(itm=>itm.pages&&itm.pages.length>0).forEach(itm => {
    
    [{value:"insert"},{value:"search"},{value:"edit"},{value:"inform"}].forEach(act => {
        
        var actxtutorial = [
            {action:"insert",show:"¿como ingresar [registro]?",value:"insert"},
            {action:"search",show:"¿como busco un [registro]?",value:"search"},
            {action:"edit",show:"¿como actualizo un [registro]?",value:"edit"},
            {action:"inform",show:"¿como veo el informe de [registro]s?",value:"search"},
        ];
        var tutorial = actxtutorial.find(t=>t.action==act.value);
        var page = null;
        itm.pages.forEach(pg => {
            
            if(pg.actions.find(pgAct=>pgAct==act.value))page = pg;
        });
        //console.log(act,page,tutorial);

        if(page && tutorial){
            
            tutorialsData.push({
                value:itm.value+"-"+act.value,
                name:tutorial.show.replace("[registro]",itm.recordName),
                page:page.name,access:itm.access,
                crud:(page.crud?page.crud:"cr-" + itm.value + (page.actions.find(pgAct=>pgAct=="insert")&&page.actions.length==1?"":"s")),
                PlayTutorial:tutorial.value,
            });            
        }
    });
});


//-----

function AddTutorial({itemValue,recordName,value,page,crud}) {    

    var tutorialActions = [
        {value:"insert",show:"¿como ingreso un [registro]?",tutorial:"insert"},
        {value:"edit",show:"¿como modifico un [registro]?",tutorial:"send"},
        {value:"search",show:"¿como busco un [registro]?",tutorial:"search"},
        {value:"inform",show:"¿como veo el informe de [registro]s?",tutorial:"search"},
    ];

    var tutAct = tutorialActions.find(act=>act.value==value);
    if(tutAct){
        
        tutorialsData.push({
            value:itemValue+"-"+tutAct.value,
            name:tutAct.show.replace("[registro]",recordName),
            page,
            crud,
            PlayTutorial:tutAct.tutorial,
        });
    }else console.log("no found tutorialAction, value:",value,"actions:",tutorialActions);
    
}

function PlayTutorial({tutorialValue,nav}) {

    var tutorialInfo = tutorialsData.find(t=>t.value==tutorialValue);
    console.log("play tutorial value:",tutorialValue,tutorialInfo);

    if(tutorialInfo != null){

        if(tutorialValue=="nav-see"){

            PlayTutorialNav({nav});
        }
        else
        {
            PlayTutorialMenu({
                nav,
                pageName:tutorialInfo.page,
                send:{
                    tutorialInfo,
                }
            });
        }

        
    }
    else
    {
        alert('no existe tutorial [value:'+tutorialValue+']');
        console.log("no exist tutorial: " + tutorialValue + " list:",tutorialsData);
           
    }
}

function PlayTutorialNav({nav}) {

    var elementsInfo = [];

    elementsInfo.push({
        id:"menuIcon",
        descripcion:"Permite mostrar u ocultar la barra de navegación, donde se puede acceder a distintos módulos del sistema.",
        eventNext:({element})=>{
  
          nav.NavSet({open:true});
        }
    });

    PagesData.filter(pg=>pg.dom!=null).forEach(secc => {
        
        elementsInfo.push({
            id:"seccion-"+secc.seccion,
            descripcion:(secc.descripcion?secc.descripcion:"seccion [title]").replace("[title]",secc.seccion),
        });
    });

    elementsInfo.push({
        id:"secc-tutorial",
        descripcion:"Acceso a la página de tutoriales donde los usuarios pueden aprender a utilizar diferentes funciones del sistema, con guías paso a paso.",
    });

    elementsInfo.push({
        id:"secc-logOut",
        descripcion:" Opción para cerrar sesión y salir del sistema de manera segura.",
    });

    PagesData.forEach(secc=>{

        for (let scc = 0; scc < secc.paginas.length; scc++) {
            const pg = secc.paginas[scc];
            elementsInfo.push({
                id:"page-"+pg.name,
                descripcion:(pg.descripcion?pg.descripcion:"pagina [title]").replace("[title]",pg.title),
                action:()=>{

                    nav.NavSetSeccion({seccData:secc,open:true});
                },
            });
        }
    })
    
    var tutNav = new Tutorial({elementsInfo});
    tutNav.startTutorial();
}

function PlayTutorialMenu({nav,pageName,send=null}) {
        
    console.log("play tutorial menu",nav);
    
    nav.tutorialPlay({pageName,send});

    return;
    var elementsInfo = [];

    console.log(document.getElementById("menuIcon"));
    

    //menu icon,
    elementsInfo.push({
      id:"menuIcon",
      descripcion:"selecciona el icono para mostrar el menu de navegación",
      name:"icon",
      eventNext:({element})=>{
        
        if(nav.opened==false) element.click();
      },
    });

    //open seccion
    var seccData = SeccDataFind({pageName});
    elementsInfo.push({
      id:seccData.dom.id,
      descripcion:"selecciona la seccion " + seccData.title,
      eventNext:({element})=>{

        if(seccData.open == false) element.click();
      },
    });
    
    //go to page
    var pageData = PageDataFind({pageName});
    elementsInfo.push({
      id:pageData.dom.id,
      descripcion:"seleccion la pagina " + pageData.title,
      eventNext:({element})=>{

        PageGoto({pageName,send});
        /*element.click()*/
      },
    });

    var menuTut = new Tutorial({
      elementsInfo,
    });
    menuTut.startTutorial();


}

function PlayTutorialInPage({group,crudName,pageData}) {
    
    if(pageData.recive!=null){

        var tutorialInfo = pageData.recive.tutorialInfo;
        if(tutorialInfo){
            
            var crud = group.crudGetBuild({crudName});
            if(crud){

                setTimeout(()=>{

                    var tutorialsFilter = crud.tutorialsGet().filter(t=>((t.eventActive!=null&&t.eventActive())||t.active==true) && t.value.includes(tutorialInfo.PlayTutorial));
                    if(tutorialsFilter.length==0)return;
                    var tutplay = tutorialsFilter[0].value;

                    console.log("play tutorial in page",tutorialInfo);
                    
                
                    if(tutorialInfo.PlayTutorial!=null) crud.tutorialPlay({value:tutplay});
    
                    if(tutorialInfo.tutorial!=null){
    
                        var elementsInfo = [];
    
                        if(tutorialInfo.tutorial){
    
                            tutorialInfo.tutorial.fields.forEach(f => {
                                
                                var field = crud.bodyGet().fieldGet({fieldName:f.name});
                                console.log("field:",field);
                                
                                var panel = crud.bodyGet().panelGet({panelName:field.panel.name});
                                console.log("panel",panel);
                                
                                var dom = panel.build.fieldGetDomTutorial({fieldName:f.name});
                                elementsInfo.push({
                                    id:dom.id,
                                    descripcion:(f.descripcion?f.descripcion:field.descripcion),
                                });
                            });
                        }
    
                        var tut = new Tutorial({
                            elementsInfo,
                        });
                        tut.startTutorial();
                    }
    
                },800);
            }
            
        }
        
    }

}

function TutorialGetElementInfoByActions({actions,k}) {
    
    var elementsInfo = [];

    /*var actions=[
        {fieldName:"name",value:"delivery a [zona]",descripcion:"ingresa el nombre de la zona del delivery"},
        {fieldName:"tipe",value:1,descripcion:"selecciona servicio"},
        {fieldName:"tag",valueSearch:"delivery",descripcion:"selecciona como etiqueta: delivery"},
        {fieldName:"price",value:1,descripcion:"ingresa el precio del delivery"},
        {toolName:"update"},
        {toolName:"new"},
    ];*/

    actions.forEach(act => {
       
        if(act.fieldName){

            var elementInfo = k.bodyGet().fieldGetElementTutorial({fieldName:act.fieldName});
            var box = k.bodyGet().fieldGetBoxes({fieldName:act.fieldName})[0];

            if(act.descripcion != null) elementInfo.descripcion = act.descripcion;
            elementInfo.action = ({})=>{

                if(act.value) k.bodyGet().fieldSetValues({fieldName:act.fieldName,values:[act.value]});
                if(act.valueSearch){

                    var findOption = box.optionsGet().find(op=>op.show==act.valueSearch);
                    if(findOption!=null) box.SetValue(findOption.value);
                    else console.log("erro no found value:",act.valueSearch," in field:",act.fieldName);
                }
            };
            elementInfo.eventNext=()=>{

                if(act.click==true){

                    console.log("field box",box);
                    
                    box.Blocks_Get()[0].click();
                    if(act.action!=null)act.action();
                }
            }

            elementsInfo.push(elementInfo);
        }

        if(act.toolName||act.filterToolName){

            var tool = k.bodyGet().toolGet({toolName:act.toolName});
            var toolElement = k.bodyGet().toolGetBox({toolName:act.toolName}).Blocks_Get()[0]; 

            if(tool.show){

                var elementInfo = k.bodyGet().toolGetElementTutorial({toolName:act.toolName});
                elementInfo.eventNext=({})=>{

                    if(act.click==true) toolElement.click();
                    if(act.action!=null) act.action();
                }
                elementsInfo.push(elementInfo);
            }
            
        }

        if(act.filterName && act.value){

            var box = k.bodyGet().configGetWindowFilters().Filter_GetBox({filterName:act.filterName});
            var dom = (box.tipeGet()==4 ? box.parentGet():box.Blocks_Get()[0]);
            var option = box.optionsGet().find(op=>op.value==act.value);

            var elementInfo = {
                id:dom.id,
                descripcion:"en "+act.filterName+" selecciona " + option.show,
                action:({})=>{

                    if(box.tipeGet()!=4) box.SetValue(option.value);
                    else box.SetValue([option.show]);
                }
            };

            elementsInfo.push(elementInfo);
        }

        
        
    });

    return elementsInfo;
}  

function TutorialDescripcionAction({boxTipe=0}) {
    var dsc = "";

    switch (boxTipe) {
        case 0:
            dsc += "se muestra";
        break;

        case 1:
            dsc += "ingresa";
        break;

        case 9:
            dsc += "ingresa";
        break;

        case 5:
            dsc += "presiona";
        break;
    
        default:
            dsc += "selecciona";
        break;
    }

    return dsc;
}

function TutorialDescripcion({boxTipe=0,descripcion,action,fieldName="",recordName="[registro]"}) {
    
    var dsc = TutorialDescripcionAction({boxTipe});

    dsc += " " + fieldName;

    if(descripcion && descripcion!=""){

        if(fieldName!="") dsc += ", ";

        dsc+= descripcion.replace("[registro]",recordName);
    }

    return dsc;
}


//--------concepts-------

var script_items = {
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
            events:[{
                name:"tutorialInsertEnd",
                actions:[{
                    action:({k})=>{

                        k.tutorialPlay({value:"edit"});
                    }
                }]
            }]
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
                
                var cr_item = k.group.crudGetBuild({crudName:"cr-item"});
                console.log(cr_item);
                
                var recipeShow = cr_item.CallEvent({name:"recipeShowGet"});
                var cr_recipe = k.group.crudGetBuild({crudName:"cr-recipe-inputs"});
                cr_recipe.tutorialSetBlock({block:!recipeShow});
                }
            }]
            },
            {
            name:"updateAfter",
            actions:[{
                action:({k})=>{

                k.group.crudGetBuild({crudName:"cr-items"}).SetState({stateName:"reload"});
                }
            }]
            }
        ],
        }),
    }
    ],    
}

var concepts = [
    {
        name:"taller",title:"taller",icon:'<i class="bi bi-wrench-adjustable"></i>',
        descripcion:'',
        pages:[
            {
                name:"orderWork",title:"ordenes de trabajos",actions:["see","insert","update","search"],
                record:{title:"orden de trabajo",titleMult:"ordenes de trabajos"},
                descripcion:" ",access:"md-vehicle-general",
                buildPageConfig:{
                    ...pageBuildConfig_ordenWork({}),
                }
            },
            {
                name:"vehicles",title:"vehiculos",actions:["see","insert","update","search"],
                record:{title:"vehiculo",titleMult:"vehiculos"},access:"md-vehicle-general",
                descripcion:" ",
                buildPageConfig:{
                    ...pageBuildConfig_vehicles({}),
                }
            },
        ],
    },
    {
        name:"sale",title:"venta",icon:'<i class="bi bi-shop"></i>',
        descripcion:`Acceso al módulo para gestionar ventas, donde se pueden registrar nuevas ventas, modificar existentes y consultar el historial.`,
        pages:[
            {
<<<<<<< HEAD
                name:"sale-new",title:"venta nueva",
                actions:["insert"],
                record:{title:"venta nueva",titleMult:"ventas nuevas"},
                attributeTitle:"nueva",
                descripcion:"Página donde se puede registrar una nueva venta. Permite seleccionar los productos o servicios, ingresar detalles del cliente, aplicar descuentos, y definir el método de pago.",
                buildPageConfig:{
                    type:"new",
                    schema:sch_sales,
                    mainModVisual:{
                        fields:[
                            {value:"emmit",state:"edit"},
                            {value:"status",state:"edit"},
                            {value:"pay",state:"edit"},
                            {value:"customer",state:"edit"},
                            {value:"doc",state:"edit"},
                            {value:"comment",state:"edit"},
                            {value:"worker",state:"edit"},
                            {value:"deliv",state:"edit"},
                            {value:"deliv-zone",state:"edit"},
                            {value:"deliv-dir",state:"edit"},
                        ],
                    },
                    mainTotalVisual:{
                        fields:[
                            {value:"totaldscto",state:"show"},
                            {value:"deliv-cost",state:"edit"},
                            {value:"dscto",state:"edit"},
                            {value:"total",state:"show"},
                        ],
                    },
                    objectInfo:{
                        schema:sch_vehicles,
                        name:"vehicle",title:"vehiculo",
                        load:{
                            tableMain:sch_vehicles.table,
                            selects:[
                                {table:sch_vehicles.table,field:sch_vehicles.fieldPrimary,as:"value"},
                                {table:sch_vehicles.table,field:"PLACA",as:"show"},
                            ],
                        }
                    },

                    schemaItems:sch_sales_products,
                    schemaPays:sch_sales_pays,
                    payTag:"venta",
                    itemFieldTotal:"priceTotal",
                    mainFieldTotal:"total",
                    mainFieldDscto:"dscto",
                    mainFieldTotalDscto:"totaldscto",
                    mainFieldPay:"pay",
                },
=======
                ...pgConfig_SaleNew({}),
>>>>>>> 1d1f62f (testing new state)
            },
            {
                ...pgConfig_SaleControl({
                    name:"sale-day",
                    title:"ventas del día",actions:["see","search","update"],
                    record:{title:"venta diaria",titleMult:"ventas diarias"},
                    access:"md-sale-day",
                    descripcion:"Muestra un resumen de todas las ventas realizadas durante el día. Permite consultar los detalles de cada venta y realizar ajustes si es necesario.",
                    filters:[
                        {name:"status",value:op_sales_status.filter(op=>op.value!=5).map(op=>{return op.show;})},
                        {name:"emmit-min",value:Date_Today(0)},
                        {name:"emmit-max",value:Date_Today(0)},
                    ],
                }),
            },
            {
                ...pgConfig_SaleControl({
                    name:"sale-control",
                    title:"ventas en proceso",actions:["see"],attribute:"day",
                    record:{title:"venta en proceso",titleMult:"ventas en proceso"},
                    descripcion:"Página para gestionar las ventas que aún no han sido finalizadas o que están pendientes de algún paso, como la confirmación de pago o la entrega de productos.",
                    filters:[
                        {name:"status",value:op_sales_status.filter(op=>op.value!=5&&op.value!=4).map(op=>{return op.show;})},
                    ],
                }),
            },
            {
                ...pgConfig_SaleControl({
                    name:"sale-pay",title:"ventas por cobrar",actions:["see"],attribute:"pay",
                    record:{title:"venta en proceso",titleMult:"ventas en proceso"},
                    descripcion:"Página para gestionar las ventas que aún no han sido finalizadas o que están pendientes de algún paso, como la confirmación de pago o la entrega de productos.",
                    filters:[
                        {name:"status",value:op_sales_status.filter(op=>op.value!=5).map(op=>{return op.show;})},
                        {name:"pay",value:op_sales_paid.find(op=>op.value==0).show},
                        {name:"emmit",filter:false},
                    ]
                }),
              },
            {
                ...pgConfig_Bills({}),
            },
        ],
    },
    {
        name:"box",title:"caja",icon:'<i class="bi bi-plus-circle"></i>',
        descripcion:"Permite administrar la caja diaria, realizar aperturas y cierres de caja, registrar ingresos y egresos, y revisar movimientos.",
        pages:[
            {
                ...pgConfig_Box({}),
            },
        ],
    },
    {
        name:"deliv",title:"delivery",icon:'<i class="bi bi-truck"></i>',
        descripcion:"Modulo de delivery, asignar zonas de delivery, precios y reporte de deliverys.",
        pages:[
            {
                name:"zone",title:"zonas de entrega",
                descripcion:"Zonas donde se pueden realizar entregas",
                buildPageConfig:{
                    ...pageCofig_zones({}),
                },
            },
            {
                name:"deliverys",title:"deliverys",
                descripcion:"Reporte de deliverys entregados, en proceso o pendientes",
                buildPageConfig:{
                    ...pageCofig_deliverys({}),
                },
            }
        ],
    },
    {
        name:"buy",title:"compra",icon:'<i class="bi bi-cart"></i>',
        descripcion:"Sección para gestionar las compras realizadas, incluyendo el registro de nuevas compras, modificaciones y revisiones del historial.",
        pages:[
            {
                name:"buy-new",title:"compra nueva",actions:["insert"],access:"md-buy-general",
                descripcion:"Sección para registrar una nueva compra, permitiendo seleccionar los productos adquiridos, el proveedor, la cantidad y el precio, además de gestionar los métodos de pago.",
                record:{title:"compra nueva",titleMult:"compras nuevas"},
                buildPageConfig:{
                    type:"new",
                    schema:sch_buys,
                    mainModVisual:{
                        fields:[
                            {value:"date",state:"edit"},
                            {value:"state",state:"edit"},
                            {value:"provideer",state:"edit"},
                        ],
                    },
                    mainTotalVisual:{
                        fields:[
                            {value:"total",state:"show"},
                        ],
                    },

                    schemaItems:sch_buys_products,
                    schemaPays:sch_buys_payments,
                    payTag:"compra",
                    itemFieldTotal:"costTotal",
                    mainFieldTotal:"total",
                },
            },
            {
                name:"buy-control",title:"control de compras",actions:["see","search","update"],
                descripcion:"Página que muestra un listado de todas las compras realizadas. Permite filtrar, buscar, y revisar los detalles de cada compra, así como modificar o anular registros si es necesario.",
                record:{title:"compra",titleMult:"compras"},access:"md-buy-general",
                buildPageConfig:{
                    type:"control",
                    schema:sch_buys,
                    mainControlVisual:{
                        fields:[
                            {value:"date",state:"edit"},
                            {value:"provideer",state:"show"},
                            {value:"state",state:"edit"},
                            {value:"total",state:"show"},
                        ],
                    },
                    mainDetailVisual:{
                        fields:[
                            {value:"date",state:"show"},
                            {value:"provideer",state:"show"},
                            {value:"state",state:"show"},
                            {value:"total",state:"show"},
                        ],
                    },

                    schemaItems:sch_buys_products,
                    itemDetailVisual:{
                        fields:[
                            {value:"item",state:"show"},
                            {value:"cant",state:"show"},
                            {value:"costUnit",state:"show"},
                            {value:"costTotal",state:"show"},
                        ],
                    },

                    page:"buy-new",
                    filters:[
                        {name:"state",value:op_buys_status.filter(op=>op.value!=5).map(op=>{return op.show})},
                    ],
                },
            },
        ],
    },
    {
        name:"contact",title:"contacto",icon:'<i class="bi bi-person-rolodex"></i>',
        descripcion:"Módulo para administrar la lista de contactos, que pueden ser clientes o proveedores, y permite agregar, editar o buscar contactos.",
        pages:[
            {
                name:"customers",title:"clientes",actions:["insert","search","see","update"],
                descripcion:"Módulo para la administración de los datos de los clientes del negocio. Permite agregar nuevos clientes, editar la información existente, y realizar búsquedas en la base de datos.",
                record:{title:"cliente",titleMult:"clientes"},
                buildPageConfig:{
                    type:"list",
                    schema:sch_customers,
                },
            },
            {
                name:"provieeders",title:"proveedores",actions:["insert","search","see","update"],
                descripcion:"Página para gestionar la información de los proveedores. Facilita la adición de nuevos proveedores, la actualización de datos y la consulta de contactos registrados.",
                record:{title:"proveedor",titleMult:"proveedores"},
                buildPageConfig:{
                    type:"simple",
                    schema:sch_provideers,
                },
            },
        ],
    },
    {
        name:"item",title:"item",icon:'<i class="bi bi-box"></i>',
        descripcion:"Acceso a la gestión de productos y servicios, donde se pueden agregar nuevos ítems, actualizar información o controlar el inventario.",
        pages:[
            {
                name:"items",title:"lista de productos",actions:["insert","search","see","update"],
                descripcion:"Sección dedicada a mostrar todos los productos disponibles en el inventario. Permite agregar nuevos productos, editar detalles existentes y eliminar productos si es necesario.",
                record:{title:"producto",titleMult:"productos"},
                buildPageConfig:{
                    type:"free",
                    ...script_items,
                    //schema:sch_items,
                },
            },
            {
              name:"item-prices",title:"lista de precios",actions:["see","update","search"],
              record:{title:"precio",titleMult:"precios"},
              descripcion:"Página donde se pueden gestionar los precios de los productos y servicios. Permite actualizar los precios.",
              buildPageConfig:{
                type:"free",
                ...pageBuildConfig_items({
                  title:"lista de precios",
                  fields:[
                    {value:"price",state:"edit"},
                    {value:"costUnit",state:"edit"},
                  ]
                }),
              }
            },
            {
              name:"item-stock",title:"stock de items",actions:["see","update","search"],
              record:{title:"stock",titleMult:"stocks"},access:"md-items-stock",
              descripcion:"Módulo para el control del inventario. Permite revisar la cantidad de productos disponibles, registrar ajustes de stock",
              buildPageConfig:{
                type:"free",
                ...pageBuildConfig_items({
                  title:"stock de items",
                  fields:[
                    {value:"stock",state:"edit"},
                    {value:"limit",state:"edit"},
                    {value:"limitOn",state:"show"},
                  ]
                }),
              }
            },
            {
                name:"build",title:"producción",actions:["see","update","search","insert"],
                record:{title:"producción",titleMult:"producciones"},access:"md-build-general",
                descripcion:"Módulo para la producción de productos a partir de una receta.",
                buildPageConfig:{
                  type:"free",
                  ...pageBuildConfig_produccion({}),
                }
              },
            {
                name:"item-tags",title:"etiquetas",actions:["insert","search","see","update"],
                descripcion:"Página para crear y gestionar las etiquetas o categorías de los productos. Facilita la organización del inventario mediante etiquetas que ayudan a clasificar los productos.",
                record:{title:"etiqueta de producto",titleMult:"etiquetas de productos"},access:"md-items-config",
                buildPageConfig:{
                    type:"simple",
                    schema:sch_items_tag,
                },
            },
            {
                name:"unids",title:"unidades",actions:["insert","search","see","update"],
                descripcion:"Sección dedicada a la gestión de las unidades de medida utilizadas en el sistema.",
                record:{title:"unidad",titleMult:"unidades"},access:"md-items-config",
                buildPageConfig:{
                    type:"simple",
                    schema:sch_unids,
                },
            },
        ],
    },
    {
        name:"inform",title:"informes",icon:'<i class="bi bi-clipboard-data"></i>',
        descripcion:"Sección para ver reportes y estadísticas sobre aspectos del negocio.",
        pages:[
          {
            name:"sale-inform",title:"ventas pagadas",actions:["see","search"],
            record:{title:"venta pagada",titleMult:"ventas pagadas"},
            descripcion:" Página donde se pueden consultar y generar reportes sobre las ventas que han sido pagadas en su totalidad. Permite filtrar por criterios relevantes para el análisis de ventas.",
            buildPageConfig:{
              ...pageBuildConfig_inform_sales({}),
            }
          },
          {
            name:"items-inform",title:"productos vendidos",actions:["see","search"],
            record:{title:"producto vendido",titleMult:"productos vendidos"},
            descripcion:"Muestra un informe detallado de los productos vendidos en un período determinado. Ayuda a identificar los productos más populares y las tendencias de ventas.",
            buildPageConfig:{
              ...pageBuildConfig_inform_products({}),
            }
          },
          {
            name:"customer-inform",title:"clientes frecuentes",actions:["see","search"],
            record:{title:"cliente frecuente",titleMult:"clientes frecuentes"},
            descripcion:"Sección que muestra un listado de los clientes que han realizado más compras. Permite analizar la lealtad de los clientes y evaluar oportunidades para ofrecer programas de fidelización.",
            buildPageConfig:{
              ...pageBuildConfig_inform_customer({}),
            }
          },
          {
            name:"flujo-inform",title:"informe general",actions:["see","search"],
            record:{title:"informe general",titleMult:"flujos de caja"},
            descripcion:"Reporte sobre los movimientos de efectivo en la caja, que incluye ingresos y egresos. Facilita el análisis del flujo de caja diario, semanal o mensual para una mejor gestión financiera.",
            buildPageConfig:{
              ...pageBuildConfig_inform_flujo({}),
            }
          },
        ],
    },
    {
        name:"pays",title:"cuentas",icon:'<i class="bi bi-piggy-bank"></i>',
        descripcion:"Permite gestionar cuentas, visualizar transferencias y registros de pagos realizados.",
        pages:[
            {
                name:"payments",title:"transferencias",actions:["see","insert","update","search"],
                record:{title:"transferencia",titleMult:"transferencias"},access:"md-box-general",
                descripcion:" Página donde se pueden consultar transferecias de ventas, compras, etc.",
                buildPageConfig:{
                  ...pageBuildConfig_payments({}),
                }
            },
            {
                name:"accounts",title:"cuentas",actions:["see","search","update","insert"],
                descripcion:"Página dedicada a la administración de cuentas. Permite registrar nuevas cuentas.",
                record:{title:"cuenta",titleMult:"cuentas"},access:"md-box-general",
                buildPageConfig:{
                    type:"simple",
                    schema:sch_accounts,
                },
            },
            {
                name:"pay-tags",title:"etiquetas",actions:["see","search","update","insert"],access:"md-box-general",
                descripcion:"Sección para crear y gestionar etiquetas que ayudan a clasificar las transferencias o transacciones realizadas. Facilita la organización y el seguimiento de las transacciones según su categoría.",
                record:{title:"etiqueta de transferencia",titleMult:"etiquetas de transferencias"},
                buildPageConfig:{
                    type:"simple",
                    schema:shc_pay_tag,
                    simpleEvents:[{
                        name:"printAfter",
                        actions:[{
                            action:({k})=>{

                                function BlockDeafults({crudBuild,namesDefault=[],fieldName="name"}) {
        
                                    namesDefault.forEach(nm => {
                                      
                                      var values = crudBuild.bodyGet().fieldGetValues({fieldName});
                                      var index = values.findIndex(v=>v==nm);
                                      if(index!=-1){
                            
                                        crudBuild.bodyGet().fieldsGet().forEach(f => {
                            
                                          crudBuild.bodyGet().fieldGetBoxes({fieldName:f.name})[index].Block({active:true});
                                        });
                                        
                                      }
                            
                                    });
                            
                                };

                                BlockDeafults({
                                    crudBuild:k,
                                    namesDefault:pay_tags_default.map(p=>p.name),
                                    fieldName:"name",
                                });
                            }
                        }]
                    }]
                },
            },
        ],
    },
    {
        name:"company",title:"empresa",icon:'<i class="bi bi-person"></i>',
        descripcion:"Información y configuración relacionada con la empresa.",
        pages:[
            {
                name:"info",title:"informacion",actions:["see","update"],
                record:{title:"informacion",titleMult:"informacion"},
                descripcion:"Página que muestra la información general de la empresam y otros datos relevantes para la configuración del sistema.",
                buildPageConfig:{
                    type:"free",
                    layers:[
                        {grid:{items:[{name:"prnt-main"}]}},
                        {
                            crud:{
                            title:"empresa",recordName:"informacion de la empresa",
                            schema:sch_companies,name:"cr-companie",parent:"prnt-main",
                            states:[
                                {
                                name:"reload",
                                tools:[
                                    {name:"tutorial",show:true},
                                    {name:"update",show:true},
                                ],
                                }
                            ],
                            panels:[{
                                tipe:"form",head:false,
                                fieldsSet:[
                                {value:"name",state:"edit"},
                                {value:"ruc",state:"edit"},
                                {value:"nameReal",state:"edit"},
                                {value:"dir",state:"edit"},
                                {value:"cel",state:"edit"},
                                {value:"email",state:"edit"},
                                ],
                            }]
                            }
                        }
                    ]
                }
            },
            {
                name:"rucs",title:"rucs",actions:["see","search","update","insert"],
                record:{title:"ruc",titleMult:"rucs"},access:"md-bills-rucs",
                descripcion:"Lista de razones sociales con las que se emiten las facturas.",
                buildPageConfig:{
                    type:"simple",
                    schema:sch_rucs,
                },
            },
            {
                name:"workers",title:"trabajadores",actions:["see","search","update","insert"],
                record:{title:"trabajador",titleMult:"trabajadores"},access:"md-workers-general",
                descripcion:"Página para la administración de los empleados de la empresa. Permite registrar nuevos trabajadores, actualizar información de los existentes y asignarles áreas de trabajo o roles específicos.",
                buildPageConfig:{
                    type:"simple",
                    schema:sch_workers,
                },
            },
            {
                name:"areas",title:"areas de trabajo",actions:["see","search","update","insert"],
                descripcion:"Sección para gestionar las distintas áreas o departamentos dentro de la empresa. Permite definir, agregar o modificar las áreas de trabajo para una mejor organización interna.",
                record:{title:"area de trabajo",titleMult:"areas de trabajo"},access:"md-workers-general",
                buildPageConfig:{
                    type:"simple",
                    schema:sch_work_areas,
                },
            },
        ],
    }
];

function concepBuildPage({userData,pageData}) {
    
    var concep = concepts.find(cnp=>cnp.pages.find(pg=>pg.name==pageData.name));
    console.log("build page by concep",concep);
    
    console.log("build page",pageData);
    
    new BuildPage({
        pageData,userData,test,
        ...pageData.buildPageConfig
    });
}

//set pages
PagesData = [];
concepts.forEach(cnp => {

    var paginas = [];

    cnp.pages.forEach(pg => {
        
        paginas.push({
            state:"active",
            href:pg.name+".php",
            access:pg.access,
            ...pg,
        });        
    });
    
    PagesData.push({
        icon:cnp.icon,title:cnp.title,
        seccion:cnp.name,
        descripcion:cnp.descripcion,
        paginas,
    });

});


//set tutorials
tutorialsData = [];

tutorialsData.push({
    value:"nav-see",access:true,
    name:"introducción a la barra de navegación",
    seccion:"Navegación",
});

const itemsData = [
    {
        name:"sale",
        record:"venta",records:"ventas",
        pages:[
            {name:"sale-new",actions:["insert"]},
            {name:"sale-control",actions:["update","see"]},
            {name:"sale-inform",actions:["inform"]},
            //{name:"sale-day",actions:["update","see"]},
            //{name:"sale-pay",actions:["update","see"]},
        ],
    },
    {
        name:"sale-day",
        record:"venta del dia",records:"ventas del dia",
        pages:[
            {name:"sale-day",actions:["see"]},
        ],
    },
    {
        name:"sale-pay",
        record:"venta por cobrar",records:"ventas por cobrar",
        pages:[
            {name:"sale-pay",actions:["see"]},
        ],
    },
    {
        name:"bill",
        record:"factura",records:"facturas",
        pages:[
            {name:"sale-bills",actions:["see"]},
        ],
    },
    {
        name:"box",
        record:"control de caja",records:"cotrol de cajas",
        pages:[
            {name:"box",actions:["update","see","insert"]},
        ],
    },
    {
        name:"buy",
        record:"compra",records:"compras",
        pages:[
            {name:"buy-new",actions:["insert"]},
            {name:"buy-control",actions:["update","see"]},
        ],
    },
    {
        name:"customer",
        record:"cliente",records:"clientes",
        pages:[
            {name:"customers",actions:["insert","update","see"]},
            {name:"customer-inform",actions:["inform"]},
        ],
    },
    {
        name:"provieeder",
        record:"proveedor",records:"proveedores",
        pages:[
            {name:"provieeders",actions:["insert","update","see"]},
        ],
    },
    {
        name:"item",
        record:"producto",records:"productos",
        pages:[
            {name:"items",actions:["insert","update","see"]},
            {name:"items-inform",actions:["inform"]},
        ],
    },
    {
        name:"price",
        record:"precio",records:"precios",
        pages:[
            {name:"item-prices",actions:["see"]},
        ],
    },
    {
        name:"stock",
        record:"stock",records:"stocks",
        pages:[
            {name:"item-stock",actions:["see"]},
        ],
    },
    {
        name:"stock-limit",
        record:"poco stock",records:"poco stocks",
        pages:[
            {name:"item-stock",actions:["see"]},
        ],
    },
    {
        name:"total",
        record:"flujo de caja",records:"flujos de caja",
        pages:[
            {name:"flujo-inform",actions:["inform"]},
        ],
    },
    {
        name:"account",
        record:"cuenta",records:"cuentas",
        pages:[
            {name:"accounts",actions:["see","edit","insert"]},
        ],
    },
    {
        name:"pay-tag",
        record:"tipo de transferencia",records:"tipos de transferencias",
        pages:[
            {name:"accounts",actions:["see","edit","insert"]},
        ],
    },
    {
        name:"company",
        record:"negocio",records:"negocios",
        pages:[
            {name:"info",actions:["see","update"]},
        ],
    },
    {
        name:"worker",
        record:"trabajador",records:"trabajadores",
        pages:[
            {name:"workers",actions:["see","update","insert"]},
        ],
    },
    {
        name:"area",
        record:"area de trabajo",records:"areas de trabajo",
        pages:[
            {name:"areas",actions:["see","update","insert"]},
        ],
    },
    {
        name:"payment",
        record:"transferencia",records:"transferencias",
        pages:[
            {name:"payments",actions:["see","update","insert"]},
        ],
    },
];

const actionsData = [
    {value:"insert",show:"como ingresar [registro]",tutorial:"insert"},
    {value:"see",show:"ver la lista de [registros]",tutorial:"use"},
    {value:"update",show:"como modificar [registro]",tutorial:"edit"},
    //{value:"search",show:"filtrar y buscar [registros]",tutorial:"search"},
    {value:"inform",show:"generar, filtrar y buscar informe de [registros]",tutorial:"search"},
    {value:"history",show:"ver el historial de [registros]",tutorial:"search"},
];

itemsData.forEach(itm=>{

    //item
    actionsData.forEach(act => {

        var pg = itm.pages.find(pg=>pg.actions.find(pgact=>pgact==act.value));
        if(pg){

            var pgData = PageDataFind({pageName:pg.name});
            var secc = null;
            concepts.forEach(cnp => {
                
                if(secc==null && cnp.pages.find(pgscc=>pgscc.name==pg.name)) secc = cnp;
            });

            tutorialsData.push({
                value:itm.name+"-"+act.value,
                name:act.show.replace("[registro]",itm.record).replace("[registros]",itm.records),
                page:pg.name,access:pgData.access,
                PlayTutorial:act.tutorial,
                seccion:secc.title,
            });   
        }

    });

    //attribute
});

concepts.forEach(cnp => {
    
    cnp.pages.forEach(pg => {
        
        var config = pg.buildPageConfig;
        if(config && config.actions!=null && config.record!=null){

            config.actions.forEach(act => {
                
                var actInfo = actionsData.find(actInf => actInf.value == act);
                console.log("ADD TUTORIAL ACTION",config.record.titleOne,act);
                tutorialsData.push({
                    value:config.record.name+"-"+actInfo.value,
                    name:actInfo.show.replace("[registro]",config.record.titleOne).replace("[registros]",config.record.titleMult),
                    page:pg.name,access:pg.access,
                    PlayTutorial:actInfo.tutorial,
                    seccion:cnp.title,
                });   
            });           
        }

    });
});




