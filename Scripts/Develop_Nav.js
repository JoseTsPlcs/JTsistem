
$(document).ready(function() {

  const conteiner = new Grid({
    cols:[[6,6]],
    
  });

  new Form_Table({
    parent: conteiner.GetColData({x:0,y:0}).col,
    ...adm_clases,
  });

  new Form_Table({
    parent: conteiner.GetColData({x:1,y:0}).col,
    ...adm_seccions,
  });
  

});
