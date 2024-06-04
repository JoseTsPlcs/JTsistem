
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{


      var inform = new ConsInform({
        parent:document.body,
        conection:db_lip,
        title:"informe - ventas",
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
          {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"}},
          {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"}},
          //{name:"estados",box:{tipe:4,options:op_sales_status,value:['confirmado','en proceso','terminado']},select:{table:"sales",field:"ID_STATUS"}},
          //{name:"etiquetas",box:{tipe:4},load:{name:"ld-tags",show:"show",value:"value"}},
          //{name:"producto",box:{tipe:8}},
        ],
        charts:[
          {
            name:"sales-tot",
            tipe:"target",
            col:6,
          },
          {
            name:"prom-tot",
            tipe:"target",
            col:6,
          },
          {
            name:"sales-total",
            tipe:"chart-evolutivo",
            stacked:true,
            title:"evolutivo de ventas totales",
            //stacked:true,
            col:8,
          },
          {
            name:"sales-tags",
            tipe:"chart-donu",
            title:"ventas totales por etiquetas",
            col:4,
          },
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
        
        //return;
        inform.ScreenLoad_Set({active:true});

        var conditionsFilters = inform.Filters_Get().GetConditions();
        var requestSql = db_lip.GetSql_Select({
          tableMain:"sales",
          selects:[
            {table:'sales', field:'ID_SALE'},
            {table:'sales', field:'DATE_EMMIT'},
            {table:'sales', field:'ID_STATUS'},
            {table:'sales', field:'ID_DOCUMENT'},
            {table:'sales', field:'ID_CUSTOMER'},
            {table:'sales', field:'TOTAL'},
            {table:'sales', field:'PAID'},
            //{table:'sales_products', field:'ID'},
            //{table:'sales_products', field:'ID_SALE'},
            {table:'sales_products', field:'ID_PRODUCT'},
            {table:'sales_products', field:'CANT'},
            {table:'sales_products', field:'PRICE_UNIT'},
            {table:'sales_products', field:'PRICE_TOTAL'},
            {table:"products_tags",field:"NAME",as:"TAG_NAME"},
          ],
          joins:[
            {
              main:{table:"sales",field:"ID_SALE"},
              join:{table:"sales_products",field:"ID_SALE"},
              tipe:"LEFT",
            },
            {
              main:{table:"sales_products",field:"ID_PRODUCT"},
              join:{table:"products",field:"ID_PRODUCT"},
              tipe:"LEFT",
            },
            {
              main:{table:"products",field:"ID_PRODUCT_TAG"},
              join:{table:"products_tags",field:"ID_PRODUCT_TAG"},
              tipe:"LEFT",
            }
          ],
          conditions:[
            ...conditionsFilters,
            {
              before:" AND ",
              table:"sales",
              field:"ID_COMPANY",
              inter:"=",
              value:userData.company.id,
            },
            /*{
              before:" AND ",
              table:"sales",
              field:"ID_STATUS",
              inter:"=",
              value:4,
            },*/
            {
              before:" AND ",
              table:"sales",
              field:"PAID",
              inter:"=",
              value:1,
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

            var periodType = k.Filters_Get().Filter_GetBox({filterName:"periodo"}).GetValue();

            result.forEach(rst => {
              
              rst["PERIOD"] = Date_GetLabel({dateString:rst["DATE_EMMIT"],period:periodType});
            });

            var tags = UniqueLabels({data:result,labelField:"TAG_NAME"});
            tags.forEach(tg => {
              
              tg.total = result.reduce((acc,rst)=>{

                var add = rst["TAG_NAME"] == tg.name ? parseFloat(rst["PRICE_TOTAL"]) : 0;
                return acc + add;
              },0);

            });
            console.log("tags:",tags); 

            var period = Date_GetPeriod({data:result,dataField:"DATE_EMMIT",period:periodType});
            period = period.map((p)=>{return {label:p,total:0}});
            console.log("period:",period);

            period.forEach(p => {
              
              p.total = result.filter(rst=>rst["PERIOD"] == p.label).reduce((acc,v)=>{
                
                return acc+parseFloat(v["PRICE_TOTAL"]);
              },0);
              
            });


            tags.forEach(tg => {
              
              tg.dateValues = period.map((p)=>{

                return result.filter(rst=>rst["PERIOD"]==p.label && rst["TAG_NAME"]==tg.name).reduce((acc,rst)=>{

                  return acc + parseFloat(rst["PRICE_TOTAL"]);
                },0);
              });

            });

            var sales_total = tags.reduce((acc,tg)=>{return acc + tg.total},0);
            var sales_total_nopaid = result.filter(rst=>rst["PAID"] == 0).reduce((acc,rst)=>{return acc + parseFloat(rst["TOTAL"])},0);
            var sales_total_paid = result.filter(rst=>rst["PAID"] == 1).reduce((acc,rst)=>{return acc + parseFloat(rst["TOTAL"])},0);
            var sales_prom = sales_total/period.length;

            //------print------

            var priceEvolLabels = period.map((p)=>{return p.label});
            var priceEvolData = [
              {
                type:"line",
                label: 'total',
                data: period.map((p)=>{return p.total}),
                borderWidth: 1,
                //backgroundColor:'#92A8D1',
              },
            ];
            tags.forEach(tg => {
              
              priceEvolData.push({
                label:tg.name,
                data:tg.dateValues,
                //backgroundColor:tg.color,
                borderWidth: 1,
              });
            });

            inform.Chart_SetData({
              chartName:"sales-total",
              labels:priceEvolLabels,
              dataSets:priceEvolData,
            });

            var priceDonuLabes = tags.map((tg)=>{return tg.name});
            var priceDonuData = [{
              label:"etiquetas",
              data:tags.map((tg)=>{return tg.total}),
            }];

            inform.Chart_SetData({
              chartName:"sales-tags",
              labels:priceDonuLabes,
              dataSets:priceDonuData,
            });

            inform.Chart_SetData({
              chartName:"sales-tot",
              labels:[],
              dataSets:[{
                label:"total vendido",
                data:["S/. " + sales_total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
              }],
            });

            inform.Chart_SetData({
              chartName:"prom-tot",
              labels:[],
              dataSets:[{
                label:"promedio vendido",
                data:["S/. " + sales_prom.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
              }],
            });

            /*inform.Chart_SetData({
              chartName:"sales-tot_paid",
              labels:[],
              dataSets:[{
                label:"total vendido - pagado",
                data:["S/. " + sales_total_paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
              }],
            });*/

            /*inform.Chart_SetData({
              chartName:"sales-tot_nopaid",
              labels:[],
              dataSets:[{
                label:"total vendido - sin pagar",
                data:["S/. " + sales_total_nopaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
              }],
            });*/

            inform.ScreenLoad_Set({active:false});
          }
        });

      }

    }
  });


});
