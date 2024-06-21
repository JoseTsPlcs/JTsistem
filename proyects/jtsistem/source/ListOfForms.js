

const igvPorcent = 18;

function CalculateWithOutIgv(val) {
    
    return val / (1+igvPorcent/100);
}

function CalculateJustIgv(val){

    return val * igvPorcent/100;
}

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

const stTls_tb_simple = [
    {
        name:"reload",
        tools:[
            {name:"config",show:false},
            {name:"load",show:false},
            
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
            {name:"load",show:true},
            
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

var ld_customers = {

    name:"ld-customers",
    tableMain:"customers",
    selects:[
        {table:'customers', field:'ID_CUSTOMER',as:"value"},
        {table:'customers', field:'NAME',as:"show"},
    ],
    conditions:[
        {
            table:"customers",
            field:"ID_COMPANY",
            inter:"=",
            value:company_id,
        }
    ],
    startOptions:[{value:"null",show:"Seleccione Cliente"}],    
}

var ld_zones = {
   name:"ld-zones",
   tableMain:"zones",
   selects:[
    {table:"zones",field:"ID_ZONE",as:"value"},
    {table:"zones",field:"NAME",as:"show"},
   ],
   conditions:[
    {
        table:"zones",
        field:"ID_COMPANY",
        inter:"=",
        value:company_id,
    }
   ],
}

var ld_workers = {
    name:"ld-workers",
    tableMain:"workers",
    selects:[
      {table:"workers",field:"ID_WORKER",as:"value"},
      {sql:'CONCAT(workers.NAME,"-",work_areas.NAME) AS "show"'},
    ],
    joins:[
      {
        main:{table:"workers",field:"ID_WORK_AREA"},
        join:{table:"work_areas",field:"ID_WORK_AREA"},
        tipe:"LEFT",
      },
    ],
    conditions:[
      {
        table:"workers",
        field:"ID_COMPANY",
        inter:"=",
        value:company_id,
      }
    ],
}

function fld_worker({panel="main",select="ID_WORKER",edit=true}) {
    
    return {
        panel,
        name:"trabajador Asignado",
        box:(edit?{tipe:8,class:"w-100",startOptions:[{value:"null",show:"Seleccionar Trabajador"}]}:{...bx_shw}),
        load:(edit?{name:"ld-workers",show:"show",value:"value"}:null),
        select,
    }
}

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

function src_GetFields({fieldsBase=[]}) {
    
    return fieldsBase;
}

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


function scr_admin({id_company,parent,editUsuarios=false,editClase=false,editAccess=false}){

    var gr = new Grid({
        parent,
        cols:[
          [8,4],
          [12],
        ],
        attributes:[
            {x:0,y:0,attributes:[{name:"class",value:"col-md-8 col-12"}]},
            {x:1,y:0,attributes:[{name:"class",value:"col-md-4 col-12"}]},
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
                            {name:"new",show:editUsuarios},
                            {name:"insert",show:false},
                            {name:"cancel",show:false},
                            
                            {name:"pages",show:true},
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
                        {panel:"main",name:"usuario",box:(editUsuarios?{tipe:1}:{tipe:0}),select:"NAME"},
                        {panel:"main",name:"clase",box:(editUsuarios?{tipe:3}:{tipe:0}),select:"ID_CLASS",load:{name:"ld-class",show:"show",value:"value"}},
                        {panel:"main",name:"contraseña",box:(editUsuarios?{tipe:1}:{tipe:0}),select:"PASSWORD"},
                        {panel:"main",name:"activo",box:(editUsuarios?bx_active_input:bx_shw_activo),select:"ACTIVE"},
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
                                {name:"new",show:editClase},
                                {name:"insert",show:false},
                                {name:"cancel",show:false},
                                
                                {name:"pages",show:true},
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
                        {panel:"main",name:"clase",box:(editClase?{tipe:1,class:"w-100"}:{tipe:0,class:"w-100"}),select:"NAME"},
                        (editClase?{panel:"main",name:"btn",box:{tipe:5,value:'actualizar accesos',class:"btn btn-outline-primary btn-sm"},action:"update_access"}:null),
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
                
                            {name:"sizes",show:true,value:999},
                            {name:"reload",show:true},
                            {name:"update",show:false},
                            {name:"new",show:false},
                            {name:"insert",show:false},
                            {name:"cancel",show:false},
                            
                            {name:"pages",show:true},
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
                        {panel:"main",name:"activo",box:(editAccess?bx_active_input:bx_shw_activo),select:"ACTIVE"},
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

function scr_customer({parent,modal}) {
    
    return {
        parent,
        title:"cliente",
        panels:[{col:12,y:0,title:"main",head:false,tipe:"form"}],
        stateStart:"block",
        afterInsert:"block",
        afterUpdate:"block",
        afterCancel:"block",
        stateTools:[
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
                {name:"new",show:false},
                {name:"insert",show:false},
                {name:"cancel",show:true},
                
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
                {name:"cancel",show:true},
                
                {name:"pages",show:false},
            ],
        }
        ],

        tableMain:"customers",
        selects:[
            {table:'customers', field:'ID_CUSTOMER',primary:true},
            {table:'customers', field:'ID_COMPANY'},
            {table:'customers', field:'NAME'},
            //{table:'customers', field:'ID_CUSTOMER_TIPE'},
            {table:'customers', field:'COMPANY'},
            {table:'customers', field:'NRO_DOCUMENT'},
            {table:'customers', field:'PHONE'},
            {table:'customers', field:'EMAIL'},
            {table:'customers', field:'DESCRIPCION'},
            {table:'customers', field:'DIRECCION'},
        ],
        conditions:[{
            table:"customers",
            field:"ID_COMPANY",
            inter:"=",
            value:company_id,
        }],
        inserts:ins_general,

        fields:[
            {panel:"main",col:8,name:"cliente",box:bx_input,select:"NAME"},
            {panel:"main",col:4,tipe:0,name:"empresa",box:{tipe:6,name:"empresa",value:0},select:"COMPANY"},
            {panel:"main",col:6,name:"documento",box:{tipe:0,options:op_identity_document_tipe},select:"COMPANY"},
            {panel:"main",col:6,name:"nro documento",box:bx_input,select:"NRO_DOCUMENT"},
            
            {panel:"main",col:12,name:"telefono",box:{tipe:1,value:""},select:"PHONE"},
            {panel:"main",col:12,name:"correo",box:{tipe:1,value:""},select:"EMAIL"},
            {panel:"main",col:12,name:"direccion",box:{tipe:1,value:""},select:"DIRECCION"},
            {panel:"main",col:12,tipe:2,name:"descripcion",box:{tipe:9,value:""},select:"DESCRIPCION"},
        ],

        events:[
        {
            name:"modalSetActive",
            actions:[{
                action:({k,active})=>{

                    if(modal) modal.SetActive({active});
                }
            }]
        },
        {
            name:"insertAfter",
            actions:[{
            action:({k})=>{

                //var fm_sale = conections.Crud_GetBuild({name:"sale"});

            }
            }]
        }
        ],
    }
}

function scr_sales_control({userData,title,fechaMin=Date_Today(),fechaMax=Date_Today(),status=[],fields=[]}) {
    
    if(status==null || status.length==0) status = op_sales_status.map((op)=>{return op.show});

    var gr = new Grid({
    cols:[[6,6],[12],[12]],
    boxs:[
        {x:0,y:0,box:{tipe:0,value:"Total:",class:"h1 text-center"}},
        {x:1,y:0,box:bx_moneyh1},
    ],
    });

    var md = new Modal({
    parent:gr.GetColData({x:0,y:2}).col,
    size:"lg",
    });
    var mdParent = md.GetContent();
    //mdParent.setAttribute("style","min-width: 600px;");
    var mdGr = new Grid({
    parent:mdParent,
    cols:[[12],[12],[12]],
    boxs:[
        {x:0,y:2,box:{tipe:5,id:"btn1",value:'PDF <i class="bi bi-filetype-pdf"></i>',class:"btn btn-danger btn-sm",update:()=>{SalePDF()}}},
        {x:0,y:2,box:{tipe:5,id:"btn2",value:'Copiar <i class="bi bi-clipboard"></i>',class:"btn btn-primary btn-sm",update:()=>{SaleCopy()}}},
    ],
    attributes:[
        {x:0,y:2,attributes:[{name:"class",value:"col-4 m-0 p-0 d-flex justify-content-center"}]},
    ],
    });

    var cruds = new ConsCruds({

    cruds:[
        {
        name:"control",
        active:true,
        script:{
            parent:gr.GetColData({x:0,y:1}).col,
            title:title,
            panels:[{col:12,y:0,title:"main",tipe:"table"}],
            stateTools:stTls_tb_all,
        
            tableMain:"sales",
            selects:[
            {table:'sales', field:'ID_SALE',primary:true},
            {table:'sales', field:'DATE_EMMIT'},
            {table:'sales', field:'ID_STATUS'},
            {table:'sales', field:'PAID'},
            {table:'sales', field:'ID_DOCUMENT'},
            {table:'sales', field:'ID_CUSTOMER'},
            {table:'sales', field:'TOTAL'},
            {table:'sales', field:'DOCUMENT_EMMIT'},
            {table:'sales', field:'COMMENT'},
            {table:'customers',field:'NAME'},
            (userData.company.tipe == "2"?{sql:"CONCAT(items_vehicles.PLACA,'-',items_vehicles.MARCA) AS 'VEHICLE'"}:null),
            ],
            joins:[
            {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"},
            (
                userData.company.tipe == "2"?
                {
                main:{table:"sales",field:"ID_ITEM"},
                join:{table:"items_vehicles",field:"ID_VEHICLE"},
                tipe:"LEFT",
                }:null
            )
            ],
            conditions:[
            {
                before:" AND ",
                table:"sales",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
            }
            ],
        
            configShow:false,
            filters:[
            {name:"cliente",box:bx_input,select:{table:"customers",field:"NAME"}},
            (userData.company.tipe == "2"?{name:"placa",box:bx_input,select:{table:"items_vehicles",field:"PLACA"}}:null),
            (userData.company.tipe == "2"?{name:"marca",box:bx_input,select:{table:"items_vehicles",field:"MARCA"}}:null),
            (fechaMin==null?null:{col:6,name:"fecha min",box:{...bx_date,value:fechaMin},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"}}),
            (fechaMax==null?null:{col:6,name:"fechamax",box:{...bx_date,value:fechaMax},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"}}),
            {name:"estado",box:{tipe:4,options:op_sales_status,value:status},select:{table:"sales",field:"ID_STATUS"}},
            {name:"cancelado",box:{tipe:4,options:op_sales_paid},select:{table:"sales",field:"PAID"}},
            {name:"documento",box:{tipe:4,options:op_sales_document},select:{table:"sales",field:"ID_DOCUMENT"}},
            {name:"emitido",box:{tipe:4,options:op_document_emmit},select:{table:"sales",field:"DOCUMENT_EMMIT"}},
            ],
            fields:[
            //{panel:"main",name:"id",box:{tipe:0},select:"ID_SALE"},
        
            {panel:"main",name:"edit",attributes:[{name:"class",value:"px-1"}],box:{tipe:5,value:'<i class="bi bi-pencil-square"></i>',class:"btn btn-primary btn-sm"},action:"edit-page"},
            {panel:"main",name:"show",attributes:[{name:"class",value:"px-1"}],box:{tipe:5,value:'<i class="bi bi-eye-fill"></i>',class:"btn btn-primary btn-sm"},action:"edit"},
            
            {panel:"main",name:"cliente",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"NAME"},
            (userData.company.tipe == "2"?{panel:"main",name:"vehiculo",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"VEHICLE"}:null),
            {panel:"main",name:"estado",attributes:[{name:"style",value:"min-width: 120px;"}],box:{tipe:0,options:op_sales_status},select:"ID_STATUS"},
            {panel:"main",name:"cancelado",attributes:[{name:"style",value:"min-width: 120px;"}],box:{tipe:0,options:op_sales_paid},select:"PAID"},
            {panel:"main",name:"total",box:bx_money,select:"TOTAL"},
            {panel:"main",name:"comentario",box:{tipe:9,value:""},select:"COMMENT"},
            {panel:"main",name:"fecha de emision",attributes:[{name:"style",value:"min-width:160px"}],box:{tipe:0},select:"DATE_EMMIT"},
            
            {panel:"main",name:"documento",attributes:[{name:"style",value:"min-width:100px"}],box:{tipe:0,options:op_sales_document},select:"ID_DOCUMENT"},
            {panel:"main",name:"emitido",attributes:[{name:"style",value:"min-width:100px"}],box:{tipe:0,options:op_document_emmit},select:"DOCUMENT_EMMIT"},
            ],
            events:[
            {
                name:"boxUpdate",
                actions:[
                {
                    action:({field,y,k})=>{
        
                    if(field.action=="edit-page"){
        
                        var id_sale = k.Reload_GetData()[y]["ID_SALE"];
                        PageSend({
                        url:"sales_new.php",
                        send:{id_sale},
                        })
                        //console.log("edit sale!!", sale_id);
                    }
                    }
                }
                ],
            },
            {
                name:"calculateTotal",
                actions:[{
                action:({k})=>{
        
                    var total = k.Reload_GetData().reduce((acum,v)=>{return acum + parseFloat(v["TOTAL"])},0);
                    gr.GetColData({x:1,y:0}).boxs[0].SetValue(total);
                }
                }]
            },
            {
                name:"reloadAfter",
                actions:[{
                action:({k})=>{
        
                    k.CallEvent({name:"calculateTotal"});
                }
                }]
            }
            ],
        },   
        },
        {
        name:"show-form",
        active:true,
        script:{
            parent:mdGr.GetColData({x:0,y:0}).col,
            title:"venta",
            panels:[
            {col:6,y:0,tipe:"form",title:"informacion",tag:"Informacion General"},
            {col:6,y:0,tipe:"form",title:"cliente",tag:"Datos del Cliente"},
            (userData.company.tipe=="2"?{col:12,y:0,tipe:"form",title:"vehicle",tag:"Datos del Vehiculo"}:null),
            ],
            stateStart:"block",
            stateTools:[
            {
                name:"reload",
                tools:[
                    {name:"config",show:false},
                    {name:"load",show:false},
                    
                    {name:"excel",show:false},
                    {name:"pdf",show:false},
        
                    {name:"sizes",show:false,value:50},
                    {name:"reload",show:false},
                    {name:"update",show:false},
                    {name:"new",show:false},
                    {name:"insert",show:false},
                    {name:"cancel",show:false},
                    
                    {name:"pages",show:false},
                ],
            },
            ],

            tableMain:"sales",
            selects:[
            {table:'sales', field:'ID_SALE',primary:true},
            {table:'sales', field:'DATE_EMMIT'},
            {table:'sales', field:'ID_STATUS'},
            {table:'sales', field:'ID_DOCUMENT'},
            {table:'sales', field:'ID_CUSTOMER'},
            {table:'sales', field:'TOTAL'},
            {table:'sales', field:'DOCUMENT_EMMIT'},
            {table:'sales', field:'COMMENT'},
            {table:'customers',field:'NAME'},
            {table:'customers',field:'PHONE'},
            {table:'customers',field:'DIRECCION'},
            {table:'customers',field:'EMAIL'},
            {table:'customers',field:'COMPANY'},
            {table:'customers',field:'NRO_DOCUMENT'},
            {table:'sales',field:'DSCTO'},
            {table:'sales',field:'TOTAL_WITHOUT_DSCTO'},                
            (userData.company.tipe=="2"?{table:"items_vehicles",field:"PLACA"}:null),
            (userData.company.tipe=="2"?{table:"items_vehicles",field:"MARCA"}:null),
            (userData.company.tipe=="2"?{table:"items_vehicles",field:"MODELO"}:null),
            (userData.company.tipe=="2"?{table:"items_vehicles",field:"NRO_MOTO"}:null),
            (userData.company.tipe=="2"?{table:"items_vehicles",field:"NRO_VIN"}:null),
            (userData.company.tipe=="2"?{table:"items_vehicles",field:"ANIO"}:null),
            (userData.company.tipe=="2"?{table:"items_vehicles",field:"COLOR"}:null),
            ],
            joins:[
            {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"},
            (userData.company.tipe=="2"?{
                main:{table:"sales",field:"ID_ITEM"},
                join:{table:"items_vehicles",field:"ID_VEHICLE"},
                tipe:"LEFT",
            }:null),
            ],

            fields:[
            {panel:"informacion",name:"nro",box:{tipe:0},select:"ID_SALE"},
            {panel:"informacion",name:"fecha de emision",box:{tipe:0},select:"DATE_EMMIT"},
            {panel:"informacion",name:"total sin descuento",box:bx_money,select:"TOTAL_WITHOUT_DSCTO"},
            {panel:"informacion",name:"descuento",box:{tipe:0,format:{end:"%",decimals:2}},select:"DSCTO"},
            {panel:"informacion",name:"total",box:bx_moneyh1,select:"TOTAL"},

            {panel:"cliente",name:"cliente",box:{tipe:0},select:"NAME"},
            {panel:"cliente",name:"telefono",box:{tipe:0},select:"PHONE"},
            {panel:"cliente",name:"correo",box:{tipe:0},select:"EMAIL"},
            {panel:"cliente",name:"documento",box:{tipe:0,options:op_identity_document_tipe},select:"COMPANY"},
            {panel:"cliente",name:"nro documento",box:{tipe:0},select:"NRO_DOCUMENT"},
            {panel:"cliente",name:"direccion",box:{tipe:0},select:"DIRECCION"},

            (userData.company.tipe=="2"?{panel:"vehicle",col:12,name:"placa",box:{tipe:0},select:"PLACA"}:null),
            (userData.company.tipe=="2"?{panel:"vehicle",col:6,name:"marca",box:{tipe:0},select:"MARCA"}:null),
            (userData.company.tipe=="2"?{panel:"vehicle",col:6,name:"modelo",box:{tipe:0},select:"MODELO"}:null),
            (userData.company.tipe=="2"?{panel:"vehicle",col:6,name:"nro de motor",box:{tipe:0},select:"NRO_MOTO"}:null),
            (userData.company.tipe=="2"?{panel:"vehicle",col:6,name:"nro de vin",box:{tipe:0},select:"NRO_VIN"}:null),
            (userData.company.tipe=="2"?{panel:"vehicle",col:6,name:"año",box:{tipe:0},select:"ANIO"}:null),
            (userData.company.tipe=="2"?{panel:"vehicle",col:6,name:"color",box:{tipe:0},select:"COLOR"}:null),
            
            //{panel:"informacion",name:"comentario",box:{tipe:0,value:""},select:"COMMENT"},

            ],
            events:[
            {
                name:"modalSetActive",
                actions:[{
                action:({active})=>{

                    md.SetActive({active});
                }
                }]
            }
            ],

        }
        },
        {
        name:"show-table",
        active:true,
        script:{
            parent:mdGr.GetColData({x:0,y:1}).col,
            title:"detalle",
            panels:[{col:12,y:0,tipe:"table",title:"informacion"}],
            stateStart:"block",
            stateTools:[
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
            ],

            tableMain:"sales_products",
            selects:[
            {table:'sales_products', field:'ID',primary:true},
            {table:'sales_products', field:'ID_SALE'},
            {table:'sales_products', field:'ID_PRODUCT'},
            {table:'sales_products', field:'CANT'},
            {table:'sales_products', field:'PRICE_UNIT'},
            {table:'sales_products', field:'PRICE_TOTAL'},
            {table:"products",field:"NAME",as:"PRODUCT_NAME"},
            {table:"products",field:"ID_PRODUCT_TIPE"},
            {table:"unids",field:"SIMBOL",as:"UNID_SIMBOL"},
            ],
            joins:[
            {
                main:{table:"sales_products",field:"ID_PRODUCT"},
                join:{table:"products",field:"ID_PRODUCT"},
                tipe:"LEFT",
            },
            {
                main:{table:"products",field:"UNID_ID"},
                join:{table:"unids",field:"ID_UNID"},
                tipe:"LEFT",
            },
            ],
            orders:[
            {field:"ID_PRODUCT_TIPE",asc:false},
            ],

            fields:[
            {panel:"informacion",name:"descripcion",attributes:att_ln,box:{tipe:0},select:"PRODUCT_NAME"},
            {panel:"informacion",name:"tipo",attributes:att_ln50,box:{tipe:0,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
            {panel:"informacion",name:"unidad",attributes:att_cnt,box:{tipe:0,class:"text-center"},select:"UNID_SIMBOL"},
            {panel:"informacion",name:"cantidad",attributes:att_cnt,box:{tipe:0,class:"text-center"},select:"CANT"},
            {panel:"informacion",name:"precio unitario",attributes:att_cnt,box:bx_money,select:"PRICE_UNIT"},
            {panel:"informacion",name:"precio total",attributes:att_cnt,box:bx_money,select:"PRICE_TOTAL"},
            ],

        }
        }
    ],

    conections:[
        {
        tipe:"tb-fm",
        master:"control",
        masterField:"ID_SALE",
        maid:"show-form",
        maidField:"ID_SALE",
        },
        {
        tipe:"fm-tb",
        master:"show-form",
        masterField:"ID_SALE",
        maid:"show-table",
        maidField:"ID_SALE",
        }
    ],


    });

    function SaleCopy() {
    
    var sale_fm = cruds.Crud_GetBuild({name:"show-form"});
    var sale_tb = cruds.Crud_GetBuild({name:"show-table"});

    var inform = '';
    inform += 'fecha: ' + sale_fm.GetValue({fieldName:"fecha de emision",y:0});
    inform += '\ncliente: ' + sale_fm.GetValue({fieldName:"cliente",y:0});
    inform += '\ntelefono: ' + sale_fm.GetValue({fieldName:"telefono",y:0});
    inform += '\ncorreo: ' + sale_fm.GetValue({fieldName:"correo",y:0});
    inform += '\ntotal: S/.' + sale_fm.GetValue({fieldName:"total",y:0});

    var itemsCount = sale_tb.Reload_GetData().length;
    for (let y = 0; y < itemsCount; y++) {

        var itemName = sale_tb.GetValue({fieldName:"descripcion",y});
        var cant= sale_tb.GetValue({fieldName:"cantidad",y});
        var priceUnit = sale_tb.GetValue({fieldName:"precio unitario",y});
        var priceTotal = sale_tb.GetValue({fieldName:"precio total",y});
        
        inform += '\n';
        inform += ' item: ' + itemName;
        inform += ' ,cantidad: ' + cant;
        inform += ' ,precio unitario: ' + priceUnit;
        inform += ' ,precio total: ' + priceTotal;
    }

    navigator.clipboard.writeText(inform);
    console.log("sale information:");
    console.log(inform);

    alert("informacion de venta copiada!");
    }

    function SalePDF() {

    var sale_fm = cruds.Crud_GetBuild({name:"show-form"});
    var sale_tb = cruds.Crud_GetBuild({name:"show-table"});

    var items = [];
    var itemsCount = sale_tb.Reload_GetData().length;
    for (let y = 0; y < itemsCount; y++) {

        items.push({
        detail: sale_tb.GetValue({fieldName:"descripcion",y}),
        type: op_products_tipe.find(op=>op.value==sale_tb.GetValue({fieldName:"tipo",y})).show,
        quantity: sale_tb.GetValue({fieldName:"cantidad",y}), 
        unitPrice: parseFloat(sale_tb.GetValue({fieldName:"precio unitario",y})),
        totalPrice: parseFloat(sale_tb.GetValue({fieldName:"precio total",y})),
        });
    }

    generateInvoicePDF({
        invoiceNumber: sale_fm.GetValue({fieldName:"nro",y:0}),
        invoiceDate: sale_fm.GetValue({fieldName:"fecha de emision",y:0}),
        
        dscto: parseFloat(sale_fm.GetValue({fieldName:"descuento",y:0})),

        companyName: userData.company.nameReal,
        companyRUC:  userData.company.ruc,
        companyAddress: userData.company.direccion,
        companyPhone: userData.company.telf,
        companyLogo:userData.company.logo,

        vehicle: (userData.company.tipe=="2"?{
        placa:sale_fm.GetValue({fieldName:"placa",y:0}),
        marca:sale_fm.GetValue({fieldName:"marca",y:0}),
        modelo:sale_fm.GetValue({fieldName:"modelo",y:0}),
        nro_motor:sale_fm.GetValue({fieldName:"nro de motor",y:0}),
        nro_vin:sale_fm.GetValue({fieldName:"nro de vin",y:0}),
        anio:sale_fm.GetValue({fieldName:"año",y:0}),
        color:sale_fm.GetValue({fieldName:"color",y:0}),
        }:null),

        customerName: sale_fm.GetValue({fieldName:"cliente",y:0}),
        customerDocumentType: op_identity_document_tipe.find(op=>op.value==sale_fm.GetValue({fieldName:"documento",y:0})).show,
        customerDocumentNumber: sale_fm.GetValue({fieldName:"nro documento",y:0}),
        customerPhone: sale_fm.GetValue({fieldName:"telefono",y:0}),
        customerAddress: sale_fm.GetValue({fieldName:"direccion",y:0}),
        items,
    });
    }

}

function scr_sales_products({parent,title="items-products",head=true,h=600,fieldsSet=[]}) {
 
     var fielsData = [
        {name:"delete",active:true,EditBox:{...fld_delete.box},ShowBox:{...fld_delete.box},state:"show",action:"delete",attributes:att_btn},
        {name:"edit",active:true,EditBox:{...fld_edit.box},ShowBox:{...fld_edit.box},state:"show",action:"edit",attributes:att_btn},
        {name:"item",active:true,EditBox:{tipe:1,class:"w-100"},ShowBox:bx_shw,state:"show",select:"ID_PRODUCT",att:att_ln,load:{name:"products-services",show:"show",value:"value"}},
        {name:"tipo",active:true,EditBox:{tipe:3,options:op_products_tipe},ShowBox:{...bx_shw,options:op_products_tipe},state:"show",select:"ID_PRODUCT_TIPE",att:att_shw},
        {name:"unidad",active:true,EditBox:bx_shw,ShowBox:bx_shw,state:"show",select:"SIMBOL",att:att_shw},
        {name:"cantidad",active:true,EditBox:{...bx_input},ShowBox:bx_shw,state:"show",select:"CANT",att:att_cnt},
        {name:"precio unitario",active:true,EditBox:{...bx_input},ShowBox:bx_money,state:"show",select:"PRICE_UNIT",att:att_shw},
        {name:"precio total",active:true,EditBox:{...bx_input},ShowBox:bx_money,state:"show",select:"PRICE_TOTAL",att:att_shw},
        {name:"trabajador asignado",active:true,EditBox:{tipe:8,select:"w-100"},ShowBox:bx_shw,state:"show",select:"ID_WORKER",load:{name:"ld-workers",show:"show",value:"value"}},
    ];

    fieldsSet.forEach(fSet => {
        
        var ffound = fielsData.find(f=>f.name == fSet.name);
        if(ffound){

            if(fSet.state!=null) ffound.state = fSet.state;
            if(fSet.active!=null) ffound.active = fSet.active;
        }
    });

    var field_item = fielsData.find(f=>f.name=="item");
    var field_unidad = fielsData.find(f=>f.name=="unidad");
    var field_worker = fielsData.find(f=>f.name=="trabajador asignado");

    var fields = fielsData.map((fdata)=>{

        if(fdata.active == false) return null;

        return {
            panel:"main",
            name:fdata.name,
            box:(fdata.state=="show"?fdata.ShowBox:fdata.EditBox),
            select:fdata.select,
            action:fdata.action,
            load:fdata.load,
            attributes:fdata.att,
        }
    });

    console.log(fields);

    return {
        parent,
        title,head,
        panels:[{col:12,y:0,title:"main",tipe:"table",h}],
        stateTools:[
            {
              name:"reload",
              tools:[
                  {name:"config",show:false},
                  {name:"load",show:true},
                  
                  {name:"excel",show:false},
                  {name:"pdf",show:false},
      
                  {name:"sizes",show:false,value:999},
                  {name:"reload",show:false},
                  {name:"update",show:false},
                  {name:"new",show:true},
                  {name:"insert",show:false},
                  {name:"cancel",show:false},
                  {name:"addLine",show:false},
                  
                  {name:"pages",show:false},
              ],
            },
            {
              name:"new",
              tools:[
                  {name:"config",show:false},
                  {name:"load",show:false},
                  
                  {name:"excel",show:false},
                  {name:"pdf",show:false},
      
                  {name:"sizes",show:false,value:999},
                  {name:"reload",show:false},
                  {name:"update",show:false},
                  {name:"new",show:false},
                  {name:"insert",show:true},
                  {name:"cancel",show:true},
                  {name:"addLine",show:true},
                  
                  {name:"pages",show:false},
              ],
            },
        ],

        stateStart:"block",
        afterInsert:"reload",
        newLineStart:1,

        tableMain:"sales_products",
        selects:[
            {table:'sales_products', field:'ID',primary:true},
            {table:'sales_products', field:'ID_SALE'},
            {table:'sales_products', field:'ID_PRODUCT'},
            {table:'sales_products', field:'CANT'},
            {table:'sales_products', field:'PRICE_UNIT'},
            {table:'sales_products', field:'PRICE_TOTAL'},
            {table:'sales_products',field:'ID_WORKER'},
            {table:"unids",field:"SIMBOL"},
            {table:"products",field:"ID_PRODUCT_TIPE"},
        ],
        joins:[
            {
                main:{table:"sales_products",field:"ID_PRODUCT"},
                join:{table:"products",field:"ID_PRODUCT"},
                tipe:"LEFT",
            },
            {
                main:{table:"products",field:"UNID_ID"},
                join:{table:"unids",field:"ID_UNID"},
                tipe:"LEFT",
            },
        ],
        loads:[
            {
                name:"products-services",
                tableMain:"products",
                selects:[
                    {table:'products', field:'ID_PRODUCT',as:"value"},
                    {table:'products', field:'NAME',as:"show"},
                    {table:'products',field:"PRICE_UNIT"},
                    {table:'products',field:"STOCK_TOTAL"},
                    {table:'products',field:"ID_PRODUCT_TIPE"},
                ],
                conditions:[
                {
                    table:"products",
                    field:"ACTIVE",
                    inter:"=",
                    value:1,
                },
                {
                    before:" AND (",
                    table:"products",
                    field:"ID_PRODUCT_TIPE",
                    inter:"=",
                    value:3,
                },
                {
                    before:" OR ",
                    table:"products",
                    field:"ID_PRODUCT_TIPE",
                    inter:"=",
                    value:1,
                    after:" ) ",
                },
                {
                    before:" AND ",
                    table:"products",
                    field:"ID_COMPANY",
                    inter:"=",
                    value:company_id,
                },
                ],
            },
            (field_worker.active?{...ld_workers}:null),
        ],

        /*fields:[
            {panel:"main",...fld_delete,attributes:att_btn},
            (acc_products_update?{panel:"main",...fld_edit,attributes:att_btn}:null),
            {panel:"main",name:"producto-servicio",box:{tipe:8,class:"w-100"},attributes:att_ln,select:"ID_PRODUCT",load:{name:"products-services",show:"show"}},
            {panel:"main",name:"tipo",box:{tipe:0,options:op_products_tipe},attributes:att_shw,select:"ID_PRODUCT_TIPE"},
            {panel:"main",name:"unidad",box:bx_shw,attributes:att_shw,select:"SIMBOL"},
            {panel:"main",name:"cantidad",box:bx_cant,attributes:att_cnt,select:"CANT"},
            {panel:"main",name:"precio unitario",box:(acc_price_update?{tipe:1,value:0}:bx_money),attributes:att_shw,select:"PRICE_UNIT"},
            {panel:"main",name:"precio total",box:(acc_price_update?{tipe:1,value:0}:bx_money),attributes:att_shw,select:"PRICE_TOTAL"},
            (acc_item_worker?{panel:"main",name:"trabajador asignado",attributes:att_ln50,box:{tipe:8,value:"null",class:"w-100"},select:"ID_WORKER",load:{name:"ld-workers",show:"show",value:"value"}}:null)
        ],*/
        fields,
    }

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
    const pdf = new jsPDF('landscape', 'pt', 'a4'); // Mantener tamaño A4 horizontal

    const margin = 40;
    const startY = 50;
    const lineHeight = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;

    const fontSizeNormal = 12 * 0.85;  // Incremento del 15%
    const fontSizeHeader = 20 * 0.85;  // Incremento del 15%
    
    // Logo
    
    const logoImg = new Image();
    logoImg.src = invoiceData.companyLogo;
    logoImg.onload = function() {
        
        const aspectRatio = logoImg.width / logoImg.height;
        const logoWidth = 120;
        const logoHeight = logoWidth / aspectRatio;
        pdf.addImage(logoImg, 'JPEG', pageWidth - margin - logoWidth, margin, logoWidth, logoHeight);

        // Header
        pdf.setFontSize(fontSizeHeader);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Cotizacion', margin, startY);

        // Company Details
        pdf.setFontSize(fontSizeNormal);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Número: ${invoiceData.invoiceNumber}`, margin, startY + 2 * lineHeight);
        pdf.text(`Fecha: ${invoiceData.invoiceDate}`, margin, startY + 3 * lineHeight);
        pdf.text(`Cliente: ${invoiceData.customerName}`, margin, startY + 4 * lineHeight);
        pdf.text(`Tipo de Documento: ${invoiceData.customerDocumentType}`, margin, startY + 5 * lineHeight);
        pdf.text(`Número de Documento: ${invoiceData.customerDocumentNumber}`, margin, startY + 6 * lineHeight);
        pdf.text(`Número de Teléfono: ${invoiceData.customerPhone}`, margin, startY + 7 * lineHeight);
        pdf.text(`Dirección: ${invoiceData.customerAddress}`, margin, startY + 8 * lineHeight);

        //vehicle Details
        if(invoiceData.vehicle!=null){

            pdf.setFontSize(fontSizeNormal);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Placa: ${invoiceData.vehicle.placa}`, margin+250, startY + 2 * lineHeight);
            pdf.text(`Marca: ${invoiceData.vehicle.marca}`, margin+250, startY + 3 * lineHeight);
            pdf.text(`Modelo: ${invoiceData.vehicle.modelo}`, margin+250, startY + 4 * lineHeight);
            pdf.text(`Nro de Motor: ${invoiceData.vehicle.nro_motor}`, margin+250, startY + 5 * lineHeight);
            pdf.text(`Nro de Vin: ${invoiceData.vehicle.nro_vin}`, margin+250, startY + 6 * lineHeight);
            pdf.text(`Año: ${invoiceData.vehicle.anio}`, margin+250, startY + 7 * lineHeight);
            pdf.text(`Color: ${invoiceData.vehicle.color}`, margin+250, startY + 8 * lineHeight);   
        }
        
        // Company Box
        const companyBoxWidth = 200;
        const companyBoxHeight = 6 * lineHeight;
        const companyBoxX = pageWidth - margin - companyBoxWidth - logoWidth - 10;
        const companyBoxY = startY + 2 * lineHeight - 50;
        pdf.setFillColor(230, 230, 230);
        pdf.rect(companyBoxX, companyBoxY, companyBoxWidth, companyBoxHeight, 'F');
        pdf.setTextColor(40, 40, 40);
        pdf.text(`Razón Social: ${invoiceData.companyName}`, companyBoxX + 10, startY + 2.5 * lineHeight - 50);
        pdf.text(`RUC: ${invoiceData.companyRUC}`, companyBoxX + 10, startY + 3.5 * lineHeight - 50);
        pdf.text(`Dirección: ${invoiceData.companyAddress}`, companyBoxX + 10, startY + 4.5 * lineHeight - 50);
        pdf.text(`Teléfono: ${invoiceData.companyPhone}`, companyBoxX + 10, startY + 5.5 * lineHeight - 50);

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
        var dscto = invoiceData.dscto;

        // Total
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(fontSizeNormal);
        pdf.text(`Total Productos: S/. ${totalProducts.toFixed(2)}`, margin + precioUnitarioWidth + TotalWidth, positionY + lineHeight);
        pdf.text(`Total Servicios: S/. ${totalServices.toFixed(2)}`, margin + precioUnitarioWidth + TotalWidth, positionY + 2 * lineHeight);
        pdf.text(`Total Sin Descuento: S/. ${(totalProducts + totalServices).toFixed(2)}`, margin + precioUnitarioWidth + TotalWidth, positionY + 3 * lineHeight);  
        pdf.text(`Descuento: ${(dscto.toFixed(2))}%`, margin + precioUnitarioWidth + TotalWidth, positionY + 4 * lineHeight);
        pdf.text(`Total: S/. ${((totalProducts + totalServices)*(1-dscto/100)).toFixed(2)}`, margin + precioUnitarioWidth + TotalWidth, positionY + 5 * lineHeight);
        
        // Open PDF in a new window
        window.open(pdf.output('bloburl'), '_blank');

        // Open PDF in New Tab
        //const pdfDataUri = pdf.output('datauristring');
        //const newTab = window.open();
        //newTab.document.body.innerHTML = '<embed width="100%" height="100%" src="' + pdfDataUri + '" type="application/pdf">';
    };
    
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
    //const pdf = new jsPDF('landscape', 'pt', 'a4'); // Mantener tamaño A4 horizontal

    const margin = 20;
    const startY = 20;
    const lineHeight = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;

    const fontSizeNormal = 12 * 0.85;
    const fontSizeHeader = 20 * 0.85;

    // Logo
    const logoImg = new Image();
    logoImg.src = checkInData.logo; // Logo en base64 desde checkInData
    logoImg.onload = function() {
        console.log('Logo cargado correctamente');
        const logoWidth = 120; // Ajusta el tamaño del logo según tu preferencia
        const aspectRatio = logoImg.width / logoImg.height;
        const logoHeight = logoWidth / aspectRatio;
        pdf.addImage(logoImg, 'JPEG', pageWidth - logoWidth - margin, startY + 1 * lineHeight, logoWidth, logoHeight);

        // Header
        pdf.setFontSize(fontSizeHeader);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Orden de Trabajo', margin, startY);

        // Customer Details
        pdf.setFontSize(fontSizeNormal);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Orden de Trabajo: ${checkInData.checkInNumber}`, margin, startY + 2 * lineHeight);
        pdf.text(`Fecha de Entrada: ${checkInData.checkInDate}`, margin, startY + 3 * lineHeight);
        pdf.text(`Cliente: ${checkInData.customerName}`, margin, startY + 4 * lineHeight);
        pdf.text(`Nro de Identificacion: ${checkInData.customerId}`, margin, startY + 5 * lineHeight);
        pdf.text(`Telefono: ${checkInData.customerPhone}`, margin, startY + 6 * lineHeight);
        pdf.text(`Direccion: ${checkInData.customerAddress}`, margin, startY + 7 * lineHeight);

        // Vehicle Details
        pdf.text('Detalles del Vehiculo:', margin, startY + 9 * lineHeight);
        pdf.text(`Placa: ${checkInData.vehicle.plate}`, margin, startY + 10 * lineHeight);
        pdf.text(`Marca: ${checkInData.vehicle.brand}`, margin, startY + 11 * lineHeight);
        pdf.text(`Modelo: ${checkInData.vehicle.model}`, margin, startY + 12 * lineHeight);
        pdf.text(`Nro de Motor: ${checkInData.vehicle.engineNumber}`, margin, startY + 13 * lineHeight);
        pdf.text(`Nro de Vin: ${checkInData.vehicle.vinNumber}`, margin, startY + 14 * lineHeight);
        pdf.text(`año: ${checkInData.vehicle.year}`, margin, startY + 15 * lineHeight);
        pdf.text(`Color: ${checkInData.vehicle.color}`, margin, startY + 16 * lineHeight);

        // Comments
        pdf.text('requerimiento:', margin, startY + 18 * lineHeight);
        pdf.text(`${checkInData.comments}`, margin, startY + 19 * lineHeight, { maxWidth: usableWidth / 2 });

        // Company Box
        const companyBoxWidth = 200;
        const companyBoxHeight = 6 * lineHeight;
        const companyBoxX = pageWidth - margin - companyBoxWidth - logoWidth - 10;
        const companyBoxY = startY + 1 * lineHeight;
        pdf.setFillColor(230, 230, 230);
        pdf.rect(companyBoxX, companyBoxY, companyBoxWidth, companyBoxHeight, 'F');
        pdf.setTextColor(40, 40, 40);
        pdf.text(`Razon Social: ${checkInData.companyName}`, companyBoxX + 10, startY + 2.5 * lineHeight);
        pdf.text(`RUC: ${checkInData.companyRUC}`, companyBoxX + 10, startY + 3.5 * lineHeight);
        pdf.text(`Direccion: ${checkInData.companyAddress}`, companyBoxX + 10, startY + 4.5 * lineHeight);
        pdf.text(`Telefono: ${checkInData.companyPhone}`, companyBoxX + 10, startY + 5.5 * lineHeight);

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

            pdf.text('observaciones:', margin, startY + 21 * lineHeight + targetHeight);
            pdf.text(`${checkInData.observations}`, margin, startY + 22 * lineHeight + targetHeight, { maxWidth: usableWidth / 2 });

            // Table Headers
            const yless = 200;
            const checkWidth = 40;
            const detailWidth = usableWidth * 0.4 - checkWidth - 20;

            pdf.setFillColor(230, 230, 230);
            pdf.rect(margin + targetWidth + 10, startY + 20 * lineHeight - yless, usableWidth * 0.6, lineHeight, 'F');
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(fontSizeNormal);
            pdf.text('Detalle', margin + targetWidth + 15, startY + 20.7 * lineHeight - yless);
            pdf.text('Check', margin + targetWidth + 15 + detailWidth, startY + 20.7 * lineHeight - yless);

            // Table Content
            let positionY = startY + 21.5 * lineHeight - yless;
            checkInData.items.forEach(item => {
                pdf.setTextColor(100, 100, 100);
                pdf.text(item.detail, margin + targetWidth + 15, positionY);
                pdf.text(item.check ? 'X' : '', margin + targetWidth + 15 + detailWidth, positionY);
                positionY += lineHeight;
            });

            

            // Open PDF in a new window
            window.open(pdf.output('bloburl'), '_blank');
        }
    };

    
}

