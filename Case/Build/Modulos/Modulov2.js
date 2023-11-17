

class Modulov2 extends ODD {

  /*
    -------------------------------
    |            TITLE            |          
    |-----------------------------|          
    |                             |          
    |        configuration        |         
    |                             |          window(window)
    |-----------------------------|          |----------|      
    |            header           |          |   title  |      
    |-----------------------------|--------->|----------|       
    |                             |          |conteniner|------>[12]configuration
    |                             |          |----------|       [12]header
    |           conteiner         |                             [12]conteiner
    |                             |                             [12]footer
    |                             |          
    |-----------------------------|          
    |            footer           |          
    -------------------------------    
    
    configutation can hide and show
    header and footer can put tools
  */


  constructor(i){

    super(i);
  }

  #window = null;
  #conteiner = null;

  #Build({parent=null,title='modulo',tools=[]}){

    //calculate boxs and events of tools
    var tools_info = {boxs:[],events:[]};
    tools.forEach(t => {
      
      tools_info.boxs.push({x:t.x,y:t.y,box:t.box});
      tools_info.events.push({name:t.name,actions:[]});
    });

    //build window
    this.#window = new Windowv2({
      parent:parent,
      title:title,
      cols:[[12],[12],[12],[12]],
      attributes:[
        {y:0,x:0,attributes:[{name:'class',value:'border-bottom border-secondary m-0 p-0'},/*{name:'style',value:'min-height:150px'}*/]},

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
      boxs:tools_info.boxs,
      events:tools_info.events,
    });

    //set settings
    this.#settings.dom = this.#window.GetConteniner().GetColData({x:0,y:0}).col;
    this.SettingsSetState({state:false,slow:false});

  }

  #settings = {
    dom:null,
    state:true,
  };
  SettingsSetState({state=true,slow=false}){

    this.#settings.state = state;
    const slw = slow ? 'slow' : null;
    if(this.#settings.state) $('#'+this.#settings.dom.id).show(slw);
    else $('#'+this.#settings.dom.id).hide(slw);
  }

}
