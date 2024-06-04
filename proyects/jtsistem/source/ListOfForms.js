//---------options--------

var company_id = 1;
//var user_delete_data_import = true;

const op_company_type = [
    {value:1,show:"ecommerse"},
    {value:2,show:"taller"},
    {value:3,show:"inmobiliaria"},
];

var op_access = [
    {value:"acc-1",show:"borrar data importante"},
    {value:"acc-2",show:"actualizar lista de productos"},
    {value:"acc-3",show:"asignar precio a producto en venta"},
    {value:"acc-4",show:"modificar la apertura de los controles de cuentas"},
    {value:"acc-5",show:"modificar el cierre de los controles de cuentas"},
    {value:"acc-6",show:"modificar el total de cuentas"},
    {value:"acc-7",show:"modificar el estado de cuentas"},
    ...paginasOptions,
];

const op_taller_check = [
    {value:1,show:""},
];

const op_sales_status = [
    {value:1,show:"cotizacion",class:"rounded text-center bg-secondary text-white"},
    {value:2,show:"confirmado",class:"rounded text-center bg-primary text-white"},
    {value:3,show:"en proceso",class:"rounded text-center bg-warning text-white"},
    {value:4,show:"terminado",class:"rounded text-center bg-success text-white"},
    {value:5,show:"cancelado",class:"rounded text-center bg-danger text-white"},
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
    {value:1,show:"servicio"},
    {value:2,show:"insumo"},
    {value:3,show:"producto"},
];
const op_buys_status = [
    {value:1,show:"cotizacion",class:"rounded text-center bg-secondary text-white"},
    {value:2,show:"confirmado",class:"rounded text-center bg-primary text-white"},
    {value:3,show:"en proceso",class:"rounded text-center bg-warning text-white"},
    {value:4,show:"entregado",class:"rounded text-center bg-success text-white"},
    {value:5,show:"cancelado",class:"rounded text-center bg-danger text-white"},
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

const igvPorcent = 18;

function CalculateWithOutIgv(val) {
    
    return val / (1+igvPorcent/100);
}

function CalculateJustIgv(val){

    return val * igvPorcent/100;
}

//--------boxs---------

const bx_shw = {tipe:0,value:"",class:"text-center"};

const bx_money = {tipe:0,class:"text-center",format:{decimals:2,start:"S/."},value:0};
const bx_moneyh1 = {tipe:0,class:"h1 text-left",format:{decimals:2,start:"S/."},value:0};
const bx_moneyh3 = {tipe:0,class:"h3 text-left",format:{decimals:2,start:"S/."},value:0};

const bx_income = {tipe:0,format:{decimals:2,start:"S/.",limit:{value:0,less:{attributes:[{name:"class",value:"text-danger"}]},more:{attributes:[{name:"class",value:"text-success"}]}}},value:0};
const bx_incomeh1 = {tipe:0,format:{decimals:2,start:"S/.",limit:{value:0,less:{attributes:[{name:"class",value:"h1 text-danger"}]},more:{attributes:[{name:"class",value:"h1 text-success"}]}}},value:0};

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
const att_ln = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"min-width: 300px;"}];
const att_ln50 = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"min-width: 70px;"}];
const att_cnt = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"width: 50px"}];
const att_cnt2 = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"width: 100px"}];

//---------fields---------

const fld_delete = {name:"delete",box:{tipe:5,value:'<i class="bi bi-x-circle"></i>',class:"btn btn-danger btn-sm"},action:"delete"};
const fld_edit = {name:"edit",box:{tipe:5,value:'<i class="bi bi-pencil-square"></i>',class:"btn btn-primary btn-sm"},action:"edit"};
const fld_add = {name:"add",box:{tipe:5,value:'<i class="bi bi-plus-circle"></i>',class:"btn btn-primary btn-sm"},action:"add"};
const fld_show = {name:"add",box:{tipe:5,value:'<i class="bi bi-eye-fill"></i>',class:"btn btn-primary btn-sm"},action:"show"};


//---------filter

const flt_active = {name:"activo",box:{tipe:4,options:op_active,value:["activo"]}};


//---------stateTools-----------

const stTls_tb = [
    {
        name:"reload",
        tools:[
            {name:"config",show:true},
            {name:"load",show:true},
            
            {name:"excel",show:false},
            {name:"pdf",show:false},

            {name:"sizes",show:true,value:10},
            {name:"reload",show:true},
            {name:"update",show:false},
            {name:"new",show:true},
            {name:"insert",show:false},
            {name:"cancel",show:false},
            
            {name:"pages",show:true},
        ],
    }
];

const stTls_fm_maid = [
    {
        name:"reload",
        tools:[
            {name:"config",show:false},
            {name:"load",show:false},
            
            {name:"excel",show:false},
            {name:"pdf",show:false},

            {name:"sizes",show:false,value:999},
            {name:"reload",show:true},
            {name:"update",show:true},
            {name:"new",show:false},
            {name:"insert",show:false},
            {name:"cancel",show:true},
            
            {name:"pages",show:false},
        ],
    }
];

const stTls_tb_maid = [
    {
        name:"reload",
        tools:[
            {name:"config",show:false},
            {name:"load",show:false},
            
            {name:"excel",show:false},
            {name:"pdf",show:false},

            {name:"sizes",show:false,value:999},
            {name:"reload",show:false},
            {name:"update",show:false},
            {name:"new",show:true},
            {name:"insert",show:false},
            {name:"cancel",show:false},
            
            {name:"pages",show:false},
        ],
    }
];

