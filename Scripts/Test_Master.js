
$(document).ready(function() {

  var grid = new Grid({
    cols:[[12],[12],[12],[12],[12],[12],[12]],
    boxs:[
      //{x:0,y:0,box:{tipe:0,default:'test master',class:'h1 text-center w-100 m-0'}},
    ]
  });


  var control = {
    fm_ventas:{active:true},
    fm_clientes:{active:false},
    fm_zonas:{active:false},
    tb_productos:{active:false},
    tb_pagos:{active:false},
    fm_pago:{active:false},

  };

  control.fm_ventas.parent = grid.GetColData({x:0,y:0}).col;


  if(control.fm_ventas.active){

    control.fm_ventas.build = new Crud({
      parent:control.fm_ventas.parent,
      title:"ventas", 
      tipe:"form",
      tables:["ventas"],
      windows:[
        {
          title:"informacion general",
          fields:[
            {name:"nro",sql:0},
            {name:"confirmado",box:6,sql:1},
            {name:"fecha",box:2,sql:2},
          ],
        }
      ],
    });
  }

  

  

})
