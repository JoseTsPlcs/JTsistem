
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
          {x:0,y:2,box:{tipe:5,id:"btn1",value:'PDF <i class="bi bi-filetype-pdf"></i>',class:"btn btn-danger btn-sm",update:()=>{SalePDF()}}},
          {x:0,y:2,box:{tipe:5,id:"btn2",value:'Copiar <i class="bi bi-clipboard"></i>',class:"btn btn-primary btn-sm",update:()=>{SaleCopy()}}},
        ],
        attributes:[
          {x:0,y:2,attributes:[{name:"class",value:"col-4 m-0 p-0 d-flex justify-content-center"}]},
        ],
      });
    
      var cruds = new ConsCruds({
    
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
                (userData.company.tipe == "2"?{sql:"CONCAT(items_vehicles.PLACA,'-',items_vehicles.MARCA) AS 'VEHICLE'"}:null),
              ],
              joins:[
                {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"},
                (
                  userData.company.tipe == "2"?
                  {
                    main:{table:"sales",field:"ID_ITEM"},
                    join:{table:"items_vehicles",field:"ID_VEHICLE"},
                    tipe:"LEFT",
                  }:null
                )
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
          
              configShow:false,
              filters:[
                {name:"cliente",box:bx_input,select:{table:"customers",field:"NAME"}},
                (userData.company.tipe == "2"?{name:"placa",box:bx_input,select:{table:"items_vehicles",field:"PLACA"}}:null),
                (userData.company.tipe == "2"?{name:"marca",box:bx_input,select:{table:"items_vehicles",field:"MARCA"}}:null),
                {col:6,name:"fecha min",box:bx_date,select:{table:"sales",field:"DATE_EMMIT",tipe:"min"}},
                {col:6,name:"fechamax",box:bx_date,select:{table:"sales",field:"DATE_EMMIT",tipe:"max"}},
                {name:"estado",box:{tipe:4,options:op_sales_status},select:{table:"sales",field:"ID_STATUS"}},
                {name:"cancelado",box:{tipe:4,options:op_sales_paid},select:{table:"sales",field:"PAID"}},
                {name:"documento",box:{tipe:4,options:op_sales_document},select:{table:"sales",field:"ID_DOCUMENT"}},
                {name:"emitido",box:{tipe:4,options:op_document_emmit},select:{table:"sales",field:"DOCUMENT_EMMIT"}},
              ],
              fields:[
                //{panel:"main",name:"id",box:{tipe:0},select:"ID_SALE"},
          
                {panel:"main",name:"edit",attributes:[{name:"class",value:"px-1"}],box:{tipe:5,value:'<i class="bi bi-pencil-square"></i>',class:"btn btn-primary btn-sm"},action:"edit-page"},
                {panel:"main",name:"show",attributes:[{name:"class",value:"px-1"}],box:{tipe:5,value:'<i class="bi bi-eye-fill"></i>',class:"btn btn-primary btn-sm"},action:"edit"},
                
                {panel:"main",name:"cliente",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"NAME"},
                (userData.company.tipe == "2"?{panel:"main",name:"vehiculo",attributes:[{name:"style",value:"min-width: 200px;"}],box:{tipe:0},select:"VEHICLE"}:null),
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
              panels:[
                {col:6,y:0,tipe:"form",title:"informacion"},
                {col:6,y:0,tipe:"form",title:"cliente"},
              ],
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
                {table:'customers',field:'PHONE'},
                {table:'customers',field:'DIRECCION'},
                {table:'customers',field:'EMAIL'},
                {table:'customers',field:'COMPANY'},
                {table:'customers',field:'NRO_DOCUMENT'},
              ],
              joins:[
                {main:{table:"sales",field:"ID_CUSTOMER"},join:{table:"customers",field:"ID_CUSTOMER"},tipe:"LEFT"}
              ],
    
              fields:[
                {panel:"informacion",name:"nro",box:{tipe:0},select:"ID_SALE"},
                {panel:"informacion",name:"fecha de emision",box:{tipe:0},select:"DATE_EMMIT"},
                {panel:"informacion",name:"total",box:bx_moneyh1,select:"TOTAL"},

                {panel:"cliente",name:"cliente",box:{tipe:0},select:"NAME"},
                {panel:"cliente",name:"telefono",box:{tipe:0},select:"PHONE"},
                {panel:"cliente",name:"correo",box:{tipe:0},select:"EMAIL"},
                {panel:"cliente",name:"documento",box:{tipe:0,options:op_identity_document_tipe},select:"COMPANY"},
                {panel:"cliente",name:"nro documento",box:{tipe:0},select:"NRO_DOCUMENT"},
                {panel:"cliente",name:"direccion",box:{tipe:0},select:"DIRECCION"},
                
                //{panel:"informacion",name:"comentario",box:{tipe:0,value:""},select:"COMMENT"},
    
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
                {panel:"informacion",name:"descripcion",attributes:att_ln,box:{tipe:0},select:"PRODUCT_NAME"},
                {panel:"informacion",name:"tipo",attributes:att_ln50,box:{tipe:0,options:op_products_tipe},select:"ID_PRODUCT_TIPE"},
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

      function SaleCopy() {
        
        var sale_fm = cruds.Crud_GetBuild({name:"show-form"});
        var sale_tb = cruds.Crud_GetBuild({name:"show-table"});

        var inform = '';
        inform += 'fecha: ' + sale_fm.GetValue({fieldName:"fecha de emision",y:0});
        inform += '\ncliente: ' + sale_fm.GetValue({fieldName:"cliente",y:0});
        inform += '\ntelefono: ' + sale_fm.GetValue({fieldName:"telefono",y:0});
        inform += '\ncorreo: ' + sale_fm.GetValue({fieldName:"correo",y:0});
        inform += '\ntotal: S/.' + sale_fm.GetValue({fieldName:"total",y:0});

        var itemsCount = sale_tb.Reload_GetData().length;
        for (let y = 0; y < itemsCount; y++) {

          var itemName = sale_tb.GetValue({fieldName:"descripcion",y});
          var cant= sale_tb.GetValue({fieldName:"cantidad",y});
          var priceUnit = sale_tb.GetValue({fieldName:"precio unitario",y});
          var priceTotal = sale_tb.GetValue({fieldName:"precio total",y});
         
          inform += '\n';
          inform += ' item: ' + itemName;
          inform += ' ,cantidad: ' + cant;
          inform += ' ,precio unitario: ' + priceUnit;
          inform += ' ,precio total: ' + priceTotal;
        }

        navigator.clipboard.writeText(inform);
        console.log("sale information:");
        console.log(inform);

        alert("informacion de venta copiada!");
      }

      function SalePDF() {

        var sale_fm = cruds.Crud_GetBuild({name:"show-form"});
        var sale_tb = cruds.Crud_GetBuild({name:"show-table"});

        var items = [];
        var itemsCount = sale_tb.Reload_GetData().length;
        for (let y = 0; y < itemsCount; y++) {

          items.push({
            detail: sale_tb.GetValue({fieldName:"descripcion",y}),
            type: op_products_tipe.find(op=>op.value==sale_tb.GetValue({fieldName:"tipo",y})).show,
            quantity: sale_tb.GetValue({fieldName:"cantidad",y}), 
            unitPrice: parseFloat(sale_tb.GetValue({fieldName:"precio unitario",y})),
            totalPrice: parseFloat(sale_tb.GetValue({fieldName:"precio total",y})),
          });
        }

        generateInvoicePDF({
          invoiceNumber: sale_fm.GetValue({fieldName:"nro",y:0}),
          invoiceDate: sale_fm.GetValue({fieldName:"fecha de emision",y:0}),

          companyName: userData.company.nameReal,
          companyRUC:  userData.company.ruc,
          companyAddress: userData.company.direccion,
          companyPhone: userData.company.telf,

          customerName: sale_fm.GetValue({fieldName:"cliente",y:0}),
          customerDocumentType: op_identity_document_tipe.find(op=>op.value==sale_fm.GetValue({fieldName:"documento",y:0})).show,
          customerDocumentNumber: sale_fm.GetValue({fieldName:"nro documento",y:0}),
          customerPhone: sale_fm.GetValue({fieldName:"telefono",y:0}),
          customerAddress: sale_fm.GetValue({fieldName:"direccion",y:0}),
          items,
        });
      }

    }
  });

  

  

});
