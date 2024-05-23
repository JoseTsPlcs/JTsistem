
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({
        cols:[[6,6],[6,6],[12],[12]],
        boxs:[
          {x:0,y:0,box:{tipe:0,value:"Igv:",class:"h1 text-center"}},
          {x:1,y:0,box:bx_moneyh1},
    
          {x:0,y:1,box:{tipe:0,value:"total:",class:"h3 text-center"}},
          {x:1,y:1,box:bx_moneyh3},
        ],
      });
      var md = new Modal({parent:gr.GetColData({x:0,y:3}).col,size:"lg"});
      var mdgr = new Grid({
        parent:md.GetContent(),
        cols:[[12],[12]],
      });
      //md.SetActive({active:true});
    
      new ConsCruds({
    
        cruds:[
          {
            name:"bills",
            active:true,
            script:{
    
              parent:gr.GetColData({x:0,y:2}).col,
              title:"lista de facturas",
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
                {table:"sales",field:"DOCUMENT_EMMIT"},
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
              orders:[
                {field:"DATE_EMMIT",asc:false},
              ],
          
              configShow:true,
              filters:[
                {col:12,y:0,name:"cliente",box:bx_input,select:{table:"customers",field:"NAME"}},
                {col:6,y:1,name:"fecha min",box:bx_date_start,select:{table:"sales",field:"DATE_EMMIT",tipe:"min"}},
                {col:6,y:1,name:"fechamax",box:bx_date_end,select:{table:"sales",field:"DATE_EMMIT",tipe:"max"}},
                {col:12,y:2,name:"estado",box:{tipe:4,options:op_sales_status},select:{table:"sales",field:"ID_STATUS"}},
                {col:12,y:2,name:"cancelado",box:{tipe:4,options:op_sales_paid},select:{table:"sales",field:"PAID"}},
                {col:12,name:"emitido",box:{tipe:4,options:op_document_emmit},select:{table:"sales",field:"DOCUMENT_EMMIT"}},
                {col:12,y:2,name:"documento",box:{tipe:4,options:op_sales_document,value:["factura","boleta"]},select:{table:"sales",field:"ID_DOCUMENT"}},
              ],
              fields:[
                //{panel:"main",name:"id",box:{tipe:0},select:"ID_SALE"},
          
                {panel:"main",...fld_show,action:"edit"},
                {panel:"main",name:"cliente",box:{tipe:0},select:"NAME"},
                {panel:"main",name:"estado",box:{tipe:0,options:op_sales_status},select:"ID_STATUS"},
                {panel:"main",name:"cancelado",attributes:[{name:"style",value:"min-width: 120px;"}],box:{tipe:0,options:op_sales_paid},select:"PAID"},
                {panel:"main",name:"total",box:bx_money,select:"TOTAL"},
                {panel:"main",name:"documento",box:{tipe:0,options:op_sales_document},select:"ID_DOCUMENT"},
                {panel:"main",name:"fecha de emision",box:{tipe:0},select:"DATE_EMMIT"},
                {panel:"main",name:"emitido",box:{tipe:6,name:"emitido",options:op_document_emmit},select:"DOCUMENT_EMMIT"},
              ],   
              
              events:[
                {
                  name:"printAfter",
                  actions:[{
                    action:({result})=>{
    
                      var total = result.reduce((acum,val)=>{
    
                        return acum + parseFloat(val["TOTAL"]);
                      },0);
                      var igv = CalculateWithOutIgv(total);
    
                      gr.GetColData({x:1,y:0}).boxs[0].SetValue(igv);
                      gr.GetColData({x:1,y:1}).boxs[0].SetValue(total);
    
                    }
                  }]
                }
              ],
            }
          },
          {
            name:"saleBill",
            active:true,
            script:{
              parent:mdgr.GetColData({x:0,y:0}).col,
              title:"factura",
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateStart:"block",
              stateTools:stTls_tb_show, 
    
              tableMain:"sales",
              selects:[
                {table:'sales', field:'ID_SALE',primary:true},
                {table:'sales', field:'DATE_EMMIT'},
                {table:'sales', field:'ID_STATUS'},
                {table:'sales', field:'ID_DOCUMENT'},
                {table:'sales', field:'ID_CUSTOMER'},
                {table:'sales', field:'TOTAL'},
                {table:'customers',field:'NAME'},
                {table:'customers',field:'NRO_DOCUMENT'},
                {table:'customers',field:'COMPANY'},
              ],
              joins:[
                {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"}
              ],
    
              fields:[
                {panel:"main",name:"id",box:{tipe:0},select:"ID_SALE"},
                {panel:"main",name:"fecha de emision",box:{tipe:0},select:"DATE_EMMIT"},
    
                
                {panel:"main",name:"documento",box:{tipe:0,options:op_sales_document},select:"ID_DOCUMENT"},
                {panel:"main",name:"cliente",box:{tipe:0},select:"NAME"},
                {panel:"main",name:"cliente documento",box:{tipe:0,options:op_identity_document_tipe},select:"COMPANY"},
                {panel:"main",name:"nro documento",box:{tipe:0},select:"NRO_DOCUMENT"},
    
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
            name:"saleBill_products",
            active:true,
            script:{
              parent:mdgr.GetColData({x:0,y:1}).col,
              title:"lista de productos/servicios",
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateStart:"block",
              stateTools:stTls_tb_show, 
    
              tableMain:"sales_products",
              selects:[
                {table:'sales_products', field:'ID',primary:true},
                {table:'sales_products', field:'ID_SALE'},
                {table:'sales_products', field:'ID_PRODUCT'},
                {table:'sales_products', field:'CANT'},
                {table:'sales_products', field:'PRICE_UNIT'},
                {table:'sales_products', field:'PRICE_TOTAL'},
                {table:"products",field:"NAME"},
                {table:"products",field:"ID_PRODUCT_TIPE"},
              ],
              joins:[
                {
                  main:{table:"sales_products",field:"ID_PRODUCT"},
                  join:{table:"products",field:"ID_PRODUCT"},
                  tipe:"LEFT",
                }
              ],
    
              fields:[
                {panel:"main",name:"producto-servicio",attributes:att_ln,box:{tipe:0},select:"NAME"},
                {panel:"main",name:"cp",attributes:att_btn,box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-arrow-left-short"></i><i class="bi bi-clipboard"></i>'},action:"copy"},
                {panel:"main",name:"tipo",attributes:att_cnt,box:{tipe:0,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
                {panel:"main",name:"cantidad",attributes:att_cnt,box:{tipe:0,class:"text-center"},select:"CANT"},
                {panel:"main",name:"precio unitario",attributes:att_cnt,box:bx_money,select:"PRICE_UNIT"},
                {panel:"main",name:"cu",attributes:att_btn,box:{tipe:5,class:"btn btn-primary btn-sm",value:'<i class="bi bi-arrow-left-short"></i><i class="bi bi-clipboard"></i>'},action:"copy"},
                {panel:"main",name:"precio total",attributes:att_cnt,box:bx_money,select:"PRICE_TOTAL"},
              ],
              events:[
                {
                  name:"printBefore",
                  actions:[{
                    action:({k,result})=>{
    
                      result.forEach(rst => {
                        
                        var priceUnit = parseFloat(rst["PRICE_UNIT"]);
                        priceUnit /= (1+igvPorcent/100);
                        rst["PRICE_UNIT"] = priceUnit;
    
                        var priceTotal = parseFloat(rst["PRICE_TOTAL"]);
                        priceTotal /= (1+igvPorcent/100);
                        rst["PRICE_TOTAL"] = priceTotal;
                        
    
                      });
    
                      return {data:result};
                    }
                  }]
                },
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({field,k,y})=>{
    
                      var data = k.Reload_GetData();
    
                      if(field.name=="cp"){
    
                        navigator.clipboard.writeText(data[y]["NAME"]);
                      }
    
                      if(field.name=="cu"){
    
                        navigator.clipboard.writeText(data[y]["PRICE_UNIT"]);
                      }
                    }
                  }]
                }
              ],
            },
          }
        ],
    
        conections:[
          {
            tipe:"tb-fm",
            master:"bills",
            masterField:"ID_SALE",
            maid:"saleBill",
            maidField:"ID_SALE",
          },
          {
            tipe:"fm-tb",
            master:"saleBill",
            masterField:"ID_SALE",
            maid:"saleBill_products",
            maidField:"ID_SALE",
          },
        ],
    
        /*events:[
          {
            name:"modifyScript",
            actions:[{
              action:({conection,masterScript,maidScript})=>{
    
                if(conection.master == "saleBill"){
    
                  masterScript.stateTools = [
                    {
                        name:"reload",
                        tools:[
                            {name:"config",show:false},
                            {name:"load",show:false},
        
                            {name:"excel",show:false},
                            {name:"pdf",show:false},
        
                            {name:"sizes",show:false},
                            {name:"reload",show:false},
                            {name:"update",show:false},
                            {name:"new",show:false},
                            {name:"insert",show:false},
                            {name:"cancel",show:false},
                            
                            {name:"pages",show:false},
                        ],
                    },
                  ];
    
                  maidScript.stateTools = [
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
                  ];
                }
              }
            }],
          },
          {
            name:"mofifiedScipts",
            actions:[{
              action:({k})=>{
    
                var md =k.Crud_GetData({name:"saleBill"});
                md.stateStart="block";
                md.stateBase="block";
                console.log(md);
              }
            }],
          }
        ],*/
    
      });
    }
  });
  

});
