
var conectionOfUsers = new Conection({
  servidor:'localhost',
  usuario:'Lip_Alonso',
  pass:'kfEq2Li-xwv3L]rP',
  baseDatos:'lip_dv',
});

var functionOnlogPage = [];

var controlTest={
  login:false,
  islog:true,
  out:true,
  pageSend:true,
};

var PagesData = [
  {
    icon:'<i class="bi bi-plus-circle"></i>',
    title:'Punto de Venta',
    seccion:'pos',
    paginas:[
      {state:"hide",name:"orders",title:"ordenes de trabajos",href:"check-in.php"},
      {state:"active",name:"saleNew2",title:"venta nueva",href:"sales_new2.php"},
      {state:"hide",name:"box",title:"caja",href:"box.php"},
      {state:"hide",name:"vehicles",title:"vehiculos",href:"vehicles.php"},
      {state:"hide",name:"inmuebles",title:"inmuebles",href:"inmuebles.php"},
    ],
},
  {
      icon:'<i class="bi bi-shop"></i>',
      title:'tienda',
      seccion:'shop',
      paginas:[
        {state:"active",name:"salesCotizacion",title:"ventas en proceso",href:"sales_toConfirm.php"},
        {state:"hide",name:"salesProcess",title:"ventas confirmadas",href:"cook.php"},
        {state:"active",name:"salesPay",title:"ventas por cobrar",href:"salesToPay.php"},
        {state:"hide",name:"salesControl",title:"historial de ventas",href:"sales_control.php"},
      ],
  },
  {
      icon:'<i class="bi bi-cart"></i>',
      title:'compras',
      seccion:'buys',
      paginas:[  
        {state:"hide",name:"buyControl",title:"control de compras",href:"buys_control.php"},
        {state:"hide",name:"buyNew",title:"compra nueva",href:"buy_new.php"},
      ],
  },
  {
      icon:'<i class="bi bi-person-rolodex"></i>',
      title:'contactos',
      seccion:'contacts',
      paginas:[
          {state:"active",name:"customers",title:"lista de clientes",href:"customers_control.php"},
          {state:"hide",name:"provieeders",title:"lista de proveedores",href:"buy_provieeders.php"},
      ],
  },
  {
      icon:'<i class="bi bi-box"></i>',
      title:"inventario",
      seccion:'items',
      paginas:[
          {state:"active",name:"items",title:"lista de items",href:"products.php"},
          {state:"active",name:"prices",title:"precios de items",href:"products_prices.php"},
          {state:"hide",name:"stock",title:"stock de items",href:"products_stock.php"},
          {state:"hide",name:"itemsConfig",title:"configuracion",href:"products_config.php"},
          {state:"hide",name:"produccion",title:"orden de produccion",href:"produccions.php"},
      ],
  },
  /*{
    icon:'<i class="bi bi-hammer"></i>',
    title:"produccion",
    seccion:'production',
    paginas:[
        {state:"hide",name:"recipe",title:"recetas & paquetes",href:"products_recipe.php"},
    ],
  },*/
  {
      icon:'<i class="bi bi-clipboard-data"></i>',
      title:'informes',
      seccion:'informs',
      paginas:[
          {state:"active",name:'informSales',title:"ventas pagadas",href:"inform_sales.php"},
          {state:"active",name:'informProducts',title:"productos vendidos",href:"inform_products.php"},
          {state:"active",name:'informCustomers',title:"clientes frecuentes",href:"inform_customers.php"},
          {state:"active",name:'informCustomersNews',title:"clientes nuevos",href:"inform_customers_news.php"},
          {state:"hide",name:'informFlujo',title:"flujo de caja",href:"inform_flujo.php"},

          {state:"hide",name:'informPay',title:"ventas - por cobrar",href:"inform_nopaid.php"},
          {state:"hide",name:'informTransacctions',title:"transacciones",href:"inform_pays.php"},
          {state:"hide",name:'informAccounts',title:"contador",href:"inform_accounts.php"},
      ],
  },
  {
      icon:'<i class="bi bi-piggy-bank"></i>',
      title:'cuentas',
      seccion:'cash',
      paginas:[
          {state:"hide",name:'pays',title:"lista de pagos",href:"pays_control.php"},
          {state:"hide",name:'cashControl',title:"control",href:"pays_account.php"},
          {state:"hide",name:'bills',title:"lista de facturas",href:"pays_bills.php"},
          {state:"hide",name:'cashConfig',title:"configuracion",href:"pays_config.php"},
      ],
  },
  {
      icon:'<i class="bi bi-person"></i>',
      title:'usuario',
      seccion:'user',
      paginas:[
          {state:"active",name:'company',title:"empresa",href:"admin_account.php"},
          {state:"hide",name:'userConfig',title:"config",href:"admin_config.php"},
      ],
  },
];

