
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{
    
      
      //pageBuildCruds({userData,pageData});
      new CrudsPage({userData,pageData});
    }
  });


  

  
  

  

});
