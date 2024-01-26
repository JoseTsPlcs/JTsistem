

$(document).ready(function() {

  new Pag_Base({

    success:({recive, page,from})=>{


      new Crud_Form({
        ...customers_add,
      });
    }
  })  


});
