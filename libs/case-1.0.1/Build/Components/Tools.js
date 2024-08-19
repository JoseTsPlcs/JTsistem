class Tools extends ODD {

    constructor(i){

        super(i);
        this._className ="tools";
        //this._log = true;
        this.setVariables(i);
    }

    setVariables({tools=[],parent}){

        this.toolsSet({tools,parent});
    }

    #tools = [];
    toolSetIni({tools=[]}){

        //this.Log("set init tools",tools);

        this.#tools = tools;
    }
    toolsSet({tools=[]}){

        //console.log("tool set", tools);
        
        tools.forEach(tset => {
            
            var tfound = this.#tools.find(tf=>tf.name==tset.name);
            if(tfound){

                
                if(tset.active !=null ) tfound.active = tset.active;
                if(tset.options) tfound.box.options = tset.options;
                if(tset.box && tset.box.parent) tfound.box.parent = tset.parent;

                
                this.Log("set tool " + tset.name + " result:",tfound);
            }
            else
            {

                this.Log("no found tool " + tset.name + " tools:", this.#tools);    
            }
        });

        //this.#toolsUpdate();
    }
    toolsGet(){

        return this.#tools;
    }

    #toolsUpdate(){

        this.#tools.forEach(tool => {
            
            var box = tool.box;
            if(tool.active){
                box.Show();
                this.Log("tool " + tool.name + " se mostro");
            }
            else
            {
                box.Hide();
                this.Log("tool " + tool.name + " se oculto");
            }
            
            //this.Log("toolsUpdate " + tool.name, tool);
            
        });
    }

    init(){

        var t = 0;
        this.#tools.forEach(tool => {
            
            tool.box = new Box({
                id:"toolbox_" + t,
                instance:this._instanceName + " box of tool " + tool.name,
                log:this._log,
                ...tool.box,
            });
            t++;
        });
        this.#toolsUpdate();
    }
}