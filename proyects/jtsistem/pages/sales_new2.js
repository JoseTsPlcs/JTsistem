
$(document).ready(function() {

  if(true){

    new Pag_Base({
      success:({userData,pageData})=>{
        
  
        crudP({userData,pageData});         
  
      }
    });
  }
  else
  {

    crudP({
      userData:{
        access:[],
        company:{id:1},
      },
      pageData:{
        body:document.body,
      }
    });
  }

  

  function crudP({userData,pageData}) {
    
    var md_pays = false;

    new CrudsGroup({
      userData,
      parent:pageData.body,
      layers:[
        {
          grid:{
            items:[
              {name:"main",col:12},
              {name:"prnt-cust",col:12},
              {name:"prnt-pay",col:12},
            ]
          },
        },
        {modal:{parent:"prnt-cust",name:"md-cust"}},
        {modal:{parent:"prnt-pay",name:"md-pay"}},
        //-------------info-----------------
        {
          crud:{
            name:"cr-sale-info",parent:"main",
            schema:sch_sales,title:"venta",head:true,
            panels:[
              {
                tipe:"form",head:true,title:"informacion",col:4,
                fieldsSet:[
                  {value:"emmit",state:"edit"},
                  {value:"status",state:"edit"},,
                  {value:"doc",state:"edit"},
                  {value:"comment",state:"edit"},
                  {value:"customer",state:"edit"},
                  {value:"totaldscto",state:"show"},
                  {value:"dscto",state:"edit"},
                  {value:"total",state:"show"},
                  {value:"pay",state:"edit"},
                ],
              },
              {
                tipe:"form",head:false,title:"steps",col:8,
                fieldsSet:[
                  {action:"div",name:"steps"},
                ],
              }
            ],
            events:[
              {
                name:"boxUpdate",
                actions:[{
                  action:({k,field,y})=>{

                    if(field.name == ""){

                      
                    }
                  }
                }]
              }
            ],
          },
        },
        //------customer------
        {
          crud:{
            parent:"md-cust",name:"cr-cust",
            title:"cliente",
            schema:sch_customers,
            panels:[
              {
                tipe:"form",head:false,
                fieldsSet:[
                  {value:"name",state:"edit"},
                  {value:"company",state:"edit"},
                  {value:"nroDoc",state:"edit"},
                  {value:"cel",state:"edit"},
                  {value:"email",state:"edit"},
                  {value:"comment",state:"edit"},
                ],
              }
            ],
          }
        },
        //----steps----
        {
          steps:{
            parent:"steps",
            items:[
              {name:"stp-item",title:"items"},
              {name:"stp-pays",title:"pago"},
            ],
          }
        },
        //-----products-----
        {
          grid:{
            parent:"stp-item",
            items:[
              {name:"stp-item-products",col:12},
              {name:"stp-item-sale",col:12},
            ],
          }
        },
        {
          crud:{
            name:"cr-sale-products",parent:"stp-item-products",
            schema:sch_sales_products,title:"lista de productos/servicios",
            panels:[
              {
                tipe:"table",head:false,h:600,
                fieldsSet:[
                  {value:"item",state:"edit"},
                  {value:"cant",state:"edit"},
                  {value:"priceUnit",state:"edit"},
                  {value:"priceTotal",state:"edit"},
                ],
              }
            ],
            /*inserts:[
              //{field:"ID_PRODUCT",value:0},
              {field:"CANT",value:1},
              {field:"PRICE_UNIT",value:0},
              {field:"PRICE_TOTAL",value:0},
            ],*/
          },
        },
        //---------lista de pagos--------
        /*{
          grid:{
            parent:"stp-pays",
            items:[
              {name:"prnt-sale-pays-tot",col:12},
              {name:"prnt-sale-pays-list",col:12},
            ],
          }
        },
        {
          crud:{
            parent:"prnt-sale-pays-list",name:"cr-sales-pays",
            schema:sch_sales_pays,title:"lista de pagos",
            selects:[
              {table:sch_pays.table,field:"TOTAL"},
              {table:sch_accounts.table,field:"NAME"},
            ],
            joins:[
              {
                main:{table:sch_sales_pays.table,field:"ID_PAY"},
                join:{table:sch_pays.table,field:"ID_PAY"},
                tipe:"LEFT",
              },
              {
                main:{table:sch_pays.table,field:"ID_ACCOUNT"},
                join:{table:sch_accounts.table,field:"ID_ACCOUNT"},
                tipe:"LEFT",
              },
            ],
            panels:[
              {
                tipe:"table",head:false,
                fields:[
                  {name:"total",box:{...bx_money},select:"TOTAL"},
                  {name:"cuenta",box:{...bx_shw},select:"NAME"},
                ],
              }
            ],
          }
        },
        {
          crud:{
            parent:"md-pay",name:"cr-pay",
            schema:sch_pays,title:"pago de venta",
            panels:[
              {
                tipe:"form",head:false,
                fieldsSet:[
                  {value:"date",state:"show"},
                  {value:"account",state:"edit"},
                  {value:"total",state:"edit"},
                  {value:"income",state:"edit"},
                  {value:"tag",state:"edit"},
                ],
              }
            ],
          }
        }*/
      ],
      conections:[
        {
          masterName:"cr-sale-info",
          masterSelect:"ID_SALE",
          event:"list",
          maidName:"cr-sale-products",
          maidSelect:"ID_SALE",
        },
        /*{
          masterName:"cr-sale-info",
          masterSelect:"ID_SALE",
          event:"list",
          maidName:"cr-sales-pays",
          maidSelect:"ID_SALE",
        },*/
        {
          masterName:"cr-sale-info",
          fieldValue:"customer",
          event:"formForm",
          maidName:"cr-cust",
          maidSelect:"ID_CUSTOMER",
        },
        /*{
          masterName:"cr-sales-pays",
          masterSelect:"ID_PAY",
          event:"tableForm",
          maidName:"cr-pay",
          maidSelect:"ID_PAY",
        }*/
      ],
    });
  }

  

});
