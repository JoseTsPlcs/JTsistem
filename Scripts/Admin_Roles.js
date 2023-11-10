
$(document).ready(function() {

  new Pag_Base({

    success:()=>{

      new Form_Table({
        ...adm_clases,
      });
      
    }
  })

});
