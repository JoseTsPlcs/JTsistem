
$(document).ready(function() {

    new Pag_Base({
  
      success:({page,recive,from})=>{
        //if(recive == null) recive = {name:'search',value:1};
        
        new Master({
          title:'entrada de producto',
          cols:[[12],[12]],
          forms:[
            {
              tipe:2,
              x:0,y:0,
              form:{

                title:'compra',
                states:[
                  {name:'reload',tools:[{name:'new',show:true},{name:'save',show:true}]},
                  {name:'add',tools:[{name:'add',show:false},{name:'delete',show:false}]},
                ],
                state_base:'search',
                recive:recive,
                page:page,
                tables:['buys','providers'],
                loads:[
                  {table:1},
                ],
                modulos:{
                  cols:[[12],[12]],
                  windows:[
                    {
                      x:0,y:0,
                      title:'informacion general',
                      cols:[[4,4,4],[12],[6,6],[12],[12],[12],],
                      fields:[
                        {x:0,y:0,tipe:2,name:'fecha de emision',box:{tipe:0},conection:{field:2}},
                        {x:1,y:0,tipe:2,name:'proveedor',conection:{field:1},box:{tipe:0,class:'w-100'},load:0},
                        {x:2,y:0,tipe:2,name:'confirmado',box:Box_Dual({show:'confirmado'}),conection:{field:3}},
                      ],
                    },
                    {
                      x:0,y:1,
                      title:'informacion de entrega',
                      cols:[[6,6],[4,4,4],[12],[12],[12],],
                      fields:[

                        {x:0,y:0,tipe:2,name:'fecha de entrega',box:{tipe:2,default:Date_Today(0)},conection:{table:0,field:8}},
                        {x:1,y:0,tipe:2,name:'entregado',box:{tipe:6},conection:{table:0,field:7}},

                        {x:1,y:1,tipe:2,name:'pagado',box:{tipe:6},conection:{field:4}},
                        {x:0,y:1,tipe:2,name:'total',box:Box_Soles({total:0,clss:'h3'}),conection:{table:0,field:5}},

                        {x:2,y:1,tipe:2,name:'costo de entrega',box:{tipe:1,class:'w-50'},field:6},
                        
                      ],
                    }
                  ],
                }
      
              }
            },
            {
              x:0,y:1,
              tipe:1,
              form:{
                title:'lista de productos',
                h_min:500,
                state_base:'list',
                states:[
                  {name:'list',tools:[{name:'save',show:false},{name:'load',show:false},{name:'add',show:false},{name:'new',show:false},]},
                  {name:'reload',tools:[{name:'new',show:true}]}
                ],
                state_start:'block',
                tables:['buy_products','productos','unidades'],
                loads:[
                  {
                    table_main:1,
                    selects:[
                      {table:1,field:0,as:'value'},
                      {table:1,field:1,as:'show'},
                      {table:2,field:1,as:'unidad'},
                    ],
                    joins:[
                      {main:{table:1,field:10},join:{table:2,field:0}},
                    ],
                  }
                ],
                fields:[
                  //{delete:true},
                  //{name:'id',conection:{field:0}},
                  //{name:'buy_id',conection:{field:1}},
                  {name:'check',box:{tipe:6},field:5},
                  {name:'producto',conection:{field:2},box:{tipe:0,class:'w-100'},load:0,attributes:[{name:'style',value:'min-width:220px'}]},
                  
                  {name:'cant',conection:{field:3},box:{tipe:0,class:'w-100'},attributes:[{name:'style',value:'max-width:80px'}]},
                  {name:'unidad',load:{index:0,as:'unidad'}},
                ],
              }
            }
          ],
          conections:[
            {
              tipe:1,
              master:{index:0,table:0,field:0},
              maid:{index:1,table:0,field:1}
            }
          ],

        });
        
      }
    })
  
  });