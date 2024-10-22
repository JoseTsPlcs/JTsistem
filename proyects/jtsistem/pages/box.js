
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var group = new CrudsGroup({
        userData,parent:pageData.body,test:false,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-account",col:4},
                {name:"prnt-control",col:8},
                {name:"prnt-control-md",col:12},
                {name:"prnt-pay-md",col:12},
              ],
            },
          },
          {
            crud:{
              parent:"prnt-account",title:"caja",
              name:"cr-account",schema:sch_accounts,
              config:{
                show:true,head:false,
                toolsPositions:[
                  {name:"reload",show:false},
                  {name:"clear",show:false},
                  {name:"quest",show:false},
                ],
              },
              panels:[{
                tipe:"form",head:false,
                fields:[
                  //{name:"box-modif",action:"modif",box:{tipe:5,class:"w-100 btn btn-primary m-1 btn",value:"MODIFICAR CAJA"}},
                ],
                fieldsSet:[
                  {position:"first",value:"open"},
                  {position:"first",value:"total",showBox:{...bx_moneyh1}},
                  {position:"first",value:"name"},
                ],
              }],
              loads:[
                {
                  name:"ld-boxs",
                  tableMain:sch_accounts.table,
                  selects:[
                    {table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"value"},
                    {table:sch_accounts.table,field:"NAME",as:"show"},
                  ],
                  conditions:[
                    {
                      table:sch_accounts.table,
                      field:"CONTROL_BY_OPEN",
                      inter:"=",
                      value:1
                    },
                    {
                      before:" AND ",
                      table:sch_accounts.table,
                      field:"ID_COMPANY",
                      inter:"=",
                      value:userData.company.id,
                    }
                  ],
                },
              ],
              filters:[
                {name:"boxs",title:"cuenta",box:{tipe:3,class:"w-100"},load:{name:"ld-boxs",show:"show"},select:{table:sch_accounts.table,field:"ID_ACCOUNT"}}
              ],
              stateTools:[
                {
                  name:"reload",
                  tools:[
                    {name:"reload",show:true},
                    {name:"new",show:false},
                    {name:"quest",show:false},
                    {name:"load",show:false},
                    {name:"config",show:false},
                  ],
                }
              ],
              events:[
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({k,field})=>{

                      if(field.action == "modif"){
                        
                        group.crudGetBuild({crudName:"cr-pay"}).SetState({stateName:"new"});
                      }
                    }
                  }]
                },
              ],
            }
          },
          //-----control------
          {
            crud:{
              parent:"prnt-control",name:"cr-control-tb",
              title:"lista de control de caja",schema:sch_control_accounts,
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"status"},
                    //{value:"account"},
                    {value:"open_emmit"},
                    {value:"open_total"},
                    {value:"close_emmit"},
                    {value:"close_total"},
                    {value:"comment",state:"edit"},
                  ]
                }
              ],
              stateStart:"reload",
              stateTools:[
                {
                  name:"reload",
                  tools:[
                    {name:"reload",show:false},
                    {name:"config",show:false},
                    {name:"load",show:false},
                    {name:"insert",show:true},
                    {name:"sizes",show:false,value:10},
                  ]
                },
                {
                  name:"block",
                  tools:[
                    {name:"load",show:false},
                  ]
                }
              ],
              inserts:[
                {
                  field:"OPEN",tipe:"values",
                  value:"1",
                }
              ],
              events:[
                {
                  name:"insertAfter",
                  actions:[{
                    action:()=>{
  
                      var crudAccount = group.crudGetBuild({crudName:"cr-account"});
                      crudAccount.bodyGet().fieldSetValues({fieldName:"open",values:[1]});
                    }
                  }]
                },
                {
                  name:"insertBefore",
                  actions:[{
                    action:()=>{

                      var crudAccount = group.crudGetBuild({crudName:"cr-account"});
                      var open = crudAccount.bodyGet().fieldGetValues({fieldName:"open"})[0] == "1";

                      if(open) alert("no se puede abrir una caja que ya esta abierta");

                      return {block:open};
                    }
                  }]
                }
              ],
              orders:[
                {
                  table:sch_control_accounts.table,
                  field:"DATE_EMMIT_OPEN",asc:false,
                }
              ],
            }
          },
          {modal:{parent:"prnt-control-md",name:"md-control",size:"xl"}},
          //control form
          {
            crud:{
              parent:"md-control",name:"cr-control-fm",
              title:"control de caja",schema:sch_control_accounts,
              panels:[
                {
                  tipe:"form",title:"informacion",col:12,
                  fieldsSet:[
                    {value:"account",state:"show"},
                    {value:"status",state:"show"},
                    {value:"comment",state:"edit"},
                  ]
                },
                {
                  tipe:"form",title:"apertura de caja",col:6,
                  fieldsSet:[
                    {value:"open_emmit",state:"show"},
                    {value:"open_total",state:"show"},
                  ]
                },
                {
                  tipe:"form",title:"cierre de caja",col:6,
                  fieldsSet:[
                    {value:"close_emmit",state:"show"},
                    {value:"close_total",state:"show"},
                  ]
                },
                {
                  tipe:"form",title:"lista de ingresos/egresos",head:false,
                  fieldsSet:[
                    {action:"div",name:"prnt-pays"},
                  ],
                },
                {
                  tipe:"form",head:false,name:"actions",
                  fieldsSet:[
                    {action:"button",name:"close",value:"CERRAR CAJA",class:"w-100 btn btn-danger m-1 btn"},
                    {action:"button",name:"modif",value:"MODIFICAR CAJA",class:"w-100 btn btn-primary m-1 btn"},
                  ],
                }
              ],
              events:[
                {
                  name:"reloadAfter",
                  actions:[{
                    action:({k})=>{

                      var cr_pays = group.crudGetBuild({crudName:"cr-pays"});
                      cr_pays.SetState({stateName:"reload"});
                      
                    }
                  }]
                },
                {
                  name:"newAfter",
                  actions:[{
                    action:()=>{

                      var cr_pays = group.crudGetBuild({crudName:"cr-pays"});
                      cr_pays.SetState({stateName:"block"});
                    }
                  }]
                },
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({field,k})=>{

                      if(field.name == "close"){

                        k.Update_AddChangeField({
                          fieldName:"status",
                          value:0,
                          y:0,
                        });
                        k.Update({success:()=>{

                          k.SetState({stateName:"block"});
                          group.crudGetBuild({crudName:"cr-account"}).SetState({stateName:"reload"});
                        }});
                      }

                      if(field.name=="modif"){

                        group.crudGetBuild({crudName:"cr-pay"}).SetState({stateName:"new"});
                      }
                    }
                  }]
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{

                      var body = k.bodyGet();
                      var open = body.fieldGetValues({fieldName:"status"})[0] == 1;                      
                      var panelActions = body.panelGet({panelName:"actions"}).build.buildGet();
                      panelActions.Conteiner_Show({show:open,slow:false,ignoreBlock:true});
                    }
                  }]
                },
                {
                  name:"updateAfter",
                  actions:[{
                    action:()=>{

                      group.crudGetBuild({crudName:"cr-account"}).SetState({stateName:"reload"});
                    }
                  }]
                }
              ],
              afterCancel:"block",
              afterUpdate:"block",
              stateTools:[
                {
                  name:"reload",
                  tools:[
                    {name:"cancel",show:true},
                    {name:"update",show:true},
                  ],
                }
              ],
            }
          },
          //----lista de pagos de control
          {
            crud:{
              parent:"prnt-pays",name:"cr-pays",
              title:"lista de ingresos/egresos",
              tableMain:sch_pays.table,
              selects:[
                {table:sch_pays.table,field:sch_pays.fieldPrimary,primary:true},
                //{table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"ACCOUNT_ID"},
                //{table:sch_accounts.table,field:"NAME",as:"ACCOUNT"},
                {table:sch_pays.table,field:"DATE_EMMIT"},
                {table:sch_pays.table,field:"TOTAL"},
                {table:sch_pays.table,field:"INCOME"},
                {table:shc_pay_tag.table,field:"NAME",as:"TAG"},
              ],
              joins:[
                {
                  main:{table:sch_pays.table,field:sch_accounts.fieldPrimary},
                  join:{table:sch_accounts.table,field:sch_accounts.fieldPrimary},
                  tipe:"LEFT",
                },
                {
                  main:{table:sch_pays.table,field:shc_pay_tag.fieldPrimary},
                  join:{table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary},
                  tipe:"LEFT",
                },
              ],
              events:[
                {
                  name:"reloadConditionsAfter",
                  actions:[{
                    action:({conditions=[]})=>{

                      if(group){

                        var cr_control_fm = group.crudGetBuild({crudName:"cr-control-fm"});
                        var open_date = cr_control_fm.bodyGet().fieldGetValues({fieldName:"open_emmit"})[0];
                        var close_date = cr_control_fm.bodyGet().fieldGetValues({fieldName:"close_emmit"})[0];
                        var account_id = cr_control_fm.bodyGet().fieldGetValues({fieldName:"account"})[0];

                        conditions.push({
                          table:sch_pays.table,
                          field:sch_accounts.fieldPrimary,
                          inter:"=",
                          value:account_id,
                        });

                        if(open_date != ""){

                          conditions.push({
                            before:" AND ",
                            table:"payments",
                            field:"DATE_EMMIT",
                            inter:">=",
                            value:open_date,
                          });
                        }

                        if(close_date != "" && close_date != null){

                          conditions.push({
                            before:" AND ",
                            table:"payments",
                            field:"DATE_EMMIT",
                            inter:"<=",
                            value:close_date,
                          });
                        }
                      }

                      return {conditions};
                    }
                  }]
                },
                {
                  name:"printBefore",
                  actions:[{
                    action:({result})=>{

                      var cr_control_fm = group.crudGetBuild({crudName:"cr-control-fm"});
                      var openDate = cr_control_fm.bodyGet().fieldGetValues({fieldName:"open_emmit"})[0];
                      var totalCurrent = cr_control_fm.bodyGet().fieldGetValues({fieldName:"open_total"})[0];
                      totalCurrent = parseFloat(totalCurrent);

                      var closeDate = "";

                      result.unshift({
                        DATE_EMMIT:openDate,
                        INCOME_TOT:0,
                        EGRESO_TOT:0,
                        SALDO:totalCurrent,
                        TAG:"ABRIO CAJA",
                        DESCRIPCION:"",
                      });

                      for (let rst = 1; rst < result.length; rst++) {
                        
                        var values = result[rst];
                        var total = parseFloat(values["TOTAL"]);
                        var income = values["INCOME"] == "1";
                        total = (income ? 1 : -1 ) * total;

                        values["INCOME_TOT"] = income ? total : 0;
                        values["EGRESO_TOT"] = !income ? total : 0;

                        totalCurrent += total;
                        values["SALDO"] = totalCurrent;

                      }

                      result.push({
                        DATE_EMMIT:closeDate,
                        INCOME_TOT:0,
                        EGRESO_TOT:0,
                        SALDO:totalCurrent,
                        TAG:"CERRAR CAJA",
                        DESCRIPCION:"",
                      });

                      return {data:result};
                    }
                  }]
                },
              ],
              panels:[{
                tipe:"table",
                fields:[
                  //{name:"cuenta id",select:"ACCOUNT_ID",box:{...bx_shw}},
                  //{name:"cuenta",select:"ACCOUNT",box:{...bx_shw}},
                  {name:"fecha",select:"DATE_EMMIT",box:{...bx_shw}},
                  {name:"ingeso",select:"INCOME_TOT",box:{...bx_income}},
                  {name:"egreso",select:"EGRESO_TOT",box:{...bx_income}},
                  {name:"saldo",select:"SALDO",box:{...bx_saldo}},
                  {name:"etiqueta",select:"TAG",box:{...bx_shw}},
                  //{name:"descripcion",box:{...bx_shw}},
                ],
              }],
              stateStart:"block",
              stateTools:[
                {
                  name:"reload",
                  tools:[
                    {name:"reload",show:false},
                    {name:"new",show:false},
                    {name:"sizes",value:10,show:false},
                  ],
                }
              ],
            }
          },
          //-----pay--------
          {modal:{parent:"prnt-pay-md",name:"md-pay"}},
          {
            crud:{
              name:"cr-pay",title:"transaccion",
              schema:sch_pays,parent:"md-pay",
              panels:[{
                tipe:"form",head:false,
                fieldsSet:[
                  {value:"date"},
                  {value:"account"},
                  {value:"tag",state:"edit"},
                  {value:"total",state:"edit"},
                  {value:"income"},
                ],
              }],
              stateTools:[
                {
                  name:"new",
                  tools:[
                    {name:"load",show:false},
                    {name:"cancel",show:true},
                    {name:"insert",show:true},
                  ],
                }
              ],
              loads:[
                {
                  name:"ld-tag",
                  tableMain:shc_pay_tag.table,
                  selects:[
                      {table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary,as:"value"},
                      {table:shc_pay_tag.table,field:"NAME",as:"show"},
                      {table:shc_pay_tag.table,field:"INCOME",as:"income"},
                  ],
                  conditions:[
                    {
                      before:" ( ",
                      table:shc_pay_tag.table,
                      field:"NAME",
                      inter:"=",
                      value:"RETIRO DE CAJA",
                    },
                    {
                      before:" OR ",
                      table:shc_pay_tag.table,
                      field:"NAME",
                      inter:"=",
                      value:"INGRESO DE CAJA",
                      after:" ) "
                    },
                  ],
                },
              ],
              stateStart:"block",
              afterCancel:"block",
              afterInsert:"block",
              events:[
                {
                  name:"filterIncome",
                  actions:[{
                    action:({k})=>{

                      var tagId = k.bodyGet().fieldGetValues({fieldName:"tag"})[0];
                      var loadResult = k.Loaded_GetLoadData({loadName:"ld-tag"}).result;
                      var tagInfo = loadResult.find(rst=>rst.value == tagId);
                      var tagIncome = tagInfo.income == "1" ? 1 : 0;

                      k.bodyGet().fieldSetValues({fieldName:"income",values:[tagIncome]});
                      k.Update_AddChangeField({
                        fieldName:"income",
                        value:tagIncome,
                        y:0,
                      });

                    }
                  }],
                },
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({field,k})=>{

                      if(field.name == "tag") k.CallEvent({name:"filterIncome"});
                    }
                  }]
                },
                {
                  name:"newAfter",
                  actions:[{
                    action:({k})=>{

                      k.CallEvent({name:"filterIncome"});
                    }
                  }]
                },
                {
                  name:"insertBefore",
                  actions:[{
                    action:({k},inserts=[])=>{

                      k.bodyGet().fieldsGet().forEach(field => {
                        
                        if(field.box.tipe == 0 && field.name != "date"){

                          var income = k.bodyGet().fieldGetValues({fieldName:field.name})[0];
                          inserts.push({
                            table:sch_pays.table,
                            field:field.select,tipe:"values",
                            value:income,
                          });
                        }
                      });                     

                      return {inserts}
                    }
                  }]
                },
                {
                  name:"insertAfter",
                  actions:[{
                    action:()=>{

                      group.crudGetBuild({crudName:"cr-control-fm"}).SetState({stateName:"reload"});
                    }
                  }]
                }
              ],
            }
          }
        ],
        conections:[
          {
            masterName:"cr-account",
            masterSelect:"ID_ACCOUNT",
            event:"cnx",type:"show",
            maidName:"cr-control-tb",
            maidSelect:"ID_ACCOUNT",
            maidMasterReload:true,
          },
          {
            masterName:"cr-control-tb",
            masterSelect:"ID_CONTROL_ACCOUNT",
            masterAction:"edit",
            event:"cnx",
            maidName:"cr-control-fm",
            maidSelect:"ID_CONTROL_ACCOUNT",
          },
        ]
      });

    }
  });
  

});
