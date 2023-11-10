
$(document).ready(function() {

  new Pag_Base({

    success:({screenload})=>{
      
      AdmControlPanel({
        screenload:screenload,

      });
    }
  })

});
