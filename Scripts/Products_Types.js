
$(document).ready(function() {

  new Pag_Base({
    success:()=>{

      new Form_Table({

        title:'productos tipo',
        tables:['productos_tipo'],
        fields:[
          {delete:true},
          {primary:true},
          {name:'tipo',conection:{table:0,field:1},box:{tipe:1}},
        ],
      });
    }
  });

});
