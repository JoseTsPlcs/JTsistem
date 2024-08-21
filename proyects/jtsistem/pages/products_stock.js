
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var acc_stock_update = userData.access.find(acc=>acc.value=="acc-9") && userData.access.find(acc=>acc.value=="acc-9").active == "true"; 

      new Crud_set({
        ...scr_base({
          parent:pageData.body,
          title:pageData.title,
          userData,
          schema:sch_items,
          panelTipe:"table",
          fieldsSet:[
            {name:"precio de venta",state:"hide"},
            {name:"costo unitario",state:"hide"},
            {name:"stock total",state:"edit"},
            {name:"stock minimo",state:"edit"},
          ],
        }),
      });

    }
  });
  

});
