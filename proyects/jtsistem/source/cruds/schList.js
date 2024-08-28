

const sch_customers = {
    
    table:"customers",
    fieldPrimary:"ID_CUSTOMER",
    fields:[
        {
            value:"name",
            name:"nombre",
            select:'NAME',
            access:true,
            tipe:"input",
            width:350,
            descripcion:"nombre del cliente"
        },
        {
            value:"company",
            name:"empresa",
            select:'COMPANY',
            width:100,
            access:"md-customer-nro",
            tipe:"active",
            descripcion:"si el cliente es empresa o persona natural",
        },
        {
            value:"nroDoc",
            name:"nro documento",
            select:'NRO_DOCUMENT',
            width:150,
            access:"md-customer-nro",
            tipe:"input",
            descripcion:"nro del documento del dni/ruc",
        },
        {
            value:"cel",
            name:"celular",
            select:'PHONE',
            width:150,
            access:"md-customer-cel",
            tipe:"input",
            descripcion:"numero de celular del cliente",
        },
        {
            value:"dir",
            name:"direccion",
            select:'DIRECCION',
            width:300,
            access:"md-customer-dir",
            tipe:"input",
            descripcion:"direccion del cliente",
        },
        {
            value:"email",
            name:"correo",
            select:'EMAIL',
            width:300,
            access:"md-customer-email",
            tipe:"input",
            descripcion:"correo del contacto del cliente"
        },
        {
            value:"comment",
            name:"descripcion",
            select:'DESCRIPCION',
            width:300,
            access:"md-customer-coment",
            tipe:"input",
            descripcion:"descripcion del cliente",
        },
    ],
    panels:[
        {tipe:"table",title:"lista de clientes"},
        {tipe:"form",title:"cliente"},
    ],
}