const stTls_tb_all = [
    {
        name:"reload",
        tools:[
            {name:"config",show:true},
            {name:"load",show:true},
            
            {name:"excel",show:false},
            {name:"pdf",show:false},

            {name:"sizes",show:false,value:999},
            {name:"reload",show:false},
            {name:"update",show:false},
            {name:"new",show:false},
            {name:"insert",show:false},
            {name:"cancel",show:false},
            
            {name:"pages",show:false},
        ],
    },
];

const stTls_fm_master = [
    {
        name:"reload",
        tools:[
            {name:"config",show:false},
            {name:"load",show:true},
            
            {name:"excel",show:false},
            {name:"pdf",show:false},

            {name:"sizes",show:false,value:1},
            {name:"reload",show:true},
            {name:"update",show:true},
            {name:"new",show:true},
            {name:"insert",show:false},
            {name:"cancel",show:false},
            
            {name:"pages",show:false},
        ],
    },
    {
        name:"new",
        tools:[
            {name:"config",show:false},
            {name:"load",show:true},
            
            {name:"excel",show:false},
            {name:"pdf",show:false},

            {name:"sizes",show:false,value:1},
            {name:"reload",show:false},
            {name:"update",show:false},
            {name:"new",show:false},
            {name:"insert",show:true},
            {name:"cancel",show:false},
            
            {name:"pages",show:false},
        ],
    }
];

const stTls_tb_show = [
    {
        name:"reload",
        tools:[
            {name:"config",show:false},
            {name:"load",show:false},
            
            {name:"excel",show:false},
            {name:"pdf",show:false},

            {name:"sizes",show:false,value:999},
            {name:"reload",show:false},
            {name:"update",show:false},
            {name:"new",show:false},
            {name:"insert",show:false},
            {name:"cancel",show:false},
            
            {name:"pages",show:false},
        ],
    },
  ];

//----loads--

var ld_products = {
    name:"products",
    tableMain:"products",
    selects:[
        {table:'products', field:'ID_PRODUCT',as:"value"},
        {table:'products', field:'NAME',as:"show"},
    ],
    conditions:[
        {
            table:"products",
            field:"ID_COMPANY",
            inter:"=",
            value:company_id,
        }
    ],
};

var ld_supplies = {
    name:"supplies",
    tableMain:"products",
    selects:[
        {table:'products', field:'ID_PRODUCT',as:"value"},
        {table:'products', field:'NAME',as:"show"},
    ],
    conditions:[
        {
            table:"products",
            field:"ID_PRODUCT_TIPE",
            inter:"=",
            value:2,
        },
    ],
};

var ld_supplies_products = {
    name:"ld-supplies-products",
    tableMain:"products",
    selects:[
        {table:'products', field:'ID_PRODUCT',as:"value"},
        {table:'products', field:'NAME',as:"show"},
    ],
    conditions:[
        {
            before:"(",
            table:"products",
            field:"ID_PRODUCT_TIPE",
            inter:"=",
            value:2,
        },
        {
            before:" OR ",
            table:"products",
            field:"ID_PRODUCT_TIPE",
            inter:"=",
            value:3,
            after:") "
        },
        {
            before:" AND ",
            table:"products",
            field:"ACTIVE",
            inter:"=",
            value:1,
        },
        {
            before:" AND ",
            table:"products",
            field:"ID_COMPANY",
            inter:"=",
            value:company_id,
        },
    ],
};

var ld_unids = {
    name:"ld-unids",
    tableMain:"unids",
    selects:[
        {table:'unids', field:'ID_UNID',as:"value"},
        {table:'unids', field:'SIMBOL',as:"show"},
    ],
}

var ld_accounts = {
    name:"accounts",
    tableMain:"accounts",
    selects:[
        {table:'accounts', field:'ID_ACCOUNT',as:"value"},
        {table:'accounts', field:'NAME',as:"show"},
    ],
    conditions:[
        {
            table:"accounts",
            field:"ACTIVE",
            inter:"=",
            value:1
        },
    ],
}

var ld_pay_tag = {
    name:"pay_tag",
    tableMain:"pay_tag",
    selects:[
        {table:'pay_tag', field:'ID_PAY_TAG',as:"value"},
        {table:'pay_tag', field:'NAME',as:"show"},
        {table:'pay_tag', field:'INCOME',as:"income"},
    ],
    conditions:[
        {
            table:"pay_tag",
            field:"ACTIVE",
            inter:"=",
            value:1
        },
    ],
}

var ld_products_tags = {
    name:"ld-products_tags",
    tableMain:"products_tags",
    selects:[
      {table:'products_tags', field:'ID_PRODUCT_TAG',as:"value"},
      {table:'products_tags', field:'NAME',as:"show"},
    ]
};

//------config----

var config_filters_products = [
    {name:"producto",box:bx_input,select:{table:"products",field:"NAME"}},
    {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"}},
    {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"}},
    {...flt_active,select:{table:"products",field:"ACTIVE"}},
    {name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"unids",show:"show"}},
];

var config_filters_products_supplies = [
    {name:"producto",box:bx_input,select:{table:"products",field:"NAME"}},
    {name:"tipo",box:{tipe:4,options:op_products_tipe,value:['insumo','producto']},select:{table:"products",field:"ID_PRODUCT_TIPE"}},
    {...flt_active,select:{table:"products",field:"ACTIVE"}},
    {name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"unids",show:"show"}},
];

//-----scripts-----

