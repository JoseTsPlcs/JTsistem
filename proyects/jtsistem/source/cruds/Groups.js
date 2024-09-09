
function gp_customer({parentName,masterCrud,masterFieldName=null}) {
  
    return {
      layers:[
          {modal:{parent:parentName,name:"md-cust"}},
          {
            crud:{
              parent:"md-cust",name:"cr-cus-fm",
              schema:sch_customers,title:"cliente",
              panels:[
                {
                  tipe:"form",head:false,
                  fieldsSet:[
                    {value:"name",state:"edit"},
                    {value:"document",state:"edit",tipe:2,col:3},
                    {value:"nroDoc",state:"edit",tipe:2,col:9},
                    {value:"cel",state:"edit"},
                    {value:"dir",state:"edit"},
                    {value:"email",state:"edit"},
                    {value:"comment",state:"edit"},
                  ],
                }
              ],
            }
          }
      ],
      conections:[
          {
              masterName:masterCrud,
              masterSelect:"ID_CUSTOMER",
              masterFieldName,
              event:(masterFieldName?"formForm":"tableForm"),
              maidName:"cr-cus-fm",
              maidSelect:"ID_CUSTOMER",
          },
      ],
    }
}
  
function gp_pays({parent,masterTable,masterFieldPrimary,masterFieldJoin,masterCrud,sch_join,tagValue,listEvents=[],formEvents=[]}) {
      
    return {
        layers:[
            {
                grid:{
                    parent,name:"gr-list-pays",
                    items:[
                        {name:"prnt-list-pays-tb",col:12},
                        {name:"prnt-list-pay-fm-md",col:12},
                    ],
                }
            },
            //list
            {
                crud:{
                    parent:"prnt-list-pays-tb",name:"cr-list-pays",h:0,
                    title:"lista de pagos",tableMain:masterTable,schema:sch_join,
                    selects:[
                        {table:masterTable,field:masterFieldPrimary,primary:true},
                        {table:masterTable,field:"ID_PAY"},
                        {table:sch_pays.table,field:"TOTAL"},
                        {table:sch_accounts.table,field:"NAME"},
                        {table:shc_pay_tag.table,field:"NAME",as:"TAGNAME"},
                        {table:sch_pays.table,field:"INCOME"},
                    ],
                    joins:[
                        {
                        main:{table:masterTable,field:"ID_PAY"},
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
                                {name:"total",title:"total",box:{...bx_money},select:"TOTAL",attributes:[{name:"style",value:"min-width:100px"}]},
                                {name:"account",title:"cuenta",box:{...bx_shw},select:"NAME",attributes:[{name:"style",value:"min-width:150px"}]},
                                {name:"tag",title:"etiqueta",box:{...bx_shw},select:"TAGNAME"},
                                {name:"income",title:"ingreso",box:{...bx_shw,options:[{value:0,show:"egreso"},{value:1,show:"ingreso"}]},select:"INCOME"},
                            ],
                        }
                    ],
                    events:[
                        ...listEvents,
                    ],
                }
            },
            //form
            {modal:{parent:"prnt-list-pay-fm-md",name:"md-pay-fm"}},
            {
                crud:{
                    parent:"md-pay-fm",name:"cr-list-pay",
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
                                var accountID = k.bodyGet().fieldGetValues({fieldName:"account"})[0];
                                var accountInfo = accountLoadInfo.result.find(rst=>rst["value"] == accountID);
                                
                                var block = accountInfo.control == "1" && accountInfo.open == "0"; 
                                if(block) alert('no se puede usar la cuenta ' + accountInfo.show + ' sin abrirla antes');

                                var tagID = k.bodyGet().fieldGetValues({fieldName:"tag"})[0];
                                var incomeID = k.bodyGet().fieldGetValues({fieldName:"income"})[0];

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
                                    var tagInfo = tagLoadInfo.result.find(rst=>rst["show"] == tagValue);
                                    k.bodyGet().fieldSetValues({fieldName:"tag",values:[tagInfo.value]});
                                    k.bodyGet().fieldSetValues({fieldName:"income",values:[tagInfo.income]});
                                }
                            }]
                        },
                        ...formEvents,
                    ],
                }
            },
        ],
        conections:[
            {
                masterName:masterCrud,
                masterSelect:masterFieldJoin,
                event:"list",
                maidName:"cr-list-pays",
                maidSelect:masterFieldJoin,
            },
            {
                masterName:"cr-list-pays",
                masterSelect:"ID_PAY",
                event:"tableForm",
                maidName:"cr-list-pay",
                maidSelect:"ID_PAY",
            }
        ],
    }
}