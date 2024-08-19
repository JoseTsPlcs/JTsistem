
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      scr_sales_control({
        parent:pageData.body,
        userData,
        title:pageData.title,
      });

    }
  });

  

  

});
