
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({cols:[[12],[12],[12]]});
      var stps = new Steps({
        parent:gr.GetColData({x:0,y:2}).col,
        steps:[
          {
            name:"productos/servicios",
            window:{
              //title:"productos",
              grid:{cols:[[12]]},
            }
          },     
          {
            name:"insumos",
            window:{
              //title:"insumos",
              grid:{cols:[[12]]},
            }
          },
          {
            name:"pagos",
            window:{
              //title:"pagos",
              grid:{cols:[[12],[12]]},
            }
          },
        ],
      });
      var md = new Modal({parent:stps.GetStep({stepIndex:2}).window.Conteiner_GetColData({x:0,y:1}).col});
      var md2 = new Modal({parent:gr.GetColData({x:0,y:0}).col});
      stps.SetStepIndex({stepIndex:0});

      var conections = new ConsCruds({

        test:false,
        cruds:[
          {
            name:"sale",
            active:true,
            script:{
              parent:gr.GetColData({x:0,y:1}).col,
              title:"venta",
              panels:[
                {col:6,y:0,tipe:"form",title:"principal",h:350},
                {col:6,y:0,tipe:"form",title:"cliente",h:350},
              ],
              stateStart:"new",
              //stateBase:"new",
              stateTools:stTls_fm_master,

              tableMain:"sales",
              selects:[
                {table:'sales', field:'ID_SALE',primary:true},
                {table:'sales', field:'DATE_EMMIT'},
                {table:'sales', field:'ID_STATUS'},
                {table:'sales', field:'PAID'},
                {table:'sales',field:'ID_DOCUMENT'},
                {table:'sales', field:'ID_CUSTOMER'},
                {table:'sales', field:'TOTAL'},
                {table:'sales', field:'COMMENT'},
              ],
              conditions:[
                {
                  before:"",
                  table:"sales",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:userData.company.id,
                }
              ],
              inserts:[
                {
                  field:"ID_COMPANY",
                  value:userData.company.id,
                }
              ],
              loads:[
                {
                  name:"customers",
                  tableMain:"customers",
                  selects:[
                    {table:'customers', field:'ID_CUSTOMER',as:"value"},
                    {table:'customers', field:'NAME',as:"show"},
                    //{table:'customers', field:'ID_CUSTOMER_TIPE'},
                    {table:'customers', field:'COMPANY'},
                    {table:'customers', field:'NRO_DOCUMENT'},
                  ],
                  conditions:[
                    {
                      table:"customers",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
                }
              ],

              fields:[
                //{panel:"principal",col:12,y:0,name:"id",box:bx_shw,select:"ID_SALE"},
                {panel:"principal",col:12,y:1,name:"fecha de emision",box:bx_date,select:"DATE_EMMIT"},
                {panel:"principal",col:12,y:2,name:"estado",box:bx_op({ops:op_sales_status}),select:"ID_STATUS"},
                {panel:"principal",col:12,y:2,name:"cancelado",box:{...bx_op({ops:op_sales_paid}),value:0},select:"PAID"},
                {panel:"principal",col:12,y:3,name:"venta documento",box:bx_op({ops:op_sales_document}),select:"ID_DOCUMENT"},

                {panel:"principal",col:12,y:4,name:"total",box:bx_moneyh1,select:"TOTAL"},
                //{panel:"principal",col:12,y:5,name:"servicios",box:bx_money},
                {panel:"principal",col:12,y:6,name:"productos",box:bx_money},
                {panel:"principal",col:12,y:7,name:"pagado",box:bx_money},
                {panel:"principal",col:12,y:8,name:"comentario",box:{tipe:9,value:""},select:"COMMENT"},
                //{panel:"principal",col:12,y:8,name:"pdf",tipe:2,box:{tipe:5,value:"pdf",class:"btn btn-danger text-white btn-sm",style:"min-weigth:100px"},action:"pdf"},

                {panel:"cliente",col:12,y:0,name:"cliente",box:{tipe:8},select:"ID_CUSTOMER",load:{name:"customers",show:"show"}},
                {panel:"cliente",col:6,...fld_edit},
                {panel:"cliente",col:6,name:"add",box:{tip:5,value:"+",class:"btn btn-primary btn-sm"},action:"add"},
                {panel:"cliente",col:12,y:1,name:"tipo",box:{tipe:0}},
                {panel:"cliente",col:12,y:2,name:"empresa",box:{tipe:0,options:[{value:0,show:"natural"},{value:1,show:"empresa"}]}},
                {panel:"cliente",col:12,y:3,name:"cliente documento",box:{tipe:0,options:op_identity_document_tipe}},
                {panel:"cliente",col:12,y:4,name:"nro de documento",box:{tipe:0}},
              ],

              events:[
                {
                  name:"calculateTotalSale",
                  actions:[{
                    action:({k})=>{

                      var total = 0;
                      //var tservicios = parseFloat(k.GetValues({fieldName:"servicios"})[0]);
                      var tproductos = parseFloat(k.GetValues({fieldName:"productos"})[0]);
                      total = tproductos;

                      //console.log("sale -> total:",total);
                      k.SetValuesToBox({values:[total],fieldName:"total"});
                      var primary = k.Reload_GetData({})[0]["ID_SALE"];
                      k.Update_AddChange({fieldName:"total",value:total,primary});
                    }
                  }],
                },
                {
                  name:"customerUpdate",
                  actions:[{
                    action:({k})=>{

                      //return;
                      //console.log("sales_new -> get value of cliente");
                      var customer_id = k.GetValue({fieldName:"cliente",y:0});
                      //console.log("sales_new -> result customer_id:",customer_id);

                      
                      var customers_data = k.Loaded_GetLoadData({loadName:"customers"}).result;
                      var customer_line = customers_data.find(ln=>ln["value"]==customer_id);
                      //console.log(customer_id,customer_line);

                      if(customer_line){

                        k.SetValuesToBox({fieldName:"tipo",values:[0]});
                        k.SetValuesToBox({fieldName:"empresa",values:[customer_line["COMPANY"]]});
                        k.SetValuesToBox({fieldName:"cliente documento",values:[customer_line["COMPANY"]]});
                        k.SetValuesToBox({fieldName:"nro de documento",values:[customer_line["NRO_DOCUMENT"]]});
                      }

                    }
                  }],
                },
                {
                  name:"PdfDownland",
                  actions:[{
                    action:({k})=>{

                      

                    }
                  }],
                },
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({k,field})=>{

                      if(field.name=="cliente"){

                        k.CallEvent({name:"customerUpdate"});
                      }

                      if(field.name=="pdf"){

                        k.CallEvent({name:"PdfDownland"});
                      }
                    }
                  }],
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{

                      k.CallEvent({name:"customerUpdate"});
                    }
                  }],
                },
                {
                  name:"newAfter",
                  actions:[{
                    action:({k})=>{

                      k.CallEvent({name:"customerUpdate"});
                    }
                  }],
                },
                {
                  name:"loadsReseted",
                  actions:[{
                      action:({k})=>{

                        k.CallEvent({name:"customerUpdate"});
                      }
                  }]
                },
              ],
            }
          },
          {
            name:"customer",
            active:true,
            script:{
              parent:md2.GetContent(),
              title:"cliente",
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateStart:"block",
              stateBase:"block",
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
                {panel:"main",col:4,name:"empresa",box:{tipe:6,name:"empresa",value:0},select:"COMPANY"},
                {panel:"main",col:6,name:"documento",box:{tipe:0,options:op_identity_document_tipe},select:"COMPANY"},
                {panel:"main",col:6,name:"nro documento",box:bx_input,select:"NRO_DOCUMENT"},
              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                      action:({k,active})=>{

                        md2.SetActive({active});
                        //if(!active) conections.Crud_GetBuild({name:"sale"}).CallEvent({name:"customerUpdate"});
                      }
                  }]
                },
              ],
            }
          },
          {
            name:"products",
            active:true,
            script:{
              parent:stps.GetStep({stepIndex:0}).window.Conteiner_GetColData({x:0,y:0}).col,
              title:"lista de productos/servicios",
              panels:[{col:12,y:0,title:"main",tipe:"table",h:600}],
              stateTools:stTls_tb_maid,
              stateStart:"block",

              tableMain:"sales_products",
              selects:[
                {table:'sales_products', field:'ID',primary:true},
                {table:'sales_products', field:'ID_SALE'},
                {table:'sales_products', field:'ID_PRODUCT'},
                {table:'sales_products', field:'CANT'},
                {table:'sales_products', field:'PRICE_UNIT'},
                {table:'sales_products', field:'PRICE_TOTAL'},
                {table:"unids",field:"SIMBOL"},
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
                }
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
              ],

              fields:[
                {panel:"main",...fld_delete,attributes:att_btn},
                //{panel:"main",name:"id sale producto",box:bx_shw,select:"ID"},
                //{panel:"main",name:"id sale",box:bx_shw,select:"ID_SALE"},
                {panel:"main",name:"producto-servicio",box:{tipe:8,class:"w-100"},attributes:att_ln,select:"ID_PRODUCT",load:{name:"products-services",show:"show"}},
                {panel:"main",name:"unidad",box:bx_shw,select:"SIMBOL"},
                {panel:"main",name:"cantidad",box:bx_cant,attributes:att_cnt,select:"CANT"},
                {panel:"main",name:"precio unitario",box:bx_money,attributes:att_shw,select:"PRICE_UNIT"},
                {panel:"main",name:"precio total",box:bx_money,attributes:att_shw,select:"PRICE_TOTAL"},
              ],
              events:[
                {
                  name:"calculateTotalProducts",
                  actions:[{
                    action:({k})=>{

                      var total = 0;
                      var data = k.GetValues({fieldName:"precio total"});
                      if(data.length>0){

                        total += data.reduce((acum,v)=>{return acum + parseFloat(v)},0); 
                      }

                      var cr_sale = conections.Crud_GetBuild({name:"sale"});
                      cr_sale.SetValuesToBox({values:[total],fieldName:"productos"});
                      cr_sale.CallEvent({name:"calculateTotalSale"});
                    }
                  }],
                },
                {
                  name:"calculateLineTotal",
                  actions:[{
                    action:({k,y})=>{

                      var primary = k.Reload_GetData_Primarys()[y];

                      var productsLoad = k.Loaded_GetLoadData({loadName:"products-services"});
                      var productsData = productsLoad.result;
                      
                      //console.log(productsLoad,productData);

                      var productid = k.GetValue({fieldName:"producto-servicio",y});
                      var cantValue = parseFloat(k.GetValue({fieldName:"cantidad",y}));

                      //console.log("caculateLineTotal->","productid:",productid,",cantvalue:",cantValue);
                      
                      var priceUnit = 0;
                      var priceTotal = 0;
                      var productData = productsData.find(p=>p.value==productid);
                      if(productData){

                        priceUnit = parseFloat(productData["PRICE_UNIT"]);
                        priceTotal =  priceUnit * cantValue;
                      }
                      
                      
                      //console.log("line :"+y," product:",productid," cant:",cantValue," price:",priceUnit," total:",priceTotal);

                      return {priceUnit, priceTotal,primary};
                    }
                  }]
                },
                {
                  name:"LineTotal",
                  actions:[{
                    action:({k,y})=>{

                      var primary = k.Reload_GetData_Primarys()[y];

                      var productsLoad = k.Loaded_GetLoadData({loadName:"products-services"});
                      var productsData = productsLoad.result;
                      
                      console.log(productsLoad,productData);

                      var productid = k.GetValue({fieldName:"producto-servicio",y});
                      var cantValue = parseFloat(k.GetValue({fieldName:"cantidad",y}));


                      var productData = productsData.find(p=>p.value==productid);
                      var priceUnit = parseFloat(productData["PRICE_UNIT"]);
                      var priceTotal =  priceUnit * cantValue;
                      
                      console.log("line :"+y," product:",productid," cant:",cantValue," price:",priceUnit," total:",priceTotal);

                      return {priceUnit, priceTotal,primary};
                    }
                  }]
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{

                      
                      k.CallEvent({name:"calculateTotalProducts"});
                    }
                  }],
                },
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({field,y,k})=>{

                      if(field.name=="cantidad"||field.name=="producto-servicio"){

                        //var cal = k.CallEvent({name:"calculateLineTotal",params:{y}});
                        //console.log("boxupdate field:",field.name,",cal:",cal);
                        //k.Update_AddChange({fieldName:"precio unitario",value:cal.priceUnit,primary:cal.primary});
                        //k.Update_AddChange({fieldName:"precio total",value:cal.priceTotal,primary:cal.primary});
                      }
                    }
                  }],
                },
                {
                  name:"insertBefore",
                  actions:[{
                    action:({k,inserts=[]})=>{

                      var cal = k.CallEvent({name:"calculateLineTotal",params:{y:0}});
                      inserts.push({
                        field:"PRICE_UNIT",
                        value:cal.priceUnit
                      });
                      inserts.push({
                        field:"PRICE_TOTAL",
                        value:cal.priceTotal
                      });
                      //console.log("new_sale->insert before",cal,inserts);

                      return {inserts};
                    }
                  }],
                },
                {
                  name:"updateBefore",
                  actions:[{
                    action:({k})=>{


                    }
                  }]
                }
              ],
            }
          },
          {
            name:"supplies",
            active:true,
            script:{
              parent:stps.GetStep({stepIndex:1}).window.Conteiner_GetColData({x:0,y:0}).col,
              title:"lista de insumos",
              panels:[{col:12,y:0,title:"main",tipe:"table",h:600}],
              stateTools:stTls_tb_maid,
              stateStart:"block",

              tableMain:"sales_supplies",
              selects:[
                {table:'sales_supplies', field:'ID_SALE_SUPPLIE',primary:true},
                {table:'sales_supplies', field:'ID_SALE'},
                {table:'sales_supplies', field:'ID_SUPPLIE'},
                {table:'sales_supplies', field:'CANT'},
              ],
              loads:[     
                {
                  name:"supplies",
                  tableMain:"products",
                  selects:[
                      {table:'products', field:'ID_PRODUCT',as:"value"},
                      {table:'products', field:'NAME',as:"show"},
                      {table:'products',field:"PRICE_UNIT"},
                      {table:'products',field:"STOCK_TOTAL"},
                  ],
                  conditions:[
                    {
                      table:"products",
                      field:"ACTIVE",
                      inter:"=",
                      value:1,
                    },
                    {
                      before:" AND ",
                      table:"products",
                      field:"ID_PRODUCT_TIPE",
                      inter:"=",
                      value:2,
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
              ],

              fields:[
                {panel:"main",...fld_delete,attributes:att_btn},
                {panel:"main",name:"insumo",attributes:att_ln,box:{tipe:8,class:"w-100"},select:"ID_SUPPLIE",load:{name:"supplies",show:"show"}},
                {panel:"main",name:"cantidad",attributes:att_cnt,box:bx_cant,select:"CANT"},
              ],
            }
          },
          {
            name:"pays",
            active:true,
            script:{
              ...scr_fm_pays({
                parent:stps.GetStep({stepIndex:2}).window.Conteiner_GetColData({x:0,y:0}).col,
                stateTools:stTls_tb_maid,

                tableName:"sales_payments",
                priFieldName:"ID_SALE_PAY",
                joinFieldName:"ID_SALE",
                events:[
                  {
                    name:"calculateTotalPagos",
                    actions:[{
                      action:({k})=>{
      
                        var total = 0;
                        var data = k.GetValues({fieldName:"total"});
                        if(data.length>0){
      
                          total += data.reduce((acum,v)=>{return acum + parseFloat(v)},0); 
                        }
                        conections.Crud_GetBuild({name:"sale"}).SetValuesToBox({values:[total],fieldName:"pagado"});
                      }
                    }],
                  },
                  {
                    name:"printAfter",
                    actions:[{
                      action:({k})=>{
      
                        k.CallEvent({name:"calculateTotalPagos"});
                      }
                    }],
                  }
                ],
              }),
              stateTools:stTls_tb_maid,
              stateStart:"block",
              
            }
          },
          {
            name:"pay",
            active:true,
            script:{
              parent:md.GetContent(),
              //parent:stps.GetStep({stepIndex:3}).window.Conteiner_GetColData({x:0,y:1}).col,
              ...scr_pay({
                tagValue:1,
                events:[
                  {
                    name:"modalSetActive",
                    actions:[{
                      action:({active})=>{
      
                        md.SetActive({active});
                        //console.log("pay showmeee!",active);
                      }
                    }]
                  },
                ],
              }),
            },
          },
        ],

        conections:[
          {
            tipe:"fm-tb",
            master:"sale",
            masterField:"ID_SALE",
            maid:"products",
            maidField:"ID_SALE",
          },
          {
            tipe:"fm-tb",
            master:"sale",
            masterField:"ID_SALE",
            maid:"pays",
            maidField:"ID_SALE",
          },
          {
            tipe:"fm-tb",
            master:"sale",
            masterField:"ID_SALE",
            maid:"supplies",
            maidField:"ID_SALE",
          },
          {
            tipe:"tb-fm",
            master:"pays",
            masterField:"ID_PAY",
            maid:"pay",
            maidField:"ID_PAY",
          },
          {
            tipe:"fm-fm",
            master:"sale",
            masterField:"cliente",
            maid:"customer",
            maidField:"ID_CUSTOMER",
          },
        ],

        searchs:[
          {
            crudName:"sale",
            valueName:"id_sale",
            fieldName:"ID_SALE"
          }
        ],

      });

    }
  });

  
  

  

});
