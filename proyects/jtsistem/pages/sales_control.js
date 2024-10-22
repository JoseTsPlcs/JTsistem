
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      scr_sales_control({
        parent:pageData.body,
        userData,
        title:pageData.title,
        status:[op_sales_status[3].show],
        orderField:"DATE_EMMIT",
        stateStart:"block",
        fechaMin:Date_FirstOfMoth(),
        fechaMax:Date_LastOfMoth(),
      });

    }
  });

  

  

});
