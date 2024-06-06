
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var acc_products_update = userData.access.find(acc=>acc.value=="acc-2") && userData.access.find(acc=>acc.value=="acc-2").active == "true";
      var acc_price_update = userData.access.find(acc=>acc.value=="acc-3") && userData.access.find(acc=>acc.value=="acc-2").active == "true";

      //-------------

      var test_search = false;
      var test_item = false;

      var gr = new Grid({
        cols:[
          [12],//modal customer
          [6,6],//venta
          [12],//steps
          [12],//modal item
        ],
        attributes:[
          {x:0,y:1,attributes:[{name:"class",value:"col-12 col-md-4 pb-4"}/*,{name:"style",value:"background-color: lightcoral;"}*/]},
          {x:1,y:1,attributes:[{name:"class",value:"col-12 col-md-8"}/*,{name:"style",value:"background-color: lightblue; min-height: 600px; flex: 1;"}*/]},
        ],
      });

      var prnt_customer = gr.GetColData({x:0,y:0}).col;
      var prnt_sale = gr.GetColData({x:0,y:1}).col;
      var prnt_stps = gr.GetColData({x:1,y:1}).col;
      var prnt_modal_item =  gr.GetColData({x:0,y:3}).col;

      var stps = new Steps({
        parent:prnt_stps,
        steps:[
          {
            name:'<i class="bi bi-card-checklist"></i> items',
            window:{
              //head:false,
              grid:{
                cols:[
                  [12],//0-buttoon
                  [12],//1-form
                  [12],//2 md-product
                  [12],//3 md-unids
                  [12],//4 md-tags
                ],
                boxs:[
                  {x:0,y:0,box:{tipe:5,value:'añadir producto',class:"btn btn-outline-primary btn-sm",update:()=>{
                    //console.log("aladainsndaskd");
                    var cr_item = conections.Crud_GetBuild({name:"fm-product"});
                    cr_item.SetState({stateName:"new"});
                  }}},
                ],
              },
            }
          },     
          {
            name:'<i class="bi bi-box"></i> insumos',
            window:{
              //head:false,
              grid:{cols:[[12]]},
            }
          },
          {
            name:'<i class="bi bi-currency-dollar"></i> pagos',
            window:{
              //head:false,
              grid:{cols:[[12],[12]]},
            }
          },
          /*{
            name:"checkin",
            window:{
              grid:{cols:[[12],[12]]},
              boxs:[],
            }
          },*/
          /*{
            name:"item",
            window:{
              grid:{cols:[[12],[12]]},
              boxs:[],
            }
          }*/
        ],
      });

      var bx_product_update = stps.GetStep({stepIndex:0}).window.Conteiner_GetColData({x:0,y:0}).boxs[0];
      if(!acc_products_update) bx_product_update.Hide();

      var stp_items = stps.GetStep({stepIndex:0});
      var stp_vehi = stps.GetStep({stepIndex:3});
      //var stp_item = stps.GetStep({stepIndex:4});

      var md = new Modal({parent:stps.GetStep({stepIndex:2}).window.Conteiner_GetColData({x:0,y:1}).col});
      var md2 = new Modal({parent:prnt_customer});
      var md3 = new Modal({parent:stp_items.window.Conteiner_GetColData({x:0,y:2}).col});
      var md4 = new Modal({parent:stp_items.window.Conteiner_GetColData({x:0,y:3}).col});
      var md5 = new Modal({parent:stp_items.window.Conteiner_GetColData({x:0,y:4}).col});
      var md_item = new Modal({parent:prnt_modal_item});

      var prnt_items_fm = md3.GetContent();
      //var prnt_checkin = stp_vehi.window.Conteiner_GetColData({x:0,y:0}).col;
      var prnt_item = md_item.GetContent();

      stps.SetStepIndex({stepIndex:0});

      var front = null;

      var conections = new ConsCruds({

        test:false,
        cruds:[
          {
            name:"sale",
            active:true,
            script:{
              parent:prnt_sale,
              title:(userData.company.tipe == 2 ? "Venta" : "Venta"),
              //h:"100%",
              panels:[
                {col:12,tipe:"form",title:"principal",tag:"Informacion",h:0,show:true,blocked:false},
                {col:12,tipe:"form",title:"cliente",tag:"Datos del Cliente",h:0,show:true,blocked:false},
              ],
              //breaklevel:"sm",
              stateStart:"block",
              afterUpdate:"block",
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
                },
                {
                  name:"block",
                  tools:[
                      {name:"config",show:false},
                      {name:"load",show:false},
                      
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
              ],

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
                {table:'sales', field:'ID_CHECKIN'},
                {table:'sales', field:'ID_ITEM'},
                {table:'sales', field:'ID_WORK_PROCESS'},
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
                    {table:'customers', field:'PHONE'},
                    {table:'customers', field:'DIRECCION'},
                    {table:'customers', field:'EMAIL'},
                    {table:'customers', field:'DESCRIPCION'},
                  ],
                  conditions:[
                    {
                      table:"customers",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
                },
                {
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
                },
                (userData.company.tipe=="2"?{
                  name:"ld-items",
                  tableMain:"items_vehicles",
                  selects:[
                    {table:"items_vehicles",field:"ID_VEHICLE",as:"value"},
                    {sql:"CONCAT(items_vehicles.PLACA,'-',items_vehicles.MARCA) AS 'show'"},
                    {table:"items_vehicles",field:"PLACA"},
                    {table:"items_vehicles",field:"MARCA"},
                    {table:"items_vehicles",field:"MODELO"},
                    {table:"items_vehicles",field:"NRO_MOTO"},
                    {table:"items_vehicles",field:"NRO_VIN"},                
                    {table:"items_vehicles",field:"ANIO"},
                    {table:"items_vehicles",field:"COLOR"},
                  ],
                  conditions:[
                    {
                      table:"items_vehicles",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
                }:null),
              ],

              fields:[
                //{panel:"principal",col:12,y:0,name:"id",box:bx_shw,select:"ID_SALE"},
                {panel:"principal",col:12,y:1,name:"fecha de emision",box:bx_date,select:"DATE_EMMIT"},
                {panel:"principal",col:12,y:2,tipe:1,name:"estado",box:bx_op({ops:op_sales_status}),select:"ID_STATUS"},
                {panel:"principal",col:12,y:2,tipe:1,name:"cancelado",box:{...bx_op({ops:op_sales_paid}),value:0},select:"PAID"},
                {panel:"principal",col:12,y:3,tipe:1,name:"documento de venta",box:bx_op({ops:op_sales_document}),select:"ID_DOCUMENT"},

                {panel:"principal",col:12,y:4,name:"total",box:bx_moneyh1,select:"TOTAL"},
                //{panel:"principal",col:12,y:5,name:"servicios",box:bx_money},
                {panel:"principal",col:12,y:6,name:"productos",box:bx_money},
                {panel:"principal",col:12,y:7,name:"pagado",box:bx_money},
                {panel:"principal",col:12,y:8,name:"comentario*",box:{tipe:9,value:""},select:"COMMENT"},
                {panel:"principal",col:12,colAllLevel:true,y:0,name:"trabajador asignado",box:{tipe:8},select:"ID_WORK_PROCESS",load:{name:"ld-workers",show:"show"}},
                //{panel:"principal",col:12,y:8,name:"pdf",tipe:2,box:{tipe:5,value:"pdf",class:"btn btn-danger text-white btn-sm",style:"min-weigth:100px"},action:"pdf"},

                {panel:"cliente",col:8,colAllLevel:true,y:0,name:"cliente",box:{tipe:8},select:"ID_CUSTOMER",load:{name:"customers",show:"show"}},
                {panel:"cliente",col:2,colAllLevel:true,...fld_edit},
                {panel:"cliente",col:2,colAllLevel:true,...fld_add},
                //{panel:"cliente",col:12,y:1,name:"tipo",box:{tipe:0}},
                {panel:"cliente",col:12,y:2,name:"empresa",box:{tipe:0,options:[{value:0,show:"natural"},{value:1,show:"empresa"}]}},
                {panel:"cliente",col:12,y:3,name:"cliente documento",box:{tipe:0,options:op_identity_document_tipe}},
                {panel:"cliente",col:12,y:4,name:"nro de documento",box:{tipe:0}},
                {panel:"cliente",col:12,y:4,name:"telefono",box:{tipe:0}},
                {panel:"cliente",col:12,y:4,name:"direccion",box:{tipe:0}},
                {panel:"cliente",col:12,y:4,name:"correo",box:{tipe:0}},
                {panel:"cliente",col:12,y:4,name:"comentario",box:{tipe:0}},

                //{panel:"principal",col:10,colAllLevel:true,y:0,name:"checkin",box:{tipe:0},select:"ID_CHECKIN"},
                //{panel:"principal",col:2,colAllLevel:true,name:"edit",box:{tipe:5,value:'<i class="bi bi-pencil-square"></i>',class:"btn btn-primary btn-sm"},action:"edit-checkin"},
                //{panel:"principal",col:2,colAllLevel:true,name:"add",box:{tipe:5,value:'<i class="bi bi-plus-circle"></i>',class:"btn btn-primary btn-sm"},action:"add-checkin"},

                (userData.company.tipe == "2"?{panel:"principal",col:8,colAllLevel:true,y:0,name:"vehiculo",box:{tipe:8,class:"w-100"},select:"ID_ITEM",load:{name:"ld-items",value:"value",show:"show"}}:null),
                (userData.company.tipe == "2"?{panel:"principal",col:2,colAllLevel:true,name:"edit",box:{tipe:5,value:'<i class="bi bi-pencil-square"></i>',class:"btn btn-primary btn-sm"},action:"edit-item"}:null),
                (userData.company.tipe == "2"?{panel:"principal",col:2,colAllLevel:true,name:"add",box:{tipe:5,value:'<i class="bi bi-plus-circle"></i>',class:"btn btn-primary btn-sm"},action:"add-item"}:null),

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
                  name:"filterPagado",
                  actions:[{
                    action:({k})=>{

                      var total = k.GetValue({fieldName:"total",y:0});
                      var pagado = k.GetValue({fieldName:"pagado",y:0});

                      var cancelado_lasValue = k.GetValue({fieldName:"cancelado",y:0});
                      var cancelado_value = total > 0 && total == pagado ? 1 : 0;
                      
                      k.SetValue({fieldName:"cancelado",y:0,value:cancelado_value});
                      if(cancelado_lasValue!= cancelado_value){

                        k.Update_AddChange({
                          fieldName:"cancelado",
                          value:cancelado_value,
                          primary:k.Reload_GetData_Primarys({})[0],
                        });
                      }
                    }
                  }]
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

                        //k.SetValuesToBox({fieldName:"tipo",values:[0]});
                        //k.SetValuesToBox({fieldName:"empresa",values:[customer_line["COMPANY"]]});
                        k.SetValuesToBox({fieldName:"cliente documento",values:[customer_line["COMPANY"]]});
                        k.SetValuesToBox({fieldName:"nro de documento",values:[customer_line["NRO_DOCUMENT"]]});
                        k.SetValuesToBox({fieldName:"telefono",values:[customer_line["PHONE"]]});
                        k.SetValuesToBox({fieldName:"direccion",values:[customer_line["DIRECCION"]]});
                        k.SetValuesToBox({fieldName:"correo",values:[customer_line["EMAIL"]]});
                        k.SetValuesToBox({fieldName:"comentario",values:[customer_line["DESCRIPCION"]]});
                      }

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

                        //console.log("cliente id set",  k.GetValue({fieldName:"cliente",y:0}));

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

                        md2.SetActive({active});
                        //if(!active) conections.Crud_GetBuild({name:"sale"}).CallEvent({name:"customerUpdate"});
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
          },
          {
            name:"products",
            active:true,
            script:{
              parent:stps.GetStep({stepIndex:0}).window.Conteiner_GetColData({x:0,y:1}).col,
              title:"lista de productos/servicios",head:false,
              panels:[{col:12,y:0,title:"main",tipe:"table",h:580}],
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
              //afterUpdate:"block",
              newLinesStart:1,

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
              ],

              fields:[
                {panel:"main",...fld_delete,attributes:att_btn},
                (acc_products_update?{panel:"main",...fld_edit,attributes:att_btn}:null),
                {panel:"main",name:"producto-servicio",box:{tipe:8,class:"w-100"},attributes:att_ln,select:"ID_PRODUCT",load:{name:"products-services",show:"show"}},
                {panel:"main",name:"unidad",box:bx_shw,attributes:att_shw,select:"SIMBOL"},
                {panel:"main",name:"cantidad",box:bx_cant,attributes:att_cnt,select:"CANT"},
                {panel:"main",name:"precio unitario",box:(acc_price_update?{tipe:1,value:0}:bx_money),attributes:att_shw,select:"PRICE_UNIT"},
                {panel:"main",name:"precio total",box:(acc_price_update?{tipe:1,value:0}:bx_money),attributes:att_shw,select:"PRICE_TOTAL"},
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

                        var stock = parseFloat(productData["STOCK_TOTAL"]);
                        var tipe = parseInt(productData["ID_PRODUCT_TIPE"]);
                        if(tipe != 1 && cantValue >= stock) alert("solo quedan " + stock + " unidades ");
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

                      if(field.action == "edit"){

                        var product_id = k.Reload_GetData()[y]["ID_PRODUCT"];
                        var cr_item = conections.Crud_GetBuild({name:"fm-product"});
                        cr_item.CrudJoins_Set({name:"",field:"ID_PRODUCT",value:product_id});
                        cr_item.SetState({stateName:"reload"});

                      }

                      if((field.name == "producto-servicio" || field.name == "cantidad") && k.StateGet()=="new"){

                        var cal = k.CallEvent({name:"calculateLineTotal",params:{y}});
                        k.GetBoxs({fieldName:"precio unitario"})[y].SetValue(cal.priceUnit);
                        k.GetBoxs({fieldName:"precio total"})[y].SetValue(cal.priceTotal);
                      }

                      if(acc_price_update  && k.StateGet()=="new"  && (field.name=="precio unitario" || field.name == "precio total")){

                        if(field.name=="precio unitario"){

                          var tot =  k.GetValue({fieldName:"precio unitario",y}) * k.GetValue({fieldName:"cantidad",y});
                          k.SetValue({fieldName:"precio total",value:tot,y}); 
                        }

                        if(field.name=="precio total"){

                          var tot =  k.GetValue({fieldName:"precio total",y}) / k.GetValue({fieldName:"cantidad",y});
                          k.SetValue({fieldName:"precio unitario",value:tot,y}); 
                        }
                      }
                    }
                  }],
                },
                {
                  name:"insertBefore",
                  actions:[{
                    action:({k,inserts=[]})=>{

                      if(!acc_price_update){

                        var priceUnit = k.GetValues({fieldName:"precio unitario"});
                        var priceTotal = k.GetValues({fieldName:"precio total"});

                        //console.log(priceUnit,priceTotal);

                        for (let ln = 0; ln < priceUnit.length; ln++) {

                          var unit = priceUnit[ln];
                          var tot = priceTotal[ln];
                          
                          inserts.push({
                            field:"PRICE_UNIT",
                            value:unit
                          });

                          inserts.push({
                            field:"PRICE_TOTAL",
                            value:tot
                          });
                        }
                      }

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
              title:"lista de insumos",head:false,
              panels:[{col:12,y:0,title:"main",tipe:"table",h:600}],
              stateTools:stTls_tb_maid,
              stateStart:"block",
              //newLinesStart:10,

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
                      before:" AND ( ",
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
                head:false,
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
                        var cr_main = conections.Crud_GetBuild({name:"sale"});
                        cr_main.SetValuesToBox({values:[total],fieldName:"pagado"});
                        cr_main.CallEvent({name:"filterPagado"});
                        
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
          {
            name:"fm-product",
            active:true,
            script:{
              parent:prnt_items_fm,
              title:"producto",
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateTools:[
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
              ],
              stateStart:"block",
              afterUpdate:"block",
              afterInsert:"block",
              afterCancel:"block",
          
              tableMain:"products",
              selects:[
                {table:'products', field:'ID_PRODUCT',primary:true},
                {table:'products', field:'NAME'},
                {table:'products', field:'ID_PRODUCT_TIPE'},
                {table:'products', field:'ID_PRODUCT_TAG'},
                {table:'products', field:'UNID_ID'},
                {table:'products', field:'ACTIVE'},
                {table:'products', field:'COST_UNIT'},
                {table:'products', field:'PRICE_UNIT'},
                {table:'products', field:'STOCK_TOTAL'},
                {table:'products', field:'STOCK_LIMIT'},
              ],
              loads:[
                ld_unids,
                ld_products_tags,
              ],
              /*conditions:[
                {
                  table:"products",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],*/
              inserts:ins_general,
              
              fields:[
                {panel:"main",col:9,tipe:1,name:"producto",box:bx_input,select:"NAME"},
                {panel:"main",col:3,tipe:0,name:"activo",box:bx_active_input,select:"ACTIVE"},
                
                {panel:"main",col:12,tipe:1,name:"tipo",box:bx_op({ops:op_products_tipe}),select:"ID_PRODUCT_TIPE"},

                {panel:"main",col:8,tipe:1,colAllLevel:true,name:"etiqueta",box:bx_op({ops:op_products_tipe}),select:"ID_PRODUCT_TAG",load:{name:"ld-products_tags",show:"show"}},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"edit-tag",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-pencil-square"></i>'},action:"edit-tag"},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"add-tag",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-plus-circle"></i>'},action:"add-tag"},

                {panel:"main",col:8,tipe:1,colAllLevel:true,name:"unidad",box:bx_op({ops:[]}),select:"UNID_ID",load:{name:"ld-unids",show:"show"}},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"edit-und",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-pencil-square"></i>'},action:"edit-und"},
                {panel:"main",col:2,tipe:0,colAllLevel:true,name:"add-und",box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-plus-circle"></i>'},action:"add-und"},

                {panel:"main",col:6,tipe:1,name:"costo unitario",box:{tipe:1,value:0},select:"COST_UNIT"},
                {panel:"main",col:6,tipe:1,name:"precio unitario",box:{tipe:1,value:0},select:"PRICE_UNIT"},

                {panel:"main",col:6,tipe:1,name:"stock total",box:{tipe:1,value:0},select:"STOCK_TOTAL"},
                {panel:"main",col:6,tipe:1,name:"stock minimo",box:{tipe:1,value:0},select:"STOCK_LIMIT"},
              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md3.SetActive({active});
                    }
                  }]
                },
                {
                  name:"newAfter",
                  actions:[{
                    action:({k})=>{

                      k.CallEvent({name:"modalSetActive",params:{active:true}});
                    }
                  }]
                },
                {
                  name:"blockAfter",
                  actions:[{
                    action:({k})=>{

                      k.CallEvent({name:"modalSetActive",params:{active:false}});
                    }
                  }]
                },
                {
                  name:"reloadBefore",
                  actions:[{
                    action:({k})=>{

                      k.CallEvent({name:"modalSetActive",params:{active:true}});
                    }
                  }]
                },
                {
                  name:"updateAfter",
                  actions:[{
                    action:({k})=>{

                      conections.Crud_GetBuild({name:"products"}).Load_Reset({});
                      //conections.Crud_GetBuild({name:"products"}).Load_Reset({});
                    }
                  }]
                }
              ],
            }
          },
          {
            name:"fm-tags",
            active:true,
            script:{
              parent:md4.GetContent(),
              title:"lista de etiquetas",
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateTools:[
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
              ],
              stateStart:"block",
              afterUpdate:"block",
              afterInsert:"block",
              afterCancel:"block",              
    
              tableMain:"products_tags",
              selects:[
                {table:'products_tags', field:'ID_PRODUCT_TAG',primary:true},
                {table:'products_tags', field:'NAME'},
              ],
              /*conditions:[{
                //before:" AND ",
                table:"products_tags",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],*/
              inserts:[{
                field:"ID_COMPANY",
                value:userData.company.id,
              }],
    
              fields:[
                //{panel:"main",...fld_delete},
                {panel:"main",col:12,name:"etiqueta",box:bx_input,select:"NAME"},
              ],
              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md4.SetActive({active});
                    }
                  }]
                }
              ],
            }
          },
          {
            name:"fm-und",
            active:true,
            script:{

              title:"lista de unidades",blocked:false,
              parent:md5.GetContent(),
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateTools:[
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
              ],
              stateStart:"block",
              afterUpdate:"block",
              afterInsert:"block",
              afterCancel:"block",              
    
              tableMain:"unids",
              selects:[
                {table:'unids', field:'ID_UNID',primary:true},
                {table:'unids', field:'NAME'},
                {table:'unids', field:'SIMBOL'},
              ],
              /*conditions:[{
                //before:" AND ",
                table:"unids",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],*/
              inserts:[{
                field:"ID_COMPANY",
                value:userData.company.id,
              }],
    
              fields:[
                //{panel:"main",...fld_delete},
                {panel:"main",name:"unidad",box:bx_input,select:"NAME"},
                {panel:"main",name:"simbolo",box:bx_input,select:"SIMBOL"},
              ],
              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md5.SetActive({active});
                    }
                  }]
                },
              ],
            }
          },
          {
            name:"checkin",
            active:false,
            script:{
              //parent:prnt_checkin,
              title:"checkin de vehiculo",head:false,
              panels:[
                {col:12,y:0,title:"vehiculo",tipe:"form",blocked:false},
                {col:4,y:1,title:"checklist",tipe:"form",blocked:false},
                {col:8,y:1,title:"chasis",tipe:"form",blocked:false},
              ],
              stateStart:"block",
              afterUpdate:"block",
              afterCancel:"block",
              afterInsert:"block",
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
                      {name:"new",show:true},
                      {name:"insert",show:false},
                      {name:"cancel",show:false},
                      
                      {name:"pages",show:true},
                  ],
                }
              ],
              
              tableMain:"checkin_vehicles",
              selects:[
                {table: "checkin_vehicles", field: "ID_CHECKIN_VEHICLE", primary: true},
                {table: "checkin_vehicles", field: "ID_COMPANY"},
                {table: "checkin_vehicles", field: "ID_SALE"},
                {table: "checkin_vehicles", field: "ID_ITEM_VEHICLE"},
                {table: "checkin_vehicles", field: "DATE_ENTER"},
                {table: "checkin_vehicles", field: "FUEL"},
                {table: "checkin_vehicles", field: "MILEAGE"},
                {table: "checkin_vehicles", field: "COMENT"},
                //{table: "checkin_vehicles", field: "OBSERVATIONS"},
                {table: "checkin_vehicles", field: "CHECK_1"},
                {table: "checkin_vehicles", field: "CHECK_2"},
                {table: "checkin_vehicles", field: "CHECK_3"},
                {table: "checkin_vehicles", field: "CHECK_4"},
                {table: "checkin_vehicles", field: "CHECK_5"},
                {table: "checkin_vehicles", field: "CHECK_6"},
                {table: "checkin_vehicles", field: "CHECK_7"},
                {table: "checkin_vehicles", field: "CHECK_8"},
                {table: "checkin_vehicles", field: "CHECK_9"},
                {table: "checkin_vehicles", field: "CHECK_10"},
                {table: "checkin_vehicles", field: "CHECK_11"},
                {table: "checkin_vehicles", field: "CHECK_12"},
                {table: "checkin_vehicles", field: "CHECK_13"},
                {table: "checkin_vehicles", field: "CHECK_14"},
                {table: "checkin_vehicles", field: "CHECK_15"},
                {table: "checkin_vehicles", field: "CHECK_16"},
                {table: "checkin_vehicles", field: "CHECK_17"},
                {table: "checkin_vehicles", field: "CHECK_18"},
                {table: "checkin_vehicles", field: "CHECK_19"},
                {table: "checkin_vehicles", field: "CHECK_20"},
                {table: "checkin_vehicles", field: "CHECK_21"},
                {table: "checkin_vehicles", field: "CHECK_22"},
                {table: "checkin_vehicles", field: "CHECK_23"},
                {table: "checkin_vehicles", field: "CHECK_24"},
                {table: "checkin_vehicles", field: "CHECK_25"},
                {table: "checkin_vehicles", field: "CHECK_26"},
                
                {table: "checkin_vehicles", field: "IMG_FRONT"},
              ],
              loads:[
                {
                  name:"ld-items",
                  tableMain:"items_vehicles",
                  selects:[
                    {table:"items_vehicles",field:"ID_VEHICLE",as:"value"},
                    {sql:"CONCAT(items_vehicles.PLACA,'-',items_vehicles.MARCA) AS 'show'"},
                    {table:"items_vehicles",field:"PLACA"},
                    {table:"items_vehicles",field:"MARCA"},
                    {table:"items_vehicles",field:"MODELO"},
                    {table:"items_vehicles",field:"NRO_MOTO"},
                    {table:"items_vehicles",field:"NRO_VIN"},                
                    {table:"items_vehicles",field:"ANIO"},
                    {table:"items_vehicles",field:"COLOR"},
                  ],
                  conditions:[
                    {
                      table:"items_vehicles",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
                },
              ],

              fields:[
                {panel:"vehiculo",name:"vehiculo",box:{tipe:3},select:"ID_ITEM_VEHICLE",load:{name:"ld-items",value:"value",show:"show"}},
                //{panel:"vehiculo",col:2,colAllLevel:true,...fld_edit},{panel:"vehiculo",col:2,colAllLevel:true,...fld_add},
                {panel:"vehiculo",col:6,name:"fecha de entrada",box:bx_date,select:"DATE_ENTER"},
                {panel:"vehiculo",col:6,name:"combustible",box:{tipe:1,value:0,attributes:[{name:"type",value:"range"},{name:"min",value:0},{name:"max",value:100}]},select:"FUEL"},
                {panel:"vehiculo",col:6,name:"kilometraje",box:{tipe:1,value:0},select:"MILEAGE"},
                {panel:"vehiculo",col:6,name:"comentario",box:{tipe:9,value:""},select:"COMENT"},

                
                {panel:"checklist",name:"check in 01",tipe:0,box:{tipe:6,value:0,name:"radio"},select:"CHECK_1"},
                {panel:"checklist",name:"check in 02",tipe:0,box:{tipe:6,value:0,name:"tapa aceite motor"},select:"CHECK_2"},
                {panel:"checklist",name:"check in 03",tipe:0,box:{tipe:6,value:0,name:"antena de radio"},select:"CHECK_3"},
                {panel:"checklist",name:"check in 04",tipe:0,box:{tipe:6,value:0,name:"brazo de plumilla"},select:"CHECK_4"},
                {panel:"checklist",name:"check in 05",tipe:0,box:{tipe:6,value:0,name:"cabezales de asiento"},select:"CHECK_5"},
                {panel:"checklist",name:"check in 06",tipe:0,box:{tipe:6,value:0,name:"cenicero"},select:"CHECK_6"},
                {panel:"checklist",name:"check in 07",tipe:0,box:{tipe:6,value:0,name:"cinturon de seguridad"},select:"CHECK_7"},
                {panel:"checklist",name:"check in 08",tipe:0,box:{tipe:6,value:0,name:"claxon"},select:"CHECK_8"},
                {panel:"checklist",name:"check in 09",tipe:0,box:{tipe:6,value:0,name:"alarma y control"},select:"CHECK_9"},
                {panel:"checklist",name:"check in 10",tipe:0,box:{tipe:6,value:0,name:"emblemas"},select:"CHECK_10"},
                {panel:"checklist",name:"check in 11",tipe:0,box:{tipe:6,value:0,name:"encendedor"},select:"CHECK_11"},
                {panel:"checklist",name:"check in 12",tipe:0,box:{tipe:6,value:0,name:"escarpines"},select:"CHECK_12"},
                {panel:"checklist",name:"check in 13",tipe:0,box:{tipe:6,value:0,name:"espejos externos"},select:"CHECK_13"},
                {panel:"checklist",name:"check in 14",tipe:0,box:{tipe:6,value:0,name:"espejo initerior"},select:"CHECK_14"},
                {panel:"checklist",name:"check in 15",tipe:0,box:{tipe:6,value:0,name:"gata y palanca"},select:"CHECK_15"},
                {panel:"checklist",name:"check in 16",tipe:0,box:{tipe:6,value:0,name:"juego de herramientas"},select:"CHECK_16"},
                {panel:"checklist",name:"check in 17",tipe:0,box:{tipe:6,value:0,name:"llantas de repuesto"},select:"CHECK_17"},
                {panel:"checklist",name:"check in 18",tipe:0,box:{tipe:6,value:0,name:"llave de ruedas"},select:"CHECK_18"},
                {panel:"checklist",name:"check in 19",tipe:0,box:{tipe:6,value:0,name:"llave de seguro vasos"},select:"CHECK_19"},
                {panel:"checklist",name:"check in 20",tipe:0,box:{tipe:6,value:0,name:"llave de seguro rueda"},select:"CHECK_20"},
                {panel:"checklist",name:"check in 21",tipe:0,box:{tipe:6,value:0,name:"llavero"},select:"CHECK_21"},
                {panel:"checklist",name:"check in 22",tipe:0,box:{tipe:6,value:0,name:"luz de salon"},select:"CHECK_22"},
                {panel:"checklist",name:"check in 23",tipe:0,box:{tipe:6,value:0,name:"manija de puertas"},select:"CHECK_23"},
                {panel:"checklist",name:"check in 24",tipe:0,box:{tipe:6,value:0,name:"parlantes"},select:"CHECK_24"},
                {panel:"checklist",name:"check in 25",tipe:0,box:{tipe:6,value:0,name:"pisos de jebe"},select:"CHECK_25"},
                {panel:"checklist",name:"check in 26",tipe:0,box:{tipe:6,value:0,name:"plimillas/otros"},select:"CHECK_26"},

                {panel:"chasis",name:"front",tipe:2,box:{tipe:0},action:"img"},
                //{panel:"chasis",name:"comentario",tipe:2,box:{tipe:9,value:""},select:"COMENT"},
                //type="file" class="form-control-file" id="imageInput" value="../images/mi_imagen.jpg"
                
              ],

              events:[
                {
                  name:"setStateAfter",
                  actions:[{
                    action:({k,stateName})=>{

                      console.log("set satet",stateName);

                      if(stateName == "new"){

                        var box = k.GetBoxs({fieldName:"front"})[0];
                        var content = box.Blocks_Get()[0];

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

                      var box = k.GetBoxs({fieldName:"front"})[0];
                      var content = box.Blocks_Get()[0];
                      var img = result[0]["IMG_FRONT"];
                      //console.log("load imgage:",img);

                      front = new EditableImage({
                        parent:content,
                        imageUrl:"../imagenes/vehiculo_4ruedas.png",
                      });

                      if(img!=null) front.loadImage(img);
                    }
                  }]
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
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      stps.SetStepIndex({stepIndex:3});
                    }
                  }]
                }
              ],
            }
          },
          {
            name:"item",
            active:userData.company.tipe == "2",
            script:{
              parent:prnt_item,
              title:"Vehiculo",
              panels:[{col:12,y:0,title:"main",head:false,tipe:"form"}],
              stateStart:"block",
              afterCancel:"block",
              stateTools:[
                {
                  name:"reload",
                  tools:[
                      {name:"config",show:false},
                      {name:"load",show:false},
                      
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
              }
              ],

              tableMain:"items_vehicles",
              selects:[
                {table:"items_vehicles",field:"ID_VEHICLE",primary:true},
                {table:"items_vehicles",field:"PLACA"},
                {table:"items_vehicles",field:"MARCA"},
                {table:"items_vehicles",field:"MODELO"},
                {table:"items_vehicles",field:"NRO_MOTO"},
                {table:"items_vehicles",field:"NRO_VIN"},                
                {table:"items_vehicles",field:"ANIO"},
                {table:"items_vehicles",field:"COLOR"},
              ],
              inserts:[
                ...ins_general,
              ],

              fields:[
                {panel:"main",name:"placa",box:{tipe:1,value:""},select:"PLACA"},
                {panel:"main",name:"marca",box:{tipe:1,value:""},select:"MARCA"},
                {panel:"main",name:"modelo",box:{tipe:1,value:""},select:"MODELO"},
                {panel:"main",name:"nro de motor",box:{tipe:1,value:""},select:"NRO_MOTO"},
                {panel:"main",name:"nro de vin",box:{tipe:1,value:""},select:"NRO_VIN"},
                {panel:"main",name:"año",box:{tipe:1,value:""},select:"ANIO"},
                {panel:"main",name:"color",box:{tipe:1,value:""},select:"COLOR"},
              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md_item.SetActive({active});
                    }
                  }]
                }
              ],
            }
          }
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
            masterActionEdit:"edit",
            masterActionAdd:"add",
            masterField:"cliente",
            maid:"customer",
            maidField:"ID_CUSTOMER",
          },
          {
            tipe:"fm-fm",
            master:"fm-product",
            masterActionEdit:"edit-tag",
            masterActionAdd:"add-tag",
            masterField:"etiqueta",
            maid:"fm-tags",
            maidField:"ID_PRODUCT_TAG",
          },
          {
            tipe:"fm-fm",
            master:"fm-product",
            masterActionEdit:"edit-und",
            masterActionAdd:"add-und",
            masterField:"unidad",
            maid:"fm-und",
            maidField:"ID_UNID",
          },
          {
            tipe:"fm-fm",
            master:"sale",
            masterActionEdit:"edit-checkin",
            masterActionAdd:"add-checkin",
            masterField:"checkin",
            maid:"checkin",
            maidField:"ID_CHECKIN_VEHICLE",
          },
          {
            tipe:"fm-fm",
            master:"sale",
            masterActionEdit:"edit-item",
            masterActionAdd:"add-item",
            masterField:"vehiculo",
            maid:"item",
            maidField:"ID_VEHICLE",
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
