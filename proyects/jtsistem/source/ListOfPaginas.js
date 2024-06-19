

paginas = [
    {
        icon:'<i class="bi bi-shop"></i>',
        title:'tienda',
        seccion:'shop',
        paginas:[
          {name:"orders",title:"ordenes de trabajos",href:"check-in.php"},
          {name:"sale new",title:"venta nueva",href:"sales_new.php"},
          {name:"sales control",title:"control de ventas",href:"sales_control.php",fechaMin:Date_Today(),fechaMax:Date_Today()},
          {name:"sales in process",title:"ventas confirmadas y en proceso",href:"cook.php"},
          {name:"sales to pay",title:"ventas terminadas por cobrar",href:"inform_nopaid.php"},
          {name:"cash",title:"caja",href:"pays_account.php"},
          {name:"vehicles",title:"vehiculos",href:"vehicles.php"},
          {name:"inmuebles",title:"inmuebles",href:"inmuebles.php"},
        ],
    },
    {
        icon:'<i class="bi bi-cart"></i>',
        title:'compras',
        seccion:'buys',
        paginas:[  
          {name:"buy control",title:"control de compras",href:"buys_control.php"},
          {name:"buy new",title:"compra nueva",href:"buy_new.php"},
        ],
    },
    {
        icon:'<i class="bi bi-person-rolodex"></i>',
        title:'contactos',
        seccion:'contacts',
        paginas:[
            {name:"contacts-customers",title:"lista de clientes",href:"customers_control.php"},
            {name:"contacts-provieeders",title:"lista de proveedores",href:"buy_provieeders.php"},
        ],
    },
    {
        icon:'<i class="bi bi-box"></i>',
        title:"inventario",
        seccion:'stock',
        paginas:[
            {name:"items",title:"lista de items",href:"products.php"},
            {name:"prices",title:"precios de items",href:"products_prices.php"},
            {name:"stock",title:"stock de items",href:"products_stock.php"},
            {name:"recipe",title:"recetas",href:"products_recipe.php"},
            {name:"produccion",title:"orden de produccion",href:"produccions.php"},
            {name:"items config",title:"configuracion",href:"products_config.php"},
        ],
    },
    {
        icon:'<i class="bi bi-clipboard-data"></i>',
        title:'informes',
        seccion:'informs',
        paginas:[
            {name:'infom-sales',title:"ventas - completada",href:"inform_products.php"},
            {name:'inform-pay',title:"ventas - por cobrar",href:"inform_nopaid.php"},
            {name:'inform-transacctions',title:"transacciones",href:"inform_pays.php"},
            {name:'inform-accounts',title:"contador",href:"inform_accounts.php"},
        ],
    },
    {
        icon:'<i class="bi bi-piggy-bank"></i>',
        title:'cuentas',
        seccion:'cash',
        paginas:[
            {name:'pays',title:"lista de pagos",href:"pays_control.php"},
            {name:'cash control',title:"control",href:"pays_account.php"},
            {name:'list of bills',title:"lista de facturas",href:"pays_bills.php"},
            //{name:'',title:"facturacion",href:"pays_bill.php"},
            {name:'cash-config',title:"configuracion",href:"pays_config.php"},
        ],
    },
    {
        icon:'<i class="bi bi-person"></i>',
        title:'usuario',
        seccion:'user',
        paginas:[
            {name:'compani',title:"empresa",href:"admin_account.php"},
            {name:'user-config',title:"config",href:"admin_config.php"},
            {name:'out',title:"salir",href:"login.php"},
        ],
    },
];


function Paginas_GetItem({seccName,pageName}){

    var item = null;

    if(seccName!=null){

        item = paginas.find(pg=>pg.seccion==seccName);
    }

    if(pageName!=null){

        paginas.forEach(secc => {
            
            var pgfound = secc.paginas.find(p=>p.name==pageName);
            if(pgfound != null) item = pgfound;
        });
    }

    if(item == null) console.log("item no found seccion:",seccName," pagina:",pageName);

    return item;
}

var paginasData = [];
var paginasOptions = [];

for (let scc = 0; scc < paginas.length; scc++) {

    const seccion = paginas[scc];

    for (let pg = 0; pg < seccion.paginas.length; pg++) {

        var pagina = seccion.paginas[pg];
        var value = scc + "-" + pg;
        pagina.value = value;

        paginasData.push({
            value,
            seccion,
            pagina:pagina.name,
            url:pagina.href,
        });

        
        var show = "pagina: " + seccion.seccion +"-"+pagina.name;
        paginasOptions.push({value,show});
    }
    
}

paginasOptions.forEach(op => {
    
    op_access.push(op);
});

