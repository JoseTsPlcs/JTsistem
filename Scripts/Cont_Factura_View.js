
$(document).ready(function() {

    new Pag_Base({
  
      success:({page,recive})=>{
        //if(recive == null) recive = {name:'search',value:1};
        
        const mst = new Master({
          title:'vista de factura',
          cols:[[12],[12]],
          forms:[
            {
              tipe:2,
              x:0,y:0,
              form:{
                state_base:'search',
                state_start:'add',
                states:[
                  {name:'add',tools:[{name:'add',show:false}]},
                  {name:'search',tools:[{name:'save',show:false},{name:'delete',show:false}]}
                ],
                recive:recive,
                page:page,
                title:'informacion de venta',
                tables:['ventas','clientes'],
                loads:[{table:1}],
                joins:[
                  {main:{table:0,field:3},join:{table:1,field:0}},
                ],
                modulos:{
                  cols:[[12]],
                  windows:[
                    {
                      x:0,y:0,
                      title:'informacion',
                      cols:[[12],[12],[12],[6,6],[12],[12],[12],[12]],
                      fields:[
                        {x:0,y:0,name:'fecha',field:2},
                        {x:0,y:1,name:'nombre',conection:{table:1,field:3}},
                        {x:0,y:2,name:'ruc',conection:{table:1,field:4}},
                        {x:0,y:3,tipe:2,name:'entregado',field:11,box:Box_Dual({show:'entregado'})},
                        {x:1,y:3,tipe:2,name:'pagado',field:8,box:Box_Dual({show:'pagado'})},
                        {x:0,y:4,name:'total',box:{...Box_Soles(),class:'h1'}},
                        {x:0,y:5,name:'igv',box:{...Box_Soles(),class:'h4'}},
                        {x:0,y:6,name:'comentario',tipe:2,field:13},
                      ],
                    }
                  ],
                }
              }
            },
            {
              tipe:1,
              x:0,y:1,
              form:{
                state_base:'list',
                state_start:'block',
                states:[
                  {name:'list',tools:[{name:'add',show:false},{name:'save',show:false},{name:'new',show:false}]},
                ],
                title:'lista de productos',
                tables:['ventas_productos','productos'],
                loads:[{table:1}],
                joins:[{main:{table:0,field:5},join:{table:1,field:0}}],
                fields:[
                  {name:'cant',field:7},
                  {name:'info',field:3},
                  {name:'producto',conection:{table:1,field:1}},
                  {box:{tipe:5,class:'btn btn-primary',value:icons.copy},update:false},
                  {name:'cost unid',field:6},
                  {box:{tipe:5,class:'btn btn-primary',value:icons.copy},update:false},
                  {name:'cost total'},

                ],
                events:[
                  {
                    name:'print_before',
                    description:'calculate 118%',
                    action:({data})=>{

                      var total = 0;
                      var igv = 0;

                      if(data!=null){

                        data.forEach(d => {
                          
                          var tot = parseFloat(d['0_6']);
                          
                          var shw = (tot * 100 / 118).toFixed(3);
                          igv += shw;

                          var cant = parseFloat(d['0_7']);
                          total += tot * cant;

                          d['0_6'] = shw;
                          d['cost total'] = (shw * cant).toFixed(3);
                        });
                      }
                      
                      PrintTotal({total:total, totaligv:igv});

                    }
                  },
                  {
                    name:'box_update',description:'copie to dashboard',
                    action:({data,x})=>{

                      console.log('-----data----',data,x);
                      var copi = null;
                      if(x == 3) copi = data['0_3'] + ' ' + data['1_1'];
                      if(x == 5) copi = data['0_6'];

                      if(copi != null) navigator.clipboard.writeText(copi);
                    },
                  }
                ],
              }
            }
          ],
          conections:[
            {
              tipe:1,
              master:{index:0,field:0},
              maid:{index:1,field:2},
            }
          ],

        });

        function PrintTotal({total=0}){

          if(mst != null){

            mst.SetValues({form:mst.GetForm({index:0}),field_name:'total',values:[total]});
            mst.SetValues({form:mst.GetForm({index:0}),field_name:'igv',values:[(total * 18/100)]});
          }
        }
        
      }
    })
  
  });