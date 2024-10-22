

function loadGet({schema,}) {

    var ld = {
        name:"ld-"+schema.table,
        tableMain:schema.table,
        selects:[
            {table:schema.table,field:schema.fieldPrimary,as:"value"},
            {table:schema.table,field:"NAME",as:"show"},
            //{sql:("CONCAT("+sch_items.table+".NAME,' (',unids.SIMBOL,')') AS 'show'")},
        ],
        /*joins:[
            {
                main:{table:sch_items.table,field:"UNID_ID"},
                join:{table:sch_unids.table,field:sch_unids.fieldPrimary},
                tipe:"LEFT",
            },
        ],*/
    }
    
    return ld;
}


const sch_customers = {
    table:"customers",
    fieldPrimary:"ID_CUSTOMER",
    company:true,record:{name:"customer",title:"cliente"},
    fields:[
        {
            value:"name",tags:["main","main-flt"],
            name:"nombre",
            select:'NAME',
            access:true,
            tipe:"input",
            minWidth:350,
            descripcion:"nombre del cliente",
        },
        {
            value:"document",tags:["main"],
            name:"documento",
            select:'COMPANY',
            minWidth:100,
            access:"md-bills-general",
            tipe:"options",options:op_customer_document,
            descripcion:"si el cliente es empresa o persona natural",
        },
        {
            value:"nroDoc",tags:["main","main-flt"],
            name:"nro documento",
            select:'NRO_DOCUMENT',
            minWidth:150,
            access:"md-bills-general",
            tipe:"input",
            descripcion:"nro del documento del dni/ruc",
        },
        {
            value:"cel",tags:["main"],
            name:"celular",
            select:'PHONE',
            minWidth:150,
            access:"md-customer-cel",
            tipe:"input",
            descripcion:"numero de celular del cliente",
        },
        {
            value:"dir",tags:["main"],
            name:"direccion",
            select:'DIRECCION',
            minWidth:300,
            access:"md-customer-dir",
            tipe:"input",
            descripcion:"direccion del cliente",
        },
        {
            value:"email",
            name:"correo",
            select:'EMAIL',
            minWidth:300,
            access:"md-customer-email",
            tipe:"input",
            descripcion:"correo del contacto del cliente"
        },
        {
            value:"comment",
            name:"descripcion",
            select:'DESCRIPCION',
            minWidth:300,
            access:"md-customer-coment",
            tipe:"comment",
            descripcion:"descripcion del cliente",
        },
        {
            value:"dateInsert",
            name:"fecha de ingreso",
            select:'DATE_INSERT',
            minWidth:300,calculate:true,
            access:true,
            tipe:"date",
            descripcion:"fecha de ingreso del cliente",
        },
    ],
    visuals:[
        {
            name:"load",
            fields:[
                {value:"name",state:"show"},
            ],
        },
        {
            name:"modulo",
            fields:[
                {value:"name",state:"show"},
                {value:"document",state:"show"},
                {value:"nroDoc",state:"show"},
                {value:"cel",state:"show"},
                {value:"dir",state:"show"},
                {value:"email",state:"show"},
                {value:"comment",state:"show"},
            ],
        },
        {
            name:"detail-edit",
            fields:[
                {value:"name",state:"edit"},
                {value:"document",state:"edit"},
                {value:"nroDoc",state:"edit"},
                {value:"cel",state:"edit"},
                {value:"dir",state:"edit"},
                {value:"email",state:"edit"},
                {value:"comment",state:"edit"},
            ],
        },
        {
            name:"control",
            fields:[
                {value:"name",state:"show"},
                {value:"document",state:"show"},
                {value:"nroDoc",state:"show"},
                {value:"cel",state:"show"},
            ],
        }
    ],
}

function scr_customer_fm({parent,userData}) {

    var script = {
        ...scr_base({
            schema:sch_customers,
            panelTipe:"form",
            stateGeneral:"edit",
            fieldsSet:[
                {value:"name",state:"edit"},
                {value:"company",state:"edit"},
                {value:"nroDoc",state:"edit"},
                {value:"cel",state:"edit"},
                {value:"dir",state:"edit"},
                {value:"email",state:"edit"},
                {value:"comment",state:"edit"},
            ],
            userData,
            parent,
          }),
    };

    //console.log("GET SCRIPT OF CUSTOMER FORM",script);
    

    return script;
}

function scr_customer_tb({parent, userData}) {
    return {
        ...scr_base({
            schema:sch_customers,
            panelTipe:"table",
            stateGeneral:"edit",
            userData,
            parent,
          }),
    };
}

const sch_companies = {
    table:"companies",record:{name:"company",title:"empresa"},
    fieldPrimary:"ID_COMPANY",
    company:true,
    fields:[
        {
            value:"name",name:"nombre corto de la empresa",tipe:"input",
            select:"NAME",access:true,
        },
        {
            value:"ruc",select:"RUC",name:"ruc",tipe:"input",
            access:true,
        },
        {
            value:"active",select:"ACTIVE",name:"activo",tipe:"input",
            access:true,
        },
        {
            value:"nameReal",select:"NAME_REAL",name:"razon social",tipe:"input",
            access:true,
        },
        {
            value:"dir",select:"DIRECCION",name:"direccion",tipe:"input",
            access:true,
        },
        {
            value:"cel",select:"TELF",name:"telefono",tipe:"input",
            access:true,
        },
        {
            value:"email",select:"EMAIL",name:"correo electronico",tipe:"input",
            access:true,
        },
        {
            value:"type",select:"ID_COMPANY_TYPE",name:"tipo de empresa",tipe:"options",
            access:true,options:op_company_type,
        },
        {
            value:"logo",select:"LOGO",name:"logotipo",tipe:"input",
            access:true,
        },
    ],
}

