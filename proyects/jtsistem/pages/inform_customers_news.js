

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

              tableMain:sch_customers.table,
              selects:[
                  {table:sch_customers.table,field:sch_customers.fieldPrimary,primary:true},
                  {table:sch_customers.table,field:"DATE_INSERT"},
              ],
              conditions:[
                {
                  table:sch_customers.table,
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                },
              ],
 
              filters:[
                  {name:"period",title:"periodo",box:{tipe:3,options:op_date_ranges,value:op_date_ranges[2].value}},
                  {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"customers",field:"DATE_INSERT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
                  {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"customers",field:"DATE_INSERT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
              ],

              events:[
                {
                  name:"printBefore",
                  actions:[{
                    action:({k,result})=>{

                      console.log("RESULT DATA",result);

                      var customers = [];

                      result.forEach(rst => {

                        var period = k.bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"period"}).GetValue();
                        var date = Date_GetLabel({dateString:rst["DATE_INSERT"],current:true,period});
                        var customerFound = customers.find(cst=>cst.date == date);
                        if(!customerFound){

                          customers.push({
                            date,
                            count:1,
                          });
                        }
                        else
                        {

                          customerFound.count += 1;
                        }

                      });

                      console.log("TRANSOFRMED DATA",customers);
                      
                      //k.ReloadDataSetAdd({dataSetName:"customers",result:customers});

                      var chr_evol = group.parentGet({parentName:"chr-evol"}).build;
                      chr_evol.fieldSetValues({fieldName:"labels",values:customers.map(cst=>{return cst.date})});
                      chr_evol.fieldSetValues({fieldName:"total",values:customers.map(cst=>{return cst.count})});
                      
                      var total = customers.reduce((acc,v)=>{return acc + v.count},0);
                      var kpi_tot = group.parentGet({parentName:"kpi-tot"}).build;
                      kpi_tot.fieldSetValues({fieldName:"tot",values:[total]});

                      var prom = total /customers.length;
                      var kpi_prom = group.parentGet({parentName:"kpi-prom"}).build;
                      kpi_prom.fieldSetValues({fieldName:"prom",values:[prom]});
                      
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
                {name:"prnt-cust",col:12},
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
          {panel:{name:"kpi-tot",parent:"prnt-tot",tipe:"kpi",fields:[{name:"tot",title:"clientes nuevos",box:{...bx_shw,value:0}}]}},
          {panel:{name:"kpi-prom",parent:"prnt-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio de clientes nuevos",box:{...bx_shw,value:0}}]}},
          {
            panel:{
              name:"chr-evol",
              parent:"prnt-chr",
              tipe:"chart",
              fields:[
                {name:"labels",title:"meses",values:["mes1","mes2","mes3","mes4","mes5"]},
                {name:"total",title:"clientes nuevos",values:[123,243,245,234,100]},
              ],
            }
          }
        ],
      });

      PlayTutorialInPage({pageData,group});

    }
  });


});
