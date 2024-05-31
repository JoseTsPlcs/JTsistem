
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

    #SetVariables({tools=[]}){

        let k = this;
        this.#tools=tools;
        for (let t = 0; t < this.#tools.length; t++) {
            let tool = this.#tools[t];
            tool.id = "btn" + (t+1);
            tool.box.update = ()=>{

                k.#Event_ToolUpdate({tool});
            }
        }
    }

    #tools=[];
    #wn_parent=null;
    #dom_conteiner = null;
    #gr_content=null;
    #Build({parent,title,head,blocked,show,grid}){

        this.#wn_parent = new Window({
            parent,
            title,head,blocked,show,
            grid:{
                cols:[
                    [6,6,6],//top
                    [12],
                    [6,6,6],//botton
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

        this.#tools.forEach(tool => {
            
            var colData = this.#wn_parent.Conteiner_GetColData({x:tool.x,y:tool.y});
            var box = colData.boxs[0];
            tool.dom = box;
        });

        this.#gr_content = new Grid({
            parent:this.#dom_conteiner,
            ...grid,
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