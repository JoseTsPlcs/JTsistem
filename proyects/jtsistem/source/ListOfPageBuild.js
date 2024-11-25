

//------pageBuildConfig-------

function pageBuildConfig_saleControls({filters,dateFilter=true}) {
  

    const eventPdf = ({k})=>{
  
      var userData = k.CallEvent({name:"userData"});
      var dataMain = k.Reload_GetData();
      var crudList = k.CallEvent({name:"getGroupBuild"}).crudGetBuild({crudName:"cr-items"});
      var dataList = crudList.Reload_GetData();
  
      console.log("DOWLAND PDF OF SALE!!!",dataMain,dataList);
  
      var invoiceData = {
      title:"venta",
      invoiceNumber: '001-001-000000'+dataMain[0]['ID_SALE'],
      invoiceDate: dataMain[0]['sales-DATE_EMMIT'],
      companyName: userData.company.nameReal,
      companyRUC: userData.company.ruc,
      companyAddress: userData.company.direccion,
      companyPhone: userData.company.telf,
      companyLogo:userData.company.logo,
      customerName: dataMain[0]['customers-NAME'],
      customerDocumentType: 'dni',
      customerDocumentNumber: dataMain[0]['customers-NRO_DOCUMENT'],
      customerPhone: dataMain[0]['customers-PHONE'],
      customerAddress: dataMain[0]['customers-DIRECCION'],
      items: [
          { detail: 'Servicio de Consultoría', type: 'Servicio', quantity: 1, unitPrice: 150, totalPrice: 150 },
      ],
      dscto:0,
      };
  
      var itemOptions = crudList.Loaded_GetLoadOptions({loadName:"ld-item",loadShow:"show"});
      
  
      invoiceData.items = dataList.map(d=>{
  
        return {detail:itemOptions.find(op=>op.value==d["sales_products-ID_PRODUCT"])["show"],type:"",quantity:d["sales_products-CANT"],unitPrice:parseFloat(d["sales_products-PRICE_UNIT"]),totalPrice:parseFloat(d["sales_products-PRICE_TOTAL"])};
      })
  
      generateInvoicePDF(invoiceData);
    }
  
    return {
      type:"control",
      schema:sch_sales,
      mainControlVisual:{
          fields:[
              {value:"customer",state:"show"},
              {value:"status",state:"edit"},
              {value:"pay",state:"edit"},
              {value:"total",state:"show"},
              {value:"comment",state:"edit"},
              {value:"emmit",state:"edit",filter:dateFilter},
              {value:"worker",state:"edit"},
          ],
      },
      filters,
      mainDetailVisual:{
          fields:[
              {value:"emmit",state:"show"},
              {value:"customer",state:"show"},
              {value:"status",state:"show"},
              {value:"pay",state:"show"},
              {value:"total",state:"show"},
          ],
      },
  
      schemaItems:sch_sales_products,
      itemDetailVisual:{
          fields:[
              {value:"item",state:"show"},
              {value:"cant",state:"show"},
              {value:"priceUnit",state:"show"},
              {value:"priceTotal",state:"show"},
          ],
      },
  
      page:"sale-new",
      fieldTotalName:"pay",
  
      eventPdf,
    }
}
  
function pageBuildConfig_items({title,fields=[]}) {

return {
    layers:[
    {
        grid:{
        items:[
            {name:"main",col:12},
        ]
        }
    },
    {
        crud:{
        recordName:"item",parent:"main",
        name:"cr-items",title,
        schema:sch_items,
        panels:[
            {
            tipe:"table",
            fieldsSet:[
                {value:"name"},
                {value:"tipe"},
                {value:"tag"},
                ...fields,
                {value:"active"},
            ],
            }
        ],
        states:[
            {
            name:"reload",
            tools:[
                {name:"reload",show:true},
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"sizes",show:true,value:10},
                {name:"pages",show:true},
            ]
            }
        ]
        }
    }
    ],
}
}

function pageBuildConfig_inform_sales({}) {

    return {
        type:"free",
        
        script:({userData,pageData})=>{
            
            return {
                layers:[
                    {
                    crud:{
                        name:"cr-sales",
                        parent:pageData.body,
                        title:"reporte de ventas",recordName:"venta",
                        tableMain:sch_sales.table,
                        selects:[
                        {table:sch_sales.table,field:"ID_SALE",primary:true},
                        {table:sch_sales.table,field:"DATE_EMMIT"},
                        {table:sch_sales.table,field:"TOTAL"},
                        ],
                        conditions:[
                        {
                            table:sch_sales.table,
                            field:"ID_COMPANY",
                            inter:"=",
                            value:userData.company.id,
                        }
                        ],
                        filters:[
                        {...flt_period,box:{...flt_period.box,value:"day"}},
                        {col:6,name:"fecha min",box:{tipe:2,value:Date_FirstOfMoth()},select:{table:sch_sales.table,field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha minima de venta"},
                        {col:6,name:"fecha max",box:{tipe:2,value:Date_LastOfMoth()},select:{table:sch_sales.table,field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha maxima de venta"},
                        {name:"estado",box:{tipe:4,options:op_sales_status,value:op_sales_status.filter(op=>op.value!=5).map(op=>{return op.show;})},select:{table:sch_sales.table,field:"ID_STATUS"},descripcion:"busca por estado de ventas"},
                        {name:"pagado",box:{tipe:4,options:op_sales_paid,value:[op_sales_paid.find(op=>op.value==1).show]},select:{table:sch_sales.table,field:"PAID"},descripcion:"busca por ventas pagadas o pendientes de pago"},
                        ],
                        config:{show:false},
                        states:[
                        {
                            name:"reload",
                            tools:[
                            {name:"reload",show:true},
                            {name:"config",show:true},
                            {name:"tutorial",show:true},
                            {name:"sizes",value:999,show:false},
                            ]
                        },
                        ],
                        panels:[
                        {
                            title:"grafico",tipe:"form",head:false,
                            fields:[
                            {action:"div",name:"prnt-sale",box:{tipe:0,class:"conteiner w-100 m-0 p-0"},tipe:0},
                            ],
                        },
                        /*{
                            tipe:"table",title:"detalle de ventas",
                            fields:[
                            {name:"id",select:"ID_SALE",box:{tipe:0}},
                            {name:"sale date",select:"DATE_EMMIT",box:{tipe:0}},
                            {name:"total",select:"TOTAL",box:{tipe:0}},
                            ],
                        },*/
                        ],
                        events:[
                        {
                            name:"printAfter",
                            actions:[{
                            action:({k})=>{
        
                                var labelsCal = DataGetCalculateByLabel({
                                data:k.Reload_GetData(),
                                labelField:"DATE_EMMIT",
                                period:k.bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"periodo"}).GetValue(),
                                calcField:"TOTAL",
                                });
                                console.log(labelsCal);                      
        
                                var chart_evol = k.group.parentGetBuild({parentName:"chart-evol"});
                                chart_evol.fieldSetValues({
                                fieldName:"labels",
                                values:labelsCal.map(lb=>{return lb.value}),
                                });
                                chart_evol.fieldSetValues({
                                fieldName:"ventas",
                                values:labelsCal.map(lb=>{return lb.sum}),
                                });
        
                                var tot_v = parseFloat(labelsCal.reduce((acum,v)=>{return acum+v.sum;},0).toFixed(2));
                                var prom_v = tot_v/(labelsCal.reduce((acum,v)=>{return acum+v.count;},0));
        
                                k.group.parentGetBuild({parentName:"kpi-tot"}).fieldSetValues({fieldName:"tot",values:[tot_v]});
                                k.group.parentGetBuild({parentName:"kpi-prom"}).fieldSetValues({fieldName:"prom",values:[prom_v]});
                                
                            }
                            }]
                        },
                        {
                            name:"stateSetFirst",
                            actions:[{
                            action:({k})=>{}
                            }]
                        },
                        ],
                    }
                    },
                    {
                    grid:{
                        parent:"prnt-sale",
                        items:[
                        {col:6,name:"prnt-tot"},
                        {col:6,name:"prnt-prom"},
                        {col:12,name:"prnt-evol"},
                        ],
                    }
                    },
                    {panel:{name:"kpi-tot",parent:"prnt-tot",tipe:"kpi",fields:[{name:"tot",title:"total vendido",box:{...bx_moneyh1}}]}},
                    {panel:{name:"kpi-prom",parent:"prnt-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio vendido",box:{...bx_moneyh1}}]}},
                    {
                    panel:{
                        tipe:"chart",parent:"prnt-evol",name:"chart-evol",title:"evolutivo de ventas",
                        fields:[
                        {name:"labels",values:["month1","month2","month3",]},
                        {name:"ventas",values:[100,200,300]},
                        ],
                    }
                    }
                ],
            }
        }
    }
}

