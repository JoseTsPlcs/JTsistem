
$(document).ready(function() {

  new Pag_Base({
    success:({userData})=>{

      scr_admin({
        id_company:company_id,
        accessEdit:false,
      });
      
    }
  });
});
