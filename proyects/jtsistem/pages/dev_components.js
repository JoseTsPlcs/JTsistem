
var userData = {
    access:[
        {value:"md-bills-general",active:"true"},
    ],
    company:{id:1},
}
var pageData = {
    title:"dev components",
}


switch ("crud") {

    case "window":
        
        cn.build = new Window({
            parent:document.body,
            blocked:false,show:false,
            title:"titulo",
            fields:[
                {col:12,tipe:1,name:"field1",box:{tipe:1}},

                {col:6,tipe:2,name:"field2",box:{tipe:3,options:[{value:1,show:"op1"},{value:2,show:"op2"},{value:3,show:"op3"},]}},
                {col:6,tipe:2,name:"field3",box:{tipe:8,options:[{value:1,show:"op1"},{value:2,show:"op2"},{value:3,show:"op3"},]}},

                {col:4,tipe:1,name:"field4",box:{tipe:1}},
                {col:4,tipe:1,name:"field5",box:{tipe:1}},
                {col:4,tipe:0,name:"field6",box:{tipe:6,value:1,name:"field6"}},
            ],
        });

    break;

    case "form":

        cn.build = new Form({
            parent:document.body,head:true,
            blocked:false,show:true,
            title:"formulario - titulo",
            fields:[
                {col:12,name:"filtro 1",box:{tipe:1}},
            ],
            tools:[
                {position:"head-center",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                {position:"head-left",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                {position:"head-right",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                {position:"botton-center",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                {position:"botton-left",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                {position:"botton-right",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
            ],
        });

    break;

    case "editImage":

        var grid = new Grid({cols:[[6,6]]}); 
        var parent = grid.GetColData({x:0,y:0}).col;
        new EditableImage({
            parent,
            imageUrl:"../imagenes/vehiculo_4ruedas.png",
        });

    break;

    case "crudBody":

        new Crud_Body({
            title:"test crud body opne",
            filters:[
                {name:"fecha min",box:{...bx_date}},
                {name:"fecha max",box:{...bx_date}},
                {name:"nombre",box:{...bx_input}},
            ],
            panels:[
                {
                    col:12,tipe:"kpi",
                    fields:[
                        {name:"total",title:"total de ventas",box:{...bx_money}},
                    ],
                },
                {
                    col:4,name:"fm",
                    tipe:"form",title:"formulario",
                    fields:[
                        {name:"nombre",box:{...bx_input}},
                        {name:"options",box:{tipe:3}},
                    ],
                },
                {
                    col:8,name:"tb",
                    tipe:"table",title:"tabla",
                    fields:[
                        {name:"edit",box:{...fld_edit.box}},
                        {name:"nombre",box:{...bx_input}},
                        {name:"options",box:{tipe:3}},
                    ],

                },
            ],
        });

    break;

    case "crudMaster":
        
        new Crud_Master({
            title:"lista de productos",
            stateTools:[
                {
                name:"reload",
                tools:[
                    {name:"config",show:true},
                    {name:"load",show:true},
                    {name:"sizes",show:true,value:10},
                    {name:"reload",show:true},
                    {name:"new",show:true},
                    {name:"pages",show:true},
                ],
                }
            ],
        
            tableMain:"products",
            selects:[
                {table:'products', field:'ID_PRODUCT',primary:true},
                {table:'products', field:'NAME'},
                {table:'products', field:'ID_PRODUCT_TIPE'},
                {table:'products', field:'UNID_ID'},
                {table:'products', field:'STOCK_TOTAL'},
                {table:'products', field:'STOCK_LIMIT'},
                {table:'products', field:'STOCK_ONLIMIT'},
                {table:'products', field:'ACTIVE'},
                {table:'products', field:'RECIPE_CANT'},
                {table:'products_tags', field:'NAME',as:"TAG_NAME"},
        
            ],
            joins:[
                {
                main:{table:"products",field:"ID_PRODUCT_TAG"},
                join:{table:"products_tags",field:"ID_PRODUCT_TAG"},
                tipe:"LEFT",
                }
            ],
            loads:[
                ld_unids,
                ld_products_tags,
            ],

            configShow:false,    
            filters:[
                {name:"producto",box:bx_input,select:{table:"products",field:"NAME"},descripcion:"buscar por nombre de producto/servicio/insumo"},
                {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
                (true?{name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"}:null),
                {name:"activo",box:{tipe:4,options:op_active,value:["activo"]},select:{table:"products",field:"ACTIVE"},descripcion:"buscar si el producto/servicio/insumo esta activo"},
                (true?{name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"},descripcion:"buscar por unidad"}:null),
            ],
            panels:[
                {
                    tipe:"kpi",
                    fields:[
                        {name:"total",title:"total promedio",box:{...bx_money},select:"STOCK_TOTAL"},
                    ],
                },
                {
                    tipe:"chart",col:6,
                    fields:[
                        {name:"total",select:"STOCK_TOTAL"},
                        {name:"labels",select:"TAG_NAME"},
                    ],
                },
                {
                    col:6,title:"main",tipe:"table",
                    fields:[
                        {panel:"main",...fld_edit,descripcion:"editar informacion del producto/servicio/insumo"},
                        {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_shw,select:"NAME",descripcion:"nombre del producto/servicio/insumo"},
                        {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE",descripcion:"puede ser producto/servicio/insumo"},
                        (true?{panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"etiqueta",box:bx_shw,select:"TAG_NAME",descripcion:"etiqueta del producto/servicio/insumo"}:null),
                
                        (true?{panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"},descripcion:"unidad del producto/servicio/insumo"}:null),
                        //{panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock total",box:(acc_stock_update?bx_input:{tipe:0,class:"text-center"}),select:"STOCK_TOTAL"},
                        //{panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock minimo",box:{tipe:0,class:"text-center"},select:"STOCK_LIMIT"},
                        //{panel:"main",name:"limite",box:{tipe:0,options:[{value:0,show:"-",class:"rounded text-center bg-success text-white"},{value:1,show:"limit!",class:"rounded text-center bg-danger text-white"}]},select:"STOCK_ONLIMIT"},
                        
                        {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"activa",box:bx_active_show,select:"ACTIVE",descripcion:"si el producto/servicio/insumo esta activo, se puede vender o usar"},
                    ],
                },
            ],
            
        });

    break;

    case "panelKpi":

        var pn = new Panel({
            parent:document.body,
            tipe:"kpi",
            fields:[{name:"totalMonth",title:"total de ventas del mes",box:{...bx_money}}],
        });

        pn.fieldSetValues({fieldName:"totalMonth",values:[12000]});

    break;

    case "panelChart":

        var pn = new PanelChart({
            parent:document.body,
            tipe:"chart",
            fields:[
                {name:"labels",values:["mes1","mes2","mes3"]},
                {name:"precio",values:[10,12,8]},
                {name:"limite",values:[6,4,6],type:"line"},
            ],
        });

        

    break;

    case  "panelCards":

        var pn = new PanelCards({
            parent:document.body,
            title:"panel card",
            tipe:"chart",
            fields:[
                {name:"nombre",box:{tipe:1,class:"w-100"},col:10},
                {name:"tipo",box:{tipe:3,options:[{value:1,show:"tipo1"},{value:2,show:"tipo2"}]},col:2},
                {name:"total",box:{tipe:1}},
                {name:"cantidad",box:{tipe:1}},
            ],
        });
        

        setTimeout(()=>{

            pn.fieldSetValues({fieldName:"nombre",values:["nombre1","nombre2"]});
            pn.fieldSetValues({fieldName:"tipo",values:[1,2]});

        },1000);

    break;

    case "cnxNew":

        var group = new CrudsGroup({
            userData,pageData,
            layers:[
                {
                    grid:{
                        items:[
                            {name:"prnt-sale",col:4},
                            {name:"prnt-items",col:8},
                            {name:"prnt-pays",col:8},
                            {name:"prnt-pay",col:4},
                        ]
                    }
                },
                {
                    crud:{
                        parent:"prnt-sale",name:"cr-sale",
                        title:"venta",schema:sch_sales,
                        panels:[
                            {
                                tipe:"form",title:"informacion",
                                fieldsSet:[
                                    {value:"emmit",state:"edit"},
                                    {value:"status",state:"edit"},
                                    {value:"pay",state:"edit"},
                                    {value:"customer",state:"edit"},
                                ]
                            }
                        ],
                        stateStart:"new",
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"insert",show:true,active:false},
                                    {name:"cancel",show:false},
                                ]
                            },
                            {
                                name:"reload",
                                tools:[
                                    {name:"new",show:true},
                                ],
                            }
                        ],
                    }
                },
                {
                    crud:{
                        parent:"prnt-items",name:"cr-items",
                        title:"lista de items",schema:sch_sales_products,
                        panels:[
                            {
                                tipe:"table",title:"informacion",
                                fields:[{...fld_delete}],
                                fieldsSet:[
                                    {value:"item",state:"edit"},
                                    {value:"cant",state:"edit"},
                                    {value:"priceUnit",state:"edit"},
                                    {value:"priceTotal",state:"edit"},
                                ]
                            }
                        ],
                        stateStart:"new",
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"insert",show:false},
                                    {name:"addLine",show:true},
                                ]
                            }
                        ],
                    }
                },
                /*{
                    crud:{
                        title:"lista de pagos de ventas",schema:sch_sales_pays,
                        name:"cr-pays",parent:"prnt-pays",
                        panels:[{
                            tipe:"table",
                            fields:[
                                {...fld_delete},
                                {name:"total",box:{...bx_money}},
                                {name:"ingreso",box:{...bx_shw}},
                                {name:"etiqueta",box:{...bx_shw}},
                                {name:"cuenta",box:{...bx_shw}},
                            ],
                            fieldsSet:[
                                {value:"idSale"},
                                {value:"idPay"},
                            ],
                        }],
                        stateStart:"new",
                        afterInsert:"new",
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"addLine",show:true,active:true},
                                    {name:"insert",show:false,active:true},
                                ]
                            }
                        ],
                    }
                },
                {
                    crud:{
                        parent:"prnt-pay",schema:sch_pays,
                        title:"pago",name:"cr-pay",
                        panels:[{
                            tipe:"form",head:false,
                            fieldsSet:[
                                {value:"date"},
                                {value:"total",state:"edit"},
                                {value:"income",state:"edit"},
                                {value:"account",state:"edit"},
                                {value:"tag",state:"edit"},
                            ]
                        }],
                        actionsBlock:true,
                        stateStart:"new",
                        afterCancel:"new",
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"insert",active:false,show:true},
                                    {name:"cancel",active:true,show:true},
                                ]
                            }
                        ],
                    }
                },*/
            ],
            conections:[

            ]
        });

    break;

    case "crud":

        var group = new CrudBuild({
            userData,
            layers:[
                {
                    crud:{
                        title:"ventas",schema:sch_sales,
                        name:"cr-sale",
                        panels:[
                            {
                                tipe:"form",title:"informacion",col:4,
                                fields:[
                                    {name:"id_sale",box:{tipe:0},select:"primary"},
                                ],
                                fieldsSet:[
                                    {value:"emmit",state:"edit"},
                                    {value:"status",state:"edit"},
                                    {value:"pay",state:"edit"},
                                    {value:"customer",state:"edit"},
                                    {value:"doc",state:"edit"},
                                    {value:"comment",state:"edit"},
                                    {value:"total",state:"edit",showBox:{...bx_moneyh1}},
                                ],
                            },
                            {
                                tipe:"form",title:"lista",col:8,name:"prnt-steps",
                            }
                        ],
                        stateStart:"new",
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"sizes",show:true,value:1},
                                    {name:"pages",show:true},
                                    {name:"update",show:true},
                                    
                                    {name:"addLine",show:true},
                                    {name:"cancel",show:true},
                                ],
                            },
                            {
                                name:"reload",
                                tools:[
                                    {name:"sizes",show:true,value:1},
                                    {name:"pages",show:true},
                                    {name:"update",show:true},
                                    
                                    {name:"reload",show:true},
                                    {name:"new",show:true},
                                ],
                            }
                        ],
                        inserts:[
                            {
                                field:"ID_COMPANY",
                                tipe:"const",
                                value:userData.company.id,
                            }
                        ],
                        events:[
                            {
                                name:"printByIndexs",
                                actions:[{
                                    action:({k,indexsRecords})=>{

                                        //console.log("print cr sale index:",indexsRecords);
                                        
                                        var cr_items = group.layersGet().parentGetBuild({parentName:"cr-items"});
                                        if(cr_items){

                                            indexsRecords.forEach(index => {
                                            
                                                var data = k.recordGetData()[index];
                                                var value = data.primary;
    
                                                cr_items.joinSet({
                                                    name:"sale-cnx-items",
                                                    select:"ID_SALE",
                                                    index,
                                                    value
                                                });
    
                                                cr_items.PrintData();
                                            });
    
                                            var stateName = k.bodyGet().stateGet();
                                            console.log("sale -> print by index -> state:", stateName);
                                            cr_items.bodyGet().stateSet({stateName});    
                                        }

                                        /*if(k.bodyGet().stateGet() == "reload"){

                                            cr_items.bodyGet().stateSet({stateName:"reload"});
                                        }
                                        else
                                        {
                                            cr_items.bodyGet().stateSet({stateName:"new"});
                                        }*/
                                        
                                        //cr_items.PrintData();
                                    }
                                }]
                            },
                        ],
                        conditions:[
                            {
                                table:sch_sales.table,
                                field:"ID_COMPANY",
                                inter:"=",
                                value:userData.company.id,
                            },
                        ],
                    }
                },
                {
                    steps:{
                        parent:"prnt-steps",
                        items:[
                            {name:"prnt-pays"},
                            {name:"prnt-items"},
                        ],
                    }
                },
                //lista de items
                /*{
                    grid:{
                        parent:"prnt-items",
                        items:[
                            {name:"btn-item-add",box:{...fld_edit.box,value:"añadir nuevo producto"},tipe:0,col:4},
                            {name:"div-item",box:{tipe:0,class:"conteiner"},tipe:0},
                            {name:"prnt-items-list",col:12},
                        ],
                    },
                },
                {
                    crud:{
                        title:"lista de items",schema:sch_sales_products,
                        name:"cr-items",parent:"prnt-items-list",
                        selects:[
                            {table:sch_sales_products.table,field:"ID_SALE"},
                        ],
                        panels:[{
                            tipe:"table",h:400,
                            fields:[
                                {name:"id",box:{tipe:0},select:"primary"},
                                {name:"id_sale",box:{tipe:0},select:"ID_SALE"},
                                {...fld_delete},
                            ],
                            fieldsSet:[
                                {value:"item",state:"edit"},
                                {value:"cant",state:"edit"},
                                {value:"priceUnit",state:"edit"},
                                {value:"priceTotal",state:"edit"},
                            ]
                        }],
                        stateStart:"new",
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"update",show:true},
                                    {name:"addLine",show:true},
                                    {name:"sizes",show:true,value:10},
                                    {name:"pages",show:true},
                                    {name:"data",show:true},
                                    {name:"cancel",show:true},
                                ],
                            },
                            {
                                name:"reload",
                                tools:[
                                    {name:"update",show:true},
                                    {name:"addLine",show:true},
                                    {name:"sizes",show:true,value:10},
                                    {name:"pages",show:true},
                                    //{name:"data",show:true},
                                    //{name:"new",show:true},
                                ],
                            }
                        ],
                    }
                },*/
                //lista de pagos
                //{grid:{parent:"prnt-pays",items:[{name:"prnt-pays",col:12}]}},
                {
                    grid:{
                        parent:"prnt-pays",
                        items:[
                            {name:"prnt-pays-main",col:12},
                            {name:"prnt-pays-md",col:12},
                        ],
                    }
                },
                {
                    crud:{
                        parent:"prnt-pays",title:"lista de pagos",
                        name:"cr-pays",tableMain:sch_sales_pays.table,
                        selectPrimary:sch_sales_pays.fieldPrimary,
                        conditions:[{
                            table:sch_sales_pays.table,
                            field:"ID_SALE",
                            inter:"=",
                            value:390
                        }],
                        selects:[
                            {table:sch_sales_pays.table,field:"ID_SALE"},
                            {table:sch_sales_pays.table,field:"ID_PAY"},
                        ],
                        panels:[{
                            tipe:"table",
                            fields:[
                                {...fld_delete},
                                {...fld_edit},
                                {name:"id_sale",box:{...bx_shw},select:"ID_SALE"},
                                {name:"id_pay",box:{...bx_shw},select:"ID_PAY"},
                                {name:"cuenta",box:{...bx_shw},select:"ACCOUNT"},
                                {name:"total",box:{...bx_money},select:"TOTAL"},
                            ],
                        }],
                        stateStart:"new",
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"new",show:true,active:false},
                                    {name:"sizes",show:true,value:10},
                                    {name:"pages",show:true},
                                ],
                            },
                            {
                                name:"reload",
                                tools:[
                                    {name:"sizes",show:true,value:10},
                                    {name:"reload",show:true},
                                    {name:"pages",show:true},
                                    {name:"new",show:true,active:false},
                                ],
                            }
                        ],
                        events:[
                            {
                                name:"toolUpdate",
                                actions:[{
                                    action:({tool})=>{

                                        if(tool.name=="new"){
                                            
                                            group.layersGet().parentGetBuild({parentName:"md-pay"}).SetActive({active:true});
                                            //group.layersGet().parentGetBuild({parentName:"cr-pay"}).bodyGet().stateSet({stateName:"new"});
                                        }
                                    }
                                }]
                            },
                            {
                                name:"boxUpdate",
                                actions:[{
                                    action:({y,field,index})=>{

                                        
                                        var cr_pay = group.layersGet().parentGetBuild({parentName:"cr-pay"});

                                        if(field.action=="delete"){

                                            //cr_pay.insertRecordRemove({y});
                                        }

                                        if(field.action=="edit"){

                                            group.layersGet().parentGetBuild({parentName:"md-pay"}).SetActive({active:true});
                                            cr_pay.PrintByIndexsRecords({indexsRecords:[index]});
                                        }
                                    }
                                }]
                            },
                        ],
                        inserts:[
                            {
                                field:"ID_SALE",
                                value:397,
                            }
                        ],
                    }
                },
                //pago!!
                {modal:{parent:"prnt-pays-md",name:"md-pay"}},
                {
                    crud:{
                        parent:"md-pay",title:"pago",
                        schema:sch_pays,name:"cr-pay",
                        panels:[{
                            tipe:"form",head:false,
                            fieldsSet:[
                                {value:"date",state:"edit"},
                                {value:"total",state:"edit"},
                                {value:"income",state:"edit"},
                                {value:"account",state:"edit"},
                                {value:"tag",state:"edit"},
                            ],
                        }],
                        stateStart:"new",
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"insert",show:true},
                                    {name:"addLine",show:true},

                                    {name:"update",show:true},
                                    {name:"sizes",show:true},
                                    {name:"pages",show:true},
                                ]
                            }
                        ],
                        events:[
                            {
                                name:"toolUpdate",
                                actions:[{
                                    action:({tool,k,y})=>{
                                        
                                        if(tool.name=="insert"){

                                            /*var inserts = [];
                                            k.fieldsGet().forEach(field => {
                                                
                                                if(field.select!=null){

                                                    inserts.push({
                                                        field:field.select,
                                                        value:k.fieldGetValues({fieldName:field.name})[0],
                                                    });
                                                }
                                            });

                                            group.InsertsAdd({
                                                table:sch_pays.table,
                                                selectPrimary:sch_pays.fieldPrimary,
                                                inserts,
                                            });*/
                                        }
                                    }
                                }],
                            },
                            {
                                name:"recordUpdate",
                                actions:[{
                                    action:({k,type})=>{
                                        

                                        var cr_pay = k;
                                        var cr_pays = group.layersGet().parentGetBuild({parentName:"cr-pays"});
                                        
                                        var data = cr_pay.recordGetData();
                                        //console.log("cr pay data:",data);
                                        
                                        cr_pays.recordSetData({data});
                                        cr_pays.PrintData();
                                        
                                    }
                                }],
                            }
                        ]
                    }
                }
                //customers
                /*{
                    crud:{
                        schema:sch_customers,name:"cr-cust",
                        title:"lista de clientes",
                        panels:[{
                            tipe:"form",head:false,
                            fields:[{...fld_delete}],
                            fieldsSet:[
                                {value:"name",state:"edit"},
                                {value:"document",state:"edit"},
                                {value:"nroDoc",state:"edit"},
                            ],
                        }],
                        stateStart:"reload",
                        states:[
                            {
                                name:"reload",
                                tools:[
                                    {name:"new",show:true},
                                    {name:"reload",show:true},
                                    {name:"pages",show:true},
                                    {name:"sizes",show:true,value:10},
                                    {name:"update",show:true},
                                    {name:"addLine",show:true},
                                ],
                            },
                            {
                                name:"new",
                                tools:[
                                    {name:"addLine",show:true},
                                    {name:"cancel",show:true},
                                    {name:"pages",show:true},
                                    {name:"sizes",show:true,value:10},
                                    {name:"insert",show:true},
                                ],
                            }
                        ],
                        inserts:[
                            {
                                table:sch_customers.table,
                                field:"ID_COMPANY",
                                value:"1",
                            }
                        ],
                    }
                }*/
            ],
            /*conections:[
                {
                    masterCrud:"cr-sale",
                    masterSelect:"ID_SALE",
                    maidCrud:"cr-items",
                    maidSelect:"ID_SALE",
                },
                {
                    masterCrud:"cr-pays",
                    masterSelect:"ID_PAY",
                    maidCrud:"cr-pay",
                    maidSelect:"ID_PAY",
                }
            ],*/
        });

    break;
}
