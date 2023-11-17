
class Form_Body {

  #modulo = null;
  #filter = null;

  /*
  this is the html of form body
  */
  

  constructor(i){

    this.#Build(i);
  }

  #Build({parent=null, title='form body', grid={}, filters={},h_min=350,actions=[]}){

    function ActionPlay({event_name=null, event_params=null}) {
      
      actions.forEach(act => {
        
        
        if(act.name == event_name && act.action != null) act.action(event_params);

      });

    }

    this.#modulo = new Modulo({
      parent:parent,
      title:title,
      h_min:h_min,
      grid:grid,
      tools:[
        {name:'filter',x:0,y:1,box:{tipe:5,value:icons.settings,class:'btn btn-outline-primary btn-sm'}, action:(i)=>{i.params.m.Config_Toggle();ActionPlay({event_name:'filter',event_params:i})}},
        {name:'load',x:0,y:1,box:{tipe:5,value:icons.load,class:'btn btn-outline-primary btn-sm'}, action:(i)=>{ActionPlay({event_name:'load',event_params:i})}},

        {name:'sizes',x:0,y:3,box:{tipe:3,value:1,options:[{value:1,show:'1'},{value:10,show:'10'},{value:25,show:'25'},{value:999,show:'999'},]}, action:(i)=>{ActionPlay({event_name:'sizes',event_params:i})}},

        {name:'reload',x:1,y:3,box:{tipe:5,value:'recargar',class:'btn btn-outline-primary btn-sm'}, action:(i)=>{ActionPlay({event_name:'reload',event_params:i})}},
        {name:'save',x:1,y:3,box:{tipe:5,value:'guardar',class:'btn btn-outline-primary btn-sm'}, action:(i)=>{ActionPlay({event_name:'save',event_params:i})}},
        {name:'new',x:1,y:3,box:{tipe:5,value:'nuevo',class:'btn btn-outline-primary btn-sm'}, action:(i)=>{ActionPlay({event_name:'new',event_params:i})}},
        {name:'delete',x:1,y:3,box:{tipe:5,value:'borrar',class:'btn btn-outline-danger btn-sm'}, action:(i)=>{ActionPlay({event_name:'delete',event_params:i})}},
        {name:'add',x:1,y:3,box:{tipe:5,value:'añadir',class:'btn btn-outline-primary btn-sm'}, action:(i)=>{ActionPlay({event_name:'add',event_params:i})}},
        {name:'cancel',x:1,y:3,box:{tipe:5,value:'cancelar',class:'btn btn-outline-danger btn-sm'}, action:(i)=>{ActionPlay({event_name:'cancel',event_params:i})}},

        {name:'page_back',x:2,y:3,box:{tipe:5,value:'<',class:'btn btn-outline-primary btn-sm'}, action:(i)=>{ActionPlay({event_name:'page_back',event_params:i})}},
        {name:'pages',x:2,y:3,box:{tipe:3,value:1,options:[{value:1,show:'pag1'},{value:2,show:'pag2'},{value:3,show:'pag3'},]}, action:(i)=>{ActionPlay({event_name:'pages',event_params:i})}},
        {name:'page_next',x:2,y:3,box:{tipe:5,value:'>',class:'btn btn-outline-primary btn-sm'}, action:(i)=>{ActionPlay({event_name:'page_next',event_params:i})}},
      ],
    })

    this.LoadScreen_Build();
    this.LoadScreen_SetState({show:false});

    this.#filter = new Modulo({
      parent:this.#modulo.Window_GetColData({x:0,y:0}).col,
      h_min:0,
      title:'filter',
      grid:filters,
      tools:[
        {name:'reload',x:1,y:3,box:{tipe:5,value:'recargar',class:'btn btn-outline-primary btn-sm'}, action:(i)=>{ActionPlay({event_name:'reload',event_params:i})}},
        {name:'clear',x:1,y:3,box:{tipe:5,value:'limpiar',class:'btn btn-outline-danger btn-sm'}, action:(i)=>{
          
          const boxs = i.params.m.Conteiner_GetAllBoxes();
          boxs.forEach(bx => {
            
            bx.SetDefault();
          });
        }},
      ],
    });
  }

  Modulo_GetTitle(){
    return this.#modulo.Window_GetTitle();
  }

  Modulo_GetColData(i){

    return this.#modulo.Window_GetColData(i);
  }

  Modulo_GetTool(i){

    return this.#modulo.Tool_GetBox(i);
  }

  SetConfigTools({tools=[]}){
    
    tools.forEach(t => {
      
      this.SetConfigTool({config:t});
    });
  }

  SetConfigTool({config}){

    const toolbox =  this.Modulo_GetTool({...config});
    if(toolbox){

        if(config.show) toolbox.Show();
        else toolbox.Hide();

        if(config.value) toolbox.SetValue(config.value);
    }
  }

  Filter_GetCol_Data(i){

    return this.#filter.Conteiner_GetColData(i);
  }

  Pages_Next({add=1}){

    var box = this.Modulo_GetTool({name:'pages'});
    if(add>0) box.NextOption();
    else if(add!=0) box.BackOption();
  }

  //---------loadScreen-------------

  #loadscreen = {
    dom:null,
    show:false,
  }

  LoadScreen_Build(){

    const col_data = this.#modulo.Window_GetColData({x:0,y:2});
    if(col_data!=null){

      const sc_3 = document.createElement('div');
      sc_3.setAttribute('class','conteiner');
      sc_3.setAttribute('id',col_data.col.id + '_loading');
      col_data.col.appendChild(sc_3);

      const sc_0 = document.createElement('div');
      sc_0.setAttribute('class','d-flex justify-content-center align-items-center');
      sc_0.setAttribute('style',`
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: 50% 50% no-repeat rgb(249,249,249);
      opacity: .8;`
      );
      sc_3.appendChild(sc_0);

      const sc_1 = document.createElement('div');
      sc_1.setAttribute('class','spinner-border');
      sc_1.setAttribute('role','status');
      sc_0.appendChild(sc_1);

      const sc_2 = document.createElement('div');
      sc_2.setAttribute('class','sr-only');
      sc_2.innerHTML = 'Loading...';
      sc_1.appendChild(sc_2);

      this.#loadscreen.dom = sc_3;

      /*<div class="d-flex justify-content-center">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>*/
    }
  }

  LoadScreen_SetState({show=true}){

    //console.log("loadscreen", show);
    this.#loadscreen.show = show;
    if(this.#loadscreen.show) $('#' + this.#loadscreen.dom.id).show();
    else $('#' + this.#loadscreen.dom.id).hide();

  }

  Show(i){

    this.#modulo.Show(i);
  } 

}
