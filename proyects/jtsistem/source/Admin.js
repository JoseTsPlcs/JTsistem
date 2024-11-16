
//-----schema access-------

/*var DataTipe = [
    {
        tipe:"date",
        show:{box:{tipe:0},attributes:[{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"width: 110px"}]},
        edit:{box:{tipe:2,value:Date_Today()}},
    },
    {
        tipe:"status",
        show:{box:{tipe:0}},
        edit:{box:{tipe:3}},
    },
    {
        tipe:"active",
        show:{box:{tipe:0}},
        edit:{box:{tipe:6}},
    },
    {
        tipe:"money",
        show:{box:{tipe:0}},
        edit:{box:{tipe:1}},
    },
    {
        tipe:"count",
        show:{box:{tipe:0}},
        edit:{box:{tipe:1}},
    },
];

function DataTipeGet({tipeName,stateName,fieldOfSchema}) {
    
    var info = DataTipe.find(d=>d.tipe==tipeName);
    if(info == null) info = {show:{box:bx_shw},edit:{box:{tipe:1}}};
    var tipeInfo = stateName == "edit" ? info.edit : info.show;
    if(tipeName == "active"){

        fieldOfSchema.options = [
            {value:1,show:fieldOfSchema.title,class:"rounded text-center bg-success text-white"},
            {value:0,show:"no " + fieldOfSchema.title,class:"rounded text-center bg-danger text-white"},
        ];
    }
    if(fieldOfSchema.options) tipeInfo.box.options = fieldOfSchema.options;
    if(fieldOfSchema.size) tipeInfo.attributes = [{name:"class",value:"m-0 py-0 px-1"},{name:"style",value:"width: "+fieldOfSchema.size+"px"}];

    return {...tipeInfo};
}*/

var schema = [
    
    {
        name: 'sales',
        fields:[
            {
            name:"my_row_id", primary:true, active:true, 
            title:"fieldName", tipe:"id"
            },
            {
            name:"ID_COMPANY", active:true, 
            title:"fieldName", tipe:"id"
            },
            {
            name:"DATE_EMMIT", active:true, 
            title:"fechad de emision", tipe:"date"
            },
            {
            name:"ID_STATUS", active:true, 
            title:"estado", tipe:"status", options:op_sales_status
            },
            {
            name:"PAID", active:true, 
            title:"pagado", tipe:"active"
            },
            {
            name:"ID_DOCUMENT", active:true, 
            title:"documento", tipe:"status", options:op_sales_document
            },
            {
            name:"DOCUMENT_EMMIT", active:true, 
            title:"emitido a sunat", tipe:"active"
            },
            {
            name:"ID_CUSTOMER", active:true, 
            title:"cliente", tipe:"id", join:{table:"customers",field:"ID_CUSTOMER"},
            },
            {
            name:"TOTAL", active:true, 
            title:"total", tipe:"money"
            },
            {
            name:"COMMENT", active:true, 
            title:"comentario", tipe:"text"
            },
            {
            name:"ID_ITEM", active:true, 
            title:"fieldName", tipe:"id"
            },
            {
            name:"ID_ITEM_TYPE", active:true, 
            title:"fieldName", tipe:"status"
            },
            {
            name:"ID_WORK_PROCESS", active:true, 
            title:"trabajador asignado", tipe:"id"
            },
            {
            name:"DSCTO", active:true, 
            title:"descuento", tipe:"count"
            },
            {
            name:"TOTAL_WITHOUT_DSCTO", active:true, 
            title:"total sin descuento", tipe:"money"
            },
            {
            name:"ID_RUC", active:true, 
            title:"fieldName", tipe:"id"
            },
        ],
    }
];

//-----scr-----

