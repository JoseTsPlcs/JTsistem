

paginas = [
    {
        seccion:'<i class="bi bi-shop"></i> tienda',
        paginas:[
            
          {name:"control de ventas diarias",href:"sales_control.php"},
          {name:"venta nueva",href:"sales_new.php"},
        ],
    },
    {
        seccion:'<i class="bi bi-cart"></i> compras',
        paginas:[
            
          {name:"control de compras",href:"buys_control.php"},
          {name:"compra nueva",href:"buy_new.php"},
        ],
    },
    {
        seccion:'<i class="bi bi-person-rolodex"></i> contactos',
        paginas:[
            {name:"lista de clientes",href:"customers_control.php"},
            //{name:"configuracion de clientes",href:"customers_config.php"},
            {name:"lista de proveedores",href:"buy_provieeders.php"},
        ],
    },
    {
        seccion:'<i class="bi bi-box"></i> inventario',
        paginas:[
            {name:"lista de productos",href:"products.php"},
            {name:"precios de productos",href:"products_prices.php"},
            {name:"stock de productos",href:"products_stock.php"},
            //{name:"recetas de productos",href:"products_recipe.php"},
            {name:"orden de produccion",href:"produccions.php"},
            {name:"configuracion",href:"products_config.php"},
        ],
    },
    {
        seccion:'<i class="bi bi-clipboard-data"></i> informes',
        paginas:[
            {name:"ventas",href:"inform_products.php"},
        ],
    },
    {
        seccion:'<i class="bi bi-piggy-bank"></i> cuentas',
        paginas:[
            {name:"lista de pagos",href:"pays_control.php"},
            {name:"lista de facturas",href:"pays_bills.php"},
            //{name:"facturacion",href:"pays_bill.php"},
            {name:"configuracion",href:"pays_config.php"},
        ],
    },
    {
        seccion:'<i class="bi bi-person"></i> usuario',
        paginas:[
            {name:"cuenta",href:"account.php"},
            {name:"salir",href:"login.php"},
        ],
    },
];

var paginasData = [];
var paginasOptions = [];

for (let scc = 0; scc < paginas.length; scc++) {

    const seccion = paginas[scc];

    for (let pg = 0; pg < seccion.paginas.length; pg++) {

        const pagina = seccion.paginas[pg];
        var value = scc + "-" + pg;

        paginasData.push({
            value,
            seccion,
            pagina:pagina.name,
            url:pagina.href,
        });

        
        var show = seccion.seccion +"-"+pagina.name;
        paginasOptions.push({value,show});
    }
    
}