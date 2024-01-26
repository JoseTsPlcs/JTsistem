

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

const info_options = [
  {value:'100g',show:'100g'},
  {value:'250g',show:'250g'},
  {value:'500g',show:'500g'},
  {value:'1kg',show:'1kg'},
  {value:'1kg>',show:'1kg>'},
  {value:'5kg>',show:'5kg>'},
]


//-------adm------

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

//---------sales----------

const sales_control = {
  title:"ventas",
  tables:["ventas"],
  fields:[
    {name:"nro",sql:{field:0}},
    {name:"confirmado",sql:{field:1}},
    {name:"fecha",sql:{field:2}},
    {name:"nombre",sql:{field:3}},
    {name:"total",sql:{field:4}},
    {name:"metodo",sql:{field:5}},
    {name:"delivery",sql:{field:6}},
    {name:"trabajador",sql:{field:7}},
    {name:"cancelado",sql:{field:8}},
    {name:"cajero",sql:{field:9}},
    {name:"armado",sql:{field:10}},
    {name:"entregado",sql:{field:11}},
    {name:"recoge",sql:{field:12}},
    {name:"comentario",sql:{field:13}},
    {name:"documento",sql:{field:14}},
    {name:"emitido sunat",sql:{field:15}},
    {name:"anulado",sql:{field:16}},
    {name:"delivery gratis",sql:{field:17}},
    {name:"descuento",sql:{field:18}},
  ],
}

//---------clientes-------

