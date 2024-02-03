
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      const conteiner = new Grid({
        cols:[[12],[12]],
        labels:[
          {x:0,y:0,name:'total',box:{...Box_Soles(),class:'h1'}},
          {x:0,y:0,name:'(18%)igv del total',box:{...Box_Soles(),class:'h4'}},
        ],
      });

      new Crud({
        parent: conteiner.GetColData({x:0,y:1}).col,
        tipe:"table",
        title:'lista de facturas',
        tables:['ventas','clientes'],
        selects:[
          {table:1,field:3,as:'0_3'},
          {table:0,field:6,as:'delivery'},
          {table:0,field:4,as:'total'},
        ],
        joins:[
          {main:{table:0,field:3},join:{table:1,field:0}},//clientes
        ],
        conditions:[{
          and:true,
          conditions:[{table:0,field:16,inter:'=',value:0}],
        }],
        states:[{name:'reload',tools:[
          {name:'sizes',value:10,show:false},
          {name:'pages',show:false},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
          {name:'delete',show:false},
          {name:'save',show:false},
          {name:'new',show:false},
        ]}],
        filters:[
          {name:'fecha min',sql:{table:0,field:2,inter:'>='},box:{tipe:2,default: Date_FirstOfMoth()}},
          {name:'fecha max',sql:{table:0,field:2,inter:'<='},box:{tipe:2,default: Date_LastOfMoth()}},
          {name:'cliente',sql:{table:1,field:3,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
          {name:'documentos',sql:{table:0,field:14},box:{tipe:4,options:documentos_options,default:['boleta','factura']}},
          {name:'emitido',sql:{table:0,field:15},box:{...Box_MutipleDual({show:'emitido'}),default:['no emitido']}},
        ],
        fields:[
          {action:"edit",send:{page:page,url:'Cont_Factura_View.php',send:{name:'search'}}},
          {name:'cliente',sql:{table:1,field:3},attributes:[{name:'style',value:'min-width:200px'}]},
          {name:'dni/ruc',sql:{table:1,field:4},attributes:[{name:'style',value:'min-width:100px'}]},
          //{name:'total',sql:{table:0,field:4},box:Box_Soles()},
          //{name:'delivery',field:6,box:Box_Soles()},
          {name:'total neto',box:Box_Soles()},
          {name:'pagado',sql:{table:0,field:8},box:Box_ShowOptions({show:'pagado'})},
          {name:'entregado',sql:{table:0,field:11},box:Box_ShowOptions({show:'entregado'})},
          {name:'documento',sql:{table:0,field:14},box:{tipe:3,options:documentos_options}},
          {name:'fecha',sql:{table:0,field:2},attributes:[{name:'style',value:'min-width:100px'}]},
          {name:'emitido',sql:15,box:{tipe:6}},
        ],
        events:[
          {
            name:'print_before',
            description:'print total without delivery',
            action:({data})=>{

              if(data!=null){

                data.forEach(d => {
                  
                  d['total neto'] = parseFloat(d['total']) - parseFloat(d['delivery']);
                });
              }
            }
          },
          {
            name:'print_after',
            description:'print total facturas',
            action:({data})=>{

              if(data!=null){

                var total = 0;
                data.forEach(d => {
                  
                  var d_tot = parseFloat(d['total neto']);
                  total += d_tot;
                });

                if(conteiner!=null){

                  conteiner.GetColData({x:0,y:0}).labels[0].GetBox().SetValue(total);

                  const igv = (total*(18/100)).toFixed(2);
                  conteiner.GetColData({x:0,y:0}).labels[1].GetBox().SetValue(igv);
                }
              }
            }
          }
        ],
      });
    }
  });

})