function scr_pay({tags=[],tagValue=1,events=[]}) {
    
    return {
        title:"pago",
        panels:[{col:12,y:0,title:"main",tipe:"form"}],
        stateStart:"block",
        afterUpdate:"block",
        afterInsert:"block",
        afterCancel:"block",
        stateTools:stTls_fm_maid,

        tableMain:"payments",
        selects:[
            {table:'payments', field:'ID_PAY',primary:true},
            {table:'payments', field:'DATE_EMMIT'},
            {table:'payments', field:'TOTAL'},
            {table:'payments', field:'INCOME'},
            {table:'payments', field:'ID_ACCOUNT'},
            {table:'payments', field:'ID_PAY_TAG'},
        ],
        inserts:[
            ...ins_general,
            {
                field:"DATE_EMMIT",
                value:Date_Today(),
            }
        ],
        loads:[
            {
                name:"pay_tag",
                tableMain:"pay_tag",
                selects:[
                    {table:'pay_tag', field:'ID_PAY_TAG',as:"value"},
                    {table:'pay_tag', field:'NAME',as:"show"},
                    {table:'pay_tag', field:'INCOME',as:"income"},
                ],
                conditions:[
                    {
                        table:"pay_tag",
                        field:"ACTIVE",
                        inter:"=",
                        value:1
                    },
                    {
                        before:" AND ",
                        table:"pay_tag",
                        field:"ID_COMPANY",
                        inter:"=",
                        value:company_id,
                    },
                ],
            },
            {
                name:"ld-accounts",
                tableMain:"accounts",
                selects:[
                    {table:"accounts",field:"ID_ACCOUNT",as:"value"},
                    {table:"accounts",field:"NAME",as:"show"},
                    {table:"accounts",field:"OPEN",as:"open"},
                    {table:"accounts",field:"CONTROL_BY_OPEN",as:"open_control"},
                ],
                conditions:[
                    {
                        table:"accounts",
                        field:"ACTIVE",
                        inter:"=",
                        value:1
                    },
                    {
                        before:" AND ",
                        table:"accounts",
                        field:"ID_COMPANY",
                        inter:"=",
                        value:company_id,
                    },
                ],
            }
        ],

        fields:[
            //{panel:"main",col:12,y:0,name:"id",box:bx_shw,select:"ID_PAY"},
            {panel:"main",col:12,y:1,name:"fecha de emision",box:{tipe:0,value:Date_Today()},select:"DATE_EMMIT"},
            {panel:"main",col:12,y:2,name:"total",box:bx_input,select:"TOTAL"},
            //{panel:"main",col:12,name:"ingreso/egreso",box:{tipe:6,name:"ingreso"},select:"INCOME"},
            {panel:"main",tipe:1,name:"ingreso/egreso",box:{tipe:0,value:0,options:[{value:0,show:"egreso",class:"text-danger"},{value:1,show:"ingreso",class:"text-success"}]},select:"INCOME"},
            {panel:"main",tipe:1,col:12,y:2,name:"cuenta",box:bx_op({ops:[]}),select:"ID_ACCOUNT",load:{name:"ld-accounts",value:"value",show:"show"}},
            {panel:"main",tipe:1,col:12,y:2,name:"etiqueta",box:{...bx_op({ops:[]}),value:tagValue},select:"ID_PAY_TAG",load:{name:"pay_tag",show:"show"}},
        ],
        events:[
            ...events,
            {
                name:"setOptionsToFields",
                actions:[{
                    action:({k,field,loadOptions})=>{

                        if(tags.length>0){

                            var ops = tags.map((tg)=>{

                                return loadOptions.find(ld=>ld.show==tg);
                            });
                            loadOptions = ops;
                        }

                        return {loadOptions}
                    }
                }]
            },
            {
                name:"setIncome",
                actions:[{
                    name:"base",
                    action:({k})=>{

                        var tagId = k.GetValues({fieldName:"etiqueta"})[0];
                        var tagLoad = k.Loaded_GetLoadData({loadName:"pay_tag"});
                        console.log(tagLoad);
                        var tagData = tagLoad.result;
                        var tagSelected = tagData.find(ln=>ln["value"]==tagId);
                        if(tagSelected){

                            var income = tagSelected["income"];
                            k.SetValuesToBox({values:[income],fieldName:"ingreso/egreso"});

                            var primary = k.Reload_GetPrimaryValues({})[0];
                            //console.log("pay -> ingreso:",income,",primary:",primary);
                            k.Update_AddChange({
                                fieldName:"ingreso/egreso",
                                value:income,
                                primary,
                            });
                        }
                    }
                }]
            },
            {
                name:"insertBefore",
                actions:[{
                    action:({k,inserts})=>{

                        var account_result = k.Loaded_GetLoadData({loadName:"ld-accounts"}).result;
                        var account_id = k.GetValue({fieldName:"cuenta",y:0});
                        var account_data = account_result.find(rst=>rst.value==account_id);

                        console.log(account_data);

                        if(account_data && account_data.open_control == "1" && account_data.open == "0"){

                            alert("no se puede ingresar registros a una cuenta sin abrir");
                            return {block:true};
                        }

                        if(account_data == null){
                            alert("data de account is null");
                            return {block:true};
                        }

                        var income = k.GetValue({fieldName:"ingreso/egreso",y:0});
                        inserts.push({
                            field:"INCOME",
                            value:income,
                        });

                        return {inserts};
                    }
                }]
            },
            {
                name:"boxUpdate",
                actions:[{
                    action:({field,k})=>{

                        if(field.name=="etiqueta"){

                            k.CallEvent({name:"setIncome"});
                        }
                    }
                }]
            },
            {
                name:"newAfter",
                actions:[{
                    action:({k})=>{

                        k.CallEvent({name:"setIncome"});
                    }
                }]
            },
            {
                name:"printAfter",
                actions:[{
                    name:"set income",
                    //order:-999,
                    action:({k})=>{

                        console.log("set income!!!!");
                        k.CallEvent({name:"setIncome"});
                    }
                }],
            },
        ],
    }
}

