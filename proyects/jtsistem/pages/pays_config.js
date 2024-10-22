
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var acc_control_update_total = true;//userData.access.find(acc=>acc.value=="acc-6") &&  userData.access.find(acc=>acc.value=="acc-6").active == "true";
      var acc_control_update_state = true;//userData.access.find(acc=>acc.value=="acc-7") &&  userData.access.find(acc=>acc.value=="acc-7").active == "true";

      var gr = new Grid({
        parent:pageData.body,
        cols:[[6,6],[12]],
        attributes:[
          {x:0,y:0,attributes:[{name:"class",value:"col-12 col-md-6"}]},
          {x:1,y:0,attributes:[{name:"class",value:"col-12 col-md-6 px-0 px-md-"+paddinForms + " pt-"+paddinForms + " pt-md-0"}]},
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
          {panel:"main",name:"total",box:(acc_control_update_total?{tipe:1}:bx_money),select:"TOTAL"},
          {panel:"main",name:"abierto",box:(acc_control_update_state?{tipe:6,name:"abierto"}:{tipe:0,options:op_account_state}),select:"OPEN"},
          {panel:"main",name:"controlado",box:{tipe:6,name:"controlado"},select:"CONTROL_BY_OPEN"},
          {panel:"main",name:"activo",box:bx_active_input,select:"ACTIVE"},
        ],


      });
    }
  });
  

});