const sch_rucs = {
    table:"rucs",
    company:true,record:{title:"ruc"},
    fieldPrimary:"ID_RUC",
    fields:[
        {
            value:"ruc",name:"ruc",minWidth:200,
            tipe:"input",select:"RUC",access:true,tags:["main"],
        },
        {
            value:"name",name:"razón social",
            tipe:"input",select:"RAZON_SOCIAL",access:true,tags:["main"],
        },
    ],
}

var ld_rucs = {
    tableMain:sch_rucs.table,
    selects:[
        {table:sch_rucs.table,field:sch_rucs.fieldPrimary,as:"value"},
        {table:sch_rucs.table,field:"RUC",as:"show"},
    ],
    startOptions:[
        {value:"null",show:"ruc principal"},
    ],
};

const sch_work_areas = {
    table:"work_areas",record:{name:"area",title:"are de trabajo"},
    fieldPrimary:"ID_WORK_AREA",
    company:true,
    fields:[
        {
            value:"name",name:"nombre del area de trabajo",
            tipe:"input",select:"NAME",access:true,tags:["main"],
        },
    ],
};

var ld_work_areas = {
    tableMain:sch_work_areas.table,
    selects:[
        {table:sch_work_areas.table,field:sch_work_areas.fieldPrimary,as:"value"},
        {table:sch_work_areas.table,field:"NAME",as:"show"},
    ],
};

function CreateLoadBySchema({name="ld",schema,selectShow}) {
    
    return {
        name,
        tableMain:schema.table,
        selects:[
            {table:schema.table,field:schema.fieldPrimary,as:"value"},
            {table:schema.table,field:selectShow,as:"show"},
        ],
    }
}

const sch_workers = {
    table:"workers",
    fieldPrimary:"ID_WORKER",
    company:true,record:{name:"work",title:"trabajador"},
    fields:[
        {
            value:"area",name:"area de trabajo",access:true,
            select:"ID_WORK_AREA",tipe:"options",load:{
                schema:sch_work_areas,
                ...ld_work_areas,
            },
            //conect:{schema:sch_work_areas,type:"edit"},

        },
        /*{
            value:"worker",name:"trabajador",access:true,
            select:"ID_CUSTOMER",tipe:"",
        },*/
        {
            value:"name",name:"nombre",access:true,tags:["main"],
            select:"NAME",tipe:"input",minWidth:300,
        },
        {
            value:"cel",name:"celular",access:true,
            select:"CEL_NUMBER",tipe:"input",minWidth:200,
        },
    ],
};

var ld_workers = {
    name:"ld-workers",schema:sch_workers,
    tableMain:sch_workers.table,
    selects:[
        {table:sch_workers.table,field:sch_workers.fieldPrimary,as:"value"},
        {table:sch_workers.table,field:"NAME",as:"show"},
    ],
};


const sch_users = {
    table:"users",
    fieldPrimary:"ID_USER",
    company:true,
    fields:[
        {
            value:"name",select:"NAME",
            tipe:"input",access:true,tags:["main"],
        },
        {
            value:"password",select:"PASSWORD",
            tipe:"input",access:true,
        },
        {
            value:"active",select:"ACTIVE",
            tipe:"active",access:true,
        },
    ],
}

//------items-----

const sch_items = {

    table:"products",record:{name:"item",title:"item"},
    fieldPrimary:"ID_PRODUCT",
    company:true,
    fields:[
        {
            value:"name",tags:["main"],
            name:"nombre",state:"show",minWidth:300,
            select:"NAME",access:true,
            tipe:"input",tags:["load"],
            descripcion:"nombre del item",
        },
        {
            value:"tipe",tags:["main"],
            name:"tipo",state:"show",
            select:"ID_PRODUCT_TIPE",access:true,
            tipe:"options",options:op_products_tipe,
            descripcion:"puede ser item",
        },
        {
            value:"tag",
            name:"etiqueta",state:"show",
            select:"ID_PRODUCT_TAG",access:true,
            tipe:"optionsSearch",tags:["load"],
            descripcion:"etiqueta del item",
            load:{
                name:"ld-products_tags",
                tableMain:"products_tags",
                selects:[
                    {table:'products_tags', field:'ID_PRODUCT_TAG',as:"value"},
                    {table:'products_tags', field:'NAME',as:"show"},
                ]
            },
        },
        {
            value:"unid",
            name:"unidad",state:"show",
            select:"UNID_ID",access:true,
            tipe:"options",
            descripcion:"unidad del item",
            load:{
                name:"ld-unids",
                tableMain:"unids",
                selects:[
                    {table:'unids', field:'ID_UNID',as:"value"},
                    {table:'unids', field:'SIMBOL',as:"show"},
                ],
            }
        },
        {
            value:"price",
            name:"precio de venta",state:"show",minWidth:130,
            select:"PRICE_UNIT",access:true,
            tipe:"money",
            descripcion:"precio unitario de venta",
        },
        {
            value:"costUnit",
            name:"costo unitario",state:"show",minWidth:130,
            select:"COST_UNIT",access:"md-buy-general",
            tipe:"money",
            descripcion:"costo unitario, este campo se actualiza de acuerdo a las compras",
        },
        {
            value:"stock",
            name:"stock total",state:"show",minWidth:70,
            select:"STOCK_TOTAL",access:"md-items-stock",
            tipe:"cant",
            descripcion:"stock actual del producto/insumo/servicio",
        },
        {
            value:"limit",
            name:"stock minimo",state:"show",minWidth:70,
            select:"STOCK_LIMIT",access:"md-items-stock",
            tipe:"cant",
            descripcion:"stock minimo del item, en caso el stock sea menor o igual, se lanza una alerta",
        },
        {
            value:"limitOn",
            name:"limite",state:"show",minWidth:150,
            select:"STOCK_ONLIMIT",access:"md-items-stock",
            options:op_products_onlimit,
            tipe:"active",
            descripcion:"los productos/servicio/insumo que tiene un stock menor o igual al minimo",
        },
        {
            value:"active",
            name:"estado",state:"show",
            select:"ACTIVE",access:true,
            tipe:"active",options:op_active,
            descripcion:"si el item esta activo, se puede vender o usar",
        },
        {
            value:"cantRecipe",
            name:"cantidad de receta",state:"show",
            select:"RECIPE_CANT",access:true,
            tipe:"input",
            descripcion:"cantidad que se obtiene al momento de realizar la receta",
        },
        {
            value:"produccionAutomate",name:"produccion",minWidth:150,
            tipe:"options",access:true,
            options:[
                {value:0,show:"produccion manual",class:"rounded text-center bg-primary text-white"},
                {value:1,show:"produccion automatica",class:"rounded text-center bg-warning text-white"},
            ],
            select:"PRODUCCION_AUTOMATE",
            descripcion:"",
        }
    ],
}

