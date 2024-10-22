
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{


      concepBuildPage({userData,pageData});

      return;

      var group = new CrudsGroup({
        pageData,
        userData,
        parent:pageData.body,
        test:false,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-control",col:12},
                {name:"prnt-control-md",col:12},
                {name:"prnt-pay-md",col:12},
              ],
            },
          },
          //-----control------
          {
            crud:{
              parent:"prnt-control",name:"cr-boxs",recordName:"control de caja",
              title:"lista de control de caja",schema:sch_control_accounts,
              insertToEnd:false,
              config:{show:true},
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"account",filter:{type:"unique"},minWidth:120},
                    {value:"status"},
                    {value:"open_emmit"},
                    {value:"open_total"},
                    {value:"close_emmit"},
                    {value:"close_total"},
                    {value:"comment",state:"edit"},
                  ]
                }
              ],
              stateStart:"reload",
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"insert",show:true},
                    {name:"sizes",show:true,value:10},
                    {name:"pages",show:true},
                    {name:"reload",show:true},
                    {name:"tutorial",show:true},
                  ]
                },
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
  
                      //var crudAccount = group.crudGetBuild({crudName:"cr-account"});
                      //crudAccount.bodyGet().fieldSetValues({fieldName:"open",values:[1]});
                    }
                  }]
                },
                {
                  name:"insertBefore",
                  actions:[{
                    action:({inserts})=>{

                      //var crudAccount = group.crudGetBuild({crudName:"cr-account"});
                      //var open = crudAccount.bodyGet().fieldGetValues({fieldName:"open"})[0] == "1";

                      //if(open) alert("no se puede abrir una caja que ya esta abierta");

                      //var inserts = [{field:"OPEN",value:1}];

                      inserts = [{
                        field:"ID_ACCOUNT",
                        value:AccountGetId(),
                      }]

                      return {block:open,inserts};
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
              parent:"md-control",name:"cr-control-fm",recordName:"control de caja",
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
                    {action:"button",name:"close",title:"cerrar caja",value:"CERRAR CAJA",class:"w-100 btn btn-danger m-1 btn",descripcion:"una vez cerrada la caja, no se puede modificar ingresos/egresos"},
                    {action:"button",name:"modif",title:"modificar saldo",value:"MODIFICAR SALDO",class:"w-100 btn btn-primary m-1 btn",descripcion:"ingresar/retirar saldo de caja"},
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
                          //group.crudGetBuild({crudName:"cr-account"}).SetState({stateName:"reload"});
                        }});
                      }

                      if(field.name=="modif"){

                        var crud_pay = group.crudGetBuild({crudName:"cr-pay"}); 
                        crud_pay.SetState({stateName:"new"});
                        crud_pay.bodyGet().fieldSetValues({fieldName:"account",values:[AccountGetId()]});
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

                      group.crudGetBuild({crudName:"cr-boxs"}).SetState({stateName:"reload"});
                    }
                  }]
                }
              ],
              afterCancel:"block",
              afterUpdate:"block",
              states:[
                {
                  name:"reload",
                  tools:[
                    //{name:"load",show:true},
                    {name:"tutorial",show:true},
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
              states:[
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
              name:"cr-pay",title:"transaccion",recordName:"transaccion",
              schema:sch_pays,parent:"md-pay",
              panels:[{
                tipe:"form",head:false,
                fieldsSet:[
                  {value:"date"},
                  {value:"account",state:"show"},
                  {value:"tag",state:"edit"},
                  {value:"total",state:"edit"},
                  {value:"income"},
                ],
              }],
              states:[
                {
                  name:"new",
                  tools:[
                    {name:"tutorial",show:true},
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
                    {
                      before:" AND ",
                      table:shc_pay_tag.table,
                      field:"ID_COMPANY",
                      inter:"=",
                      value:userData.company.id,
                    },
                  ],
                },
                {
                  name:"ld-account",
                  tableMain:sch_accounts.table,
                  selects:[
                      {table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"value"},
                      {table:sch_accounts.table,field:"NAME",as:"show"},
                  ],
                  conditions:[
                    {
                      table:sch_accounts.table,
                      field:"ID_COMPANY",
                      inter:"=",
                      value:userData.company.id,
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
                      if(tagInfo){

                        var tagIncome = tagInfo.income == "1" ? 1 : 0;
                        k.bodyGet().fieldSetValues({fieldName:"income",values:[tagIncome]});
                        k.Update_AddChangeField({
                          fieldName:"income",
                          value:tagIncome,
                          y:0,
                        });
                      }                     

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
            masterName:"cr-boxs",
            masterSelect:"ID_CONTROL_ACCOUNT",
            masterAction:"edit",
            event:"cnx",
            maidName:"cr-control-fm",
            maidSelect:"ID_CONTROL_ACCOUNT",
          },
        ],
      });

      function AccountGetId(){

        return group.crudGetBuild({crudName:"cr-boxs"}).bodyGet().configGetWindowFilters().Filter_GetBox({filterName:"cuenta"}).GetValue();
      }

      PlayTutorialInPage({group,pageData});
    }
  });
  

});
