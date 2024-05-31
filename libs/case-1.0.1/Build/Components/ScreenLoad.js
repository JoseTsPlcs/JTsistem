
class ScreenLoad {

    #dom = null;
    #state = false;

    constructor({parent,id,state=false}){

        this.#Build({parent:parent,id:id});
        this.SetState({state:state});
    }

    #Build({parent=null, id=''}){

        if(parent==null) parent=document.body;

        this.#dom = document.createElement("div");
        this.#dom.setAttribute("id","contenedor-carga");
        parent.appendChild(this.#dom);

        var dom1 = document.createElement("div");
        dom1.setAttribute("id","carga");
        this.#dom.appendChild(dom1);


        var dom2 = document.createElement("div");
        dom2.setAttribute("class","spinner");
        dom1.appendChild(dom2);

    }

    SetState({state=true}){

        this.#state = state;
        if(this.#state) $('#' + this.#dom.id).show();
        else $('#' + this.#dom.id).hide();
    
    }
}