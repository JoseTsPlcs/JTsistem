
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      new Crud_Table({
        ...customer_control,
      })
    }
  });

});
