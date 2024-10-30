
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{
      

      concepBuildPage({userData,pageData});
    }
  });

  

});
