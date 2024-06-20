
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      scr_sales_control({
        userData,
        title:pageData.title,
        fechaMin:null,
        fechaMax:null,
        status:["cotizacion"],
      });

    }
  });

  

  

});
