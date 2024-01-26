
class Form extends ODD {

    /*

    --------------------------------------------------------
    |                         title                         |
    --------------------------------------------------------
    |                                                      |
    |   ------------------------------------------------   | 
    |   |                    config                    |   |
    |   ------------------------------------------------   |
    |   |                  tools head                  |   |
    |   ------------------------------------------------   |
    |   |----------------------------------------------|   |
    |   ||        window        ||        window      ||   |
    |   ||                      ||                    ||   |
    |   ||                      ||                    ||   |
    |   ||                      ||                    ||   |
    |   ||                      ||                    ||   |
    |   |----------------------------------------------|   |
    |   ||                   window                   ||   |
    |   ||                                            ||   |
    |   ||                                            ||   |
    |   ||                                            ||   |
    |   ||                                            ||   |
    |   |----------------------------------------------|   |
    |   ------------------------------------------------   |
    |   |                   tools foot                 |   |
    |   ------------------------------------------------   |
    |                                                      |
    --------------------------------------------------------

    */

    constructor(i){

        super(i);

        var i = this._General_GetParams(i);

        this.#Windows_SetParams({...i});
        this.#Tools_SetVariables({...i});

        this.#Body_Build({...i});      
        this.#Windows_Build({...i});   
        this.#Tools_Build(); 
        this.#LoadScreen_Build();

        this.Config_SetState({show:(i.configShow!=null?i.configShow:false),slow:false});

        let k = this;
        this.AddEvents({events:[
            {
                name:"configUpdate",
                actions:[
                    {
                        name:"base",
                        action:()=>{

                            k.Config_Toggle();
                        }
                    }
                ],
            }
        ]});

        if(i.loading!=null) this.LoadScreen_SetState({show:i.loading});
        else this.LoadScreen_SetState({show:false});
    }

    _General_GetParams(i){
        
        var index = 0;
        if(i.windows!=null){

            for (let w = 0; w < i.windows.length; w++) {
                var window = i.windows[w];
                
                if(window.fields!=null){

                    for (let f = 0; f < window.fields.length; f++) {
                        var field = window.fields[f];
                        
                        field.index=index;
                        field.windowIndex=w;
                        index++;
                    }
                }
                
            }
        }       

        return i;
    }

    //--------------body---------------

    #body = null;
    #Body_Build(info){
        
        //console.log("form->body_build->info:",info);
        let k = this;

        //filter params in info
        if(info.title == null) info.title = "Form";
        if(info.h ==null ) info.h = 200;

