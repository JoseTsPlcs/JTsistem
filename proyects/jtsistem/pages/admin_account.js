
$(document).ready(function() {

  new Pag_Base({
    success:({userData})=>{

      var acc_company_update = userData.access.find(acc=>acc.value = "acc-4") && userData.access.find(acc=>acc.value = "acc-4").active == "true";

      new Crud_set({
        title:"Company",
        panels:[{col:12,title:"main",head:false,tipe:"form"}],
        stateTools:[
          {
              name:"reload",
              tools:[
                  {name:"config",show:false},
                  {name:"load",show:false},
                  
                  {name:"excel",show:false},
                  {name:"pdf",show:false},
      
                  {name:"sizes",show:false,value:1},
                  {name:"reload",show:false},
                  {name:"update",show:true},
                  {name:"new",show:false},
                  {name:"insert",show:false},
                  {name:"cancel",show:false},
                  
                  {name:"pages",show:false},
              ],
          }
        ],

        tableMain:"companies",
        selects:[
          {table:"companies",field:"ID_COMPANY",primary:true},
          {table:"companies",field:"NAME"},
          {table:"companies",field:"RUC"},
          {table:"companies",field:"NAME_REAL"},
          {table:"companies",field:"DIRECCION"},
          {table:"companies",field:"TELF"},
          {table:"companies",field:"EMAIL"},
        ],
        conditions:[
          {
            table:"companies",
            field:"ID_COMPANY",
            inter:"=",
            value:company_id,
          }
        ],

        fields:[
          {panel:"main",name:"nombre",box:{tipe:1,value:""},select:"NAME"},
          {panel:"main",name:"ruc",box:{tipe:1,value:""},select:"RUC"},
          {panel:"main",name:"razon social",box:{tipe:1,value:""},select:"NAME_REAL"},
          {panel:"main",name:"direccion",box:{tipe:1,value:""},select:"DIRECCION"},
          {panel:"main",name:"telefono",box:{tipe:1,value:""},select:"TELF"},
          {panel:"main",name:"correo",box:{tipe:1,value:""},select:"EMAIL"},
        ],

      })
      
    }
  });
});