function scr_fm_pays({parent,head=true,tableName,priFieldName,joinFieldName,events=[]}) {
    
    return {

        parent,head,
        title:"lista de pagos",
        panels:[{col:12,y:0,title:"main",tipe:"table",h:600}],
        stateTools:stTls_tb_maid,
        stateStart:"block",

        tableMain:tableName,
        selects:[
            {table:tableName, field:priFieldName,primary:true},
            {table:tableName, field:joinFieldName},
            {table:tableName, field:'ID_PAY'},
            {table:"payments",field:"DATE_EMMIT"},
            {table:"payments",field:"TOTAL"},
            {table:"payments",field:"INCOME"},
            {table:"pay_tag",field:"NAME",as:"TAG_NAME"},
        ],
        joins:[
            {
                main:{table:tableName,field:"ID_PAY"},
                join:{table:"payments",field:"ID_PAY"},
                tipe:"LEFT",
            },
            {
                main:{table:"payments",field:"ID_PAY_TAG"},
                join:{table:"pay_tag",field:"ID_PAY_TAG"},
                tipe:"LEFT",
            }
        ],

    
        fields:[
            {panel:"main",...fld_delete},
            {panel:"main",...fld_edit},
            //{panel:"main",name:"id",box:{tipe:0},select:"ID_BUY_PAY"},
            //{panel:"main",name:"id compra",box:{tipe:0},select:"ID_BUY"},
            //{panel:"main",name:"id pago",box:{tipe:0},select:"ID_PAY"},
            {panel:"main",name:"fecha de emision",box:bx_shw,select:"DATE_EMMIT"},
            {panel:"main",name:"total",box:bx_income,select:"TOTAL"},
            {panel:"main",name:"etiqueta",box:bx_shw,select:"TAG_NAME"},
        ],
        events:[
            ...events,
            {
                name:"printBefore",
                actions:[{
                    action:({result})=>{

                        //console.log("print before",result);

                        result.forEach(rst => {
                            
                            var income = rst["INCOME"];
                            var total = parseFloat(rst["TOTAL"]);
                            rst["TOTAL"] = (income==1?1:-1)*total;

                            //console.log(income,total,rst["TOTAL"]);
                        });

                        return {data:result};
                    }
                }]
            }
        ],
    }

}

