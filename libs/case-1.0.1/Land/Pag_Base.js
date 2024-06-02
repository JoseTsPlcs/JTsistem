
var conectionOfUsers = new Conection({
  servidor:'localhost',
  usuario:'Lip_Alonso',
  pass:'kfEq2Li-xwv3L]rP',
  baseDatos:'lip_dv',
});

var paginas = [
  /*{
    seccion:"",
    paginas:[
      {name:"",href:""},
    ],
  }*/
];
var functionOnlogPage = [];

var controlTest={
  login:false,
  islog:true,
  out:true,
  pageSend:true,
};

class Pag_Base {

  constructor({success}) {

    let k = this;
    this.#IsLog({success:(i)=>{
 
      k.#BuildNav({access:i.userData.access,title:i.userData.company.name});
      if(success!=null)success(i);
    }});
  }

  #BuildNav({access=[],title="EmpresaName"}){

    //console.log(access);

    var nav = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand text-white" id="iconTittle">`+title+`</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">`;
          
          for (let scc = 0; scc < paginas.length; scc++) {

            const seccion = paginas[scc];
            nav += `
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">
                    `+seccion.seccion+`
                    </a>
                    <div class="dropdown-menu">`;

            for (let pg = 0; pg < seccion.paginas.length; pg++) {

              const pag = seccion.paginas[pg];
              var accessData = access.find(acc=>acc.value == pag.value);
              var active = accessData ? accessData.active == "true" : false;
              //console.log(pag,active);
              active=true;
              nav += `<a class="dropdown-item `+(active?"":"disabled")+`" href="`+(active?pag.href:"#")+`">`+pag.name+`</a>`;
            }

            nav += `
                    </div>
                  </li>
            `;

          }; 

    nav+=`
          </ul>
        </div>
      </nav>
    `;

    document.body.innerHTML+= nav;

  }

  #IsLog({success}){

    //is log?
    let k = this;
    $.post("../../../libs/case-1.0.1/Land/IsLog.php",{},function(resp) {

      //console.log("is log----resp:",resp);

      resp = JSON.parse(resp);
      var userData = resp;

      console.log("userData:",userData);

      //--------------------

      //--------------------

      functionOnlogPage.forEach(fct => {
    
        if(fct!=null) fct(userData);
      });

      if(success!=null)success({userData});

      /*try {
          

      } catch (error) {
          
        //console.log(error);
        k.#IsLog_Fail({error});
      }*/
    }); 

  }

  #IsLog_Fail({error}){

    if(controlTest.out) alert("error no found user, error:",error);
    else window.location.href = "login.php";
  }

}

//pass to other page with data
function PageSend({url=null, send={}}){

  window.location.href = url;
  var from = window.location.href;
  send.from = from;
  sessionStorage.setItem("data", JSON.stringify(send));
}

//recive data from other page
function PageRecive(){

  var data = JSON.parse(sessionStorage.getItem('data'));
  sessionStorage.setItem("data", null);
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
            {db:"lip_dv",table:"companies",field:"NAME",as:"COMPANY_NAME"},
            {db:"lip_dv",table:"companies",field:"RUC",as:"COMPANY_RUC"},
            {db:"lip_dv",table:"companies",field:"NAME_REAL",as:"COMPANY_NAME_REAL"},   
            {db:"lip_dv",table:"companies",field:"TELF",as:"COMPANY_TELF"},    
            {db:"lip_dv",table:"companies",field:"DIRECCION",as:"COMPANY_DIRECCION"},        
            {db:"lip_dv",table:"companies",field:"EMAIL",as:"COMPANY_EMAIL"},
            {db:"lip_dv",table:"companies",field:"ACTIVE",as:"COMPANY_ACTIVE"},
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

              console.log(result);

              var userData = {
                id:result[0]["IS_USER"],
                name:result[0]["USER_NAME"],

                company:{
                  id:result[0]["COMPANY_ID"],
                  name:result[0]["COMPANY_NAME"],
                  ruc:result[0]["COMPANY_RUC"],
                  telf:result[0]["COMPANY_TELF"],
                  nameReal:result[0]["COMPANY_NAME_REAL"],
                  email:result[0]["COMPANY_EMAIL"],
                  direccion:result[0]["COMPANY_DIRECCION"],
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
                    var show = op_access.find(acc=>acc.value==value).show;
                    var active = rst["ACTIVE"] == "1";

                    userData.access.push({value,show,active});
                  });


                  $.post("../../../libs/case-1.0.1/Land/setLogin.php",{userData},function(resp) {
                  
                    if(controlTest.login) return;
                    
                    PageSend({
                        url:"sales_control.php",
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