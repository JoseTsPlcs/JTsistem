
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({cols:[[12]]});

      new Crud_set({

        parent:gr.GetColData({x:0,y:0}).col,
        title:"lista de cliente",
        panels:[{col:12,y:0,title:"main",tipe:"table"}],
        stateTools:stTls_tb,

        tableMain:"customers",
        selects:[
          {table:'customers', field:'ID_CUSTOMER',primary:true},
          {table:'customers', field:'NAME'},
          {table:'customers', field:'COMPANY'},
          {table:'customers', field:'NRO_DOCUMENT'},
        ],
        conditions:[
          {
            before:" AND ",
            table:"customers",
            field:"ID_COMPANY",
            inter:"=",
            value:userData.company.id,
          }
        ],
        inserts:[
          {
            field:"ID_COMPANY",
            value:userData.company.id,
          }
        ],

        configShow:false,
        filters:[
          {col:12,y:0,name:"nombre",box:bx_input,select:{table:"customers",field:"NAME"}},
          {col:12,y:1,name:"documento",box:bx_input,select:{table:"customers",field:"NRO_DOCUMENT"}},
          {col:12,y:2,name:"empresa",box:{tipe:4,class:"w-100",options:[{value:1,show:"empresa"},{value:0,show:"persona"}]},select:{table:"customers",field:"COMPANY"}},
        ],
        fields:[
          {panel:"main",...fld_delete},
          {panel:"main",name:"nombre",attributes:[{name:"style",value:"min-width: 200px;"}],box:bx_input,select:"NAME"},
          //{panel:"main",name:"tipo",box:bx_op({ops:[]}),select:"ID_CUSTOMER_TIPE",load:{name:"customers_tipes",show:"show"}},
          {panel:"main",name:"empresa",box:{tipe:6,name:"empresa"},select:"COMPANY"},
          {panel:"main",name:"documento",attributes:[{name:"style",value:"min-width: 150px;"}],box:bx_input,select:"NRO_DOCUMENT"},
        ],

      });

    }
  });

  
  

});
