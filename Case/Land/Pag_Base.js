
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

    this.#BuildNav({});
    if(success!=null)success();
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
      `;

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

  //recive data from other page
  PageRecive(){

    var data = JSON.parse(sessionStorage.getItem('data'));
    sessionStorage.setItem("data", null);
    return data;
  }


}

//pass to other page with data
function PageSend({url=null, send={}}){

  window.location.href = url;
  var from = window.location.href;
  send.from = from;
  sessionStorage.setItem("data", JSON.stringify(send));
}