function pageBuildConfig_inform_products({}) {

    return {
        type:"free",
        script:({userData,pageData,build})=>{

            
            const group = ()=>{return build.groupGet();}
            const EvolProduct = ({productName})=>{
        
                var crud = group().parentGet({parentName:"cr-items"}).build;
                var dataset = crud.ReloadDataSetGet({dataSetName:"products"});
                var productData = dataset.result.find(rst=>rst.name == productName);
                console.log("EVOL PRODUCT",productData);
        
                //-----cant----
                
                var kpi_cant_total = group().parentGet({parentName:"kpi-cant-tot"}).build;
                kpi_cant_total.fieldSetValues({fieldName:"tot",values:[productData.cant]});
        
                var kpi_cant_prom = group().parentGet({parentName:"kpi-cant-prom"}).build;
                kpi_cant_prom.fieldSetValues({fieldName:"prom",values:[productData.cantProm]});
        
                var chr_cant = group().parentGet({parentName:"chrt-cant-evol"}).build;
                chr_cant.titleSet({title:"evolutivo de cantidades del producto: " + productName});
                chr_cant.fieldSetValues({fieldName:"labels",values:productData.dates.map(d=>{return d.label;})});
                chr_cant.fieldSetValues({fieldName:"cant",values:productData.dates.map(d=>{return d.cant;})});
        
                //-----sale----
        
                var kpi_sale_total = group().parentGet({parentName:"kpi-sale-tot"}).build;
                kpi_sale_total.fieldSetValues({fieldName:"tot",values:[productData.money]});
        
                var kpi_sale_prom = group().parentGet({parentName:"kpi-sale-prom"}).build;
                kpi_sale_prom.fieldSetValues({fieldName:"prom",values:[productData.moneyProm]});
        
                var chr_sale = group().parentGet({parentName:"chrt-sale-evol"}).build;
                chr_sale.titleSet({title:"evolutivo de ventas del producto: " + productName});
                chr_sale.fieldSetValues({fieldName:"labels",values:productData.dates.map(d=>{return d.label;})});
                chr_sale.fieldSetValues({fieldName:"sale",values:productData.dates.map(d=>{return d.money;})});
        
            };
            return {
                layers:[
                    {
                    crud:{
                        name:"cr-items",
                        parent:pageData.body,
                        title:pageData.title,
                        states:[
                            {
                            name:"reload",
                            tools:[
                                {name:"sizes",show:false,value:999},
                                {name:"pages",show:false},
                                {name:"reload",show:true},
                                {name:"tutorial",show:true},
                                {name:"config",show:true},
                            ],
                            },
                            {
                            name:"block",
                            tools:[
                                {name:"reload",show:true},
                            ],
                            }
                        ],
                        stateStart:"reload",
                    
                        tableMain:"sales_products",
                        selects:[
                            {table:'sales_products', field:'ID',primary:true},
                            {table:'sales',field:'DATE_EMMIT'},
                            {table:'sales_products',field:'ID_SALE'},
                            {table:'sales_products',field:'ID_PRODUCT'},
                            {table:'products',field:'NAME',as:'pNAME'},
                            {table:'products_tags',field:'NAME',as:'tNAME'},
                            {table:'unids',field:'SIMBOL',as:'uNAME'},
                            {table:'sales_products',field:'CANT'},
                            {table:'sales_products',field:'PRICE_UNIT'},
                            {table:'sales_products',field:'PRICE_TOTAL'},    
                        ],
                        joins:[
                            {
                            main:{table:"sales_products",field:"ID_PRODUCT"},
                            join:{table:"products",field:"ID_PRODUCT"},
                            tipe:"LEFT",
                            },
                            {
                            main:{table:"products",field:"ID_PRODUCT_TAG"},
                            join:{table:"products_tags",field:"ID_PRODUCT_TAG"},
                            tipe:"LEFT",
                            },
                            {
                            main:{table:"products",field:"UNID_ID"},
                            join:{table:"unids",field:"ID_UNID"},
                            tipe:"LEFT",
                            },
                            {
                            main:{table:"sales_products",field:"ID_SALE"},
                            join:{table:"sales",field:"ID_SALE"},
                            tipe:"LEFT",
                            }
                        ],
                        loads:[
                            //ld_unids,
                            {
                            name:"ld-products_tags",
                            tableMain:"products_tags",
                            selects:[
                                {table:"products_tags",field:"ID_PRODUCT_TAG",as:"value"},
                                {table:"products_tags",field:"NAME",as:"show"},
                            ],
                            conditions:[
                                {
                                table:"products_tags",
                                field:"ID_COMPANY",
                                inter:"=",
                                value:userData.company.id,
                                },
                            ],
                            }
                        ],
                        conditions:[
                        {
                            table:"sales",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:userData.company.id,
                        },
                        ],
        
                        configShow:true,    
                        filters:[
                            {...flt_period},
                            {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
                            {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
                            {name:"producto",box:bx_input,select:{table:"products",field:"NAME"},descripcion:"buscar por nombre de producto/servicio/insumo"},
                            {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
                            {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"},
                            {name:"pagado",box:{tipe:4,options:op_sales_paid,value:[op_sales_paid.find(op=>op.value==1).show]},select:{table:"sales",field:"PAID"}},
                            {name:"estado de ventas",box:{tipe:4,options:op_sales_status,value:op_sales_status.filter(st=>st.value!=5).map(st=>{return st.show})},select:{table:"sales",field:"ID_STATUS"}},
                        ],
                        panels:[
                        {
                            head:false,tipe:"form",col:12,
                            fields:[
                            {name:"prnt-top",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}},
                            ],
                        },
                        {
                            head:false,col:12,tipe:"form",
                            fields:[
                            {name:"prnt-evol",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}},
                            ],
                        }
                        ],
        
                        events:[
                        {
                            name:"printBefore",
                            actions:[{
                            action:({result,k})=>{
        
                                var period = k.bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"periodo"}).GetValue();
                                console.log("PRINT BEFORE",period, result);
        
                                var products = [];
                                var dates = [];
        
                                result.forEach(rst => {
                                
                                var dateLabel = Date_GetLabel({dateString:rst["DATE_EMMIT"],period});
                                
                                if(!dates.find(d=>d==dateLabel)) dates.push(dateLabel);
        
                                var productFound = products.find(p=>p.id == rst["ID_PRODUCT"]);
                                var money = parseFloat(rst["PRICE_TOTAL"]);
                                var cant = parseFloat(rst["CANT"]);
                                
        
                                if(!productFound){
        
                                    products.push({
                                    id:rst["ID_PRODUCT"],
                                    name:rst["pNAME"],
                                    unid:rst["uNAME"],
                                    count:1,
                                    money,
                                    cant,
                                    dates:[{
                                        label:dateLabel,
                                        cant,
                                        money,
                                    }],
                                    });
        
                                }
                                else
                                {
        
                                    productFound.count++;
                                    productFound.money += money;
                                    productFound.cant += cant;
        
                                    var productDate = productFound.dates.find(d=>d.label == dateLabel);
                                    if(productDate){
        
                                    productDate.cant += cant;
                                    productDate.money += money;
                                    }
                                    else
                                    {
                                    productFound.dates.push({
                                        label:dateLabel,
                                        cant,
                                        money,
                                    });
                                    }
        
                                }
        
                                });
        
                                products.forEach(prd => {
                                
                                prd.moneyProm = (prd.money/prd.dates.length).toFixed(2);
                                prd.cantProm = (prd.cant/prd.dates.length).toFixed(2) + " " + prd.unid;
                                prd.cant += " " + prd.unid;
        
                                });
        
                                products.sort((a, b) => b.money - a.money);
        
                                console.log("TRANSFORM DATA",products,dates);
                                k.ReloadDataSetAdd({dataSetName:"products",result:products});
                                
                                if(products.length > 0) EvolProduct({productName:products[0].name,group:k.group});
        
                                //-----print top list-----
        
                                var tb_top = k.group.parentGet({parentName:"tb-top"}).build;
                                tb_top.fieldSetValues({
                                fieldName:"product",
                                values:products.map(p=>{return p.name}),
                                });
                                tb_top.fieldSetValues({
                                fieldName:"total",
                                values:products.map(p=>{return p.money}),
                                });
                                tb_top.fieldSetValues({
                                fieldName:fld_search.name,
                                values:Array(products.length).fill(fld_search.box.value),
                                });
        
                                return {data:products};
        
                            }
                            }]
                        }
                        ],
                    }
                    },
                    //window top
                    {
                    panel:{
                        parent:"prnt-top",
                        tipe:"form",title:"top de productos",
                        fields:[
                        {action:"div",name:"div-top",tipe:0,box:{tipe:0,class:"w-100 conteiner"}},
                        ],
                    }
                    },
                    //top
                    {
                    panel:{
                        parent:"div-top",tipe:"table",maxH:200,name:"tb-top",
                        fields:[
                        {name:"product",title:"producto",attributes:att_ln},
                        {name:"total",title:"total vendido",box:{...bx_money},attributes:att_ln},
                        {...fld_search,attributes:att_btn},
                        ],
                        events:[
                        {
                            name:"boxUpdate",
                            actions:[{
                            action:({k,field,y,value})=>{
        
                                if(field.action == "search"){
                                
                                EvolProduct({productName:k.fieldGetValues({fieldName:"product"})[y],group:k.group});
                                }
        
                            }
                            }]
                        }
                        ],
                    }
                    },
                    //evol
                    {grid:{parent:"prnt-evol",items:[{name:"div-cant",col:6},{name:"div-sale",col:6}]}},
                    {
                    panel:{
                        parent:"div-cant",title:"evolutivo de cantidades",tipe:"form",blocked:false,
                        fields:[{name:"stp-cant",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}}]},
                    },
                    {
                    panel:{
                        parent:"div-sale",title:"evolutivo de ventas",tipe:"form",blocked:false,
                        fields:[{name:"stp-sale",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}}]
                    }
                    },
                    //evol - cant
                    {
                    grid:{
                        parent:"stp-cant",
                        items:[
                        {name:"prnt-cant-tot",col:6},
                        {name:"prnt-cant-prom",col:6},
                        {name:"prnt-cant-evol",col:12},
                        ],
                    }
                    },
                    {panel:{parent:"prnt-cant-tot",name:"kpi-cant-tot",tipe:"kpi",fields:[{name:"tot",title:"total vendido",box:{tipe:0,class:"w-100 text-center h1",value:0}}]}},
                    {panel:{parent:"prnt-cant-prom",name:"kpi-cant-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio vendido",box:{tipe:0,class:"w-100 text-center h1",value:0}}]}},
                    {
                    panel:{
                        parent:"prnt-cant-evol",name:"chrt-cant-evol",
                        tipe:"chart",title:"evolutivo del producto seleccionado",
                        fields:[
                        {name:"labels",values:["mes1","mes2"]},
                        {name:"cant",values:[1,2]},
                        ],
                    }
                    },
                    //evol - sale
                    {
                    grid:{
                        parent:"stp-sale",
                        items:[
                        {name:"prnt-sale-tot",col:6},
                        {name:"prnt-sale-prom",col:6},
                        {name:"prnt-sale-evol",col:12},
                        ],
                    }
                    },
                    {panel:{parent:"prnt-sale-tot",name:"kpi-sale-tot",tipe:"kpi",fields:[{name:"tot",title:"total vendido",box:{...bx_money,class:"w-100 text-center h1",value:0}}]}},
                    {panel:{parent:"prnt-sale-prom",name:"kpi-sale-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio vendido",box:{...bx_money,class:"w-100 text-center h1",value:0}}]}},
                    {
                    panel:{
                        parent:"prnt-sale-evol",name:"chrt-sale-evol",
                        tipe:"chart",title:"evolutivo del producto seleccionado",
                        fields:[
                        {name:"labels",values:["mes1","mes2"]},
                        {name:"sale",values:[1,2]},
                        ],
                    }
                    },
                ],
            }
        }
    }

    
}

