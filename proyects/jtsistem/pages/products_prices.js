
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      new Crud_set({
        ...scr_base({
          parent:pageData.body,
          title:pageData.title,
          userData,
          schema:sch_items,
          panelTipe:"table",
          fieldsSet:[
            {name:"precio de venta",state:"edit"},
            {name:"costo unitario",state:"edit"},
            {name:"stock total",state:"hide"},
            {name:"stock minimo",state:"hide"},
            {name:"limite",state:"hide"},
          ],
        }),
      });
    }
  });
  

});
