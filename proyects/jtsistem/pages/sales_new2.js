
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      new Crud_set({
        ...scr_base({
          schema:sch_sales,
          parent:pageData.body,
          title:"ventas tabla",
          fieldsSet:[],
          userData,
          panelTipe:"form",
          stateGeneral:"edit",
        }),
      });

    }
  });


  

  
  

  

});
