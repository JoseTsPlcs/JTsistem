

$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var groups = new CrudsGroup({
        layers:[
          {
            crud:{
              name:"cr-main",
              parent:pageData.body,
              title:pageData.title,
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
                  {
                    name:"ld-products_tags",
                    tableMain:"products_tags",
                    selects:[
                      {table:"products_tags",field:"ID_PRODUCT_TAG",as:"value"},
                      {table:"products_tags",field:"NAME",as:"show"},
                    ],
                    conditions:[
                      {
                        table:"products_tags",
                        field:"ID_COMPANY",
                        inter:"=",
                        value:userData.company.id,
                      },
                    ],
                  }
              ],
              conditions:[
                {
                  table:"sales",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:userData.company.id,
                },
                /*{
                  before:" AND ",
                  table:"sales",
                  field:"PAID",
                  inter:"=",
                  value:1,
                },*/
                /*{
                  before:" AND ",
                  table:"sales",
                  field:"ID_STATUS",
                  inter:"!=",
                  value:5,
                },*/
              ],

              configShow:true,    
              filters:[
                  {name:"rango de fecha",box:{tipe:3,options:op_date_ranges,value:op_date_ranges[2].value}},
                  {col:6,name:"fecha min",box:{tipe:2,value:Date_StartQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por fecha mayor o igual a las seleccionada"},
                  {col:6,name:"fecha max",box:{tipe:2,value:Date_EndQuarter()},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por fecha menor o igual a las seleccionada"},
                  {name:"producto",box:bx_input,select:{table:"products",field:"NAME"},descripcion:"buscar por nombre de producto/servicio/insumo"},
                  {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
                  {name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"},
              ],
              panels:[
                {
                  head:false,tipe:"form",col:12,
                  fields:[
                    {name:"prnt-top",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}},
                  ],
                },
                {
                  head:false,col:12,tipe:"form",
                  fields:[
                    {name:"prnt-evol",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}},
                  ],
                }
              ],

              events:[
                {
                  name:"printBefore",
                  actions:[{
                    action:({result,k})=>{

                      var period = k.bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"rango de fecha"}).GetValue();
                      console.log("PRINT BEFORE",period, result);

                      var products = [];
                      var dates = [];

                      result.forEach(rst => {
                        
                        var dateLabel = Date_GetLabel({dateString:rst["DATE_EMMIT"],period});
                        
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
                            dates:[{
                              label:dateLabel,
                              cant,
                              money,
                            }],
                          });

                        }
                        else
                        {

                          productFound.count++;
                          productFound.money += money;
                          productFound.cant += cant;

                          var productDate = productFound.dates.find(d=>d.label == dateLabel);
                          if(productDate){

                            productDate.cant += cant;
                            productDate.money += money;
                          }
                          else
                          {
                            productFound.dates.push({
                              label:dateLabel,
                              cant,
                              money,
                            });
                          }

                        }

                      });

                      products.forEach(prd => {
                        
                        prd.moneyProm = (prd.money/prd.dates.length).toFixed(2);
                        prd.cantProm = (prd.cant/prd.dates.length).toFixed(2) + " " + prd.unid;
                        prd.cant += " " + prd.unid;

                      });

                      products.sort((a, b) => b.money - a.money);

                      console.log("TRANSFORM DATA",products,dates);
                      k.ReloadDataSetAdd({dataSetName:"products",result:products});
                      
                      if(products.length > 0) EvolProduct({productName:products[0].name});

                      //-----print top list-----

                      var tb_top = groups.parentGet({parentName:"tb-top"}).build;
                      tb_top.fieldSetValues({
                        fieldName:"product",
                        values:products.map(p=>{return p.name}),
                      });
                      tb_top.fieldSetValues({
                        fieldName:"total",
                        values:products.map(p=>{return p.money}),
                      });
                      tb_top.fieldSetValues({
                        fieldName:"edt",
                        values:Array(products.length).fill('<i class="bi bi-search"></i>'),
                      });

                      return {data:products};

                    }
                  }]
                }
              ],
            }
          },
          //top
          {
            panel:{
              parent:"prnt-top",tipe:"table",maxH:200,name:"tb-top",
              fields:[
                {name:"product",title:"producto",attributes:att_ln},
                {name:"total",title:"total vendido",box:{...bx_money},attributes:att_ln},
                {...fld_edit,attributes:att_btn},
              ],
              events:[
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({k,field,y,value})=>{

                      if(field.action == "edit"){
                        
                        EvolProduct({productName:k.fieldGetValues({fieldName:"product"})[y]});
                      }

                    }
                  }]
                }
              ],
            }
          },
          //evol
          {grid:{parent:"prnt-evol",items:[{name:"div-cant",col:6},{name:"div-sale",col:6}]}},
          {
            panel:{
              parent:"div-cant",title:"evolutivo de cantidades",tipe:"form",blocked:false,
              fields:[{name:"stp-cant",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}}]},
          },
          {
            panel:{
              parent:"div-sale",title:"evolutivo de ventas",tipe:"form",blocked:false,
              fields:[{name:"stp-sale",tipe:0,action:"div",box:{tipe:0,class:"conteiner w-100"}}]
            }
          },
          //evol - cant
          {
            grid:{
              parent:"stp-cant",
              items:[
                {name:"prnt-cant-tot",col:6},
                {name:"prnt-cant-prom",col:6},
                {name:"prnt-cant-evol",col:12},
              ],
            }
          },
          {panel:{parent:"prnt-cant-tot",name:"kpi-cant-tot",tipe:"kpi",fields:[{name:"tot",title:"total vendido",box:{tipe:0,class:"w-100 text-center h1",value:0}}]}},
          {panel:{parent:"prnt-cant-prom",name:"kpi-cant-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio vendido",box:{tipe:0,class:"w-100 text-center h1",value:0}}]}},
          {
            panel:{
              parent:"prnt-cant-evol",name:"chrt-cant-evol",
              tipe:"chart",title:"evolutivo del producto seleccionado",
              fields:[
                {name:"labels",values:["mes1","mes2"]},
                {name:"cant",values:[1,2]},
              ],
            }
          },
          //evol - sale
          {
            grid:{
              parent:"stp-sale",
              items:[
                {name:"prnt-sale-tot",col:6},
                {name:"prnt-sale-prom",col:6},
                {name:"prnt-sale-evol",col:12},
              ],
            }
          },
          {panel:{parent:"prnt-sale-tot",name:"kpi-sale-tot",tipe:"kpi",fields:[{name:"tot",title:"total vendido",box:{...bx_money,class:"w-100 text-center h1",value:0}}]}},
          {panel:{parent:"prnt-sale-prom",name:"kpi-sale-prom",tipe:"kpi",fields:[{name:"prom",title:"promedio vendido",box:{...bx_money,class:"w-100 text-center h1",value:0}}]}},
          {
            panel:{
              parent:"prnt-sale-evol",name:"chrt-sale-evol",
              tipe:"chart",title:"evolutivo del producto seleccionado",
              fields:[
                {name:"labels",values:["mes1","mes2"]},
                {name:"sale",values:[1,2]},
              ],
            }
          },
        ],
      });

      function EvolProduct({productName}) {
        
        var crud = groups.parentGet({parentName:"cr-main"}).build;
        var dataset = crud.ReloadDataSetGet({dataSetName:"products"});
        var productData = dataset.result.find(rst=>rst.name == productName);
        console.log("EVOL PRODUCT",productData);

        //-----cant----
        
        var kpi_cant_total = groups.parentGet({parentName:"kpi-cant-tot"}).build;
        kpi_cant_total.fieldSetValues({fieldName:"tot",values:[productData.cant]});

        var kpi_cant_prom = groups.parentGet({parentName:"kpi-cant-prom"}).build;
        kpi_cant_prom.fieldSetValues({fieldName:"prom",values:[productData.cantProm]});

        var chr_cant = groups.parentGet({parentName:"chrt-cant-evol"}).build;
        chr_cant.titleSet({title:"evolutivo de cantidades del producto: " + productName});
        chr_cant.fieldSetValues({fieldName:"labels",values:productData.dates.map(d=>{return d.label;})});
        chr_cant.fieldSetValues({fieldName:"cant",values:productData.dates.map(d=>{return d.cant;})});

        //-----sale----

        var kpi_sale_total = groups.parentGet({parentName:"kpi-sale-tot"}).build;
        kpi_sale_total.fieldSetValues({fieldName:"tot",values:[productData.money]});

        var kpi_sale_prom = groups.parentGet({parentName:"kpi-sale-prom"}).build;
        kpi_sale_prom.fieldSetValues({fieldName:"prom",values:[productData.moneyProm]});

        var chr_sale = groups.parentGet({parentName:"chrt-sale-evol"}).build;
        chr_sale.titleSet({title:"evolutivo de ventas del producto: " + productName});
        chr_sale.fieldSetValues({fieldName:"labels",values:productData.dates.map(d=>{return d.label;})});
        chr_sale.fieldSetValues({fieldName:"sale",values:productData.dates.map(d=>{return d.money;})});

      }

    }
  });


});