function pageBuildConfig_inform_customer({}) {
        
    return {
        type:"free",
        script:({userData,pageData,build})=>{

            const group = ()=>{return build.groupGet();}
            return {
                layers:[
                    {
                    crud:{
                        parent:pageData.body,name:"cr-customers",
                        title:pageData.title,
                        states:[
                            {
                            name:"reload",
                            tools:[
                                {name:"tutorial",show:true},
                                {name:"config",show:true},
                                //{name:"load",show:true},
                                {name:"sizes",show:false,value:999},
                                {name:"reload",show:true},
                            ],
                            },
                            {
                            name:"block",
                            tools:[
                                {name:"sizes",show:false,value:999},
                                {name:"reload",show:true},
                            ],
                            }
                        ],
                        stateStart:"reload",
        
                        tableMain:"sales",
                        selects:[
                            {table:'sales', field:'ID_SALE',primary:true},
                            {table:'sales',field:'DATE_EMMIT'},
                            {table:'sales',field:"TOTAL"},
                            {table:'customers',field:"NAME"}, 
                        ],
                        joins:[
                            {
                            main:{table:"sales",field:"ID_CUSTOMER"},
                            join:{table:"customers",field:"ID_CUSTOMER"},
                            tipe:"LEFT",
                            },
                        ],
                        conditions:[
                        {
                            table:"sales",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:company_id,
                        },
                        ],
        
                        configShow:false,    
                        filters:[
                            //{name:"periodo",box:{tipe:3,options:op_date_ranges,value:op_date_ranges[2].value}},
                            {name:"cliente",box:{tipe:1,class:"w-100"},select:{table:"customers",field:"NAME",inter:"LIKE"}},
                            {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
                            {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
                            {name:"pagado",box:{tipe:4,options:op_sales_paid,value:[op_sales_paid[0].show]},select:{table:"sales",field:"PAID"}},
                            {name:"estado de ventas",box:{tipe:4,options:op_sales_status,value:op_sales_status.filter(st=>st.value!=5).map(st=>{return st.show})},select:{table:"sales",field:"ID_STATUS"}},
                        ],
        
                        events:[
                        {
                            name:"printBefore",
                            actions:[{
                            action:({k,result})=>{
        
                                console.log("TRANSFORM DATA",result);
        
                                var customers = [];
                                var datesTotal = [];
        
                                result.forEach(rst => {
                                
                                var rstName = rst["NAME"];
                                var rstDate = rst["DATE_EMMIT"];
                                var rstDateLabel = Date_GetLabel({dateString:rstDate,period:"day"});
                                var rstTotal = parseFloat(rst["TOTAL"]);
        
                                var custFound = customers.find(cst=>cst.name == rstName);
                                if(!custFound){
        
                                    customers.push({
                                    name:rstName,
                                    total:rstTotal,
                                    dates:[
                                        {
                                        label:rstDateLabel,
                                        total:rstTotal,
                                        }
                                    ],
                                    });
                                }
                                else
                                {
                                    custFound.total += rstTotal;
                                    var custFounDate = custFound.dates.find(dt=>dt.label == rstDateLabel);
                                    if(custFounDate) custFounDate.total += rstTotal;
                                    else
                                    {
                                    custFound.dates.push({
                                        label:rstDateLabel,
                                        total:rstTotal,
                                    });
                                    }
                                }
        
                                var dateTotalFound = datesTotal.find(dt=>dt.label == rstDateLabel);
                                if(dateTotalFound) dateTotalFound.total += rstTotal;
                                else{
        
                                    datesTotal.push({
                                    label:rstDateLabel,
                                    total:rstTotal,
                                    });
                                }
                                
                                });
        
                                customers.forEach(cust => {
                                
                                cust.prom = cust.total/cust.dates.length;
                                });
        
                                customers.sort((a,b)=>{return -a.total + b.total});
        
                                console.log("TRANSFORMED DATA",customers,datesTotal);
        
                                k.ReloadDataSetAdd({dataSetName:"customers",result:customers});
        
                                //customers = customers.slice(0,10);
                                var tb_lst = k.group.parentGet({parentName:"tb-list"}).build;
                                tb_lst.fieldSetValues({fieldName:"cliente",values:customers.map(ct=>{return ct.name})});
                                tb_lst.fieldSetValues({fieldName:"total",values:customers.map(ct=>{return ct.total})});
                                tb_lst.fieldSetValues({fieldName:fld_search.name,values:Array(customers.length).fill(fld_search.box.value),})
        
                                k.CallEvent({name:"customerEvol",params:{customerName:customers[0].name}});
                                
                                
                                return null;
                            }
                            }]
                        },
                        {
                            name:"customerEvol",
                            actions:[{
                            action:({k,customerName})=>{
        
                                var customers = k.ReloadDataSetGet({dataSetName:"customers"}).result;
                                var datacustomer = customers.find(cus=>cus.name == customerName);
        
                                var chr_evol = k.group.parentGet({parentName:"chr-evol"}).build;
                                
                                chr_evol.titleSet({title:"Evolutivo de compras del cliente: " + customerName});
                                chr_evol.fieldSetValues({fieldName:"labels",values:datacustomer.dates.map(dt=>{return dt.label})});
                                chr_evol.fieldSetValues({fieldName:"total",values:datacustomer.dates.map(dt=>{return dt.total})});
        
                                var kpi_tot = k.group.parentGet({parentName:"kpi-tot"}).build;
                                kpi_tot.fieldSetValues({fieldName:"tot",values:[datacustomer.total]});
        
                                var kpi_prom = k.group.parentGet({parentName:"kpi-prom"}).build;
                                kpi_prom.fieldSetValues({fieldName:"prom",values:[datacustomer.prom]});
        
                            }
                            }]
                        },
                        ],
        
                        panels:[
                        {
                            tipe:"form",head:false,
                            fields:[
                            {name:"inform",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100 p-0 m-0"}},
                            ],
                        }
                        ],
                        
                        configShow:true,
                    }
                    },
                    {
                    grid:{
                        parent:"inform",
                        items:[
                        {name:"prnt-cust",col:8},
                        {name:"prnt-tb",col:4},
                        ]
                    }
                    },
                    {
                    grid:{
                        parent:"prnt-cust",
                        items:[
                        {name:"prnt-tot",col:6},
                        {name:"prnt-prom",col:6},
                        {name:"prnt-chr",col:12},
                        ],
                    }
                    },
                    {panel:{name:"kpi-tot",parent:"prnt-tot",tipe:"kpi",fields:[{name:"tot",title:"total comprado",box:{...bx_moneyh1}}]}},
                    {panel:{name:"kpi-prom",parent:"prnt-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio comprado",box:{...bx_moneyh1}}]}},
                    {
                    panel:{
                        parent:"prnt-tb",
                        tipe:"form",title:"top de clientes",
                        fields:[{action:"div",name:"prnt-top",tipe:0,box:{tipe:0,class:"w-100 conteiner"}}],
                    }
                    },
                    {
                    panel:{
                        parent:"prnt-top",name:"tb-list",
                        tipe:"table",maxH:300,
                        fields:[
                        {...fld_search},
                        {name:"total",box:{...bx_money}},
                        {name:"cliente",box:{...bx_shw}},
                        ],
                        events:[
                        {
                            name:"boxUpdate",
                            actions:[{
                            action:({field,y})=>{
                                
                                if(field.action == fld_search.action){
        
                                var cr_main = group().parentGet({parentName:"cr-customers"}).build;
                                
                                var customers = cr_main.ReloadDataSetGet({dataSetName:"customers"}).result;
                                cr_main.CallEvent({name:"customerEvol",params:{customerName:customers[y].name}});
                                }
                            }
                            }]
                        }
                        ],
                    }
                    },
                    {
                    panel:{
                        name:"chr-evol",
                        parent:"prnt-chr",
                        tipe:"chart",
                        fields:[
                        {name:"labels",title:"meses",values:["mes1","mes2","mes3","mes4","mes5"]},
                        {name:"total",title:"total de venta",values:[123,243,245,234,100]},
                        ],
                    }
                    }
                ],
            }
        }
    }
}

function pageBuildConfig_inform_flujo({}) {
    
    return {
        type:"free",
        script:({userData,pageData,build})=>{

            const group = ()=>{return build.groupGet()};

            var lines = [
                "VENTAS",
                "COMPRAS",
                "UTILIDAD BRUTA",
            ];

            return {

                layers:[
                    {
                    crud:{
                        name:"cr-main",
                        parent:pageData.body,
                        title:pageData.title,
                        states:[
                            {
                            name:"reload",
                            tools:[
                                {name:"tutorial",show:true},
                                {name:"config",show:true},
                                {name:"sizes",show:false,value:999},
                                {name:"pages",show:false},
                                {name:"reload",show:true},
                            ],
                            },
                            {
                            name:"block",
                            tools:[
                                {name:"reload",show:true},
                            ],
                            }
                        ],
                        stateStart:"reload",
                    
                        tableMain:sch_sales.table,
                        selects:[
                            {table:sch_sales.table,field:sch_sales.fieldPrimary,primary:true},
                            {table:'sales',field:'DATE_EMMIT'},
                            {table:sch_sales.table,field:"TOTAL"},
                        ],
                        conditions:[
                        {
                            table:"sales",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:userData.company.id,
                        },
                        ],
        
                        configShow:true,    
                        filters:[
                            {name:"periodo",box:{tipe:3,options:op_date_ranges,value:op_date_ranges[2].value}},
                            {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
                            {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
                            {name:"venta - pagado",box:{tipe:4,options:op_sales_paid,value:[op_sales_paid[0].show]},select:{table:"sales",field:"PAID"}},
                            {name:"venta - estado",box:{tipe:4,options:op_sales_status,value:op_sales_status.filter(st=>st.value!=5).map(st=>{return st.show})},select:{table:"sales",field:"ID_STATUS"}},
                            {name:"compra - estado",box:{tipe:4,options:op_buys_status,value:op_buys_status.filter(st=>st.value!=5&&st.value!=1).map(st=>{return st.show})}},
                        ],
                        events:[
                        {
                            name:"reloadAfter",
                            actions:[{
                            action:({k})=>{
        
                                
                                var windowFilters = k.bodyGet().configGetWindowFilters();
        
                                var period = windowFilters.Filter_GetBox({filterName:"periodo"}).GetValue();
        
                                var sales = [];
                                var salesResult = k.Reload_GetData();
                                salesResult.forEach(rst => {
                                
                                var date = Date_GetLabel({dateString:rst["DATE_EMMIT"],period});
                                var total = parseFloat(parseFloat(rst["TOTAL"]).toFixed(2));
        
                                var dateFound = sales.find(s => s.date == date);
                                if(!dateFound){
        
                                    sales.push({
                                    date,
                                    total,
                                    });
                                }else dateFound.total += total;
        
                                });
        
                                k.ReloadDataSetAdd({dataSetName:"sales",result:sales});
        
                                var cnx = k.Conection_Get();
                                var fechMax = windowFilters.Filter_GetBox({filterName:"fecha max"}).GetValue();
                                var fechMin = windowFilters.Filter_GetBox({filterName:"fecha min"}).GetValue();
                                var status = windowFilters.Filter_GetBox({filterName:"compra - estado"}).GetValue();
        
                                var conditions = [
                                {
                                    table:sch_buys.table,
                                    field:"DATE_EMMIT",
                                    inter:">=",
                                    value:fechMin,
                                },
                                {
                                    before:" AND ",
                                    table:sch_buys.table,
                                    field:"DATE_EMMIT",
                                    inter:"<=",
                                    value:fechMax,
                                },
                                {
                                    before:" AND ",
                                    table:sch_buys.table,
                                    field:"ID_COMPANY",
                                    inter:"=",
                                    value:userData.company.id,
                                },
                                ];
                                
                                for (let st = 0; st < status.length; st++) {
        
                                const statu = status[st];
                                conditions.push({
                                    before:(st==0?" AND (":" OR "),
                                    table:sch_buys.table,
                                    field:"ID_BUY_STATUS",
                                    inter:"=",
                                    value:statu,
                                    after:(status.length-1==st?")":"")
                                });
                                }
                                
        
                                //load buys
                                var buySql = cnx.GetSql_Select({
                                tableMain:sch_buys.table,
                                selects:[
                                    {table:sch_buys.table,field:"DATE_EMMIT"},
                                    {table:sch_buys.table,field:"TOTAL"},
                                ],
                                conditions,
                                });
                                
                                k.bodyGet().LoadingScreenActive({active:true});
        
                                cnx.Request({
                                php:"row",name:"",
                                sql:buySql,
                                success:(result)=>{
        
                                    console.log("LOADED BUY RESULT:",result,"sql:",buySql);
        
                                    var buysResult = result;
                                    var buys = [];
                                    buysResult.forEach(rst => {
                                    
                                    var date = Date_GetLabel({dateString:rst["DATE_EMMIT"],period});
                                    var total = parseFloat(parseFloat(rst["TOTAL"]).toFixed(2));
        
                                    var dateFound = buys.find(s => s.date == date);
                                    if(!dateFound){
        
                                        buys.push({
                                        date,
                                        total,
                                        });
                                    }else dateFound.total += total;
        
                                    });
                                    
                                    k.ReloadDataSetAdd({dataSetName:"buys",result:buys});
                                    k.bodyGet().LoadingScreenActive({active:false});
                                    k.CallEvent({name:"printData"});
                                }
                                });
                            }
                            }],
                        },
                        {
                            name:"printData",
                            actions:[{
                            action:({k})=>{
        
                                //get data to transform
                                var sales = k.ReloadDataSetGet({dataSetName:"sales"});
                                var buys = k.ReloadDataSetGet({dataSetName:"buys"});
        
                                console.log("sales",sales,"buys",buys);
        
                                //transform data
                                var tableData = [
                                {
                                    name:"detail",
                                    title:"detalle",
                                    values:[...lines],
                                },
                                ];
        
                                function addData({detail,date,total}) {
                                
                                var detailIndex = tableData[0].values.findIndex(v=>v==detail);
                                if(detailIndex == -1){
        
                                    tableData[0].values.push(detail);
                                    detailIndex = tableData[0].values.length-1;
                                }
        
                                var dateIndex = tableData.findIndex(d=>d.title==date);
        
        
                                if(dateIndex == -1){
        
                                    var values = [];
                                    for (let v = 0; v < tableData[0].values.length; v++) {
        
                                    values.push(v == detailIndex ? total :0);                       
                                    }
        
                                    tableData.push({
                                    name:"period" + (tableData.length),
                                    title:date,
                                    values,
                                    });
                                }
                                else
                                {                          
                                    tableData[dateIndex].values[detailIndex] += total;
                                }
                                }
        
                                sales.result.forEach(sale => {
                                
                                addData({
                                    detail:tableData[0].values[0],
                                    date:sale.date,
                                    total:sale.total,
                                });
        
                                });
        
                                buys.result.forEach(buy => {
                                
                                addData({
                                    detail:tableData[0].values[1],
                                    date:buy.date,
                                    total:buy.total*-1,
                                });
        
                                });
        
                                //calculate utilidad
                                for (let p = 1; p < tableData.length; p++) {
                                var tbField = tableData[p];
                                var util = tbField.values[0] + tbField.values[1];
                                addData({
                                    detail:lines[2],
                                    date:tbField.title,
                                    total:util,
                                });
                                }
        
                                console.log("TRANSOFMR DATA",tableData);
                                
                                
                                //print table
                                var table = group().parentGet({parentName:"detail-tb"}).build;
                                var tableFields = table.fieldsGet();
                                for (let f = 0; f < tableFields.length; f++) {
        
                                if(f >= tableData.length){
        
                                    var field = tableFields[f];
                                    table.fieldSetTitle({fieldName:field.name,title:""});
                                    table.fieldSetValues({fieldName:field.name,values:Array(lines.length).fill(0)}); 
                                }
                                else
                                {
                                    var field = tableData[f];
                                    table.fieldSetTitle({fieldName:field.name,title:field.title});
                                    table.fieldSetValues({fieldName:field.name,values:field.values}); 
                                }
                                
                                }
        
                                //print chart
                                var chart = group().parentGet({parentName:"detail-chart"}).build;
        
                                var labesValues = [];
                                for (let tb = 1; tb < tableData.length; tb++) labesValues.push(tableData[tb].title);
                                chart.fieldSetValues({fieldName:"labels",values:labesValues});
        
                                var detailsValues = tableData[0].values;
                                for (let dt = 0; dt < detailsValues.length; dt++) {
                                
                                var detail = detailsValues[dt];
                                var values = [];
        
                                for (let lb = 1; lb < tableData.length; lb++) {
        
                                    var label = tableData[lb];
                                    var value = label.values[dt];
                                    values.push(value);
                                }
        
                                console.log("INDEX:",dt,"DETAIL:",detail,"VALUES:",values);
                                chart.fieldSetValues({fieldName:detail,values});
                                
                                //chart.fieldSetTitle({fieldName:"utilidad",title:detail});
                                }
                                
                            }
                            }]
                        }
                        ],
                        panels:[
                        {
                            title:"grafico",tipe:"form",head:false,
                            fields:[
                            {action:"div",name:"div-chart",box:{tipe:0,class:"conteiner w-100 m-0 p-0"},tipe:0},
                            ],
                        },
                        {
                            title:"detalle",tipe:"form",
                            fields:[
                            {action:"div",name:"div-detail",box:{tipe:0,class:"conteiner w-100 m-0 p-0"},tipe:0},
                            ],
                        },
                        ],
                    }
                    },
                    {
                    panel:{
                        tipe:"chart",parent:"div-chart",name:"detail-chart",
                        fields:[
                        {name:"labels",values:["month1","month2","month3",]},
                        {name:lines[0],values:[100,200,300]},
                        {name:lines[1],values:[120,100,30]},
                        {name:lines[2],values:[40,200,250]},
                        ],
                    }
                    },
                    {
                    panel:{
                        tipe:"table",parent:"div-detail",name:"detail-tb",
                        fields:[
                        {name:"detail",title:"detalle",box:{...bx_shw}},
                        {name:"period1",title:"",box:{...bx_income}},
                        {name:"period2",title:"",box:{...bx_income}},
                        {name:"period3",title:"",box:{...bx_income}},
                        {name:"period4",title:"",box:{...bx_income}},
                        {name:"period5",title:"",box:{...bx_income}},
                        {name:"period6",title:"",box:{...bx_income}},
                        {name:"period7",title:"",box:{...bx_income}},
                        {name:"period8",title:"",box:{...bx_income}},
                        {name:"period9",title:"",box:{...bx_income}},
                        {name:"period10",title:"",box:{...bx_income}},
                        {name:"period11",title:"",box:{...bx_income}},
                        {name:"period12",title:"",box:{...bx_income}},
                        ],
                    }
                    }
                ],
            }
        }
    }
}

function pageBuildConfig_produccion({}) {

return {
    type:"free",
    script:({userData,pageData,build})=>{

    return {
        layers:[
        {
            grid:{
            items:[
                {name:"prnt-prod",col:12},
                {name:"prnt-prod-md",col:12},
            ],
            },
        },
        {modal:{parent:"prnt-prod-md",name:"md-prod",size:"xl"}},
        {
            steps:{
            parent:"md-prod",
            items:[
                {name:"stp-prod",title:"produccion",head:false},
                {name:"stp-recipe",title:"receta",head:false},
            ],
            },
        },
        //-----produccion --- table
        {
            crud:{
            parent:"prnt-prod",name:"cr-produccions",head:true,
            title:"ordenes de produccion",schema:sch_produccion,
            insertToEnd:false,
            panels:[
                {
                tipe:"table",head:false,
                fieldsSet:[
                    {value:"dateEmmit",state:"show",asc:false},
                    {value:"productResult",state:"show"},
                    {value:"cantResult",state:"show"},
                    {value:"comment",state:"show"},
                ],
                }
            ],
            }
        },
        //----produccion ---- edit
        {
            crud:{
            parent:"stp-prod",name:"cr-prod-fm",modal:"md-prod",
            title:"orden de produccion",schema:sch_produccion,head:false,
            panels:[
                {
                tipe:"form",head:false,
                fieldsSet:[
                    {value:"dateEmmit",state:"edit"},
                    {
                    value:"productResult",state:"edit",
                    update:({groups,crudBuild,field})=>{
                        
                        build.groupGet().CrudJoin({
                        masterCrud:"cr-prod-fm",
                        masterFieldValue:"productResult",
                        maidCrud:"cr-recipe",
                        maidSelect:"ID_PRODUCT",
                        });

                    }
                    },
                    {value:"cantResult",state:"edit"},
                    {action:"div",name:"prnt-prod-inputs"},
                    {value:"comment",state:"edit"},
                ],
                }
            ],
            states:[
                {
                name:"reload",
                tools:[
                    {name:"tutorial",show:true},
                    {name:"title",show:true,value:"orden de produccion"},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                ],
                }
            ],
            events:[
                {
                name:"filterRecipe",
                actions:[{
                    action:({k})=>{

                    build.groupGet().CrudJoin({
                        masterCrud:"cr-prod-fm",
                        masterFieldValue:"productResult",
                        maidCrud:"cr-recipe",
                        maidSelect:"ID_PRODUCT",
                    });
                    }
                }]
                },
                {
                name:"printAfter",
                actions:[{
                    action:({k})=>{

                    k.CallEvent({name:"filterRecipe"});
                    }
                }]
                },
                {
                name:"boxUpdate",
                actions:[{
                    action:({k,field})=>{

                    if(field.name=="productResult") k.CallEvent({name:"filterRecipe"});
                    }
                }]
                },
            ],
            }
        },
        {
            crud:{
            parent:"prnt-prod-inputs",name:"cr-prod-inputs-tb",head:false,
            title:"lista de insumos",schema:sch_produccion_inputs,
            panels:[
                {
                tipe:"table",head:false,h:400,
                fieldsSet:[
                    {value:"input",state:"edit"},
                    {value:"cant",state:"edit"},
                ],
                }
            ],
            states:[
                {
                name:"reload",
                tools:[
                    {name:"insert",show:true},
                    {name:"sizes",show:false,value:999},
                ],
                }
            ],
            }
        },
        //-----recipe------
        {
            crud:{
            parent:"stp-recipe",name:"cr-recipe",head:false,
            title:"receta",schema:sch_items,stateStart:"block",
            panels:[
                {
                tipe:"form",head:false,
                fieldsSet:[
                    {value:"name",state:"show"},
                    {value:"unid",state:"show"},
                    {value:"cantRecipe",state:"show"},
                    {action:"div",name:"div-recipe-inputs"},
                ],
                }
            ],
            states:[{
                name:"reload",
                tools:[
                {name:"title",show:true,value:"receta"},
                {name:"reload",show:true}
                ]
            }],
            },
        },
        {
            crud:{
            parent:"div-recipe-inputs",name:"cr-recipe-inputs",
            title:"lista de insumos",schema:sch_recipe_inputs,head:false,
            states:[{name:"reload",tools:[{name:"sizes",value:999,show:false}]}],
            panels:[
                {
                tipe:"table",head:false,h:400,
                fieldsSet:[
                    {value:"supplie",state:"show",minWidth:0},
                    {value:"cant",state:"show"},
                ],
                }
            ],
            }
        }

        ],
        conections:[
        {
            masterName:"cr-produccions",
            masterSelect:"ID_PRODUCCION",
            event:"tableForm",
            maidName:"cr-prod-fm",
            maidSelect:"ID_PRODUCCION",
        },
        {
            masterName:"cr-prod-fm",
            masterSelect:"ID_PRODUCCION",
            event:"list",
            maidName:"cr-prod-inputs-tb",
            maidSelect:"ID_PRODUCCION",
        },
        /*{
            masterName:"cr-produccions",
            masterSelect:"ID_PRODUCT",
            event:"tableForm",type:"show",
            maidName:"cr-recipe",
            maidSelect:"ID_PRODUCT",
        },*/
        {
            masterName:"cr-recipe",
            masterSelect:"ID_PRODUCT",
            event:"list",type:"show",
            maidName:"cr-recipe-inputs",
            maidSelect:"ID_PRODUCT",
        }
        ],
    }
    }
}
}

function pageBuildConfig_payments({}) {

return {
    type:"free",
    actionsActive:true,
    actions:["see","update","insert"],
    /*record:{
    name:"tranference",
    titleOne:"transferencia",
    titleMult:"transferencias",
    },*/
    script:({userData,pageData,build})=>{

    return {
        layers:[
        {
            grid:{
            parent:pageData.body,
            items:[
                {name:"prnt-main",col:12},
                {name:"prnt-md-detail",col:12},
            ]
            }
        },
        {
            crud:{
            title:"lista de transferencias",
            parent:"prnt-main",name:"cr-pays",
            ...getCrudMult({
                userData,
                schemaMain:sch_pays,
                fields:[
                {value:"account",filter:{boxTipe:3}},
                {value:"income"},
                {value:"total"},
                {value:"tag"},
                {value:"date",filter:true},
                ],
            }),
            config:{show:true},
            orders:[{field:"DATE_EMMIT",asc:false}],
            insertToEnd:false,
            states:[{
                name:"reload",
                tools:[
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"sizes",show:true,value:10},
                {name:"reload",show:true},
                {name:"new",show:true},
                {name:"pages",show:true},
                ],
            }],
            events:[
                {
                name:"printAfter",
                actions:[{
                    action:({k})=>{

                    var tagLoad = k.Loaded_GetLoadData({loadName:"ld-pay_tag"});                      
                    var tagValues = k.bodyGet().fieldGetValues({fieldName:"tag"});

                    var fieldsBoxes = k.bodyGet().fieldsGet().map(f=>{

                        return k.bodyGet().fieldGetBoxes({fieldName:f.name});
                    });

                    for (let tg = 0; tg < tagValues.length; tg++) {

                        const tagValue = tagValues[tg];
                        var tagShow = tagLoad.result.find(rst=>rst.value==tagValue).show;
                        var tagIsDefault = pay_tags_default.find(tgf=>tgf.name==tagShow)!=null;
                        
                        fieldsBoxes.forEach(fbxs => {

                        fbxs[tg].Block({active:tagIsDefault});
                        });
                    }                     
                    }
                }]
                }
            ]
            }
        },
        {modal:{parent:"prnt-md-detail",name:"md-detail"}},
        {
            crud:{
            parent:"md-detail",title:"transaccion",name:"cr-pay",head:false,
            ...getCrudMult({
                userData,tipe:"form",
                schemaMain:sch_pays,
                fields:[
                {value:"date"},
                {value:"account",state:"edit"},
                {value:"tag",state:"edit"},
                {value:"total",state:"edit"},
                {value:"comment",state:"edit"},
                {value:"income",state:"show"},
                ],
                eventEnd:({crud})=>{

                crud.panels[0].head=false;
                console.log(crud.loads);                  
                crud.loads.find(ld=>ld.name=="ld-pay_tag").selects.push({
                    table:"pay_tag",
                    field:"INCOME",
                    as:"income",
                });
                return crud;
                }
            }),
            afterInsert:"block",
            states:[
                {
                name:"reload",
                tools:[
                    {name:"title",show:true,value:"transaccion"},
                    {name:"tutorial",show:true},
                    {name:"load",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                ],
                },
                {
                name:"new",
                tools:[
                    {name:"title",show:true,value:"transaccion"},
                    {name:"tutorial",show:true},
                    {name:"load",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                ],
                },
            ],
            events:[
                {
                name:"boxUpdate",
                actions:[{
                    action:({field,k})=>{

                    if(field.name=="tag"){

                        var tagValue = k.bodyGet().fieldGetValues({fieldName:field.name})[0];
                        var ld_tag =  k.Loaded_GetLoadData({loadName:"ld-pay_tag"});
                        var tagData = ld_tag.result.find(rst=>rst.value==tagValue);
                        k.bodyGet().fieldSetValues({fieldName:"income",values:[tagData.income]});
                        k.Update_AddChangeField({fieldName:"income",value:tagValue,y:0});

                    }
                    }
                }]
                },
                {
                name:"insertBefore",
                actions:[{
                    action:({k,inserts=[]})=>{

                    inserts.push({
                        field:"INCOME",
                        value:k.bodyGet().fieldGetValues({fieldName:"income"})[0],
                    });

                    return {inserts};
                    }
                }]
                },
                {
                name:"insertAftert",
                actions:[{action:(k)=>{k.SetState({stateName:"block"});}}]
                },
            ]
            }
        },
        ],
        conections:[
        {
            event:"cnx",masterAction:"new",
            masterName:"cr-pays",
            masterSelect:"ID_PAY",
            maidName:"cr-pay",
            maidSelect:"ID_PAY",
        },
        {
            event:"cnx",masterAction:"edit",
            masterName:"cr-pays",
            masterSelect:"ID_PAY",
            maidName:"cr-pay",
            maidSelect:"ID_PAY",
        },
        ],
    }
    }
}
}

function pageBuildConfig_vehicles({}) {

return {
    type:"free",
    actionsActive:true,
    actions:["see","update","insert"],
    record:{
    name:"vehicle",
    titleOne:"vehiculo",
    titleMult:"vehiculos",
    },
    script:({userData,pageData,build})=>{

    return {
        layers:[
        {
            grid:{
            parent:pageData.body,
            items:[
                {name:"prnt-main",col:12},
                {name:"prnt-md-detail",col:12},
            ]
            }
        },
        {
            crud:{
            parent:"prnt-main",title:"lista de vehiculos",
            name:"cr-vehicles",
            ...getCrudMult({
                schemaMain:sch_vehicles,
                userData,tipe:"table",
                fields:[
                {value:"customer",fields:["name"]},
                {value:"placa"},
                {value:"marca"},
                {value:"modelo"},
                {value:"anio"},
                {value:"color"},
                ],
            }),
            states:[
                {
                name:"reload",
                tools:[
                    {name:"config",show:true},
                    {name:"tutorial",show:true},
                    {name:"sizes",show:true,value:10},
                    {name:"reload",show:true},
                    {name:"new",show:true},
                    {name:"pages",show:true},
                ],
                }
            ],
            }
        },
        {modal:{parent:"prnt-md-detail",name:"md-detail"}},
        {
            crud:{
            parent:"md-detail",title:"lista de vehiculos",
            name:"cr-vehicle",head:false,
            ...getCrudMult({
                schemaMain:sch_vehicles,
                userData,tipe:"form",
                fields:[
                {value:"customer",state:"edit"},
                {value:"placa",state:"edit"},
                {value:"marca",state:"edit"},
                {value:"modelo",state:"edit"},
                {value:"anio",state:"edit"},
                {value:"color",state:"edit"},
                ],
                eventEnd:({crud})=>{

                crud.panels[0].head=false;
                return crud;
                }
            }),
            afterUpdate:"block",afterInsert:"block",
            states:[
                {
                name:"reload",
                tools:[
                    {name:"title",show:true,value:"vehiculo"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                ],
                },
                {
                name:"new",
                tools:[
                    {name:"title",show:true,value:"vehiculo"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                ],
                },
            ],
            }
        },
        ],
        conections:[
        {
            event:"cnx",masterAction:"edit",
            masterName:"cr-vehicles",
            masterSelect:"ID_VEHICLE",
            maidName:"cr-vehicle",
            maidSelect:"ID_VEHICLE",
        },
        {
            event:"cnx",masterAction:"new",
            masterName:"cr-vehicles",
            masterSelect:"ID_VEHICLE",
            maidName:"cr-vehicle",
            maidSelect:"ID_VEHICLE",
        }
        ],
    }
    }
}
}

function pageBuildConfig_ordenWork({}) {

var front = null;

return {
    type:"free",
    actionsActive:true,
    actions:["see","update","insert"],
    record:{
    name:"checkin-vehicle",
    titleOne:"orden de trabajo",
    titleMult:"orden de trabajos",
    },
    script:({userData,pageData,build})=>{

    return {
        layers:[
        {
            grid:{
            parent:pageData.body,
            items:[
                {name:"prnt-main",col:12},
                {name:"prnt-md-detail",col:12},
                {name:"prnt-md-cus",col:12},
                {name:"prnt-md-sol",col:12},
                {name:"prnt-md-vehi",col:12},
            ]
            }
        },
        {modal:{parent:"prnt-md-detail",name:"md-detail",size:"xl"}},          
        {modal:{parent:"prnt-md-cus",name:"md-cus"}},         
        {modal:{parent:"prnt-md-sol",name:"md-sol"}},
        {modal:{parent:"prnt-md-vehi",name:"md-vehi"}},
        {
            crud:{
            parent:"prnt-main",title:"ordenes de trabajo",
            name:"cr-orders",config:{show:true},
            ...getCrudMult({
                schemaMain:sch_checkin_vehicles,
                userData,tipe:"table",
                fields:[
                {value:"customer",fields:["name","cel"]},
                {value:"vehicle",fields:["placa","marca","modelo"]},
                ],
            }),
            states:[
                {
                name:"reload",
                tools:[
                    {name:"config",show:true},
                    {name:"tutorial",show:true},
                    {name:"sizes",show:true,value:10},
                    {name:"reload",show:true},
                    {name:"new",show:true},
                    {name:"pages",show:true},
                ],
                }
            ],
            }
        },
        {
            crud:{
            parent:"md-detail",name:"cr-order",head:false,
            ...getCrudMult({
                schemaMain:sch_checkin_vehicles,tipe:"form",
                userData,
                fields:[
                {value:"customer",state:"edit",panel:"recep"},
                {value:"receptor-customer",state:"edit",panel:"recep"},
                {value:"receptor-user",state:"edit",panel:"recep"},

                {value:"vehicle",state:"edit",panel:"info",load:{
                    name:"ld-vehicle",
                    tableMain:sch_vehicles.table,
                    selects:[
                    {table:sch_vehicles.table,field:sch_vehicles.fieldPrimary,as:"value"},
                    {sql:"CONCAT(items_vehicles.PLACA,' ',items_vehicles.MARCA) AS 'show'"},
                    {table:sch_customers.table,field:sch_customers.fieldPrimary,as:"customer-id"},
                    ],
                    joins:[
                    {
                        main:{table:sch_vehicles.table,field:"ID_CUSTOMER"},
                        join:{table:sch_customers.table,field:sch_customers.fieldPrimary},
                        tipe:"LEFT",
                    }
                    ],
                }},
                {value:"date_enter",state:"edit",panel:"info",col:6},
                {value:"date-out",state:"edit",panel:"info",col:6},
                {value:"fuel",state:"edit",panel:"info"},
                {value:"milage",state:"edit",panel:"info"},
                {value:"milage-prox",state:"edit",panel:"info"},
                {value:"comment",state:"edit",panel:"info"},

                {value:"check_1",state:"edit",panel:"check"},
                {value:"check_2",state:"edit",panel:"check"},
                {value:"check_3",state:"edit",panel:"check"},
                {value:"check_4",state:"edit",panel:"check"},
                {value:"check_5",state:"edit",panel:"check"},
                {value:"check_6",state:"edit",panel:"check"},
                {value:"check_7",state:"edit",panel:"check"},
                {value:"check_8",state:"edit",panel:"check"},
                {value:"check_9",state:"edit",panel:"check"},
                {value:"check_10",state:"edit",panel:"check"},
                {value:"check_11",state:"edit",panel:"check"},
                {value:"check_12",state:"edit",panel:"check"},
                {value:"check_13",state:"edit",panel:"check"},
                {value:"check_14",state:"edit",panel:"check"},
                {value:"check_15",state:"edit",panel:"check"},
                {value:"check_16",state:"edit",panel:"check"},
                {value:"check_17",state:"edit",panel:"check"},
                {value:"check_18",state:"edit",panel:"check"},
                {value:"check_19",state:"edit",panel:"check"},
                {value:"check_20",state:"edit",panel:"check"},
                {value:"check_21",state:"edit",panel:"check"},
                {value:"check_22",state:"edit",panel:"check"},
                {value:"check_23",state:"edit",panel:"check"},
                {value:"check_24",state:"edit",panel:"check"},
                {value:"check_25",state:"edit",panel:"check"},
                {value:"check_26",state:"edit",panel:"check"},

                {name:"front",type:"div",panel:"vehi"},
                {value:"observations",state:"edit",panel:"vehi"},
                ],
                eventEnd:({crud})=>{

                crud.selects.push({
                    table:sch_checkin_vehicles.table,
                    field:"IMG_FRONT",
                });
                crud.panels[0].title = "Datos del Cliente";
                crud.panels[0].head = true;
                var fields = crud.panels[0].fields;
                crud.panels[0].fields = fields.filter(f=>f.panel=="recep"),

                crud.panels.push({
                    tipe:"form",title:"Datos del Vehiculo",
                    fields:fields.filter(f=>f.panel=="info"),
                });
                crud.panels.push({
                    tipe:"form",title:"Inventario de Recepcion",col:4,
                    fields:fields.filter(f=>f.panel=="check"),
                });
                crud.panels.push({
                    tipe:"form",title:"Chasis",col:8,
                    fields:fields.filter(f=>f.panel=="vehi"),
                });

                sch_vehicles.fields.forEach(fveh => {
                    
                    crud.selects.push({
                    table:sch_vehicles.table,
                    field:fveh.select,
                    as:sch_vehicles.table+"-"+fveh.select,
                    });
                });
                

                return crud;
                }
            }),
            joins:[{
                main:{table:sch_checkin_vehicles.table,field:"ID_VEHICLE"},
                join:{table:sch_vehicles.table,field:"ID_VEHICLE"},
                tipe:"LEFT",
            }],
            afterUpdate:"block",
            afterInsert:"block",
            states:[
                {
                name:"reload",
                tools:[
                    {name:"title",show:true,value:"orden de trabajo"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                    {name:"pdf",show:true},
                ],
                },
                {
                name:"new",
                tools:[
                    {name:"title",show:true,value:"orden de trabajo"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                ],
                },
            ],
            events:[
                {
                name:"setStateAfter",
                actions:[{
                    action:({k,stateName})=>{

                    if(stateName == "new"){

                        var box = k.bodyGet().fieldGetBoxes({fieldName:"front"})[0];
                        var content = box.Blocks_Get()[0];
                        content.innerHTML = "";
                        front = new EditableImage({
                        parent:content,
                        imageUrl:"../imagenes/vehiculo_4ruedas.png",
                        });

                    }

                    }
                }]
                },
                {
                name:"insertBefore",
                actions:[{
                    action:({k,inserts})=>{

                    inserts.push({
                        field:"IMG_FRONT",
                        value:front.ImageGet(),
                        tipe:"values",
                    });

                    return {inserts};
                    }
                }]
                },
                {
                name:"printAfter",
                actions:[{
                    action:({k,result})=>{

                    var box = k.bodyGet().fieldGetBoxes({fieldName:"front"})[0];
                    var content = box.Blocks_Get()[0];                      
                    content.innerHTML = "";
                    var img = result[0]["IMG_FRONT"];
                    //console.log("load imgage:",img);

                    front = new EditableImage({
                        parent:content,
                        imageUrl:"../imagenes/vehiculo_4ruedas.png",
                    });

                    if(img!=null) front.loadImage(img);
                    }
                }],
                },
                {
                name:"updateBefore",
                actions:[{
                    action:({k,conditions=[],sets=[]})=>{

                    if(conditions.length==0){

                        conditions.push({
                        table:"checkin_vehicles",
                        field:"ID_CHECKIN_VEHICLE",
                        inter:"=",
                        value:k.Reload_GetData_Primarys({})[0],
                        });
                    }

                    if(front){

                        sets.push({
                        field:"IMG_FRONT",
                        value:front.ImageGet(),
                        });
                    }

                    return {conditions, sets};
                    }
                }],
                },
                {
                name:"boxUpdate",
                actions:[{
                    action:({field,k})=>{

                    if(field.name=="vehicle"){

                        var vehiResult = k.Loaded_GetLoadData({loadName:"ld-vehicle"}).result;
                        var vehiValue = k.bodyGet().fieldGetValues({fieldName:"vehicle"})[0];
                        
                        var vehiCustomerID = null;
                        var vehiInfo = vehiResult.find(rst=>rst.value==vehiValue);
                        if(vehiInfo !=null) vehiCustomerID = vehiInfo["customer-id"];
                        k.bodyGet().fieldSetValues({fieldName:"customer",values:[vehiCustomerID]});                       

                    }

                    if(field.name=="customer"){

                        var vehiResult = k.Loaded_GetLoadData({loadName:"ld-vehicle"}).result;
                        var customerId = k.bodyGet().fieldGetValues({fieldName:"customer"})[0];
                        var vehixCustomer = vehiResult.filter(rst=>rst["customer-id"]==customerId);
                        
                        var options = vehixCustomer.length > 0 ? vehixCustomer.map(rst=>{return {value:rst.value,show:rst.show}}):[{value:"null",show:"no hay vehiculos asignados a este cliente"}];
                        
                        k.bodyGet().fieldSetOptions({fieldName:"vehicle",options});
                    }

                    }
                }]
                },
                {
                name:"toolUpdate",
                actions:[{
                    action:({tool,k})=>{

                    if(tool.name=="pdf"){

                        var cr_checkin = k.group.crudGetBuild({crudName:"cr-order"});
                        var data = cr_checkin.Reload_GetData({})[0];
                        console.log("ORDER DATA",data);
                        

                        var checkInData = {
                        logo:userData.company.logo,
                        checkInNumber: data["ID_CHECKIN_VEHICLE"],
                        checkInDate: data["checkin_vehicles-DATE_ENTER"],
                        checkOutDate: data["checkin_vehicles-DATE_OUT"],
                        customerName: data["checkin_vehicles-CUSTOMER_NAME"],
                        customerId:(data["CUSTOMER_COMPANY"]=="1"?"RUC":"DNI") + " " + data["CUSTOMER_NRO"],
                        customerPhone: data["CUSTOMER_CEL"],
                        customerAddress: data["CUSTOMER_DIR"],
                        companyName: userData.company.nameReal,
                        companyRUC: userData.company.ruc,
                        companyAddress: userData.company.email,
                        companyPhone: userData.company.telf,
                        receptor:{
                            name:data["WORKER_NAME"],
                            cel:data["WORKER_CEL"],
                        },
                        vehicle: {
                            fuel: data["checkin_vehicles-FUEL"],
                            mileage: data["checkin_vehicles-MILEAGE"],
                            mileage_prox: data["checkin_vehicles-MILEAGE_PROX"],
                            plate: data["items_vehicles-PLACA"],
                            brand: data["items_vehicles-MARCA"],
                            model: data["items_vehicles-MODELO"],
                            engineNumber: data["items_vehicles-NRO_MOTO"],
                            vinNumber: data["items_vehicles-NRO_VIN"],
                            year: data["items_vehicles-ANIO"],
                            color: data["items_vehicles-COLOR"],
                        },
                        comments: data["checkin_vehicles-COMENT"],
                        observations: data["checkin_vehicles-OBSERVATIONS"],
                        items: [
                            { detail: 'Oil level', check: true, comment: 'Good condition' },
                            { detail: 'Brake fluid', check: false, comment: 'Needs replacement' },
                            { detail: 'Tire pressure', check: true, comment: 'Checked' },
                            // More items...
                        ],
                        imageUrl: front.ImageGet() // Ruta de la imagen
                        };

                        checkInData.items = [];
                        for (let num = 1; num <= 26; num++) {
                        //console.log("num",num);
                        checkInData.items.push({
                            detail:cr_checkin.bodyGet().fieldGet({fieldName:"check_"+num}).title,
                            check:data["checkin_vehicles-CHECK_"+num]=="1",
                        });
                        
                        }
                        
                        generateCheckInPDF(checkInData);
                    }
                    
                    //SavePdf();
                    }
                }]
                }
            ],
            }
        },
        {
            crud:{
            parent:"md-cus",name:"cr-cus",head:false,
            ...getCrudMult({
                schemaMain:sch_customers,userData,tipe:"form",filters:false,
                fields:sch_customers.fields.filter(f=>f.value!="dateInsert").map(f=>{return {value:f.value,state:"edit"}}),
                eventEnd:({crud})=>{crud.panels[0].head=false; return crud;}
            }),
            afterInsert:"block",
            afterUpdate:"block",
            states:[
                {
                name:"reload",
                tools:[
                    {name:"title",show:true,value:"cliente"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                ],
                },
                {
                name:"new",
                tools:[
                    {name:"title",show:true,value:"cliente"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                ],
                },
            ],
            }
        },
        {
            crud:{
            parent:"md-sol",name:"cr-sol",head:false,
            ...getCrudMult({
                schemaMain:sch_customers,userData,tipe:"form",filters:false,
                fields:sch_customers.fields.filter(f=>f.value!="dateInsert").map(f=>{return {value:f.value,state:"edit"}}),
                eventEnd:({crud})=>{crud.panels[0].head=false; return crud;}
            }),
            afterInsert:"block",
            afterUpdate:"block",
            states:[
                {
                name:"reload",
                tools:[
                    {name:"title",show:true,value:"solicitante"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                ],
                },
                {
                name:"new",
                tools:[
                    {name:"title",show:true,value:"solicitante"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                ],
                },
            ],
            }
        },
        {
            crud:{
            parent:"md-vehi",name:"cr-vehi",head:false,
            ...getCrudMult({
                tipe:"form",schemaMain:sch_vehicles,filters:false,userData,
                fields:sch_vehicles.fields.map(f=>{return {value:f.value,state:"edit"}}),
            }),
            afterInsert:"block",
            afterUpdate:"block",
            states:[
                {
                name:"reload",
                tools:[
                    {name:"title",show:true,value:"vehiculo"},
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                ],
                },
                {
                name:"new",
                tools:[
                    {name:"title",show:true,value:"vehiculo"},
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                ],
                },
            ],
            events:[{
                name:"setStateAfter",
                actions:[{
                action:({stateName,k})=>{

                    if(stateName=="new"){

                    var customer_id = build.groupGet().crudGetBuild({crudName:"cr-order"}).bodyGet().fieldGetValues({fieldName:"customer"})[0];
                    if(customer_id) k.bodyGet().fieldSetValues({fieldName:"customer",values:[customer_id]});
                    }
                }
                }]
            }],
            }
        }
        ],
        conections:[
        {
            event:"cnx",masterAction:"edit",
            masterName:"cr-orders",
            masterSelect:"ID_CHECKIN_VEHICLE",
            maidName:"cr-order",
            maidSelect:"ID_CHECKIN_VEHICLE",
        },
        {
            event:"cnx",masterAction:"new",
            masterName:"cr-orders",
            masterSelect:"ID_CHECKIN_VEHICLE",
            maidName:"cr-order",
            maidSelect:"ID_CHECKIN_VEHICLE",
        },
        {
            event:"formForm",masterFieldName:"customer",
            masterName:"cr-order",
            masterSelect:"ID_CUSTOMER",
            maidName:"cr-cus",
            maidSelect:"ID_CUSTOMER",
        },
        {
            event:"formForm",masterFieldName:"receptor-customer",
            masterName:"cr-order",
            masterSelect:"ID_CUSTOMER_RECEPTOR",
            maidName:"cr-sol",
            maidSelect:"ID_CUSTOMER",
        },
        {
            event:"formForm",masterFieldName:"vehicle",
            masterName:"cr-order",
            masterSelect:"ID_VEHICLE",
            maidName:"cr-vehi",
            maidSelect:"ID_VEHICLE",
        },
        ],
    }
    }
}
}
  