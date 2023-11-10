
$(document).ready(function() {

    new Pag_Base({
  
      success:({recive,page})=>{
        //if(recive == null) recive = {name:'search',value:1};
        
        new Master({
          title:'ingreso de compras',
          cols:[[12],[12]],
          forms:[
            {
              tipe:2,
              x:0,y:0,
              form:{

                title:'compra',
                states:[{name:'reload',tools:[{name:'new',show:true},{name:'save',show:true}]}],
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
                      cols:[[12],[12],[6,6],[12],[12],[12],],
                      fields:[
                        {x:0,y:0,name:'fecha de emision',box:{tipe:2,default:Date_Today()},conection:{field:2}},
                        {x:0,y:1,name:'proveedor',conection:{field:1},box:{tipe:8,class:'w-100'},load:0},
                        {x:0,y:2,tipe:2,name:'confirmado',box:{tipe:6},conection:{field:3}},
                        {x:1,y:2,tipe:2,name:'pagado',box:{tipe:6},conection:{field:4}},
                      ],
                    },
                    {
                      x:0,y:1,
                      title:'informacion de entrega',
                      cols:[[12],[6,6],[12],[12],[12],],
                      fields:[
                        {x:0,y:0,name:'fecha de entrega',box:{tipe:2,default:Date_Today(7)},conection:{table:0,field:8}},
                        {x:0,y:1,tipe:2,name:'total',box:Box_Soles({total:0,clss:'h3'}),conection:{table:0,field:5}},
                        {x:1,y:1,tipe:2,name:'entregado',box:Box_Dual({show:'entregado',show2:'pendiente'}),conection:{table:0,field:7}},
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
                state_start:'block',
                states:[{name:'list',tools:[{name:'save',show:false}]}],
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
                  {delete:true},
                  //{name:'id',conection:{field:0}},
                  //{name:'buy_id',conection:{field:1}},
                  {name:'product_id',conection:{field:2},box:{tipe:8,class:'w-100'},load:0,attributes:[{name:'style',value:'min-width:220px'}]},
                  {name:'cant',conection:{field:3},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'max-width:80px'}]},
                  {name:'unidad',load:{index:0,as:'unidad'}},
                  {name:'cost total',conection:{field:4},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:110px'}]},
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
          calculates:[
            {
              sum:[
                {index:1,field:'cost total'},
              ],
              total:{index:0,field:'total'},
              update:[0,1],
            }
          ],

        });
        
      }
    })
  
  });