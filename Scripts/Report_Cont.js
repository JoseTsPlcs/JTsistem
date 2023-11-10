

$(document).ready(function() {

  new Pag_Base({

    success:({screenload})=>{

      const lines_init = [
        {name:'ventas',ingreso:true,total:0},
        {name:'delvierys',ingreso:false,total:0},
        {name:'compras de insumos',ingreso:false,total:0},
        {name:'transporte de insumos',ingreso:false,total:0},
        {name:'impuestos por facturas(18%)',ingreso:false,total:0},
      ];
      var lines = [...lines_init];

      //-------------------------

      const grid = new Grid({
        cols:[[12],[12]],

      });

      const flt = new Window({
        parent: grid.GetColData({x:0,y:0}).col,
        title:'filtro',
        grid:{
          cols:[[12],[12],[12]],
          labels:[
            {x:0,y:0,name:'fecha min',box:{tipe:2,default:Date_FirstOfMoth()}},
            {x:0,y:1,name:'fecha max',box:{tipe:2,default:Date_LastOfMoth()}},
            {x:0,y:2,name:'reload',box:{tipe:5,class:'btn btn-outline-primary btn-sm',default:'reload',update:()=>{Reload()}}}
          ],
        },
        events:[],
      });
      
      const shw = new Window({
        parent:grid.GetColData({x:0,y:1}).col,
        title:'flujo',
        grid:{
          cols:[[12]],
        }
      });

      const tb = new Table_Grid({
        parent: shw.Conteiner_GetColData({x:0,y:0}).col,
        headers:[
          {name:'descripcion'},
          {name:'ingreso'},
          {name:'egreso'},
        ]
      });

      //----------------------------

      const db = new dataBase();
      const lds = new LoadsData({
        log:true,
        events:[{name:'loads_end',actions:[{description:'load all tables',action:()=>{

          console.log(lds.GetData());

          screenload.SetState({state:false});
          SetLines();
          Calculate();
          Print();
        }}]}]
      });
      db.SetTables({tables:['ventas','buys','transactions','transactions_tags']});

      function Reload() {
        
        console.log("------------reload-----------");
        
        screenload.SetState({state:true});
        lds.Load({
          database:db,
          loads:[
            //ventas 0
            {
              table_main:0,
              selects:[
                {table:0,field:4,as:'venta'},
                {table:0,field:6,as:'delivery'},
                {table:0,field:2,as:'fecha'},
                {table:0,field:16,as:'anulado'},
                {table:0,field:14,as:'document'},
              ],
              conditions:[{
                and:true,
                conditions:[
                  {table:0,field:2,inter:'>=',value:flt.Conteiner_GetColData({x:0,y:0}).labels[0].GetBox().GetValue()},
                  {table:0,field:2,inter:'<=',value:flt.Conteiner_GetColData({x:0,y:1}).labels[0].GetBox().GetValue()},
                  {table:0,field:16,inter:'=',value:0},
                ],
              }]
            },
            //compras 1
            {
              table_main:1,
              selects:[
                {table:1,field:5,as:'compra'},
                {table:1,field:6,as:'transport'},
              ],
              conditions:[{
                and:true,
                conditions:[
                  {table:1,field:2,inter:'>=',value:flt.Conteiner_GetColData({x:0,y:0}).labels[0].GetBox().GetValue()},
                  {table:1,field:2,inter:'<=',value:flt.Conteiner_GetColData({x:0,y:1}).labels[0].GetBox().GetValue()},
                  //{table:0,field:16,inter:'=',value:0},
                ],
              }]
            },
            //cont 2
            {
              table_main:2,
              selects:[
                {table:2,field:2,as:'total'},
                {table:2,field:6,as:'ingreso'},
                {table:3,field:1,as:'etiqueta'},
              ],
              joins:[
                {main:{table:2,field:3},join:{table:3,field:0}},
              ],
              conditions:[{
                and:true,
                conditions:[
                  {table:2,field:1,inter:'>=',value:flt.Conteiner_GetColData({x:0,y:0}).labels[0].GetBox().GetValue()},
                  {table:2,field:1,inter:'<=',value:flt.Conteiner_GetColData({x:0,y:1}).labels[0].GetBox().GetValue()},
                ],
              }]
            },
            //tags 3
            {
              table_main:3,
              selects:[
                {table:3,field:1,as:'etiquetas'},
                {table:3,field:2,as:'ingreso'},
              ],
              conditions:[{
                and:true,
                conditions:[{
                  table:3,
                  field:3,
                  inter:'=',
                  value:1,
                }],
              }],
            },
          ],
        });
      }

      function SetLines() {
        
        const lns = [...lines_init];
        lds.GetData({index:3}).forEach(e => {
          
          lns.push({
            name:e['etiquetas'],
            ingreso:e['ingreso']=='1',
            total:0,
          });
        });

        lines = lns;
      }

      function Calculate() {
        
        lines.forEach(lds => {
          lds.total = 0;
        });

        lds.GetData({index:0}).forEach(e => {
          
          var venta = parseFloat(e['venta']);
          var deliv = parseFloat(e['delivery']);
          var neta = venta - deliv;

          lines[0].total += venta;
          lines[1].total += deliv;
          if(e['document'] == 'factura') lines[4].total += (neta*18/100);
        });

        lds.GetData({index:1}).forEach(e => {
          
          lines[2].total += parseFloat(e['compra']);
          lines[3].total += parseFloat(e['transport']);
        });

        console.log(lines);
        lds.GetData({index:2}).forEach(e => {
          
          //console.log(lines,'--------lnies');
          var etq = e['etiqueta'];
          if(etq != null){

            var tot = parseFloat(e['total']);
            const lnt = lines.find(u=>u.name==e['etiqueta']);
            console.log(e,tot,lnt);
            
            if(lnt!=null) lnt.total += tot;
          }
        });

        
      }

      function Print() {
        
        tb.Clear();

        var ingreso = 0;
        var egreso = 0;

        var lns = [];
        lines.forEach(lni => {
          
          const bx_none = {tipe:0,default:'-'};
          var ingreso_bx = lni.ingreso ?  Box_Soles({total:lni.total}) : bx_none;
          var egreso_bx = !lni.ingreso ?  Box_Soles({total:lni.total}) : bx_none;

          lns.push([{box:{tipe:0,default:lni.name}},{box:ingreso_bx},{box:egreso_bx}]);

          if(lni.ingreso) ingreso+= lni.total;
          if(!lni.ingreso) egreso+= lni.total;

        });

        var total = ingreso - egreso;

        lns.push([{box:{}},{box:Box_Soles({total:ingreso,clss:'h2 text-success'})},{box:Box_Soles({total:egreso,clss:'h2 text-danger'})}]);
        lns.push([{box:{}},{box:{default:'total:',class:'h1'}},{box:Box_Soles({total:total,clss:'h1'})}]);

        tb.AddLines({lines:lns});
        
        


        
      }

      Reload();


    }
  });

});
