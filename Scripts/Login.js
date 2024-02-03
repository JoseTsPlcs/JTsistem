
$(document).ready(function() {

  var lg = new UserLog();
  const scn = new ScreenLoad({parent:document.body,show:false});
  const admin = false;

  const conteiner = new Grid({
    cols:[[12]],
    attributes:[
      {x:0,y:0,attributes:[
        {name:'class',value:'border border-secondary d-flex align-items-center justify-content-center'},
        {name:'style',value: `min-height:50%; width:50%; position:fixed;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);transform: translate(-50%, -50%);`},
      ]},
    ],
  });

  var g = new Grid({

    parent: conteiner.GetColData({x:0,y:0}).col,
    cols:[[12],[12],[12],[12]],
    attributes:[
      {x:0,y:3,attributes:[{name:'class',value:'d-flex justify-content-center'}]}
    ],
    boxs:[
      {x:0,y:0,box:{tipe:0,class:'text-center h1',default:'LOGIN SISTEM QK'}},
      {x:0,y:3,box:{tipe:5,value:'login',class:'btn btn-primary mt-1',update:()=>{LogIn()}}}
    ],
    labels:[
      {x:0,y:1,name:'usuario',box:{tipe:1,class:'w-100',default:(admin?'ALONSO':'')}},
      {x:0,y:2,name:'contraseña',box:{tipe:1,type:'password',class:'w-100',default:(admin?'QKALONSO2020':''),attributes:[{name:'type',value:'password'}]}},
    ],
  });

  function LogIn() {

    const uss = g.GetColData({x:0,y:1}).labels[0].GetBox().GetValue();
    const pss = g.GetColData({x:0,y:2}).labels[0].GetBox().GetValue();

    scn.SetState({state:true});
    lg.LogIn({
      user:uss,
      password:pss,
      log:true,
      success:function(resp) {

        //console.log(resp);
        lg.IsLog({

          log:true,
          success:function({pages=[]}) {

            scn.SetState({state:false});

            if(pages.length>0){

              var pg_mn = pages.find(pg=>pg.PAG_DETERM == '1');
              if(pg_mn == null) pg_mn = pages[0];

              var pg_mn_data = paginas.find(pg=>pg.value == pg_mn.PAG_ID);
              //console.log(pg_mn_data);

              window.location.href = pg_mn_data.php + ".php";


            }else alert('this user dont have pages');

            
            //if(pg_mn) 
          }
        });
      },
      error:()=>{

        scn.SetState({state:false});
        alert('usuario o contraseñas incorrectas');
      }
    });

  }


});
