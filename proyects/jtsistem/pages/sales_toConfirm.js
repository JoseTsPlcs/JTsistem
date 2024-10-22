
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      new BuildPage({
        type:"control",
        schema:sch_sales,
        schemaItems:sch_sales_products,
        schemaPays:sch_sales_pays,
        payTag:"venta",page:"saleNew2",
        userData,pageData,fieldTotalName:"pay",
        filters:[
          {name:"status",value:op_sales_status.filter(op=>op.value!=5&&op.value!=4).map(op=>{return op.show})},
        ],
      });

      return;

      Build_salesControl({
        title:"ventas en proceso",
        userData,pageData,
        fpay:op_sales_paid.map(op=>{return op.show;}),
        fstate:op_sales_status.filter(op=>op.value!=5&&op.value!=4).map(op=>{return op.show}),
      });

      return;

    }
  });

  

  

});
