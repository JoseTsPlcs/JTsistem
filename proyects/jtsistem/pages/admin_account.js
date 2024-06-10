
$(document).ready(function() {

  new Pag_Base({
    success:({userData})=>{

      var acc_company_update = userData.access.find(acc=>acc.value = "acc-4") && userData.access.find(acc=>acc.value = "acc-4").active == "true";

      var gr = new Grid({
        cols:[[12],[8,4],[12]],
        attributes:[
          {x:0,y:1,attributes:[{name:"class",value:"col-12 col-md-8"}]},
          {x:1,y:1,attributes:[{name:"class",value:"col-12 col-md-4"}]},
        ],
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
                  ],
                  conditions:[
                    {
                      table:"work_areas",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
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
        ],

        conections:[
        ],

      });
      
    }
  });
});
