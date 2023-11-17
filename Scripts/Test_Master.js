
$(document).ready(function() {

  var grid = new Grid({
    cols:[[12],[12],[12],[12],[12],[12],[12]],
    boxs:[
      {x:0,y:0,box:{tipe:0,default:'test master',class:'h1 text-center w-100 m-0'}},
    ]
  });


  var control = {
    conection:true,

  }


  new Crud_Table({
    parent:grid.GetColData({x:0,y:1}).col,
    title:'lista de productos',
    tables:['productos'],
    fields:[
      {name:'producto',sql:{field:1}},
    ],
  });

})
