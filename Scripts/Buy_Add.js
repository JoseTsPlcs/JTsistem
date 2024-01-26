
$(document).ready(function() {

    new Pag_Base({
  
      success:({recive,page})=>{

        
        const panel = new Grid({
          cols:[[6,6],[12],[12],[12],[12],[12]],
        });

        const buy_add = new Crud_Form({
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
                {col:6,name:"nro",sql:{field:0}},
                {col:6,name:'fecha de emision',box:{tipe:2,default:Date_Today()},sql:{field:2}},
                {col:1,edit:true},{col:1,new:true},
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

        //proveedor
        if(false){

          const provider_modulo = new Crud_Form({
            modal:true,
            ...provider_add,
          });
  
          new Crud_Master({
            master:{
              event:"edit",
              fieldName:"proveedor",
              build:buy_add,
            },
            maid:{
              fieldSqlIndex:0,
              build:provider_modulo,
            }
          });
        }
        
        //lista de productos
        if(false){

          const products_list = new Crud_Table({
            parent:panel.GetColData({x:0,y:1}).col,
            title:"lista de productos",
            tables:["buy_products","productos"],
            loads:[1],
            fields:[
              //{edit:true},
              //{name:"id",sql:{field:0}},
              //{name:"buy id",sql:{field:1}},
              {delete:true},
              {name:"producto",size:400,sql:{field:2},load:0,box:{tipe:8}},
              {name:"cantidad",box:{tipe:1},sql:{field:3}},
              {name:"costo total",box:{tipe:1},sql:{field:4}},
            ],
          });
  
          new Crud_Master({
            master:{
              event:"reload",
              fieldSqlName:"primary",
              build:buy_add,
            },
            maid:{
              fieldSqlIndex:1,
              build:products_list,
            }
          }); 
        }

        //lista de transacciones
        if(true){

          const tr_lst = new Crud_Table({
            parent:panel.GetColData({x:1,y:0}).col,
            title:"pagos",
            tables:["buy_transacctions","transactions","transactions_tags"],
            selects:[
              {table:1,field:2,as:"total"},
              {table:2,field:1,as:"etiqueta"},
              {table:0,field:2,as:"pago id"},
            ],
            joins:[
              {main:{table:0,field:2},join:{table:1,field:0}},
              {main:{table:1,field:3},join:{table:2,field:0}},
            ],
            fields:[
              {delete:true},
              {edit:true,name:"edit"},
              //{name:'id',sql:{field:0},box:{tipe:0}},
              //{name:'buy id',sql:{field:1},box:{tipe:0}},
              //{name:"pago id",sql:{field:2},box:{tipe:0}},
              {name:"total",dataName:"total"},
              {name:"etiqueta",dataName:"etiqueta"},
            ]
          });

          new Crud_Master({
            master:{
              event:"reload",
              fieldSqlName:"primary",
              build:buy_add,
              deleteChild:true,
            },
            maid:{
              fieldSqlIndex:1,
              build:tr_lst,
            }
          }); 

          if(true){

            //formato de transaccion
            const tr_frm = new Crud_Form({
              modal:true,
              parent:panel.GetColData({x:0,y:4}).col,
              ...transaction_add,
            });

            new Crud_Master({
              master:{
                event:"edit",
                fieldSqlName:"pago id",
                build:tr_lst,
              },
              maid:{
                fieldSqlIndex:0,
                build:tr_frm,
              }
            });

            if(true){

              
            }

          }

        }
        

      }
    })
  
  });