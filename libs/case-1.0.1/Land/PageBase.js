
class PageBase extends ODD {

    constructor(i){

        super(i);
        this.#BuildNav(i);
    }

    #paginas = [
        {
            icon:'<i class="bi bi-shop"></i>',
            title:'tienda',
            seccion:'shop',
            paginas:[
              {state:"access",name:"orders",title:"ordenes de trabajos",href:"check-in.php"},
              {state:"access",name:"sale new",title:"venta nueva",href:"sales_new.php"},
              {state:"access",name:"sales control",title:"control de ventas",href:"sales_control.php",fechaMin:Date_Today(),fechaMax:Date_Today()},
              {state:"access",name:"sales in cotizacion",title:"ventas por confirmar",href:"sales_toConfirm.php"},
              {state:"access",name:"sales in process",title:"ventas confirmadas y en proceso",href:"cook.php"},
              {state:"access",name:"sales to pay",title:"ventas terminadas por cobrar",href:"inform_nopaid.php"},
              {state:"access",name:"cash",title:"caja",href:"pays_account.php"},
              {state:"access",name:"vehicles",title:"vehiculos",href:"vehicles.php"},
              {state:"access",name:"inmuebles",title:"inmuebles",href:"inmuebles.php"},
            ],
        },
        {
            icon:'<i class="bi bi-cart"></i>',
            title:'compras',
            seccion:'buys',
            paginas:[  
              {state:"access",name:"buy control",title:"control de compras",href:"buys_control.php"},
              {state:"access",name:"buy new",title:"compra nueva",href:"buy_new.php"},
            ],
        },
        {
            icon:'<i class="bi bi-person-rolodex"></i>',
            title:'contactos',
            seccion:'contacts',
            paginas:[
                {state:"access",name:"contacts-customers",title:"lista de clientes",href:"customers_control.php"},
                {state:"access",name:"contacts-provieeders",title:"lista de proveedores",href:"buy_provieeders.php"},
            ],
        },
        {
            icon:'<i class="bi bi-box"></i>',
            title:"inventario",
            seccion:'stock',
            paginas:[
                {state:"access",name:"items",title:"lista de items",href:"products.php"},
                {state:"access",name:"prices",title:"precios de items",href:"products_prices.php"},
                {state:"access",name:"stock",title:"stock de items",href:"products_stock.php"},
                {state:"access",name:"recipe",title:"recetas",href:"products_recipe.php"},
                {state:"access",name:"produccion",title:"orden de produccion",href:"produccions.php"},
                {state:"access",name:"items config",title:"configuracion",href:"products_config.php"},
            ],
        },
        {
            icon:'<i class="bi bi-clipboard-data"></i>',
            title:'informes',
            seccion:'informs',
            paginas:[
                {state:"access",name:'infom-sales',title:"ventas - completada",href:"inform_products.php"},
                {state:"access",name:'inform-pay',title:"ventas - por cobrar",href:"inform_nopaid.php"},
                {state:"access",name:'inform-transacctions',title:"transacciones",href:"inform_pays.php"},
                {state:"access",name:'inform-accounts',title:"contador",href:"inform_accounts.php"},
            ],
        },
        {
            icon:'<i class="bi bi-piggy-bank"></i>',
            title:'cuentas',
            seccion:'cash',
            paginas:[
                {state:"access",name:'pays',title:"lista de pagos",href:"pays_control.php"},
                {state:"access",name:'cash control',title:"control",href:"pays_account.php"},
                {state:"access",name:'list of bills',title:"lista de facturas",href:"pays_bills.php"},
                {state:"access",name:'cash-config',title:"configuracion",href:"pays_config.php"},
            ],
        },
        {
            icon:'<i class="bi bi-person"></i>',
            title:'usuario',
            seccion:'user',
            paginas:[
                {state:"access",name:'compani',title:"empresa",href:"admin_account.php"},
                {state:"access",name:'user-config',title:"config",href:"admin_config.php"},
                {state:"access",name:'out',title:"salir",href:"login.php"},
            ],
        },
    ];

    #BuildNav({companyName="JtSistemName"}){

        var nav = "";
        nav = `    
        <div class="wrapper">
            <aside id="sidebar">
                <div class="d-flex">
                    <button class="toggle-btn" type="button">
                        <i class="lni lni-grid-alt"></i>
                    </button>
                    <div class="sidebar-logo">
                        <a href="#">`+companyName+`</a>
                    </div>
                </div>
                <ul class="sidebar-nav">
        `;
           
        this.#paginas.forEach(secc => {
            
            nav+= `
                    <li class="sidebar-item">
                        <a href="#" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                            data-bs-target="#`+secc.seccion+`" aria-expanded="false" aria-controls="`+secc.seccion+`">
                            `+secc.icon+`
                            <span>`+secc.seccion+`</span>
                        </a>`;
            
            

            nav+= `
                <ul id="`+secc.seccion+`" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">`;
                   
            secc.paginas.forEach(pag => {
                
                if(pag.state != "hide"){
                    nav+= `
                    <li class="sidebar-item">
                        <a href="#`+(pag.state=="access"?pag.href:"#")+`" `+(pag.state="block"?"disabled":"")+` class="sidebar-link">`+pag.title+`</a>
                    </li>
                    `;
                }

            });

            nav+=`</ul>
            `;


            nav+= `</li>
            `;

        });

        

        nav += `
                </ul>
                <div class="sidebar-footer">
                    <a href="#" class="sidebar-link">
                        <i class="lni lni-exit"></i>
                        <span>Logout</span>
                    </a>
                </div>
            </aside>
            <div class="main p-3">
                <div class="text-center">
                    <h1>
                        Sidebar Bootstrap 5
                    </h1>
                </div>
            </div>
        </div>
        `;

        document.body.innerHTML = nav;

        const hamBurger = document.querySelector(".toggle-btn");
        hamBurger.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("expand");
        });
    }

}