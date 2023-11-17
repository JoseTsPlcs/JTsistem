
class Loads extends Load {

    constructor(i){

        super(i);
    }

    #loads = [];
    loadsGet(){return this.#loads}
    #count=0;

    Load({loads=[]}){

        let k = this;

        this.#loads=[];
        //push load forarch loads
        for (let i = 0; i < loads.length; i++) {

            const ld = loads[i];
            var ldnw = new Load({
                ...ld,
                action:()=>{
                    
                },
            });
            this.#loads.push(ldnw);

            ldnw.Load({...ld});
        }

        //super.Load({});
    }

    #OneLoaded({index=null,load=null}){



    }

}