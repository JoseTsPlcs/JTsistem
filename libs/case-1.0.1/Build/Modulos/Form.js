
class Form extends ODD {

    constructor(i){

        super(i);
        this.#SetVariables(i);
        this.#Build(i);
        this.CallEvent({name:"builded"});
    }

    /*{
        name:"toolName",
        x:0,y:0,
        box:{}
    }*/

    #SetVariables({tools=[],toolsPositions=[],fields=[],questions=[]}){

        let k = this;
        this.ToolsSet({tools,toolsPositions});
        this._Fields_Set({fields});
        
    }

    //tools

    #tools=[];
    ToolsSet({tools=[]}){

        if(this.#builded){

            this.#tools.forEach(tdata=>{

                var tset = tools.find(tset=>tset.name==tdata.name);

                if(tset && tset.show == true) tdata.dom.Show();
                else tdata.dom.Hide();
                
                if(tset && tset.value !=null) tdata.dom.SetValue(tset.value);
            });
        }
        else
        {
            
    
            this.#tools=tools;
            let k = this;
            for (let t = 0; t < this.#tools.length; t++) {
    
                let tool = this.#tools[t];                
                if(tool.active == null) tool.active = true;  
                tool.box.id = "btn" + (t+1);
                var update = tool.box.update;
                var pst = this.#Tool_GetPosition({positionName:tool.position});
                tool.index = pst.count;
                pst.count++;
                tool.x = pst.x;
                tool.y = pst.y;
    
                tool.box.update = (value)=>{
    
                    if(update!=null) update({tool,value});
                    k.#Event_ToolUpdate({tool,value});
    
                    
                }
            }
        }

    }
    Tools_Get(){return this.#tools};

    Tool_Get({toolName}){

        var toolInfo = this.#tools.find(t=>t.name==toolName);
        if(toolInfo == null) console.log("tool no found toolName:",toolName,"tools:",this.#tools);
        
        return toolInfo;
    }

    #Tool_GetPosition({positionName}){

        var pst = this.#positions.find(p=>p.name==positionName);
        if(pst != null) return pst;
        else return {name:"default",x:0,y:0,count:0};
    }
    toolSet({toolName,show=true,active=true,value}){

        var tool = this.Tool_Get({toolName});
        var box = tool.dom;

        if(show) box.Show();
        else box.Hide();
        tool.show = show;
        if(active!=null) tool.active = active;
        if(value !=null) box.SetValue(value);
    }
    ToolGetBox({toolName}){

        var tool = this.Tool_Get({toolName});
        return this.#wn_parent.Conteiner_GetColData({x:tool.x,y:tool.y}).boxs[tool.index];
    }
    toolGetValue({toolName}){

        var box = this.ToolGetBox({toolName});
        return box.GetValue();
    }
    toolGetTutorialElement({toolName,recordName}){

        var tool = this.Tool_Get({toolName});
        return {
            id:this.ToolGetBox({toolName}).Blocks_Get()[0].id,
            descripcion:TutorialDescripcion({
                boxTipe:tool.box.tipe,
                fieldName:("para " + tool.descripcion),
                recordName,
            }),
        };
    }
    

    //

    #fields=[];
    _Fields_Set({fields=[]}){

        fields = fields.filter(f=>f!=null);
        fields.forEach(fld => {
            
            if(fld.title == null) fld.title = fld.name;
        });
        this.#fields=fields;
    }
    Fields_Get(){return this.#fields};

    Field_Get({fieldName}){

        return this.#fields.find(f=>f.name==fieldName);
    }

    Field_GetBox({fieldName}){

        var field = this.Field_Get({fieldName});
        return this.#gr_content.GetColData({x:field.x,y:field.y}).labels[0].GetBox();
    }
    FiledGetLabel({fieldName}){

        return this.#gr_content.GetLabel({name:fieldName});
    }
    fieldGetTutorialDom({fieldName}){

        return this.FiledGetLabel({fieldName}).parentGet();
    }
    fieldGetTutorialElement({fieldName,recordName}){
        
        var dom = this.fieldGetTutorialDom({fieldName});
        var field = this.Field_Get({fieldName});

        return {
            id:dom.id,
            descripcion:TutorialDescripcion({
                recordName,
                fieldName,
                descripcion:field.descripcion,
                boxTipe:field.box.tipe,
            }),
        }
    }

    //

    #positions = [
        {name:"head-left",count:0,x:0,y:0},
        {name:"head-center",count:0,x:1,y:0},
        {name:"head-rigth",count:0,x:2,y:0},
        {name:"botton-left",count:0,x:0,y:2},
        {name:"botton-center",count:0,x:1,y:2},
        {name:"botton-rigth",count:0,x:2,y:2},
    ];
    #wn_parent=null;
    #dom_conteiner = null;
    #gr_content=null;
    #builded = false;
    #Build({parent,title,head,blocked,show,toolsPositions=[]}){

        let k = this;

        this.#wn_parent = new Window({
            parent,h:0,
            title,head,blocked,show,
            grid:{
                cols:[
                    [2,8,2],//top
                    [12],//conteiner
                    [1,10,1],//botton
                ],
                boxs:this.#tools,
                attributes:[
                    {y:0,x:0,attributes:[{name:"class",value:"d-flex justify-content-start"}]},
                    {y:0,x:1,attributes:[{name:"class",value:"d-flex justify-content-center"}]},
                    {y:0,x:2,attributes:[{name:"class",value:"d-flex justify-content-end"}]},
                    {y:0,attributes:[{name:"class",value:"border-secondary border-border-bottom"}]},

                    
                    {y:2,attributes:[{name:"class",value:"border-secondary border-top"}]},
                    {y:2,x:0,attributes:[{name:"class",value:"d-flex justify-content-start"}]},
                    {y:2,x:1,attributes:[{name:"class",value:"d-flex justify-content-center"}]},
                    {y:2,x:2,attributes:[{name:"class",value:"d-flex justify-content-end"}]},
                ],
            }
        });
        this.#dom_conteiner = this.#wn_parent.Conteiner_GetColData({x:0,y:1}).col;

        this.#positions.forEach(pst => {
            
            var colData = this.#wn_parent.Conteiner_GetColData({x:pst.x,y:pst.y});
            var toolsInCol = this.#tools.filter(tf=>tf.x==pst.x&&tf.y==pst.y);

            for (let t = 0; t < toolsInCol.length; t++) {

                var box = colData.boxs[t];
                var tool= toolsInCol[t];
                tool.dom = box;
            }

        });

        

        var config = GetGridConfig({panels:this.#fields});
        //console.log("gridConfigConteiner", config);
        
        this.#gr_content = new Grid({
            parent:this.#dom_conteiner,
            ...config,
            events:[
                {
                    name:"labelUpdate",
                    actions:[{action:(value)=>{k.#Event_FieldUpdate(value);}}],
                }
            ],
        });

        toolsPositions.forEach(t => {
            
            if(t.show != null) this.toolSet({toolName:t.name,show:t.show});
        });
        this.#tools.forEach(tool => {if(tool.show!=true)tool.dom.Hide()});

        this.#builded = true;
    }

    ContentGridGet(){

        return this.#gr_content;
    }

    ParentWindowGet(){

        return this.#wn_parent;
    }

    #Event_ToolUpdate(params){

        this.CallEvent({name:"toolUpdate",params});
    }

    #Event_FieldUpdate(params){

        //console.log("from label update",params);
        this.CallEvent({name:"fieldUpdate",params:{...params}});
    }
}