const sch_unids = {
    table:"unids",record:{name:"unid",title:"unidad"},
    fieldPrimary:"ID_UNID",
    company:true,
    fields:[
        {
            value:"name",
            name:"unidad",tipe:"input",
            select:"NAME",access:true,
            descripcion:"",
        },
        {
            value:"simbol",
            name:"simbolo",tipe:"input",
            select:"SIMBOL",access:true,
            descripcion:"",
        },
    ],
    visuals:[
        {
            name:"control",
            fields:[
                {value:"name",state:"show"},
                {value:"simbol",state:"show"},
            ]
        },
        {
            name:"detail-edit",
            fields:[
                {value:"name",state:"edit"},
                {value:"simbol",state:"edit"},
            ]
        },
        {
            name:"modulo",
            fields:[
                {value:"name",state:"edit"},
                {value:"simbol",state:"edit"},
            ]
        },
    ],
}

const sch_items_tag = {
    table:"products_tags",record:{name:"item-tag",title:"etiqueta de item"},
    fieldPrimary:"ID_PRODUCT_TAG",
    company:true,
    fields:[
        {
            value:"name",
            name:"etiqueta",tipe:"input",
            select:"NAME",access:true,
            descripcion:"",
        },
    ],
    visuals:[
        {
            name:"modulo",
            fields:[
                {value:"name",state:"edit"},
            ]
        }
    ],
}

const sch_vehicles = {

    table:"items_vehicles",
    fieldPrimary:"ID_VEHICLE",
    recordName:"vehiculo",record:{title:"vehiculo"},
    selectShow:"PLACA",
    fields:[
        {
            value:"placa",name:"placa",minWidth:100,
            select:"PLACA",access:true,tipe:"input",
            descripcion:"placa del vehiculo",tags:["main"],
        },
        {
            value:"marca",name:"marca",minWidth:100,
            select:"MARCA",access:true,tipe:"input",
            descripcion:"marca del vehiculo",tags:["main"],
        },
        {
            value:"modelo",name:"modelo",minWidth:100,
            select:"MODELO",access:true,tipe:"input",
            descripcion:"modelo del vehiculo",
        },
        {
            value:"anio",name:"año",minWidth:100,
            select:"ANIO",access:true,tipe:"input",
            descripcion:"año de fabricacion del vehiculo",
        },
        {
            value:"nro",name:"nro de motor",minWidth:100,
            select:"NRO_MOTO",access:true,tipe:"input",detail:2,
            descripcion:"numero de motor",
        },
        {
            value:"vin",name:"numero de vin",minWidth:100,
            select:"NRO_VIN",access:true,tipe:"input",detail:2,
            descripcion:"numero de vin",
        },
        {
            value:"color",name:"color",minWidth:100,
            select:"COLOR",access:true,tipe:"input",
            descripcion:"color del vehiculo",detail:2,
        },
    ],
    panels:[],
}

