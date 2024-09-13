
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{
      
      var acc_price_update = Access_Get(userData.access,"md-items-sale-price");
      var acc_pays = Access_Get(userData.access,"md-box-general");
      var acc_item_edit = Access_Get(userData.access,"md-items-sale-add");

     var group = new CrudsGroup({
      parent:pageData.body,userData,test:false,
      layers:[
        {
          grid:{
            items:[
              {name:"main"},
              {name:"prnt-md-cust"},
            ],
          }
        },
        //----sale------
        {
          crud:{
            parent:"main",
            name:"cr-sale",title:"venta",
            schema:sch_sales,//simple:true,
            panels:[
              {
                tipe:"form",title:"informacion",col:4,
                fieldsSet:[
                  {value:"emmit",state:"edit"},
                  {value:"status",state:"edit"},
                  {value:"pay",state:(acc_pays?"show":"edit")},
                  {value:"customer",state:"edit"},
                  {value:"doc",state:"edit"},
                  {value:"comment",state:"edit"},
                ],
              },
              {
                tipe:"form",title:"steps",col:8,head:false,h:0,
                fieldsSet:[
                  {action:"div",name:"div-stps"},
                ],
              },
              {
                tipe:"form",title:"total",col:12,
                fields:[
                  (acc_pays?{name:"totalPay",title:"total pagado",box:{...bx_money}}:null),
                ],
                fieldsSet:[
                  {position:"last",value:"total",showBox:{...bx_moneyh1}},
                  {position:"last",value:"dscto",state:"edit"},
                  {position:"last",value:"totaldscto"},
                ],
              },
            ],
            events:[
              {
                name:"saleFilter",
                actions:[{
                  action:({k})=>{

                    console.log("SALE FILTER!!");
                    

                    var saleCrud = k;
                    var sale = saleCrud.bodyGet();

                    var listItems = group.crudGetBuild({crudName:"cr-items"}).bodyGet();
                    var priceTotals = listItems.fieldGetValues({fieldName:"priceTotal"});
                    var totalItems = priceTotals.reduce((acc,v)=>{return acc + parseFloat(v);},0);
                    sale.fieldSetValues({fieldName:"totaldscto",values:[totalItems]});

                    console.log("TOTAL DSCTO:",totalItems,"PRICESTOTALS:",priceTotals);
                    

                    var dsct = parseFloat(sale.fieldGetValues({fieldName:"dscto"})[0]);
                    var totaltoPay = totalItems * (1 - dsct/100); 
                    sale.fieldSetValues({fieldName:"total",values:[totaltoPay]});
                    
                    if(acc_pays){

                      var listPays = group.crudGetBuild({crudName:"cr-list-pays"}).bodyGet();
                      var payedTotals = listPays.fieldGetValues({fieldName:"total"});
                      var totalPayed = payedTotals.reduce((acc,v)=>{return acc + parseFloat(v);},0);
                      sale.fieldSetValues({fieldName:"totalPay",values:[totalPayed]});

                      var payed = totaltoPay.toFixed(2) == totalPayed.toFixed(2) ? 1 : 0;
                      sale.fieldSetValues({fieldName:"pay",values:[payed]});
                    }

                    var primary = saleCrud.Reload_GetData_Primarys()[0];
                    var payField = sale.fieldGet({fieldName:"pay"});
                    var dsctoField = sale.fieldGet({fieldName:"dscto"});

                    if(payField.box.tipe == 0){

                      saleCrud.Update_AddChange({
                        fieldName:"pay",
                        value:payed,
                        primary,
                      });
                    }

                    if(dsctoField.box.tipe == 0){

                      saleCrud.Update_AddChange({
                        fieldName:"dscto",
                        value:dsct,
                        primary,
                      });
                    }
                    
                  }
                }]
              },
              {
                name:"boxUpdate",
                actions:[{
                  action:({field,k})=>{

                    if(field.name=="dscto"){

                      k.CallEvent({name:"saleFilter"});
                    }
                  }
                }]
              },
              {
                name:"printAfter",
                actions:[{
                  action:({field,k})=>{

                    k.CallEvent({name:"saleFilter"});
                  }
                }]
              },
            ],
          }
        },
        {
          steps:{
            parent:"div-stps",
            items:[
              {name:"stp-items",title:"items"},
              (acc_pays?{name:"stp-pays",title:"pagos"}:null),
              //{name:"stp-supplies",title:"costos"},
            ],
          }
        },
        {
          grid:{
            parent:"stp-items",
            items:[
              (
                acc_item_edit?
                {
                  name:"item-add",tipe:0,col:4,
                  box:{
                    ...fld_add.box,
                    value:'<i class="bi bi-plus-circle"></i> Añadir Nuevo Item',
                  },                
                  update:(params)=>{
  
                    var cr_item = group.crudGetBuild({crudName:"cr-item"});
                    cr_item.SetState({stateName:"new"});
                    
                  }
                }:null
              ),
              {name:"item-cont",box:{tipe:0,class:"conteiner"},tipe:0},
              {name:"stp-items-div",col:12},
            ],
          }
        },
        //------items------
        {
          crud:{
            parent:"stp-items-div",
            name:"cr-items",title:"lista de productos",
            schema:sch_sales_products,
            panels:[{
              tipe:"table",head:false,h:400,
              fieldsSet:[
                {value:"item",state:"edit"},
                {value:"cant",state:"edit"},
                {value:"priceUnit",state:(acc_price_update?"edit":"show")},
                {value:"priceTotal",state:(acc_price_update?"edit":"show")},
              ],
            }],
            events:[
              {
                name:"printAfter",
                actions:[{
                  action:({})=>{

                    var crudSale = group.crudGetBuild({crudName:"cr-sale"});
                    crudSale.CallEvent({name:"saleFilter"});
                  }
                }]
              }
            ],
          }
        },
        
      ],
      conections:[
        {
          masterName:"cr-sale",
          masterSelect:"ID_SALE",
          masterStateStart:"insert",
          event:"list",
          maidName:"cr-items",
          maidSelect:"ID_SALE",
        },
        {
          event:"search",
          masterName:"cr-sale",
          masterSelect:"ID_SALE",
          searchValue:"id_sale",
        },
        {
          event:"formForm",
          masterName:"cr-item",
          masterFieldName:"unid",
          maidName:"cr-unid",
          maidSelect:"ID_UNID",
        },
        {
          event:"formForm",
          masterName:"cr-item",
          masterFieldName:"tag",
          maidName:"cr-tag",
          maidSelect:"ID_PRODUCT_TAG",
        },
      ],
      groups:[
        {
          ...gp_customer({
            parentName:"prnt-md-cust",
            masterCrud:"cr-sale",
            masterFieldName:"customer",
          })
        },
        (
          acc_pays?
          {
            ...gp_pays({
              parent:"stp-pays",
              masterTable:sch_sales_pays.table,
              masterFieldPrimary:sch_sales_pays.fieldPrimary,
              masterFieldJoin:"ID_SALE",
              sch_join:sch_sales_pays,
              masterCrud:"cr-sale",
              tagValue:"VENTA",
              listEvents:[{
                name:"printAfter",
                actions:[{
                  action:()=>{
  
                    group.crudGetBuild({crudName:"cr-sale"}).CallEvent({name:"saleFilter"});
                  }
                }]
              }],
              formEvents:[{
                name:"newAfter",
                actions:[{
                  action:({k})=>{
  
                    var sale = group.crudGetBuild({crudName:"cr-sale"}).bodyGet();
                    var totalToPay = parseFloat(sale.fieldGetValues({fieldName:"total"})[0]);
                    var totalPayed = parseFloat(sale.fieldGetValues({fieldName:"totalPay"})[0]);
                    var currentToPay = (totalToPay - totalPayed); 
                    if(currentToPay < 0) currentToPay = 0;
                    currentToPay = currentToPay.toFixed(2);
  
                    k.bodyGet().fieldSetValues({fieldName:"total",values:[currentToPay]});
                  }
                }]
              }],
            }),
          }:null
        ),
        (
          acc_item_edit ?
          {
            layers:[
              //-----item new------
              {
                grid:{
                  parent:"item-cont",
                  items:[
                    {name:"prnt-item-main"},
                    {name:"prnt-item-unid"},
                    {name:"prnt-item-tag"},
                  ],
                }
              },
              {modal:{parent:"prnt-item-main",name:"md-item-maid"}},
              {modal:{parent:"prnt-item-unid",name:"md-item-unid"}},
              {modal:{parent:"prnt-item-tag",name:"md-item-tag"}},
              {
                crud:{
                  parent:"md-item-maid",title:"item",
                  schema:sch_items,name:"cr-item",stateStart:"block",
                  afterCancel:"block",
                  panels:[
                    {
                      tipe:"form",head:false,
                      fieldsSet:[
                        {value:"name",state:"edit"},
                        {value:"tipe",state:"edit"},
                        {value:"tag",state:"edit"},
                        {value:"unid",state:"edit"},
                        {value:"price",state:"edit",col:6},
                        {value:"costUnit",state:"edit",col:6},
                        {value:"stock",state:"edit",col:6},
                        {value:"limit",state:"edit",col:6},
                      ],
                    }
                  ],
                  events:[{
                    name:"insertAfter",
                    actions:[{
                      action:({})=>{

                        var crudItems = group.crudGetBuild({crudName:"cr-items"});
                        crudItems.Load_Reset({});
                      }
                    }]
                  }],
                }
              },
              {
                crud:{
                  parent:"md-item-unid",title:"unidad",
                  schema:sch_unids,name:"cr-unid",
                  panels:[{
                    tipe:"form",head:false,
                    fieldsSet:[
                      {value:"name",state:"edit"},
                      {value:"simbol",state:"edit"},
                    ]
                  }]
                }
              },
              {
                crud:{
                  parent:"md-item-tag",title:"etiqueta",
                  schema:sch_items_tag,name:"cr-tag",
                  panels:[{
                    tipe:"form",head:false,
                    fieldsSet:[
                      {value:"name",state:"edit"},
                    ]
                  }]
                }
              },
            ],
            conections:[
              {
                masterName:"cr-items",
                masterFieldName:"item",
                event:"btn-edit",
                maidName:"cr-item",
                maidSelect:"ID_PRODUCT",
              }
            ],
          }:null
        ),
      ],
     });         

    }
  });

  

});
