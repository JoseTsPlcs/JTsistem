

$(document).ready(function() {

  new Pag_Base({

    success:({recive, page,from})=>{


      new Form_Modulos({
        title:'cliente',
        state_base:'search',
        state_start:'add',
        recive:recive,
        page:page,
        tables:['clientes','zonas','customers_types'],
        joins:[
          {main:{table:0,field:6},join:{table:1,field:0}},
          {main:{table:0,field:13},join:{table:2,field:0}},
        ],
        loads:[
          {
            table_main:2,
            selects:[
              {table:2,field:0,as:'value'},
              {table:2,field:1,as:'show'},
            ],
          },
          {
            table_main:1,
            selects:[
              {table:1,field:0,as:'value'},
              {table:1,field:1,as:'show'},
            ],
          }
        ],
        modulos:{
          cols:[[6,6],[12],[12]],
          windows:[
            {
              x:0,y:0,
              title:'informacion personal',
              cols:[[12],[12],[6,6],[12],[12],[12],],
              fields:[
                {x:0,y:0,name:'nombre',box:{tipe:1,class:'w-100'},conection:{table:0,field:3}},
                {x:0,y:1,name:'tipo',box:{tipe:3,class:'w-100'},conection:{table:0,field:13},load:0},
                {x:0,y:2,tipe:2,name:'dni/ruc',box:{tipe:1,class:'w-100 mx-2'},conection:{table:0,field:4}},
                {x:1,y:2,tipe:2,name:'celular',box:{tipe:1,class:'w-100 mx-2'},conection:{table:0,field:8}},
              ],
            },
            {
              x:1,y:0,
              title:'informacion extra',
              cols:[[12],[6,6],[12],[12],[12],[12],],
              fields:[
                {x:0,y:0,tipe:1,name:'recoge',box:{tipe:6,name:'recoge',class:'w-100'},conection:{table:0,field:11}},
                {x:0,y:1,tipe:2,name:'documento',box:{tipe:3,options:documentos_options,class:'w-100'},conection:{table:0,field:12}},
                {x:1,y:1,tipe:2,name:'metodo',box:{tipe:3,options:metodo_options,class:'w-100'},conection:{table:0,field:10}},
              ],
            },
            {
              x:0,y:1,
              title:'ubicacion',
              cols:[[12],[12],[12],[12],[12],[12],],
              fields:[
                {x:0,y:0,name:'zona',box:{tipe:8,class:'w-100'},load:1,conection:{table:0,field:6}},
                {x:0,y:1,name:'direccion',box:{tipe:1,class:'w-100'},conection:{table:0,field:5}},
                {x:0,y:2,name:'referencia',box:{tipe:1,class:'w-100'},conection:{table:0,field:7}},
              ],
            },
          ],
        }
      });
    }
  })  


});