const sch_checkin_vehicles = {
    table:"checkin_vehicles",
    fieldPrimary:"ID_CHECKIN_VEHICLE",
    company:false,recordName:"orden de trabajo",
    fields:[
        
        {access:true,value:"customer",name:"cliente",tipe:"optionsSearch",select:"ID_CUSTOMER",conect:{schema:sch_customers,type:"edit"},panel:"customer"},
        {access:true,value:"receptor-customer",name:"solicitante",tipe:"optionsSearch",select:"ID_CUSTOMER_RECEPTOR",conect:{schema:sch_customers,type:"edit"},detail:2,panel:"customer"},
        {access:true,value:"receptor-user",name:"recepcionista",tipe:"optionsSearch",select:"ID_USER_RECEPTOR",conect:{schema:sch_workers,type:"show"},panel:"customer"},
        
        {access:true,value:"vehicle",name:"vehiculo",tipe:"optionsSearch",select:"ID_VEHICLE",conect:{schema:sch_vehicles,type:"edit"},panel:"vehicle"},
        {access:true,value:"date_enter",name:"fecha de entrada",tipe:"date",select:"DATE_ENTER",detail:2,panel:"vehicle",col:6},
        {access:true,value:"date-out",name:"fecha de entrega",tipe:"date",select:"DATE_OUT",detail:2,panel:"vehicle",col:6},
        {access:true,value:"fuel",name:"combustible",tipe:"bar",select:"FUEL",detail:2,panel:"vehicle"},
        {access:true,value:"milage",name:"kilometraje",tipe:"input",select:"MILEAGE",detail:2,panel:"vehicle",col:6},
        {access:true,value:"milage-prox",name:"kilometraje del proximo servicio",tipe:"input",select:"MILEAGE_PROX",detail:2,panel:"vehicle",col:6},
        {access:true,value:"comment",name:"requerimiento",tipe:"comment",select:"COMENT",detail:2,panel:"vehicle"},

        
        //{access:true,value:"front",name:"imagen frontal",tipe:"input",select:"IMG_FRONT",detail:2},
        {access:true,value:"observations",name:"observaciones",tipe:"comment",select:"OBSERVATIONS",detail:2,panel:"chasis"},

        //{access:true,value:"",name:"",tipe:"input",select:"ID_SALE",detail:2},
        {access:true,value:"check_1",name:"radio",panel:"inv",detail:1,tipe:"active",select:"CHECK_1"},
        {access:true,value:"check_2",name:"tapa de aceite",panel:"inv",detail:1,tipe:"active",select:"CHECK_2"},
        {access:true,value:"check_3",name:"antena de radio",panel:"inv",detail:1,tipe:"active",select:"CHECK_3"},
        {access:true,value:"check_4",name:"brazo de plumilla",panel:"inv",detail:1,tipe:"active",select:"CHECK_4"},
        {access:true,value:"check_5",name:"cabezales de asiento",panel:"inv",detail:1,tipe:"active",select:"CHECK_5"},
        {access:true,value:"check_6",name:"cenicero",panel:"inv",detail:1,tipe:"active",select:"CHECK_6"},
        {access:true,value:"check_7",name:"cinturon de seguridad",panel:"inv",detail:1,tipe:"active",select:"CHECK_7"},
        {access:true,value:"check_8",name:"claxon",panel:"inv",detail:1,tipe:"active",select:"CHECK_8"},
        {access:true,value:"check_9",name:"alarma y control",panel:"inv",detail:1,tipe:"active",select:"CHECK_9"},
        {access:true,value:"check_10",name:"emblemas",panel:"inv",detail:1,tipe:"active",select:"CHECK_10"},
        {access:true,value:"check_11",name:"encendedor",panel:"inv",detail:1,tipe:"active",select:"CHECK_11"},
        {access:true,value:"check_12",name:"escarpines",panel:"inv",detail:1,tipe:"active",select:"CHECK_12"},
        {access:true,value:"check_13",name:"espejos externos",panel:"inv",detail:1,tipe:"active",select:"CHECK_13"},
        {access:true,value:"check_14",name:"espejos interior",panel:"inv",detail:1,tipe:"active",select:"CHECK_14"},
        {access:true,value:"check_15",name:"gata y palanca",panel:"inv",detail:1,tipe:"active",select:"CHECK_15"},
        {access:true,value:"check_16",name:"juego de herramientas",panel:"inv",detail:1,tipe:"active",select:"CHECK_16"},
        {access:true,value:"check_17",name:"llanvas de repuesto",panel:"inv",detail:1,tipe:"active",select:"CHECK_17"},
        {access:true,value:"check_18",name:"llave de ruedas",panel:"inv",detail:1,tipe:"active",select:"CHECK_18"},
        {access:true,value:"check_19",name:"llave de seguro vasos",panel:"inv",detail:1,tipe:"active",select:"CHECK_19"},
        {access:true,value:"check_20",name:"llave de seguro rueda",panel:"inv",detail:1,tipe:"active",select:"CHECK_20"},
        {access:true,value:"check_21",name:"llavero",panel:"inv",detail:1,tipe:"active",select:"CHECK_21"},
        {access:true,value:"check_22",name:"luz de salor",panel:"inv",detail:1,tipe:"active",select:"CHECK_22"},
        {access:true,value:"check_23",name:"manija de puertas",panel:"inv",detail:1,tipe:"active",select:"CHECK_23"},
        {access:true,value:"check_24",name:"parlantes",panel:"inv",detail:1,tipe:"active",select:"CHECK_24"},
        {access:true,value:"check_25",name:"pisos de jebe",panel:"inv",detail:1,tipe:"active",select:"CHECK_25"},
        {access:true,value:"check_26",name:"plimillas/otros",panel:"inv",detail:1,tipe:"active",select:"CHECK_26"},
    ],
}

function scr_vehicle_fm({parent,userData}) {
    return {
        ...scr_base({
            schema:sch_vehicles,
            userData,
            fieldsSet:[],
            stateGeneral:"edit",
            parent,
            panelTipe:"form",
          }),
    }
}

//----transaccions----

const sch_accounts = {
    table:"accounts",record:{name:"account",title:"cuenta"},
    fieldPrimary:"ID_ACCOUNT",
    company:true,
    fields:[
        {
            value:"name",access:true,minWidth:200,
            name:"nombre de cuenta",select:"NAME",
            tipe:"input",tags:["main"],
            descripcion:"",
        },
        {
            value:"total",access:true,minWidth:150,
            name:"total",select:"TOTAL",
            tipe:"money",
            descripcion:"",
        },
        {
            value:"active",access:true,
            name:"activo",select:"ACTIVE",
            tipe:"options",options:op_active,
            descripcion:"",
        },
        {
            value:"open",access:true,
            name:"estado",select:"OPEN",
            tipe:"options",options:[
                {value:0,show:"cerrado",class:"rounded text-center bg-danger text-white"},
                {value:1,show:"abierto",class:"rounded text-center bg-success text-white"},
            ],
            descripcion:"",
        },
        {
            value:"control",access:true,
            name:"cuenta controlada",select:"CONTROL_BY_OPEN",
            tipe:"options",options:[
                {value:0,show:"libre",class:"rounded text-center bg-primary text-white"},
                {value:1,show:"controlado",class:"rounded text-center bg-warning text-white"},
            ],
            descripcion:"",
        },
    ],
    visuals:[
        {
            name:"modulo",
            fields:[
                {value:"name",state:"edit"},
                {value:"total",state:"edit"},
                {value:"open",state:"edit"},
                {value:"control",state:"edit"},
                //{value:"active",state:"edit"},
            ],
        },
    ]
}

