
class Load extends ODD {

    constructor(i){

        const eventsNew = [
            {name:'load',actions:[]},
            {name:'loaded',actions:[]},
        ];
        if(i.events==null) i.events = [...eventsNew];
        else i.events = [...i.events,...eventsNew];

        super(i);
    }

    #loading=true;
    loading(){return this.#loading}
    #loaded=false;
    loaded(){return this.#loaded}
    #data=null;
    data(){return this.#data};

    Load(i=null){

        this.#loading=true;
        this.#loaded=false;

        this.CallEvent({name:'load',params:{...i}});
    }

    Loaded(i=null){

        this.#data=i?i.data:null;
        this.#loading=false;
        this.#loaded=true;
        this.CallEvent({name:'loaded',params:{...i}});
    }
}