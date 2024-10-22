
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      var acc_rucs = Access_Get(userData.access,"acc-11");

      new Crud_set({
        parent:pageData.body,
        title:"Reporte de Boletas y Facturas",
        panels:[
          {title:"main",tag:"",tipe:"table"},
        ],
        stateTools:[
          {
            name:"reload",
            tools:[
              {name:"sizes",value:999,show:false},
              {name:"reload",show:false},
              {name:"update",show:false},
              {name:"new",show:false},
              {name:"pdf",show:false},
              {name:"load",show:false},
              {name:"pages",show:false},
            ],
          }
        ],
        
        tableMain:"sales",
        selects:[
          {table:"sales",field:"ID_SALE",primary:true},
          //{table:"sales",field:"ID_COMPANY"},
          {table:"sales",field:"DATE_EMMIT"},
          //{table:"sales",field:"ID_STATUS"},
          //{table:"sales",field:"PAID"},
          {table:"sales",field:"ID_DOCUMENT"},
          {table:"sales",field:"DOCUMENT_EMMIT"},
          //{table:"sales",field:"ID_CUSTOMER"},
          {table:"sales",field:"TOTAL"},
        ],
        conditions:[
          {
            table:"sales",
            field:"ID_COMPANY",
            inter:"=",
            value:company_id,
          }
        ],
        orders:[
          {
            field:"DATE_EMMIT",
            asc:true,
          },
          {
            field:"ID_DOCUMENT",
            asc:true,
          }
        ],
        loads:[
          (acc_rucs?{...ld_rucs}:null),
        ],

        //configShow:true,
        filters:[
          {col:6,name:"fecha min",box:{...bx_date_start},select:{table:"sales",field:"DATE_EMMIT",tipe:"min"},descripcion:"buscar ventas por fechas mayor o igual"},
          {col:6,name:"fechamax",box:{...bx_date_end},select:{table:"sales",field:"DATE_EMMIT",tipe:"max"},descripcion:"buscar ventas por fechas menor o igual"},
          {name:"documento",box:{tipe:4,options:op_sales_document},select:{table:"sales",field:"ID_DOCUMENT"},descripcion:"buscar ventas por tipo de documento: nota de pago,boletas o facturas"},
          {name:"emitido",box:{tipe:4,options:op_document_emmit,value:"emitido"},select:{table:"sales",field:"DOCUMENT_EMMIT"},descripcion:"buscar si el documento ya fue emitido a sunat"},
          (acc_rucs?{name:"ruc",box:{tipe:3},load:{name:"ld-rucs",value:"value",show:"show"},select:{table:"sales",field:"ID_RUC"},descripcion:"buscar por ruc utilizado"}:null),
        ],
        fields:[
          {panel:"main",name:"fecha",select:"DATE_EMMIT",box:{tipe:0},descripcion:"fecha de emision de venta"},
          {panel:"main",name:"documento",select:"ID_DOCUMENT",box:{tipe:0,options:op_sales_document},descripcion:"documento de venta: nota de pago,boletas o facturas"},
          {panel:"main",name:"total",select:"TOTAL",box:bx_money,descripcion:"total de venta"},
          {panel:"main",name:"emitido",attributes:[{name:"style",value:"min-width:100px"}],box:{tipe:0,options:op_document_emmit},select:"DOCUMENT_EMMIT",descripcion:"si la nota de pago, boleta o factura ya fue emitida"},
        ],
      });

    }
  });

  

  

});
