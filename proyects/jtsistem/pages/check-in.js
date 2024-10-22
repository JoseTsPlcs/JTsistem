
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      BuildCrudsOfPage({pageData,userData});
    }
  });
  

});
