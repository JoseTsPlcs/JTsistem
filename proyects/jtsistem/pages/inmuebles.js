
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var fm = new Form({
        title:"",head:false,
        fields:[
          {col:12,name:"precio promedio de m2",tipe:2,box:bx_moneyh1},
          {col:12,name:"inmuebles-tb",box:{tipe:0,class:"w-100 m-0 p-0"},tipe:0},
          {col:12,name:"inmuebles-fm",box:{tipe:0},tipe:0},
          {col:12,name:"zonas",box:{tipe:0},tipe:0},
          {col:12,name:"customers",box:{tipe:0},tipe:0},
        ],
        tools:[
          //{position:"head-left",name:"customer-add",box:{tipe:5,value:"añadir cliente",class:"btn btn-outline-primary btn-sm"}},
        ],
      })
      
      var prnt_inmueble_tb = fm.Field_GetBox({fieldName:"inmuebles-tb"}).Blocks_Get()[0];

      var md_inmueble_fm = new Modal({
        parent:fm.Field_GetBox({fieldName:"inmuebles-fm"}).Blocks_Get()[0],
        size:"lg",
      });
      var md_zones_fm = new Modal({
        parent:fm.Field_GetBox({fieldName:"zonas"}).Blocks_Get()[0],
        //size:"lg",
      });
      var md_customers_fm = new Modal({
        parent:fm.Field_GetBox({fieldName:"customers"}).Blocks_Get()[0],
        //size:"lg",
      });
      var prnt_inmueble_fm = md_inmueble_fm.GetContent();
      var prnt_zones = md_zones_fm.GetContent();
      var prnt_customer = md_customers_fm.GetContent();

      ld_customers.conditions[0].value = userData.company.id;
      ld_zones.conditions[0].value = userData.company.id;

      new ConsCruds({
        cruds:[
          {
            name:"inmuebles-tb",
            active:true,
            script:{
              parent:prnt_inmueble_tb,
              title:"lista de inmuebles",
              panels:[{col:12,y:0,title:"main",head:false,tipe:"table",h:600}],
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

              tableMain:"inmuebles",
              selects:[
                {table:"inmuebles",field:"ID_INMUEBLE",primary:true},
                {table:"customers",field:"NAME",as:"CUSTOMER_NAME"},
                {table:"inmuebles",field:"ID_INMUEBLE_STATE"},
                {table:"zones",field:"NAME",as:"ZONE_NAME"},
                {table:"inmuebles",field:"AREA"},
                {table:"inmuebles",field:"COST"},
              ],
              joins:[
                {
                  main:{table:"inmuebles",field:"ID_ZONE"},
                  join:{table:"zones",field:"ID_ZONE"},
                  tipe:"LEFT",
                },
                {
                  main:{table:"inmuebles",field:"ID_CUSTOMER_OWNER"},
                  join:{table:"customers",field:"ID_CUSTOMER"},
                  tipe:"LEFT",
                },
              ],
              conditions:[
                {
                  table:"inmuebles",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],
              inserts:[ins_general],
              
              filters:[
                {name:"estado",box:{tipe:4,class:"w-100",options:op_inmuble_state},select:{table:"inmuebles",field:"ID_INMUEBLE_STATE"}},
                {name:"zona",box:{tipe:4,class:"w-100"},select:{table:"inmuebles",field:"ID_ZONE"},load:{name:"ld-zones",show:"show",value:"value"}},
              ],
              fields:[
                {panel:"main",...fld_edit},
                {panel:"main",name:"estado",select:"ID_INMUEBLE_STATE",box:{tipe:0,options:op_inmuble_state}},
                {panel:"main",name:"propietario",select:"CUSTOMER_NAME",box:{tipe:0}},
                {panel:"main",name:"zona",select:"ZONE_NAME",box:{tipe:0,class:"w-100"}},
                {panel:"main",name:"valorizacion",select:"COST",box:bx_money},
                {panel:"main",name:"area",select:"AREA",box:bx_area_show},
                {panel:"main",name:"precio por m2",select:"PRICE_UNIT",box:bx_money},
              ],
              events:[
                {
                  name:"printBefore",
                  actions:[{
                    action:({result})=>{

                      result.forEach(d => {
                        
                        var area = parseFloat(d["AREA"]);
                        var cost = parseFloat(d["COST"]);
                        var price = cost/area;
                        d["PRICE_UNIT"] = price;
                      });

                      return {data:result};
                    }
                  }]
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{

                      var price_prom = 0;
                      var prices = k.GetValues({fieldName:"precio por m2"});
                      var price_total = prices.reduce((acc,v)=>{return acc + parseFloat(v)},0);
                      price_prom = price_total/prices.length;

                      fm.Field_GetBox({fieldName:"precio promedio de m2"}).SetValue(price_prom);
                    }
                  }]
                },
              ],
            }
          },
          {
            name:"zonas",
            active:true,
            script:{
              parent:prnt_zones,
              title:"zonas",
              panels:[
                {col:12,title:"main",tipe:"table",tag:"zonas",head:false,h:100},
              ],
              stateTools:stTls_fm_maid,
              stateStart:"block",
              afterCancel:"block",
              afterInsert:"block",
              afterUpdate:"block",

              tableMain:"zones",
              selects:[
                {table:"zones",field:"ID_ZONE",primary:true},
                {table:"zones",field:"NAME"},
              ],
              conditions:[
                {
                  table:"zones",
                  field:"ID_COMPANY",
                  inter:"=",
                  value:company_id,
                }
              ],
              inserts:[...ins_general],

              fields:[
                {panel:"main",name:"zona",box:{tipe:1,class:"w-100"},select:"NAME"},
              ],
              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md_zones_fm.SetActive({active});
                    }
                  }]
                }
              ],

            }
          },
          {
            name:"inmueble-fm",
            active:true,
            script:{
              parent:prnt_inmueble_fm,
              title:"inmueble",
              panels:[
                {col:12,y:0,title:"main",tag:"Informacion",head:true,tipe:"form"},
                {col:12,y:0,title:"ubi",tag:"Ubicacion",head:true,tipe:"form"},
                {col:12,y:0,title:"desc",tag:"Descripcion",head:true,tipe:"form"},
              ],
              stateTools:stTls_fm_maid,
              stateStart:"block",
              afterCancel:"block",
              afterInsert:"block",
              loads:[
                {...ld_customers},
                {...ld_zones},
              ],

              tableMain:"inmuebles",
              selects:[
                {table:"inmuebles",field:"ID_INMUEBLE",primary:true},
                {table:"inmuebles",field:"ID_CUSTOMER_OWNER"},
                {table:"inmuebles",field:"ID_INMUEBLE_STATE"},
                {table:"inmuebles",field:"ID_ZONE"},
                {table:"inmuebles",field:"DIRECCION"},
                {table:"inmuebles",field:"AREA"},
                {table:"inmuebles",field:"FRONT_MEASURE"},
                {table:"inmuebles",field:"COST"},
                {table:"inmuebles",field:"DESCRIPCION"},
                {table:"inmuebles",field:"ID_COMPANY"},
                {table:"inmuebles",field:"TELF_CONTACT"},
                {table:"inmuebles",field:"URL_GPS"},
                {table:"inmuebles",field:"URL_PHOTOS"},
              ],
              inserts:[...ins_general],
              
              fields:[
                {panel:"main",name:"propietario",col:10,colAllLevel:true,select:"ID_CUSTOMER_OWNER",box:{tipe:8,class:"w-100"},load:{name:"ld-customers",show:"show",value:"value"}},
                {panel:"main",name:"customer-edit",tipe:0,colAllLevel:true,col:1,...fld_edit,action:"customer-edit"},
                {panel:"main",name:"customer-add",tipe:0,colAllLevel:true,col:1,...fld_add,action:"customer-add"},

                {panel:"main",name:"estado",select:"ID_INMUEBLE_STATE",box:{tipe:3,value:1,options:op_inmuble_state}},
                {panel:"main",name:"telf de contacto",select:"TELF_CONTACT",box:{tipe:1,value:""}},

                {panel:"ubi",name:"zona",colAllLevel:true,col:10,select:"ID_ZONE",box:{tipe:8,class:"w-100"},load:{name:"ld-zones",show:"show",value:"value"}},
                {panel:"ubi",name:"zone-edit",tipe:0,colAllLevel:true,col:1,...fld_edit,action:"zone-edit"},
                {panel:"ubi",name:"zone-add",tipe:0,colAllLevel:true,col:1,...fld_add,action:"zone-add"},
                {panel:"ubi",name:"direccion",select:"DIRECCION",box:{tipe:1,value:"",class:"w-100"}},
                {panel:"ubi",name:"gps",select:"URL_GPS",box:{tipe:1,value:"",class:"w-100"}},

                {panel:"desc",name:"url de fotos",select:"URL_PHOTOS",box:{tipe:1,value:"",class:"w-100"}},
                {panel:"desc",name:"area",select:"AREA",box:{tipe:1,value:0,class:"w-100"}},
                {panel:"desc",name:"medida del frontis",select:"FRONT_MEASURE",box:{tipe:1,value:0,class:"w-100"}},
                {panel:"desc",name:"valoracion",select:"COST",box:{tipe:1,value:0,class:"w-100"}},
                {panel:"desc",name:"descripcion",select:"DESCRIPCION",tipe:2,box:{tipe:9,value:"",class:"w-100"}},
              ],

              events:[
                {
                  name:"modalSetActive",
                  actions:[{
                    action:({active})=>{

                      md_inmueble_fm.SetActive({active});
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
              ...scr_customer({
                parent:prnt_customer,
                modal:md_customers_fm,
              })
            }
          }
        ],

        conections:[
          {
            tipe:"tb-fm",
            master:"inmuebles-tb",
            masterField:"ID_INMUEBLE",
            maid:"inmueble-fm",
            maidField:"ID_INMUEBLE",
          },
          {
            tipe:"fm-fm",
            master:"inmueble-fm",
            masterActionEdit:"zone-edit",
            masterActionAdd:"zone-add",
            masterField:"zona",
            maid:"zonas",
            maidField:"ID_ZONE",
          },
          {
            tipe:"fm-fm",
            master:"inmueble-fm",
            masterActionEdit:"customer-edit",
            masterActionAdd:"customer-add",
            masterField:"propietario",
            maid:"customer",
            maidField:"ID_CUSTOMER",
          }
        ],

      })

    }
  });
  

});
