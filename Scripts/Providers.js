
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      var control = new Crud_Table({
        title:'proveedores',
        tables:['providers'],
        fields:[
            {delete:true},
            {edit:true},
            {name:'empresa',size:300,sql:{field:1},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:250px'}]},
            {name:'ruc',size:200,sql:{field:2},box:{tipe:1,class:'w-100'}},
            {name:'celular',size:200,sql:{field:3},box:{tipe:1,class:'w-100'}},
            {name:'activo',size:40,sql:{field:4},box:{tipe:6}},
        ],
      });

      var add = new Crud_Form({
        modal:true,
        ...provider_add,
      });

      new Crud_Master({
        master:{
          event:"edit",
          fieldSqlName:"primary",
          build:control,
        },
        maid:{
          fieldSqlIndex:0,
          build:add,
        }
      });
    }
  });

});
