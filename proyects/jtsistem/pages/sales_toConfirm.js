
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      scr_sales_control({
        parent:pageData.body,
        userData,
        title:pageData.title,
        fechaMax:null,
        fechaMin:null,
        status:[op_sales_status[0].show,op_sales_status[1].show,op_sales_status[2].show],
      });

    }
  });

  

  

});
