

var modulos = [
    {
        value:"md-sale",
        show:"Módulo de Ventas",
        access:[
            {value:"dscto",show:"descuento"},
            {value:"box",show:"control de caja",pages:["box"]},
        ],
    },
    {
        value:"md-customer",
        show:"Módulo de Clientes",
        access:[
            {value:"cel",show:"celular"},
            {value:"dir",show:"direccion"},
            {value:"email",show:"correo"},
            {value:"coment",show:"comentario"},
        ],
    },
    {
        value:"md-buy",
        show:"Módulo de Compras",
        access:[
            {value:"all",show:"general",pages:["buyControl","buyNew","provieeders"]},
        ],
    },
    {
        value:"md-items",
        show:"Módulo de Ítems",
        access:[
            {value:"price",show:"asignar precio"},
            {value:"item",show:"añadir o editar items"},
            {value:"stock",show:"editar stock de items"},
        ],
    },
    {
        value:"md-bills",
        show:"Módulo de Facturación",
        access:[
            {value:"all",show:"general",pages:["bills","informAccounts"]},
            {value:"rucs",show:"multiples rucs"},
        ],
    },
    {
        value:"md-workers",
        show:"modulo de trabajadores",
        access:[
            {value:"all",show:"general"},
            {value:"item",show:"asignar trabajador a item"},
        ],
    }
];

modulos.forEach(md => {
   
    md.access.forEach(acc => {
        
        acc.value = md.value + "-" + acc.value;
    });
});

var op_modulos = modulos.map(md=>{return {value:md.value,show:md.show}});
var op_access = [];
modulos.forEach(md => {
    
    md.access.forEach(acc => {
        
        op_access.push({
            value:acc.value,
            show:acc.show,
        });
    });
});


function Access_Get(accessList,accessValue) {
    
    var acc = accessList.find(acc=>acc.value==accessValue);
    var active = acc != null && acc.active == "true";
    //if(accessValue=="md-buy-all") console.log("get access: " + accessValue,acc,active,accessList);
    return active;
}

function PageActiveByAccess({accessList,pageName}){

    var access = false;
    modulos.forEach(md => {
        
        md.access.forEach(acc => {

            if(acc.pages && acc.pages.find(pg=>pg==pageName)){
            
                access = Access_Get(accessList, acc.value);
                //console.log(pageName + " access:",access);
            }
        });
    });

    return access;

}