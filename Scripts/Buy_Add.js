
$(document).ready(function() {

    new Pag_Base({
  
      success:({recive,page})=>{

        const control = {
          md_buy:{active:true},
          md_prove:{active:true},
          lt_products:{active:true},
          lt_tran:{active:true},
          lt_tran_t:{active:false},
          md_tran:{active:true},
        }

        const panel = new Grid({
          cols:[[12],[12],[12],[12],[12],[12],[12]],
        });

        //compra
        if(control.md_buy.active){

          control.md_buy.build = new Crud({
            tipe:"form",
            parent:panel.GetColData({x:0,y:0}).col,
            title:'compra',
            //states:[{name:'reload',tools:[{name:'new',show:true},{name:'save',show:true}]}],
            //state_base:'search',
            tables:['buys','providers'],
            loads:[1],
            windows:[
              {
                title:'informacion general',
                fields:[
                  {col:6,name:"nro",sql:0},
                  {col:6,name:'fecha de emision',box:{tipe:2,default:Date_Today()},sql:{field:2}},
                  {col:1,action:"edit"},{col:1,action:"new"},
                  {col:10,name:'proveedor',sql:{field:1},box:{tipe:8,class:'w-100'},load:0},
                  {col:4,tipe:2,name:'confirmado',box:{tipe:6},sql:{field:3}},
                  {col:4,tipe:2,name:'pagado',box:{tipe:6},sql:{field:4}},
                  {col:4,tipe:2,name:'total',box:Box_Soles({total:0,clss:'h3'}),sql:{table:0,field:5}},
                  {col:6,name:'fecha de entrega',box:{tipe:2,default:Date_Today(7)},sql:{table:0,field:8}},
                  {col:6,tipe:2,name:'entregado',box:{tipe:6},sql:{table:0,field:7}},
                ],
              },
            ],
          });
        }

        //proveedor
        if(control.md_prove.active){

          control.md_prove.build = new Crud({
            parent:panel.GetColData({x:0,y:1}).col,
            modal:control.md_buy.active,
            tipe:"form",
            title:'proveedor',
            tables:['providers'],
            windows:[
                {
                    title:"informacion",
                    fields:[  
                        {name:'activo',sql:4,box:6},
                        {name:'empresa',sql:1,box:1},
                        {name:'ruc',sql:{field:2},box:{tipe:1,class:'w-100'}},
                        {name:'celular',sql:{field:3},box:{tipe:1,class:'w-100'}},
                    ],
                }
            ],
          });
  
          if(control.md_buy.active){

            new Crud_Master({
              master:{
                event:"edit",
                fieldName:"proveedor",
                build:control.md_buy.build,
              },
              maid:{
                fieldSqlIndex:0,
                build:control.md_prove.build,
              }
            });
          }
        }
        
        //lista de productos
        if(control.lt_products.active){

          control.lt_products.build = new Crud({
            tipe:"table",
            parent:panel.GetColData({x:0,y:2}).col,
            title:"lista de productos",
            tables:["buy_products","productos"],
            loads:[1],
            fields:[
              {action:"delete"},
              //{name:"id",sql:{field:0}},
              //{name:"buy id",sql:{field:1}},
              {name:"producto",size:400,sql:{field:2},load:0,box:{tipe:8}},
              {name:"cantidad",box:{tipe:1},sql:{field:3}},
              {name:"costo total",box:{tipe:1},sql:{field:4}},
            ],
          });
  
          if(control.md_buy.active){

            new Crud_Master({
              master:{
                event:"reload",
                selectName:"primary",
                build:control.md_buy.build,
              },
              maid:{
                fieldSqlIndex:1,
                build:control.lt_products.build,
              }
            }); 
          }
        }

        //lista de transacciones
        if(control.lt_tran.active){

          control.lt_tran.build = new Crud({
            tipe:"table",
            parent:panel.GetColData({x:0,y:3}).col,
            title:"lista de transferencias",
            tables:["buy_transacctions","transactions","transactions_tags"],
            selects:[
              {table:1,field:2,as:"total"},
              {table:2,field:1,as:"etiqueta"},
              {table:0,field:2,as:"tran id"},
            ],
            joins:[
              {main:{table:0,field:2},join:{table:1,field:0}},
              {main:{table:1,field:3},join:{table:2,field:0}},
            ],
            fields:[
              {action:"delete"},
              {action:"edit"},
              //{name:'id',sql:{field:0},box:{tipe:0}},
              //{name:'buy id',sql:{field:1},box:{tipe:0}},
              {name:"tran id",sql:{field:2},box:{tipe:0}},
              {name:"total",selectName:"total"},
              {name:"etiqueta",selectName:"etiqueta"},
            ]
          });

          if(control.md_buy.active){

            new Crud_Master({
              master:{
                event:"reload",
                selectName:"primary",
                build:control.md_buy.build,
                deleteChild:true,
              },
              maid:{
                fieldSqlIndex:1,
                build:control.lt_tran.build,
              }
            }); 
          }

        }

        //lista de transaccion
        if(control.lt_tran_t.active){

          control.md_tran.build = new Crud({
            tipe:"table",
            parent:panel.GetColData({x:0,y:4}).col,
            title:"transacciones test",
            tables:["transactions","transactions_tags","accounts"],
            loads:[
              {
                table_main:1,
                selects:[
                  {table:1,field:0,as:"value"},
                  {table:1,field:1,as:"show"},
                  {table:1,field:2,as:"ingreso"},
                ],
              }
              ,2],
            fields:[
              {name:"id",sql:0,col:6},
              {name:"fecha",sql:1,box:2,col:6},
              
              {name:"etiqueta",tipe:1,sql:3,box:3,load:0,col:6},
              {name:"cuenta",sql:4,tipe:1,box:3,load:1,col:6},

              
              {name:"ingreso",sql:6,box:Box_Dual({show:"Ingreso(+)",show2:"Egreso(-)"}),col:6},
              {name:"total",sql:2,box:1,col:6},
              {name:"descripcion",sql:5,box:1},
            ],           
          });
        }

        //modulo de transaccion
        if(control.md_tran.active){

          //formato de transaccion
          control.md_tran.build = new Crud({
            tipe:"form",
            modal:control.lt_tran.active,
            parent:panel.GetColData({x:0,y:5}).col,
            ...transaction_add,
          });

          if(control.lt_tran.active){

            new Crud_Master({
              master:{
                event:"edit",
                selectName:"tran id",
                build:control.lt_tran.build,
                deleteChild:true,
              },
              maid:{
                fieldSqlIndex:0,
                build:control.md_tran.build,
                //deleteParent:true,
              }
            });
          }

        }
        

      }
    })
  
  });