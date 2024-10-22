
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      const fieldCopy = [
        {fieldName:"nroDoc",copyName:"copy-doc"},
        {fieldName:"item",copyName:"copy-item"},
        {fieldName:"cant",copyName:"copy-cant"},
        {fieldName:"priceUnit",copyName:"copy-price-unit"}
      ];

      function fieldCopyClipboard({crudBuild,field,y=0}) {
        
        var fieldCopyFound = fieldCopy.find(cp=>cp.copyName==field.name);
        
        if(fieldCopyFound){

          navigator.clipboard.writeText(crudBuild.bodyGet().fieldGetValues({fieldName:fieldCopyFound.fieldName})[y]);
        }       
      }

      var customerJoin = GetInfoBySchema({
        userData,
        schema:sch_customers,
        fieldsSet:[
          {value:"name"},
          {value:"nroDoc"},
        ],
      });
      customerJoin.join = {
        main:{table:sch_sales.table,field:sch_customers.fieldPrimary},
        join:{table:sch_customers.table,field:sch_customers.fieldPrimary},
        tipe:"LEFT",
      };

      var group = new CrudsGroup({
        userData,pageData,
        parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-card",col:12},
                {name:"prnt-bills",col:12},
                {name:"prnt-md-bill"},
              ]
            }
          },
          {
            crud:{
              title:"lista de facturas",schema:sch_sales,
              parent:"prnt-bills",name:"cr-bills",
              joins:[customerJoin.join],
              selects:[...customerJoin.selects],
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"reload",show:true},
                    {name:"config",show:true},
                    {name:"tutorial",show:true},
                    {name:"sizes",show:false,value:999},
                  ],
                }
              ],
              panels:[{
                tipe:"table",
                fields:[
                  customerJoin.fields.find(f=>f.name=="name"),
                ],
                fieldsSet:[
                  {value:"status"},
                  {value:"pay"},
                  {value:"total"},
                  {value:"doc",filter:{value:op_sales_document.filter(op=>op.value!=1).map(op=>op.show)}},
                  {value:"emmit"},
                  {value:"emit",state:"edit",filter:{value:[op_sales_emitsunat.find(op=>op.value==0).show]}},
                  {value:"ruc",state:"edit"},
                ],
              }],
            },
          },
          {modal:{parent:"prnt-md-bill",name:"md-bill",size:"xl"}},
          {
            crud:{
              parent:"md-bill",title:"detalle de factura",head:false,
              schema:sch_sales,name:"cr-bill",
              joins:[
                customerJoin.join,
              ],
              selects:[...customerJoin.selects,],
              panels:[{
                tipe:"form",title:"informacion",
                fields:[
                  customerJoin.fields.find(f=>f.name=="name"),
                  {...customerJoin.fields.find(f=>f.name=="nroDoc"),col:10},
                ],
                fieldsSet:[
                  {action:"button",name:"copy-doc",title:"copiar item",value:fld_copy.box.value,col:2},
                  {value:"total"},
                  {value:"emmit"},
                  {value:"emit",state:"edit"},
                  {value:"ruc",state:"edit"},
                  {action:"div",name:"prnt-bill-detail"},
                ],
              }],
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"update",show:true},
                    {name:"cancel",show:true},
                    {name:"tutorial",show:true},
                  ],
                }
              ],
              events:[{
                name:"boxUpdate",
                actions:[{
                  action:({k,field,y})=>{

                    fieldCopyClipboard({crudBuild:k,field,y});
                  }
                }]
              }]
            },
          },
          {
            crud:{
              parent:"prnt-bill-detail",title:"detalle de factura",
              schema:sch_sales_products,name:"cr-bill-detail",
              states:[],
              selects:[
                {table:sch_items.table,field:"NAME",as:"ITEM-NAME"},
              ],
              joins:[
                {
                  main:{table:sch_sales_products.table,field:sch_items.fieldPrimary},
                  join:{table:sch_items.table,field:sch_items.fieldPrimary},
                  tipe:"LEFT",
                },
              ],
              panels:[{
                tipe:"table",
                fields:[
                  {name:"item",box:{tipe:0},select:"ITEM-NAME",attributes:att_ln},
                ],
                fieldsSet:[
                  //{value:"item"},
                  {action:"button",name:"copy-item",title:"copiar item",value:fld_copy.box.value},
                  {value:"cant"},
                  {action:"button",name:"copy-cant",title:"copiar cant.",value:fld_copy.box.value},
                  {value:"priceUnit"},
                  {action:"button",name:"copy-price-unit",title:"copiar prec. unit.",value:fld_copy.box.value},
                ],
              }],
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"sizes",show:false,value:999},
                  ],
                }
              ],
              events:[{
                name:"boxUpdate",
                actions:[{
                  action:({k,field,y})=>{

                    fieldCopyClipboard({crudBuild:k,field,y});
                  }
                }]
              }],
            }
          }
        ],
        conections:[
          {
            event:"cnx",masterAction:"show",
            masterName:"cr-bills",
            masterSelect:"ID_SALE",
            maidName:"cr-bill",
            maidSelect:"ID_SALE",
          },
          {
            event:"cnx",type:"show",
            masterName:"cr-bill",
            masterSelect:"ID_SALE",
            maidName:"cr-bill-detail",
            maidSelect:"ID_SALE",
          }
        ]
      });

      PlayTutorialInPage({group,pageData});
    }
  });
  

});
