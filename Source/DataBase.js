

const metodo_options = [
    {value:'Efectivo',show:'Efectivo'},
    {value:'BCP',show:'BCP'},
    {value:'Interbank',show:'Interbank'},
    {value:'BBVA',show:'BBVA'},
];

const documentos_options = [
    {value:'nota de pago',show:'nota de pago'},
    {value:'boleta',show:'boleta'},
    {value:'factura',show:'factura'},
];


const adm_usuarios = {
    title:'usuarios',
    tables:['usuarios','usuarios_clases'],
    states:[{name:'reload',tools:[{name:'new',show:true}]}],
    loads:[
        {
            table_main:1,
            selects:[
                {table:1,field:0,as:'value'},
                {table:1,field:1,as:'show'},
            ],
        }
    ],
    fields:[
        //{delete:true},
        {name:'usuario',box:{tipe:1},conection:{table:0,field:1}},
        {name:'contraseña',box:{tipe:1},conection:{table:0,field:2}},
        {name:'clase',box:{tipe:3},conection:{table:0,field:3},load:0},
        {name:'activo',box:{tipe:6,name:'activo'},conection:{table:0,field:4}},
    ],
}

const adm_clases = {
    title:'roles',
    tables:['usuarios_clases'],
    states:[{name:'reload',tools:[{name:'new',show:true}]}],
    fields:[
        {delete:true},
        {name:'clase',box:{tipe:1},conection:{table:0,field:1}},
    ],
}

const adm_seccions = {
    title:'secciones',
    tables:['nav_seccions'],
    orders:[{table:0,field:2,asc:true}],
    fields:[
        {delete:true},
        {name:'seccion',box:{tipe:1},conection:{table:0,field:1}},
        {name:'order',box:{tipe:1},conection:{table:0,field:2}},
    ],
}

const adm_paginas = {
    title:'paginas',
    tables:['paginas','nav_seccions'],
    states:[{name:'reload',tools:[{name:'new',show:true}]}],
    loads:[
        {
            table_main:1,
            selects:[
                {table:1,field:0,as:'value'},
                {table:1,field:1,as:'show'},
            ],
        }
    ],
    orders:[
        {table:1,field:2,asc:true},
        {table:0,field:4,asc:true},
    ],
    joins:[
        {main:{table:0,field:3},join:{table:1,field:0}},
    ],
    filters:[
        {name:'seccion', box:{tipe:1,class:'w-100 mx-3'},load:0,conection:{table:1,field:1,inter:'LIKE'}},
    ],
    fields:[
        {delete:true},
        {name:'titulo',box:{tipe:1},conection:{table:0,field:1}},
        {name:'url',box:{tipe:1},conection:{table:0,field:2}},
        {name:'seccion',box:{tipe:3},conection:{table:0,field:3},load:0},
        {name:'orden',box:{tipe:1},conection:{table:0,field:4}},
    ],
}

const adm_control = {

    title:'control de accesos',
    tables:['clase_paginas','usuarios_clases'],
    states:[{name:'reload',tools:[{name:'new',show:true},{name:'sizes',value:999}]}],
    loads:[{table:1}],
    joins:[
        {main:{table:0,field:1},join:{table:1,field:0}},//control->clase
    ],
    orders:[
        {table:1,field:1},
    ],
    filters:[
        {name:'rol',conection:{table:0,field:1,inter:'='},load:0,box:{tipe:3,default:1}},
        {name:'seccion',box:{tipe:3,options:secciones}},
    ],
    fields:[
        {delete:true},
        {name:'rol',box:{tipe:3},conection:{table:0,field:1},load:0},
        {name:'pagina',box:{tipe:8,options:paginas},conection:{table:0,field:2},},
        {name:'seccion'},
        {name:'activo',box:{tipe:6,name:'activo'},conection:{table:0,field:4}},
        {name:'predeterminado',box:{tipe:6,name:'seleccionar'},conection:{table:0,field:3}},
    ],
    events:[{name:'reload_after',description:'filter data by seccion',action:({data, k})=>{

        if(data!=null&&k!=null){

            console.log("------data-------",data, k);
            const f_secc = k._form.Filter_GetCol_Data({x:0,y:1}).labels[0].GetBox().GetValue();

            var dnw = [];
            data.forEach(d => {
                
                var pag_id = d['0_2'];
                var pag = paginas.find(pg=>pg.value == pag_id);
                if(pag){

                    d['seccion_id'] = pag.seccion;
                    var secc = secciones.find(sc=>sc.value==pag.seccion);
                    d['seccion'] = secc.show;
                }

                var secc_on = d['seccion_id'] == f_secc;
                if(secc_on) dnw.push(d);
                
            });
            console.log("---------",dnw);

            return {stop:false,data:dnw};
        }
        
    }}],

}

