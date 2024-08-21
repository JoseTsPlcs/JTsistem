
const sch_customers = {
    
    table:"customers",
    fieldPrimary:"ID_CUSTOMER",
    fields:[
        {
            name:"nombre",select:'NAME',state:"show",width:250,access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"nombre del cliente"
        },
        {
            name:"empresa",select:'COMPANY',state:"show",width:100,access:"mod-customer-nro",
            edit:{box:{tipe:6,name:"empresa"},filter:{box:{...bx_input}}},
            show:{box:{...bx_shw}},
            filter:{box:{tipe:4,options:[{value:1,show:"empresa"},{value:0,show:"persona natural"}]}},
            descripcion:"si el cliente es empresa o persona natural",
        },
        {
            name:"nro documento",select:'NRO_DOCUMENT',state:"show",width:150,access:"mod-customer-nro",
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"nro del documento del dni/ruc"
        },
        {
            name:"celular",select:'PHONE',state:"show",width:150,access:"mod-customer-cel",
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"numero de celular del cliente",
        },
        {
            name:"direccion",select:'DIRECCION',state:"show",width:300,access:"mod-customer-dir",
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"direccion del cliente",
        },
        {
            name:"correo",select:'EMAIL',state:"show",width:300,access:"mod-customer-email",
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"correo del contacto del cliente"
        },
        {
            name:"descripcion",select:'DESCRIPCION',state:"show",width:300,access:"mod-customer-coment",
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
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
            name:"nombre del item",state:"show",
            select:"NAME",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:{...bx_input}},
            descripcion:"nombre del producto/servicio/insumo",
        },
        {
            name:"tipo",state:"show",
            select:"ID_PRODUCT_TIPE",access:true,
            edit:{box:{...bx_op({ops:op_products_tipe})}},
            show:{box:{...bx_shw,options:op_products_tipe}},
            filter:{box:{tipe:4,options:op_products_tipe}},
            descripcion:"puede ser producto/servicio/insumo",
        },
        {
            name:"etiqueta",state:"show",
            select:"ID_PRODUCT_TAG",access:true,
            edit:{box:{...bx_op({ops:[{value:1,show:"value1"}]})}},
            show:{box:{...bx_shw,options:[{value:1,show:"value1"}]}},
            filter:{box:{tipe:4,options:[{value:1,show:"value1"}]}},
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
            name:"unidad",state:"show",
            select:"UNID_ID",access:true,
            edit:{box:{...bx_op({ops:[]})}},
            show:{box:{...bx_shw,options:[]}},
            filter:{box:{tipe:4,options:[]}},
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
            name:"precio de venta",state:"show",width:130,
            select:"PRICE_UNIT",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_money}},
            filter:{box:null},
            descripcion:"precio unitario de venta",
        },
        {
            name:"costo unitario",state:"show",width:130,
            select:"COST_UNIT",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_money}},
            filter:{box:null},
            descripcion:"costo unitario, este campo se actualiza de acuerdo a las compras",
        },
        {
            name:"stock total",state:"show",width:70,
            select:"STOCK_TOTAL",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:null},
            descripcion:"stock actual del producto/insumo/servicio",
        },
        {
            name:"stock minimo",state:"show",width:70,
            select:"STOCK_LIMIT",access:true,
            edit:{box:{...bx_input}},
            show:{box:{...bx_shw}},
            filter:{box:null},
            descripcion:"stock minimo del producto/insumo/servicio, en caso el stock sea menor o igual, se lanza una alerta",
        },
        {
            name:"limite",state:"show",width:150,
            select:"STOCK_ONLIMIT",access:true,
            edit:{box:{...bx_active_input,name:"limite"}},
            show:{box:{...bx_shw,options:op_products_onlimit}},
            filter:{box:{tipe:4,options:op_products_onlimit}},
            descripcion:"los productos/servicio/insumo que tiene un stock menor o igual al minimo",
        },
        {
            name:"activo",state:"show",
            select:"ACTIVE",access:true,
            edit:{box:{...bx_active_input}},
            show:{box:{...bx_active_show}},
            filter:{box:{tipe:4,options:op_active}},
            descripcion:"si el producto/servicio/insumo esta activo, se puede vender o usar",
        },
    ],
    panels:[
        {tipe:"form",title:"item"},
        {tipe:"table",title:"lista de items"},
    ],
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
    fields:[
        {
            name:"fecha de emision",
            select:"DATE_EMMIT",access:true,
            tipe:"date",
            descripcion:"fecha de emision de la venta",
        },
        {
            name:"estado de venta",
            select:"ID_STATUS",access:true,
            tipe:"options",options:op_sales_status,
            descripcion:"estado de venta",
        },
        {
            name:"pagado",
            select:"PAID",access:true,
            tipe:"active",options:op_sales_paid,
            descripcion:"si la venta ya ha sido pagada",
        },
        /*{
            name:"cliente",width:300,
            table:"customers",select:"NAME",access:true,sql:"CONCAT(customers.NAME,'-',customers.NRO_DOCUMENT) AS 'NAME'",
            tipe:"show",
            descripcion:"cliente de la venta",
            conection:{
                joins:[
                    {
                        main:{table:"sales",field:"ID_CUSTOMER"},
                        join:{table:"customers",field:"ID_CUSTOMER"},
                    },
                ]
            },
        },*/
        {
            name:"documento",
            select:"ID_DOCUMENT",access:true,
            tipe:"options",options:op_sales_document,
            descripcion:"documento de emision a sunat (nota de pago/boleta/factura)",
        },
        {
            name:"total",
            select:"TOTAL",access:true,
            tipe:"money",
            descripcion:"total de de la venta",
        },
        {
            name:"venta emitida a sunat",width:250,
            select:"DOCUMENT_EMMIT",access:true,
            tipe:"active",options:[{value:0,show:"venta no emitida"},{value:1,show:"venta emitida a sunat"}],
            descripcion:"si ya se emitio (nota de pago/boleta/factura) a sunat",
        },
        {
            name:"comentario",with:300,
            select:"COMMENT",access:true,
            tipe:"comment",
            descripcion:"comentario que solo pueden ver el equipo",
        },
    ],
    panels:[
        {tipe:"",title:""},
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

