
$(document).ready(function() {

  new Pag_Base({
    success:()=>{

      new Form_Table({

        title:'unidades',
        tables:['unidades'],
        fields:[
          {delete:true},
          {primary:true},
          {name:'unidad',conection:{table:0,field:1},box:{tipe:1}},
          {name:'simbolo',conection:{table:0,field:2},box:{tipe:1}},
        ],
      });
    }
  });

});
