
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      const cn = new Grid({
        cols:[[12],[12]],
      });

      TransControlPanel({
        parent:cn.GetColData({x:0,y:0}).col,
        page:page,
        cuentas:['Caja Chica'],
        url:'Sales_CashAdd.php',
        title:'transferencias <b>[caja chica]</b>',
      });

      /*TransAddPanel({
        parent:cn.GetColData({x:0,y:1}).col,
        cuentas:['Caja Chica'],
      });*/


    }
  });

});
