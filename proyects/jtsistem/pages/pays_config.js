
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var gr = new Grid({
        cols:[[6,6],[12]],
        attributes:[
          {x:0,y:0,attributes:[{name:"class",value:"col-12 col-md-6"}]},
          {x:1,y:0,attributes:[{name:"class",value:"col-12 col-md-6"}]},
        ],
      })

      new Crud_set({
        parent:gr.GetColData({x:0,y:0}).col,
        title:"lista de etiquetas",
        panels:[{col:12,y:0,tipe:"table",title:"main",h:200}],
        stateTools:stTls_tb,

        tableMain:"pay_tag",
        selects:[
          {table:'pay_tag', field:'ID_PAY_TAG',primary:true},
          {table:'pay_tag', field:'NAME'},
          {table:'pay_tag', field:'INCOME'},
          {table:'pay_tag', field:'ACTIVE'},
        ],
        conditions:[{
          table:"pay_tag",
          field:"ID_COMPANY",
          inter:"=",
          value:userData.company.id,
        }],
        inserts:[{
          field:"ID_COMPANY",
          value:userData.company.id,
        }],

        fields:[
          //{panel:"main",...fld_delete},
          {panel:"main",name:"etiqueta",box:bx_input,select:"NAME"},
          {panel:"main",name:"ingreso",box:{tipe:6,name:"ingreso"},select:"INCOME"},
          {panel:"main",name:"activo",box:bx_active_input,select:"ACTIVE"},
        ],


      });

      new Crud_set({
        parent:gr.GetColData({x:1,y:0}).col,
        title:"lista de cuentas",
        panels:[{col:12,y:0,tipe:"table",title:"main",h:200}],
        stateTools:stTls_tb,

        tableMain:"accounts",
        selects:[
          {table:'accounts', field:'ID_ACCOUNT',primary:true},
          {table:'accounts', field:'NAME'},
          {table:'accounts', field:'TOTAL'},
          {table:'accounts', field:'ACTIVE'},
          {table:'accounts', field:'OPEN'},
          {table:'accounts', field:'CONTROL_BY_OPEN'},
        ],
        conditions:[{
          table:"accounts",
          field:"ID_COMPANY",
          inter:"=",
          value:userData.company.id,
        }],
        inserts:[{
          field:"ID_COMPANY",
          value:userData.company.id,
        }],

        fields:[
          //{panel:"main",...fld_delete},
          {panel:"main",name:"cuenta",attributes:[{name:"style",value:"min-width: 250px"}],box:bx_input,select:"NAME"},
          {panel:"main",name:"total",box:bx_money,select:"TOTAL"},
          {panel:"main",name:"estado",box:{tipe:0,options:op_account_state},select:"OPEN"},
          (user_delete_data_import?{panel:"main",name:"abierto",box:{tipe:6,name:"abierto"},select:"OPEN"}:null),
          {panel:"main",name:"controlado",box:{tipe:6,name:"controlado"},select:"CONTROL_BY_OPEN"},
          {panel:"main",name:"activo",box:bx_active_input,select:"ACTIVE"},
        ],


      });
    }
  });
  

});
