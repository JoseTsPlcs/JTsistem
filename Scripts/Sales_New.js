
$(document).ready(function() {

    new Pag_Base({
  
      success:({page,recive})=>{
        
        var panel = new Grid({
          cols:[[12],[12],[12],[12],[12],[12],[12]],
        });
      
        var control = {
          stateNew:false,

          ventas:{active:true},
          clientes:{active:true},
          zonas:{active:true},

          productos:{active:true},

          pagos:{active:true},
          pago:{active:true},

        }

        control.ventas.parent=panel.GetColData({x:0,y:0}).col;
        control.clientes.parent=panel.GetColData({x:0,y:1}).col;
        control.zonas.parent=panel.GetColData({x:0,y:2}).col;
        control.productos.parent=panel.GetColData({x:0,y:3}).col;
        control.pagos.parent=panel.GetColData({x:0,y:4}).col;
        control.pago.parent=panel.GetColData({x:0,y:5}).col;

        function Ventas_CalculateProductosTotal({}={}) {
            
          var v_totalProductos = 0;

          if(control.productos.build){

            var v_products_totals = control.productos.build.Print_GetValues({fieldName:"costo total"});
            v_totalProductos = v_products_totals.reduce((acc,v)=>{return acc + parseFloat(v)},0);
          }

          if(control.ventas.build){

            control.ventas.build.Print_SetValue({fieldName:"total productos",value:v_totalProductos,y:0});
          }

          Ventas_CalculateTotal();
        }

        function Ventas_CalculateTotal({}={}) {
          
          var crud_ventas = control.ventas.build;
          if(crud_ventas){

            var v_products = parseFloat(crud_ventas.Print_GetValue({fieldName:"total productos",y:0}));
            var v_deliv = parseFloat(crud_ventas.Print_GetValue({fieldName:"total delivery",y:0}));
            var v_pagado = parseFloat(crud_ventas.Print_GetValue({fieldName:"total pagado",y:0}));

            //console.log("calculate total",v_products,v_deliv,v_pagado);
            var v_total = v_products + v_deliv;
            var v_pendiente = (v_total - v_pagado);
            var v_isCancelado = (v_pendiente  == 0)?1:0;
            
            crud_ventas.Print_SetValue({fieldName:"total",value:v_total,y:0,fieldUpdateAdd:true});
            crud_ventas.Print_SetValue({fieldName:"total pendiente",value:v_pendiente,y:0});
            crud_ventas.Print_SetValue({fieldName:"cancelado",value:v_isCancelado,y:0,fieldUpdateAdd:true});
          }
        }

        function Ventas_CalculateTotalPagado({}={}) {
          
          var v_totalPagado = 0;
          var crud_pagos = control.pagos.build; 
          var crud_ventas = control.ventas.build;
          
          if(crud_pagos){

            var v_pagos = crud_pagos.Print_GetValues({fieldName:"total"});
            v_totalPagado = v_pagos.reduce((acc,v)=>{return acc + parseFloat(v)},0);
          }

          if(crud_ventas){

            crud_ventas.Print_SetValue({fieldName:"total pagado",value:v_totalPagado,y:0});
          }

          Ventas_CalculateTotal();
        }
      
        if(control.ventas.active){
      
          control.ventas.build=new Crud({
            recive,tipe:"form",
            parent:control.ventas.parent,
            title:"Venta",
            h:0,blocked:false,show:true,
            tables:["ventas","clientes","zonas","usuarios","customers_types"],
            loads:[
              {
                name:"informacion de los clientes",
                table_main:1,
                selects:[
                  {table:1,field:0,as:"value"},
                  {table:1,field:3,as:"show"},

                  {table:1,field:4,as:"dni"},
                  {table:1,field:8,as:"cel"},
                  {table:4,field:1,as:"tipo"},

                  {table:1,field:11,as:"recoge"},
                  {table:2,field:1,as:"zona"},
                  {table:2,field:3,as:"deliv"},
                  {table:1,field:5,as:"dir"},
                  {table:1,field:7,as:"ref"},
                  {table:1,field:9,as:"gps"},

                  
                ],
                joins:[
                  {main:{table:1,field:6},join:{table:2,field:0}},
                  {main:{table:1,field:13},join:{table:4,field:0}},
                ],
              },
              {
                table_main:3,
                selects:[
                  {table:3,field:0,as:"value"},
                  {table:3,field:1,as:"show"},
                ],
              }
            ],
            stateStart:(control.stateNew?"new":"reload"),
            stateAfterInserted:"reload",
            stateAfterSaved:"new",
            newFieldsBlock:true,
            states:[
              {
                name:"reload",
                tools:[
                  {name:"new",show:!control.stateNew},
                  {name:"delete",show:!control.stateNew},
                  {name:"cancel",show:control.stateNew},
                ],
              },
              {
                name:"new",
                tools:[{name:"cancel",show:!control.stateNew}],
              }
            ],
            filters:[
              {name:"fecha min",sql:{field:2,inter:">=",table:0},box:{tipe:2,default:"2022-12-10"}}
            ],
            windows:[
              {
                title:"informacion",
                col:6,blocked:false,show:false,
                fields:[
                  {name:"nro",sql:0,col:6},
                  {name:"fecha",box:2,sql:2,col:6},

                  {name:"anulado",tipe:2,box:6,sql:16,col:6},
                  {name:"confirmado",tipe:2,box:6,sql:1,col:6},
                  {name:"armado",tipe:2,box:6,sql:10,col:6},
                  {name:"entregado",tipe:2,box:6,sql:11,col:6},
        
                  {name:"documento",tipe:2,box:{tipe:3,options:documentos_options},sql:14,col:6},
                  {name:"emitido",tipe:2,box:6,sql:15,col:6},
                  {name:"comentario",tipe:2,box:1,sql:13,col:12},
                ],
              },
              {
                title:"pago",
                col:6,blocked:false,show:false,
                fields:[
                  
                  {name:"total productos",box:Box_Soles()},
                  {name:"total delivery",sql:6,box:Box_Soles()},
                  {name:"total",sql:4,box:Box_Soles()},
                  {name:"total pagado",box:Box_Soles()},
                  {name:"total pendiente",box:Box_Soles()},
                  {col:6,name:"cajero",sql:9,box:3,load:1},
                  {col:6,name:"cancelado",box:{tipe:0,options:[{show:"cancelado",value:1,class:"text-success h4"},{show:"pendiente",value:0,class:"text-danger h4"}]},sql:8,tipe:2},
                  //{name:"metodo",box:{tipe:3,options:metodo_options},sql:5,tipe:2,col:6},
                ],
              },
              {
                title:"cliente",
                col:6,blocked:false,show:false,
                fields:[
                  
                  {col:1,action:"edit"},
                  {col:1,action:"new"},
                  {col:10,name:"nombre",sql:3,load:0,box:8},
                  
                  {name:"dni"},
                  {name:"celular"},
                  {name:"tipo"},
                  {tipe:1,name:"recoge",box:{tipe:0,options:[{value:1,show:"recoge"},{value:0,show:"delivery"}]},sql:12}, 
                ],
              },
              {
                title:"delivery",
                col:6,blocked:false,show:false,
                fields:[

                  {tipe:1,name:"empresa",sql:7,box:3,load:1},
                  {name:"costo de delivery",box:Box_Soles()},
                  {name:"zona"},
                  {name:"direccion"},
                  {name:"referencia"},
                  {name:"gps"},
                ],
              }
            ],
            events:[
              {
                name:"boxUpdate",
                actions:[{
                  name:"filter",
                  action:({k,field})=>{

                    //console.log("sales -> boxUpdate; field:",field,"k:",k);
                    if(field.name=="nombre"){

                      k.CallEvent({name:"ClienteFilter"});
                      k.CallEvent({name:"RecogeFilter"});
                    }
                  }
                }],
              },
              {
                name:"printAfter",
                actions:[{
                  action:({k})=>{

                    k.CallEvent({name:"ClienteFilter"});
                    k.CallEvent({name:"RecogeFilter"});
                  }
                }],
              },
              {
                name:"oneLoaded",
                actions:[{
                  action:({k})=>{

                    k.CallEvent({name:"ClienteFilter"});
                    k.CallEvent({name:"RecogeFilter"});
                  }
                }],
              },
              {
                name:"setState",
                actions:[{
                  action:({k,state})=>{

                    //if(state=="new"&&k._recive!=null&&k._recive.from!=null)PageSend({url:k._recive.from});
                  }
                }]
              },
              {
                name:"ClienteFilter",
                actions:[{
                  name:"base",
                  action:({k})=>{
                    
                    var v_cliente = k.Body_GetValue({fieldName:"nombre",y:0});
                    var v_dni = "";
                    var v_cel="";
                    var v_tipo = "";
                    var v_recoge = "";
                    var v_zona = "";
                    var v_deliv = 0;
                    var v_dir = "";
                    var v_ref = "";
                    var v_gps = "";
      
                    var ld = k.Loads_GetData({loadIndex:0});
                    var line = ld.find(ldi=>ldi.value==v_cliente);
                   
                    if(line){
      
                      //console.log(line);
                      v_dni=line["dni"];
                      v_cel=line["cel"];
                      v_tipo=line["tipo"];
                      v_recoge=line["recoge"];
                      v_zona=line["zona"];
                      v_deliv=line["deliv"];
                      v_dir=line["dir"];
                      v_ref=line["ref"];
                      v_gps=line["gps"];
      
                      if(v_deliv == null) v_deliv = 0;
                    }
                   
                    //console.log("cliente id:",v_cliente,"line:",line);
      
                    k.Body_SetValue({y:0,fieldName:"dni",value:v_dni});
                    k.Body_SetValue({y:0,fieldName:"celular",value:v_cel});
                    k.Body_SetValue({y:0,fieldName:"tipo",value:v_tipo});
                    k.Body_SetValue({y:0,fieldName:"recoge",value:v_recoge});
      
                    k.Body_SetValue({y:0,fieldName:"zona",value:v_zona});
                    k.Body_SetValue({y:0,fieldName:"costo de delivery",value:v_deliv});
                    k.Body_SetValue({y:0,fieldName:"direccion",value:v_dir});
                    k.Body_SetValue({y:0,fieldName:"referencia",value:v_ref});
                    k.Body_SetValue({y:0,fieldName:"gps",value:v_gps});
      
                    k.Body_SetValue({y:0,fieldName:"total delivery",value:v_deliv,fieldUpdateAdd:true});
      
                    //Ventas_CalculateTotal();
                  }
                }],
              },
              {
                name:"RecogeFilter",
                actions:[{
                  name:"base",
                  action:({k})=>{

                    var v_recoge = k.Body_GetValue({fieldName:"recoge",y:0})==0;
                    var w_deliv = k.Body_GetWindow({windowIndex:3});
                    w_deliv.Conteiner_Show({show:v_recoge,ignoreBlock:true});
                  }
                }]
              },
            ],
          });


        }
      
        if(control.clientes.active){
      
          control.clientes.build=new Crud({
            modal:control.ventas.active,
            parent:control.clientes.parent,
            title:"cliente",tipe:"form",h:0,
            tables:["clientes","zonas","customers_types"],
            loads:[
              {
                table_main:1,
                selects:[
                  {table:1,field:0,as:"value"},
                  {table:1,field:1,as:"show"},
                  {table:1,field:3,as:"deliv"},
                ],
              }
              ,2
            ],
            windows:[
              {
                title:"cliente",
                fields:[

                  {col:6,name:"id",sql:0},
                  {col:6,name:"fecha de ingreso",sql:1},

                  {col:6,name:"activo",sql:2,box:6},
                  {col:6,name:"recoge",sql:11,box:6},

                  {col:4,name:"metodo",sql:10,box:{tipe:3,options:metodo_options}},
                  {col:4,name:"documento",sql:12,box:{tipe:3,options:documentos_options}},
                  {col:4,name:"tipo",sql:13,box:3,load:1},

                  {name:"nombre",sql:3,box:1},
                  {name:"dni",sql:4,box:1},
                  {name:"celular",sql:8,box:1},

                ],
              },
              {
                title:"direccion",
                fields:[

                  {col:1,action:"edit"},
                  {col:1,action:"new"},
                  {col:10,name:"zona",sql:6,box:8,load:0},
                  {name:"delivery",box:Box_Soles()},
                  {name:"direccion",sql:5,box:1},
                  {name:"referencia",sql:7,box:1},
                  {name:"gps",sql:9,box:1},
                ],
              }
            ],
            events:[
              {
                name:"printAfter",
                actions:[{
                  action:({k})=>{

                    k.CallEvent({name:"filterRecoge"});
                    k.CallEvent({name:"filterDeliv"});
                  }
                }]
              },
              {
                name:"boxUpdate",
                actions:[{
                  action:({k,field})=>{

                    if(field.name=="recoge") k.CallEvent({name:"filterRecoge"});
                    if(field.name=="zona") k.CallEvent({name:"filterDeliv"});
                  }
                }]
              },
              {
                name:"oneLoaded",
                actions:[{
                  action:({k,load})=>{

                    if(load.index==0) k.CallEvent({name:"filterDeliv"});
                  }
                }],
              },
              {
                name:"filterRecoge",
                actions:[{
                  name:"base",
                  action:({k})=>{

                    var recoge_v = k.Body_GetValue({fieldName:"recoge",y:0}) == "1";

                    var deliv_w = k.Body_GetWindow({windowIndex:1});
                    deliv_w.Conteiner_Show({show:!recoge_v,slow:true,ignoreBlock:true});

                  }
                }],
              },
              {
                name:"filterDeliv",
                actions:[{
                  name:"base",
                  action:({k})=>{

                    var zona_v = k.Body_GetValue({fieldName:"zona",y:0});

                    var deliv_v = 0;

                    var zona_load = k.Loads_Get({loadIndex:0});
                    var zona_info = zona_load.data.find(d=>d.value==zona_v);
                    if(zona_info!=null){

                      deliv_v = parseFloat(zona_info["deliv"]);
                    }

                    k.Body_SetValue({fieldName:"delivery",value:deliv_v,y:0});

                  }
                }],
              }
            ],
          });

        }

        if(control.ventas.active&&control.clientes.active){

          new Crud_Master({
            master:{
              event:"edit",
              fieldName:"nombre",
              build:control.ventas.build,
            },
            maid:{
              fieldSqlIndex:0,
              build:control.clientes.build,
            }
          });
        }
      
        if(control.zonas.active){
      
          control.zonas.build=new Crud({
            modal:control.clientes.active,
            parent:control.zonas.parent,
            title:"zona",tipe:"form",h:0,
            tables:["zonas","macro"],
            loads:[1],
            windows:[
              {
                title:"informacion general",
                fields:[
                  {col:6,name:"id",sql:0},
                  {col:6,name:"activo",sql:4,box:6},
                  {name:"nombre",sql:1,box:1},
                  {col:6,name:"macro",tipe:1,sql:2,load:0,box:3},
                  {col:6,name:"delivery",sql:3,box:1},
                  
                ],
              }
            ],
          });
        }

        if(control.clientes.active&&control.zonas.active){
      
          new Crud_Master({
            master:{
              event:"edit",
              fieldName:"zona",
              build:control.clientes.build,
            },
            maid:{
              fieldSqlIndex:0,
              build:control.zonas.build,
            }
          });
        }
      
        if(control.productos.active){
      
          control.productos.build = new Crud({
            parent:control.productos.parent,
            stateStart:(control.stateNew?"block":"reload"),
            fieldsUpdateSave:false,tipe:"table",
            title:"productos",
            stateStart:"new",
            states:[
              {
                name:"reload",
                tools:[
                  {name:"sizes",show:false,value:10},
                ],
              }
            ],
            tables:["ventas_productos","productos"],
            loads:[{
              table_main:1,
              selects:[
                {table:1,field:0,as:"value"},
                {table:1,field:1,as:"show"},
            
                {table:1,field:2,as:info_options[0].show},
                {table:1,field:3,as:info_options[1].show},
                {table:1,field:4,as:info_options[2].show},
                {table:1,field:5,as:info_options[3].show},
                {table:1,field:6,as:info_options[4].show},
                {table:1,field:7,as:info_options[5].show},
              ],
            }],
            fields:[
              {action:"delete"},
              //{name:"id",sql:{field:0},box:{tipe:0}},
              //{name:"venta id",sql:{field:2},box:{tipe:0}},
              //{name:"producto id",sql:{field:5},box:{tipe:1}},
              {name:"info",sql:3,box:{tipe:3,options:info_options}},
              {name:"producto",sql:5,box:8,load:0,size:500},
              {name:"cantidad",sql:7,box:{tipe:1,default:1},size:50},
              {name:"costo unitario",size:100,box:Box_Soles(),sql:6},
              {name:"costo total",size:100,box:Box_Soles()},
            ],
            events:[
              {
                name:"boxUpdate",
                actions:[{
                  action:({k,y})=>{

                    Productos_ProductoCalculateTotal({k,y});
                    //Ventas_CalculateProductosTotal();
                  }
                }],
              },
              {
                name:"printAfter",
                actions:[{
                  action:({k,data})=>{

                    for (let y = 0; y < data.length; y++) {

                      Productos_ProductoCalculateTotal({k,y});           
                    }
                    //Ventas_CalculateProductosTotal();
                  }
                }]
              }
            ],
          });

          function Productos_ProductoCalculateTotal({k,y}) {

            /*var producto_id = k.Print_GetValue({fieldName:"producto",y});
            var info = k.Print_GetValue({fieldName:"info",y});

            var cantidad = k.Print_GetValue({fieldName:"cantidad",y});
            if(cantidad=="") cantidad = 0;
            else cantidad = parseFloat(cantidad);

            var precioUnitario = 0;
            var precioTotal = 0;

            var load = k.Loads_GetData({loadIndex:0});
            var data = load.find(ld=>ld.value==producto_id);
            if(data!=null){

              precioUnitario = parseFloat(data[info]);
              precioTotal = parseFloat(precioUnitario*cantidad);    
            }
                    

            k.Print_SetValue({fieldName:"costo unitario",value:precioUnitario,y,fieldUpdateAdd:true});
            k.Print_SetValue({fieldName:"costo total",value:precioTotal,y});*/

          }

        }

        if(control.ventas.active&&control.productos.active){
      
          new Crud_Master({
            master:{
              event:"reload",
              selectName:"primary",
              build:control.ventas.build,
            },
            maid:{
              fieldSqlIndex:2,
              build:control.productos.build,
            }
          });
        }
      
        if(control.pagos.active){
      
          control.pagos.build = new Crud({
            parent:control.pagos.parent,tipe:"table",
            //stateStart:(control.pago.active?"block":"reload"),
            //states:[{name:"reload",tools:[{name:"reload",show:false}]}],
            title:"lista de transferencias",
            h:0,blocked:false,
            tables:["ventas_transacctions","transactions","transactions_tags","accounts"],
            selects:[
              {table:0,field:2,as:"pago id"},
              {table:1,field:2,as:"total"},
              {table:1,field:6,as:"ingreso"},
              {table:2,field:1,as:"etiqueta"},
              {table:3,field:1,as:"cuenta"},
            ],
            joins:[
              {main:{table:0,field:2},join:{table:1,field:0}},
              {main:{table:1,field:3},join:{table:2,field:0}},
              {main:{table:1,field:4},join:{table:3,field:0}},
            ],
            fields:[
              {action:"delete"},
              {action:"edit"},
              //{name:"id",sql:0},
              //{name:"venta id",sql:1,box:1},
              //{name:"pago id",sql:2,box:1},
              {name:"total",selectName:"total",box:Box_Soles({limit:true})},
              //{name:"ingreso",requestName:"ingreso",box:{tipe:0,options:[{show:"(+)",value:1},{show:"(-)",value:0}]}},
              {name:"etiqueta",selectName:"etiqueta"},
              {name:"metodo",selectName:"cuenta"},
              
            ],
            events:[
              {
                name:"printBefore",
                actions:[{
                  action:({k,data})=>{

                    data.forEach(di => {
                      
                      var v_total = parseFloat(di["total"]);
                      var v_ingreso = parseInt(di["ingreso"]) == 1;
                      if(!v_ingreso) di["total"] = -v_total;
                    });

                    return {data};
                  }
                }],
              },
              {
                name:"reloaded",
                actions:[{
                  action:()=>{

                    //Ventas_CalculateTotalPagado();
                  }
                }]
              }
            ],
          });

          function Pagos_Filter_Ingreso() {
            
            var crud_pagos = control.pagos.build;
            if(crud_pagos){


            }
          }

          if(control.ventas.active){

            new Crud_Master({
              master:{
                event:"reload",
                selectName:"primary",
                build:control.ventas.build,
              },
              maid:{
                fieldSqlIndex:1,
                build:control.pagos.build,
              }
            });
          }
          
        }
      
        if(control.pago.active){
      
          control.pago.build=new Crud({
            modal:(control.pagos.active),
            parent:control.pago.parent,tipe:"form",
            title:"pago",
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
                title:"informacion general",
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
                name:"oneLoadedBefore",
                actions:[{
                  action:({load,data})=>{

                    if(load.index==0){
                      
                      return {data:data.filter(di=>["venta","regularizaciones"].findIndex(t=>t==di.show)!=-1)};
                    }   
                    
                    if(load.index==1){

                      return {data:data.filter(di=>["Caja Chica","BCP","Interbank"].findIndex(t=>t==di.show)!=-1)};
                    }
                  }
                }],
              },
              {
                name:"boxUpdate",
                actions:[{
                  action:({k,field,y})=>{
                    if(field.name=="etiqueta"){
                      
                      Pago_FIlter_IngresoByTag({k,y:0});
                    }
                  }
                }],
              },
              {
                name:"printAfter",
                actions:[{
                  action:({k})=>{

                    Pago_FIlter_IngresoByTag({k,y:0});
                  }
                }],
              },
            ],
          });

          function Pago_FIlter_IngresoByTag({k,y}) {
            
              var ingreso = "0";
              var etiqueta_id = k.Body_GetValue({fieldName:"etiqueta",y});
              var load = k.Loads_GetData({loadIndex:0});
              var data = load.find(ld=>ld.value == etiqueta_id);
              if(data!=null) ingreso = data["ingreso"];

              k.Body_SetValue({fieldName:"ingreso",y,value:ingreso,fieldUpdateAdd:true});

          }

          if(control.pagos.active){
      
            new Crud_Master({
              master:{
                event:"edit",
                selectName:"pago id",
                build:control.pagos.build,
                deleteChild:true,
              },
              maid:{
                fieldSqlIndex:0,
                build:control.pago.build,
              }
            });
          }
          
        }
        
        
      }
    });
  
  })