        //build window parent
        this.#body = new Window({
            parent:info.parent,
            title:info.title,
            h:info.h,
            blocked:info.blocked,
            head:info.head,
            show:info.show,
            grid:{
                cols:[
                    /*0*/[12],//config
                    /*1*/[4,4,4],//headers
                    /*2*/[12],//body
                    /*3*/[6,12,6],//footers
                  ],
                  attributes:[
                    {y:0,x:0,attributes:[{name:'class',value:'border-bottom border-secondary m-0 p-0'},{name:'style',value:'min-height:100px'}]},
          
                    {y:1,attributes:[{name:'class',value:'border-bottom border-secondary d-flex align-items-center p-1'},{name:'style',value:'min-height:20px'}]},
                    {y:1,x:0,attributes:[{name:'class',value:'d-flex justify-content-start'}]},
                    {y:1,x:1,attributes:[{name:'class',value:'d-flex justify-content-center'}]},
                    {y:1,x:2,attributes:[{name:'class',value:'d-flex justify-content-end'}]},
          
                    {y:2,attributes:[{name:'class',value:'p-0 border-bottom border-secondary'},{name:'style',value:'min-height:' + info.h +'px'}]},
          
                    {y:3,attributes:[{name:'class',value:' d-flex flex-row'},{name:'style',value:'min-height:20px'}]},
                    {y:3,x:0,attributes:[{name:'class',value:'order-2 order-md-1 p-1 col-md-4 d-flex justify-content-center justify-content-md-start'}]},
                    {y:3,x:1,attributes:[{name:'class',value:'order-1 order-md-2 p-1 col-md-4 d-flex justify-content-center justify-content-md-center flex-column flex-md-row'}]},
                    {y:3,x:2,attributes:[{name:'class',value:'order-3 order-md-3 p-1 col-md-4 d-flex justify-content-center justify-content-md-end'}]},
                  ],
            }
        });

        this.#config.dom = this.#body.Conteiner_GetColData({x:0,y:0}).col;
        this.#windows.parent = this.#body.Conteiner_GetColData({x:0,y:2}).col;
    }

    //------------config---------------

    #config={
        show:true,
        dom:null,
    };

    Config_SetState({show=true,slow=false}){

        //console.log("form->config_setstate->params; show:",show);

        this.#config.show = show;
        const slw = slow ? 'slow' : null;
        if(this.#config.show) $('#'+this.#config.dom.id).show(slw);
        else $('#'+this.#config.dom.id).hide(slw);
    }

    Config_Toggle({}={}){

        this.Config_SetState({show:!this.#config.show,slow:true});
    }

    Config_Dom({}={}){

        return this.#config.dom;
    }

    //-----------windows------------

    #windows = {
        cols:[],
        parent:null,
        grid:null,
        windows:[],
    }
    #Windows_SetParams({windows=[]}){

        let k = this;
        var gridCols = [[]];
        var x = 0;
        var y = 0;
        var rowColsLess = 12;
        var index = 0;

        windows.forEach(window => {
            
            if(window.col == null) window.col = 12;
            window.x = x;
            window.y = y;

            gridCols[y].push(window.col);

            rowColsLess -= window.col;
            x++;
            if(rowColsLess <= 0){
                x=0;
                y++;
                rowColsLess=12;
                gridCols.push([]);
            };

            window.index = index;
            index++;
        });
        gridCols.splice(gridCols.length-1,1);

        this.#windows.windows = windows.map(w=>{

            return {
                info:w,
                build:null,
            };
        });
        this.#windows.cols = gridCols;

        //console.log("set windows",this.#windows);
    }

    #Windows_Build({}={}){

        this.#windows.grid = new Grid({
            parent:this.#windows.parent,
            cols:this.#windows.cols,
        });

        let k = this;
        var index=0;
        this.#windows.windows.forEach(window => {
            
            var info = window.info;
            info.index=index;
            var parent = k.#windows.grid.GetColData({x:info.x,y:info.y}).col;

            window.build = new Window({
                parent,
               ...info,
               events:[
                {
                    name:"boxUpdate",
                    actions:[
                        {
                            name:"base of window",
                            action:(i)=>{

                                //console.log("form->event box update in window; windowIndex:",index);
                                k.CallEvent({name:"boxUpdate",params:{...i,windowIndex:index}})
                            }
                        }
                    ]
                },
               ],
            });
            index++;
        });

        //console.log("form-windows_build",this.#windows);
    }

    Window_GetWindow({windowIndex}){

        var windows = this.#windows.windows;
        var w = windows[windowIndex];
        //console.log("form-window_getwindow",windowIndex,windows,w);
        return w;
    }

    Window_GetAll(){

        return this.#windows.windows;
    }

    Window_Fields_GetBox({windowIndex,fieldName,fieldIndex}){

        var window = this.Window_GetWindow({windowIndex});
        //console.log("form->window_fields_getbox->params; windowIndex",windowIndex,"result; window:",window);
        
        var box = window.build.Fields_GetBox({fieldName,fieldIndex});
        if(box==null) console.log("form-window_fields_getbox",window);
        return box;
    }

    Window_Fields_GetValue({windowIndex,fieldName,fieldIndex}){

        var window = this.Window_GetWindow({windowIndex});
        
        return window.build.Fields_GetValue({fieldName,fieldIndex});
    }

    Window_Fields_SetValue({windowIndex,fieldName,fieldIndex,value}){

        var box = this.Window_Fields_GetBox({windowIndex,fieldName,fieldIndex});
        box.SetValue(value);
    }

    //----------------------------

    Fields_Get({fieldName,fieldIndex}){

        //console.log("form->fields_get->params; fieldName:",fieldName,"fieldIndex:",fieldIndex);

        var field = null;
        this.#windows.windows.forEach(window => {
            
            //var fields = window.build.Fields_Get();
            //field = fields.find(f=>f.name==fieldName);

            //console.log("form->fields_get->foreach windows->params; fields:",fields,"field:",field);

            var windowField = window.build.Fields_GetInfo({fieldName,fieldIndex});
            if(windowField!=null)field=windowField;

        });

        //console.log("form->fields_get->results; field:",field);
        return field;
    }

    //------------tools-----------
    #tools = { 
        builded:false,
        tools:[],
    }

    Tools_Get({}={}){

        return [...this.#tools.tools]
    }

    #Tools_SetVariables({tools=[]}){

        this.#tools.tools = tools;
    }

    #Tools_Build({}={}){

        let k = this;
        this.#tools.tools.forEach(tool => {
           
            var parent = k.#body.Conteiner_GetColData({x:tool.x,y:tool.y}).col;
            var box = {
                parent,
                id:tool.name,
                ...tool.box,
                update:(v)=>{
                    
                    var params = {value:v,tool};
                    //console.log("form-callevent","toolUpdate",params,k._events);
                    k.CallEvent({name:"toolUpdate",params});
                    k.CallEvent({name:tool.name+"Update",params});
                }
            };

            tool.build = new Box({...box});
        });        
    }

    Tools_GetBox({name}){

        var toolInfo = this.#tools.tools.find(t=>t.name==name);
        if(toolInfo == null) console.log("[form] - tools get box", "name: "+name, this.#tools.tools);
        //console.log("form, tools_getbox",name,toolInfo);
        return toolInfo.build;
    }

    //---------loadScreen-------------

    #loadscreen = {
        dom:null,
        show:false,
    }

    #LoadScreen_Build({}={}){

        const col_data = this.#body.Conteiner_Dom();
        if(col_data!=null){

        const sc_3 = document.createElement('div');
        sc_3.setAttribute('class','conteiner');
        sc_3.setAttribute('id',col_data.id + '_loading');
        col_data.appendChild(sc_3);

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
        if(show) $('#' + this.#loadscreen.dom.id).show();
        else $('#' + this.#loadscreen.dom.id).hide();

    } 

}