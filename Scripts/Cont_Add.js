
$(document).ready(function() {
  
    new Pag_Base({

      success:({recive,page})=>{

        TransAddPanel({
          recive:recive,
          page:page,
          //cuentas:'Caja Chica',
        });

      } 
    });
  
});