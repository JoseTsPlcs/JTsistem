
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var gr = new Grid({
        parent:pageData.body,
        cols:[
          [12],
          [12],
        ]
      });
      
      var md_vehicle_fm = new Modal({parent:gr.GetColData({x:0,y:1}).col});

      
      var prnt_vehicle_tb = gr.GetColData({x:0,y:0}).col;
      var prnt_vehicle_fm = md_vehicle_fm.GetContent();

      var front = null;

      new ConsCruds({
        cruds:[
          {
            name:"vehicle-tb",
            active:true,
            script:{
              parent:prnt_vehicle_tb,
              title:"lista de vehiculos",
              panels:[{col:12,y:0,title:"main",head:false,tipe:"table"}],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:true},
                        {name:"load",show:true},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:true,value:10},
                        {name:"reload",show:true},
                        {name:"update",show:false},
                        {name:"new",show:true},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:true},
                    ],
                }
              ],

              tableMain:"items_vehicles",
              selects:[
                {table:"items_vehicles",field:"ID_VEHICLE",primary:true},
                {table:"items_vehicles",field:"PLACA"},
                {table:"items_vehicles",field:"MARCA"},
                {table:"items_vehicles",field:"MODELO"},
                {table:"items_vehicles",field:"NRO_MOTO"},
                {table:"items_vehicles",field:"NRO_VIN"},                
                {table:"items_vehicles",field:"ANIO"},
                {table:"items_vehicles",field:"COLOR"},
              ],
              inserts:[
                ...ins_general,
              ],
              conditions:[
                {
                  before:" AND ",
                  table:"items_vehicles",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],

              filters:[
                {name:"placa",box:{tipe:1,class:"w-100"},select:{table:"items_vehicles",field:"PLACA"}},
                {name:"marca",box:{tipe:1,class:"w-100"},select:{table:"items_vehicles",field:"MARCA"}},
                {name:"modelo",box:{tipe:1,class:"w-100"},select:{table:"items_vehicles",field:"MODELO"}},
                {name:"nro de motor",box:{tipe:1,class:"w-100"},select:{table:"items_vehicles",field:"NRO_MOTO"}},
                {name:"nro de vin",box:{tipe:1,class:"w-100"},select:{table:"items_vehicles",field:"NRO_VIN"}},
                {name:"año",box:{tipe:1,class:"w-100"},select:{table:"items_vehicles",field:"ANIO"}},
                {name:"color",box:{tipe:1,class:"w-100"},select:{table:"items_vehicles",field:"COLOR"}},
              ],
              fields:[
                {panel:"main",...fld_edit},
                {panel:"main",name:"placa",box:{tipe:1,value:""},select:"PLACA"},
                {panel:"main",name:"marca",box:{tipe:1,value:""},select:"MARCA"},
                {panel:"main",name:"modelo",box:{tipe:1,value:""},select:"MODELO"},
                {panel:"main",name:"nro de motor",box:{tipe:1,value:""},select:"NRO_MOTO"},
                {panel:"main",name:"nro de vin",box:{tipe:1,value:""},select:"NRO_VIN"},
                {panel:"main",name:"año",box:{tipe:1,value:""},select:"ANIO"},
                {panel:"main",name:"color",box:{tipe:1,value:""},select:"COLOR"},
              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md_vehicle_fm.SetActive({active});
                    }
                  }]
                }
              ],
            }
          },
          {
            name:"vehicle-fm",
            active:true,
            script:{
              parent:prnt_vehicle_fm,
              title:"vehiculo",
              panels:[{col:12,y:0,title:"main",head:false,tipe:"form"}],
              stateStart:"block",
              afterCancel:"block",

              tableMain:"items_vehicles",
              selects:[
                {table:"items_vehicles",field:"ID_VEHICLE",primary:true},
                {table:"items_vehicles",field:"PLACA"},
                {table:"items_vehicles",field:"MARCA"},
                {table:"items_vehicles",field:"MODELO"},
                {table:"items_vehicles",field:"NRO_MOTO"},
                {table:"items_vehicles",field:"NRO_VIN"},                
                {table:"items_vehicles",field:"ANIO"},
                {table:"items_vehicles",field:"COLOR"},
              ],
              inserts:[
                ...ins_general,
              ],

              fields:[
                {panel:"main",name:"placa",box:{tipe:1,value:""},select:"PLACA"},
                {panel:"main",name:"marca",box:{tipe:1,value:""},select:"MARCA"},
                {panel:"main",name:"modelo",box:{tipe:1,value:""},select:"MODELO"},
                {panel:"main",name:"nro de motor",box:{tipe:1,value:""},select:"NRO_MOTO"},
                {panel:"main",name:"nro de vin",box:{tipe:1,value:""},select:"NRO_VIN"},
                {panel:"main",name:"año",box:{tipe:1,value:""},select:"ANIO"},
                {panel:"main",name:"color",box:{tipe:1,value:""},select:"COLOR"},
              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md_vehicle_fm.SetActive({active});
                    }
                  }]
                }
              ],
            }
          },
        ],

        conections:[
          {
            tipe:"tb-fm",
            master:"vehicle-tb",
            masterField:"ID_VEHICLE",
            maid:"vehicle-fm",
            maidField:"ID_VEHICLE",
          },
        ],
      })

    }
  });
  

});
