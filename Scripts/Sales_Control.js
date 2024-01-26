
$(document).ready(function() {

  new Pag_Base({

    success:({page})=>{

      var grid = new Grid({
        cols:[[6,6],[6,6],[6,6],[12]],
        boxs:[
          {x:0,y:0,box:{tipe:0,default:"ventas netas:",class:"h2 w-100 text-center"}},
          {x:1,y:0,box:{tipe:0,default:0,class:"h2 w-100 text-success text-center",format:{start:"S/.",decimals:2}}},

          {x:0,y:1,box:{tipe:0,default:"total:",class:"h5 w-100 text-center"}},
          {x:1,y:1,box:{tipe:0,default:0,class:"h5 w-100 text-center",format:{start:"S/.",decimals:2}}},

          {x:0,y:2,box:{tipe:0,default:"delivery:",class:"h5 w-100 text-center"}},
          {x:1,y:2,box:{tipe:0,default:0,class:"h5 w-100 text-center",format:{start:"S/.",decimals:2}}},
        ],
      });

      var salesControl = new Crud_Table({
        parent:grid.GetColData({x:0,y:3}).col,
        filters:[
          {name:"fecha min",box:{tipe:2,default:Date_Today()},sql:{field:2,inter:">="}},
          {name:"fecha max",box:{tipe:2,default:Date_Today()},sql:{field:2,inter:"<="}},
          {name:"anulado",box:{tipe:4,options:[{show:"anulado",value:1},{show:"sin anular",value:0}]}},
        ],
        title:"control de ventas diarias",
        tables:["ventas","usuarios","clientes"],
        selects:[
          {table:2,field:3,as:"cliente"},
          {table:0,field:6,as:"costo deliv"},
        ],
        joins:[
          {main:{table:0,field:3},join:{table:2,field:0}},
        ],
        loads:[1],
        fields:[
          {action:"edit"},
          {name:"nombre",requestName:"cliente",size:200},
          {name:"comentario",sql:13,box:1,size:250},
          {name:"confirmado",sql:1,box:6},

          {name:"pagado",sql:8,box:Box_Dual({show:"pagado",show2:"pendiente"})},
          {name:"total",sql:4,box:Box_Soles()},
          {name:"cajero",sql:9,load:0,box:3},

          {name:"armado",sql:10,box:Box_Dual({show:"armado",show2:"pendiente"})},
          {name:"entregado",sql:11,box:Box_Dual({show:"entregado",show2:"pendiente"})},
          {name:"despacho",sql:12,box:{tipe:0,options:[{show:"recoge",value:1},{show:"delivery",value:0}]}},
          {name:"empresa de delivery",sql:7,box:3,load:0},

          {name:"documento",sql:14,box:{tipe:3,options:documentos_options}},
          {name:"fecha",sql:2,size:100},
          //{name:"metodo",sql:5,box:{tipe:0,options:metodo_options}},
          //{name:"delivery",sql:6,box:Box_Soles()},
          //{name:"emitido sunat",sql:15,box:Box_Dual({show:"emitido",show2:"pendiente"})},
          //{name:"anulado",sql:16,box:Box_Dual({show:"anulado",show2:"-",colorinverse:true})},
          //{name:"delivery gratis",sql:17},
          //{name:"descuento",sql:18},
        ],
        states:[{
          name:"reload",
          tools:[{name:"new",show:true},{name:"sizes",value:999}],
        }],
        events:[
          {
            name:"boxUpdate",
            actions:[
              {
                name:"edit sales",
                action:({field,k,y})=>{

                  if(field.action=="edit"){

                    var primaryValue = k.Data_GetValue({requestName:"primary",y});
                    PageSend({url:"Sales_New.php",send:{
                      action:"reload",
                      params:{lastPage:true},
                      conections:[
                        {
                          fieldSqlIndex:0,
                          value:primaryValue,
                        }
                      ],
                    }});
                  }
                }
              }
            ],
          },
          {
            name:"printAfter",
            actions:[{
              action:({data})=>{

                SalesControl_CalculteTotal({data});
              }
            }]
          },
          {
            name:"newed",
            actions:[{
              action:()=>{

                PageSend({url:"Sales_New.php",send:null});
              }
            }],
          }
        ],
      });

      salesControl.SetActiveOneAction({
        eventName:'newed',
        actionName:'base newed',
        active:false,
      });

      
      function SalesControl_CalculteTotal({data=[]}={}) {
        
        var v_deliv = 0;
        var v_total = 0;

        if(data!=null && data.length > 0){

          data.forEach(di => {
            
            var di_total = parseFloat(di["total"]);
            var di_deliv = parseFloat(di["costo deliv"]);

            if(di_total==null)di_total=0;
            if(di_deliv==null)di_deliv=0;

            v_deliv+=di_deliv;
            v_total+=di_total;

          });
        }

        var v_neta = v_total - v_deliv;

        grid.GetColData({x:1,y:0}).boxs[0].SetValue(v_neta);
        grid.GetColData({x:1,y:1}).boxs[0].SetValue(v_total);
        grid.GetColData({x:1,y:2}).boxs[0].SetValue(v_deliv);
      }

    }
  });

})
