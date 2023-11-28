

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