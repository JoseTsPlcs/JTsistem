
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      var layers = [];
      var cruds = [];
      var conections = [];

      var cr_customer_fm = {
        parent:"md-cust",
        name:"fm-customer",title:"cliente",
        schema:sch_customers,
        panels:[
          {
            tipe:"form",
            fieldsSet:[
              {value:"name",state:"edit"},
              {value:"company",state:"edit"},
              {value:"nroDoc",state:"edit"},
              {value:"cel",state:"edit"},
              {value:"dir",state:"edit"},
              {value:"email",state:"edit"},
              {value:"comment",state:"edit"},
            ],
          }
        ],
      };

      function gp_cr_payments({}) {
        

      }      
      
      switch ("sales") {

        case "sales":
          
          layers = [
            {
              grid:{
                items:[
                  {name:"sale",col:4},
                  {name:"stps",col:8},
                  {name:"prnt-customer",col:12},
                  {name:"prnt-pay",col:12},
                ]
              },
            },
            {
              steps:{
                parent:"stps",
                items:[
                  {name:"stp-item"},
                  {name:"stp-pays"},
                ],
              }
            },
            {modal:{parent:"prnt-customer",name:"md-customer"}},
            {modal:{parent:"prnt-pay",name:"md-pay"}},
          ];
          cruds = [
            {
              parent:"sale",title:"venta",
              schema:sch_sales,name:"cr-sale",
              panels:[
                {
                  tipe:"form",
                  title:"informacion",head:false,
                  fieldsSet:[
                    {value:"emmit",state:"edit"},
                    {value:"status",state:"edit"},
                    {value:"pay",state:"edit"},
                    {value:"comment",state:"edit"},
                    {value:"customer",state:"edit"},
                  ],
                },
                {
                  tipe:"form",
                  title:"total",head:false,
                  fieldsSet:[
                    {value:"totaldscto",state:"show"},
                    {value:"total",state:"show"},
                  ],
                },
              ],
            },
            {
              parent:"stp-item",title:"lista de productos/servicios",
              schema:sch_sales_products,name:"cr-sale-items",
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"item",state:"edit"},
                    {value:"cant",state:"edit"},
                    {value:"priceUnit",state:"edit"},
                    {value:"priceTotal",state:"edit"},
                  ],
                }
              ],
            },
            {
              ...cr_customer_fm,
              parent:"md-customer",
            },
            {
              parent:"stp-pays",title:"lista de pagos",
              schema:sch_sales_pays,name:"cr-sale-pays",
              selects:[
                {table:sch_pays.table,field:"TOTAL"},
                {table:sch_pays.table,field:"INCOME"},
                {table:sch_accounts.table,field:"NAME",as:"accName"},
                {table:sch_sales_pays.table,field:"ID_PAY"},
              ],
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    //{value:"idSale",state:"show"},
                    //{value:"idPay",state:"show"},
                  ], 
                  fields:[
                    {name:"total",select:"TOTAL",box:{...bx_money}},
                    {name:"cuenta",select:"accName",box:{...bx_shw}},
                  ],
                }
              ],
              joins:[
                {
                  main:{table:sch_sales_pays.table,field:"ID_PAY"},
                  join:{table:sch_pays.table,field:sch_pays.fieldPrimary},
                  tipe:"LEFT",
                },
                {
                  main:{table:sch_pays.table,field:"ID_ACCOUNT"},
                  join:{table:sch_accounts.table,field:sch_accounts.fieldPrimary},
                  tipe:"LEFT",
                },
              ],
            },
            {
              parent:"md-pay",title:"pago de venta",
              schema:sch_pays,name:"cr-pay",
              panels:[
                {
                  tipe:"form",
                  fieldsSet:[
                    {value:"date",state:"show"},
                    {value:"account",state:"edit"},
                    {value:"total",state:"edit"},
                    {value:"income",state:"edit",boxValue:1,col:6},
                    {value:"tag",state:"edit",boxValueShow:"DELIVERY",col:6},
                  ],
                }
              ],
            }
          ];
          conections = [
            {
              masterName:"cr-sale",
              masterSelect:"ID_SALE",
              event:"list",
              maidName:"cr-sale-items",
              maidSelect:"ID_SALE",
            },
            {
              masterName:"cr-sale",
              masterSelect:"ID_SALE",
              event:"list",
              maidName:"cr-sale-pays",
              maidSelect:"ID_SALE",
            },
            {
              masterName:"cr-sale",
              event:"formForm",fieldValue:"customer",
              maidName:"fm-customer",maidSelect:"ID_CUSTOMER",
            },
            {
              masterName:"cr-sale-pays",masterSelect:"ID_PAY",
              event:"tableForm",
              maidName:"cr-pay",maidSelect:"ID_PAY",
            },
          ];

        break;
      
        case "customer":

          layers = [
            {
              grid:{
                items:[
                  {name:"main",col:12},
                ],
              }
            },
          ];
          cruds = [
            {
              parent:"md-cust",
              name:"fm-customer",title:"cliente",
              schema:sch_customers,
              panels:[
                {
                  tipe:"form",
                  fieldsSet:[
                    {value:"name",state:"edit"},
                    {value:"company",state:"edit"},
                    {value:"nroDoc",state:"edit"},
                    {value:"cel",state:"edit"},
                    {value:"dir",state:"edit"},
                    {value:"email",state:"edit"},
                    {value:"comment",state:"edit"},
                  ],
                }
              ],
            }
          ];
          conections = [];

        break;

      }

      new CrudsGroup({
        userData,
        parent:pageData.body,
        layers,cruds,conections
      });
      

    }
  });

  

  

});
