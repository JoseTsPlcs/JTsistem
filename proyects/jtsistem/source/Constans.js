//---------options--------

const money_dolar_simbol = "$";
const money_sol_simbol = "S/.";
var money_use = money_sol_simbol;
const paddinForms = 3;

var items = [
    {name:"venta",title:"Venta",icon:""},
    {name:"insumos",title:"Insumos",incon:""},
];

var company_id = 0;
//var user_delete_data_import = true;

const op_company_type = [
    {value:1,show:"all"},
    {value:2,show:"taller"},
    {value:3,show:"inmobiliaria"},
    {value:4,show:"tienda"},
    {value:5,show:"consultorio"},
];

var op_access = [
    //...acess
    //...options,
];

var op_access_type = [
    //access type
];



const op_taller_check = [
    {value:1,show:""},
];

const op_sales_status = [
    {value:1,show:"cotizacion",class:"rounded text-center bg-secondary text-white"},
    {value:2,show:"confirmado",class:"rounded text-center bg-primary text-white"},
    {value:3,show:"en proceso",class:"rounded text-center bg-warning text-white"},
    {value:4,show:"terminado",class:"rounded text-center bg-success text-white"},
    {value:5,show:"anulado",class:"rounded text-center bg-danger text-white"},
];
const op_sales_paid = [
    {value:1,show:"pagado",class:"rounded text-center bg-success text-white"},
    {value:0,show:"sin pagar",class:"rounded text-center bg-danger text-white"},
];
const op_sales_document = [
    {value:1,show:"nota de pago"},
    {value:2,show:"boleta"},
    {value:3,show:"factura"},
];

const op_document_emmit = [
    {value:0,show:"sin emitir",class:"rounded text-center bg-danger text-white"},
    {value:1,show:"emitido",class:"rounded text-center bg-success text-white"}
];

const op_identity_document_tipe = [
    {value:0,show:"dni"},
    {value:1,show:"ruc"},
];
const op_products_tipe = [
    {value:1,show:"servicio",class:"rounded text-center bg-primary text-white"},
    {value:2,show:"insumo",class:"rounded text-center bg-warning text-white"},
    {value:3,show:"producto",class:"rounded text-center bg-success text-white"},
];
const op_buys_status = [
    {value:1,show:"cotizacion",class:"rounded text-center bg-secondary text-white"},
    {value:2,show:"confirmado",class:"rounded text-center bg-primary text-white"},
    {value:3,show:"en proceso",class:"rounded text-center bg-warning text-white"},
    {value:4,show:"entregado",class:"rounded text-center bg-success text-white"},
    {value:5,show:"anulado",class:"rounded text-center bg-danger text-white"},
];
const op_active = [
    {value:0,show:"desactivo",class:"rounded text-center bg-danger text-white"},
    {value:1,show:"activo",class:"rounded text-center bg-success text-white"},
];

const op_date_ranges = [
    {value:"day",show:"diario"},
    {value:"week",show:"semanal"},
    {value:"month",show:"mensual"},
    {value:"tri",show:"trimestre"},
];

const op_control_type = [
    {value:1,show:"abrir"},
    {value:0,show:"cerrar"},
];

const op_account_state = [
    {value:1,show:"abierto",class:"rounded text-center bg-success text-white"},
    {value:0,show:"cerrado",class:"rounded text-center bg-danger text-white"},
];

const op_inmuble_state = [
    {value:1,show:"en venta"},
    {value:2,show:"en alquiler"},
    {value:3,show:"en venta o alquiler"},
    {value:4,show:"vendido"},
    {value:5,show:"alquilado"},
    {value:6,show:"edificio publico"},
];

const op_tipo_inmueble = [
    {value:1,show:"terreno"},
    {value:2,show:"aires"},
    {value:3,show:"casa"},
    {value:4,show:"departamento"},
]



//--------boxs---------

const bx_shw = {tipe:0,value:"",class:"text-center"};
const bx_shw_activo = {tipe:0,value:0,options:[{value:0,show:"desactivo",class:"rounded text-center bg-danger text-white"},{value:1,show:"activo",class:"rounded text-center bg-success text-white"}]}

const bx_money = {tipe:0,class:"text-center",format:{decimals:2,start:money_use},value:0};
const bx_moneyh1 = {tipe:0,class:"h1 text-left",format:{decimals:2,start:money_use},value:0};
const bx_moneyh3 = {tipe:0,class:"h3 text-left",format:{decimals:2,start:money_use},value:0};

const bx_area_show = {tipe:0,class:"text-center",format:{decimals:2,end:"m2"},value:0};

const bx_income = {tipe:0,format:{decimals:2,start:money_use,limit:{value:0,less:{attributes:[{name:"class",value:"text-danger"}]},more:{attributes:[{name:"class",value:"text-success"}]}}},value:0};
const bx_incomeh1 = {tipe:0,format:{decimals:2,start:money_use,limit:{value:0,less:{attributes:[{name:"class",value:"h1 text-danger"}]},more:{attributes:[{name:"class",value:"h1 text-success"}]}}},value:0};

const bx_date = {tipe:2,value:Date_Today()};
const bx_date_start = {tipe:2,value:Date_FirstOfMoth()};
const bx_date_end = {tipe:2,value:Date_LastOfMoth()};

const bx_input = {tipe:1,class:"w-100 m-0 p-0",value:""};
const bx_cant = {tipe:1,class:"w-100 m-0 p-0 text-center",value:1};
const bx_active_input = {tipe:6,name:"activo",value:1};
const bx_active_show = {tipe:0,name:"activo",value:1,options:op_active};

function bx_op({ops}) {
    
    return {
        tipe:3,
        class:"w-100 m-0 p-0",
        options:ops,
        value:1,
    }
}

//------attributes-----

const att_btn = [{name:"class",value:"my-0 py-0"},{name:"style",value:"width: 50px"}];
const att_shw = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"width: 130px"}];
const att_date = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"width: 110px"}];
const att_ln = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"min-width:300px;"}];
const att_ln50 = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"min-width: 70px;"}];
const att_cnt = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"width: 50px"}];
const att_cnt2 = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"width: 100px"}];

//---------fields---------

const fld_delete = {name:"delete",box:{tipe:5,value:'<i class="bi bi-x-circle"></i>',class:"btn btn-danger btn-sm"},action:"delete",descripcion:"seleccionar para borrar registro"};
const fld_edit = {name:"edit",box:{tipe:5,value:'<i class="bi bi-pencil-square"></i>',class:"btn btn-primary btn-sm"},action:"edit",descripcion:"seleccionar para editar registro"};
const fld_add = {name:"add",box:{tipe:5,value:'<i class="bi bi-plus-circle"></i>',class:"btn btn-primary btn-sm"},action:"add",descriptcon:"seleccionar para añadir registro"};
const fld_show = {name:"add",box:{tipe:5,value:'<i class="bi bi-eye-fill"></i>',class:"btn btn-primary btn-sm"},action:"show",descripcion:"seleccionar para mostrar detalle del registro"};

function fld_ld_worker({panel="main",edit=true}){

    return {
        panel,
        name:"trabajador asignado",
        box:(edit?{tipe:8,class:"w-100",value:"null"}:{...bx_shw}),
        load:(edit?{name:ld_workers.name,show:"show",value:"value",startOptions:[{value:"null",show:"Seleccionar Trabajador"}]}:null),
        select:(edit?"ID_WORKER":"WORKER"),
    }
}

//---------filter

const flt_active = {name:"activo",box:{tipe:4,options:op_active,value:["activo"]}};
