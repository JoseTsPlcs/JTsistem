
class Panel extends ODD {

    constructor(i){

        super(i);
        this.#Build({...i});
    }

    #body=null;
    #Build({cols=[[12],[4,4,4]],axis="x"}){

        
    }
}