function AdmControlPanel({parent=null,screenload=null}={}) {
    
    if(screenload==null) screenload = new ScreenLoad({parent:parent,state:false});

    const panel = new Grid({
        parent:parent,
        cols:[[12],[12]],
        boxs:[
            {x:0,y:0,box:{tipe:5,value:'update pages of users'+icons.load,class:'btn btn-primary',update:()=>{UpdateUsers()}}},
        ],
    });

    const db = new dataBase();
    db.SetTables({tables:['usuarios_clases','clase_paginas']});

    function UpdateUsers({}={}) {
        
        //1.delete all
        //2.load users
        //3.inserts 

        console.log("-----update users-----");
        if(screenload!=null)screenload.SetState({state:true});
        db.Delete_Sql({
            table_main:1,
            success:()=>{
                
                db.Select_Sql({
                    table_main:0,
                    selects:[
                        {table:0,field:0,as:'id'},
                        {table:0,field:1,as:'name'},
                    ],
                    success:(roles)=>{

                        if(roles){

                            var count = 0;
                            const mx = roles.length * paginas.length;

                            roles.forEach(rol => {
                                
                                paginas.forEach(pg => {
                                    
                                    db.Insert_Sql({
                                        table_main:1,
                                        inserts:[
                                            {table:1,field:1,value:rol.id},
                                            {table:1,field:2,value:pg.value},
                                            {table:1,field:3,value:0},
                                            {table:1,field:4,value:1},
                                        ],
                                        success:()=>{
    
                                            OneLoaded();
                                        }
                                    });
                                });
                            });

                            function OneLoaded() {
                                
                                count++;
                                if(count>=mx){

                                    if(screenload!=null)screenload.SetState({state:false});

                                }
                            }
                        }

                    }
                });
                
            }
        });
    }

    new Form_Table({
        parent:panel.GetColData({x:0,y:1}).col,
        ...adm_control,
    });
}