const shc_pay_tag = {

    table:"pay_tag",record:{name:"pay-tag",title:"etiqueta"},
    fieldPrimary:"ID_PAY_TAG",
    company:true,
    fields:[
        {
            value:"name",access:true,
            select:"NAME",name:"nombre de etiqueta",
            tipe:"input",tags:["main"],
            descripcion:"",
        },
        {
            value:"income",access:true,
            select:"INCOME",name:"ingreso",
            tipe:"options",
            options:[
                {value:0,show:"egreso",class:"rounded text-center bg-danger text-white"},
                {value:1,show:"ingreso",class:"rounded text-center bg-success text-white"},
            ],
            descripcion:"",
        },
        /*{
            value:"active",access:true,
            select:"ACTIVE",name:"activo",
            tipe:"active",
            descripcion:"",
        },*/
    ],
    visuals:[
        {
            name:"modulo",
            fields:[
                {value:"name",state:"edit"},
                {value:"income",state:"edit"},
                //{value:"active",state:"edit"},
            ],
        },
    ]
};

const pay_tags_default = [
    {name:"venta",income:true},
    {name:"compra",income:false},
    {name:"ingreso de caja",income:true},
    {name:"retiro de caja",income:false},
    {name:"ingreso de transferencia entre cuentas",income:true},
    {name:"egreso de transferencia entre cuentas",income:false},
];

const sch_pays = {
    
    table:"payments",record:{name:"pay",title:"pago"},
    fieldPrimary:"ID_PAY",
    company:true,
    fields:[
        {
            value:"date",
            name:"fecha de emision",
            select:"DATE_EMMIT",access:true,
            tipe:"show",
            descripcion:"",
        },
        {
            value:"total",
            name:"total",tags:["main"],
            select:"TOTAL",access:true,
            tipe:"money",
            descripcion:"",
        },
        {
            value:"income",tags:["main"],
            name:"ingreso/egreso",
            select:"INCOME",access:true,
            tipe:"options",options:[
                {value:0,show:"egreso",class:"rounded text-center bg-danger text-white"},
                {value:1,show:"ingreso",class:"rounded text-center bg-success text-white"},
            ],
            descripcion:"",
        },
        {
            value:"account",
            name:"cuenta",tags:["main"],
            select:"ID_ACCOUNT",access:true,
            tipe:"options",conect:{schema:sch_accounts},
            descripcion:"",
            load:{
                name:"ld-account",
                tableMain:sch_accounts.table,
                selects:[
                    {table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"value"},
                    {table:sch_accounts.table,field:"NAME",as:"show"},
                ],
            },
        },
        {
            value:"tag",
            name:"etiqueta",tags:["main"],
            select:"ID_PAY_TAG",access:true,
            tipe:"options",conect:{schema:shc_pay_tag},
            descripcion:"",
            load:{
                name:"ld-tag",
                tableMain:shc_pay_tag.table,
                selects:[
                    {table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary,as:"value"},
                    {table:shc_pay_tag.table,field:"NAME",as:"show"},
                ],
            },
        },
        {
            value:"comment",select:"NOTE",
            name:"comentario",tipe:"comment",
            descripcion:"",access:true,
        }
    ]
};

//----sales----

const sch_sales_pays = {
    table:"sales_payments",recordName:"trasaccion",
    fieldPrimary:"ID_SALE_PAY",
    fields:[
        {
            value:"idSale",access:true,
            name:"id sale",tipe:"show",
            select:"ID_SALE",
            descripcion:"",
        },
        {
            value:"idPay",access:true,
            name:"id pay",tipe:"show",
            select:"ID_PAY",
            descripcion:"",conect:{schema:sch_pays,type:"show"},
        },
    ],
}

const op_sales_emitsunat = [
    {value:1,show:"emitido a sunat",class:"rounded text-center bg-success text-white"},
    {value:0,show:"sin emitir a sunat",class:"rounded text-center bg-danger text-white"},
];

const sch_sales_products = {
    record:{name:"item",title:"producto/servicio"},
    table:"sales_products",
    fieldPrimary:"ID",
    fields:[
        {
            value:"saleId",detail:"hide",
            name:"id de venta",
            select:"ID_SALE",access:true,
            tipe:"key",line0:true,
            descripcion:"",
        },
        {
            value:"item",
            name:"producto/servicio",maxWidth:100,
            select:"ID_PRODUCT",access:true,
            tipe:"optionsSearch",conect:{schema:sch_items,type:"show"},
            descripcion:"producto/servicio de la venta",
            load:{
                name:"ld-item",schema:sch_items,
                tableMain:sch_items.table,
                selects:[
                    {table:sch_items.table,field:sch_items.fieldPrimary,as:"value"},
                    {sql:("CONCAT("+sch_items.table+".NAME,' (',unids.SIMBOL,')') AS 'show'")},
                ],
                joins:[
                    {
                        main:{table:sch_items.table,field:"UNID_ID"},
                        join:{table:sch_unids.table,field:sch_unids.fieldPrimary},
                        tipe:"LEFT",
                    }
                ],
                startOptions:[
                    {value:"null",show:"Nuevo Producto/Servicio"},
                ],
            },line0:true,
        },
        {
            value:"cant",
            name:"cantidad",
            select:"CANT",access:true,
            tipe:"cant",line0:true,
            descripcion:"cantidad de producto/servicios vendidos",
        },
        {
            value:"priceUnit",minWidth:140,
            name:"precio unitario",
            select:"PRICE_UNIT",access:true,
            tipe:"money",line0:true,
            descripcion:"precio unitario del producto/servicio",
        },
        {
            value:"priceTotal",minWidth:140,
            name:"precio total",
            select:"PRICE_TOTAL",access:true,
            tipe:"money",line0:true,
            descripcion:"precio total del producto/servicio",
        },
        {
            value:"checklist",
            name:"terminado",line0:true,
            select:"CHECKLIST",access:"md-workers-item",
            tipe:"options",options:[
                {value:0,show:"pendiente",class:"rounded text-center bg-danger text-white"},
                {value:1,show:"terminado",class:"rounded text-center bg-success text-white"},
            ],
            descripcion:"",
        },
        {
            value:"worker",conect:{schema:sch_workers},
            name:"trabajador asignado",line0:true,
            select:"ID_WORKER",access:"md-workers-item",
            tipe:"optionsSearch",load:{...ld_workers},
            descripcion:"",
        },
    ],
}

