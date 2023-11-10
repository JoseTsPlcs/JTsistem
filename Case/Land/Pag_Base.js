
class Pag_Base {

  #lg = null;
  #url_base = '/CASE/Pages/';
  #load = null;

  constructor({success=null, title=null}) {

    if(title) document.title = title;
    this.#load = new ScreenLoad({state:false});

    let k = this;
    //create user log
    
    k.#load.SetState({state:true});
    this.#lg = new UserLog({

      success:function({loger}) {

        
        //when start page then log
        loger.IsLog({

          log:true,
          success:function({user=null, pages=[]}) {

            //console.log("user data: ", user, pages);
            k.#CreateNav({
              success:()=>{

                k.#SetActivePages({pages:pages});

                const recive = k.PageRecive();

                k.#load.SetState({state:false});
                if(success != null) success({user:user, page:k, recive:recive, screenload:k.#load});
              }
            });
            
          },
          error:()=>{

          },
        });
      }
    });
  }

  //create nav
  #CreateNav({success=null}={}){

    if(false){

      let k = this;
      const ld = new dataBase();
      ld.LoadTables({
        tables:['paginas','nav_seccions'],
        success:function(){

          ld.Select_Sql({
            table_main:1,
            selects:[
              {table:1,field:1,as:'SECCION'},
              {table:1,field:2,as:'SHOW'},
            ],
            orders:[
              {table:1,field:2,asc:true},
            ],
            success:function(seccions){

              ld.Select_Sql({
                table_main:0,
                selects:[
                  {table:1,field:1,as:'SECCION'},
                  {table:1,field:2,as:'SHOW'},
                  {table:0,field:0,as:'PAGE_ID'},
                  {table:0,field:1,as:'PAGE_TITLE'},
                  {table:0,field:2,as:'PAGE_URL'},
                ],
                joins:[
                  {main:{table:0,field:3},join:{table:1,field:0}},
                ],
                orders:[
                  {table:1,field:2,asc:true},
                  {table:0,field:4,asc:true},
                ],
                log_sql:false,
                success:(items)=>{
                  
                  console.log('---------seccion-----------');
                  console.log(JSON.stringify(seccions));
                  console.log('---------items----------');
                  console.log(JSON.stringify(items));

                  k.#BuildNav({seccions:seccions,items:items});
                  if(success!=null)success();
                } 
              });

            }
          })
      
        }
      });

    }else{

      
      this.#BuildNav({
        seccions:[
          {"SECCION":"Ventas","SHOW":"1"},
          {"SECCION":"Despacho","SHOW":"2"},
          {"SECCION":"Reportes","SHOW":"3"},
          {"SECCION":"Clientes","SHOW":"4"},
          {"SECCION":"Productos","SHOW":"5"},
          {"SECCION":"Compras","SHOW":"8"},
          {"SECCION":"Almacen","SHOW":"9"},
          {"SECCION":"Contabilidad","SHOW":"10"},
          {"SECCION":"Administrador","SHOW":"11"},
          {"SECCION":"Usuario","SHOW":"999"}
        ],
        items:[
          {"SECCION":null,"SHOW":null,"PAGE_ID":"35","PAGE_TITLE":"Abrir","PAGE_URL":"Cashier_Open"},
          {"SECCION":null,"SHOW":null,"PAGE_ID":"37","PAGE_TITLE":"Cerrar","PAGE_URL":"Cashier_Close"},
          {"SECCION":null,"SHOW":null,"PAGE_ID":"36","PAGE_TITLE":"Control","PAGE_URL":"Cashier_Control"},
          {"SECCION":"Ventas","SHOW":"1","PAGE_ID":"1","PAGE_TITLE":"Venta","PAGE_URL":"Factura"},
          {"SECCION":"Ventas","SHOW":"1","PAGE_ID":"2","PAGE_TITLE":"Control","PAGE_URL":"Sales_Control"},
          {"SECCION":"Ventas","SHOW":"1","PAGE_ID":"7","PAGE_TITLE":"Armar","PAGE_URL":"Armar"},
          {"SECCION":"Ventas","SHOW":"1","PAGE_ID":"20","PAGE_TITLE":"Cobrar","PAGE_URL":"Sales_Pay"},
          {"SECCION":"Ventas","SHOW":"1","PAGE_ID":"21","PAGE_TITLE":"Entregar","PAGE_URL":"Sales_Commit"},
          {"SECCION":"Despacho","SHOW":"2","PAGE_ID":"10","PAGE_TITLE":"Delivery","PAGE_URL":"Delivery"},
          {"SECCION":"Despacho","SHOW":"2","PAGE_ID":"14","PAGE_TITLE":"Zonas","PAGE_URL":"Delivery_Zones"},
          {"SECCION":"Reportes","SHOW":"3","PAGE_ID":"3","PAGE_TITLE":"Ventas del Mes","PAGE_URL":"Report_Sales"},
          {"SECCION":"Reportes","SHOW":"3","PAGE_ID":"30","PAGE_TITLE":"Flujo de Caja","PAGE_URL":"Report_Cont"},
          {"SECCION":"Clientes","SHOW":"4","PAGE_ID":"32","PAGE_TITLE":"Nuevo","PAGE_URL":"Customers_Add"},
          {"SECCION":"Clientes","SHOW":"4","PAGE_ID":"9","PAGE_TITLE":"Clientes","PAGE_URL":"Customers"},
          {"SECCION":"Clientes","SHOW":"4","PAGE_ID":"33","PAGE_TITLE":"Tipo","PAGE_URL":"Customers_Types"},
          {"SECCION":"Productos","SHOW":"5","PAGE_ID":"17","PAGE_TITLE":"Precios","PAGE_URL":"Prices"},
          {"SECCION":"Productos","SHOW":"5","PAGE_ID":"4","PAGE_TITLE":"Productos","PAGE_URL":"Products"},
          {"SECCION":"Productos","SHOW":"5","PAGE_ID":"31","PAGE_TITLE":"Tipos","PAGE_URL":"Products_Types"},
          {"SECCION":"Productos","SHOW":"5","PAGE_ID":"23","PAGE_TITLE":"unidades","PAGE_URL":"Products_Unids"},
          {"SECCION":"Compras","SHOW":"8","PAGE_ID":"26","PAGE_TITLE":"Control","PAGE_URL":"Buy_Control"},
          {"SECCION":"Compras","SHOW":"8","PAGE_ID":"27","PAGE_TITLE":"proveedores","PAGE_URL":"Providers"},
          {"SECCION":"Compras","SHOW":"8","PAGE_ID":"34","PAGE_TITLE":"Proveedor Productos","PAGE_URL":"Providers_Products"},
          {"SECCION":"Compras","SHOW":"8","PAGE_ID":"25","PAGE_TITLE":"Nueva","PAGE_URL":"Buy_Add"},
          {"SECCION":"Almacen","SHOW":"9","PAGE_ID":"28","PAGE_TITLE":"Lista de Ingreso","PAGE_URL":"Store_ListEnter"},
          {"SECCION":"Almacen","SHOW":"9","PAGE_ID":"29","PAGE_TITLE":"Recepcion","PAGE_URL":"Store_Enter"},
          {"SECCION":"Almacen","SHOW":"9","PAGE_ID":"15","PAGE_TITLE":"Stock","PAGE_URL":"Store_Stock"},
          {"SECCION":"Contabilidad","SHOW":"10","PAGE_ID":"8","PAGE_TITLE":"Facturas","PAGE_URL":"Cont_Facturas"},
          {"SECCION":"Contabilidad","SHOW":"10","PAGE_ID":"16","PAGE_TITLE":"Vista Factura","PAGE_URL":"Cont_Factura_View"},
          {"SECCION":"Contabilidad","SHOW":"10","PAGE_ID":"44","PAGE_TITLE":"Transacciones","PAGE_URL":"Cont_Transactions"},
          {"SECCION":"Contabilidad","SHOW":"10","PAGE_ID":"42","PAGE_TITLE":"Etiquetas","PAGE_URL":"Cont_Tag"},
          {"SECCION":"Contabilidad","SHOW":"10","PAGE_ID":"43","PAGE_TITLE":"Cuentas","PAGE_URL":"Cont_Account"},
          {"SECCION":"Administrador","SHOW":"11","PAGE_ID":"5","PAGE_TITLE":"Administrador","PAGE_URL":"Admin_Control"},
          {"SECCION":"Administrador","SHOW":"11","PAGE_ID":"38","PAGE_TITLE":"Paginas","PAGE_URL":"Admin_Pages"},
          {"SECCION":"Administrador","SHOW":"11","PAGE_ID":"39","PAGE_TITLE":"Usuarios","PAGE_URL":"Admin_Users"},
          {"SECCION":"Administrador","SHOW":"11","PAGE_ID":"41","PAGE_TITLE":"Roles","PAGE_URL":"Admin_Roles"},
          {"SECCION":"Administrador","SHOW":"11","PAGE_ID":"40","PAGE_TITLE":"Secciones","PAGE_URL":"Admin_Seccions"},
          {"SECCION":"Usuario","SHOW":"999","PAGE_ID":"11","PAGE_TITLE":"LogOut","PAGE_URL":"LogOut"}
        ]
      });
      if(success!=null)success();

    }
  }

  #BuildNav({}={}){

    var nav = document.getElementById('navegator');
    if(nav == null){

      nav = document.createElement('nav');
      document.body.appendChild(nav);
    }
    nav.setAttribute("class", "navbar navbar-expand-lg navbar-dark bg-dark");

    nav.innerHTML+= `
      <span class="navbar-brand mb-0 h1">QK</span>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto" id="navbarlist">
        </ul>
      </div>
        `

    const ul = document.getElementById('navbarlist');
    secciones.forEach(secc => {
      
      ul.innerHTML += `
      <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            `+ secc.show +`
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown", id="navseccion_` + secc.show + `">
          </div>
        </li>
      `;

      const secc_paginas = paginas.filter(pg=>pg.seccion == secc.value);
      secc_paginas.forEach(pagina => {
        
        const lst = document.getElementById('navseccion_' + secc.show);
        lst.innerHTML += `<a class="dropdown-item disabled" href="`+ pagina.php + '.php' +`" id="page_` + pagina.value +`">` + pagina.show +`</a>`;
      });

    });

  }

  //search items of pages and active or disactive
  #SetActivePages({pages=[]}){

    pages.forEach(pg => {
      
      const pg_dom = document.getElementById('page_' + pg.PAG_ID);
      if(pg_dom) pg_dom.className = 'dropdown-item';
    });

  }

  //pass to other page with data
  PageSend({url=null, send={}}){

    window.location.href = url;
    var from = window.location.href;
    send.from = from;
    sessionStorage.setItem('data', JSON.stringify(send));
  }

  //recive data from other page
  PageRecive(){

    var data = JSON.parse(sessionStorage.getItem('data'));
    sessionStorage.setItem("data", null);
    return data;
  }


}