function TransControlPanel({parent=null,title='transferencias',page,cuentas=[],url='Cont_Add.php'}={}) {
        
    const admin = cuentas.length == 0;
    const date_min = admin ? Date_FirstOfMoth() : Date_Today();
    const date_max = admin ? Date_LastOfMoth() : date_min;
    const account_filter = admin ? {name:'cuenta',box:{tipe:4},load:0,conection:{table:0,field:4}} : {name:'cuenta',box:{tipe:0}};


    function Condition_Data({table=0}) {
      if(admin) return null;

      var cnds = [];
      cuentas.forEach(cnt => {

        cnds.push({and:false,table:table,field:1,inter:'LIKE',value:cnt});
      });

      return [{
        and:false,
        conditions:cnds
      }];
    }

    function Condition_Account({table=0}) {

      var cnds = [];

      accounts = admin ? tb._form.Filter_GetCol_Data({x:0,y:2}).labels[0].GetBox().GetValue() : cuentas;
      accounts.forEach(cnt => {

        cnds.push({and:false,table:table,field:(admin?0:1),inter:(admin?'=':'LIKE'),value:cnt});
      });  

      return [{
        and:false,
        conditions:cnds
      }];
    }

    const conteiner = new Grid({
      parent:parent,
      cols:[[6,6],[12],[12]],
      labels:[
        //{x:0,y:0,tipe:2,name:'ingresos',box:{...Box_Soles({clss:'h1 text-success'})}},
        //{x:1,y:0,tipe:2,name:'egresos',box:{...Box_Soles({clss:'h1 text-danger'})}},
        {x:0,y:1,tipe:2,name:'total',box:{...Box_Soles({clss:'h1'})}},
      ],
    });

    const tb = new Form_Table({
      parent: conteiner.GetColData({x:0,y:2}).col,
      title:title,
      h_min:500,
      states:[{name:'reload',tools:[
        {name:'filter',show:true},
        {name:'new',show:true},
        {name:'sizes',value:999,show:false},
        {name:'new',show:true},
        {name:'page_back',show:false},
        {name:'pages',show:false},
        {name:'page_next',show:false},
      ]}],
      tables:['transactions','accounts','transactions_tags'],
      loads:[
        {table:1},
        {
          table_main:2,
          selects:[
            {table:2,field:0,as:'value'},
            {table:2,field:1,as:'show'},
            {table:2,field:2,as:'ingreso'},
          ],
        },
      ],
      selects:[
        {table:0,field:0,as:'primary'},
        {table:0,field:1,as:'fecha'},
        {table:0,field:2,as:'total'},
        {table:1,field:1,as:'cuenta'},
        {table:2,field:1,as:'etiqueta'},
        {table:0,field:6,as:'ingreso'},
        {table:0,field:5,as:'descripcion'},
      ],
      joins:[
        {main:{table:0,field:3},join:{table:2,field:0}},
        {main:{table:0,field:4},join:{table:1,field:0}},
      ],
      conditions:Condition_Data({table:1}),
      orders:[{table:0,field:1,asc:false}],
      filters:[
        {name:'fecha min',box:{tipe:2,default:date_min},conection:{table:0,field:1,inter:'>='}},
        {name:'fecha max',box:{tipe:2,default:date_max},conection:{table:0,field:1,inter:'<='}},
        account_filter,
        {name:'etiquetas',box:{tipe:4},load:1,conection:{table:0,field:3}},
        {name:'ingreso',box:Box_MutipleDual({show:'ingresos',show2:'egresos'}),conection:{table:0,field:6}},
      ],
      fields:[
        {name:'descripcion', update:true},
        {name:'cuenta'},
        {name:'total',box:Box_Soles()},
      ],
      events:[
        {name:'reload_after',description:'calculate data',action:({k,data})=>{

          var ingresos = 0;
          var egresos = 0;
          var dt = []; 
          if(data){
            data.forEach(d => {
            
              var fecha = d['fecha'];
              var total = parseFloat(d['total']);
              var ingreso = d['ingreso'] == '1';
              total = (ingreso?1:-1) * total;

              var trnnw = {
                etiqueta:d['etiqueta'],
                cuenta:d['cuenta'],
                total:total,
                primary:d['primary'],
                descripcion:d['descripcion'],
                ingreso:ingreso,
              };

              var found = dt.find(dti=>dti.fecha == fecha);
              if(found == null) dt.push({fecha:fecha,total:total,trns:[trnnw]});
              else{

                found.trns.push(trnnw); 
                found.total+= total;
              }

              if(ingreso) ingresos+= total;
              else egresos += total;

            });    
          }

          var lines = [];
          dt.forEach(dti => {
            
            lines.push({
              descripcion: '<b>' + dti.fecha + '</b>',
              total:dti.total
            });
            dti.trns.forEach(trni => {
              
              lines.push({
                descripcion: '[' + trni.etiqueta + '] ' + trni.descripcion,
                cuenta:trni.cuenta,
                total:trni.total,
                ingreso:trni.ingreso,
                primary:trni.primary,
              });
            });
          });

          console.log("--------", dt, data, lines, ingresos, egresos);
          PrintTotal({
            ingresos:ingresos,
            egresos:egresos,
            cuentas:[],
          });


          return {data:lines,stop:false};
        }},
        {name:'print_after',description:'set color to total',action:({k,data})=>{

          console.log("----------print after---",data);

          const bxs = k._fields.find(f=>f.name=='total').boxs;
          for (let b = 0; b < bxs.length; b++) {

            const bx = bxs[b];
            const ingreso = data[b].ingreso;
            if(ingreso!=null){

              if(ingreso) bx.SetClass({clss:'text-success'});
              else bx.SetClass({clss:'text-danger'});
            }
            
          }

        }},
        {name:'box_update',description:'send edit',action:({k,y,field,data})=>{

          console.log(y,data);
          if(data!=null && data.primary!=null){

            page.PageSend({url:url,send:{name:'search',value:data.primary,account:(admin?null:cuentas[0])}});
          }
        }},
        {name:'new_before',descripcion:'send to add', action:()=>{

          page.PageSend({url:url,send:(admin?null:{account:cuentas[0]})});
          return {stop:true};
        }}
      ],
    });

    function GetAccountTotal({success=null}) {

      db = new dataBase();
      db.SetTables({tables:['accounts']});

      db.Select_Sql({
        table_main:0,
        log_sql:true,
        log_resp:true,
        selects:[
          {table:0,field:2,as:'total'},
        ],
        conditions:Condition_Account({table:0}),
        success:(resp)=>{

          if(resp){

            var total = 0;
            resp.forEach(ri => {
              
              total += parseFloat(ri['total']);
            });
            
            console.log("total:" + total);
          }

          if(success!=null)success({total:total});
        }
      });

    }

    function PrintTotal({ingresos=0,egresos=0}) {
      
      GetAccountTotal({success:({total})=>{

        //conteiner.GetColData({x:0,y:0}).labels[0].GetBox().SetValue(ingresos);
        //conteiner.GetColData({x:1,y:0}).labels[0].GetBox().SetValue(egresos);
        conteiner.GetColData({x:0,y:1}).labels[0].GetBox().SetValue(total);
      }});

    }
    

}

