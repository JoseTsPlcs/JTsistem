
$(document).ready(function() {

  var test = true;

  var use = test ? "" : prompt("Por favor, ingresa tu usuario:");
  var pass = test ? "" : prompt("Por favor, ingresa la contraseña:");

  if(test || (use == "alonso" && pass == "alonso2024")){

    var gr = new Grid({
        cols:[
          [12],
          [12],
        ],
    });

    var prnt_companie = gr.GetColData({x:0,y:0}).col;
    var prnt_admin = gr.GetColData({x:0,y:1}).col;
    var adminOpen = false;

    var cr_companies = new Crud_set({
      parent:prnt_companie,
      title:"lista de clientes",
      panels:[{col:12,y:0,title:"main",tipe:"table"}],
      stateTools:[
        {
          name:"reload",
          tools:[
              {name:"config",show:true},
              {name:"load",show:true},
              
              {name:"excel",show:false},
              {name:"pdf",show:false},

              {name:"sizes",show:true,value:999},
              {name:"reload",show:true},
              {name:"update",show:false},
              {name:"new",show:true},
              {name:"insert",show:false},
              {name:"cancel",show:false},
              
              {name:"pages",show:false},
          ],
        }
      ],

      tableMain:"companies",
      selects:[
        {table:"companies",field:"ID_COMPANY",primary:true},
        {table:"companies",field:"ID_COMPANY_TYPE"},
        {table:"companies",field:"NAME"},
        {table:"companies",field:"LOGO"},
        {table:"companies",field:"RUC"},
        {table:"companies",field:"ACTIVE"},
        {table:"companies",field:"NAME_REAL"},
        {table:"companies",field:"DIRECCION"},
        {table:"companies",field:"TELF"},
        {table:"companies",field:"EMAIL"},
      ],

      fields:[
        //{panel:"main",...fld_delete},
        {panel:"main",...fld_edit},
        {panel:"main",name:"id",box:{tipe:0},select:"ID_COMPANY"},
        {panel:"main",name:"tipo",attributes:[{name:"style",value:"min-width:100px"}],box:{tipe:3,options:op_company_type},select:"ID_COMPANY_TYPE"},
        {panel:"main",name:"nombre",attributes:[{name:"style",value:"min-width:300px"}],box:{tipe:1,class:"w-100"},select:"NAME"},
        {panel:"main",name:"logo show",box:{tipe:10,style:"max-width: 100px;"},select:"LOGO"},
        {panel:"main",name:"logo update",box:{tipe:1,attributes:[{name:"type",value:"file"}]},select:"LOGO"},
        {panel:"main",name:"active",box:{tipe:6,name:"active"},select:"ACTIVE"},
        {panel:"main",name:"ruc",attributes:[{name:"style",value:"min-width:300px"}],box:{tipe:1,class:"w-100"},select:"RUC"},
        {panel:"main",name:"razon social",attributes:[{name:"style",value:"min-width:300px"}],box:{tipe:1,class:"w-100"},select:"NAME_REAL"},
        {panel:"main",name:"direccion",attributes:[{name:"style",value:"min-width:300px"}],box:{tipe:1,class:"w-100"},select:"DIRECCION"},
        {panel:"main",name:"celular",attributes:[{name:"style",value:"min-width:300px"}],box:{tipe:1,class:"w-100"},select:"TELF"},
        {panel:"main",name:"email",attributes:[{name:"style",value:"min-width:300px"}],box:{tipe:1,class:"w-100"},select:"EMAIL"},
      ],

      events:[
        {
          name:"boxUpdate",
          actions:[{
            action:({k,field,y})=>{

              if(field.action=="edit"){

                if(adminOpen){

                  alert("vuelve a recargar la pagina");
                  return;
                }

                adminOpen = true;
                var id_company = k.Reload_GetData({})[y]["ID_COMPANY"];
                scr_admin({
                  id_company,parent:prnt_admin,
                  editAccess:true,
                  editClase:true,
                  editUsuarios:true,
                });
              }
            }
          }]
        }
      ],
    });

    

  }
  else
  {

    alert("contraseña o usuario incorrectos");
  }

  //scr_admin({});
  
});
