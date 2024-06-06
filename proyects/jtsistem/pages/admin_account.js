
$(document).ready(function() {

  new Pag_Base({
    success:({userData})=>{

      var acc_company_update = userData.access.find(acc=>acc.value = "acc-4") && userData.access.find(acc=>acc.value = "acc-4").active == "true";

      var gr = new Grid({
        cols:[[12],[8,4],[12]],
      });

      var md_customer_fm = new Modal({parent:gr.GetColData({x:0,y:2}).col});

      var prnt_company = gr.GetColData({x:0,y:0}).col;
      var prnt_areas = gr.GetColData({x:1,y:1}).col;
      var prnt_workes = gr.GetColData({x:0,y:1}).col;
      var prnt_customer_fm = md_customer_fm.GetContent();

      new ConsCruds({

        cruds:[
          {
            name:"company",
            active:true,
            script:{
              parent:prnt_company,
              title:"Empresa",
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
      
            }
          },
          {
            name:"areas",
            active:true,
            script:{
              parent:prnt_areas,
              title:"Areas de Trabajo",
              panels:[{title:"main",tipe:"table",col:12,y:0}],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:true},
                        {name:"update",show:false},
                        {name:"new",show:true},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],

              tableMain:"work_areas",
              selects:[
                {table:"work_areas",field:"ID_WORK_AREA",primary:true},
                {table:"work_areas",field:"NAME"},
              ],
              conditions:[
                {
                  table:"work_areas",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],
              inserts:[...ins_general],

              fields:[
                {panel:"main",name:"nombre",select:"NAME",box:{tipe:1,class:"w-100"}},
              ],
            }
          },
          {
            name:"workes",
            active:true,
            script:{
              parent:prnt_workes,
              title:"Trabajadores",
              panels:[{title:"main",tipe:"table",col:12,y:0,h:500}],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:false},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:999},
                        {name:"reload",show:true},
                        {name:"update",show:false},
                        {name:"new",show:true},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],

              tableMain:"workers",
              selects:[
                {table:"workers",field:"ID_WORKER",primary:true},
                {table:"workers",field:"ID_CUSTOMER"},
                {table:"workers",field:"NAME"},
                {table:"workers",field:"ID_WORK_AREA"},
              ],
              conditions:[
                {
                  table:"workers",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],
              inserts:[...ins_general],
              loads:[
                {
                  name:"ld-areas",
                  tableMain:"work_areas",
                  selects:[
                    {table:"work_areas",field:"ID_WORK_AREA",as:"value"},
                    {table:"work_areas",field:"NAME",as:"show"},
                  ]
                },
              ],

              fields:[
                //{panel:"main",...fld_edit},
                {panel:"main",name:"nombre",select:"NAME",box:{tipe:1,class:"w-100"}},
                {panel:"main",name:"area",select:"ID_WORK_AREA",box:{tipe:8,class:"w-100"},load:{name:"ld-areas",value:"value",show:"show"}},
              ],

              events:[
                {
                  
                }
              ],
            }
          },
          {
            name:"customer",
            active:true,
            script:{
              parent:prnt_customer_fm,
              title:"cliente",
              panels:[{col:12,y:0,title:"main",tipe:"form"}],
              stateStart:"block",
              afterInsert:"block",
              afterUpdate:"block",
              afterCancel:"block",
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:true},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:1},
                        {name:"reload",show:true},
                        {name:"update",show:true},
                        {name:"new",show:false},
                        {name:"insert",show:false},
                        {name:"cancel",show:true},
                        
                        {name:"pages",show:false},
                    ],
                },
                {
                    name:"new",
                    tools:[
                        {name:"config",show:false},
                        {name:"load",show:true},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:1},
                        {name:"reload",show:false},
                        {name:"update",show:false},
                        {name:"new",show:false},
                        {name:"insert",show:true},
                        {name:"cancel",show:true},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],

              tableMain:"customers",
              selects:[
                {table:'customers', field:'ID_CUSTOMER',primary:true},
                {table:'customers', field:'ID_COMPANY'},
                {table:'customers', field:'NAME'},
                //{table:'customers', field:'ID_CUSTOMER_TIPE'},
                {table:'customers', field:'COMPANY'},
                {table:'customers', field:'NRO_DOCUMENT'},
                {table:'customers', field:'PHONE'},
                {table:'customers', field:'EMAIL'},
                {table:'customers', field:'DESCRIPCION'},
                {table:'customers', field:'DIRECCION'},
              ],
              conditions:[{
                table:"customers",
                field:"ID_COMPANY",
                inter:"=",
                value:company_id,
              }],
              inserts:ins_general,

              fields:[
                {panel:"main",col:8,name:"cliente",box:bx_input,select:"NAME"},
                {panel:"main",col:4,tipe:0,name:"empresa",box:{tipe:6,name:"empresa",value:0},select:"COMPANY"},
                {panel:"main",col:6,name:"documento",box:{tipe:0,options:op_identity_document_tipe},select:"COMPANY"},
                {panel:"main",col:6,name:"nro documento",box:bx_input,select:"NRO_DOCUMENT"},
                
                {panel:"main",col:12,name:"telefono",box:{tipe:1,value:""},select:"PHONE"},
                {panel:"main",col:12,name:"correo",box:{tipe:1,value:""},select:"EMAIL"},
                {panel:"main",col:12,name:"direccion",box:{tipe:1,value:""},select:"DIRECCION"},
                {panel:"main",col:12,tipe:2,name:"descripcion",box:{tipe:9,value:""},select:"DESCRIPCION"},
              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                      action:({k,active})=>{

                        md_customer_fm.SetActive({active});
                      }
                  }]
                },
              ],
            }
          }
        ],

        conections:[
        ],

      });
      
    }
  });
});
