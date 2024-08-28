

$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{


      new Crud_Master({
        parent:pageData.body,
        title:"reporte de productos",
        stateTools:[
            {
              name:"reload",
              tools:[
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
            ld_products_tags,
        ],
        conditions:[
          {
            table:"sales",
            field:"ID_COMPANY",
            inter:"=",
            value:company_id,
          },
          {
            before:" AND ",
            table:"sales",
            field:"ID_STATUS",
            inter:"=",
            value:4,
          },
        ],

        configShow:false,    
        filters:[
            {name:"rango de fecha",box:{tipe:3,options:op_date_ranges,value:op_date_ranges[2].value}},
            {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
            {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
            {name:"producto",box:bx_input,select:{table:"products",field:"NAME"},descripcion:"buscar por nombre de producto/servicio/insumo"},
            {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
            (true?{name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"}:null),
        ],
        panels:[
            {
              head:false,name:"tb",tipe:"table",
              fields:[
                {name:"producto",select:"name",box:{...bx_shw}},
                {name:"total vendido",select:"money",box:{...bx_money}},
                {name:"promedio vendido",select:"moneyProm",box:{...bx_money}},
                {name:"cantidad total",select:"cant",box:{...bx_shw}},
                {name:"cantidad promedio",select:"cantProm",box:{...bx_shw}},
              ],
            }
        ],

        events:[
          {
            name:"printBefore",
            actions:[{
              action:({result,k})=>{

                var products = [];
                var dates = [];

                result.forEach(rst => {
                  
                  var dateLabel = Date_GetLabel({dateString:rst["DATE_EMMIT"],period:k.bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"rango de fecha"}).GetValue()});
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
                    });

                  }
                  else
                  {

                    productFound.count++;
                    productFound.money += money;
                    productFound.cant += cant;
                  }

                });

                products.forEach(prd => {
                  
                  prd.moneyProm = (prd.money/dates.length).toFixed(2);
                  prd.cantProm = (prd.cant/dates.length).toFixed(2) + " " + prd.unid;
                  prd.cant += " " + prd.unid;

                });

                products.sort((a, b) => b.money - a.money);

                //console.log("result",result);
                //console.log("products",products);
                //console.log("dates",dates);

                return {data:products};

              }
            }]
          }
        ],
      });

    }
  });


});