function TransAddPanel({parent=null,title='ingreso',recive=null,page=null,cuentas=null}) {
  
  const account = recive !=null && recive.account !=null ? recive.account : cuentas;
  const field_account_bx = account ? {tipe:0} : {tipe:3,class:'w-100'};

  const md = new Form_Modulos({
    parent:parent,
    title:title,
    tables:['transactions','accounts','transactions_tags'],
    state_base:'search',
    state_start:'add',
    add_after_reloadstate:false,
    page:page,
    recive:recive,
    loads:[{table:1},{
      table_main:2,
      selects:[
        {table:2,field:0,as:'value'},
        {table:2,field:1,as:'show'},
        {table:2,field:2,as:'ingreso'},
      ],
    }],
    modulos:{
      cols:[[12],[12]],
      windows:[
        {
          x:0,y:0,
          title:'informacion general',
          cols:[[12],[12],[12],[12],[12],[12],],
          fields:[
            {x:0,y:0,name:'fecha de emision',box:{tipe:2,default:Date_Today()},field:1},
            {x:0,y:1,name:'ingreso',box:{tipe:6},field:6},
            {x:0,y:2,name:'total',box:{tipe:1,class:'w-100'},field:2},
            {x:0,y:3,name:'cuenta',box:field_account_bx,load:0,field:4},
            {x:0,y:4,name:'etiqueta',box:{tipe:3,class:'w-100'},load:1,field:3},
            {x:0,y:5,tipe:2,name:'descripcion',box:{tipe:1,class:'w-100'},field:5},
          ],
        },
      ],
    },
    events:[
      {name:'box_update',description:'filter tags by',action:({k,field})=>{

        if(field.name == 'ingreso'){

          FilterTags({k:k});
        }
      }},
      {name:'loaded',description:'filter tags by',action:({k,field})=>{

        FilterTags({k:k});
      }},
      {name:'add_after',description:'set account value',action:({k})=>{

        console.log(k);
        SetAccount({k:md});
      }},
      {name:'form_add_before',descripcion:'confirm that tag is selected',action:({k})=>{

        
        var tag = md._fields.find(f=>f.name=='etiqueta').boxs[0].GetValue();
        var tag_error = tag == null || tag == '';
        if(tag_error) alert('error: seleccione un etiqueta');

        return{stop:tag_error};
      }},
    ],
  });

  function FilterTags({k}) {
    
    const bx = k._fields.find(f=>f.name=='etiqueta').boxs[0];

    var ops = [];
    const tags = k._data.Load_GetData({load_index:1});
    tags.forEach(tg => {
      
      if(tg.ingreso == k._fields.find(f=>f.name=='ingreso').boxs[0].GetValue()) ops.push(tg);
    });

    bx.SetOptions(ops);
  }

  function SetAccount({k}) {
     
    if(account){

      const bx = k._fields.find(f=>f.name=='cuenta').boxs[0];
      const opv = bx.GetOptions().find(op=>op.show==account);
      console.log(account,bx, bx.GetOptions(), opv);
      bx.SetValue(opv.value);
      console.log("cuenta field -> value:" + bx.GetValue());
    }
  }

}