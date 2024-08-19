
var accessData = [

    ["mod-buy","compras - general","modulo de compras"],

    ["mod-items-supplies","items - insumos","modulo de items"],
    ["mod-items-config","items - config","modulo de items"],

    ["mod-bill","facturacion - general","modulo de facturacion"],
    ["mod-bill-rucs","facturacion - multiples rucs","modulo de facturacion"],

    ["mod-workers","trabajadores - general","modulo de trabajadores"],
    ["mod-workers-item","trabajadores - asignar trabajador a item","modulo de trabajadores"],

    ["mod-sale-control","ventas - control","modulo de ventas"],
    ["mod-sale-dscto","ventas - descuento","modulo de ventas"],
    ["mod-sale-item","ventas - agregar item desde venta nueva","modulo de ventas"],
    ["mod-sale-price","ventas - asignar precio a item desde venta nueva","modulo de ventas"],
    ["mod-sale-dscto","ventas - descuento general","modulo de ventas"],

    ["mod-box","caja - general","modulo de caja"],

    ["mod-customer-nro","clientes - nro de documento","modulo de cliente"],
    ["mod-customer-cel","clientes - celular","modulo de cliente"],
    ["mod-customer-dir","clientes - direccion","modulo de cliente"],
    ["mod-customer-email","clientes - correo","modulo de cliente"],
    ["mod-customer-coment","clientes - comentario","modulo de cliente"]

    /*["acc-1","borrar data de importante","data"],
    ["acc-2","venta nueva - se puede agregar items","pos"],
    ["acc-3","venta nueva - puede asignar precio","pos"],
    ["acc-4","caja - modificar apertura","pos"],
    ["acc-5","caja - modifica el cierre","pos"],
    ["acc-6","cuentas - modificar el total de cuentas","cash"],
    ["acc-7","cuentas - modificar el control de cuentas","cash"],
    ["acc-8","ventas - asignar trabajador","pos"],
    ["acc-9","items - modificar stock","items"],
    ["acc-10","venta - asignar a un item a un trabajador","pos"],
    ["acc-11","cuentas - asignar ruc a factura","cash"],*/
    //["pag-seccName-pageName","Seccion: Pagina: ","seccionName"]
];


/*PagesData.forEach(seccion => {
    
    seccion.paginas.forEach(pagina => {
       
        accessData.push([
            "pag-" + seccion.seccion + "-" + pagina.name,
            "Pagina: " + seccion.title+ "-" + pagina.title,
            seccion.seccion
        ]);
    });

});*/

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
