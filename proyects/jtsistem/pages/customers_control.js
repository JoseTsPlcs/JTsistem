
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var gr = new Grid({parent:pageData.body,cols:[[12]]});

      new Crud_set({
        
        ...scr_customer_tb({
          parent:gr.GetColData({x:0,y:0}).col,
          title:"lista de cliente",
          userData,
        })

      });

    }
  });

  
  

});
