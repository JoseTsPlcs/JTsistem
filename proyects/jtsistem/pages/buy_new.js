
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      new BuildPage({
        type:"new",
        schema:sch_buys,
        schemaItems:sch_buys_products,
        schemaPays:sch_buys_payments,
        payTag:"compra",
        userData,pageData,test:test,
        itemFieldTotal:"costTotal",
        mainFieldTotal:"total",
      });

      return;
      
      var acc_pays = Access_Get(userData.access,"md-box-general");

      var group = new CrudsGroup({
        pageData,
        userData,
        parent:pageData.body,
        test:false,
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
          //{modal:{parent:"prnt-pay-md",name:"md-pay"}},
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
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                    {name:"tutorial",show:true},
                    {name:"load",show:true},
                  ]
                },
                {
                  name:"block",
                  tools:[
                    {name:"insert",show:true},
                    {name:"tutorial",show:true},
                  ]
                }
              ],
            }
          },
          {
            steps:{
              parent:"prnt-buy-stps",
              items:[
                {name:"stp-products",title:"items"},
                (acc_pays?{name:"stp-pays",title:"pagos"}:null),
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
              ],
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                  ]
                },
                {
                  name:"new",
                  tools:[
                    {name:"tutorial",show:true},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                  ]
                }
              ],
            },
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
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"sizes",value:999,show:false},
                    {name:"insert",show:true},
                    {name:"tutorial",show:true},
                    {name:"load",show:true},
                  ],
                },
              ],
            }
          },
        ],
        conections:[
          {
            masterName:"cr-buy",
            masterSelect:"ID_BUY",
            event:"list",
            maidName:"cr-buy-products",
            maidSelect:"ID_BUY",
          },
          /*pays_cnx_sale_tb,
          pays_cnx_tb_fm,*/
          {
            masterName:"cr-buy",
            masterSelect:"ID_BUY",
            event:"search",
            searchValue:"ID_BUY",
          },
          {
            masterName:"cr-buy",
            masterFieldName:"total",
            event:"sum",
            maidName:"cr-buy-products",
            maidFieldName:"costTotal",
          },
          {
            event:"formForm",
            masterName:"cr-buy",
            masterFieldName:"provideer",
            maidName:"cr-provideer",
            maidSelect:"ID_PROVIDEER",
          }
        ],
        groups:[
          acc_pays?
          {
            ...gp_pays({
              parent:"stp-pays",
              masterTable:sch_buys_payments.table,
              masterFieldPrimary:sch_buys_payments.fieldPrimary,
              masterFieldJoin:"ID_BUY",
              sch_join:sch_buys_payments,
              masterCrud:"cr-buy",
              tagValue:"compra",
              formEvents:[{
                name:"newAfter",
                actions:[{
                  action:({k})=>{

                    var totalPayed = 0;

                    //var totalToPay = parseFloat(group.crudGetBuild({crudName:"cr-buy"}).bodyGet().fieldsGetValues({fieldName:"total"})[0]);
                    //k.bodyGet().fieldSetValues({fieldName:"total",values:[totalToPay]});
                  }
                }]
              }]
            })
          }:null,
        ],
      });

      PlayTutorialInPage({group,pageData});

    }
  });
  

});
