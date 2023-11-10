
class UserLog {

  #load = null;

  constructor({success=null}={}) {

    //first load tables
    let k = this;

    this.#load = new dataBase();

    this.#load.SetTables({tables:['usuarios','usuarios_clases','clase_paginas']});
    if(success!=null)success({loger:this});
  }

  //start the log
  LogIn({user='', password='', log=false, success=null, error=null}){

    let k = this;

    //confirm that user and password are right
    this.#load.Select_Sql({

      table_main:0,
      selects:[
        {table:0,field:0,as:'ID'},
        {table:0,field:1,as:'USER'},
      ],
      conditions:[{
        and:true,
        conditions:[
          {table:0,field:1,inter:'=',value:user},
          {table:0,field:2,inter:'=',value:password},
          {table:0,field:4,inter:'=',value:1},
        ]
      }],
      success:function(resp) {

        var exist = resp.length > 0;
        if(exist){

          //log with php
          $.post('Case/Land/setLogIn.php', {user_id: resp[0]['ID']},
          function(resp1){

            //if(log) console.log("user:" +  user + "[" +  resp[0]['ID'] +"]" + " started session:", resp1);
            if(success)success(resp1);
          });


        }else {

          //if(log) console.log("error user no find");
          if(error)error();
        }

      },
    });

  }

  //if is log enter else out
  IsLog({fail=null,success=null}){

    let k = this;

    //if session started and get id user
    $.post('Case/Land/IsLog.php', null, function(resp){

      resp = JSON.parse(resp);
      //console.log('user is log', resp);
      const user = {name:'user',id:resp};

      if(user != null && user.id != null){

        //----get information----
        //console.log('user loged --- load pages');

        //get pages
        k.#load.Select_Sql({

          log_sql:false,

          table_main:0,
          conditions:[{
            and:true,
            conditions:[
              {table:0,field:0,inter:'=',value:user.id},
            ],
          }],
          selects:[
            {table:0,field:0,as:'USER_ID'},
            {table:2,field:2,as:'PAG_ID'},
            {table:2,field:3,as:'PAG_DETERM'},
            {table:2,field:4,as:'PAG_ACESS'},
          ],
          joins:[
            {main:{table:0,field:3},join:{table:2,field:1}},//clase -> clase_paginas
          ],

          success:function(resp1) {

            //console.log("user loged -> pages:",resp1);
            if(success) success({user: user, pages: resp1});
          }
        });

      }else {

        var msg = "user no log";
        console.error(msg);
        if(fail) fail({msg:msg});
        window.location.href = 'Login.php';
        
      }

    });

  }


}
