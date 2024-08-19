
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var acc_work_update = Access_Get(userData.access,"mod-workers");

      var gr = new Grid({
        parent:pageData.body,
        cols:[
          [12],
          [12],
          [12],
        ]
      });

      var md_edit = new Modal({parent:gr.GetColData({x:0,y:1}).col,size:"lg",active:false});
      var fm_edit = new Form({
        title:"orden de trabajo",
        parent:md_edit.GetContent(),
        fields:[
          {name:"content-fm",tipe:0,box:{tipe:0,class:"w-100 m-0 p-0"}},
          {name:"content-tb",tipe:0,box:{tipe:0,class:"w-100 m-0 p-0"}},
        ],       
      });
      var stps_tb = new Steps({
        parent: fm_edit.Field_GetBox({fieldName:"content-tb"}).Blocks_Get()[0],
        steps:[
          {
            name:"orden",
          },
          {
            name:"insumos",
          },
        ],
      });

      var prnt_sales_tb = gr.GetColData({x:0,y:0}).col;
      var prnt_edit_fm = fm_edit.Field_GetBox({fieldName:"content-fm"}).Blocks_Get()[0];
      var prnt_edit_tb = stps_tb.GetStep({stepIndex:0}).window.Conteiner_GetColData({x:0,y:0}).col;
      var prnt_insumos = stps_tb.GetStep({stepIndex:1}).window.Conteiner_GetColData({x:0,y:0}).col;

      var cruds = new ConsCruds({
        cruds:[
          {
            name:"sales-tb",
            active:true,
            script:{
              parent:prnt_sales_tb,
              parent:gr.GetColData({x:0,y:1}).col,
              title:pageData.title,head:true,
              panels:[{col:12,y:0,title:"main",tipe:"table",h:600}],
              stateTools:stTls_tb_all,
          
              tableMain:"sales",
              selects:[
                {table:'sales', field:'ID_SALE',primary:true},
                {table:'sales', field:'DATE_EMMIT'},
                {table:'sales', field:'ID_STATUS'},
                {table:'sales', field:'PAID'},
                {table:'sales', field:'ID_DOCUMENT'},
                {table:'sales', field:'ID_CUSTOMER'},
                {table:'sales', field:'TOTAL'},
                {table:'sales', field:'DOCUMENT_EMMIT'},
                {table:'sales', field:'COMMENT'},
                {table:'customer_client',field:'NAME'},
                {sql:'CONCAT(items_vehicles.PLACA,"-",items_vehicles.MODELO) AS ITEM_NAME'},
                {table:"sales",field:"ID_WORK_PROCESS"},
              ],
              joins:[
                {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER",as:"customer_client"},tipe:"LEFT"},
                {main:{table:"sales",field:"ID_ITEM"},join:{table:"items_vehicles",field:"ID_VEHICLE"},tipe:"LEFT"},
              ],
              conditions:[
                {
                  before:" AND ",
                  table:"sales",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:userData.company.id,
                }
              ],
              orders:[
                {field:"DATE_EMMIT",asc:true},
                {field:"ID_STATUS",act:false},
              ],
              loads:[
                ld_workers,
              ],
          
              configShow:false,
              filters:[
                {col:12,y:0,name:"cliente",box:bx_input,select:{table:"customer_client",field:"NAME"},descripcion:"buscar por nombre del cliente"},   
                {col:12,y:2,name:"estado",box:{tipe:4,options:op_sales_status,value:[op_sales_status[1].show,op_sales_status[2].show]},select:{table:"sales",field:"ID_STATUS"},descripcion:"buscar por estado de venta"},
                //{col:12,y:2,name:"cancelado",box:{tipe:4,options:op_sales_paid},select:{table:"sales",field:"PAID"}},
                //{col:12,y:2,name:"documento",box:{tipe:4,options:op_sales_document},select:{table:"sales",field:"ID_DOCUMENT"}},
                //{col:12,name:"emitido",box:{tipe:4,options:op_document_emmit},select:{table:"sales",field:"DOCUMENT_EMMIT"}},
              ],
              fields:[
                //{panel:"main",name:"id",box:{tipe:0},select:"ID_SALE"},
          
                {panel:"main",...fld_edit},
                
                {panel:"main",name:"fecha de emision",attributes:[{name:"style",value:"min-width:160px"}],box:{tipe:0},select:"DATE_EMMIT",descripcion:"muestra la fecha de emision"},
                {panel:"main",name:"cliente",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"NAME",descripcion:"muestra el nombre del cliente"},
                (acc_work_update?{panel:"main",name:"trabajador",attributes:[{name:"style",value:"min-width: 400px;"}],box:({tipe:8,class:"w-100"}),select:"ID_WORK_PROCESS",load:{name:"ld-workers",show:"show",value:"value"},descripcion:"asigna un trabajador a la venta"}:null),
                (userData.company.tipe=="2"?{panel:"main",name:"vehiculo",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"ITEM_NAME"}:null),
                {panel:"main",name:"estado",attributes:[{name:"style",value:"min-width: 120px;"}],box:{tipe:0,options:op_sales_status},select:"ID_STATUS",descripcion:"muestra el estado de venta"},
                //{panel:"main",name:"cancelado",attributes:[{name:"style",value:"min-width: 120px;"}],box:{tipe:0,options:op_sales_paid},select:"PAID"},

                {panel:"main",name:"comentario",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0,value:""},select:"COMMENT",descripcion:"muestra el comentario de la venta"},

              ],
              events:[
                {
                  name:"boxUpdate",
                  actions:[
                    {
                      action:({field,y,k})=>{
          
                        if(field.action=="edit-page"){
          
                          var id_sale = k.Reload_GetData()[y]["ID_SALE"];
                          PageSend({
                            url:"sales_new.php",
                            send:{id_sale},
                          })
                          //console.log("edit sale!!", sale_id);
                        }
                      }
                    }
                  ],
                },
              ],
            }
          },
          {
            name:"edit-fm",
            active:true, 
            script:{
              parent:prnt_edit_fm,
              title:"orden de trabajo",head:false,
              panels:[{title:"main",head:false,col:12,y:0,tipe:"form"}],
              stateStart:"block",
              afterUpdate:"block",
              afterCancel:"block",
              stateTools:[
                {
                  name:"reload",
                  tools:[
                      {name:"config",show:false},
                      {name:"load",show:false},
                      
                      {name:"excel",show:false},
                      {name:"pdf",show:false},
          
                      {name:"sizes",show:false,value:999},
                      {name:"reload",show:true},
                      {name:"update",show:true},
                      {name:"new",show:false},
                      {name:"insert",show:false},
                      {name:"cancel",show:true},
                      
                      {name:"pages",show:false},
                  ],
                },
              ],
              loads:[
                {
                  name:"ld-workers",
                  tableMain:"workers",
                  selects:[
                    {table:"workers",field:"ID_WORKER",as:"value"},
                    {sql:'CONCAT(workers.NAME,"-",work_areas.NAME) AS "show"'},
                  ],
                  joins:[
                    {
                      main:{table:"workers",field:"ID_WORK_AREA"},
                      join:{table:"work_areas",field:"ID_WORK_AREA"},
                      tipe:"LEFT",
                    },
                  ],
                  conditions:[
                    {
                      table:"workers",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
                }
              ],

              tableMain:"sales",
              selects:[
                {table:'sales', field:'ID_SALE',primary:true},
                {table:'sales', field:'DATE_EMMIT'},
                {table:'sales', field:'ID_STATUS'},
                {table:'sales', field:'PAID'},
                {table:'sales', field:'ID_DOCUMENT'},
                {table:'sales', field:'ID_CUSTOMER'},
                {table:'sales', field:'TOTAL'},
                {table:'sales', field:'DOCUMENT_EMMIT'},
                {table:'sales', field:'COMMENT'},
                {table:'customers',field:'NAME'},
                {table:"sales",field:"ID_WORK_PROCESS"},
              ],
              joins:[
                {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"}
              ],

              fields:[
                
                {panel:"main",name:"fecha de emision",box:{tipe:0},select:"DATE_EMMIT",descripcion:"muestra la fecha de emision"},
                {panel:"main",name:"cliente",box:{tipe:0},select:"NAME",descripcion:"muestra el nombre del cliente"},
                {panel:"main",name:"estado",box:{tipe:3,options:[op_sales_status[1],op_sales_status[2],op_sales_status[3]]},select:"ID_STATUS",descripcion:"selecciona el estado de la venta"},
                (acc_work_update?{panel:"main",name:"trabajador",box:(acc_work_update?{tipe:8,class:"w-100"}:{tipe:0}),load:{name:"ld-workers",show:"show"},select:"ID_WORK_PROCESS",descripcion:"selecciona trabajador a la venta"}:null),
                //{panel:"main",name:"cancelado",attributes:[{name:"style",value:"min-width: 120px;"}],box:{tipe:0,options:op_sales_paid},select:"PAID"},

                {panel:"main",name:"comentario",box:{tipe:9,value:""},select:"COMMENT",descripcion:"edita comentario de la venta"},

              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md_edit.SetActive({active});
                    }
                  }]
                }
              ],
              
            },
          },
          {
            name:"edit-tb",
            active:true,
            script:{
              ...scr_sales_products({
                parent:prnt_edit_tb,
                head:false,h:600,
                fieldsSet:[
                  {name:"delete",active:false},
                  {name:"edit",active:false},
                  {name:"precio unitario",active:false},
                  {name:"precio total",active:false},
                  {name:"trabajador asignado",state:"edit",active:acc_work_update},
                  {name:"check",state:"edit",active:true},
                ],
              }),

              events:[
                {
                  name:"reloadAfter",
                  actions:[{
                    action:({k})=>{

                      var data = k.Reload_GetData({});

                      var total = data.length;
                      var count = data.reduce((acc,val)=>{return acc + parseInt(val["CHECKLIST"])},0);

                      if(total == count){

                        var cr_edit_fm = cruds.Crud_GetBuild({name:"edit-fm"});
                        cr_edit_fm.SetValue({fieldName:"estado",value:4,y:0});
                        cr_edit_fm.Update_AddChange({
                          fieldName:"estado",
                          value:"4",
                          primary:cr_edit_fm.Reload_GetData_Primarys()[0],
                        });
                      }
                    }
                  }]
                }
              ],
            }
          },
          {
            name:"supplies",
            active:true,
            script:{
              parent:prnt_insumos,
              title:"lista de insumos",head:false,
              panels:[{col:12,y:0,title:"main",tipe:"table",h:600}],
              stateTools:stTls_tb_maid,
              stateStart:"block",
              //newLinesStart:10,

              tableMain:"sales_supplies",
              selects:[
                {table:'sales_supplies', field:'ID_SALE_SUPPLIE',primary:true},
                {table:'sales_supplies', field:'ID_SALE'},
                {table:'sales_supplies', field:'ID_SUPPLIE'},
                {table:'sales_supplies', field:'CANT'},
              ],
              loads:[     
                {
                  name:"supplies",
                  tableMain:"products",
                  selects:[
                      {table:'products', field:'ID_PRODUCT',as:"value"},
                      {table:'products', field:'NAME',as:"show"},
                      {table:'products',field:"PRICE_UNIT"},
                      {table:'products',field:"STOCK_TOTAL"},
                  ],
                  conditions:[
                    {
                      table:"products",
                      field:"ACTIVE",
                      inter:"=",
                      value:1,
                    },
                    {
                      before:" AND ( ",
                      table:"products",
                      field:"ID_PRODUCT_TIPE",
                      inter:"=",
                      value:2,
                    },
                    {
                      before:" OR ",
                      table:"products",
                      field:"ID_PRODUCT_TIPE",
                      inter:"=",
                      value:3,
                      after:" ) ",
                    },
                    {
                      before:" AND ",
                      table:"products",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    },
                  ],
                },
              ],

              fields:[
                {panel:"main",...fld_delete,attributes:att_btn},
                {panel:"main",name:"insumo",attributes:att_ln,box:{tipe:8,class:"w-100"},select:"ID_SUPPLIE",load:{name:"supplies",show:"show"},descripcion:"asigna insumo utilizado"},
                {panel:"main",name:"cantidad",attributes:att_cnt,box:bx_cant,select:"CANT",descripcion:"asigna cantidad de insumos"},
              ],
            }
          },
        ],

        conections:[
          {
            tipe:"tb-fm",
            master:"sales-tb",
            masterField:"ID_SALE",
            maid:"edit-fm",
            maidField:"ID_SALE",
          },
          {
            tipe:"fm-tb",
            master:"edit-fm",
            masterField:"ID_SALE",
            maid:"edit-tb",
            maidField:"ID_SALE",
          },
          {
            tipe:"fm-tb",
            master:"edit-fm",
            masterField:"ID_SALE",
            maid:"supplies",
            maidField:"ID_SALE",
          },
        ],
      })

    }
  });
  

});
