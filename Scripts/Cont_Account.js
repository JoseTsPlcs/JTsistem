
$(document).ready(function() {

  new Pag_Base({
    success:()=>{

      new Form_Table({

        title:'cuentas',
        tables:['accounts'],
        states:[{name:'reload',tools:[{name:'new',show:true}]}],
        fields:[
          //{delete:true},
          //{primary:true},
          {name:'nombre',box:{tipe:1},attributes:[{name:'style',value:'min-width:250px'}],field:1},
          {name:'total',box:{tipe:1},field:2},
          {name:'activo',box:{tipe:6},field:3},
        ],
      });
    }
  });

});
