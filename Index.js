
$(document).ready(function() {

    document.body.innerHTML +=`
    <div class="container d-flex justify-content-center align-items-center" style="height: 100vh">
      <div class="p-3" id="div-center-login" style="border: 2px solid #000;">
          <!-- Contenido del div -->
      </div>
    </div>
  
    `;
  
    var gr = new Grid({
      parent:document.getElementById("div-center-login"),
      cols:[[12],[12],[12],[12]],
      boxs:[
        {x:0,y:0,box:{tipe:0,value:"JTSISTEM",class:"h1 w-100 p-0 my-2 text-center"}},
        {x:0,y:3,box:{tipe:5,value:"login",class:"btn btn-primary w-100",update:()=>{StartLogin()}}},
      ],
      labels:[
        {x:0,y:1,name:"usuario",box:{tipe:1,class:"my-1 w-100 text-center",value:""}},
        {x:0,y:2,name:"contraseña",box:{tipe:1,class:"my-1 w-100 text-center",value:"",attributes:[{name:"type",value:"password"}]}},
      ],
    });
  
    var scrn = new LoadingScreen({
      parent:document.body,
      active:false, 
    });
  
    function StartLogin() {
      
      var uss = gr.GetColData({x:0,y:1}).labels[0].GetBox().GetValue();
      var pss = gr.GetColData({x:0,y:2}).labels[0].GetBox().GetValue();
  
      scrn.SetActive({active:true});
  
      Login({
        uss,pss,
        success:({result})=>{
  
          console.log("login!!");
          scrn.SetActive({active:false});
        },
        fail:()=>{
  
          alert("error en el usuario o contraseña");
          scrn.SetActive({active:false});
        }
      })
  
    }
    
  
  });
  