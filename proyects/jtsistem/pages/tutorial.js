
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData,k})=>{

      pageData.body.innerHTML += `
          <div id="bodyTutorial" class="mb-3 bg-white"></div>
      `;

      var assistance = {};

      assistance.modal = new Modal({parent:pageData.body});
      assistance.form = new Form({
        title:"asistente",head:false,
        parent:assistance.modal.GetContent(),
        tools:[
          {position:"head-center",name:"title",show:true,box:{tipe:0,class:"h2",value:"asistente"}},
          {position:"head-rigth",name:"cancel",show:true,box:{tipe:5,class:"btn btn-danger",value:'<i class="bi bi-x"></i>'}},
        ],
        fields:[
          {name:"content",tipe:0,box:{tipe:0,class:"w-100 p-0 m-0"}},
        ],
        events:[{
          name:"toolUpdate",
          actions:[{
            action:({tool})=>{if(tool.name=="cancel") assistance.modal.SetActive({active:false});}
          }]
        }]
      });

      assistance.Button = document.createElement("button");
      pageData.body.appendChild(assistance.Button);
      assistance.Button.setAttribute("class","fixed-button");
      assistance.Button.innerHTML = `<i class="bi bi-question-circle"></i> Asistente`;
      assistance.Button.addEventListener('click',()=>{

        assistance.modal.SetActive({active:true});
      });

      assistance.form.Field_GetBox({fieldName:"content"}).Blocks_Get()[0].innerHTML += `
          <iframe allow="microphone;" id="dialogflow-chatbot"
          src="https://console.dialogflow.com/api-client/demo/embedded/00d92eb6-75ca-4579-b8ab-db55f9bb9b29">
          </iframe>
      `;

      function UpdateNotifications() {
        
        //console.log("trigger notifaction request");

        db_lip.Request({
          php:"row",
          sql:db_lip.GetSql_Select({
            tableMain:"notifications",
            selects:[
              {table:"notifications",field:"ID_NOTIFICATION"},
              {table:"notifications",field:"TYPE"},
              {table:"notifications",field:"MESSAGE"},
              {table:"notifications",field:"DATE_EMMIT"},
            ],
            conditions:[
              {
                table:"notifications",
                field:"ID_USER",
                inter:"=",
                value:1,//userData.id,
              }
            ],
          }),
          success:(result)=>{

            console.log("notifications:",result);
            if(result){

              result.forEach(rst => {

                var notificationId = rst["ID_NOTIFICATION"];
                if(rst["TYPE"] == "dialogflow"){

                  const data = JSON.parse(rst["MESSAGE"]);
                  rst.data = data;

                  db_lip.Request({
                    php:"success",
                    sql:db_lip.GetSql_Delete({
                      tableMain:"notifications",
                      conditions:[{
                        table:"notifications",
                        field:"ID_NOTIFICATION",
                        inter:"=",
                        value:notificationId,
                      }],
                    }),
                    success:()=>{

                      console.log("notification to play tutorial",data);

                      if(data.queryResult!=null){
    
                        var actions = data.queryResult.parameters.action;
                        var action = null;
                        var cruds = data.queryResult.parameters.crud;
                        var crud = null;

                        if(Array.isArray(actions)) action = actions[actions.length-1];
                        if(Array.isArray(cruds)) crud = cruds[cruds.length-1];
    
                        if(action && crud){
    
                          console.log("get of chat",action,crud);
                          
                          assistance.modal.SetActive({active:false});
                          PlayTutorial({nav:k,tutorialValue:crud+"-"+action});
                          
                        }
                      }
                    }
                  });                
                }                
                
              });
            }
            

          }
        });
      }

      UpdateNotifications();      
      setInterval(UpdateNotifications,1000);

      tutorialsData.forEach(t=>{ 
        if(t.access==null)t.access = true;
        else if(typeof t.access === "string") t.access = Access_Get(userData.access,t.access);
      });
      tutorialsData = tutorialsData.filter(t=>t.access==true);
      var seccions = [];
      tutorialsData.forEach(t => {
        if(!seccions.find(scc=>scc==t.seccion)) seccions.push(t.seccion);
      });

      var modCols = [];
      seccions.forEach(scc => {
        
        modCols.push([12]);
      });
      console.log("MODCOLS",modCols);
      
      var mod = new Window({
        parent:document.getElementById("bodyTutorial"),
        title:"tutoriales",h:0,
        grid:{cols:[[12]]},
      });
      var table = new Panel({
        parent:mod.Conteiner_GetColData({x:0,y:0}).col,tipe:"table",maxH:600,
        fields:[{name:"secc",title:"seccion",tipe:0,box:{tipe:0,class:"w-100 m-0 p-0"}}],
      });
      table.fieldSetValues({fieldName:"secc",values:seccions.map(scc=>{return ""})});

      for (let scc = 0; scc < seccions.length; scc++) {

        const secc = seccions[scc];
        var seccWindow = new Window({
          parent:table.fieldGetBoxes({fieldName:"secc"})[scc].Blocks_Get()[0],
          title:secc,
          cols:[[12]],
        });

        let seccTutorial = tutorialsData.filter(t=>t.seccion==secc);
        var seccTable = new Panel({
          tipe:"table",parent:seccWindow.Conteiner_GetColData({x:0,y:0}).col,
          fields:[
            {col:2,name:"start",title:"",tipe:0,box:{tipe:5,class:"btn btn-primary",value:"inciar"}},
            {col:10,name:"tutorial",title:"",tipe:0,box:{tipe:0}},
          ],
          events:[{
            name:"boxUpdate",
            actions:[{
              action:(params)=>{

                PlayTutorial({nav:k,tutorialValue:seccTutorial[params.y].value});
              }
            }]
          }]
        });

        seccTable.fieldSetValues({fieldName:"tutorial",values:seccTutorial.map(t=>{return t.name})});
        seccTable.fieldSetValues({fieldName:"start",values:seccTutorial.map(t=>{return `Iniciar <i class="bi bi-play-circle-fill"></i>`})});
      }
      

      /*var cards = new Panel({
        parent:mod.Conteiner_GetColData({x:0,y:0}).col,
        tipe:"table",title:"tutoriales",maxH:600,
        fields:[
          {col:2,name:"start",title:"",tipe:0,box:{tipe:5,class:"btn btn-primary",value:"inciar"}},
          {col:10,name:"tutorial",title:"",tipe:0,box:{tipe:0}},
        ],
        events:[
          {
            name:"boxUpdate",
            actions:[{
              action:(params)=>{

                console.log(params);
                
                PlayTutorial({nav:k,tutorialValue:tutorialsData[params.y].value});
              }
            }]
          }
        ],
      });      

      cards.fieldSetValues({fieldName:"tutorial",values:tutorialsData.map(t=>{return t.name})});
      cards.fieldSetValues({fieldName:"start",values:tutorialsData.map(t=>{return `Iniciar <i class="bi bi-play-circle-fill"></i>`})});
      */

      

      //----

      
    }
  });
  

});
