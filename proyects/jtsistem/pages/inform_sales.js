
$(document).ready(function() {

  new Pag_Base({});

  var gr = new Grid({
    cols:[
      [12],//filters
      [6,6],//totals
      [8,4],//ventas lines
      [8,4],
    ],
    /*boxs:[
      {x:0,y:0,box:{tipe:0,value:"Total:",class:"h1 text-center"}},
      {x:1,y:0,box:bx_moneyh1},
    ],*/
  });

  

  new windowFilters({
    parent:gr.GetColData({x:0,y:0}).col,
    title:"filtros",

    filters:[
      {name:"rango de fecha",box:{tipe:3,options:op_date_ranges}},
      {col:6,name:"fecha min",box:bx_date_start},
      {col:6,name:"fecha max",box:bx_date_end},
      {name:"estados",box:{tipe:4,options:op_sales_status}},
    ],

    events:[
      {
        name:"reload",
        actions:[{
          action:()=>{ Reload()}
        }]
      }
    ],
  });

  function Reload() {
    
    var requestSql = db_lip.GetSql_Select({
      tableMain:"sales",
      selects:[
        {table:'sales', field:'ID_SALE'},
        {table:'sales', field:'DATE_EMMIT'},
        {table:'sales', field:'ID_STATUS'},
        {table:'sales', field:'ID_DOCUMENT'},
        {table:'sales', field:'ID_CUSTOMER'},
        {table:'sales', field:'TOTAL'},
      ],
      conditions:[],
    });

    console.log("resquestSql:",requestSql);

  }


  

});
