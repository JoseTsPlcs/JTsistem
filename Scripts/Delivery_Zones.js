
$(document).ready(function() {

  new Pag_Base({

    success:()=>{


      new Form_Table({

        title:'lista de zonas',
        tables:['zonas','macro'],
        loads:[
          {
            table_main:1,
            selects:[
              {table:1,field:0,as:'value'},
              {table:1,field:1,as:'show'},
            ],
          }
        ],
        filters:[
          {name:'zona',box:{tipe:1,class:'w-100'},conection:{table:0,field:1,inter:'LIKE'}},
          {name:'macro',box:{tipe:4},load:0,conection:{table:0,field:2}},
          {name:'activo',box:Box_MutipleDual({show:'activo',dlft:'activo'}),conection:{table:0,field:4}},
        ],
        fields:[
          {delete:true},
          {name:'zona',box:{tipe:1},conection:{table:0,field:1}},
          {name:'macro',box:{tipe:3},conection:{table:0,field:2},load:0},
          {name:'delivery',box:{tipe:1},conection:{table:0,field:3}},
          {name:'activo',box:{tipe:6,name:'activo'},conection:{table:0,field:4}},
        ]
      });
    }
  });


});
