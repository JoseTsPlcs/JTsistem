
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

        //----------buid dooms--------

        var grBody = new Grid({
          cols:[
            [12],//modal provideer
            [6,6],//buy
            [12],//steps
          ],
          attributes:[
            {x:0,y:1,attributes:[{name:"class",value:"col-12 col-md-4 pb-4"}/*,{name:"style",value:"background-color: lightcoral;"}*/]},
            {x:1,y:1,attributes:[{name:"class",value:"col-12 col-md-8"}/*,{name:"style",value:"background-color: lightblue; min-height: 600px; flex: 1;"}*/]},
          ]
        });
        var stpGeneral = new Steps({
          parent:grBody.GetColData({x:1,y:1}).col,
          steps:[
            {
              name:'<i class="bi bi-card-checklist"></i> productos',
              window:{
                //head:false,
                grid:{cols:[[12]]}
              }
            },
            {
              name:'<i class="bi bi-currency-dollar"></i> pagos',
              window:{
                //head:false,
                grid:{cols:[[12],[12]]}
              }
            },
          ],
        });
        var mdPay = new Modal({
          parent:stpGeneral.GetStep({stepIndex:1}).window.Conteiner_GetColData({x:0,y:1}).col,
        });
        var mdProvideer = new Modal({
          parent:grBody.GetColData({x:0,y:0}).col,
        });
        stpGeneral.SetStepIndex({stepIndex:0});
        
        //---------config cruds--------

        var conections = new ConsCruds({

          test:true,
          cruds:[
            {
              name:"buy",
              active:true,
              script:{
                parent:grBody.GetColData({x:0,y:1}).col,
                title:"compra",head:true,
                panels:[
                  {col:12,y:0,title:"principal",tipe:"form",blocked:false},
                  {col:12,y:0,title:"proveedor",tipe:"form",blocked:false},
                ],
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

                tableMain:"buys",
                selects:[
                  {table:'buys', field:'ID_BUY',primary:true},
                  {table:'buys', field:'DATE_EMMIT'},
                  {table:'buys', field:'ID_BUY_STATUS'},
                  {table:'buys', field:'ID_PROVIDEER'},
                  {table:'buys', field:'TOTAL'},
                ],
                inserts:[
                  {
                    field:"ID_COMPANY",
                    value:userData.company.id,
                  }
                ],
                loads:[
                  {
                    name:"ld-provideers",
                    tableMain:"provideers",
                    selects:[
                      {table:"provideers",field:"ID_PROVIDEER",as:"value"},
                      {table:"provideers",field:"NAME",as:"show"},
                    ],
                    conditions:[{
                      table:"provideers",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }],
                  },
                ],

                fields:[
                  {panel:"principal",col:12,y:0,name:"id",box:{tipe:0},select:"ID_BUY"},
                  {panel:"principal",col:12,y:1,name:"fecha de emision",box:bx_date,select:"DATE_EMMIT"},
                  {panel:"principal",col:12,y:2,name:"estado",box:{tipe:3,options:op_buys_status,value:1},select:"ID_BUY_STATUS"},
                  {panel:"principal",col:12,y:3,name:"total",box:bx_moneyh3,select:"TOTAL"},
                  {panel:"principal",col:12,y:4,name:"pagado",box:bx_money},

                  {panel:"proveedor",col:12,y:0,name:"proveedor",box:{tipe:8,value:1,class:"w-100"},select:"ID_PROVIDEER",load:{name:"ld-provideers",show:"show"}},
                  {panel:"proveedor",col:6,...fld_edit},
                  {panel:"proveedor",col:6,...fld_add},
                  
                ],
              }
            },
            {
              name:"provieeder",
              active:true,
              script:{
                parent:mdProvideer.GetContent(),
                title:"proveedor",
                panels:[{col:12,y:0,title:"main",tipe:"form"}],
                stateTools:stTls_fm_maid, 
                stateStart:"block",
                afterInsert:"block",
                afterUpdate:"block",
                afterCancel:"block",

                tableMain:"provideers",
                selects:[
                  {table:'provideers', field:'ID_PROVIDEER',primary:true},
                  {table:'provideers', field:'ID_COMPANY'},
                  {table:'provideers', field:'NAME'},
                  //{table:'provideers', field:'ID_PROVIDEER_TIPE'},
                  {table:'provideers', field:'RUC'},
                ],
                inserts:ins_general,

                fields:[
                  {panel:"main",name:"nombre",box:bx_input,select:"NAME"},
                  {panel:"main",name:"ruc",box:bx_input,select:"RUC"},
                ],
                events:[
                  {
                    name:"modalSetActive",
                    actions:[{
                      action:({k,active})=>{

                        mdProvideer.SetActive({active});
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

                parent:stpGeneral.GetStep({stepIndex:0}).window.Conteiner_GetColData({x:0,y:0}).col,
                title:"lista de productos",head:false,
                panels:[
                  {col:12,y:0,title:"main",tipe:"table",h:600},
                ],
                stateStart:"block",
                stateTools:stTls_tb_maid,

                tableMain:"buys_products",
                selects:[
                  {table:'buys_products', field:'ID_BUY_PRODUCT',primary:true},
                  {table:'buys_products', field:'ID_BUY'},
                  {table:'buys_products', field:'ID_PRODUCT'},
                  {table:'buys_products', field:'CANT'},
                  {table:'buys_products', field:'COST_UNIT'},
                  {table:'buys_products', field:'COST_TOTAL'},
                  {table:"unids",field:"SIMBOL"},
                ],
                joins:[
                  {
                    main:{table:"buys_products",field:"ID_PRODUCT"},
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
                    name:"ld-supplies-products",
                    tableMain:"products",
                    selects:[
                        {table:'products', field:'ID_PRODUCT',as:"value"},
                        {table:'products', field:'NAME',as:"show"},
                    ],
                    conditions:[
                        {
                            before:"(",
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
                            after:") "
                        },
                        {
                            before:" AND ",
                            table:"products",
                            field:"ACTIVE",
                            inter:"=",
                            value:1,
                        },
                        {
                            before:" AND ",
                            table:"products",
                            field:"ID_COMPANY",
                            inter:"=",
                            value:company_id,
                        },
                    ],
                  }
                ],

                fields:[
                  {panel:"main",...fld_delete,attributes:att_btn},
                  //{panel:"main",name:"id",box:{tipe:0},select:"ID_BUY_PRODUCT"},
                  //{panel:"main",name:"id compra",box:{tipe:0},select:"ID_BUY"},
                  {panel:"main",name:"producto/insumo",box:{tipe:8,class:"w-100"},attributes:att_ln,select:"ID_PRODUCT",load:{name:"ld-supplies-products",show:"show"}},
                  {panel:"main",name:"unidad",box:bx_shw,select:"SIMBOL"},
                  {panel:"main",name:"cantidad",box:bx_cant,attributes:att_cnt,select:"CANT"},
                  //{panel:"main",name:"unidad",box:{tipe:1}},
                  {panel:"main",name:"costo unitario",box:{tipe:1,value:0},attributes:att_cnt,select:"COST_UNIT"},
                  {panel:"main",name:"costo total",box:{tipe:1,value:0},attributes:att_cnt,select:"COST_TOTAL"},
                ],

                events:[
                  {
                    name:"calculateTotal",
                    actions:[
                      {
                        action:({k})=>{
              
                          var costTotal = 0;
                          var costTotalValues = k.GetValues({fieldName:"costo total"});
                          costTotalValues.forEach(ct => {
                            
                            costTotal += parseFloat(ct);
                          });
                          
                          var cr_buy = conections.Crud_GetBuild({name:"buy"});
                          cr_buy.SetValuesToBox({values:[costTotal],fieldName:"total"});
                          var data = cr_buy.Reload_GetData();
                          if(data.length>0){
              
                            cr_buy.Update_AddChange({
                              fieldName:"total",
                              value:costTotal,
                              primary:data[0]["ID_BUY"]
                            });
                          }            
                        }
                      }
                    ],
                  },
                  {
                    name:"printAfter",
                    actions:[
                      {
                        action:({k})=>{
              
                          k.CallEvent({name:"calculateTotal"});    
                        }
                      }
                    ],
                  },
                  {
                    name:"updateAfter",
                    actions:[
                      {
                        action:({k})=>{
                        
                          k.CallEvent({name:"calculateTotal"});    
                        }
                      }
                    ],
                  },
                  {
                    name:"boxUpdate",
                    actions:[{
                      action:({field,k,y})=>{

                        if(k.StateGet()=="new"){

                          var cant = parseFloat(k.GetValue({fieldName:"cantidad",y}));
                          var tot = parseFloat(k.GetValue({fieldName:"costo total",y}));
                          var uni  = parseFloat(k.GetValue({fieldName:"costo unitario",y}));

                          if(field.name == "cantidad"){

                            if(tot!=0) uni = tot/cant;

                            if(uni!=0) tot = cant * uni;
                          }

                          if(field.name == "costo unitario")  tot = cant * uni;
                          if(field.name == "costo total")  uni = tot/cant;

                          k.SetValue({fieldName:"cantidad",y,value:cant});
                          k.SetValue({fieldName:"costo unitario",y,value:uni});
                          k.SetValue({fieldName:"costo total",y,value:tot});
                        }
                      }
                    }]
                  }
                ],
              }
            },
            {
              name:"pays",
              active:true,
              script:{
                ...scr_fm_pays({
                  head:false,
                  parent:stpGeneral.GetStep({stepIndex:1}).window.Conteiner_GetColData({x:0,y:0}).col,
                  tableName:"buys_payments",
                  priFieldName:"ID_BUY_PAY",
                  joinFieldName:"ID_BUY",
                  events:[
                    {
                      name:"calculateTotal",
                      actions:[
                        {
                          action:({k})=>{
                
                            var payTotal = 0;
                            var costTotalValues = k.GetValues({fieldName:"total"});
                            costTotalValues.forEach(ct => {
                              
                              payTotal += parseFloat(ct);
                            });
                            
                            var cr_buy = conections.Crud_GetBuild({name:"buy"});
                            cr_buy.SetValuesToBox({values:[payTotal],fieldName:"pagado"});         
                          }
                        }
                      ],
                    },
                    {
                      name:"printAfter",
                      actions:[{
                        action:({k})=>{
        
                          k.CallEvent({name:"calculateTotal"});
                        }
                      }]
                    },
                  ],
                }),          
              }
            },
            {
              name:"pay",
              active:true,
              script:{
                parent:mdPay.GetContent(),
                ...scr_pay({
                  tagValue:2,
                  events:[
                    {
                      name:"modalSetActive",
                      actions:[
                        {
                          action:({active})=>{
                
                            mdPay.SetActive({active});
                          }
                        }
                      ],
                    },
                  ],
                }),
              },
            },
          ],


          conections:[
            {
              tipe:"fm-tb",
              master:"buy",
              masterField:"ID_BUY",
              maid:"products",
              maidField:"ID_BUY"
            },
            {
              tipe:"fm-tb",
              master:"buy",
              masterField:"ID_BUY",
              maid:"pays",
              maidField:"ID_BUY"
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
              master:"buy",
              masterActionEdit:"edit",
              masterActionAdd:"add",
              masterField:"proveedor",
              maid:"provieeder",
              maidField:"ID_PROVIDEER",
            },
          ],


          searchs:[
            {
              crudName:"buy",
              valueName:"id_buy",
              fieldName:"ID_BUY"
            },
          ],
        });

    }
  });
  

});
