
$(document).ready(function() {

  new Pag_Base({
    success:()=>{

      new Form_Table({

        title:'tipos de clientes',
        tables:['customers_types'],
        orders:[
          {table:0,field:2,asc:true},
        ],
        states:[{name:'reload',tools:[{name:'new',show:true}]}],
        fields:[
          //{delete:true},
          {primary:true},
          {name:'tipo',conection:{table:0,field:1},box:{tipe:1},attributes:[{name:'style',value:'min-width:120px'}]},
          {name:'prioridad',conection:{table:0,field:2},box:{tipe:1}},
          {name:'descripcion',conection:{table:0,field:3},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:250px'}]},
        ],
      });
    }
  });

});