const sch_sales = {
    record:{name:"sale",title:"venta"},
    table:"sales",
    fieldPrimary:"ID_SALE",
    company:true,
    fields:[
        {
            value:"emmit",minWidth:150,
            name:"fecha de ingreso",tags:["main","control"],
            select:"DATE_EMMIT",access:true,
            tipe:"date",panel:"info",
            descripcion:"fecha en la que la venta fue ingresada",
        },
        {
            value:"status",panel:"info",
            name:"estado de venta",tags:["main","control"],
            select:"ID_STATUS",access:true,
            tipe:"options",options:op_sales_status,
            descripcion:"puede ser "+op_sales_status.map(op=>{return op.show;}).join(", "),
        },
        {
            value:"pay",panel:"info",tags:["main","control"],
            name:"estado de pagos",minWidth:150,
            select:"PAID",access:true,states:{edit:{access:"md-box-general"}},
            tipe:"options",options:op_sales_paid,
            descripcion:"muestra si la venta ya ha sido pagada",
        },
        {
            value:"customer",panel:"info",
            name:"cliente",minWidth:300,tags:["main","control"],
            table:"customers",select:"ID_CUSTOMER",access:true,sql:"CONCAT(customers.NAME,'-',customers.NRO_DOCUMENT) AS 'NAME'",
            tipe:"optionsSearch",
            descripcion:"",conect:{schema:sch_customers,type:"edit"},
            load:{
                name:"ld-customer",schema:sch_customers,
                tableMain:sch_customers.table,
                selects:[
                    {table:sch_customers.table,field:sch_customers.fieldPrimary,as:"value"},
                    {table:sch_customers.table,field:"NAME",as:"show"},
                ],
            }
        },
        {
            value:"doc",panel:"info",
            name:"documento",tags:["detail","bill","control"],
            select:"ID_DOCUMENT",access:true,
            tipe:"options",options:op_sales_document,
            descripcion:"es el documento que se emite a sunat ("+op_sales_document.map(op=>{return op.show}).join("/")+")",
        },
        {
            value:"total",panel:"total",
            name:"total",tags:["main","total","control"],
            select:"TOTAL",access:true,calculate:true,
            tipe:"money",
            descripcion:"",
        },
        {
            value:"emit",panel:"bill",detail:"hide",
            name:"venta emitida a sunat",minWidth:250,
            select:"DOCUMENT_EMMIT",access:true,tags:["bill"],
            tipe:"options",options:op_sales_emitsunat,
            descripcion:"se emitio "+op_sales_document.map(op=>{return op.show}).join("/")+ " a sunat",
        },
        {
            value:"comment",panel:"info",
            name:"comentario",tags:["main","control"],
            select:"COMMENT",access:true,
            tipe:"comment",
            descripcion:"este comentario solo pueden ser visto por los usuarios",
        },
        {
            value:"itemId",tags:["item"],
            name:"vehiculo",//detail:"hide",
            select:"ID_ITEM",access:true,
            tipe:"optionsSearch",
            descripcion:"objeto asignado a la venta",
            /*load:{
                schema:sch_vehicles,
                tableMain:sch_vehicles.table,
                selects:[
                    {table:sch_vehicles.table,field:sch_vehicles.fieldPrimary,as:"value"},
                    {table:sch_vehicles.table,field:"PLACA",as:"show"},
                ],
            },*/
        },
        {
            value:"itemType",
            name:"tipo de objeto",
            select:"ID_ITEM_TYPE",access:false,
            tipe:"show",
            descripcion:"tipo de objeto asignado a la venta",
        },
        {
            value:"checkin",
            name:"check in asignado a la venta",
            select:"ID_CHECKIN",access:false,
            tipe:"show",
            descripcion:"checkin asignado a la venta",
        },
        {
            value:"worker",panel:"worker",
            name:"trabajador",
            select:"ID_WORK_PROCESS",access:"md-workers-sale",
            tipe:"optionsSearch",conect:{schema:sch_workers,type:"show"},
            load:ld_workers,
            descripcion:"trabajador asignado a la venta",
        },
        {
            value:"dscto",panel:"total",tags:["detail","total"],
            name:"descuento a la venta",
            select:"DSCTO",access:"md-sale-dscto",
            tipe:"porcent",
            descripcion:"",
        },
        {
            value:"totaldscto",panel:"total",calculate:true,
            name:"total sin descuento",tags:["detail","total"],
            select:"TOTAL_WITHOUT_DSCTO",access:true,
            tipe:"money",
            descripcion:"",
        },
        {
            value:"ruc",minWidth:120,
            name:"ruc",tags:["bill"],
            select:"ID_RUC",access:"md-bills-rucs",
            tipe:"options",load:{...ld_rucs},
            descripcion:"razon social con la cual se emitio la venta",
        },

    ],
}

//

