
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var acc_control_update_open = false && userData.access.find(acc=>acc.value=="acc-4") &&  userData.access.find(acc=>acc.value=="acc-4").active == "true";
      var acc_control_update_close = false && userData.access.find(acc=>acc.value=="acc-4") &&  userData.access.find(acc=>acc.value=="acc-5").active == "true";

      
      var gr = new Grid({
        cols:[
          [4,8],//0
          [12],//1-modal [12,12,12]
          [12],//2
          [12],//
        ],
        attributes:[
          {x:0,y:0,attributes:[{name:"class",value:"col-12 col-md-4"}]},
          {x:1,y:0,attributes:[{name:"class",value:"col-12 col-md-8"}]},
        ],
      });
      
      var test = false;

      var prnt_account = gr.GetColData({x:0,y:0}).col;
      var prnt_control = gr.GetColData({x:1,y:0}).col;
      //var prnt_control_fm = gr.GetColData({x:0,y:2}).col;
      //var prnt_pays = gr.GetColData({x:0,y:3}).col;
      var prnt_modal =  gr.GetColData({x:0,y:1}).col;
      var prnt2_modal =  gr.GetColData({x:0,y:2}).col;

      var md1 = new Modal({
        parent: prnt_modal,
        size:"lg",
      }); 

      var gr_md1 = new Grid({
        parent:md1.GetContent(),
        cols:[[12],[12],[12]],
        attributes:[
          {y:2,x:0,attributes:[{name:"class",value:"d-flex justify-content-center"}]},
        ],
        boxs:[
          {x:0,y:2,box:{tipe:5,value:"add",class:"btn btn-outline-primary btn-sm",update:()=>{
            var cr_pay = control.Crud_GetBuild({name:"pay"});
            cr_pay.SetState({stateName:"new"});
            console.log(cr_pay);
          }}}
        ],
      });

      var md2 = new Modal({
        parent: prnt2_modal,
        size:"md",
      });

      var prnt_control_fm = gr_md1.GetColData({x:0,y:0}).col;
      var prnt_pays = gr_md1.GetColData({x:0,y:1}).col;
      var prnt_pay = md2.GetContent();
      

      var account_id = null;
      var account_total = 0;
      var account_date_start = null;
      var account_hora_start = null;
      var account_date_end = null;
      var account_hora_end = null;
      //var md = new Modal({parent:gr.GetColData({x:0,y:2}).col,size:"lg"});
    
      var control = new ConsCruds({
    
        cruds:[
          {
            name:"account",
            active:true,
            script:{
              parent:prnt_account,
              title:"cuenta",
              panels:[
                {col:12,y:0,title:"main",tipe:"form",show:false,head:false}
              ],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:1},
                        {name:"reload",show:true},
                        {name:"update",show:false},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],

              tableMain:"accounts",
              selects:[
                {table:"accounts",field:"ID_ACCOUNT",primary:true},
                {table:"accounts",field:"NAME"},
                {table:"accounts",field:"TOTAL"},
                {table:"accounts",field:"OPEN"},
              ],
              conditions:[
                {
                  table:"accounts",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],
              loads:[
                {
                  name:"ld-accounts",
                  tableMain:"accounts",
                  selects:[
                      {table:'accounts', field:'ID_ACCOUNT',as:"value"},
                      {table:'accounts', field:'NAME',as:"show"},
                  ],
                  conditions:[
                      {
                          table:"accounts",
                          field:"ACTIVE",
                          inter:"=",
                          value:1
                      },
                      {
                        before:" AND ",
                        table:"accounts",
                        field:"ID_COMPANY",
                        inter:"=",
                        value:company_id,
                      },
                      {
                        before:" AND ", 
                        table:"accounts",
                        field:"CONTROL_BY_OPEN",
                        inter:"=",
                        value:1
                    },
                  ],
                }
              ],
              
              configShow:true,
              //configTitle:"cuenta",
              configHead:false,
              configToolsPositions:[
                {name:"reload",position:"head-center",show:false},
                {name:"clear",position:"head-center",show:false},
              ],
              filters:[
                {name:"cuenta",box:{tipe:3},load:{name:"ld-accounts",value:"value",show:"show"},select:{table:"accounts",field:"ID_ACCOUNT",inter:"="}},
              ],

              fields:[
                //{panel:"main",col:12,name:"cuenta",box:{tipe:0},select:"NAME"},
                //{panel:"main",col:12,name:"cuenta",box:{tipe:3},load:{name:"ld-accounts",value:"value",show:"show"},action:"account"},
                {panel:"main",col:12,name:"total",box:bx_moneyh1,select:"TOTAL"},
                {panel:"main",col:12,name:"estado",box:{tipe:0,options:op_account_state},select:"OPEN"},
                {panel:"main",col:12,name:"open/close",tipe:0,box:{tipe:5,value:'abrir',class:"btn btn-success btn-sm"},action:"change"},   
                //{panel:"main",col:6,name:"open",tipe:0,box:{tipe:5,value:'open'},action:"open"},   
                //{panel:"main",col:6,name:"close",tipe:0,box:{tipe:5,value:'close'},action:"close"},
              ],

              events:[
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({k,field,y})=>{

                      if(field.action == "account"){

                        //k.SetState({stateName:"reload"});
                      }

                      if(field.action == "change") AccountChangeState({});
                    }
                  }]
                },
                {
                  name:"reloadConditionsAfter",
                  actions:[{
                    action:({k,conditions=[]})=>{

                     /* conditions.push({
                        before:conditions.length>0?" AND ":"",
                        table:"accounts",
                        field:"ID_ACCOUNT",
                        inter:"=",
                        value:k.GetValue({fieldName:"cuenta",y:0}),
                      });*/

                      return {conditions};
                    }
                  }]
                }
              ],
            },
          },
          {
            name:"control",
            active:true,
            script:{
              parent:prnt_control,
              title:"control de caja",
              panels:[
                {col:12,y:0,title:"main",tipe:"table"},
              ],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:10},
                        {name:"reload",show:true},
                        {name:"update",show:false},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],
              stateStart:"block",

              tableMain:"control_accounts",
              selects:[
                {table:"control_accounts",field:"ID_CONTROL_ACCOUNT",primary:true},
                {table:"control_accounts",field:"ID_ACCOUNT"},
                {table:"accounts",field:"NAME",as:"ACCOUNT_NAME"},
                {table:"control_accounts",field:"OPEN"},

                {table:"control_accounts",field:"DATE_EMMIT_OPEN"},
                {table:"control_accounts",field:"TOTAL_OPEN"},

                {table:"control_accounts",field:"DATE_EMMIT_CLOSE"},
                {table:"control_accounts",field:"TOTAL_CLOSE"},
              ],
              joins:[
                {
                  main:{table:"control_accounts",field:"ID_ACCOUNT"},
                  join:{table:"accounts",field:"ID_ACCOUNT"},
                  tipe:"LEFT",
                }
              ],
              inserts:ins_general,   
              

              fields:[
                //(acc_control_update?{panel:"main",...fld_delete}:null),
                {panel:"main",...fld_edit},
                //{panel:"main",name:"cuenta",box:{tipe:0},select:"ACCOUNT_NAME"},
                {panel:"main",name:"abre/cierre",box:{tipe:0,options:op_account_state},select:"OPEN"},
                {panel:"main",name:"abre - fecha",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"DATE_EMMIT_OPEN"},
                //{panel:"main",name:"abre - hora",attributes:[{name:"style",value:"min-width: 100px;"}],box:{tipe:0},select:"HORA_OPEN"},
                {panel:"main",name:"abre - total",attributes:[{name:"style",value:"min-width: 200px;"}],box:bx_money,select:"TOTAL_OPEN"},
                {panel:"main",name:"cierre - fecha",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"DATE_EMMIT_CLOSE"},
                //{panel:"main",name:"cierre - hora",attributes:[{name:"style",value:"min-width: 100px;"}],box:{tipe:0},select:"HORA_CLOSE"},
                {panel:"main",name:"cierre - total",attributes:[{name:"style",value:"min-width: 200px;"}],box:bx_money,select:"TOTAL_CLOSE"},
              ],
              orders:[
                {field:"OPEN",asc:false},
                {field:"ID_CONTROL_ACCOUNT",asc:false},
              ],

              events:[
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({k,field,y})=>{

                      if(field.action == "edit"){

                        

                      }
                    }
                  }]
                },
              ]

              
            },
          },
          {
            name:"control-fm",
            active:true,
            script:{
              parent:prnt_control_fm,
              title:"control de caja",
              panels:[
                {col:6,y:0,title:"cuenta",head:true,tipe:"form"},
                {col:6,y:0,title:"control",head:true,tipe:"form"},
              ],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:1},
                        {name:"reload",show:true},
                        {name:"update",show:(acc_control_update_close || acc_control_update_open)},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],
              stateStart:"block",
              
              tableMain:"control_accounts",
              selects:[
                {table:"control_accounts",field:"ID_CONTROL_ACCOUNT",primary:true},
                {table:"control_accounts",field:"ID_ACCOUNT"},
                {table:"accounts",field:"NAME",as:"ACCOUNT_NAME"},
                {table:"accounts",field:"TOTAL",as:"ACCOUNT_TOTAL"},
                {table:"control_accounts",field:"OPEN"},

                {table:"control_accounts",field:"DATE_EMMIT_OPEN"},
                {table:"control_accounts",field:"TOTAL_OPEN"},

                {table:"control_accounts",field:"DATE_EMMIT_CLOSE"},
                {table:"control_accounts",field:"TOTAL_CLOSE"},
              ],
              joins:[
                {
                  main:{table:"control_accounts",field:"ID_ACCOUNT"},
                  join:{table:"accounts",field:"ID_ACCOUNT"},
                  tipe:"LEFT",
                }
              ],
              inserts:ins_general,   

              fields:[
                {panel:"cuenta",name:"cuenta",box:{tipe:0},select:"ACCOUNT_NAME"},
                {panel:"cuenta",name:"estado",box:((acc_control_update_close || acc_control_update_open) ?{tipe:6,name:"abierto"}:{tipe:0,options:op_account_state}),select:"OPEN"},
                {panel:"cuenta",name:"total actual",box:bx_money,select:"ACCOUNT_TOTAL"},

                {panel:"control",name:"fecha de apertura",box:(acc_control_update_open?{tipe:2}:{tipe:0}),select:"DATE_EMMIT_OPEN"},
                {panel:"control",name:"total de apertura",box:(acc_control_update_open?{tipe:1,value:0}:bx_money),select:"TOTAL_OPEN"},

                {panel:"control",name:"fecha de cierre",box:(acc_control_update_close?{tipe:2}:{tipe:0}),select:"DATE_EMMIT_CLOSE"},
                {panel:"control",name:"total de cierre",box:(acc_control_update_close?{tipe:1,value:0}:bx_money),select:"TOTAL_CLOSE"},
                {panel:"control",name:"close",tipe:0,box:{tipe:5,value:"cerrar",class:"btn btn-danger btn-sm"},action:"close"},
              ],

              events:[
                {
                  name:"reloadAfter",
                  actions:[{
                    action:({k})=>{

                      var data = k.Reload_GetData()[0];
                      account_id = data["ID_ACCOUNT"];
                      account_date_start = data["DATE_EMMIT_OPEN"];
                      account_date_end = data["DATE_EMMIT_CLOSE"];
                      account_total = parseFloat(data["TOTAL_OPEN"]);

                      //console.log(account_date_start, account_date_end);

                      var crud_pays = control.Crud_GetBuild({name:"pagos"});
                      crud_pays.SetState({stateName:"reload"});
                    }
                  }]
                }, 
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({k,field,y})=>{

                      if(field.action=="close"){

                        var account_total_current = k.Reload_GetData()[0]["ACCOUNT_TOTAL"];

                        var account_totals = control.Crud_GetBuild({name:"pagos"}).GetValues({fieldName:"total"});
                        var account_total_end =  account_totals[account_totals.length-1];
                        
                        console.log(account_total_current, account_total_end);
                        var account_des = account_total_current - account_total_end;

                        if(account_des.toFixed(0) != 0){

                          alert("hay un descuadre de: " + ("S/."+Math.abs(account_des).toFixed(2)));
                          return;
                        }

                        if(!confirm("esta por cerrar caja ¿esta segur@ de realizar esta accion?")) return;

                        
                        k.Loading_SetActive({active:true});
                        var conection = k.Conection_Get();
                        var closeSql = conection.GetSql_Update({
                          tableMain:"control_accounts",
                          sets:[
                            {field:"OPEN",value:"0"},
                            {field:"DATE_EMMIT_CLOSE",value:Date_Time_Today()},
                            //{field:"TOTAL_CLOSE",value:""},
                          ],
                          conditions:[
                            {
                              table:"control_accounts",
                              field:"ID_CONTROL_ACCOUNT",
                              inter:"=",
                              value:k.Reload_GetData()[0]["ID_CONTROL_ACCOUNT"],
                            }
                          ],
                        });
                        conection.Request({
                          php:"success",sql:closeSql,
                          success:()=>{

                            k.Loading_SetActive({active:false});
                            k.SetState({stateName:"reload"});
                            control.Crud_GetBuild({name:"account"}).SetState({stateName:"reload"});
                          }
                        })
                      }
                    }
                  }]
                },
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md1.SetActive({active});
                    }
                  }]
                }
              ]

            },
          },
          {
            name:"pagos",
            active:true,
            script:{
              parent:prnt_pays,
              title:"lista de pagos",
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:false},
                        {name:"update",show:false},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                },
              ],  
              stateStart:"block",
    
              tableMain:"payments",
              selects:[
                {table:'payments', field:'ID_PAY',primary:true},
                {table:'payments', field:'DATE_EMMIT'},
                {table:'payments', field:'TOTAL'},
                {table:'payments', field:'ID_ACCOUNT'},
                {table:'payments', field:'ID_PAY_TAG'},
                {table:'payments',field:'INCOME'},
                {table:'accounts', field:'NAME', as:"ACCOUNT_NAME"},
                {table:'accounts', field:'TOTAL', as:"ACCOUNT_TOTAL"},
                {table:'pay_tag', field:'NAME', as:"TAG_NAME"},
              ],
              joins:[
                {main:{table:"payments",field:"ID_PAY_TAG"},join:{table:"pay_tag",field:"ID_PAY_TAG"},tipe:"LEFT"},
                {main:{table:"payments",field:"ID_ACCOUNT"},join:{table:"accounts",field:"ID_ACCOUNT"},tipe:"LEFT"},
              ],
              orders:[
                {field:"DATE_EMMIT",asc:true},
                {field:"ID_PAY",asc:true},
              ],
              
  
              fields:[
                //{panel:"main",...fld_delete},
                //{panel:"main",...fld_edit},
                //{panel:"main",name:"id",box:bx_shw,select:"ID_PAY"},
                {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"fecha de emision",box:bx_shw,select:"DATE_EMMIT"},
                {panel:"main",name:"ingreso",box:{tipe:0},select:"INCOME_CAL"},
                {panel:"main",name:"egreso",box:{tipe:0},select:"NOCOME_CAL"},
                {panel:"main",name:"total",box:bx_money,select:"TOTAL_CAL"},
                {panel:"main",name:"etiqueta",box:{tipe:0},select:"TAG_NAME"},
                //{panel:"main",name:"cuenta",box:bx_shw,select:"ACCOUNT_NAME"},
                //{panel:"main",name:"ingreso",box:{...bx_shw,options:[{value:0,show:"egreso"},{value:1,show:"ingreso"}]},select:"INCOME"},
              ],
    
              events:[
                {
                  name:"printBefore",
                  actions:[{
                    action:({result})=>{

                      result.forEach(line => {
                        
                        line["DATE_EMMIT"] += " " + (line["HORA"] ? line["HORA"]: "");
                      });

                      var total_start = account_total;
                      var total_cal = total_start;
                      
                      console.log("start total count:", total_cal);
    
                      result.forEach(line => {
                        
                        var income = parseInt(line["INCOME"]) == "1";
                        var add = parseFloat(line["TOTAL"]);
                        var add_cal = add * (income ? 1 :-1);
                        total_cal += add_cal;

                        console.log("income:",income,"add:",add, "total_cal:",total_cal, "add_cal:",add_cal);

                        line["INCOME_CAL"] = (income ? add_cal : "-");
                        line["NOCOME_CAL"] = (!income ? add_cal : "-");
                        line["TOTAL_CAL"] = total_cal;

                      });

                      result.unshift({
                        DATE_EMMIT:account_date_start,
                        INCOME_CAL:"-",
                        NOCOME_CAL:"-",
                        TOTAL_CAL:total_start,
                        TAG_NAME:"incio",
                      });

                      result.push({
                        DATE_EMMIT:account_date_end,
                        INCOME_CAL:"-",
                        NOCOME_CAL:"-",
                        TOTAL_CAL:total_cal,
                        TAG_NAME:"cerrar",
                      });

                      console.log(result);
    
                      return {data:result};
                    }
                  }]
                },
                {
                  name:"calculateTotal",
                  actions:[{
                    action:({k})=>{
    
                      var data = k.GetValues({fieldName:"total"});
                      var ingreso = 0;
                      var egreso = 0;
                      data.forEach(value => {
                        
                        if(value > 0) ingreso += value;
                        else egreso += value;
                      });
                      var total = ingreso + egreso;
    
                      //gr.GetColData({x:1,y:0}).boxs[0].SetValue(total);
                      //gr.GetColData({x:1,y:1}).boxs[0].SetValue(ingreso);
                      //gr.GetColData({x:1,y:2}).boxs[0].SetValue(egreso);
                    }
                  }]
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{
    
                      k.CallEvent({name:"calculateTotal"});
                    }
                  }],
                },
                {
                  name:"reloadConditionsAfter",
                  actions:[{
                    action:({conditions=[]})=>{

                      conditions.push({
                        table:"payments",
                        field:"ID_ACCOUNT",
                        inter:"=",
                        value:account_id,
                      });

                      conditions.push({
                        before:" AND ",
                        table:"payments",
                        field:"DATE_EMMIT",
                        inter:">=",
                        value:account_date_start,
                      });

                      
                      if(account_date_end!=""&&account_date_end!=null){

                        conditions.push({
                          before:" AND ",
                          table:"payments",
                          field:"DATE_EMMIT",
                          inter:"<=",
                          value:account_date_end,
                        });
                      }

                      return {conditions};
                    }
                  }]
                }
              ],
            },
          },
          {
            name:"pay",
            active:true,
            script:{
              parent:prnt_pay,
              ...scr_pay({
                events:[
                  {
                    name:"newAfter",
                    actions:[{
                      action:({k})=>{

                        k.CallEvent({name:"modalSetActive",params:{active:true}});
                      }
                    }],
                  },
                  {
                    name:"blockAfter",
                    actions:[{
                      action:({k})=>{

                        k.CallEvent({name:"modalSetActive",params:{active:false}});
                      }
                    }],
                  },
                  {
                    name:"modalSetActive",
                    actions:[{
                      action:({active})=>{

                        md2.SetActive({active});
                      }
                    }]
                  }
                ]
              }),
            }
          }
        ],
    
        conections:[
          {
            tipe:"fm-tb",
            master:"account",
            masterField:"ID_ACCOUNT",
            maid:"control",
            maidField:"ID_ACCOUNT",
          },
          {
            tipe:"tb-fm",
            master:"control",
            masterField:"ID_CONTROL_ACCOUNT",
            maid:"control-fm",
            maidField:"ID_CONTROL_ACCOUNT",
          },
        ],
      });

      function AccountChangeState({}) {
        
        var crAccount = control.Crud_GetBuild({name:"account"});
        var crControl = control.Crud_GetBuild({name:"control"});
        var conection = crAccount.Conection_Get();
        crAccount.SetState({stateName:"reload"});
        var data = crAccount.Reload_GetData()[0];

        var account_id = data["ID_ACCOUNT"];
        var account_state = data["OPEN"];
        var account_total = data["TOTAL"];

        var setOpen = account_state == "0";

        var resquestSql = "";

        if(account_state == "1"){

          alert("no se puede abrir una cuenta abierta");
          return;
        } 

        if(setOpen){

          resquestSql = conection.GetSql_Insert({
            tableMain:"control_accounts",
            inserts:[
              {field:"OPEN",value:"1"},
              {field:"ID_ACCOUNT",value:account_id},
              {field:"DATE_EMMIT_OPEN",value:Date_Time_Today()},
              //{field:"TOTAL_OPEN",value:account_total},
              //{field:""},
            ],
          });

        }

        console.log("resquestSql:",resquestSql);
        
        conection.Request({
          php:"success",sql:resquestSql,
          success:(resp)=>{

            crControl.SetState({stateName:"reload"});
          }
        });

        
        

      }

    }
  });
  

});