const customer_control = {
    title:'clientes',
    tables:['clientes','zonas','customers_types'],
    loads:[{
        table_main:2,
        selects:[
            {table:2,field:0,as:'value'},
            {table:2,field:1,as:'show'},
        ],
    }],
    joins:[
      {main:{table:0,field:6},join:{table:1,field:0}},
    ],
    /*filters:[
      {name:'nombre',conection:{table:0,field:3,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
      {name:'tipo',conection:{table:0,field:13},box:{tipe:4},load:0},
      {name:'dni',conection:{table:0,field:4,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
      {name:'celular',conection:{table:0,field:8,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
      {name:'despacho',conection:{table:0,field:11},box:Box_MutipleDual({show:'recoge',show2:'delivery'})},
      {name:'zona',conection:{table:1,field:1,inter:'LIKE'},box:{tipe:1,class:'w-100'}},
      {name:'activo',conection:{table:0,field:2},box:Box_MutipleDual({show:'activo'})},
    ],*/
    fields:[
      {delete:true},
      {edit:true},
      {name:'nombre',sql:{table:0,field:3},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:250px'}]},
      {name:'tipo',box:{tipe:3},load:0,sql:{table:0,field:13}},
      {name:'dni',sql:{table:0,field:4},box:{tipe:1}},
      {name:'celular',sql:{table:0,field:8},box:{tipe:1}},
      {name:'despacho',sql:{table:0,field:11},box:{tipe:0,options:Options_Dual({show:'recoge',show2:'delivery'})}},
      {name:'zona',sql:{table:1,field:1},attributes:[{name:'style',value:'min-width:250px'}]},
      {name:'activo',sql:{table:0,field:2},box:{tipe:6,name:'activo'}},
    ],
}

const customers_add = {
    title:'cliente',
    tables:['clientes','zonas','customers_types'],
    joins:[
      {main:{table:0,field:6},join:{table:1,field:0}},
      {main:{table:0,field:13},join:{table:2,field:0}},
    ],
    loads:[
      {
        table_main:1,
        selects:[
          {table:1,field:0,as:'value'},
          {table:1,field:1,as:'show'},
        ],
      },
      {
        table_main:2,
        selects:[
          {table:2,field:0,as:'value'},
          {table:2,field:1,as:'show'},
        ],
      },
    ],
    windows:[
        {
          title:'informacion personal',
          labels:[
            {x:0,y:0,name:'nombre',box:{tipe:1,class:'w-100'},sql:{field:3}},
            {col:6,tipe:2,name:'dni/ruc',box:{tipe:1,class:'w-100 mx-2'},sql:{field:4}},
            {col:6,tipe:2,name:'celular',box:{tipe:1,class:'w-100 mx-2'},sql:{field:8}},
            {col:4,name:'tipo',box:{tipe:3,class:'w-100'},sql:{field:13},load:1},
            {col:4,tipe:2,name:'documento',box:{tipe:3,options:documentos_options,class:'w-100'},sql:{field:12}},
            {col:4,tipe:2,name:'metodo',box:{tipe:3,options:metodo_options,class:'w-100'},sql:{field:10}},
          ],
        },
        {
          title:'ubicacion',
          labels:[
            {col:4,tipe:1,name:'recoge',box:{tipe:6,name:'recoge',class:'w-100'},sql:{field:11}},
            {name:'zona',box:{tipe:8},load:0,sql:{field:6}},
            {name:'direccion',box:{tipe:1},sql:{field:5}},
            {name:'referencia',box:{tipe:1},sql:{field:7}},
          ],
        },
    ],
}


//----------buys----------

const provider_add = {

    title:'proveedor',
    tables:['providers'],
    windows:[
        {
            title:"informacion",
            fields:[  
                {name:'activo',sql:{field:4},box:{tipe:6}},
                {name:'empresa',sql:{field:1},box:{tipe:1,class:'w-100'},attributes:[{name:'style',value:'min-width:250px'}]},
                {name:'ruc',sql:{field:2},box:{tipe:1,class:'w-100'}},
                {name:'celular',sql:{field:3},box:{tipe:1,class:'w-100'}},
            ],
        }
    ],

}

const transaccion_list = {
    title:"pagos",
    tables:['ventas_transacctions'],
    fields:[
      {delete:true},
      {edit:true,name:"edit"},
      {name:'id',sql:{field:0},box:{tipe:0}},
      {name:'venta id',sql:{field:1},box:{tipe:1}},
      {name:'pago id',sql:{field:2},box:{tipe:1}},
    ]
  }

const transaction_add = {
    title:"nueva transaccion",
    tables:["transactions","accounts","transactions_tags"],
    loads:[1,
      {
        table_main:2,
        selects:[
          {table:2,field:0,as:"value"},
          {table:2,field:1,as:"show"},
          {table:2,field:2,as:"ingreso"},
        ],
      }
    ],
    windows:[
      {
        title:"informacion general",
        fields:[
          {col:3,name:"nro",sql:{field:0}},
          {col:9,name:"fecha",sql:{field:1},box:{tipe:2}},
          {name:"cuenta",tipe:1,sql:{field:4},box:{tipe:3},load:0},
          {col:6,name:"ingreso",sql:{field:6},box:{tipe:6}},
          {col:6,name:"etiqueta",tipe:1,sql:{field:3},box:{tipe:3}},
          {name:"total",sql:{field:2},box:{tipe:1}},
          {name:"descripcion",tipe:2,sql:{field:5},box:{tipe:1}},
        ],
      }
    ],
    events:[
      {
        name:"boxUpdate",
        actions:[
          {
            name:"tag chag by ingreso",
            action:(u)=>{

              if(u.field.name == "ingreso"){

                var ingresoValue = u.k.Print_GetValue({fieldName:u.field.name,y:u.y});
                var tagsData = u.k.Loads_GetData({loadIndex:1});
                var tagsByIngreso = tagsData.filter(tg=>tg.ingreso==ingresoValue);
                var optionsFromTags = tagsByIngreso.map((tg)=>{return{value:tg.value,show:tg.show}});
                var optionInitial = optionsFromTags[0];

                u.k.Print_SetOptions({fieldName:"etiqueta",options:optionsFromTags});
                u.k.Print_SetValue({fieldName:"etiqueta",value:optionInitial.value,y:0});
              }
            }
          }
        ],
      }
    ],
  }


