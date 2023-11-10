
class Window {

  Get_Parent(){

    return this.#body.Get_Parent();
  }
  #title = 'Modulo';
  Get_Title(){

    return this.#title;
  }

  #prnt = {
    grid:null,
    show:true,
  }
  #body = {
    grid: null,
    show:true,
  };
  #conteiner = null;

  #events = [];
  Event_Action({event_name=null,event_params=null}){

    const evnt = this.#events.find(e=>e.name == event_name);
    if(evnt !=null){

      if(evnt.action !=null){

        evnt.action({name:event_name, params:{...event_params, k:this}});

      }else console.log("error in modulo  -> event " + event_name + " action is null", evnt);

    }else console.log("error in modulo -> event " + event_name + " is no found", evnt, this.#events);
  }

  constructor(i){
    
    if(i.events != null) this.#events = i.events;
    if(i.title) this.#title = i.title;

    this.#Build(i);
  }

  #Build({parent=null, tools=[], grid={}, hsz=3}){
    
    let k = this;

    //build parent
    this.#prnt.grid = new Grid({
      parent:parent,
      cols:[[12]],
    })

    //build head - body
   this.#body.grid = new Grid({
    parent:this.#prnt.grid.GetColData({y:0,x:0}).col,
    cols:[[12],[12]],
    attributes:[
      {y:0,x:0,attributes:[{name:'class',value:'border border-secondary h' + hsz +' text-center'},{name:'style',value:'min-height:50px'}]},
      {y:1,x:0,attributes:[{name:'class',value:'border-right border-left border-bottom border-secondary '}/*,{name:'style',value:'min-height:350px'}*/]},
    ],
   });
   const body_title = this.#body.grid.GetColData({x:0,y:0}).col;
   body_title.innerHTML = this.Get_Title();

   //build the conteiner
   this.#conteiner = new Grid({
    parent: this.#body.grid.GetColData({x:0,y:1}).col,
    ...grid,
   });
   
  }

  Conteiner_GetColData({x=null,y=null}){
    
    return this.#conteiner.GetColData({x:x,y:y});
  }

  Conteiner_GetAllBoxes(){

    return this.#conteiner.GetAllBoxes();
  }

  #Body_SetState({show=false,slow=false}){

    const dom = this.#body.grid.Get_Parent();
    const slw = slow ? 'slow': null;
    this.#body.show = show;

    if(this.#body.show) $('#'+dom.id).show(slw);
    else $('#'+dom.id).hide(slw);
    
  }

  #Body_ToggleState(){

    this.#Body_SetState({show:!this.#body.show, slow:true});
  }

  Show({show=true,slow=false}){

    this.#prnt.show = show;
    const body = this.#prnt.grid.Get_Parent();
    const sw = slow ? 'slow' : null;
    if(show) $('#'+body.id).show(sw);
    else  $('#'+body.id).hide(sw);
  }

}
