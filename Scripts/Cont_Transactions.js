
$(document).ready(function() {

  new Pag_Base({
    success:({page,recive})=>{

      var control = {
        cont_lst:{active:true},
        cont_add:{active:true},
      }

      var panel = new Grid({
        cols:[[6,6],[6,6],[6,6],[12],[12]],
        boxs:[
          {x:0,y:1,box:{tipe:0,default:"total neto:",class:"h1 text-center"}},
          {x:1,y:1,box:Box_Soles({clss:"h1 text-center"})},

          {x:0,y:1,box:{tipe:0,default:"ingresos:",class:"h3 text-center text-success"}},
          {x:1,y:1,box:Box_Soles({clss:"h3 text-success text-center"})},

          {x:0,y:2,box:{tipe:0,default:"egresos:",class:"h3 text-center text-danger"}},
          {x:1,y:2,box:Box_Soles({clss:"h3 text-danger text-center"})},
        ],
      });
      

      if(control.cont_lst.active){

        control.cont_lst.parent = panel.GetColData({x:0,y:3}).col;
        control.cont_lst.build = new Crud_Table({
          parent:control.cont_lst.parent,
          title:"lista de transferencias",
          tables:["transactions","transactions_tags","accounts"],
          selects:[
            {table:0,field:6,as:"ingreso"},
          ],
          loads:[1,2],
          configShow:true,
          filters:[
            //{name:"fecha min",box:{tipe:2,default:Date_FirstOfMoth()}},
            //{name:"fecha max",box:{tipe:2,default:Date_LastOfMoth()}},
            {name:"cuenta",load:1,box:{tipe:3,default:1},sql:4},
            //{name:"etiquetas",box:{tipe:3}},
            //{name:"ingreso"},
          ],
          fields:[
            {action:"edit"},
            //{name:"id",requestName:"primary"},
            {name:"fecha",sql:1},
            //{name:"ingreso",sql:6},
            {name:"total",sql:2,box:Box_Soles({limit:true})},
            {name:"etiqueta",sql:3,load:0},
            //{name:"cuenta",sql:4,load:1},
            //{name:"descripcion",sql:5},
            
          ],
          events:[
            {
              name:"printAfter",
              actions:[
                {
                  name:"calculate",
                  action:({k})=>{k.CallEvent({name:"CalculateTotal"})}
                }
              ],
            },
            {
              name:"calculateTotal",
              actions:[
                {
                  name:"calculateUtilidad",
                  action:({k})=>{

                    var data = k._data;
                    console.log(data);
                  }
                }
              ],
            },
            {
              name:"printBefore",
              actions:[{
                action:({k,data})=>{

                  data.forEach(di => {
                    
                    var v_total = parseFloat(di["total"]);
                    var v_ingreso = parseInt(di["ingreso"]) == 1;
                    if(!v_ingreso) di["total"] = -v_total;
                  });

                }
              }],
            },
          ],
        });
      }

      if(control.cont_add.active){

        control.cont_add.parent = panel.GetColData({x:0,y:4}).col;
        control.cont_add.build = new Crud_Form({
          modal:(control.cont_lst.active),
          parent:control.cont_add.parent,
          h:0,
          title:"ingreso de transferencia",
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
          windows:[
            {
              title:"informacion general",head:false,
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
          events:[
            {
              name:"boxUpdate",
              actions:[{
                action:({k,field,y})=>{
                  if(field.name=="etiqueta"){

                    k.CallEvent({name:"IngresoByTag"});
                  }
                }
              }],
            },
            {
              name:"printAfter",
              actions:[{
                action:({k})=>{
                  
                  k.CallEvent({name:"IngresoByTag"});
                }
              }],
            },
            {
              name:"IngresoByTag",
              actions:[
                {
                  name:"base",
                  action:({k,y})=>{

                    var etiqueta_v = k.Print_GetValue({fieldName:"etiqueta",y:0});
                    var etiqueta_load = k.Loads_GetData({loadIndex:0});
                    var etiqueta_info = etiqueta_load.find(ld=>ld.value==etiqueta_v);
                    
                    var ingreso_v = 0;
                    if(etiqueta_info!=null) ingreso_v = etiqueta_info["ingreso"];
                    k.Print_SetValue({fieldName:"ingreso",y:0,value:ingreso_v,fieldUpdateAdd:true});

                  }
                }
              ],
            }
          ],
        });

      }

      if(control.cont_lst.active && control.cont_add.active){

        new Crud_Master({
          master:{
            build:control.cont_lst.build,
            event:"edit",
            fieldSqlName:"primary",
          },
          maid:{
            build:control.cont_add.build,
            fieldSqlIndex:0,
          }
        });
      }

      
    }
  });

})
