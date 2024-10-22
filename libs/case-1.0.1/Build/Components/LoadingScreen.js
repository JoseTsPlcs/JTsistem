
class LoadingScreen extends ODD {

    constructor(i){

        super(i);
        this.#Build(i);
    }

    #dom = null;
    #state = true;

    #Build({parent,active=false}){

        /*<div id="contenedor-carga">
            <div id="carga">
                <div class="spinner"></div>
            </div>
        </div>*/
        //console.log("parent",parent);

        this.#dom = document.createElement("div");
        this.#dom.setAttribute("id","contenedor-carga");
        parent.appendChild(this.#dom);

        var dom1 = document.createElement("div");
        dom1.setAttribute("id","carga");
        this.#dom.appendChild(dom1);


        var dom2 = document.createElement("div");
        dom2.setAttribute("class","spinner");
        dom1.appendChild(dom2);

        this.SetActive({active});
    }

    SetActive({active=true}){

        this.#state = active;
        this.#dom.style.display = this.#state ? "block":"none";
    }
}