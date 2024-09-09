
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var group = new CrudsGroup({
        userData,parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-control",col:12},
                {name:"prnt-control-md",col:12},
              ],
            },
          },
          {
            crud:{
              parent:"prnt-control",name:"cr-control-tb",
              title:"lista de control de caja",schema:sch_control_accounts,
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"status"},
                    {value:"account"},
                    {value:"open_emmit"},
                    {value:"open_total"},
                    {value:"close_emmit"},
                    {value:"close_total"},
                  ]
                }
              ]
            }
          },
          {modal:{parent:"prnt-control-md",name:"md-control",size:"xl"}},
          {
            crud:{
              parent:"md-control",name:"cr-control-fm",
              title:"control de caja",schema:sch_control_accounts,
              panels:[
                {
                  tipe:"form",title:"apertura de caja",
                  fieldsSet:[
                    {value:"account",state:"edit"},
                    {value:"status",state:"edit"},
                    {value:"open_emmit",state:"edit"},
                    {value:"open_total",state:"edit"},
                  ]
                },
                {
                  tipe:"form",title:"lista de ingresos/egresos",head:false,
                  fieldsSet:[
                    {action:"div",name:"prnt-pays"},
                  ],
                },
                {
                  tipe:"form",title:"cierre de caja",
                  fieldsSet:[
                    {value:"close_emmit",state:"edit"},
                    {value:"close_total",state:"edit"},
                  ]
                }
              ],
              events:[
                {
                  name:"reloadAfter",
                  actions:[{
                    action:()=>{

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
              ],
            }
          },
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
                        var account_id = cr_control_fm.bodyGet().fieldGetValues({fieldName:"account"})[0];

                        console.log("GET FIELD ACCOUNT",account_id,"OPEN EMMIT",open_date);

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
                    {name:"reload",show:true},
                    {name:"new",show:false},
                    {name:"sizes",value:10,show:false},
                  ],
                }
              ],
            }
          }
        ],
        conections:[
          {
            masterName:"cr-control-tb",
            masterSelect:"ID_CONTROL_ACCOUNT",
            event:"tableForm",
            maidName:"cr-control-fm",
            maidSelect:"ID_CONTROL_ACCOUNT",
          },
        ]
      });

    }
  });
  

});
