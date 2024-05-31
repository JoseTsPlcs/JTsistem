
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{


      var inform = new ConsInform({
        parent:document.body,
        conection:db_lip,
        title:"informe - utilidades",
        loads:[
          {
            name:"ld-tags",
            tableMain:"products_tags",
            selects:[
              {table:'products_tags', field:'ID_PRODUCT_TAG',as:"value"},
              {table:'products_tags', field:'NAME',as:"show"},
            ],
            conditions:[{
              //before:" AND ",
              table:"products_tags",
              field:"ID_COMPANY",
              inter:"=",
              value:userData.company.id,
            }],
          },
        ],
        filters:[
          {tipe:1,name:"periodo",box:{tipe:3,options:op_date_ranges,value:"month"}},
          {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"payments",field:"DATE_EMMIT",tipe:"min"}},
          {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"payments",field:"DATE_EMMIT",tipe:"max"}},
          //{name:"estados",box:{tipe:4,options:op_sales_status,value:['confirmado','en proceso','terminado']},select:{table:"sales",field:"ID_STATUS"}},
          //{name:"etiquetas",box:{tipe:4},load:{name:"ld-tags",show:"show",value:"value"}},
          //{name:"producto",box:{tipe:8}},
        ],
        charts:[
          {
            name:"t-utils",
            tipe:"target",
            col:12,
          },
          {
            name:"t-1",
            tipe:"target",
            col:6,
          },
          {
            name:"t-0",
            tipe:"target",
            col:6,
          },
          {
            name:"evol-util",
            tipe:"chart-evolutivo",
            title:"evolutivo de uitlidades",
            col:12,
          },
          {
            name:"evol-income",
            tipe:"chart-evolutivo",
            title:"evolutivo de ingresos e egresos",
            col:12,
          },
          {
            name:"d-1",
            tipe:"chart-donu",
            title:"ingresos totales",
            col:6,
          },
          {
            name:"d-0",
            tipe:"chart-donu",
            title:"egresos totales",
            col:6,
          },
          /*{
            name:"lista de transacciones",
            tipe:"table",
            col:12,
            fields:[
              {name:"descripcion",box:{tipe:0}},
            ],
            events:[
              {
                name:"boxUpdate",
                actions:[
                  {
                    action:({field,y,k})=>{
        
                      console.log(field);
                      if(field.name=="edit"){
                         
                        var id_sale = k.Fields_GetValues({fieldName:"id"})[y];
                        PageSend({
                          url:"sales_new.php",
                          send:{id_sale},
                        });
                        //console.log("edit sale!!", sale_id);
                      }
                    }
                  }
                ],
              },
            ],
          },*/
        ],
        events:[
          {
            name:"reload",
            actions:[{
              action:({k})=>{
                
                Reload({k});
              }
            }]
          }
        ],
      });


      function Reload({k}) {
        
        inform.ScreenLoad_Set({active:true});

        var conditionsFilters = inform.Filters_Get().GetConditions();
        var requestSql = db_lip.GetSql_Select({
          tableMain:"payments",
          selects:[
            {table:'payments', field:'DATE_EMMIT'},
            {table:'payments', field:'TOTAL'},
            {table:'payments', field:'INCOME'},
            {table:'pay_tag', field:'NAME',as:'TAG_NAME'},
          ],
          joins:[
            {
              main:{table:"payments",field:"ID_PAY_TAG"},
              join:{table:"pay_tag",field:"ID_PAY_TAG"},
              tipe:"LEFT",
            }
          ],
          conditions:[
            ...conditionsFilters,
            {
              before:" AND ",
              table:"payments",
              field:"ID_COMPANY",
              inter:"=",
              value:userData.company.id,
            },
          ],
          orders:[
            {field:"DATE_EMMIT",asc:true},
          ],
        });

        console.log("resquestSql:",requestSql);

        db_lip.Request({
          sql:requestSql,
          php:"row",
          success:(result)=>{

            console.log("------result request----------");
            console.log(result);

            var periodType = inform.Filters_Get().Filter_GetBox({filterName:"periodo"}).GetValue();

            var tags = [];
            var total = [
              {lable:"ingresos",total:0,periodValues:[]},
              {lable:"egresos",total:0,periodValues:[]},
              {lable:"utilidad",total:0,periodValues:[]},
            ];
            
            result.forEach(rst => {
              
              rst["PERIOD"] = Date_GetLabel({dateString:rst["DATE_EMMIT"],period:periodType});
              var tagName = rst["TAG_NAME"];
              var total = parseFloat(parseFloat(rst["TOTAL"]).toFixed(2));
              var income = parseInt(rst["INCOME"]) == 1;

              var tagFoundIndex = tags.findIndex(tg=>tg.name==tagName&&tg.income==income);
              if(tagFoundIndex==-1){

                tags.push({
                  name:tagName,
                  income,
                  total,
                  periodValues:[],
                });
              }
              else
              {

                var tagFound = tags[tagFoundIndex];
                tagFound.total += total;
              }           
            });
            tags = tags.sort((a, b) => {
              // Los elementos con income = true se ponen antes que los con income = false
              return a.income === b.income ? 0 : a.income ? -1 : 1;
            });

            console.log("tags:",tags);
            console.log("total:",total);

            var period = Date_GetPeriod({data:result,dataField:"DATE_EMMIT",period:periodType});
            console.log("period:",period);

            period.forEach(p => {
              
              tags.forEach(tg => {
                
                var t = result.filter(rst=>rst["TAG_NAME"]==tg.name && rst["PERIOD"]==p).reduce((acc,rst)=>{return acc + parseFloat(rst["TOTAL"])},0);
                t = t * (tg.income ? 1 : -1);
                //var v = "S/. " + t.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                tg.periodValues.push(t);
              });

              total[0].periodValues.push(
                result.filter(rst=>rst["PERIOD"] == p && rst["INCOME"] == 1).reduce((acc,rst)=>{return acc + parseFloat(rst["TOTAL"])},0).toFixed(2)
              );
              total[0].total = total[0].periodValues.reduce((acc,v)=>{return acc + parseFloat(v)},0).toFixed(2);

              total[1].periodValues.push(
                result.filter(rst=>rst["PERIOD"] == p && rst["INCOME"] == 0).reduce((acc,rst)=>{return acc + parseFloat(rst["TOTAL"])},0).toFixed(2)
              );
              total[1].total = total[1].periodValues.reduce((acc,v)=>{return acc + parseFloat(v)},0).toFixed(2);
              
              total[2].periodValues.push(
                (parseFloat(total[0].periodValues[total[0].periodValues.length-1]) - parseFloat(total[1].periodValues[total[1].periodValues.length-1])).toFixed(2)
              );
              total[2].total = total[2].periodValues.reduce((acc,v)=>{return acc + parseFloat(v)},0).toFixed(2);
              
            });

            

            //-----------------print-------------

            /*var table_pays = inform.Chart_GetBuild({chartName:"lista de transacciones"});
            period.forEach(p=>{

              table_pays.Fields_Add({
                name:p,
                box:bx_income,
              });
            });

            table_pays.Fields_SetValues({
              fieldName:"descripcion",values:tags.map(tg=>{return tg.name + " " + (tg.income?"(+)":"(-)")}),
            });
            
            for (let p = 0; p < period.length; p++) {
              const pr = period[p];

              var values = tags.map((tg)=>{return tg.periodValues[p]});
              table_pays.Fields_SetValues({
                fieldName:pr,
                values,
              });
            }*/

            inform.Chart_SetData({
              chartName:"evol-income",
              labels:period,
              dataSets:[
                {
                  label: 'ingresos',
                  data: total[0].periodValues,
                  //borderWidth: 1,
                  //type:"line",
                },
                {
                  label: 'engresos',
                  data: total[1].periodValues,
                  //borderWidth: 1,
                  //type:"line",
                },
              ],
            });

            inform.Chart_SetData({
              chartName:"evol-util",
              labels:period,
              dataSets:[
                {
                  label: 'utilidad',
                  data: total[2].periodValues,
                  borderWidth: 1,
                  //type:"line",
                },
                {
                  label: 'utilidad',
                  data: total[2].periodValues,
                  borderWidth: 1,
                  type:"line",
                },
                /*{
                  label:"zero",
                  data:period.map((p)=>{return 0}),
                  type:"line",
                }*/
              ],
            });

            //inform.Chart_GetBuild({chartName:"utilidad "});

            inform.Chart_SetData({
              chartName:"t-utils",
              labels:[],
              dataSets:[{
                label:"utilidad total",
                data:["S/. " + total[2].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
              }],
            });

            inform.Chart_SetData({
              chartName:"t-1",
              labels:[],
              dataSets:[{
                label:"ingreso total",
                data:["S/. " + total[0].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
              }],
            });

            inform.Chart_SetData({
              chartName:"t-0",
              labels:[],
              dataSets:[{
                label:"egreso total",
                data:["S/. " + total[1].total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
              }],
            });

            inform.Chart_SetData({
              chartName:"d-1",
              labels:tags.filter(tg=>tg.income==true).map((tg)=>{return tg.name}),
              dataSets:[{
                label:"etiquetas",
                data:tags.filter(tg=>tg.income==true).map((tg)=>{return tg.total}),
              }],
            });

            inform.Chart_SetData({
              chartName:"d-0",
              labels:tags.filter(tg=>tg.income==false).map((tg)=>{return tg.name}),
              dataSets:[{
                label:"etiquetas",
                data:tags.filter(tg=>tg.income==false).map((tg)=>{return tg.total}),
              }],
            });

            inform.ScreenLoad_Set({active:false});
          }
        });

      }

    }
  });


});
