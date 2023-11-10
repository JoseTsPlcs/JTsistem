
$(document).ready(function() {

  new Pag_Base({
    success:({page,recive})=>{

      const cn = new Grid({
        cols:[[12],[12]],
      });

      /*TransControlPanel({
        parent:cn.GetColData({x:0,y:0}).col,
        page:page,
        cuentas:['Caja Chica'],
      });*/

      TransAddPanel({
        parent:cn.GetColData({x:0,y:1}).col,
        recive:recive,
        page:page,
        cuentas:'Caja Chica',
        title:'ingreso <b>[caja chica]</b>',
      });


    }
  });

});