const sch_recipe_inputs = {

    table:"recipe_input",
    fieldPrimary:"ID_RECIPE_INPUT",
    company:false,delete:true,
    fields:[
        {
            value:"product",
            name:"producto final",
            select:"ID_PRODUCT",access:true,
            tipe:"show",
            descripcion:"producto que se obtiene al final de la receta",
            
        },
        {
            value:"cant",
            name:"cantidad",
            select:"CANT",access:true,
            tipe:"cant",
            descripcion:"cantidad de producto/insumo utilizada en la receta",
        },
        {
            value:"supplie",
            name:"producto/insumo",minWidth:300,
            select:"ID_INPUT",access:true,
            tipe:"optionsSearch",
            descripcion:"producto/insumo que se utilizara en la receta",
            load:{
                name:"ld-insumos",
                tableMain:sch_items.table,
                selects:[
                    {table:sch_items.table,field:sch_items.fieldPrimary,as:"value"},
                    {sql:"CONCAT("+sch_items.table+".NAME,'(',unids.SIMBOL,')') AS 'show'"},
                ],
                conditions:[
                    {
                        table:sch_items.table,
                        before:"(",
                        field:"ID_PRODUCT_TIPE",
                        inter:"=",
                        value:2,
                    },
                    {
                        before:" OR ",
                        table:sch_items.table,
                        field:"ID_PRODUCT_TIPE",
                        inter:"=",
                        value:3,
                        after:") ",
                    },
                ],
                joins:[{
                    main:{table:sch_items.table,field:"UNID_ID"},
                    join:{table:"unids",field:"ID_UNID"},
                    tipe:"LEFT",
                }],
            }
            
        },
        {
            value:"costUnit",
            name:"costo unitario",
            select:"COST_UNIT",access:true,
            tipe:"money",
            descripcion:"costo unitario del producto/insumo utilizado en la receta",
        },
        {
            value:"costTotal",
            name:"costo total",
            select:"COST_TOTAL",access:true,
            tipe:"money",
            descripcion:"costo total del producto/insumo utilizado en la receta",
        },
    ],
}

const sch_produccion = {
    table:"produccions",record:{name:"produccion",title:"orden de producción"},
    fieldPrimary:"ID_PRODUCCION",
    company:true,delete:true,
    fields:[
        {
            value:"dateEmmit",
            name:"fecha de produccion",
            select:"DATE_EMMIT",access:true,
            tipe:"show",
            descripcion:"fecha en la cual se incio la produccion del item", 
        },
        {
            value:"productResult",
            name:"producto",minWidth:300,
            select:"ID_PRODUCT",access:true,
            tipe:"optionsSearch",
            descripcion:"item resultante de la produccion",
            load:{
                name:"ld-product",
                tableMain:sch_items.table,
                selects:[
                    {table:sch_items.table,field:sch_items.fieldPrimary,as:"value"},
                    {sql:"CONCAT("+sch_items.table+".NAME,'(',unids.SIMBOL,')') AS 'show'"},
                ],
                joins:[
                    {
                        main:{table:sch_items.table,field:"UNID_ID"},
                        join:{table:"unids",field:"ID_UNID"},
                        tipe:"LEFT",
                    }
                ],
                conditions:[
                    /*{
                        before:" ( ",
                        table:sch_items.table,
                        field:"ID_PRODUCT_TIPE",
                        inter:"=",
                        value:3,
                    },
                    {
                        before:" OR ",
                        table:sch_items.table,
                        field:"ID_PRODUCT_TIPE",
                        inter:"=",
                        value:4,
                    },
                    {
                        before:" OR ",
                        table:sch_items.table,
                        field:"ID_PRODUCT_TIPE",
                        inter:"=",
                        value:5,
                    },
                    {
                        before:" OR ",
                        table:sch_items.table,
                        field:"ID_PRODUCT_TIPE",
                        inter:"=",
                        value:1,
                        after:" ) "
                    },*/
                ],
            }, 
            
        },
        {
            value:"cantResult",
            name:"cantidad resultante",
            select:"RESULT_CANT",access:true,
            tipe:"cant",
            descripcion:"cantidad de items resultantes de la produccion", 
        },
        {
            value:"comment",
            name:"comentario",tipe:"comment",
            select:"COMMENT",access:true,
            descripcion:"",
        }
    ],
}

const sch_produccion_inputs = {
    table:"produccions_input",
    fieldPrimary:"ID_PRODUCCION_INPUT",
    company:false,delete:true,
    fields:[
        {
            value:"input",minWidth:300,
            name:"producto/insumos",
            select:"ID_INPUT",access:true,
            tipe:"optionsSearch",
            descripcion:"producto/insumo que se utiliza", 
            load:{
                name:"ld-product",
                tableMain:sch_items.table,
                selects:[
                    {table:sch_items.table,field:sch_items.fieldPrimary,as:"value"},
                    {sql:"CONCAT("+sch_items.table+".NAME,'(',unids.SIMBOL,')') AS 'show'"},
                ],
                joins:[
                    {
                        main:{table:sch_items.table,field:"UNID_ID"},
                        join:{table:"unids",field:"ID_UNID"},
                        tipe:"LEFT",
                    }
                ],
            },
        },
        {
            value:"cant",
            name:"cantidad utilizada",
            select:"CANT_TOTAL",access:true,
            tipe:"cant",
            descripcion:"cantidad del producto/insumo que se utiliza", 
        },
    ],
}

const sch_database = [
    tables = [
        sch_customers,
        sch_items,
        sch_produccion,
        sch_recipe_inputs,
        sch_sales,
        sch_unids,
        sch_vehicles,
    ],
    conections = [
        {
            main:{table:sch_items.table,field:"ID_PRODUCT"},
            join:{table:sch_produccion_inputs.table,field:"ID_PRODUCT"}},
    ],
];



//-----provieeders & buys---------

const sch_provideers = {
    record:{name:"provieeder",title:"proveedor"},
    table:"provideers",
    fieldPrimary:"ID_PROVIDEER",
    company:true,
    fields:[
        {
            value:"name",access:true,
            name:"nombre",tipe:"input",
            select:"NAME",tags:["main"],
            descripcion:"nombre del proveedor",
        },
        {
            value:"ruc",access:true,tags:["main"],
            name:"ruc",tipe:"input",
            select:"RUC",
            descripcion:"ruc del proveedor",
        },
    ],
}