function scr_addModulo({crudBase,title,head=true,blocked=false,fields=[]}){

    var crudPanels = crudBase.panels ? crudBase.panels : [];
    var crudFields = crudBase.fields ? crudBase.fields : [];

    var modPanel = {
        name:"mod" + (panels.length+1),
        tipe:"form",
        title,
        head,blocked
    };
    crudPanels.push(modPanel);


    fields.forEach(fld => {
        

    });


    return {
        ...crudBase
    }
}

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
        stateTools:[
            {
                name:"new",
                tools:[
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                ],
            },
            {
                name:"reload",
                tools:[
                    {name:"update",show:true},
                    {name:"reload",show:true},
                    {name:"cancel",show:true},
                ],
            },
        ],

        tableMain:"payments",
        selects:[
            {table:'payments', field:'ID_PAY',primary:true},
            {table:'payments', field:'DATE_EMMIT'},
            {table:'payments', field:'TOTAL'},
            {table:'payments', field:'INCOME'},
            {table:'payments', field:'ID_ACCOUNT'},
            {table:'payments', field:'ID_PAY_TAG'},
            {table:'payments',field:'HORA'},
        ],
        inserts:[
            ...ins_general,
            {
                field:"DATE_EMMIT",
                value:Date_Time_Today(),
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
            {panel:"main",col:12,y:1,name:"fecha de emision",box:{tipe:0,value:Date_Time_Today()},select:"DATE_EMMIT"},
            {panel:"main",col:12,y:2,name:"total",box:{tipe:1,value:0},select:"TOTAL"},
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

                        console.log("------------inserts:",inserts);

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
            {panel:"main",...fld_delete,descripcion:"borrar pago"},
            {panel:"main",...fld_edit,descripcion:"editar pago"},
            //{panel:"main",name:"id",box:{tipe:0},select:"ID_BUY_PAY"},
            //{panel:"main",name:"id compra",box:{tipe:0},select:"ID_BUY"},
            //{panel:"main",name:"id pago",box:{tipe:0},select:"ID_PAY"},
            {panel:"main",name:"fecha de emision",box:bx_shw,select:"DATE_EMMIT",descripcion:"se muestra la fecha de emision del pago"},
            {panel:"main",name:"total",box:bx_income,select:"TOTAL",descripcion:"se muestra el total del pago y si fue ingreso o egreso"},
            {panel:"main",name:"etiqueta",box:bx_shw,select:"TAG_NAME",descripcion:"se muestra que tipo de pago fue"},
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
            {x:1,y:0,attributes:[{name:"class",value:"col-md-4 col-12 px-"+paddinForms}]},
            {x:0,y:1,attributes:[{name:"class",value:"mt-"+paddinForms}]}
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
                    
                                {name:"sizes",show:true,value:10},
                                {name:"reload",show:true},
                                {name:"new",show:editUsuarios},
                                
                                {name:"pages",show:true},
                            ],
                        },
                        {
                            name:"new",
                            tools:[
                                {name:"insert",show:true},
                                {name:"cancel",show:true},
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
                        },
                        {
                            name:"new",
                            tools:[
                                {name:"insert",show:true},
                                {name:"cancel",show:true},
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

                                    //k.Loading_SetActive({active:true});

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

                                        //k.Loading_SetActive({active:false});
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

                                        //k.Loading_SetActive({active:true});
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

                                                var inserts = [];

                                                modulos.forEach(md=>{

                                                    inserts.push(
                                                        {
                                                            field:"ID_ACCESS",
                                                            value:md.value+"-general",
                                                            tipe:"values",
                                                        }
                                                    );

                                                    inserts.push(
                                                        {
                                                            field:"CLASS_ACCESS_TYPE",
                                                            value:md.value,
                                                            tipe:"values",
                                                        }
                                                    );

                                                    md.access.forEach(acc => {
                                                        
                                                        inserts.push(
                                                            {
                                                                field:"ID_ACCESS",
                                                                value:acc.value,
                                                                tipe:"values",
                                                            }
                                                        );
    
                                                        inserts.push(
                                                            {
                                                                field:"CLASS_ACCESS_TYPE",
                                                                value:md.value,
                                                                tipe:"values",
                                                            }
                                                        );
                                                    });
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

                                                        //k.Loading_SetActive({active:false});
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
                            {name:"sizes",show:false,value:999},
                            {name:"reload",show:true},
                        ],
                    }
                    ],

                    tableMain:"class_access",
                    selects:[
                        {table:"class_access",field:"ID_CLASS_ACCESS",primary:true},
                        {table:"class_access",field:"ID_CLASS"},
                        {table:"class_access",field:"ID_ACCESS"},
                        {table:"class_access",field:"ACTIVE"},
                        {table:"class_access",field:"CLASS_ACCESS_TYPE"},
                    ],
                    orders:[
                        {field:"ID_CLASS",asc:true},
                        {field:"CLASS_ACCESS_TYPE",asc:true},
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
                        {name:"tipo",box:{tipe:3,options:op_modulos},select:{table:"class_access",field:"CLASS_ACCESS_TYPE"}}
                    ],
                    fields:[
                        //{panel:"main",name:"clase",box:{tipe:3,class:"w-100"},select:"ID_CLASS",load:{name:"ld-class",show:"show",value:"value"}},
                        {panel:"main",name:"acceso",box:{tipe:0,options:op_access},select:"ID_ACCESS"},
                        {panel:"main",name:"tipo",box:{tipe:0,options:op_modulos},select:"CLASS_ACCESS_TYPE"},
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

//--------------------------



