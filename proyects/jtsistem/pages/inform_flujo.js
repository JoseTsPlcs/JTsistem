

$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var lines = [
        "VENTAS",
        "COMPRAS",
        "UTILIDAD BRUTA",
      ];

      var group = new CrudsGroup({
        userData,pageData,
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
                      var table = group.parentGet({parentName:"detail-tb"}).build;
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
                      var chart = group.parentGet({parentName:"detail-chart"}).build;

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
      });

      PlayTutorialInPage({pageData,group});

    }
  });


});
