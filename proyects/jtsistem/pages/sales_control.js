
$(document).ready(function() {

  new Pag_Base({
    success:({userData})=>{

      //console.log("salesControl",userData);

      var gr = new Grid({
        cols:[[6,6],[12],[12]],
        boxs:[
          {x:0,y:0,box:{tipe:0,value:"Total:",class:"h1 text-center"}},
          {x:1,y:0,box:bx_moneyh1},
        ],
      });
    
      var md = new Modal({
        parent:gr.GetColData({x:0,y:2}).col,
        size:"lg",
      });
      var mdParent = md.GetContent();
      //mdParent.setAttribute("style","min-width: 600px;");
      var mdGr = new Grid({
        parent:mdParent,
        cols:[[12],[12],[12]],
        boxs:[
          //{x:0,y:2,box:{tipe:5,value:"pdf",class:"btn btn-danger btn-sm",update:()=>{generarPDF()}}},
        ],
        attributes:[
          {x:0,y:2,attributes:[{name:"class",value:"col-4 m-0 p-0 d-flex justify-content-center"}]},
        ],
      });
    
      new ConsCruds({
    
        cruds:[
          {
            name:"control",
            active:true,
            script:{
              parent:gr.GetColData({x:0,y:1}).col,
              title:"control de ventas",
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
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
                {table:'customers',field:'NAME'},
              ],
              joins:[
                {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"}
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
          
              configShow:true,
              filters:[
                {col:12,y:0,name:"cliente",box:bx_input,select:{table:"customers",field:"NAME"}},
                {col:6,y:1,name:"fecha min",box:bx_date,select:{table:"sales",field:"DATE_EMMIT",tipe:"min"}},
                {col:6,y:1,name:"fechamax",box:bx_date,select:{table:"sales",field:"DATE_EMMIT",tipe:"max"}},
                {col:12,y:2,name:"estado",box:{tipe:4,options:op_sales_status},select:{table:"sales",field:"ID_STATUS"}},
                {col:12,y:2,name:"cancelado",box:{tipe:4,options:op_sales_paid},select:{table:"sales",field:"PAID"}},
                {col:12,y:2,name:"documento",box:{tipe:4,options:op_sales_document},select:{table:"sales",field:"ID_DOCUMENT"}},
                {col:12,name:"emitido",box:{tipe:4,options:op_document_emmit},select:{table:"sales",field:"DOCUMENT_EMMIT"}},
              ],
              fields:[
                //{panel:"main",name:"id",box:{tipe:0},select:"ID_SALE"},
          
                {panel:"main",name:"edit",attributes:[{name:"class",value:"px-1"}],box:{tipe:5,value:'<i class="bi bi-pencil-square"></i>',class:"btn btn-primary btn-sm"},action:"edit-page"},
                {panel:"main",name:"show",attributes:[{name:"class",value:"px-1"}],box:{tipe:5,value:'<i class="bi bi-eye-fill"></i>',class:"btn btn-primary btn-sm"},action:"edit"},
                
                {panel:"main",name:"cliente",box:{tipe:0},select:"NAME"},
                {panel:"main",name:"estado",attributes:[{name:"style",value:"min-width: 120px;"}],box:{tipe:0,options:op_sales_status},select:"ID_STATUS"},
                {panel:"main",name:"cancelado",attributes:[{name:"style",value:"min-width: 120px;"}],box:{tipe:0,options:op_sales_paid},select:"PAID"},
                {panel:"main",name:"total",box:bx_money,select:"TOTAL"},
                {panel:"main",name:"comentario",box:{tipe:9,value:""},select:"COMMENT"},
                {panel:"main",name:"fecha de emision",attributes:[{name:"style",value:"min-width:160px"}],box:{tipe:0},select:"DATE_EMMIT"},
                
                {panel:"main",name:"documento",attributes:[{name:"style",value:"min-width:100px"}],box:{tipe:0,options:op_sales_document},select:"ID_DOCUMENT"},
                {panel:"main",name:"emitido",attributes:[{name:"style",value:"min-width:100px"}],box:{tipe:0,options:op_document_emmit},select:"DOCUMENT_EMMIT"},
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
                {
                  name:"calculateTotal",
                  actions:[{
                    action:({k})=>{
          
                      var total = k.Reload_GetData().reduce((acum,v)=>{return acum + parseFloat(v["TOTAL"])},0);
                      gr.GetColData({x:1,y:0}).boxs[0].SetValue(total);
                    }
                  }]
                },
                {
                  name:"reloadAfter",
                  actions:[{
                    action:({k})=>{
          
                      k.CallEvent({name:"calculateTotal"});
                    }
                  }]
                }
              ],
            },   
          },
          {
            name:"show-form",
            active:true,
            script:{
              parent:mdGr.GetColData({x:0,y:0}).col,
              title:"venta",
              panels:[{col:12,y:0,tipe:"form",title:"informacion"}],
              stateStart:"block",
              stateTools:[
                {
                  name:"reload",
                  tools:[
                      {name:"config",show:false},
                      {name:"load",show:false},
                      
                      {name:"excel",show:false},
                      {name:"pdf",show:false},
          
                      {name:"sizes",show:false,value:50},
                      {name:"reload",show:false},
                      {name:"update",show:false},
                      {name:"new",show:false},
                      {name:"insert",show:false},
                      {name:"cancel",show:false},
                      
                      {name:"pages",show:false},
                  ],
                },
              ],
    
              tableMain:"sales",
              selects:[
                {table:'sales', field:'ID_SALE',primary:true},
                {table:'sales', field:'DATE_EMMIT'},
                {table:'sales', field:'ID_STATUS'},
                {table:'sales', field:'ID_DOCUMENT'},
                {table:'sales', field:'ID_CUSTOMER'},
                {table:'sales', field:'TOTAL'},
                {table:'sales', field:'DOCUMENT_EMMIT'},
                {table:'sales', field:'COMMENT'},
                {table:'customers',field:'NAME'},
              ],
              joins:[
                {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"}
              ],
    
              fields:[
                //{panel:"main",name:"id",box:{tipe:0},select:"ID_SALE"},
                {panel:"informacion",name:"fecha de emision",box:{tipe:0},select:"DATE_EMMIT"},
                {panel:"informacion",name:"cliente",box:{tipe:0},select:"NAME"},
    
                //{panel:"informacion",name:"servicios",box:bx_money,action:"show"},
                //{panel:"informacion",name:"productos",box:bx_money,action:"show"},
                {panel:"informacion",name:"total",box:bx_moneyh1,select:"TOTAL"},
                
                {panel:"informacion",name:"comentario",box:{tipe:0,value:""},select:"COMMENT"},
    
              ],
              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{
    
                      md.SetActive({active});
                    }
                  }]
                }
              ],
    
            }
          },
          {
            name:"show-table",
            active:true,
            script:{
              parent:mdGr.GetColData({x:0,y:1}).col,
              title:"detalle",
              panels:[{col:12,y:0,tipe:"table",title:"informacion"}],
              stateStart:"block",
              stateTools:[
                {
                  name:"reload",
                  tools:[
                      {name:"config",show:false},
                      {name:"load",show:false},
                      
                      {name:"excel",show:false},
                      {name:"pdf",show:false},
          
                      {name:"sizes",show:false,value:999},
                      {name:"reload",show:false},
                      {name:"update",show:false},
                      {name:"new",show:false},
                      {name:"insert",show:false},
                      {name:"cancel",show:false},
                      
                      {name:"pages",show:false},
                  ],
                },
              ],
    
              tableMain:"sales_products",
              selects:[
                {table:'sales_products', field:'ID',primary:true},
                {table:'sales_products', field:'ID_SALE'},
                {table:'sales_products', field:'ID_PRODUCT'},
                {table:'sales_products', field:'CANT'},
                {table:'sales_products', field:'PRICE_UNIT'},
                {table:'sales_products', field:'PRICE_TOTAL'},
                {table:"products",field:"NAME",as:"PRODUCT_NAME"},
                {table:"products",field:"ID_PRODUCT_TIPE"},
                {table:"unids",field:"SIMBOL",as:"UNID_SIMBOL"},
              ],
              joins:[
                {
                  main:{table:"sales_products",field:"ID_PRODUCT"},
                  join:{table:"products",field:"ID_PRODUCT"},
                  tipe:"LEFT",
                },
                {
                  main:{table:"products",field:"UNID_ID"},
                  join:{table:"unids",field:"ID_UNID"},
                  tipe:"LEFT",
                },
              ],
              orders:[
                {field:"ID_PRODUCT_TIPE",asc:false},
              ],
    
              fields:[
                {panel:"informacion",name:"descripcion",attributes:[{name:"class",value:"px-1 py-0 m-0"}],box:{tipe:0},select:"PRODUCT_NAME"},
                {panel:"informacion",name:"tipo",attributes:[{name:"class",value:"px-1 py-0 m-0"}],box:{tipe:0,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
                {panel:"informacion",name:"unidad",attributes:att_cnt,box:{tipe:0,class:"text-center"},select:"UNID_SIMBOL"},
                {panel:"informacion",name:"cantidad",attributes:att_cnt,box:{tipe:0,class:"text-center"},select:"CANT"},
                {panel:"informacion",name:"precio unitario",attributes:att_cnt,box:bx_money,select:"PRICE_UNIT"},
                {panel:"informacion",name:"precio total",attributes:att_cnt,box:bx_money,select:"PRICE_TOTAL"},
              ],
    
            }
          }
        ],
    
        conections:[
          {
            tipe:"tb-fm",
            master:"control",
            masterField:"ID_SALE",
            maid:"show-form",
            maidField:"ID_SALE",
          },
          {
            tipe:"fm-tb",
            master:"show-form",
            masterField:"ID_SALE",
            maid:"show-table",
            maidField:"ID_SALE",
          }
        ],
    
    
      });


    }
  });

  

  

});
