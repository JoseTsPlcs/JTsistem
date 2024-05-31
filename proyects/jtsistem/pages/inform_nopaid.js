
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{


      var inform = new ConsInform({
        parent:document.body,
        conection:db_lip,
        title:"informe - ventas por cobrar",
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
          //{tipe:1,name:"rango de fecha",box:{tipe:3,options:op_date_ranges}},
          //{col:6,name:"fecha min",box:bx_date_start,select:{table:"sales",field:"DATE_EMMIT",tipe:"min"}},
          //{col:6,name:"fecha max",box:bx_date_end,select:{table:"sales",field:"DATE_EMMIT",tipe:"max"}},
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
            name:"sales-count",
            tipe:"target",
            col:6,
          },
          {
            name:"lst-sales",
            tipe:"table",
            col:12,
            fields:[
              {name:"edit",box:fld_edit.box},
              {name:"id",box:{tipe:0}},
              {name:"fecha",box:{tipe:0}},
              {name:"cliente",attributes:[{name:"class",value:" px-1"},{name:"style",value:"min-width: 200px;"}]},
              {name:"total",box:bx_money},
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
            {table:'customers',field:'NAME'},
          ],
          joins:[
            {
              main:{table:"sales",field:"ID_CUSTOMER"},
              join:{table:"customers",field:"ID_CUSTOMER"},
              tipe:"LEFT",
            }
          ],
          conditions:[
            ...conditionsFilters,
            {
              before:(conditionsFilters.length > 0 ?" AND ":""),
              table:"sales",
              field:"ID_COMPANY",
              inter:"=",
              value:userData.company.id,
            },
            {
              before:" AND ",
              table:"sales",
              field:"ID_STATUS",
              inter:"=",
              value:4,
            },
            {
              before:" AND ",
              table:"sales",
              field:"PAID",
              inter:"=",
              value:0,
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

            var sales_count = result.reduce((acc,rst)=>{return acc +1},0);
            var sales_total = result.reduce((acc,rst)=>{return acc + parseFloat(rst["TOTAL"])},0);

            var lst_sales = [
              {
                label:"edit",
                data: result.map(rst=>{

                  return fld_edit.box.value;
                }),
              },
              {
                label:"id",
                data: result.map(rst=>{

                  return rst["ID_SALE"];
                }),
              },
              {
                label:"fecha",
                data: result.map(rst=>{

                  return rst["DATE_EMMIT"];
                }),
              },
              {
                label:"cliente",
                data: result.map(rst=>{

                  return rst["NAME"];
                }),
              },
              {
                label:"fecha",
                data: result.map(rst=>{

                  return rst["DATE_EMMIT"];
                }),
              },
              {
                label:"total",
                data: result.map(rst=>{

                  return rst["TOTAL"];
                }),
              },
            ];

            //----------PRINT---------

            inform.Chart_SetData({
              chartName:"sales-tot",
              labels:[],
              dataSets:[
                {
                  label:"total de ventas no pagadas",
                  data:["S/. " + sales_total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })],
                }
              ],
            });

            inform.Chart_SetData({
              chartName:"sales-count",
              labels:[],
              dataSets:[
                {
                  label:"cantidad de ventas no pagadas",
                  data:[sales_count.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })],
                }
              ],
            });

            inform.Chart_SetData({
              chartName:"lst-sales",
              labels:[],
              dataSets:lst_sales,
            });

            inform.ScreenLoad_Set({active:false});
          }
        });

      }

    }
  });


});