function scr_customer_fm({parent,userData}) {
    return {
        ...scr_base({
            schema:sch_customers,
            panelTipe:"form",
            stateGeneral:"edit",
            userData,
            parent,
          }),
    };
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


const sch_items = {

    table:"products",
    fieldPrimary:"ID_PRODUCT",
    fields:[
        {
            value:"idItem",
            name:"id del item",state:"show",
            select:"ID_PRODUCT",access:true,
            tipe:"show",
            descripcion:"id del producto/servicio/insumo",
        },
        {
            value:"name",
            name:"nombre del item",state:"show",width:300,
            select:"NAME",access:true,
            tipe:"input",
            descripcion:"nombre del producto/servicio/insumo",
        },
        {
            value:"tipe",
            name:"tipo",state:"show",
            select:"ID_PRODUCT_TIPE",access:true,
            tipe:"options",options:op_products_tipe,
            descripcion:"puede ser producto/servicio/insumo",
        },
        {
            value:"tag",
            name:"etiqueta",state:"show",
            select:"ID_PRODUCT_TAG",access:"md-items-config",
            tipe:"options",
            descripcion:"etiqueta del producto/servicio/insumo",
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
            select:"UNID_ID",access:"md-items-config",
            tipe:"options",
            descripcion:"unidad del producto/servicio/insumo",
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
            name:"precio de venta",state:"show",width:130,
            select:"PRICE_UNIT",access:true,
            tipe:"money",
            descripcion:"precio unitario de venta",
        },
        {
            value:"costUnit",
            name:"costo unitario",state:"show",width:130,
            select:"COST_UNIT",access:"md-buy-general",
            tipe:"money",
            descripcion:"costo unitario, este campo se actualiza de acuerdo a las compras",
        },
        {
            value:"stock",
            name:"stock total",state:"show",width:70,
            select:"STOCK_TOTAL",access:"md-items-stock",
            tipe:"input",
            descripcion:"stock actual del producto/insumo/servicio",
        },
        {
            value:"limit",
            name:"stock minimo",state:"show",width:70,
            select:"STOCK_LIMIT",access:"md-items-stock",
            tipe:"input",
            descripcion:"stock minimo del producto/insumo/servicio, en caso el stock sea menor o igual, se lanza una alerta",
        },
        {
            value:"limitOn",
            name:"limite",state:"show",width:150,
            select:"STOCK_ONLIMIT",access:"md-items-stock",
            options:op_products_onlimit,
            tipe:"active",
            descripcion:"los productos/servicio/insumo que tiene un stock menor o igual al minimo",
        },
        {
            value:"active",
            name:"activo",state:"show",
            select:"ACTIVE",access:true,
            tipe:"active",options:op_active,
            descripcion:"si el producto/servicio/insumo esta activo, se puede vender o usar",
        },
        {
            value:"cantRecipe",
            name:"cantidad de receta",state:"show",
            select:"RECIPE_CANT",access:true,
            tipe:"input",
            descripcion:"cantidad que se obtiene al momento de realizar la receta",
        },
    ],
    panels:[
        {tipe:"form",title:"item"},
        {tipe:"table",title:"lista de items"},
    ],
}

const sch_unids = {

}

const sch_vehicles = {

    table:"items_vehicles",
    fieldPrimary:"ID_VEHICLE",
    fields:[
        {
            name:"placa",state:"show",width:100,
            select:"PLACA",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"placa del vehiculo",
        },
        {
            name:"marca",state:"show",width:100,
            select:"MARCA",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"marca del vehiculo",
        },
        {
            name:"modelo",state:"show",width:100,
            select:"MODELO",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"modelo del vehiculo",
        },
        {
            name:"nro de motor",state:"show",width:100,
            select:"NRO_MOTO",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"numero de motor",
        },
        {
            name:"nro de vin",state:"show",width:100,
            select:"NRO_VIN",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"numero de vin",
        },
        {
            name:"año",state:"show",width:100,
            select:"ANIO",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"año de fabricacion del vehiculo",
        },
        {
            name:"color",state:"show",width:100,
            select:"COLOR",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"color del vehiculo",
        },
    ],
    panels:[
        {tipe:"form",title:"vehiculo"},
        {tipe:"table",title:"lista de vehiculos"},
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

const sch_sales = {

    table:"sales",
    fieldPrimary:"ID_SALE",
    company:true,
    fields:[
        {
            value:"emmit",
            name:"fecha de emision",
            select:"DATE_EMMIT",access:true,
            tipe:"date",
            descripcion:"fecha de emision de la venta",
        },
        {
            value:"status",
            name:"estado de venta",
            select:"ID_STATUS",access:true,
            tipe:"options",options:op_sales_status,
            descripcion:"estado de venta",
        },
        {
            value:"pay",
            name:"pagado",
            select:"PAID",access:true,
            tipe:"active",options:op_sales_paid,
            descripcion:"si la venta ya ha sido pagada",
        },
        {
            value:"customer",
            name:"cliente",width:300,
            table:"customers",select:"ID_CUSTOMER",access:true,sql:"CONCAT(customers.NAME,'-',customers.NRO_DOCUMENT) AS 'NAME'",
            tipe:"optionsSearch",
            descripcion:"cliente de la venta",
        },
        {
            value:"doc",
            name:"documento",
            select:"ID_DOCUMENT",access:true,
            tipe:"options",options:op_sales_document,
            descripcion:"documento de emision a sunat (nota de pago/boleta/factura)",
        },
        {
            value:"total",
            name:"total",
            select:"TOTAL",access:true,
            tipe:"money",
            descripcion:"total de de la venta",
        },
        {
            value:"emit",
            name:"venta emitida a sunat",width:250,
            select:"DOCUMENT_EMMIT",access:true,
            tipe:"active",options:[{value:0,show:"venta no emitida"},{value:1,show:"venta emitida a sunat"}],
            descripcion:"si ya se emitio (nota de pago/boleta/factura) a sunat",
        },
        {
            value:"comment",
            name:"comentario",
            select:"COMMENT",access:true,
            tipe:"comment",
            descripcion:"comentario que solo pueden ver el equipo",
        },
        {
            value:"itemId",
            name:"objeto",
            select:"ID_ITEM",access:true,
            tipe:"show",
            descripcion:"objeto asignado a la venta",
        },
        {
            value:"itemType",
            name:"tipo de objeto",
            select:"ID_ITEM_TYPE",access:true,
            tipe:"show",
            descripcion:"tipo de objeto asignado a la venta",
        },
        {
            value:"checkin",
            name:"check in asignado a la venta",
            select:"ID_CHECKIN",access:true,
            tipe:"show",
            descripcion:"checkin asignado a la venta",
        },
        {
            value:"worker",
            name:"trabajador asignado a la venta",
            select:"ID_WORK_PROCESS",access:true,
            tipe:"options",
            descripcion:"trabajador asignado a la venta",
        },
        {
            value:"dscto",
            name:"descuento a la venta",
            select:"DSCTO",access:true,
            tipe:"cant",
            descripcion:"descuento a la venta",
        },
        {
            value:"totaldscto",
            name:"total sin descuento",
            select:"TOTAL_WITHOUT_DSCTO",access:true,
            tipe:"money",
            descripcion:"total sin contar descuento",
        },
        {
            value:"ruc",
            name:"ruc",
            select:"ID_RUC",access:true,
            tipe:"options",
            descripcion:"razon social con la cual se emitio la venta",
        },

    ],
}

const sch_sales_products = {
    table:"sales_products",
    fieldPrimary:"ID",
    fields:[
        {
            value:"saleId",
            name:"id de venta",
            select:"ID_SALE",access:true,
            tipe:"show",
            descripcion:"",
        },
        {
            value:"item",
            name:"producto/servicio a vender",width:500,
            select:"ID_PRODUCT",access:true,
            tipe:"optionsSearch",
            descripcion:"",
            load:{
                name:"ld-item",
                tableMain:sch_items.table,
                selects:[
                    {table:sch_items.table,field:sch_items.fieldPrimary,as:"value"},
                    {sql:("CONCAT("+sch_items.table+".NAME,' [tipo]',' [unid]') AS 'show'")},
                ],
            },
        },
        {
            value:"cant",
            name:"cantidad",
            select:"CANT",access:true,
            tipe:"cant",
            descripcion:"",
        },
        {
            value:"priceUnit",
            name:"precio unitario",
            select:"PRICE_UNIT",access:true,
            tipe:"money",
            descripcion:"",
        },
        {
            value:"priceTotal",
            name:"precio total",
            select:"PRICE_TOTAL",access:true,
            tipe:"money",
            descripcion:"",
        },
        {
            value:"checklist",
            name:"terminado",
            select:"CHECKLIST",access:true,
            tipe:"active",
            descripcion:"",
        },
        {
            value:"worker",
            name:"trabajador asignado",
            select:"ID_WORKER",access:true,
            tipe:"options",
            descripcion:"",
        },
    ],
}

const sch_recipe_inputs = {

    table:"recipe_input",
    fieldPrimary:"ID_RECIPE_INPUT",
    company:false,
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
            name:"producto/insumo",width:400,
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
    table:"produccions",
    fieldPrimary:"ID_PRODUCCION",
    company:true,
    fields:[
        {
            value:"dateEmmit",
            name:"fecha de produccion",
            select:"DATE_EMMIT",access:true,
            tipe:"date",
            descripcion:"fecha en la cual se incio la produccion del item", 
        },
        {
            value:"productResult",
            name:"producto",width:400,
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
                    {
                        table:sch_items.table,
                        field:"ID_PRODUCT_TIPE",
                        inter:"=",
                        value:3,
                    }
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
    ],
}

const sch_produccion_inputs = {
    table:"produccions_input",
    fieldPrimary:"ID_PRODUCCION_INPUT",
    company:false,
    fields:[
        {
            value:"input",width:400,
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

