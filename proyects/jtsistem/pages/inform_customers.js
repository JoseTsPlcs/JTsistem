

$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var group = new CrudsGroup({
        userData,pageData,
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
                      var tb_lst = group.parentGet({parentName:"tb-list"}).build;
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

                      var chr_evol = group.parentGet({parentName:"chr-evol"}).build;
                      
                      chr_evol.titleSet({title:"Evolutivo de compras del cliente: " + customerName});
                      chr_evol.fieldSetValues({fieldName:"labels",values:datacustomer.dates.map(dt=>{return dt.label})});
                      chr_evol.fieldSetValues({fieldName:"total",values:datacustomer.dates.map(dt=>{return dt.total})});

                      var kpi_tot = group.parentGet({parentName:"kpi-tot"}).build;
                      kpi_tot.fieldSetValues({fieldName:"tot",values:[datacustomer.total]});

                      var kpi_prom = group.parentGet({parentName:"kpi-prom"}).build;
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

                        var cr_main = group.parentGet({parentName:"cr-customers"}).build;
                        
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
      });

      PlayTutorialInPage({pageData,group});
    }
  });


});
