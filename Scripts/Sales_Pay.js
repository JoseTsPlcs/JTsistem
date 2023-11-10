
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      new Form_Table({
        title:'pedidos entregados con pago pendiente',
        h_min:500,
        tables:['ventas','clientes'],
        selects:[
          {table:1,field:3,as:'0_3'},
        ],
        joins:[
          {main:{table:0,field:3},join:{table:1,field:0}}
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
          {
            and:true,
            conditions:[
              {and:true,table:0,field:8,inter:'=',value:0},//no pagados
              {and:true,table:0,field:16,inter:'=',value:0},//no anulados
              {and:true,table:0,field:11,inter:'=',value:1},//entregado
            ],
          }
        ],
        filters:[
          {name:'cliente',conection:{table:1,field:3,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'confirmado',conection:{table:0,field:1},box:{...Box_MutipleDual({show:'confirmado'})}},
        ],
        fields:[
          {edit:true},
          {name:'cliente',conection:{table:1,field:3},attributes:[{name:'style',value:'min-width:200px'}]},
          {name:'confirmado',conection:{table:0,field:1},box:Box_ShowOptions({show:'confirmado',show2:'pendiente'})},
          {name:'pagado',conection:{table:0,field:8},box:{tipe:6}},
          {name:'total',conection:{table:0,field:4},box:Box_Soles()},
          {name:'metodo',conection:{table:0,field:5},box:{tipe:3,options:metodo_options}},
          {name:'entregado',conection:{table:0,field:11},box:Box_ShowOptions({show:'entregado',show2:'pendiente'})},
          {name:'fecha',conection:{table:0,field:2},attributes:[{name:'style',value:'min-width:100px'}]},

          //{name:'anulado',conection:{table:0,field:16},box:Box_ShowOptions({show:'anulado'})},
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
        ],
      });
    }
  });

})
