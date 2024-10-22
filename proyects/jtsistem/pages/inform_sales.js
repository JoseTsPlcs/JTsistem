
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var group = new CrudsGroup({
        userData,pageData,
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

                      var chart_evol = group.parentGetBuild({parentName:"chart-evol"});
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

                      group.parentGetBuild({parentName:"kpi-tot"}).fieldSetValues({fieldName:"tot",values:[tot_v]});
                      group.parentGetBuild({parentName:"kpi-prom"}).fieldSetValues({fieldName:"prom",values:[prom_v]});
                      
                    }
                  }]
                },
                {
                  name:"stateSetFirst",
                  actions:[{
                    action:()=>{PlayTutorialInPage({group,pageData});}
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
      });

      
    }
  });


});

