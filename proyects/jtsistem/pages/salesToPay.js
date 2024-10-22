
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      Build_salesControl({
        title:"ventas por pagar",
        userData,pageData,
        fpay:op_sales_paid.filter(op=>op.value==0).map(op=>{return op.show;}),
        fstate:op_sales_status.filter(op=>op.value!=5).map(op=>{return op.show}),
      });

    }
  });

});
