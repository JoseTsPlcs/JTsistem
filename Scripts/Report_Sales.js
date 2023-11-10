

$(document).ready(function() {

  new Pag_Base({

    success:()=>{

      const grid = new Grid({
        cols:[[4,8],[12],[12],[12]],
        labels:[
          {x:0,y:0,tipe:2,name:'venta neta',box:Box_Soles({clss:'h3 text-success'})},
          {x:0,y:0,tipe:2,name:'#pedidos',box:{tipe:0,default:0,class:'h2'}},

          {x:1,y:0,tipe:1,name:'ventas',box:Box_Soles()},
          {x:1,y:0,tipe:1,name:'deliverys',box:Box_Soles()},
          {x:1,y:0,tipe:1,name:'venta promedio',box:Box_Soles()},

          {x:0,y:1,name:metodo_options[0].show,box:Box_Soles()},
          {x:0,y:1,name:metodo_options[1].show,box:Box_Soles()},
          {x:0,y:1,name:metodo_options[2].show,box:Box_Soles()},
          {x:0,y:1,name:metodo_options[3].show,box:Box_Soles()},

        ]
      });

      function Calculate({data=null}) {
        
        var total = 0;
        var delivs = 0;
        var count = 0;

        var mtds = [0,0,0,0,0];

        var dt = [];

        if(data != null){

          data.forEach(d => {
            
            count++;
            var i_date = d['0_2'];

            var i_mt = d['0_5'];
            var i_m_index = metodo_options.findIndex(op=>op.show == i_mt);

            var i_vt = parseFloat(d['0_4']);
            var i_dlv = parseFloat(d['0_6']);
            var i_neta = i_vt - i_dlv;
            
            total += i_vt;
            delivs += i_dlv;

            mtds[i_m_index] += i_vt;

            //by fechas
            var f = dt.find(u=>u.date == i_date);
            if(f == null){

              dt.push({
                date: i_date,
                total: [0,0,0,0,0,0,0],
              });

              dt[dt.length-1].total[0] = i_neta;
              dt[dt.length-1].total[1] = i_vt;
              dt[dt.length-1].total[2] = i_dlv;
              dt[dt.length-1].total[i_m_index+3] = i_vt;
            }
            else{

              f.total[0] += i_neta;
              f.total[1] += i_vt;
              f.total[2] += i_dlv;
              f.total[i_m_index+3] += i_vt;
            }


          });
        }

        dt.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date);
        });

        var neta = total - delivs;
        var prom = total/count;

        grid.GetColData({x:0,y:0}).labels[0].GetBox().SetValue(neta);
        grid.GetColData({x:0,y:0}).labels[1].GetBox().SetValue(count);
        grid.GetColData({x:1,y:0}).labels[0].GetBox().SetValue(total);
        grid.GetColData({x:1,y:0}).labels[1].GetBox().SetValue(delivs);
        grid.GetColData({x:1,y:0}).labels[2].GetBox().SetValue(prom);

        grid.GetColData({x:0,y:1}).labels[0].GetBox().SetValue(mtds[0]);
        grid.GetColData({x:0,y:1}).labels[1].GetBox().SetValue(mtds[1]);
        grid.GetColData({x:0,y:1}).labels[2].GetBox().SetValue(mtds[2]);
        grid.GetColData({x:0,y:1}).labels[3].GetBox().SetValue(mtds[3]);

        var lns = [];
        dt.forEach(dti => {
          
          lns.push([
            {box:{tipe:0,default:dti.date}},
            
            {box:Box_Soles({total:dti.total[0]})},
            {box:Box_Soles({total:dti.total[1]})},
            {box:Box_Soles({total:dti.total[2]})},
            {box:Box_Soles({total:dti.total[3]})},
            {box:Box_Soles({total:dti.total[4]})},
            {box:Box_Soles({total:dti.total[5]})},
            {box:Box_Soles({total:dti.total[6]})},
          ]);
        });

        tb.Clear();
        tb.AddLines({lines:lns});
      }
      const tb = new Table_Grid({
        parent: grid.GetColData({x:0,y:2}).col,
        headers:[
          {name:'fecha',attributes:[{name:'style',value:'min-width:120px'}]},
          {name:'venta neta'},
          {name:'venta'},
          {name:'deliv'},
          {name:metodo_options[0].show},
          {name:metodo_options[1].show},
          {name:metodo_options[2].show},
          {name:metodo_options[3].show},
        ],
      });

      new Form_Table({
        parent: grid.GetColData({x:0,y:2}).col,
        title:'ventas',
        tables:['ventas','clientes'],
        loads:[{table:1}],
        states:[{name:'reload',tools:[
          {name:'save',show:false},
          {name:'new',show:false},
          {name:'sizes',show:false,value:999},
          {name:'pages',show:false},
          {name:'page_back',show:false},
          {name:'page_next',show:false},
        ]}],
        selects:[
          {table:0,field:4,as:'total'},
          {table:0,field:6,as:'delivery'},
        ],
        conditions:[
          {
            and:true,
            conditions:[
              {table:0,field:16,inter:'=',value:0},//no anulado
              //{table:0,field:1,inter:'=',value:1},//confirmado
            ]
          },
        ],
        filters:[
          {name:'fecha min',conection:{table:0,field:2,inter:'>='},box:{tipe:2,default: Date_FirstOfMoth()}},
          {name:'fecha max',conection:{table:0,field:2,inter:'<='},box:{tipe:2,default: Date_LastOfMoth()}},
          {name:'confirmado',conection:{table:0,field:1,inter:'='},box:Box_MutipleDual({show:'confirmado',dlft:['confirmado','no confirmado']})}
        ],
        fields:[
          {name:'fecha',conection:{table:0,field:2},attributes:[{name:'style',value:'min-width:120px'}]},
          {name:'venta',conection:{table:0,field:4},box:Box_Soles()},
          {name:'deliv',conection:{table:0,field:6},box:Box_Soles()},
          {name:'venta neta',box:Box_Soles()},
          {name:'metodo',conection:{table:0,field:5}},
          {name:'confirmado',conection:{table:0,field:1},box:Box_Dual({show:'confirmado'})}
        ],
        events:[
          {name:'print_before',description:'calculate total', action:({data, k})=>{

            if(data!=null){

              data.forEach(d => {
                
                var tot = parseFloat(d['0_4']);
                var dlv = parseFloat(d['0_6']);
                var neta = tot-dlv;
                d['venta neta'] = neta;
              });
            }

            Calculate({data:data});
          }}
        ],
      });

    }
  });

});
