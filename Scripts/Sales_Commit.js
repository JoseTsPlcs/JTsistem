
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      new Form_Table({
        title:'ventas no entregadas',
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
          {and:true,conditions:[
            {and:true,table:0,field:16,inter:'=',value:0},//no anulado
            {and:true,table:0,field:11,inter:'=',value:0},//no entragado
          ]}
        ],
        filters:[
          {name:'cliente',conection:{table:1,field:3,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'pagado',conection:{table:0,field:8},box:Box_MutipleDual({show:'pagado'})},
          {name:'armado',conection:{table:0,field:10},box:Box_MutipleDual({show:'armado'})},
        ],
        fields:[
          {edit:true},
          {name:'cliente',conection:{table:1,field:3},attributes:[{name:'style',value:'min-width:200px'}]},
          {name:'confirmado',conection:{table:0,field:1},box:Box_ShowOptions({show:'confirmado'})},
          {name:'pagado',conection:{table:0,field:8},box:Box_ShowOptions({show:'pagado'})},
          {name:'armado',conection:{table:0,field:10},box:Box_ShowOptions({show:'armado'})},
          {name:'fecha',conection:{table:0,field:2},attributes:[{name:'style',value:'min-width:100px'}]},

          
          //{name:'entregado',conection:{table:0,field:11},box:Box_ShowOptions({show:'entregado'})},
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