const sch_buys_products = {
    record:{name:"item",title:"insumo"},
    table:"buys_products",
    fieldPrimary:"ID_BUY_PRODUCT",
    delete:true,
    fields:[
        {
            value:"idBuy",access:true,
            name:"id buy",tipe:"key",
            select:"ID_BUY",detail:"hide",
            descripcion:"",
        },
        {
            value:"item",access:true,
            name:"producto/insumo",tipe:"optionsSearch",
            select:"ID_PRODUCT",minWidth:300,
            descripcion:"",
            conect:{schema:sch_items,type:"edit"},
            load:{
                name:"ld-item",schema:sch_items,
                tableMain:sch_items.table,
                selects:[
                    {table:sch_items.table,field:sch_items.fieldPrimary,as:"value"},
                    {sql:("CONCAT("+sch_items.table+".NAME,' (',unids.SIMBOL,')') AS 'show'")},
                ],
                joins:[
                    {
                        main:{table:sch_items.table,field:"UNID_ID"},
                        join:{table:sch_unids.table,field:sch_unids.fieldPrimary},
                        tipe:"LEFT",
                    },
                ],
            },
        },
        {
            value:"cant",access:true,
            name:"cantidad",tipe:"cant",
            select:"CANT",maxWidth:100,
            descripcion:"",
        },
        {
            value:"costUnit",access:true,
            name:"costo unitario",tipe:"money",
            select:"COST_UNIT",minWidth:150,maxWidth:200,
            descripcion:"",
        },
        {
            value:"costTotal",access:true,
            name:"costo total",tipe:"money",
            select:"COST_TOTAL",minWidth:150,maxWidth:200,
            descripcion:"",
        },
    ],
    visuals:[
        {
            name:"detail-show",
            fields:[
                {value:"item",state:"show"},
                {value:"cant",state:"show"},
                {value:"costUnit",state:"show"},
                {value:"costTotal",state:"show"},
            ],
        },
        {
            name:"table-edit",
            fields:[
                {value:"item",state:"edit"},
                {value:"cant",state:"edit"},
                {value:"costUnit",state:"edit"},
                {value:"costTotal",state:"edit"},
            ],
        },
    ],
}

const sch_buys_payments = {
    table:"buys_payments",
    fieldPrimary:"ID_BUY_PAY",
    delete:true,
    fields:[
        {
            value:"idBuy",access:true,
            name:"id buy",tipe:"show",
            select:"ID_BUY",
            descripcion:"",
        },
        {
            value:"idPay",access:true,
            name:"id pay",tipe:"show",
            select:"ID_PAY",
            descripcion:"",
        },
    ],
    conections:[
        {schema:sch_pays}
    ],
}

const sch_buys = {
    record:{name:"buy",title:"compra"},
    table:"buys",
    fieldPrimary:"ID_BUY",
    company:true,
    fields:[
        {
            value:"date",access:true,
            name:"fecha de emision",tipe:"date",
            select:"DATE_EMMIT",panel:"info",
            descripcion:"",
        },
        {
            value:"state",access:true,
            name:"estado de compra",tipe:"options",
            select:"ID_BUY_STATUS",options:op_buys_status,
            descripcion:"",panel:"info",
        },
        {
            value:"provideer",access:true,
            name:"proveedor",tipe:"optionsSearch",
            select:"ID_PROVIDEER",panel:"info",
            descripcion:"",conect:{schema:sch_provideers,type:"edit"},
            load:{
                name:"ld-provideers",schema:sch_provideers,
                tableMain:sch_provideers.table,
                selects:[
                    {table:sch_provideers.table,field:sch_provideers.fieldPrimary,as:"value"},
                    {table:sch_provideers.table,field:"NAME",as:"show"},
                ],
            },
        },
        {
            value:"total",access:true,
            name:"total",tipe:"money",
            select:"TOTAL",panel:"total",
            descripcion:"",detail:"calculate",
        },
    ],
    
}

const sch_control_accounts = {
    table:"control_accounts",
    fieldPrimary:"ID_CONTROL_ACCOUNT",
    company:true,
    fields:[
        {
            value:"account",name:"cuenta",tipe:"options",
            select:"ID_ACCOUNT",access:true,
            descripcion:"",
            load:{
                name:"ld-accounts",
                tableMain:sch_accounts.table,
                selects:[
                    {table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"value"},
                    {table:sch_accounts.table,field:"NAME",as:"show"},
                ],
                conditions:[
                    {
                        table:sch_accounts.table,
                        field:"CONTROL_BY_OPEN",
                        inter:"=",
                        value:1,
                    }
                ],
            }
        },
        {
            value:"open_emmit",name:"fecha de apertura",tipe:"date",
            select:"DATE_EMMIT_OPEN",access:true,minWidth:200,
            descripcion:"",
        },
        {
            value:"open_total",name:"total de apertura",tipe:"money",
            select:"TOTAL_OPEN",access:true,
            descripcion:"",
        },
        {
            value:"status",name:"estado",tipe:"options",
            select:"OPEN",access:true,
            options:[
                {value:0,show:"cerrado",class:"rounded text-center bg-danger text-white"},
                {value:1,show:"abierto",class:"rounded text-center bg-success text-white"},
            ],
            descripcion:"",
        },
        {
            value:"close_emmit",name:"fecha de cierre",tipe:"date",
            select:"DATE_EMMIT_CLOSE",access:true,minWidth:200,
            descripcion:"",
        },
        {
            value:"close_total",name:"total de cierre",tipe:"money",
            select:"TOTAL_CLOSE",access:true,
            descripcion:"",
        },
        {
            value:"comment",name:"comentario",tipe:"comment",
            select:"COMMENT",access:true,
            descripcion:"",
        }
    ],
}



/*const schema = {
    tables:[
        sch_customers,
        sch_items,
        sch_sales,
    ],
    conections:[
        {
            main:{table:sch_sales.table,field:"ID_CUSTOMER"},
            join:{table:sch_customers.table,field:"ID_CUSTOMER"},
        },
    ],
}*/

