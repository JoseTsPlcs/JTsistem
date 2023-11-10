
$(document).ready(function() {

  const db = new Load();
  db.SetTables({tables:TablesData({tables:['clientes','zonas','customers_types']})});


  /*const ld = new LoadData({
    log:true,
    events:[
      {name:'load_end',actions:[
        {descriptions:'test load of cliente',action:()=>{console.log("clientes loaded event");}}
      ]},
    ],
  });
  ld.Load({
    database:db,
    load:{
      table_main:0,
      selects:[
        {table:0,field:0,as:'value'},
        {table:0,field:1,as:'show'},
      ],
    }
  });*/

  const lds = new LoadsData({
    log:true,
    name:'loads data all test',
    events:[{name:'loads_end',actions:[
      {
        description:'when all is loaded -test-',
        action:()=>{

          console.log(lds);
        }
      }
    ]}],
  });

  lds.Load({
    database:db,
    loads:[{table:0},{table:1},{table:2}],
  })
  

});
