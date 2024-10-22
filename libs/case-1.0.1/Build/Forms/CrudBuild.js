
class CrudBuild extends ODD {

    constructor(i){

        super(i); 
        this.#layerBuild(i);
    }

    #layer = null;
    layersGet(){return this.#layer;}
    #layerBuild({layers,userData,conections}){

        this.#layer = new Layers({layers,userData,conections});
    }

    
}