var scr_sales_control = {
    
    title:"control de ventas",
    panels:[{col:12,y:0,title:"main",tipe:"table"}],
    stateTools:stTls_tb_all,

    tableMain:"sales",
    selects:[
      {table:'sales', field:'ID_SALE',primary:true},
      {table:'sales', field:'DATE_EMMIT'},
      {table:'sales', field:'ID_STATUS'},
      {table:'sales', field:'ID_DOCUMENT'},
      {table:'sales', field:'ID_CUSTOMER'},
      {table:'sales', field:'TOTAL'},
      {table:'sales', field:'DOCUMENT_EMMIT'},
      {table:'customers',field:'NAME'},
    ],
    joins:[
      {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"}
    ],

    configShow:true,
    filters:[
      {col:12,y:0,name:"cliente",box:bx_input,select:{table:"customers",field:"NAME"}},
      {col:6,y:1,name:"fecha min",box:bx_date,select:{table:"sales",field:"DATE_EMMIT",tipe:"min"}},
      {col:6,y:1,name:"fechamax",box:bx_date,select:{table:"sales",field:"DATE_EMMIT",tipe:"max"}},
      {col:12,y:2,name:"estado",box:{tipe:4,options:op_sales_status},select:{table:"sales",field:"ID_STATUS"}},
      {col:12,y:2,name:"documento",box:{tipe:4,options:op_sales_document},select:{table:"sales",field:"ID_DOCUMENT"}},
      {col:12,name:"emitido",box:{tipe:4,options:op_document_emmit},select:{table:"sales",field:"DOCUMENT_EMMIT"}},
    ],
    fields:[
      //{panel:"main",name:"id",box:{tipe:0},select:"ID_SALE"},

      {panel:"main",...fld_edit},
      {panel:"main",name:"cliente",box:{tipe:0},select:"NAME"},
      {panel:"main",name:"estado",box:{tipe:0,options:op_sales_status},select:"ID_STATUS"},
      {panel:"main",name:"total",box:bx_money,select:"TOTAL"},
      {panel:"main",name:"documento",box:{tipe:0,options:op_sales_document},select:"ID_DOCUMENT"},
      {panel:"main",name:"fecha de emision",box:{tipe:0},select:"DATE_EMMIT"},
      {panel:"main",name:"emitido",box:{tipe:0,options:op_document_emmit},select:"DOCUMENT_EMMIT"},
    ],


}

function scr_admin({id_company,parent}){

    var gr = new Grid({
        parent,
        cols:[
          [8,4],
          [12],
        ],
    });

    var prnt_users = gr.GetColData({x:0,y:0}).col;
    var prnt_clss = gr.GetColData({x:1,y:0}).col;
    var prnt_accs = gr.GetColData({x:0,y:1}).col;

    new ConsCruds({
        cruds:[
            {
                name:"users",
                active:true,
                script:{
                    parent:prnt_users,
                    title:"lista de usuarios",
                    panels:[{col:12,y:0,title:"main",tipe:"table"}],
                    stateTools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"config",show:true},
                            {name:"load",show:true},
                            
                            {name:"excel",show:false},
                            {name:"pdf",show:false},
                
                            {name:"sizes",show:true,value:10},
                            {name:"reload",show:true},
                            {name:"update",show:false},
                            {name:"new",show:true},
                            {name:"insert",show:false},
                            {name:"cancel",show:false},
                            
                            {name:"pages",show:false},
                        ],
                    }
                    ],

                    tableMain:"users",
                    selects:[
                    {table:"users",field:"ID_USER",primary:true},
                    {table:"users",field:"NAME"},
                    {table:"users",field:"PASSWORD"},
                    {table:"users",field:"ACTIVE"},
                    {table:"users",field:"ID_CLASS"},
                    ],
                    conditions:[
                    {
                        table:"users",
                        field:"ID_COMPANY",
                        inter:"=",
                        value:id_company,
                    }
                    ],
                    inserts:[
                    {field:"ID_COMPANY",value:id_company},
                    ],
                    loads:[
                    {
                        name:"ld-class",
                        tableMain:"class",
                        selects:[
                        {table:"class",field:"ID_CLASS",as:"value"},
                        {table:"class",field:"NAME",as:"show"},
                        ],
                        conditions:[
                        {
                            table:"class",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:id_company
                        }
                        ],
                    }
                    ],

                    fields:[
                        //{panel:"main",...fld_delete},
                        {panel:"main",name:"usuario",box:{tipe:1},select:"NAME"},
                        {panel:"main",name:"clase",box:{tipe:3},select:"ID_CLASS",load:{name:"ld-class",show:"show",value:"value"}},
                        {panel:"main",name:"contraseña",box:{tipe:1},select:"PASSWORD"},
                        {panel:"main",name:"activo",box:bx_active_input,select:"ACTIVE"},
                    ],

                }
            },
            {
                name:"class",
                active:true,
                script:{
                    parent:prnt_clss,
                    title:"lista de classes",
                    panels:[{col:12,y:0,title:"main",tipe:"table"}],
                    stateTools:[
                        {
                            name:"reload",
                            tools:[
                                {name:"config",show:true},
                                {name:"load",show:true},
                                
                                {name:"excel",show:false},
                                {name:"pdf",show:false},
                    
                                {name:"sizes",show:true,value:10},
                                {name:"reload",show:true},
                                {name:"update",show:false},
                                {name:"new",show:true},
                                {name:"insert",show:false},
                                {name:"cancel",show:false},
                                
                                {name:"pages",show:false},
                            ],
                        }
                    ],

                    tableMain:"class",
                    selects:[
                        {table:"class",field:"ID_CLASS",primary:true},
                        {table:"class",field:"NAME"},
                    ],
                    conditions:[
                        {
                            table:"class",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:id_company,
                        }
                    ],
                    inserts:[
                        {field:"ID_COMPANY",value:id_company},
                    ],

                    fields:[
                        //{panel:"main",...fld_delete},
                        {panel:"main",name:"clase",box:{tipe:1,class:"w-100"},select:"NAME"},
                        {panel:"main",name:"btn",box:{tipe:5,value:'actualizar accesos',class:"btn btn-outline-primary btn-sm"},action:"update_access"},
                    ],
                    events:[
                        {
                            name:"insertAfter",
                            actions:[{
                            action:({k,field,value})=>{

                                k.Loading_SetActive({active:true});

                                var count = 0;
                                var total = op_access.length;

                                for (let t = 0; t < total; t++) {
                                
                                var conection = k.Conection_Get();
                                var sql = conection.GetSql_Insert({
                                    tableMain:"class_access",
                                    inserts:[
                                    {field:"ID_CLASS",value},
                                    {field:"ID_ACCESS",value:op_access[t].value},
                                    {field:"ACTIVE",value:1},
                                    ],
                                });
                                conection.Request({
                                    sql,php:"success",
                                    success:()=>{

                                    OneInserted();
                                    }
                                })
                                
                                }

                                function OneInserted() {
                                
                                count++;
                                if(count>=total){

                                    k.Loading_SetActive({active:false});
                                }
                                }
                                
                            }
                            }]
                        },
                        {
                            name:"boxUpdate",
                            actions:[{
                                action:({k,field,y})=>{

                                    if(field.action=="update_access"){

                                        k.Loading_SetActive({active:true});
                                        var class_id = k.Reload_GetData({})[y]["ID_CLASS"];
                                        var conection = k.Conection_Get({});

                                        conection.Request({
                                            php:"success",
                                            sql:conection.GetSql_Delete({
                                                tableMain:"class_access",
                                                conditions:[{
                                                    table:"class_access",
                                                    field:"ID_CLASS",
                                                    inter:"=",
                                                    value:class_id,
                                                }],
                                            }),
                                            success:()=>{

                                                var inserts = op_access.map(op=>{

                                                    return {
                                                        field:"ID_ACCESS",
                                                        value:op.value,
                                                        tipe:"values",
                                                    };
                                                });
                                                inserts.push({
                                                    field:"ID_CLASS",
                                                    value:class_id,
                                                    tipe:"const",
                                                });

                                                conection.Request({
                                                    php:"success",
                                                    sql:conection.GetSql_Insert({
                                                        tableMain:"class_access",
                                                        inserts,
                                                    }),
                                                    success:()=>{

                                                        k.Loading_SetActive({active:false});
                                                    }
                                                });
                                            }
                                        });

                                    }
                                }
                            }]
                        }
                    ],
                }
            },
            {
                name:"access",
                active:true,
                script:{
                    parent:prnt_accs,
                    title:"control de accesos",
                    panels:[{col:12,y:0,title:"main",tipe:"table",h:500}],
                    stateTools:[
                    {
                        name:"reload",
                        tools:[
                            {name:"config",show:true},
                            {name:"load",show:true},
                            
                            {name:"excel",show:false},
                            {name:"pdf",show:false},
                
                            {name:"sizes",show:true,value:10},
                            {name:"reload",show:true},
                            {name:"update",show:false},
                            {name:"new",show:false},
                            {name:"insert",show:false},
                            {name:"cancel",show:false},
                            
                            {name:"pages",show:false},
                        ],
                    }
                    ],

                    tableMain:"class_access",
                    selects:[
                        {table:"class_access",field:"ID_CLASS_ACCESS",primary:true},
                        {table:"class_access",field:"ID_CLASS"},
                        {table:"class_access",field:"ID_ACCESS"},
                        {table:"class_access",field:"ACTIVE"},
                    ],
                    orders:[
                        {field:"ID_CLASS",asc:true},
                    ],
                    inserts:[],
                    loads:[
                        {
                            name:"ld-class",
                            tableMain:"class",
                            selects:[
                                {table:"class",field:"ID_CLASS",as:"value"},
                                {table:"class",field:"NAME",as:"show"},
                            ],
                            conditions:[
                                {
                                    table:"class",
                                    field:"ID_COMPANY",
                                    inter:"=",
                                    value:id_company
                                }
                            ],
                        }
                    ],

                    configShow:true,
                    filters:[
                        {name:"clase",box:{tipe:3},select:{table:"class_access",field:"ID_CLASS"},load:{name:"ld-class",show:"show",value:"value"}},
                        //{name:"accesso",box:{tipe:3},select:{table:"id_"}}
                    ],
                    fields:[
                        //{panel:"main",name:"clase",box:{tipe:3,class:"w-100"},select:"ID_CLASS",load:{name:"ld-class",show:"show",value:"value"}},
                        {panel:"main",name:"acceso",box:{tipe:0,options:op_access},select:"ID_ACCESS"},
                        {panel:"main",name:"activo",box:bx_active_input,select:"ACTIVE"},
                    ],

                    events:[
                        {
                            name:"insertBefore",
                            actions:[{
                                action:({k,inserts=[]})=>{

                                    var id_class = k.Filters_Get().Filter_GetBox({filterName:"clase"}).GetValue();
                                    inserts.push({
                                        field:"ID_CLASS",
                                        value:id_class,
                                    });

                                    return {inserts}
                                }
                            }]
                        }
                    ],
                }
            }
        ],
    });

}


