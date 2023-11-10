
$(document).ready(function() {

  new Pag_Base({
    success:({page})=>{

      new Form_Table({

        title:'proveedores',
        tables:['providers'],
        states:[
          {name:'reload',tools:[{name:'new',show:true}]},
        ],
        fields:[
          //{primary:true},
          {name:'empresa',conection:{table:0,field:1},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:250px'}]},
          {name:'ruc',conection:{table:0,field:2},box:{tipe:1,class:'w-100'}},
          {name:'celular',conection:{table:0,field:3},box:{tipe:1,class:'w-100'}},
          {name:'activo',conection:{table:0,field:4},box:{tipe:6}},
        ],
      });
    }
  });

});
