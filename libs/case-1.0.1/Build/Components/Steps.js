
class Steps extends ODD {

    constructor(i){

        super(i);

        this._SetVariables(i);
        this.#Build(i);
    }

    

    //set variables

    _SetVariables({steps}){

        this.#SetSteps({steps});
    }

    //-------------steps

    /*[
        {
            name:"step1",
            window:{},
        }
    ],*/
    
    #stepIndex=0;
    #stepsConteinerGrid=null;
    #steps = [
        {
            name:"step1",
            conteinerDom:null,
            window:null,
            stepButton:null,
        }
    ];

    #SetSteps({steps=[],stepIndex=0}){

        steps = steps.filter(stp=>stp!=null);
        var v_steps = steps.map((step)=>{

            return {
                name:step.name,
                varWindow:step.window,
                conteinerDom:null,
                window:null,
                stepButton:null,
            }
        });

        this.#steps = v_steps;
        this.#stepIndex=stepIndex;
    }

    //build

    #Build({parent,stepName}){

        //build header, conteiners and steps in conteiners and window
        var stepsWindowsCols = this.#steps.map((step)=>{return [12];});
        var x=0;
        var stepsWindowsAttrb = this.#steps.map((step)=>{
            x++;
            return {x:x-1,y:1,attributes:[{name:"class",value:"border"}]};
        });

        //console.log(stepsWindowsCols,stepsWindowsAttrb);

        this.#stepsConteinerGrid = new Grid({
            parent,
            cols:[[12],stepsWindowsCols],
            attributes:[
                {x:0,y:0,attributes:[{name:"class",value:"border border-dark p-1 bg-white"}]},
                ...stepsWindowsAttrb,
            ],
        });
        for (let st = 0; st < this.#steps.length; st++) {

            var step = this.#steps[st];
            step.conteinerDom = this.#stepsConteinerGrid.GetColData({x:st,y:1}).col;
            step.window = new Window({
                parent:step.conteinerDom,
                title:step.name,
                h:300,
                ...step.varWindow,
            });
        }

        //build buttons in bar
        var bar  = this.#stepsConteinerGrid.GetColData({x:0,y:0}).col;

        for (let st = 0; st < this.#steps.length; st++) {

            var step = this.#steps[st];
            //console.log("build button index:"+st);
            step.stepButton = new Box({
                id:"button"+st,
                parent:bar,
                value:step.name,
                tipe:5,
                class:"btn btn-outline-primary btn-sm",
                update:()=>{

                    this.SetStepIndex({stepIndex:st});
                }
            });
        }
        
        this.SetStepIndex({stepIndex:0,stepName});
    }

    //functions

    SetStepIndex({stepIndex=0,stepName}){

        if(stepName!=null) stepIndex = this.#steps.findIndex(stp=>stp.name==stepName);

        this.#stepIndex=stepIndex;
        //console.log("stepIndex",this.#stepIndex,stepName);

        for (let st = 0; st < this.#steps.length; st++) {

            var step = this.#steps[st];
            var show = this.#stepIndex == st;
            var dom = step.conteinerDom;
            
            if(show) $("#"+dom.id).show();
            else $("#"+dom.id).hide();
        }
    }

    GetStep({stepIndex=0,stepName}){

        if(stepName!=null) stepIndex = this.#steps.findIndex(stp=>stp.name==stepName);

        return this.#steps[stepIndex];
    }
}