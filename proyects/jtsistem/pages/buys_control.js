
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      new Crud_set({
        title:"lista de compras",
        panels:[
          {col:12,y:0,title:"main",tipe:"table"},
        ],
        stateTools:[
          {
              name:"reload",
              tools:[
                  {name:"config",show:true},
                  {name:"load",show:true},
                  
                  {name:"excel",show:false},
                  {name:"pdf",show:false},
      
                  {name:"sizes",show:true,value:10},
                  {name:"reload",show:true},
                  {name:"update",show:false},
                  {name:"new",show:false},
                  {name:"insert",show:false},
                  {name:"cancel",show:false},
                  
                  {name:"pages",show:false},
              ],
          }
      ],
    
        tableMain:"buys",
        selects:[
          {table:'buys', field:'ID_BUY',primary:true},
          {table:'buys', field:'DATE_EMMIT'},
          {table:'buys', field:'ID_BUY_STATUS'},
          {table:'provideers', field:'NAME'},
          {table:'buys', field:'TOTAL'},
        ],
        joins:[
          {
            main:{table:"buys",field:"ID_PROVIDEER"},
            join:{table:"provideers",field:"ID_PROVIDEER"},
            tipe:"LEFT",
          }
        ],
        conditions:[
          {
            before:" AND ",
            table:"buys",
            field:"ID_COMPANY",
            inter:"=",
            value:userData.company.id,
          }
        ],
    
        configShow:true,
        filters:[
          {name:"proveedor",box:{tipe:1},select:{table:"provideers",field:"NAME"}},
          {col:6,name:"fecha min",box:bx_date_start,select:{table:"buys",field:"DATE_EMMIT",tipe:"min"}},
          {col:6,name:"fecha max",box:bx_date_end,select:{table:"buys",field:"DATE_EMMIT",tipe:"max"}},
          {name:"estado",box:{tipe:4,options:op_buys_status},select:{table:"buys",field:"ID_BUY_STATUS"}},
        ],
        fields:[
          {panel:"main",...fld_edit},
          //{panel:"main",name:"id",box:{tipe:0},select:"ID_BUY"},
          {panel:"main",name:"fecha de emision",box:{tipe:0},select:"DATE_EMMIT"},
          {panel:"main",name:"proveedor",box:{tipe:0},select:"NAME"},
          {panel:"main",name:"estado",box:{tipe:0,options:op_buys_status},select:"ID_BUY_STATUS"},
          {panel:"main",name:"total",box:bx_money,select:"TOTAL"},
        ],
        events:[
          {
            name:"boxUpdate",
            actions:[
              {
                action:({field,y,k})=>{
    
                  if(field.action=="edit"){
    
                    var primary = k.Reload_GetData()[y]["ID_BUY"];
                    PageSend({url:"buy_new.php",send:{id_buy:primary}});
                  }
                }
              }
            ],
          }
        ],
      });
    }
  });
  

});
