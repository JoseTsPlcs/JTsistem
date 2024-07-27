
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var gr = new Grid({
        parent:pageData.body,
        cols:[
          [12],
          [12],
          [12],
          [12],
        ]
      });
      
      var md_checkin_fm = new Modal({parent:gr.GetColData({x:0,y:1}).col,size:"lg",active:false});
      var md_vehicle_fm = new Modal({
        parent:gr.GetColData({x:0,y:2}).col,
        index:-2,
        size:null,
        active:false,
        events:[
          {
            name:"hiden",
            actions:[{
              action:({k})=>{

                md_checkin_fm.SetActive({active:false});
                md_checkin_fm.SetActive({active:true});
              }
            }]
          }
        ],
      });
      var md_customer_fm = new Modal({
        parent:gr.GetColData({x:0,y:3}).col,
        index:-2,
        size:null,
        active:false,
        events:[
          {
            name:"hiden",
            actions:[{
              action:({k})=>{

                md_checkin_fm.SetActive({active:false});
                md_checkin_fm.SetActive({active:true});
              }
            }]
          }
        ],
      });

      var fm_checkin_fm = new Form({
        parent:md_checkin_fm.GetContent(),head:false,
        fields:[
          {name:"content",tipe:0,box:{tipe:0,class:"w-100 px-0 mx-0"}},
        ],
        tools:[
          {position:"botton-center",name:"pdf",box:{tipe:5,value:'pdf <i class="bi bi-filetype-pdf"></i>',class:"btn btn-danger btn-sm",update:()=>{SavePdf()}}},
        ],
      });

      var prnt_checkin_tb = gr.GetColData({x:0,y:0}).col;
      var prnt_checkin_fm = fm_checkin_fm.Field_GetBox({fieldName:"content"}).Blocks_Get()[0];
      var prnt_vehicle_fm = md_vehicle_fm.GetContent();
      var prnt_customer_fm = md_customer_fm.GetContent();

      var front = null;

      var cruds = new ConsCruds({
        cruds:[
          {
            name:"checkin-tb",
            active:true,
            script:{
              parent:prnt_checkin_tb,
              title:"Ordenes de Trabajo",
              panels:[{title:"main",col:12,y:0,tipe:"table"}],
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
              
              tableMain:"checkin_vehicles",
              selects:[
                {table: "checkin_vehicles", field: "ID_CHECKIN_VEHICLE", primary: true},
                {table: "checkin_vehicles", field: "DATE_ENTER"},
                {table:"items_vehicles",field:"PLACA"},
                {table:"items_vehicles",field:"MARCA"},
                {table:"customers",field:"NAME"},
              ],
              joins:[
                {
                  main:{table:"checkin_vehicles",field:"ID_ITEM_VEHICLE"},
                  join:{table:"items_vehicles",field:"ID_VEHICLE"},
                  tipe:"LEFT",
                },
                {
                  main:{table:"checkin_vehicles",field:"ID_CUSTOMER"},
                  join:{table:"customers",field:"ID_CUSTOMER"},
                  tipe:"LEFT",
                }
              ],
              orders:[
                {field:"DATE_ENTER",asc:false},
              ],
              conditions:[
                {
                  table:"checkin_vehicles",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],
              inserts:ins_general,

              filters:[
                {name:"cliente",box:bx_input,select:{table:"customers",field:"NAME"}},
                {name:"placa",box:bx_input,select:{table:"items_vehicles",field:"PLACA"}},
                {name:"marca",box:bx_input,select:{table:"items_vehicles",field:"MARCA"}},
                {col:6,name:"fecha min",box:bx_date,select:{table:"checkin_vehicles",field:"DATE_ENTER",tipe:"min"}},
                {col:6,name:"fechamax",box:bx_date,select:{table:"checkin_vehicles",field:"DATE_ENTER",tipe:"max"}},
              ],
              fields:[
                //{panel:"main",...fld_delete},
                {panel:"main",...fld_edit},
                //{panel:"main",name:"pdf",box:{tipe:5,value:'<i class="bi bi-filetype-pdf"></i>',class:"btn btn-danger btn-sm"},action:"pdf"},
                {panel:"main",name:"fecha de entrada",box:{tipe:0},select:"DATE_ENTER"},
                {panel:"main",name:"cliente",box:{tipe:0},select:"NAME"},
                {panel:"main",name:"marca",box:{tipe:0},select:"MARCA"},
                {panel:"main",name:"placa",box:{tipe:0},select:"PLACA"},
              ],

              events:[
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({field})=>{
  
                      
                    }
                  }]
                }
              ]
            },

          },
          {
            name:"checkin-fm",
            active:true,
            script:{
              parent:prnt_checkin_fm,
              title:"Orden de Trabajo",head:true,
              panels:[
                {col:12,y:0,title:"Datos del Cliente",tipe:"form",h:0,blocked:false},
                {col:12,y:0,title:"Datos del Vehiculo",tipe:"form",blocked:false},
                {col:4,y:1,title:"Inventario de Recepcion",tipe:"form",blocked:false},
                {col:8,y:1,title:"Chasis",tipe:"form",blocked:false},
              ],
              stateStart:"block",
              //afterUpdate:"block",
              afterCancel:"block",
              afterInsert:"block",
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
                }
              ],
              
              tableMain:"checkin_vehicles",
              selects:[
                {table: "checkin_vehicles", field: "ID_CHECKIN_VEHICLE", primary: true},
                {table: "checkin_vehicles", field: "ID_COMPANY"},
                {table: "checkin_vehicles", field:"ID_CUSTOMER"},
                {table: "checkin_vehicles", field:"ID_CUSTOMER_RECEPTOR"},
                {table: "checkin_vehicles", field:"ID_USER_RECEPTOR"},
                {table: "checkin_vehicles", field: "ID_SALE"},
                {table: "checkin_vehicles", field: "ID_ITEM_VEHICLE"},
                {table: "checkin_vehicles", field: "DATE_ENTER"},
                {table: "checkin_vehicles", field: "FUEL"},
                {table: "checkin_vehicles", field: "MILEAGE"},
                {table: "checkin_vehicles", field: "MILEAGE_PROX"},
                {table: "checkin_vehicles", field: "COMENT"},
                {table: "checkin_vehicles", field: "OBSERVATIONS"},
                {table: "checkin_vehicles", field: "CHECK_1"},
                {table: "checkin_vehicles", field: "CHECK_2"},
                {table: "checkin_vehicles", field: "CHECK_3"},
                {table: "checkin_vehicles", field: "CHECK_4"},
                {table: "checkin_vehicles", field: "CHECK_5"},
                {table: "checkin_vehicles", field: "CHECK_6"},
                {table: "checkin_vehicles", field: "CHECK_7"},
                {table: "checkin_vehicles", field: "CHECK_8"},
                {table: "checkin_vehicles", field: "CHECK_9"},
                {table: "checkin_vehicles", field: "CHECK_10"},
                {table: "checkin_vehicles", field: "CHECK_11"},
                {table: "checkin_vehicles", field: "CHECK_12"},
                {table: "checkin_vehicles", field: "CHECK_13"},
                {table: "checkin_vehicles", field: "CHECK_14"},
                {table: "checkin_vehicles", field: "CHECK_15"},
                {table: "checkin_vehicles", field: "CHECK_16"},
                {table: "checkin_vehicles", field: "CHECK_17"},
                {table: "checkin_vehicles", field: "CHECK_18"},
                {table: "checkin_vehicles", field: "CHECK_19"},
                {table: "checkin_vehicles", field: "CHECK_20"},
                {table: "checkin_vehicles", field: "CHECK_21"},
                {table: "checkin_vehicles", field: "CHECK_22"},
                {table: "checkin_vehicles", field: "CHECK_23"},
                {table: "checkin_vehicles", field: "CHECK_24"},
                {table: "checkin_vehicles", field: "CHECK_25"},
                {table: "checkin_vehicles", field: "CHECK_26"},
                {table: "checkin_vehicles", field: "DATE_OUT"},
                
                {table: "checkin_vehicles", field: "IMG_FRONT"},

                {table:"customers",field:"NAME",as:"CUSTOMER_NAME"},
                {table:"customers",field:"COMPANY",as:"CUSTOMER_COMPANY"},
                {table:"customers",field:"NRO_DOCUMENT",as:"CUSTOMER_NRO"},
                {table:"customers",field:"PHONE",as:"CUSTOMER_CEL"},
                {table:"customers",field:"DIRECCION",as:"CUSTOMER_DIR"},
                {table:"customers",field:"EMAIL",as:"CUSTOMER_EMAIL"},

                {table:"items_vehicles",field:"PLACA"},
                {table:"items_vehicles",field:"MARCA"},
                {table:"items_vehicles",field:"MODELO"},
                {table:"items_vehicles",field:"NRO_MOTO"},
                {table:"items_vehicles",field:"NRO_VIN"},
                {table:"items_vehicles",field:"ANIO"},
                {table:"items_vehicles",field:"COLOR"},

                {table:"workers",field:"NAME",as:"WORKER_NAME"},
                {table:"workers",field:"CEL_NUMBER",as:"WORKER_CEL"},
              ],
              inserts:[
                ...ins_general,
              ],
              joins:[
                {
                  main:{table:"checkin_vehicles",field:"ID_CUSTOMER"},
                  join:{table:"customers",field:"ID_CUSTOMER"},
                  tipe:"LEFT",
                },
                {
                  main:{table:"checkin_vehicles",field:"ID_ITEM_VEHICLE"},
                  join:{table:"items_vehicles",field:"ID_VEHICLE"},
                  tipe:"LEFT",
                },
                {
                  main:{table:"checkin_vehicles",field:"ID_USER_RECEPTOR"},
                  join:{table:"workers",field:"ID_WORKER"},
                  tipe:"LEFT",
                }
              ],
              loads:[
                {
                  name:"ld-items",
                  tableMain:"items_vehicles",
                  selects:[
                    {table:"items_vehicles",field:"ID_VEHICLE",as:"value"},
                    {sql:"CONCAT(items_vehicles.PLACA,'-',items_vehicles.MARCA) AS 'show'"},
                    {table:"items_vehicles",field:"PLACA"},
                    {table:"items_vehicles",field:"MARCA"},
                    {table:"items_vehicles",field:"MODELO"},
                    {table:"items_vehicles",field:"NRO_MOTO"},
                    {table:"items_vehicles",field:"NRO_VIN"},                
                    {table:"items_vehicles",field:"ANIO"},
                    {table:"items_vehicles",field:"COLOR"},
                  ],
                  conditions:[
                    {
                      table:"items_vehicles",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
                },
                {
                  name:"ld-customers",
                  tableMain:"customers",
                  selects:[
                    {table:'customers', field:'ID_CUSTOMER',as:"value"},
                    {table:'customers', field:'NAME',as:"show"},
                    //{table:'customers', field:'ID_CUSTOMER_TIPE'},
                    {table:'customers', field:'COMPANY'},
                    {table:'customers', field:'NRO_DOCUMENT'},
                    {table:'customers', field:'PHONE'},
                    {table:'customers', field:'DIRECCION'},
                    {table:'customers', field:'EMAIL'},
                    {table:'customers', field:'DESCRIPCION'},
                  ],
                  conditions:[
                    {
                      table:"customers",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
                },
                {
                  name:"ld-workers",
                  tableMain:"workers",
                  selects:[
                    {table:"workers",field:"ID_WORKER",as:"value"},
                    {sql:'CONCAT(workers.NAME,"-",work_areas.NAME) AS "show"'},
                  ],
                  joins:[
                    {
                      main:{table:"workers",field:"ID_CUSTOMER"},
                      join:{table:"customers",field:"ID_CUSTOMER"},
                      tipe:"LEFT",
                    },
                    {
                      main:{table:"workers",field:"ID_WORK_AREA"},
                      join:{table:"work_areas",field:"ID_WORK_AREA"},
                      tipe:"LEFT",
                    },
                  ],
                  conditions:[
                    {
                      table:"workers",
                      field:"ID_COMPANY",
                      inter:"=",
                      value:company_id,
                    }
                  ],
                },
              ],

              fields:[

                {panel:"Datos del Cliente",col:8,colAllLevel:true,name:"cliente",box:{tipe:8,class:"w-100"},load:{name:"ld-customers",value:"value",show:"show"},select:"ID_CUSTOMER"},
                {panel:"Datos del Cliente",col:2,colAllLevel:true,name:"cus-edit",...fld_edit,action:"cus-edit"},
                {panel:"Datos del Cliente",col:2,colAllLevel:true,name:"cus-add",...fld_add,action:"cus-add"},

                {panel:"Datos del Cliente",col:8,colAllLevel:true,name:"solicitante",box:{tipe:8,class:"w-100"},load:{name:"ld-customers",value:"value",show:"show"},select:"ID_CUSTOMER_RECEPTOR"},
                {panel:"Datos del Cliente",col:2,colAllLevel:true,name:"sol-edit",...fld_edit,action:"cus-edit"},
                {panel:"Datos del Cliente",col:2,colAllLevel:true,name:"sol-add",...fld_add,action:"cus-add"},

                {panel:"Datos del Cliente",col:12,colAllLevel:true,name:"recepcionista",box:{tipe:8,class:"w-100"},load:{name:"ld-workers",value:"value",show:"show"},select:"ID_USER_RECEPTOR"},

                {panel:"Datos del Vehiculo",col:8,colAllLevel:true,name:"vehiculo",box:{tipe:8,class:"w-100"},select:"ID_ITEM_VEHICLE",load:{name:"ld-items",value:"value",show:"show"}},
                {panel:"Datos del Vehiculo",col:2,colAllLevel:true,name:"veh-edit",...fld_edit,action:"veh-edit"},
                {panel:"Datos del Vehiculo",col:2,colAllLevel:true,name:"veh-add",...fld_add,action:"veh-add"},
                //{panel:"Datos del Vehiculo",col:2,colAllLevel:true,...fld_edit},{panel:"Datos del Vehiculo",col:2,colAllLevel:true,...fld_add},
                {panel:"Datos del Vehiculo",col:6,name:"fecha de ingreso",box:bx_date,select:"DATE_ENTER"},
                {panel:"Datos del Vehiculo",col:6,name:"fecha de entrega",box:bx_date,select:"DATE_OUT"},
                {panel:"Datos del Vehiculo",col:12,name:"combustible",box:{tipe:1,value:0,attributes:[{name:"type",value:"range"},{name:"min",value:0},{name:"max",value:100}]},select:"FUEL"},
                {panel:"Datos del Vehiculo",col:4,name:"kilometraje",box:{tipe:1,value:0},select:"MILEAGE"},
                {panel:"Datos del Vehiculo",col:8,name:"kilometraje del proximo servicio",box:{tipe:1,value:0},select:"MILEAGE_PROX"},
                {panel:"Datos del Vehiculo",col:12,name:"requerimiento",box:{tipe:9,value:""},select:"COMENT"},

                
                {panel:"Inventario de Recepcion",name:"check in 1",tipe:0,box:{tipe:6,value:0,name:"radio"},select:"CHECK_1"},
                {panel:"Inventario de Recepcion",name:"check in 2",tipe:0,box:{tipe:6,value:0,name:"tapa aceite motor"},select:"CHECK_2"},
                {panel:"Inventario de Recepcion",name:"check in 3",tipe:0,box:{tipe:6,value:0,name:"antena de radio"},select:"CHECK_3"},
                {panel:"Inventario de Recepcion",name:"check in 4",tipe:0,box:{tipe:6,value:0,name:"brazo de plumilla"},select:"CHECK_4"},
                {panel:"Inventario de Recepcion",name:"check in 5",tipe:0,box:{tipe:6,value:0,name:"cabezales de asiento"},select:"CHECK_5"},
                {panel:"Inventario de Recepcion",name:"check in 6",tipe:0,box:{tipe:6,value:0,name:"cenicero"},select:"CHECK_6"},
                {panel:"Inventario de Recepcion",name:"check in 7",tipe:0,box:{tipe:6,value:0,name:"cinturon de seguridad"},select:"CHECK_7"},
                {panel:"Inventario de Recepcion",name:"check in 8",tipe:0,box:{tipe:6,value:0,name:"claxon"},select:"CHECK_8"},
                {panel:"Inventario de Recepcion",name:"check in 9",tipe:0,box:{tipe:6,value:0,name:"alarma y control"},select:"CHECK_9"},
                {panel:"Inventario de Recepcion",name:"check in 10",tipe:0,box:{tipe:6,value:0,name:"emblemas"},select:"CHECK_10"},
                {panel:"Inventario de Recepcion",name:"check in 11",tipe:0,box:{tipe:6,value:0,name:"encendedor"},select:"CHECK_11"},
                {panel:"Inventario de Recepcion",name:"check in 12",tipe:0,box:{tipe:6,value:0,name:"escarpines"},select:"CHECK_12"},
                {panel:"Inventario de Recepcion",name:"check in 13",tipe:0,box:{tipe:6,value:0,name:"espejos externos"},select:"CHECK_13"},
                {panel:"Inventario de Recepcion",name:"check in 14",tipe:0,box:{tipe:6,value:0,name:"espejo initerior"},select:"CHECK_14"},
                {panel:"Inventario de Recepcion",name:"check in 15",tipe:0,box:{tipe:6,value:0,name:"gata y palanca"},select:"CHECK_15"},
                {panel:"Inventario de Recepcion",name:"check in 16",tipe:0,box:{tipe:6,value:0,name:"juego de herramientas"},select:"CHECK_16"},
                {panel:"Inventario de Recepcion",name:"check in 17",tipe:0,box:{tipe:6,value:0,name:"llantas de repuesto"},select:"CHECK_17"},
                {panel:"Inventario de Recepcion",name:"check in 18",tipe:0,box:{tipe:6,value:0,name:"llave de ruedas"},select:"CHECK_18"},
                {panel:"Inventario de Recepcion",name:"check in 19",tipe:0,box:{tipe:6,value:0,name:"llave de seguro vasos"},select:"CHECK_19"},
                {panel:"Inventario de Recepcion",name:"check in 20",tipe:0,box:{tipe:6,value:0,name:"llave de seguro rueda"},select:"CHECK_20"},
                {panel:"Inventario de Recepcion",name:"check in 21",tipe:0,box:{tipe:6,value:0,name:"llavero"},select:"CHECK_21"},
                {panel:"Inventario de Recepcion",name:"check in 22",tipe:0,box:{tipe:6,value:0,name:"luz de salon"},select:"CHECK_22"},
                {panel:"Inventario de Recepcion",name:"check in 23",tipe:0,box:{tipe:6,value:0,name:"manija de puertas"},select:"CHECK_23"},
                {panel:"Inventario de Recepcion",name:"check in 24",tipe:0,box:{tipe:6,value:0,name:"parlantes"},select:"CHECK_24"},
                {panel:"Inventario de Recepcion",name:"check in 25",tipe:0,box:{tipe:6,value:0,name:"pisos de jebe"},select:"CHECK_25"},
                {panel:"Inventario de Recepcion",name:"check in 26",tipe:0,box:{tipe:6,value:0,name:"plimillas/otros"},select:"CHECK_26"},

                {panel:"Chasis",name:"front",tipe:2,box:{tipe:0,class:"w-100 px-0 mx-0"},action:"img"},
                {panel:"Chasis",name:"observacion",box:{tipe:9,class:"w-100 px-0 mx-0",value:""},select:"OBSERVATIONS"},
                //{panel:"chasis",name:"comentario",tipe:2,box:{tipe:9,value:""},select:"COMENT"},
                //type="file" class="form-control-file" id="imageInput" value="../images/mi_imagen.jpg"
                
              ],

              events:[
                {
                  name:"setStateAfter",
                  actions:[{
                    action:({k,stateName})=>{

                      console.log("set satet",stateName);

                      if(stateName == "new"){

                        var box = k.GetBoxs({fieldName:"front"})[0];
                        var content = box.Blocks_Get()[0];

                        front = new EditableImage({
                          parent:content,
                          imageUrl:"../imagenes/vehiculo_4ruedas.png",
                        });

                      }

                    }
                  }]
                },
                {
                  name:"insertBefore",
                  actions:[{
                    action:({k,inserts})=>{

                      inserts.push({
                        field:"IMG_FRONT",
                        value:front.ImageGet(),
                        tipe:"values",
                      });

                      return {inserts};
                    }
                  }]
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k,result})=>{

                      var box = k.GetBoxs({fieldName:"front"})[0];
                      var content = box.Blocks_Get()[0];
                      var img = result[0]["IMG_FRONT"];
                      //console.log("load imgage:",img);

                      front = new EditableImage({
                        parent:content,
                        imageUrl:"../imagenes/vehiculo_4ruedas.png",
                      });

                      if(img!=null) front.loadImage(img);
                    }
                  }]
                },
                {
                  name:"updateBefore",
                  actions:[{
                    action:({k,conditions=[],sets=[]})=>{

                      if(conditions.length==0){

                        conditions.push({
                          table:"checkin_vehicles",
                          field:"ID_CHECKIN_VEHICLE",
                          inter:"=",
                          value:k.Reload_GetData_Primarys({})[0],
                        });
                      }

                      if(front){

                        sets.push({
                          field:"IMG_FRONT",
                          value:front.ImageGet(),
                        });
                      }

                      return {conditions, sets};
                    }
                  }],
                },
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md_checkin_fm.SetActive({active});
                    }
                  }]
                },
                {
                  name:"toolPdfUpdate",
                  actions:[{
                    action:()=>{

                      SavePdf();
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
              afterInsert:"block",
              stateTools:[
                {
                  name:"reload",
                  tools:[
                      {name:"config",show:false},
                      {name:"load",show:false},
                      
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
          {
            tipe:"tb-fm",
            master:"checkin-tb",
            masterField:"ID_CHECKIN_VEHICLE",
            maid:"checkin-fm",
            maidField:"ID_CHECKIN_VEHICLE",
          },
          {
            tipe:"fm-fm",
            master:"checkin-fm",
            masterActionEdit:"veh-edit",
            masterActionAdd:"veh-add",
            masterField:"vehiculo",
            maid:"vehicle-fm",
            maidField:"ID_VEHICLE",
          },
          {
            tipe:"fm-fm",
            master:"checkin-fm",
            masterActionEdit:"cus-edit",
            masterActionAdd:"cus-add",
            masterField:"cliente",
            maid:"customer",
            maidField:"ID_CUSTOMER",
          },
        ],
      });

      function SavePdf() {
        
        var cr_checkin = cruds.Crud_GetBuild({name:"checkin-fm"});
        var data = cr_checkin.Reload_GetData({})[0];

        var checkInData = {
          logo:userData.company.logo,
          checkInNumber: data["ID_CHECKIN_VEHICLE"],
          checkInDate: data["DATE_ENTER"],
          checkOutDate: data["DATE_OUT"],
          customerName: data["CUSTOMER_NAME"],
          customerId:(data["CUSTOMER_COMPANY"]=="1"?"RUC":"DNI") + " " + data["CUSTOMER_NRO"],
          customerPhone: data["CUSTOMER_CEL"],
          customerAddress: data["CUSTOMER_DIR"],
          companyName: userData.company.nameReal,
          companyRUC: userData.company.ruc,
          companyAddress: userData.company.email,
          companyPhone: userData.company.telf,
          receptor:{
            name:data["WORKER_NAME"],
            cel:data["WORKER_CEL"],
          },
          vehicle: {
              fuel: data["FUEL"],
              mileage: data["MILEAGE"],
              mileage_prox: data["MILEAGE_PROX"],
              plate: data["PLACA"],
              brand: data["MARCA"],
              model: data["MODELO"],
              engineNumber: data["NRO_MOTO"],
              vinNumber: data["NRO_VIN"],
              year: data["ANIO"],
              color: data["COLOR"],
          },
          comments: data["COMENT"],
          observations: data["OBSERVATIONS"],
          items: [
              { detail: 'Oil level', check: true, comment: 'Good condition' },
              { detail: 'Brake fluid', check: false, comment: 'Needs replacement' },
              { detail: 'Tire pressure', check: true, comment: 'Checked' },
              // More items...
          ],
          imageUrl: front.ImageGet() // Ruta de la imagen
        };

        checkInData.items = [];
        for (let num = 1; num <= 26; num++) {
          //console.log("num",num);
          checkInData.items.push({
            detail:cr_checkin.Field_Get({fieldName:"check in "+num}).box.name,
            check:data["CHECK_"+num]=="1",
          });
          
        }
        
        generateCheckInPDF(checkInData);
      }

    }
  });
  

});
