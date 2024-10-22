
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{


      new BuildPage({
        type:"control",
        schema:sch_buys,
        schemaItems:sch_buys_products,
        schemaPays:sch_buys_payments,
        payTag:"compra",page:"buyNew",
        userData,pageData,
        filters:[
          {name:"state",value:op_buys_status.filter(op=>op.value!=5).map(op=>{return op.show})},
        ],
      });

      return;

      var group = new CrudsGroup({
        userData,pageData,
        layers:[
          {
            crud:{
              name:"cr-buys",
              parent:pageData.body,recordName:"compra",
              title:"lista de compras",
              states:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:true},
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:true},
                        {name:"tutorial",show:true},
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
          
              configShow:false,
              filters:[
                {name:"proveedor",box:{tipe:1},select:{table:"provideers",field:"NAME"},descripcion:"buscar por nombre del proveedor"},
                {col:6,name:"fecha min",box:bx_date_start,select:{table:"buys",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar por una fecha igual o mayor"},
                {col:6,name:"fecha max",box:bx_date_end,select:{table:"buys",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar por una fecha igual o menor"},
                {name:"estado",box:{tipe:4,options:op_buys_status,value:op_buys_status.filter(op=>op.value!=5).map(op=>op.show)},select:{table:"buys",field:"ID_BUY_STATUS"},descripcion:"buscar por estado de compra"},
              ],
              panels:[
                {
                  tipe:"table",
                  fields:[
                    {panel:"main",name:"fecha de emision",attributes:[{name:"style",value:"min-width: 150px;"}],box:{tipe:0},select:"DATE_EMMIT",descripcion:"fecha de emision de la compra"},
                    {panel:"main",name:"proveedor",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"NAME",descripcion:"nombre del proveedor"},
                    {panel:"main",name:"estado",box:{tipe:3,options:op_buys_status},select:"ID_BUY_STATUS",descripcion:"estado de compra"},
                    {panel:"main",name:"total",box:bx_money,select:"TOTAL",descripcion:"total de costo de la compra"},
                  ],
                }
              ],
            }
          }
        ],
        conections:[
          {
            event:"send",
            masterName:"cr-buys",
            param:"id_buy",
            page:"buyNew",
            select:"ID_BUY",
          }
        ],
      });

      PlayTutorialInPage({group,pageData});
    }
  });
  

});
