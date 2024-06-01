
class Form extends ODD {

    constructor(i){

        super(i);
        this.#SetVariables(i);
        this.#Build(i);
    }

    /*{
        name:"toolName",
        x:0,y:0,
        box:{}
    }*/

    #SetVariables({tools=[],toolsPositions=[],fields=[]}){

        let k = this;
        this._Tools_Set({tools,toolsPositions});
        this._Fields_Set({fields});
    }

    #tools=[];
    _Tools_Set({tools=[],toolsPositions=[]}){

        this.#tools=tools;
        let k = this;
        for (let t = 0; t < this.#tools.length; t++) {

            let tool = this.#tools[t];
            tool.box.id = "btn" + (t+1);
            var update = tool.box.update;
            var pst = this.#Tool_GetPosition({positionName:tool.position});
            tool.x = pst.x;
            tool.y = pst.y;

            tool.box.update = ()=>{

                if(update!=null) update({tool});
                k.#Event_ToolUpdate({tool});
            }
        }

        if(toolsPositions.length>0)console.log(toolsPositions);

        toolsPositions.forEach(toolPst => {
            
            var pst = this.#Tool_GetPosition({positionName:toolPst.position});
            var tool = this.#tools.find(t=>t.name==toolPst.name);
            tool.x = pst.x;
            tool.y = pst.y;
        });

    }
    Tools_Get(){return this.#tools};

    Tool_Get({toolName}){

        return this.#tools.find(t=>t.name==toolName);
    }

    #Tool_GetPosition({positionName}){

        var pst = this.#positions.find(p=>p.name==positionName);
        if(pst != null) return pst;
        else return {name:"default",x:0,y:0};
    }
    #Tool_SetShow({toolName,show=true}){

        var tool = this.Tool_Get({toolName});
        var box = tool.dom;

        if(show) box.Show();
        else box.Hide();

        console.log(toolName,tool,show,"box: ", box);
    }

    //

    #fields=[];
    _Fields_Set({fields=[]}){

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

    //

    #positions = [
        {name:"head-left",x:0,y:0},
        {name:"head-center",x:1,y:0},
        {name:"head-right",x:2,y:0},
        {name:"botton-left",x:0,y:2},
        {name:"botton-center",x:1,y:2},
        {name:"botton-right",x:2,y:2},
    ];
    #wn_parent=null;
    #dom_conteiner = null;
    #gr_content=null;
    #Build({parent,title,head,blocked,show,toolsPositions=[]}){

        this.#wn_parent = new Window({
            parent,h:0,
            title,head,blocked,show,
            grid:{
                cols:[
                    [4,4,4],//top
                    [12],//conteiner
                    [4,4,4],//botton
                ],
                boxs:this.#tools,
                attributes:[
                    {y:0,x:0,attributes:[{name:"class",value:"d-flex justify-content-start"}]},
                    {y:0,x:1,attributes:[{name:"class",value:"d-flex justify-content-center"}]},
                    {y:0,x:2,attributes:[{name:"class",value:"d-flex justify-content-end"}]},

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
        //console.log("form config",config,this.#dom_conteiner);
        this.#gr_content = new Grid({
            parent:this.#dom_conteiner,
            ...config
        });
        //console.log(this.#gr_content);

        toolsPositions.forEach(t => {
            
            if(t.show != null) this.#Tool_SetShow({toolName:t.name,show:t.show});
        });
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
}