//--------------------

var cnds_products = [{
    before:" AND ",
    table:"products",
    field:"ID_COMPANY",
    inter:"=",
    value:1999,
}];

var ins_general = [{
    field:"ID_COMPANY",
    value:1,
}];

function ListOfForm_UserLog(userData) {
    
    //console.log("listofform userlog");
    company_id = userData.company.id;

    cnds_products[0].value = userData.company.id;
    ins_general[0].value = userData.company.id;

    ld_unids.conditions = [{
        table:"unids",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    }];

    ld_products_tags.conditions = [{
        table:"products_tags",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    }];

    ld_supplies.conditions.push({
        before:" AND ",
        table:"products",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    });

    ld_pay_tag.conditions.push({
        before:" AND ",
        table:"pay_tag",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    });

    ld_accounts.conditions.push({
        before:" AND ",
        table:"accounts",
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    });
}

function UserLog_ChangePagesByCompany(userData){

    switch (userData.company.tipe) {
        case "1":
            
            paginas[0].paginas[0].show = false;
            paginas[0].paginas[1].show = false;

        break;

        case "2":

        console.log("asdaksdmasd");

            paginas[0].seccion = '<i class="bi bi-wrench-adjustable"></i> taller';
            paginas[0].paginas[2].name = "ordenes de trabajo/cotizaciones";
            paginas[0].paginas[3].name = "nueva orden/cotizacion";
            paginas[0].paginas[4].name = "ordenes de trabajos";
            paginas[0].paginas[5].name = "trabajos por cobrar";

            paginas[3].paginas[3].show = false;
            paginas[3].paginas[4].show = false;

        break;
    }

}

functionOnlogPage.push(ListOfForm_UserLog);
functionOnlogPage.push(UserLog_ChangePagesByCompany);


//------------pdf----------