function PageDataFind({pageName}) {
  
  var pageInfo = null;
  PagesData.forEach(secc => {
    
    secc.paginas.forEach(pag => {
      
      //console.log(pag,pageName);
      
      if(pag.name==pageName) pageInfo = pag;
    });
  });

  return pageInfo;
}

function SeccDataFind({pageName}) {
  
  //console.log("secc data find by pageName:",pageName, "seccions:",PagesData);
  var seccFound = null;
  PagesData.forEach(secc => {
    
    //console.log("secc paignas",secc.paginas,"pageName",pageName);    
    var pageFound = secc.paginas.find(pg=>pg.name==pageName);
    //console.log("pageFound:",pageFound);
    if(pageFound != null) seccFound = secc;
  });

  return seccFound;
}

function SeccDataFindByName({seccion}) {
  
  return PagesData.find(secc=>secc.seccion==seccion);
}


class Pag_Base extends ODD {

  constructor({success,events}) {

    
    super({success,events});
    let k = this;

    this.#IsLog({success:(i)=>{
 
      k.#SetPages({
        accessList:i.userData.access,
        company:i.userData.company
      });

      k.#BuildNav({
        companyName:i.userData.company.name,
      });

      //set page data
      var pageData = {
        title:"",
        body:null,
      };
      var url = window.location.href;
      var urlArray = url.split("/");
      var href = urlArray[urlArray.length-1];
      PagesData.forEach(secc => {
        
        secc.paginas.forEach(pag => {
          
          if(pag.href == href) pageData = pag;
        });
      });

      pageData.body = this.#body;
      pageData.recive =  InfoBetweenPageGet();
      i.pageData = pageData;

      document.title = i.pageData.title;
      
      i.k = k;
      i.buildCruds=({crudsScript})=>{

        this.#BuildCrudsGroup({crudsScript,pageData});
      };

      if(success!=null)success(i);
    }});
  }

  #SetPages({accessList=[],company}){

    //console.log("setPages, access:", access);

    /*var pgOrders = PagesData[0].paginas[0];
    var pgVehicles = PagesData[0].paginas[3];
    var pgInmuebles = PagesData[0].paginas[4];
    pgOrders.state = "hide";
    pgVehicles.state = "hide";
    pgInmuebles.state = "hide";

    switch (company.tipe) {
      case "2":
        pgOrders.state="active";
        pgVehicles.state="active";
        break;

      case "3":
        pgInmuebles.state="active";
        break;
    
    }*/
    

    PagesData.forEach(secc => {

      secc.paginas.forEach(pagina => {
        
        if(pagina.state=="hide") {

          var pageActive = PageActiveByAccess({accessList, pageName:pagina.name});
          
          
          pagina.state = pageActive ? "active" : "hide";

          if(company.tipe == 1) pagina.state = "active";
        }

        var state = "active";

        if(pagina.access != null) state = Access_Get(accessList,pagina.access) ? "active": "hide";

        pagina.state = state;

      });

    });
        
  }

  #BuildCrudsGroup({crudsScript,pageData}){

    var cruds = crudsScript.layers.filter(ly=>ly.crud!=null);
    if(cruds){

      var crudMain = cruds[0];
      if(crudMain.events!=null) crudMain.events=[];
      crudMain.events=[{
        name:"stateSetFirst",
        actions:[{
          action:()=>{

            PlayTutorialInPage({group,pageData});
          }
        }]
      }]
      
    }


    var group = new CrudsGroup({...groupScript});
    
  }
  
  #bodyContent = `
    <div class="main p-0 p-md-3 mt-0 custom-bg-gray" id="bodyMain">

            <!-- Ventana emergente para descripciones -->
            <div id="popup" class="popup p-3" style="max-width: 600px;">
                <div class="popup-content position-relative">
                    <div class="d-flex justify-content-end">
                      <button id="cancelBtn" class="btn btn-danger"><i class="bi bi-x"></i></button>
                    </div>
                    
                    <div class="py-3" id="popup-description"></div>
                    <div class="d-flex justify-content-between">
                        <button id="prevBtn" class="btn btn-secondary">Anterior</button>
                        <button id="nextBtn" class="btn btn-primary">Siguiente</button>
                    </div>
                </div>
            </div>


    </div>
  `;

  #body;
  #navSeccChange({seccion}){

    var seccData = SeccDataFindByName({seccion});
    seccData.open = !seccData.open;
  }

  #seccionSetState({seccion,show=true}){

    if(this.#navHorizontal){

      var seccionDom = document.getElementById("seccion-"+seccion);
      var seccionDomMenu = seccionDomMenu.querySelector("div.dropdown-menu");
      seccionDom.classList.toggle('show');
      seccionDomMenu.classList.toggle('show');
    }
  }

  #opened
  #icon ={dom:null};
  NavSet({open=true}){

    var navOpened = !this.#icon.dom.classList.contains('collapsed');
    if(!this.#navHorizontal) navOpened = document.getElementById("sidebar").classList.contains("expand");
    
    if(navOpened!=open) this.#icon.dom.click();
  }

  NavSetSeccion({seccData,open=true}){

    var seccOpen = false;
    if(!this.#navHorizontal) seccOpen = seccData.dom.className == "sidebar-link has-dropdown";
    else seccOpen = seccData.dom.getAttribute('aria-expanded')=='true';

    console.log("navsetseccion",seccData.dom.className,seccOpen);
    

    if(seccOpen!=open) seccData.dom.click();
  }

  #navHorizontal = false;
  #BuildNav({}){

    this.#navHorizontal = window.innerWidth < 500;
    if (this.#navHorizontal){

      this.#BuildNavHorizontal({});
      document.querySelectorAll('.nav-item.dropdown > a.dropdown-toggle').forEach(dropdownToggle => {
        dropdownToggle.addEventListener('click', function (event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
    
            // Obtener el menú dropdown correspondiente
            const dropdownMenu = this.nextElementSibling;
    
            // Alternar la clase 'show' en el menú dropdown
            const isExpanded = dropdownMenu.classList.toggle('show');
    
            // Actualizar el atributo 'aria-expanded'
            this.setAttribute('aria-expanded', isExpanded);
    
            // Cerrar otros dropdowns si se desea (opcional)
            document.querySelectorAll('.nav-item.dropdown .dropdown-menu.show').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                    menu.previousElementSibling.setAttribute('aria-expanded', 'false'); // Actualizar aria-expanded
                }
            });
        });
      });
    
    }
    else {

      this.#BuildNavVertical({});
    }

    this.#body = document.getElementById("bodyMain");
    
    let k = this;
    this.#icon.dom = document.getElementById("menuIcon");

    PagesData.forEach(secc => {
      
      secc.open = false;
      secc.dom = document.getElementById("seccion-"+secc.seccion);
      secc.paginas.forEach(pag => {
          
        pag.dom = document.getElementById("page-"+pag.name);
      });
    });
  }

  #BuildNavVertical({pagesData=[]}){

    //console.log("buildNav:",PagesData);

    var nav = "";

    /*nav +=`

      <div class="horizontal-bar">
            <button id="helpIcon" class="btn btn-light" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="lni lni-home"></i> <!-- Ícono de home de Lineicons -->
            </button>
            <ul class="dropdown-menu" aria-labelledby="helpIcon" id="itemsTutorials">
            </ul>
      </div>
    `;*/

    nav += `    
    <div class="wrapper">
        <aside id="sidebar">
            <div class="d-flex">
                <button class="toggle-btn" type="button" id="menuIcon">
                    <i class="lni lni-grid-alt"></i>
                </button>
                <div class="sidebar-logo">
                    <a href="admin_account.php">`+"JtSistem"+`</a>
                </div>
            </div>
            <ul class="sidebar-nav">
    `;
      
    PagesData.forEach(secc => {

      var countPages = secc.paginas.reduce((acc,v)=>{return acc + (v.state=="active"?1:0)},0);
      if(countPages>0){

        nav+= `
                <li class="sidebar-item">
                    <a href="#" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse"
                        data-bs-target="#`+secc.seccion+`" id="seccion-`+secc.seccion+`" aria-expanded="false" aria-controls="`+secc.seccion+`">
                        `+secc.icon+`
                        <span>`+secc.title+`</span>
                    </a>`;



        nav+= `
            <ul id="`+secc.seccion+`" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">`;
              
        secc.paginas.forEach(pag => {
            
            if(pag.state != "hide"){
                nav+= `
                <li class="sidebar-item">
                    <a id="page-`+pag.name+`" href="`+(pag.state=="active"?pag.href:"")+`" `+(pag.state=="disactive"?"disabled":"")+` class="sidebar-link`+(pag.state=="disactive"?" bg-danger":"")+`">`+pag.title+`</a>
                </li>
                `;
            }

        });

        nav+=`</ul>
        `;


        nav+= `</li>
        `;
      }

    });   

    
    nav += `
    <li class="sidebar-item">
        <a href="tutorial.php" class="sidebar-link" id="secc-tutorial">
            <i class="bi bi-question-circle"></i>
            <span>Tutorial</span>
        </a>
    </li>
    `;

    nav += `
            </ul>
            <div class="sidebar-footer">
                <a href="../../../" class="sidebar-link" id="secc-logOut">
                    <i class="lni lni-exit"></i>
                    <span>Salir</span>
                </a>
            </div>
        </aside>

      `+this.#bodyContent+`

    </div>
    `;

    document.body.innerHTML = nav;


    const hamBurger = document.querySelector(".toggle-btn");
    hamBurger.addEventListener("click", function () {
      document.querySelector("#sidebar").classList.toggle("expand");
    });
  }

  #BuildNavHorizontal({pagesData=[]}){

    var nav = `
      <nav class="navbar navbar-dark bg-dark px-2">
        <a class="navbar-brand" href="admin_account.php">JtSistem</a>
        <button id="menuIcon" class="navbar-toggler mr-2 text-white collapsed" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="lni lni-grid-alt"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            
    `;

    PagesData.forEach(secc => {
      
      var pagesCount = secc.paginas.find(pg=>pg.state=="active");

      if(pagesCount != null){

          nav += `
      
        <li class="nav-item dropdown">
          <a id="seccion-`+secc.seccion+`" class="nav-link dropdown-toggle text-white" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            `+secc.icon+" "+secc.title+`
          </a>
          <div class="dropdown-menu" aria-labelledby="seccion-`+secc.seccion+`">
        `;

        secc.paginas.forEach(pg => {
        
          if(pg.state=="active"){
  
            nav += `<a class="dropdown-item" id="page-`+pg.name+`" href="`+pg.href+`">`+pg.title+`</a>`;
          }
  
        });

        nav += `
          </div>
        </li>
        
        `;
      }

    });

    nav += `

      <li class="nav-item active">
        <a class="nav-link" href="tutorial.php" id="secc-tutorial">
          <i class="bi bi-question-circle"></i><span> Tutorial</span>
        </a>
      </li>

      <li class="nav-item active" id="secc-logOut">
        <a class="nav-link" href="../../../">
          <i class="lni lni-exit"></i><span> Salir</span>
        </a>
      </li>
    `;

    nav += `

          
          </ul>
        </div>
      </nav>
    `;

    nav += this.#bodyContent;

    document.body.innerHTML = nav;
  }

  #IsLog({success}){

    //is log?
    let k = this;
    $.post("../../../libs/case-1.0.1/Land/IsLog.php",{},function(resp) {
      
      resp = JSON.parse(resp);
      if(resp.error != null){

        k.#IsLog_Fail({error:resp.error});
        return;
      }
      
      var userData = resp;

      console.log("-------login-------");
      console.log("userData:",userData);

      functionOnlogPage.forEach(fct => {
    
        if(fct!=null) fct(userData);
      });

      if(success!=null)success({userData});

    }); 

  }

  #IsLog_Fail({error}){

    //alert("error:",error);
    window.location.href = "../../../Index.php";
  }

  #tutorial = null;
  tutorialPlay({pageName,send}){

    var seccData = SeccDataFind({pageName});
    var pageData = PageDataFind({pageName});
    
    var elementsInfo = [];

    elementsInfo.push({
      id:"menuIcon",
      descripcion:"selecciona el icono para mostrar el menu de navegación",
      eventNext:({element})=>{

        this.NavSet({open:true});
      }
    });

    elementsInfo.push({
      id:"seccion-"+seccData.seccion,
      descripcion:"seleciona la seccion [title]".replace("[title]",seccData.title),
      eventNext:({element})=>{

        this.NavSetSeccion({seccData,open:true});
      }
    });

    elementsInfo.push({
      id:"page-"+pageData.name,
      descripcion:"selecciona la pagina " + pageData.title,
      eventNext:()=>{

        PageGoto({pageName,send});
      }
    });
    

    this.#tutorial = new Tutorial({elementsInfo});
    this.#tutorial.startTutorial();
  }

}

function InfoBetweenPagesSet(send) {
  
  sessionStorage.setItem("data", JSON.stringify({...send}));
}

function InfoBetweenPageGet() {

  var data = JSON.parse(sessionStorage.getItem('data'));
  sessionStorage.setItem("data", null);
  return data;
}

function PageGoto({pageName,send=null}) {
  
  var pageInfo = PageDataFind({pageName});
  PageSend({
    url:pageInfo.href,
    send,
  });
}

//pass to other page with data
function PageSend({url=null, send={}}){

  
  var from = window.location.href;
  send.from = from;
  console.log("go to url:",url,"send:",send);
  
  InfoBetweenPagesSet(send);

  window.location.href = url;
}

//recive data from other page
function PageRecive(){

  var data = InfoBetweenPageGet();
  return data;
}

function Login({uss,pss,fail}){

    var loginSql = conectionOfUsers.GetSql_Select({
        dbMain:"lip_dv",
        tableMain:"users",
        selects:[
            {db:"lip_dv",table:'users', field:'ID_USER'},
            {db:"lip_dv",table:'users', field:'NAME',as:"USER_NAME"},
            {db:"lip_dv",table:'users', field:'PASSWORD'},
            {db:"lip_dv",table:'users', field:'ACTIVE',as:"USER_ACTIVE"},
            {db:"lip_dv",table:"class",field:"NAME",as:"CLASS_NAME"},
            {db:"lip_dv",table:"class",field:"ID_CLASS"},
            {db:"lip_dv",table:"companies",field:"ID_COMPANY",as:"COMPANY_ID"},
            {db:"lip_dv",table:"companies",field:"ID_COMPANY_TYPE",as:"COMPANY_TYPE"},
            {db:"lip_dv",table:"companies",field:"NAME",as:"COMPANY_NAME"},
            {db:"lip_dv",table:"companies",field:"RUC",as:"COMPANY_RUC"},
            {db:"lip_dv",table:"companies",field:"NAME_REAL",as:"COMPANY_NAME_REAL"},   
            {db:"lip_dv",table:"companies",field:"TELF",as:"COMPANY_TELF"},    
            {db:"lip_dv",table:"companies",field:"DIRECCION",as:"COMPANY_DIRECCION"},        
            {db:"lip_dv",table:"companies",field:"EMAIL",as:"COMPANY_EMAIL"},
            {db:"lip_dv",table:"companies",field:"ACTIVE",as:"COMPANY_ACTIVE"},
            {db:"lip_dv",table:"companies",field:"LOGO",as:"COMPANY_LOGO"},
        ],
        joins:[
            {
              main:{db:"lip_dv",table:"users",field:"ID_COMPANY"},
              join:{db:"lip_dv",table:"companies",field:"ID_COMPANY"},
              tipe:"LEFT",
            },
            {
              main:{db:"lip_dv",table:"users",field:"ID_CLASS"},
              join:{db:"lip_dv",table:"class",field:"ID_CLASS"},
              tipe:"LEFT",
            },
        ],
        conditions:[
            {
                table:"users",
                field:"NAME",
                inter:"=",
                value:uss,
                after:" AND ",
            },
            {
                table:"users",
                field:"PASSWORD",
                inter:"=",
                value:pss,
            },
        ],
    });

    //console.log("login:",loginSql);

    conectionOfUsers.Request({
        php:"row",log:true,
        sql:loginSql,
        success:(result)=>{

            if(result && result.length > 0){

              var userActive = result[0]["USER_ACTIVE"] == "1";
              var companyActive = result[0]["COMPANY_ACTIVE"] == "1";

              if(!userActive || !companyActive){

                if(fail!=null) fail();
                return;
              }

              //console.log(result);

              var userData = {
                id:result[0]["ID_USER"],
                name:result[0]["USER_NAME"],

                company:{
                  id:result[0]["COMPANY_ID"],
                  name:result[0]["COMPANY_NAME"],
                  tipe:result[0]["COMPANY_TYPE"],
                  ruc:result[0]["COMPANY_RUC"],
                  telf:result[0]["COMPANY_TELF"],
                  nameReal:result[0]["COMPANY_NAME_REAL"],
                  email:result[0]["COMPANY_EMAIL"],
                  direccion:result[0]["COMPANY_DIRECCION"],
                  logo:result[0]["COMPANY_LOGO"],
                },
                class:{
                  name:result[0]["CLASS_NAME"],
                  id:result[0]["ID_CLASS"],
                },
                access:[],
              };

              var AccessSql = conectionOfUsers.GetSql_Select({
                tableMain:"class_access",
                selects:[
                  {table:"class_access",field:"ID_ACCESS"},
                  {table:"class_access",field:"ACTIVE"},
                ],
                conditions:[
                  {
                    table:"class_access",
                    field:"ID_CLASS",
                    inter:"=",
                    value:userData.class.id,
                  }
                ],
              }); 
              
              
              conectionOfUsers.Request({
                php:"row",sql:AccessSql,
                success:(result)=>{

                  result.forEach(rst => {
                    
                    var value = rst["ID_ACCESS"];
                    var access = op_access.find(acc=>acc.value==value);
                    var show = "true";
                    var active = rst["ACTIVE"] == "1";

                    userData.access.push({value,show,active});
                  });


                  $.post(window.location.pathname.split('/').pop()+"libs/case-1.0.1/Land/setLogin.php",{userData},function(resp) {
                  
                    if(controlTest.login) return;
                    
                    PageSend({
                        url:"proyects/jtsistem/pages/tutorial.php",
                        send:{},
                    });
                  }); 
                }
              });         
                               
            }
            else if(fail!=null) fail();
        }
    });
}