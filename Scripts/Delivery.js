
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      const grid = new Grid({
        cols:[[12],[12]],
        
      });

      new Form_Table({
        parent: grid.GetColData({x:0,y:0}).col,
        title:'deliverys entregados diario',
        h_min:500,
        tables:['ventas','clientes','usuarios','zonas'],
        selects:[
          {table:1,field:3,as:'0_3'},
        ],
        joins:[
          {main:{table:0,field:3},join:{table:1,field:0}},//cliente
          {main:{table:0,field:9},join:{table:2,field:0}},//usuarios caja
          {main:{table:1,field:6},join:{table:3,field:0}}//zonas
        ],
        loads:[
          {
            table_main:2,
            selects:[
              {table:2,field:0,as:'value'},
              {table:2,field:1,as:'show'},
            ],
          }
        ],
        states:[{name:'reload',tools:[
          {name:'sizes',value:999,show:false},
          {name:'pages',show:false},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
          {name:'delete',show:false},
          {name:'save',show:false},
          {name:'new',show:false},
        ]}],
        conditions:[
          {and:true,conditions:[
            {and:true,table:0,field:16,inter:'=',value:0},//no anulado
            {and:true,table:0,field:12,inter:'=',value:0},//no recoge

          ]},
        ],
        filters:[
          {name:'fecha min',conection:{table:0,field:2,inter:'>='},box:{tipe:2,default: Date_Today()}},
          {name:'fecha max',conection:{table:0,field:2,inter:'<='},box:{tipe:2,default: Date_Today()}},
          {name:'cliente',conection:{table:1,field:3,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'entregado',conection:{table:0,field:11},box:{...Box_MutipleDual({show:'entregado'}), default:['entregado']}},
        ],
        fields:[
          {edit:true},
          {name:'cliente',conection:{table:1,field:3},attributes:[{name:'style',value:'min-width:200px'}]},
          {name:'zona',conection:{table:3,field:1}},

          {name:'delivery',conection:{table:0,field:6},box:Box_Soles()},
          {name:'empresa',conection:{table:0,field:7},box:{tipe:3},load:0},

          //{name:'cajero',conection:{table:0,field:9},box:{tipe:3},load:0},
          {name:'pagado',conection:{table:0,field:8},box:{tipe:6}},
          {name:'total',conection:{table:0,field:4},box:Box_Soles()},
          {name:'metodo',conection:{table:0,field:5},box:{tipe:3,options:metodo_options}},

          {name:'fecha',conection:{table:0,field:2},attributes:[{name:'style',value:'min-width:100px'}]},
        ],
        events:[
          {name:'edit_update',action:({data})=>{

            if(data){

              const pri = data['PRIMARY'];
              if(pri){

                page.PageSend({url:'Factura.php?nro=' + pri});
              }
            }
          }},
          {name:'reload_after',action:(i)=>{

            CalculateDeliveryPay(i);
          }}
        ],
      });

      const tb = new Table_Grid({
        parent: grid.GetColData({x:0,y:1}).col,
        headers:[{name:'empresa'},{name:'delivery'},{name:'efectivo'}],
      });

      function CalculateDeliveryPay({data}) {
        
        var empresas = [
            {name:'QK',id:0,total:0,cash:0,pay:0},
            {name:'Multiservice',id:9,total:0,cash:0,pay:0},
        ];

        if(data != null){
            
            //crear lista de empresas sin repetir
            
          console.log(data);
          
          empresas.forEach(empresa=>{
              
              data.forEach(d=>{
                  
                  if(d['0_7'] == empresa.id){
                    
                    var value = parseFloat(d['0_6']);
                    empresa.total += value;
                    if(/*d['0_9']!=0 &&*/ d['0_5']==metodo_options[0].value) empresa.cash += value;
                  }
              });
          })
          empresas.forEach(empresa=>{
              
              empresa.pay = empresa.total - empresa.cash;
          });
          
          console.log(empresas);
        }

        tb.Clear();
        
        var lines = empresas.map((empresa)=>{
            
            return [
                {box:{tipe:0,default:empresa.name}},
                {box:Box_Soles({total:empresa.total})},
                {box:Box_Soles({total:empresa.cash})},
                {box:{tipe:0,default:(empresa.pay<0?'nos debe':'pagar') + ' S/.' + Math.abs(empresa.pay).toFixed(2)}},
            ];
        });
        
        console.log(lines);
        
        tb.AddLines({lines:lines});

      }
    }
  });

})
