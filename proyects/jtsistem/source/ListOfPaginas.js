
var accessData = [

    ["acc-1","borrar data de importante","data"],
    ["acc-2","actualizar lista de productos","productos"],
    ["acc-3","asignar precio a producto en venta","productos"],
    ["acc-4","modificar apertura de los controles de cuentas","caja"],
    ["acc-5","modifica el cierre de los controles de cuentas","caja"],
    ["acc-6","modificar el total de cuentas","cuentas"],
    ["acc-7","modificar el estado de cuentas","cuentas"],
    ["acc-8","asignar trabajador de venta","ventas"],
    ["acc-9","modificar stock","productos"],
    ["acc-10","asignar a un item a un trabajador","ventas"],
    ["acc-11","asignar ruc a factura","contador"],
    //["pag-seccName-pageName","Seccion: Pagina: ","seccionName"]
];


PagesData.forEach(seccion => {
    
    seccion.paginas.forEach(pagina => {
       
        accessData.push([
            "pag-" + seccion.seccion + "-" + pagina.name,
            "Seccion: " + seccion.seccion + " Pagina: " + pagina.name,
            seccion.seccion
        ]);
    });

});

accessData.forEach(acc => {
    
    op_access.push({
        value:acc[0],
        show:acc[1],
    });

    if(!op_access_type.find(op=>op.value==acc[2])) op_access_type.push({value:acc[2],show:acc[2]});
});

function Access_Get(accessList,accessValue) {
    
    var acc = accessList.find(acc=>acc.value==accessValue);
    var active = acc != null && acc.active == "true";
    //console.log("get access: " + accessValue,acc,active,accessList);
    return active;
}
