
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      scr_admin({
        parent:pageData.body,
        id_company:company_id,
        accessEdit:false,
      });
      
    }
  });
});
