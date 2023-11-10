
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      new Form_Table({
        title:'control diario de ventas',
        h_min:500,
        tables:['ventas','clientes','usuarios'],
        selects:[
          {table:1,field:3,as:'0_3'},
        ],
        joins:[
          {main:{table:0,field:3},join:{table:1,field:0}},//clientes
          {main:{table:0,field:9},join:{table:2,field:0}},//usuarios
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
        filters:[
          {name:'fecha min',conection:{table:0,field:2,inter:'>='},box:{tipe:2,default: Date_Today()}},
          {name:'fecha max',conection:{table:0,field:2,inter:'<='},box:{tipe:2,default: Date_Today()}},
          {name:'cliente',conection:{table:1,field:3,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'confirmado',conection:{table:0,field:1},box:Box_MutipleDual({show:'confirmado'})},
          {name:'pagado',conection:{table:0,field:8},box:Box_MutipleDual({show:'pagado'})},
          {name:'metodo',conection:{table:0,field:5},box:{tipe:4,options:metodo_options}},
          {name:'armado',conection:{table:0,field:10},box:Box_MutipleDual({show:'armado'})},
          {name:'entregado',conection:{table:0,field:11},box:Box_MutipleDual({show:'entregado'})},
          {name:'despacho',conection:{table:0,field:12},box:Box_MutipleDual({show:'recoge',show2:'delivery'})},
          {name:'anulados',conection:{table:0,field:16},box:{...Box_MutipleDual({show:'anulados',show2:'sin anular'}), default:['sin anular']}},
          {name:'documentos',conection:{table:0,field:14},box:{tipe:4,options:documentos_options}},
        ],
        fields:[
          {edit:true},
          {name:'cliente',conection:{table:1,field:3},attributes:[{name:'style',value:'min-width:200px'}]},
          {name:'comentario',field:13,box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:300px'}]},
          {name:'confirmado',conection:{table:0,field:1},box:{tipe:6}},
          {name:'pagado',conection:{table:0,field:8},box:{tipe:6}},
          {name:'total',conection:{table:0,field:4},box:Box_Soles()},
          {name:'metodo',conection:{table:0,field:5},box:{tipe:3,options:metodo_options}},
          {name:'cajero',conection:{table:0,field:9},box:{tipe:3},load:0},
          {name:'armado',conection:{table:0,field:10},box:{tipe:6}},
          {name:'entregado',conection:{table:0,field:11},box:{tipe:6}},
          {name:'despacho',conection:{table:0,field:12},box:{tipe:0,options:[{show:'recoge',value:1},{show:'delivery',value:0}]}},
          {name:'empresa delivery',conection:{table:0,field:7},box:{tipe:3},load:0},
          {name:'documento',conection:{table:0,field:14},box:{tipe:3,options:documentos_options}},
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
        ],
      });
    }
  });

})
