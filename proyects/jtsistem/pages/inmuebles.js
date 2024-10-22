
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var fm = new Form({
        parent:pageData.body,
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
                {table:"inmuebles",field:"PRICE_SALE"},
                {table:"inmuebles",field:"PRICE_RENT"},
                {table:"inmuebles",field:"URL_DOCUMENTS"},
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
              loads:[
                {...ld_zones},
              ],
              
              filters:[
                {name:"estado",box:{tipe:4,class:"w-100",options:op_inmuble_state,value:["en venta","en alquiler","en venta o alquiler"]},select:{table:"inmuebles",field:"ID_INMUEBLE_STATE"}},
                {name:"zona",box:{tipe:4,class:"w-100"},select:{table:"inmuebles",field:"ID_ZONE"},load:{name:"ld-zones",show:"show",value:"value"}},
              ],
              fields:[
                //{panel:"main",...fld_delete},
                {panel:"main",...fld_edit},
                {panel:"main",name:"estado",select:"ID_INMUEBLE_STATE",box:{tipe:0,options:op_inmuble_state}},
                {panel:"main",name:"propietario",select:"CUSTOMER_NAME",box:{tipe:0}},
                {panel:"main",name:"zona",select:"ZONE_NAME",box:{tipe:0,class:"w-100"}},
                //{panel:"main",name:"valorizacion",select:"COST",box:bx_money},
                {panel:"main",name:"precio de venta",select:"PRICE_SALE",box:bx_money},
                {panel:"main",name:"precio de renta",select:"PRICE_RENT",box:bx_money},
                {panel:"main",name:"area",select:"AREA",box:bx_area_show},
                {panel:"main",name:"precio por m2",select:"PRICE_UNIT",box:bx_money},
                {panel:"main",name:"url documentos",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-folder-symlink"></i>'},action:"url"},
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

                      var data = k. Reload_GetData();
                      var boxs = k.GetBoxs({fieldName:"url documentos"});
                      for (let y = 0; y < data.length; y++) {

                        var url = data[y]["URL_DOCUMENTS"];
                        var box = boxs[y];

                        var block = box.Blocks_Get()[0];
                        block.setAttribute("class","btn btn-outline-"+(url?"primary":"danger")+" btn-sm");
                        block.disabled = url == null;

                      }
                    }
                  }]
                },
                {
                  name:"boxUpdate",
                  actions:[{
                    action:({k,y,field})=>{

                      if(field.action=="url"){

                        var data = k. Reload_GetData();
                        var url = data[y]["URL_DOCUMENTS"];
                        var win = window.open(url, '_blank');
                      }
                      // Cambiar el foco al nuevo tab (punto opcional)
                      //win.focus();
                    }
                  }],
                }
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
              ...scr_inmueble({
                parent:prnt_inmueble_fm,
                modal:md_inmueble_fm,
              })
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
