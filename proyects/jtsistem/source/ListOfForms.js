//---------options--------

var company_id = 1;


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
    //{value:"week",show:"semanal"},
    //{value:"month",show:"mensual"},
];

const igvPorcent = 18;

function CalculateWithOutIgv(val) {
    
    return val / (1+igvPorcent/100);
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
            
            {name:"pages",show:false},
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
        stateBase:"block",
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
        inserts:ins_general,
        loads:[
            ld_accounts,
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
            //ld_pay_tag,
        ],

        fields:[
            {panel:"main",col:12,y:0,name:"id",box:bx_shw,select:"ID_PAY"},
            {panel:"main",col:12,y:1,name:"fecha de emision",box:bx_date,select:"DATE_EMMIT"},
            {panel:"main",col:12,y:2,name:"total",box:bx_input,select:"TOTAL"},
            //{panel:"main",col:12,name:"ingreso/egreso",box:{tipe:6,name:"ingreso"},select:"INCOME"},
            {panel:"main",name:"ingreso/egreso",box:{tipe:0,value:0,options:[{value:0,show:"egreso",class:"text-danger"},{value:1,show:"ingreso",class:"text-success"}]},select:"INCOME"},
            {panel:"main",col:12,y:2,name:"cuenta",box:bx_op({ops:[]}),select:"ID_ACCOUNT",load:{name:"accounts",show:"show"}},
            {panel:"main",col:12,y:2,name:"etiqueta",box:{...bx_op({ops:[]}),value:tagValue},select:"ID_PAY_TAG",load:{name:"pay_tag",show:"show"}},
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

functionOnlogPage.push(ListOfForm_UserLog);


