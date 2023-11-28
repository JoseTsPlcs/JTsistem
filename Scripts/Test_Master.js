
$(document).ready(function() {

  var grid = new Grid({
    cols:[[12],[12],[12],[12],[12],[12],[12]],
    boxs:[
      //{x:0,y:0,box:{tipe:0,default:'test master',class:'h1 text-center w-100 m-0'}},
    ]
  });


  var control = {
    ventas:{build:null,active:true},
    clientes:{build:null,active:false},
    zonas:{build:null,active:false},
    productos:{build:null,active:false},
    pagos:{build:null,active:false},
    pago:{build:null,active:false},

    conection:true,
    ventas_clientes:true,
    clientes_zonas:true, 
    ventas_productos:true,
    pagos_pago:true,
    ventas_pagos:true,
  }

  if(control.ventas.active){

    control.ventas.build=new Crud_Form({
      parent:grid.GetColData({x:0,y:1}).col,
      title:'Venta',
      tables:['ventas','clientes','zonas'],
      loads:[
        {
          table_main:1,
          selects:[
            {field:3,table:1,as:'show'},
            {field:0,table:1,as:'value'},
            {field:5,table:1,as:'dir'},
            {field:7,table:1,as:'ref'},
            {field:9,table:1,as:'gps'},
            {field:1,table:2,as:'zona'},
            {field:3,table:2,as:'deliv'},
          ],
          joins:[
            {main:{table:1,field:6},join:{table:2,field:0}},
          ],
        }
      ],
      filters:[
        {name:'fecha min',sql:{field:2,inter:'<='},box:{tipe:2,default:'2022-12-10'}}
      ],
      windows:[
        {
          title:'informacion',
          labels:[
            {name:'nro',sql:{field:0},col:6},
            {name:'fecha',box:{tipe:2},sql:{field:2},col:6},
  
            {name:'anulado',box:{tipe:6},sql:{field:16},col:3},
            {name:'confirmado',box:{tipe:6},sql:{field:1},col:3},
            {name:'armado',box:{tipe:6},sql:{field:10},col:3},
            {name:'entregado',box:{tipe:6},sql:{field:11},col:3},
  
            {name:'comentario',sql:{field:13},col:4},
            {name:'documento',sql:{field:14},col:4},
            {name:'emitido',box:{tipe:6},sql:{field:15},col:4},
          ],
        },
        {
          title:'cliente',
          labels:[
            
            {col:1,name:'edit',box:{tipe:5,class:'btn btn-primary',default:'[/]'}},
            {col:1,name:'add',box:{tipe:5,class:'btn btn-primary',default:'[+]'}},
            {col:10,name:'nombre',sql:{field:3},load:{index:0},box:{tipe:8}},
            {name:'recoge',box:{tipe:6},sql:{field:12}},
  
            {name:'zona'},
            {name:'direccion'},
            {name:'referencia'},
  
            {name:'trabajador',sql:{field:7}},
            {name:'delivery',sql:{field:6}},
            {name:'delivery gratis',sql:{field:17}},
            
          ],
        },
        {
          title:'pago',
          labels:[
  
            {name:'cajero',sql:{field:9}},
            {name:'total',sql:{field:4}},
            {name:'cancelado',box:{tipe:6},sql:{field:8}},
            {name:'metodo',sql:{field:5}},
            {name:'descuento',sql:{field:18}},
          ],
        }
      ],
      triggers:[
        {
          trigger:{fieldName:'cliente'},
          actions:[
            {
              name:'printLoadData',
              params:[
                ['loadIndex',0],
                ['loadField','dir'],
                ['printField','direccion'],
              ],
            },
          ],
        }
      ],
    });
  }

  if(control.clientes.active){

    control.clientes.build=new Crud_Form({
      modal:control.conection,
      parent:grid.GetColData({x:0,y:2}).col,
      title:'cliente',
      tables:['clientes','zonas'],
      loads:[
        {
          table_main:1,
          selects:[
            {field:0,table:1,as:'value'},
            {field:1,table:1,as:'show'},
          ],
        }
      ],
      windows:[
        {
          title:'cliente',
          labels:[
            {name:'nombre',sql:{field:3},box:{tipe:1}},
  
            {col:1,name:'edit',box:{tipe:5,class:'btn btn-primary',default:'[/]'}},
            {col:1,name:'add',box:{tipe:5,class:'btn btn-primary',default:'[+]'}},
            {col:10,name:'zona',sql:{field:6},box:{tipe:8},load:0},
          ],
        }
      ],
    });
  }

  if(control.zonas.active){

    control.zonas.build=new Crud_Form({
      modal:control.conection&&control.clientes_zonas,
      parent:grid.GetColData({x:0,y:3}).col,
      title:'zona',
      tables:['zonas'],
      windows:[
        {
          title:'informacion general',
          labels:[
            {name:'nombre',sql:{field:1},box:{tipe:1}},
          ],
        }
      ],
    });
  }

  if(control.productos.active){

    control.productos.build = new Crud_Table({
      parent:grid.GetColData({x:0,y:4}).col,
      title:'productos',
      tables:['ventas_productos'],
      fields:[
        {delete:true},
        {name:'id',sql:{field:0},box:{tipe:0}},
        {name:'venta id',sql:{field:2},box:{tipe:0}},
        {name:'producto id',sql:{field:5},box:{tipe:1}},
      ]
    });
  }

  if(control.pagos.active){

    control.pagos.build = new Crud_Table({
      parent:grid.GetColData({x:0,y:5}).col,
      title:"pagos",
      tables:['ventas_transacctions'],
      fields:[
        {delete:true},
        {edit:true,name:"edit"},
        {name:'id',sql:{field:0},box:{tipe:0}},
        {name:'venta id',sql:{field:1},box:{tipe:1}},
        {name:'pago id',sql:{field:2},box:{tipe:1}},
      ]
    });
  }

  if(control.pago.active){

    control.pago.build=new Crud_Form({
      modal:control.conection&&control.pagos_pago,
      parent:grid.GetColData({x:0,y:6}).col,
      title:'pago',
      tables:['transactions'],
      windows:[
        {
          title:'informacion general',
          labels:[
            {name:'id',sql:{field:0},box:{tipe:0}},
            {name:'fecha',sql:{field:1},box:{tipe:2}},
            {name:'total',sql:{field:2},box:{tipe:1}},
          ],
        }
      ],
    });
  }

  if(control.conection){

    if(control.ventas_clientes && control.ventas.build && control.clientes.build){

      new Crud_Master({
        master:{
          fieldName:'nombre',
          build:control.ventas.build,
        },
        maid:{
          fieldSqlIndex:0,
          build:control.clientes.build,
        }
      });
    }

    if(control.clientes_zonas && control.clientes.build && control.zonas.build){

      new Crud_Master({
        master:{
          fieldName:'zona',
          build:control.clientes.build,
        },
        maid:{
          fieldSqlIndex:0,
          build:control.zonas.build,
        }
      });
    }

    if(control.ventas_productos && control.productos.build && control.ventas.build){

      new Crud_Master({
        master:{
          event:"reload",
          fieldSqlName:"primary",
          build:control.ventas.build,
        },
        maid:{
          fieldSqlIndex:2,
          build:control.productos.build,
        }
      });
    }

    if(control.pagos_pago && control.pagos.build && control.pago.build){

      new Crud_Master({
        master:{
          fieldName:"pago id",
          build:control.pagos.build,
        },
        maid:{
          fieldSqlIndex:0,
          build:control.pago.build,
        }
      });
    }

    if(control.ventas_pagos && control.pagos.build && control.ventas.build){

      new Crud_Master({
        master:{
          event:"reload",
          fieldSqlName:"primary",
          build:control.ventas.build,
        },
        maid:{
          fieldSqlIndex:1,
          build:control.pagos.build,
        }
      });
    }
    
  }

  

})
