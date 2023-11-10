
$(document).ready(function() {

  new Pag_Base({
    success:({page,recive})=>{

      TransControlPanel({page:page,recive:recive});

      
    }
  });

})
