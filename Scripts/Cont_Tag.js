
$(document).ready(function() {

  new Pag_Base({
    success:()=>{

      new Form_Table({

        title:'etiquetas',
        tables:['transactions_tags'],
        orders:[
          {table:0,field:2,asc:true},
        ],
        states:[{name:'reload',tools:[{name:'new',show:true}]}],
        fields:[
          //{delete:true},
          //{primary:true},
          {name:'etiqueta',box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:250px'}],field:1},
          {name:'ingreso',box:{tipe:6},field:2},
          {name:'mostrar',box:{tipe:6},field:3},
        ],
      });
    }
  });

});
