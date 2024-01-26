
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      var panel = new Grid({
        cols:[[12],[12]],
      });

      var control = {
        pagos:{build:null,parent:null,active:true},
        pago:{build:null,parent:null,active:true},
      }

      control.pagos.parent = panel.GetColData({x:0,y:0}).col;
      control.pago.parent = panel.GetColData({x:0,y:1}).col;

      if(control.pagos.active){

        control.pagos.build = new Crud_Table({
          parent:control.pagos.parent,
          title:"Caja chica",
          tables:["transactions","transactions_tags","accounts"],
          loads:[1,2],
          fields:[
            {action:"delete"},
            {action:"edit"},
            //{name:"id",sql:0},
            {name:"fecha",sql:1,size:200},
            {name:"total",sql:2,box:Box_Soles()},
            {name:"tag",sql:3,load:0},
            {name:"cuenta",sql:4,load:1},
            {name:"descripcion",sql:5},
            {name:"ingreso",sql:6,box:Box_Dual({show:"ingreso(+)",show2:"egreso(-)",colorInverse:true})},
          ],
        });
      }

      if(control.pago.active){

        control.pago.build = new Crud_Form({
          modal:control.pagos.active,
          parent:control.pago.parent,
          title:"transaccion",
          tables:["transactions","transactions_tags","accounts"],
          loads:[1,2],
          windows:[
            {
              title:"informacion",
              fields:[
                {name:"id",sql:0,col:6},
                  {name:"fecha",sql:1,box:2,col:6},
                  
                  {name:"etiqueta",tipe:1,sql:3,box:3,load:0,col:6},
                  {name:"cuenta",sql:4,tipe:1,box:3,load:1,col:6},
                  
                  {name:"ingreso",sql:6,box:Box_Dual({show:"Ingreso(+)",show2:"Egreso(-)"}),col:6},
                  {name:"total",sql:2,box:1,col:6},
                  {name:"descripcion",sql:5,box:1},
              ],
            }
          ],
        });

        if(control.pagos.active){

          new Crud_Master({
            master:{
              event:"edit",
              fieldSqlName:"primary",
              build:control.pagos.build,
            },
            maid:{
              fieldSqlIndex:0,
              build:control.pago.build,
            }
          })
        }
      }

    }
  });

});