/*
const invoiceData = {
    invoiceNumber: '001-001-0000001',
    invoiceDate: '01/06/2024',
    companyName: 'Razón Social S.A.',
    companyRUC: '12345678901',
    companyAddress: 'Calle Falsa 123',
    companyPhone: '555-1234',
    customerName: 'Juan Pérez',
    customerDocumentType: 'DNI',
    customerDocumentNumber: '12345678',
    customerPhone: '555-5678',
    customerAddress: 'Av. Principal 456',
    items: [
        { detail: 'Servicio de Consultoría', type: 'Servicio', quantity: 1, unitPrice: 150, totalPrice: 150 },
        { detail: 'Producto 1', type: 'Producto', quantity: 2, unitPrice: 50, totalPrice: 100 },
        { detail: 'Producto 2', type: 'Producto', quantity: 1, unitPrice: 200, totalPrice: 200 }
    ]
};
*/
async function generateInvoicePDF(invoiceData) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a3');  // Mantener tamaño A3

    const margin = 40;
    const startY = 50;
    const lineHeight = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;

    const fontSizeNormal = 12 * 0.85;  // Incremento del 15%
    const fontSizeHeader = 20 * 0.85;  // Incremento del 15%

    // Header
    pdf.setFontSize(fontSizeHeader);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Factura', margin, startY);

    // Company Details
    pdf.setFontSize(fontSizeNormal);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Número de Factura: ${invoiceData.invoiceNumber}`, margin, startY + 2 * lineHeight);
    pdf.text(`Fecha: ${invoiceData.invoiceDate}`, margin, startY + 3 * lineHeight);
    pdf.text(`Cliente: ${invoiceData.customerName}`, margin, startY + 4 * lineHeight);
    pdf.text(`Tipo de Documento: ${invoiceData.customerDocumentType}`, margin, startY + 5 * lineHeight);
    pdf.text(`Número de Documento: ${invoiceData.customerDocumentNumber}`, margin, startY + 6 * lineHeight);
    pdf.text(`Número de Teléfono: ${invoiceData.customerPhone}`, margin, startY + 7 * lineHeight);
    pdf.text(`Dirección: ${invoiceData.customerAddress}`, margin, startY + 8 * lineHeight);
    
    // Company Box
    const companyBoxWidth = 200;
    const companyBoxHeight = 6 * lineHeight;
    const companyBoxX = pageWidth - margin - companyBoxWidth;
    const companyBoxY = startY + 2 * lineHeight;
    pdf.setFillColor(230, 230, 230);
    pdf.rect(companyBoxX, companyBoxY, companyBoxWidth, companyBoxHeight, 'F');
    pdf.setTextColor(40, 40, 40);
    pdf.text(`Razón Social: ${invoiceData.companyName}`, companyBoxX + 10, startY + 2.5 * lineHeight);
    pdf.text(`RUC: ${invoiceData.companyRUC}`, companyBoxX + 10, startY + 3.5 * lineHeight);
    pdf.text(`Dirección: ${invoiceData.companyAddress}`, companyBoxX + 10, startY + 4.5 * lineHeight);
    pdf.text(`Teléfono: ${invoiceData.companyPhone}`, companyBoxX + 10, startY + 5.5 * lineHeight);

    // Table Headers
    const precioUnitarioWidth = 480 + 50;
    const precioTotalWidth = 570 + 100;

    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, startY + 10 * lineHeight, usableWidth, lineHeight, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(fontSizeNormal);
    pdf.text('Detalle', margin + 5, startY + 10.7 * lineHeight);
    pdf.text('Tipo', margin + 250, startY + 10.7 * lineHeight);
    pdf.text('Cantidad', margin + 330, startY + 10.7 * lineHeight);
    pdf.text('Unidad', margin + 410, startY + 10.7 * lineHeight);
    pdf.text('Precio Unitario', margin + precioUnitarioWidth, startY + 10.7 * lineHeight);
    pdf.text('Precio Total', margin + precioTotalWidth, startY + 10.7 * lineHeight);

    // Table Content
    let positionY = startY + 11.5 * lineHeight;
    let totalServices = 0;
    let totalProducts = 0;
    invoiceData.items.forEach(item => {
        pdf.setTextColor(100, 100, 100);
        pdf.text(item.detail, margin + 5, positionY);
        pdf.text(item.type, margin + 250, positionY);
        pdf.text(String(item.quantity), margin + 330, positionY);
        pdf.text('und', margin + 410, positionY);
        pdf.text(`S/. ${item.unitPrice.toFixed(2)}`, margin + precioUnitarioWidth, positionY);
        pdf.text(`S/. ${item.totalPrice.toFixed(2)}`, margin + precioTotalWidth, positionY);
        positionY += lineHeight;

        if (item.type === 'servicio') {
            totalServices += item.totalPrice;
        } else {
            totalProducts += item.totalPrice;
        }
    });

    const TotalWidth = 100;

    // Total
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(fontSizeNormal);
    pdf.text(`Total Productos: S/. ${totalProducts.toFixed(2)}`, margin + precioUnitarioWidth + TotalWidth, positionY + lineHeight);
    pdf.text(`Total Servicios: S/. ${totalServices.toFixed(2)}`, margin + precioUnitarioWidth + TotalWidth, positionY + 2 * lineHeight);
    pdf.text(`Total: S/. ${(totalProducts + totalServices).toFixed(2)}`, margin + precioUnitarioWidth + TotalWidth, positionY + 3 * lineHeight);

    // Open PDF in New Tab
    const pdfDataUri = pdf.output('datauristring');
    const newTab = window.open();
    newTab.document.body.innerHTML = '<embed width="100%" height="100%" src="' + pdfDataUri + '" type="application/pdf">';
}

/*
const checkInData = {
    checkInNumber: '12345',
    checkInDate: '2024-06-01',
    customerName: 'John Doe',
    customerId: 'DNI 12345678',
    customerPhone: '987654321',
    customerAddress: '123 Main St, City, Country',
    companyName: 'My Workshop',
    companyRUC: '20123456789',
    companyAddress: '456 Workshop St, City, Country',
    companyPhone: '123456789',
    vehicle: {
        plate: 'XYZ-123',
        brand: 'Toyota',
        model: 'Corolla',
        engineNumber: 'ABC123456',
        vinNumber: '1HGBH41JXMN109186',
        year: '2020',
        color: 'Blue'
    },
    comments: 'The vehicle is in good condition. Minor scratches on the front bumper.',
    items: [
        { detail: 'Oil level', check: true, comment: 'Good condition' },
        { detail: 'Brake fluid', check: false, comment: 'Needs replacement' },
        { detail: 'Tire pressure', check: true, comment: 'Checked' },
        // More items...
    ],
    imageUrl: '../imagenes/vehiculo_4ruedas.png' // Ruta de la imagen
};
*/

async function generateCheckInPDF(checkInData) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');

    const margin = 40;
    const startY = 50;
    const lineHeight = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;

    const fontSizeNormal = 12 * 0.85;
    const fontSizeHeader = 20 * 0.85;

    // Header
    pdf.setFontSize(fontSizeHeader);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Vehicle Check-In', margin, startY);

    // Customer Details
    pdf.setFontSize(fontSizeNormal);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Check-In Number: ${checkInData.checkInNumber}`, margin, startY + 2 * lineHeight);
    pdf.text(`Date: ${checkInData.checkInDate}`, margin, startY + 3 * lineHeight);
    pdf.text(`Customer: ${checkInData.customerName}`, margin, startY + 4 * lineHeight);
    pdf.text(`Customer ID: ${checkInData.customerId}`, margin, startY + 5 * lineHeight);
    pdf.text(`Phone: ${checkInData.customerPhone}`, margin, startY + 6 * lineHeight);
    pdf.text(`Address: ${checkInData.customerAddress}`, margin, startY + 7 * lineHeight);

    // Vehicle Details
    pdf.text('Vehicle Details:', margin, startY + 9 * lineHeight);
    pdf.text(`Plate: ${checkInData.vehicle.plate}`, margin, startY + 10 * lineHeight);
    pdf.text(`Brand: ${checkInData.vehicle.brand}`, margin, startY + 11 * lineHeight);
    pdf.text(`Model: ${checkInData.vehicle.model}`, margin, startY + 12 * lineHeight);
    pdf.text(`Engine Number: ${checkInData.vehicle.engineNumber}`, margin, startY + 13 * lineHeight);
    pdf.text(`VIN Number: ${checkInData.vehicle.vinNumber}`, margin, startY + 14 * lineHeight);
    pdf.text(`Year: ${checkInData.vehicle.year}`, margin, startY + 15 * lineHeight);
    pdf.text(`Color: ${checkInData.vehicle.color}`, margin, startY + 16 * lineHeight);

    // Comments
    pdf.text('Comments:', margin, startY + 18 * lineHeight);
    pdf.text(`${checkInData.comments}`, margin, startY + 19 * lineHeight, { maxWidth: usableWidth / 2 });

    // Company Box
    const companyBoxWidth = 200;
    const companyBoxHeight = 6 * lineHeight;
    const companyBoxX = pageWidth - margin - companyBoxWidth;
    const companyBoxY = startY + 2 * lineHeight;
    pdf.setFillColor(230, 230, 230);
    pdf.rect(companyBoxX, companyBoxY, companyBoxWidth, companyBoxHeight, 'F');
    pdf.setTextColor(40, 40, 40);
    pdf.text(`Company Name: ${checkInData.companyName}`, companyBoxX + 10, startY + 2.5 * lineHeight);
    pdf.text(`Company RUC: ${checkInData.companyRUC}`, companyBoxX + 10, startY + 3.5 * lineHeight);
    pdf.text(`Address: ${checkInData.companyAddress}`, companyBoxX + 10, startY + 4.5 * lineHeight);
    pdf.text(`Phone: ${checkInData.companyPhone}`, companyBoxX + 10, startY + 5.5 * lineHeight);

    // Load Image
    const image = new Image();
    image.src = checkInData.imageUrl;

    image.onload = function() {
        // Calculate image width and height proportionally
        const originalWidth = image.width;
        const originalHeight = image.height;
        const targetWidth = usableWidth * 0.6;
        const scaleFactor = targetWidth / originalWidth;
        const targetHeight = originalHeight * scaleFactor;

        // Add image to PDF
        pdf.addImage(image, 'PNG', margin, startY + 20 * lineHeight, targetWidth, targetHeight);

        // Table Headers
        const yless = 200;
        const checkWidth = 40;
        const detailWidth = usableWidth * 0.4 - checkWidth - 20;

        pdf.setFillColor(230, 230, 230);
        pdf.rect(margin + targetWidth + 10, startY + 20 * lineHeight - yless, usableWidth * 0.6, lineHeight, 'F');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(fontSizeNormal);
        pdf.text('Detail', margin + targetWidth + 15, startY + 20.7 * lineHeight - yless);
        pdf.text('Check', margin + targetWidth + 15 + detailWidth, startY + 20.7 * lineHeight - yless);

        // Table Content
        let positionY = startY + 21.5 * lineHeight - yless;
        checkInData.items.forEach(item => {
            pdf.setTextColor(100, 100, 100);
            pdf.text(item.detail, margin + targetWidth + 15, positionY);
            pdf.text(item.check ? 'Yes' : 'No', margin + targetWidth + 15 + detailWidth, positionY);
            positionY += lineHeight;
        });

        // Open PDF in a new window
        window.open(pdf.output('bloburl'), '_blank');
    }
}