

class Modulo {

  #window = null;
  #conteiner = null;
  #config = {
    dom:null,
    show:true,
  }

  constructor(i){

    this.#Build(i);
  }

  #tools = null;
  #Build({parent=null,grid={},tools=[],title='modulo',h_min=350, hsz=3}){

    let k = this;

    const tools_boxs = [];
    const tools_events = [];
    var tools_count = [];

    this.#tools = tools;
    this.#tools.forEach(t => {

      //get box index
      const tool_count_found = tools_count.find(c=>c.x== t.x && c.y==t.y);
      if(tool_count_found != null) tool_count_found.count ++;
      else tools_count.push({x:t.x,y:t.y, count:1});

      //set box index
      t.box_index = tools_count.find(c=>c.x== t.x && c.y==t.y).count - 1;

      tools_boxs.push({
        x:t.x,
        y:t.y,
        box:{
          update:(i)=> {

            if(k.#window!=null) k.#window.Event_Action({event_name:t.name,event_params:{m:k}});
          },
          ...t.box,
        },
      });
      tools_events.push({
        name:t.name,
        action:(i)=>t.action(i),
      });
    });

    //window
    this.#window = new Window({
      parent:parent,
      hsz:hsz,
      title:title,
      grid:{
        cols:[
          /*0*/[12],//config
          /*1*/[4,4,4],//headers
          /*2*/[12],//body
          /*3*/[6,12,6],//footers
        ],
        attributes:[
          {y:0,x:0,attributes:[{name:'class',value:'border-bottom border-secondary m-0 p-0'},{name:'style',value:'min-height:150px'}]},

          {y:1,attributes:[{name:'class',value:'border-bottom border-secondary d-flex align-items-center'},{name:'style',value:'min-height:50px'}]},
          {y:1,x:0,attributes:[{name:'class',value:'d-flex justify-content-start'}]},
          {y:1,x:1,attributes:[{name:'class',value:'d-flex justify-content-center'}]},
          {y:1,x:2,attributes:[{name:'class',value:'d-flex justify-content-end'}]},

          {y:2,attributes:[{name:'class',value:'p-1 border-bottom border-secondary'},{name:'style',value:'min-height:' + h_min +'px'}]},

          {y:3,attributes:[{name:'class',value:' d-flex flex-row'},{name:'style',value:'min-height:20px'}]},
          {y:3,x:0,attributes:[{name:'class',value:'order-2 order-md-1 p-1 col-md-4 d-flex justify-content-center justify-content-md-start'}]},
          {y:3,x:1,attributes:[{name:'class',value:'order-1 order-md-2 p-1 col-md-4 d-flex justify-content-center justify-content-md-center flex-column flex-md-row'}]},
          {y:3,x:2,attributes:[{name:'class',value:'order-3 order-md-3 p-1 col-md-4 d-flex justify-content-center justify-content-md-end'}]},
        ],
        boxs:tools_boxs,
      },
      events:tools_events,
    });

    //config
    this.#config.dom = this.#window.Conteiner_GetColData({x:0,y:0}).col;
    this.#Config_SetState({show:false,slow:false});

    //conteiner
    this.#conteiner=new Grid({
      parent:this.#window.Conteiner_GetColData({x:0,y:2}).col,
      ...grid,
    });
    
  }
  
  #Config_SetState({show=true,slow=false}){

    this.#config.show = show;
    const slw = slow ? 'slow' : null;
    if(this.#config.show) $('#'+this.#config.dom.id).show(slw);
    else $('#'+this.#config.dom.id).hide(slw);
  }

  Config_Toggle(){

    this.#Config_SetState({show:!this.#config.show,slow:true});
  }

  Window_GetColData(i){
    
    return this.#window.Conteiner_GetColData(i);
  }

  Window_GetTitle(){
    return this.#window.Get_Title();
  }

  Conteiner_Grid({}={}){

    return this.#conteiner;
  }

  Conteiner_GetColData(i){

    return this.#conteiner.GetColData(i);
  }

  Conteiner_GetAllBoxes(i){

    return this.#conteiner.GetAllBoxes(i);
  }

  Tool_GetBox({x=null,y=null,box_index=null, name=null}){

    if(name !=null){

      const t = this.#tools.find(t=>t.name == name);
      if(t!=null){

        x=t.x;
        y=t.y;
        box_index=t.box_index;
      }else{

        if(x==null||y==null||box_index==null) console.error('error no found name', name, this.#tools);
      }
    }

    const col_data = this.#window.Conteiner_GetColData({x:x,y:y});
    if(col_data==null){

      console.error("error no found col data in{x:"+x+",y:"+y+"}", col_data);
      return;
    }

    const bx_mx = col_data.boxs.lenght;
    if(box_index == null || box_index < bx_mx){
      console.error("error box_index: " + box_index + " < " + bx_mx, col_data);
      return;
    }

    return col_data.boxs[box_index];
  }

  Tool_SetValue({x=null,y=null,box_index=null,value=null}){

    const box = this.Tool_GetBox({x:x,y:y,box_index:box_index});
    if(box == null){
      console.log("error no found box",x,y,box);
      return;
    }

    box.SetValue(value);
  }

  Tool_GetValue({x=null,y=null,box_index=null}){

    const box = this.Tool_GetBox({x:x,y:y,box_index:box_index});
    if(box == null){
      console.log("error no found box",x,y,box);
      return;
    }

    return box.GetValue();
  }

  Tool_SetOptions({x=null,y=null,box_index=null,options=null}){

    const box = this.Tool_GetBox({x:x,y:y,box_index:box_index});
    if(box == null){
      console.log("error no found box",x,y,box);
      return;
    }

    box.SetOptions(options);
  }

  Tool_NextOption({x=null,y=null,box_index=null}){
    const box = this.Tool_GetBox({x:x,y:y,box_index:box_index});
    if(box == null){
      console.log("error no found box",x,y,box);
      return;
    }

    box.NextOption();
  }

  Tool_BackOption({x=null,y=null,box_index=null}){
    const box = this.Tool_GetBox({x:x,y:y,box_index:box_index});
    if(box == null){
      console.log("error no found box",x,y,box);
      return;
    }

    box.BackOption();
  }

  Tool_Show({x=null,y=null,box_index=null}){

    const box = this.Tool_GetBox({x:x,y:y,box_index:box_index});
    if(box == null){
      console.log("error no found box",x,y,box);
      return;
    }

    box.Show();
  }

  Tool_Hide({x=null,y=null,box_index=null}){

    const box = this.Tool_GetBox({x:x,y:y,box_index:box_index});
    if(box == null){
      console.log("error no found box",x,y,box);
      return;
    }

    box.Hide();
  }

  Show(i){

    this.#window.Show(i);
  }

}
