
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
        this.#questionSet({questions});
    }

    //questions

    #questions = {
        data: [
            {value:"q1",description:"¿como usar filtro?",elementsInfo:[]},
            {value:"q2",description:"¿que significan los campos?",elementsInfo:[]},
        ],
        options:[],
        tool:{name:"quest",action:"quest",box:{value:'<i class="bi bi-question-circle"></i>',tipe:5,class:"btn btn-secondary btn-sm"}},
    }

    #questionSet({questions=[]}){

        if(questions.length>0) console.log("----------set questions in form---------------",questions);
        
        this.#questions.data.forEach(q => {
            
            var qfound = questions.find(qset=>qset.value==q.value);
            if(qfound) q.elementsInfo = qfound.elementsInfo;
        });

        if(questions.length>0) console.log("----------questions end---------------",this.#questions);

        this.#questions.options = this.#questions.data.map(q=>{return {value:q.value,show:q.description}});
    }

    #questionGet({value}){

        return this.#questions.data.find(q=>q.value==value);
    }

    #questionsSetTutorials(){
        
        var q1Elements = this.#tools.filter(t=>t.show==true && t.descripcion!=null).map(t=>{

            var box = this.ToolGetBox({toolName:t.name});
            var id = box.Blocks_Get()[0].id;
            return {id,descripcion:t.descripcion};
        });
        this.#questionSetTutorial({value:"q1",elementsInfo:q1Elements});
        
        var q2Elements = this.Fields_Get().filter(fld=>fld.descripcion!=null).map(fld => {
            
            var label = this.FiledGetLabel({fieldName:fld.name});
            return {id:label.parentGet().id,descripcion:fld.descripcion};
        });
        console.log("set tutorial q2",q2Elements);
        
        this.#questionSetTutorial({value:"q2",elementsInfo:q2Elements});
    }

    #questionSetTutorial({value,elementsInfo=[]}){

        var question = this.#questionGet({value});
        var questionElementsInfo = [...question.elementsInfo,...elementsInfo];
        if(question.elementsInfo.length>0) console.log("-------------------------------set tutorial question value: " + value, questionElementsInfo);
        
        if(question && elementsInfo.length>0) question.tutorial = new Tutorial({elementsInfo:questionElementsInfo});
    }

    #questionEvent(value){

        var question = this.#questionGet({value});
        console.log("play question " + value,question);
        if(question && question.tutorial != null){


            question.tutorial.startTutorial();
        }
        
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
            })

            tools.forEach(tset => {
                
                
            });
        }
        else
        {
            for (let t = 0; t < tools.length; t++) {

                const tool = tools[t];
                if(tool.name==this.#questions.tool.name){
    
                    this.#questions.tool.box.options = this.#questions.data.map((q)=>{return {value:q.value,show:q.description}});
                    tools[t] = {...tool,...this.#questions.tool};                
                }
            }
    
            this.#tools=tools;
            let k = this;
            for (let t = 0; t < this.#tools.length; t++) {
    
                let tool = this.#tools[t];
                //console.log(tool,t);            
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
    
                    if(tool.name == k.#questions.tool.name) k.#questionEvent(value);
                }
            }
        }

    }
    Tools_Get(){return this.#tools};

    Tool_Get({toolName}){

        return this.#tools.find(t=>t.name==toolName);
    }

    #Tool_GetPosition({positionName}){

        var pst = this.#positions.find(p=>p.name==positionName);
        if(pst != null) return pst;
        else return {name:"default",x:0,y:0,count:0};
    }
    #Tool_SetShow({toolName,show=true}){

        var tool = this.Tool_Get({toolName});
        var box = tool.dom;

        if(show) box.Show();
        else box.Hide();
        tool.show = show;

        console.log(toolName,tool,show,"box: ", box);
    }
    ToolGetBox({toolName}){

        var tool = this.Tool_Get({toolName});
        return this.#wn_parent.Conteiner_GetColData({x:tool.x,y:tool.y}).boxs[tool.index];
    }

    //

    #fields=[];
    _Fields_Set({fields=[]}){

        fields = fields.filter(f=>f!=null);
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
                    [3,6,3],//top
                    [12],//conteiner
                    [3,6,3],//botton
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
            
            if(t.show != null) this.#Tool_SetShow({toolName:t.name,show:t.show});
        });

        this.#questionsSetTutorials();
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