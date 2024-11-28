
class Crud_Body extends ODD {

    constructor(i){
      
      super(i);
      this._className = "crudBody";

      this.#recordNameSet(i);

      this.#statesSetVariables(i);
      this.panelsSet(i);
      this.#Build(i);

      if((i.config && i.config.show == true)||(i.configShow==true)) this.ConfigSetState({show:true});
      else this.ConfigSetState({show:false});

    }

    #recordName = "[registro]";
    #recordNameSet({recordName="registro"}){

      this.#recordName = recordName;

      this.#tools.forEach(t => {
        
        t.descripcion = this.#descriptionGet({descripcion:t.descripcion});
      });
    }
    recordNameGet(){return this.#recordName;}
    #descriptionGet({descripcion=""}){

      descripcion = descripcion.replace("[registro]",this.#recordName);
      descripcion = descripcion.replace("[registros]",this.#recordName+"s");
      return descripcion;
    }
    #loadsName = ["clientes","etiquetas","unidades"];


    //--
    #tools = [
      {position:"head-left",name:"config",descripcion:"realizar una busqueda de [registros]",box:{tipe:5,value:'<i class="bi bi-gear"></i>',class:"btn btn-primary btn"}},
      {position:"head-left",name:"load",descripcion:"cargar los datos de [registros]",box:{tipe:5,value:'<i class="bi bi-database"></i>',class:"btn btn-primary btn"}},

      {position:"head-center",name:"title",descripcion:"",box:{tipe:0,class:"h3 text-center w-100 m-0 p-0"}},

      {position:"head-rigth",name:"excel",descripcion:"descargar datos de [registros] en archivo excel",box:{id:"btn1",tipe:5,value:"excel",class:"btn btn-success btn"}},
      {position:"head-rigth",name:"tutorial",box:{id:"btn2",tipe:5,value:'<i class="bi bi-question-circle"></i>',class:"btn btn-secondary btn"}},

      {position:"botton-left",name:"sizes",descripcion:"mostrar la cantidad de [registros] que aparezcan en pantalla",box:{tipe:3,value:1,options:[{show:1,value:1},{show:10,value:10},{show:25,value:25},{show:50,value:50},{show:999,value:999}]}},

      {position:"botton-center",name:"reload",descripcion:"recargar informacion",box:{id:"btn1",tipe:5,value:"recargar",class:"btn btn-primary btn"}},
      {position:"botton-center",name:"update",descripcion:"actualizar [registro]",box:{id:"btn2",tipe:5,value:"actualizar",class:"btn btn-primary btn"}},
      {position:"botton-center",name:"new",descripcion:"crear nuevo [registro]",box:{id:"btn3",tipe:5,value:"nuevo",class:"btn btn-primary btn"}},
      {position:"botton-center",name:"insert",descripcion:"insertar nuevo [registro]",box:{id:"btn4",tipe:5,value:"insertar",class:"btn btn-primary btn"}},
      {position:"botton-center",name:"delete",descripcion:"borrar [registro]",box:{id:"btn5",tipe:5,value:"borrar",class:"btn btn-danger btn"}},
      {position:"botton-center",name:"cancel",descripcion:"cancelar",box:{id:"btn6",tipe:5,value:"cancelar",class:"btn btn-danger btn"}},
      {position:"botton-center",name:"addLine",descripcion:"xxxx",box:{id:"btn7",tipe:5,value:"añadir linea",class:"btn btn-primary btn"}},
      {position:"botton-center",name:"pdf",descripcion:"descargar datos en pdf",box:{id:"btn8",tipe:5,value:'descargar <i class="bi bi-filetype-pdf"></i>',class:"btn btn-danger btn"}},
      {position:"botton-center",name:"data",descripcion:"???",box:{id:"btn9",tipe:5,value:"data",class:"btn btn-primary btn"}},

      {position:"botton-rigth",name:"pages",descripcion:"navegar entre las páginas de [registros].",box:{tipe:3,value:1,options:[{show:"pag1",value:1}]}},
    ];
    toolsGet(){return this.#tools;}
    toolGet({toolName}){return this.#tools.find(t=>t.name==toolName);}
    toolGetBox({toolName}){return this.#bodyForm.ToolGetBox({toolName});}
    toolGetTutorialElement({toolName}){

      return this.#bodyForm.toolGetTutorialElement({toolName,recordName:this.#recordName});
    }

    #config = {
      dom:null,
      state:false,
      window:null,
      windowFilters:null,
    };
    ConfigSetState({show=true,slow}){

      this.#config.show = show;

      const sw = slow ? 'slow' : null;
      if(show) $('#'+this.#config.dom.id).show(sw);
      else  $('#'+this.#config.dom.id).hide(sw);
    }
    configGetShow(){return this.#config.show;}
    configGetWindowFilters(){return this.#config.windowFilters;}
    configGet(){return this.#config;}

    #loadingScreen = null;
    loadingScreenGet(){return this.#loadingScreen}
    LoadingScreenActive({active}){

      this.#loadingScreen.SetActive({active});
    }

    //----panels----

    #panelsGrid = null;
    #panels = [];
    panelsGet(){return this.#panels;}
    panelsSet({panels=[]}){

      panels.forEach(panel => {
        
        panel.fields.forEach(field => {
          
          field.panel = panel.name;
        });
      });
      this.#panels = panels;
      
    }
    panelGet({panelName}){return this.#panels.find(panel=>panel.build.nameGet()==panelName);}
    panelGetBuild({panelName}){

      var parentInfo = this.panelGet({panelName});
      return parentInfo.build.buildGet();
    }
    #panelsGetParent({parentName}){


    }


    fieldsGet(){

      var fields = [];
      this.#panels.forEach(panel => {
        
        panel.build.fieldsGet().forEach(field => {
          
          fields.push(field);
        });
      });
      //console.log("FIELDS GET BUY CRUDBODY",fields);
      
      return fields;
    }
    fieldGet({fieldName}){

      var fields = this.fieldsGet();
      var fieldInfo = fields.find(f=>(f.name==fieldName));
      if(fieldInfo == null) console.log("no found field: ",fieldName,"fields:",fields);
      
      return fieldInfo;
    }
    fieldSetValues({fieldName,values}){

      
      var field = this.fieldGet({fieldName});
      var panel = this.panelGet({panelName:field.panel.name});
      panel.build.fieldSetValues({fieldName,values});

      this.LogAction({
        type:"fieldSetValue",
        action:"fielSetValues",
        msg:{fieldName,values,field},
      });
    }
    fieldGetBoxes({fieldName}){

      var boxes = [];

      this.#panels.forEach(panel => {
        
        var boxesOfpanel = panel.build.fieldGetBoxes({fieldName});
        boxesOfpanel.forEach(bx=>{

          boxes.push(bx);
        })
      });

      //console.log("FIELD GET BOXES field:",fieldName,boxes);
      

      return boxes;
    }
    fieldGetValues({fieldName}){

      //console.log("FIELD GETVALUES ",fieldName);
      
      return this.fieldGetBoxes({fieldName}).map(bx=>{return bx.GetValue()});
    }
    fieldSetOptions({fieldName,options}){

      var field = this.fieldGet({fieldName});
      var panel = this.panelGet({panelName:field.panel.name});
      panel.build.fieldSetOptions({fieldName,options});

      this.LogAction({
        type:"fieldSetOptions",
        action:"field set options",
        msg:{field,options},
      });
    }
    fieldGetDomTutorial({fieldName}){

      var field = this.fieldGet({fieldName});
      var panel = this.panelGet({panelName:field.panel.name});
      return panel.build.fieldGetDomTutorial({fieldName});
    }
    fieldGetElementTutorial({fieldName,last=true}){

      var field = this.fieldGet({fieldName});
      var panel = this.panelGet({panelName:field.panel.name});
      return panel.build.fieldGetTutorialElement({fieldName,recordName:this.#recordName,last});
    }

    //-------------

    #bodyWindow = null;
    bodyWindowGet(){return this.#bodyWindow;}
    #bodyForm = null;
    bodyFormGet(){return this.#bodyForm;}
    #builded = false;
    #Build({parent,title,head,blocked,filters=[],config,tutorials}){

      let k = this;

      this.#bodyWindow = new Window({
        parent,title,head,blocked,h:0,
        grid:{
          cols:[
            [12],//config
            [12],//form
          ]
        }
      });

      var prnt_loading = this.#bodyWindow.Conteiner_Dom();
      var prnt_config = this.#bodyWindow.Conteiner_GetColData({x:0,y:0}).col;
      var prnt_form = this.#bodyWindow.Conteiner_GetColData({x:0,y:1}).col;

      //-----screen load-----
      this.#loadingScreen = new LoadingScreen({
        parent:prnt_loading,
        active:false,
      });

      //-----config-----
      this.#config.dom = prnt_config;

      this.#config.window = new Window({
        parent:prnt_config,h:0,
        title:"config",head:false,
        cols:[
          [12],//filtros
        ],
      });
      
      this.#config.windowFilters = new windowFilters({
        title:(config&&config.title!=null?config.title:"busqueda"),
        head:(config&&config.head!=null?config.head:true),
        show:(config&&config.show!=null?config.show:false),
        toolsPositions:(config&&config.toolsPositions?config.toolsPositions:[]),
        parent: this.#config.window.Conteiner_GetColData({x:0,y:0}).col,
        filters,
        events:[
          {
            name:"reload",
            actions:[{
              action:()=>{
                k.CallEvent({name:"configReload"});
              }
            }]
          },
        ],
      });      

      //-----form------

      if(tutorials!=null){

        tutorials.forEach(t => {
          
          t.show = this.#descriptionGet({descripcion:t.show});
        });
        this.#tools.find(t=>t.name=="tutorial").box.options = tutorials;
      }
      this.#bodyForm = new Form({
        title:"form del crud",head:false,h:0,
        parent: prnt_form,
        tools:this.#tools,
        fields:[
          //field Conteiner
          {name:"body-cont",tipe:0,box:{tipe:0,class:"w-100",style:('min-height:'+0+'px')}},
        ],
        events:[
          {
            name:"toolUpdate",
            actions:[{
              action:(params)=>{                

                params.k = k;

                switch(params.tool.name){
                  case"config":
                    
                    k.ConfigSetState({show:!k.#config.show,slow:true});

                  break;

                  case "addLine":

                    //if(params.tool.active == true && this.#stateData.state == "new") k.AddLine({startcount:1});
                  break;

                  case "new":

                    //k.stateSet({stateName:"new"});
                  break;

                  case "cancel":

                    //k.stateSet({stateName:k.#stateData.afterCancel});
                  break;
                }

                k.CallEvent({name:"toolUpdate",params});
              }
            }]
          }
        ],
      });

      //-----build panels----
      this.#panelsGrid = new Grid({
        parent:this.#bodyForm.Field_GetBox({fieldName:"body-cont"}).Blocks_Get()[0],
        ...GetGridConfig({panels:this.#panels}),
      });
      
      var p = 0;
      this.#panels.forEach(panel => {
        
        var panelParent = this.#panelsGrid.GetColData({x:panel.x,y:panel.y}).col;
        panel.build = new Panel({
          borderOn:false,
          parent:panelParent,
          name:"panel"+p,
          ...panel,
          events:[
            {
              name:"boxUpdate",
              actions:[{
                action:(params)=>{

                  k.CallEvent({name:"boxUpdate",params});
                }
              }]
            }
          ],
        });
        p++;

      });

      this.#builded = true;

      //this.stateSet({stateName:this.#stateData.stateStart});
    }

    AddLine({startcount}){

      this.#panels.forEach(panel => {

        var panelBuild = panel.build;
        var fieldsOfPanel = panelBuild.fieldsGet();
        
        switch (panelBuild.tipeGet()) {
            case "table":

            fieldsOfPanel.forEach(f => {
                    
                var values = panelBuild.fieldGetValues({fieldName:f.name});
                values.push(f.box.value);
                panelBuild.fieldSetValues({values,fieldName:f.name,box:f.box});
            });                   

            break;

            case "form":

            fieldsOfPanel.forEach(f => {
                
              var value = f.box.value;
              if(value == null && f.box.options != null) value = f.box.options[0].value;
              
              panel.build.fieldSetValues({values:[value],fieldName:f.name});
            });

            break;
        }
      });
    }

    Block({active}){

      this.#panels.forEach(panel => {

        var fieldsOfPanel = panel.build.fieldsGet();
        
        switch (panel.build.tipeGet()) {
            case "table":

              if(active){

                  fieldsOfPanel.forEach(f => {
                  
                    panel.build.fieldSetValues({values:[],fieldName:f.name});
                  });
              }
            break;

            case "form":

              fieldsOfPanel.forEach(f => {
                  
                panel.build.fieldSetValues({values:[f.box.value],fieldName:f.name});
                panel.build.fieldGetBoxes({fieldName:f.name}).forEach(box => {
                  
                  box.Block({active});
                });
              });
              //panel.build.buildGet().Conteiner_Show({show:active,slow:active});

            break;
        }
      });
    }

    //-----states-----

    #stateData = {
      state:"reload",
      stateStart:"reload",
      states:[
        {
          name:"reload",
          tools:[
            {name:"reload",show:true},
            {name:"sizes",show:true},
            {name:"pages",show:true},
          ],
        },
        {
          name:"new",
          tools:[
            {name:"insert",show:true},
            {name:"cancel",show:true},
            {name:"addLine",show:true},
          ],
        }
      ],
      afterCancel:"reload",
    };

    #statesSetVariables({stateStart="reload",states=[]}){

      this.#stateData.stateStart = stateStart;
      this.#stateData.states = states;
    }

    stateSet({stateName}){

      this.LogAction({type:"state",action:"stateSet",msg:{stateName}});

      var stateData = this.#stateData.states.find(st=>st.name == stateName);

      //all tools of form
      this.#bodyForm.Tools_Get().forEach(tool => {
        
        //console.log("TOOL",tool);
        
        var toolSet = {...tool,show:false};
        
        if(stateData != null){

          var toolOfStateData = stateData.tools.find(t=>t.name == tool.name);
          if(toolOfStateData != null) toolSet = {...toolOfStateData};
        }

        this.#bodyForm.toolSet({
          ...toolSet,
          toolName:toolSet.name,
        });
      });
      //console.log("state:",this.#stateData.state);
      
      this.#stateData.state = stateName;
      this.CallEvent({name:"setStateAfter",params:{stateName}});

    }

    stateGet(){return this.#stateData.state;}

    stateSetStart({}){this.stateSet({stateName:this.#stateData.stateStart});}

}

