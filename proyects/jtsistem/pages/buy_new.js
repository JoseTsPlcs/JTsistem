
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

        new CrudsGroup({
          userData,parent:pageData.body,
          layers:[
            {
              grid:{
                items:[
                  {name:"prnt-buy"},
                  {name:"prnt-pay-md"},
                  {name:"prnt-provideer-md"},
                ],
              }
            },
            {modal:{parent:"prnt-pay-md",name:"md-pay"}},
            {modal:{parent:"prnt-provideer-md",name:"md-provideer"}},
            //-----buy-----
            {
              crud:{
                parent:"prnt-buy",name:"cr-buy",
                title:"compra",schema:sch_buys,
                panels:[
                  {
                    tipe:"form",title:"informacion general",col:4,
                    fieldsSet:[
                      {value:"date",state:"edit"},
                      {value:"state",state:"edit"},
                      {value:"provideer",state:"edit"},
                    ],
                  },
                  {
                    tipe:"form",head:false,col:8,
                    fieldsSet:[
                      {action:"div",name:"prnt-buy-stps"},
                    ],
                  },
                  {
                    tipe:"form",title:"total",
                    fieldsSet:[
                      {value:"total",state:"show",showBox:bx_moneyh1},
                    ],
                  },
                ],
              }
            },
            {
              steps:{
                parent:"prnt-buy-stps",
                items:[
                  {name:"stp-products",title:"items"},
                  {name:"stp-pays",title:"pagos"},
                ],
              }
            },
            //----provideer-----
            {
              crud:{
                parent:"md-provideer",title:"proveedor",
                schema:sch_provideers,name:"cr-provideer",
                panels:[
                  {
                    tipe:"form",head:false,
                    fieldsSet:[
                      {value:"name",state:"edit"},
                      {value:"ruc",state:"edit"},
                    ]
                  }
                ]
              }
            },
            //----products------
            {
              crud:{
                parent:"stp-products",name:"cr-buy-products",
                title:"lista de compras",schema:sch_buys_products,
                panels:[
                  {
                    tipe:"table",h:600,
                    fieldsSet:[
                      {value:"item",state:"edit"},
                      {value:"cant",state:"edit"},
                      {value:"costUnit",state:"edit"},
                      {value:"costTotal",state:"edit"},
                    ],
                  }
                ],
              }
            },
            //-----pays------
            {
              crud:{
                parent:"stp-pays",name:"cr-buy-pays",h:0,
                title:"lista de pagos",schema:sch_buys_payments,
                selects:[
                  {table:sch_buys_payments.table,field:"ID_PAY"},
                  {table:sch_pays.table,field:"TOTAL"},
                  {table:sch_accounts.table,field:"NAME"},
                  {table:shc_pay_tag.table,field:"NAME",as:"TAGNAME"},
                  {table:sch_pays.table,field:"INCOME"},
                ],
                joins:[
                  {
                    main:{table:sch_buys_payments.table,field:"ID_PAY"},
                    join:{table:sch_pays.table,field:"ID_PAY"},
                    tipe:"LEFT",
                  },
                  {
                    main:{table:sch_pays.table,field:"ID_ACCOUNT"},
                    join:{table:sch_accounts.table,field:"ID_ACCOUNT"},
                    tipe:"LEFT",
                  },
                  {
                    main:{table:sch_pays.table,field:shc_pay_tag.fieldPrimary},
                    join:{table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary},
                    tipe:"LEFT",
                  }
                ],
                panels:[
                  {
                    tipe:"table",head:false,
                    fields:[
                      {name:"total",box:{...bx_money},select:"TOTAL",attributes:[{name:"style",value:"min-width:100px"}]},
                      {name:"cuenta",box:{...bx_shw},select:"NAME",attributes:[{name:"style",value:"min-width:150px"}]},
                      {name:"etiqueta",box:{...bx_shw},select:"TAGNAME"},
                      {name:"ingreso",box:{...bx_shw,options:[{value:0,show:"egreso"},{value:1,show:"ingreso"}]},select:"INCOME"},
                    ],
                    fieldsSet:[
                      //{value:"idBuy",state:"show"},
                      //{value:"idPay",state:"show"},
                    ],
                  }
                ],
              }
            },
            {
              crud:{
                parent:"md-pay",name:"cr-buy-pay",
                title:"pago",schema:sch_pays,
                panels:[
                  {
                    tipe:"form",head:false,
                    fieldsSet:[
                      {value:"date",state:"edit"},
                      {
                        value:"account",state:"edit",
                        load:{
                          name:"ld-accounts",
                          tableMain:sch_accounts.table,
                          selects:[
                            {table:sch_accounts.table,field:sch_accounts.fieldPrimary,as:"value"},
                            {table:sch_accounts.table,field:"NAME",as:"show"},
                            {table:sch_accounts.table,field:"CONTROL_BY_OPEN",as:"control"},
                            {table:sch_accounts.table,field:"OPEN",as:"open"},
                          ],
                        }
                      },
                      {value:"total",state:"edit"},
                      {
                        value:"tag",state:"show",
                        load:{
                          name:"ld-tags",
                          tableMain:shc_pay_tag.table,
                          selects:[
                              {table:shc_pay_tag.table,field:shc_pay_tag.fieldPrimary,as:"value"},
                              {table:shc_pay_tag.table,field:"NAME",as:"show"},
                              {table:shc_pay_tag.table,field:"INCOME",as:"income"},
                          ],
                        },
                      },
                      {value:"income",state:"show"},
                    ],
                  }
                ],
                events:[
                  {
                    name:"insertBefore",
                    actions:[{
                      action:({k,inserts})=>{

                        var accountLoadInfo = k.Loaded_GetLoadData({loadName:"ld-accounts"});
                        var accountID = k.bodyGet().fieldGetValues({fieldName:"cuenta"})[0];
                        var accountInfo = accountLoadInfo.result.find(rst=>rst["value"] == accountID);
                        
                        var block = accountInfo.control == "1" && accountInfo.open == "0"; 
                        if(block) alert('no se puede usar la cuenta ' + accountInfo.show + ' sin abrirla antes');

                        var tagID = k.bodyGet().fieldGetValues({fieldName:"etiqueta"})[0];
                        var incomeID = k.bodyGet().fieldGetValues({fieldName:"ingreso/egreso"})[0];

                        inserts = [
                          {field:"ID_PAY_TAG",value:tagID,tipe:"value"},
                          {field:"INCOME",value:incomeID,tipe:"value"},
                        ];

                        return {block,inserts};
                      }
                    }],
                  },
                  {
                    name:"newAfter",
                    actions:[{
                      action:({k})=>{
                        
                        var tagLoadInfo = k.Loaded_GetLoadData({loadName:"ld-tags"});
                        var tagInfo = tagLoadInfo.result.find(rst=>rst["show"] == "COMPRA DE INSUMOS");
                        k.bodyGet().fieldSetValues({fieldName:"etiqueta",values:[tagInfo.value]});
                        k.bodyGet().fieldSetValues({fieldName:"ingreso/egreso",values:[tagInfo.income]});
                      }
                    }]
                  }
                ],
              }
            }
          ],
          conections:[
            {
              masterName:"cr-buy",
              masterSelect:"ID_BUY",
              event:"list",
              maidName:"cr-buy-products",
              maidSelect:"ID_BUY",
            },
            {
              masterName:"cr-buy",
              masterSelect:"ID_BUY",
              event:"list",
              maidName:"cr-buy-pays",
              maidSelect:"ID_BUY",
            },
            {
              masterName:"cr-buy-pays",
              masterSelect:"ID_PAY",
              event:"tableForm",
              maidName:"cr-buy-pay",
              maidSelect:"ID_PAY",
            },
            {
              masterName:"cr-buy",
              masterSelect:"ID_BUY",
              event:"search",searchValue:"id_buy",
            },
            {
              masterName:"cr-buy",
              masterFieldValue:"total",
              event:"sum",
              maidName:"cr-buy-products",
              maidFieldValue:"costTotal",
            },
            {
              event:"formForm",
              masterName:"cr-buy",
              masterFieldValue:"provideer",
              maidName:"cr-provideer",
              maidSelect:"ID_PROVIDEER",
            }
          ],
          //test:true,
        });

    }
  });
  

});
