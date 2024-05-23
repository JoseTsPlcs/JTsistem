
class LoadsList extends ODD {

    constructor(i){

        super(i);
    }

    #load=false;
    #loading=false;
    #total=0;
    #count=0;
    #loads = [
        {
            name:'load1',
            action:(success)=>{},
        }
    ];
    #SetValues({loads=[]}){

        loads.forEach(ld => {
            
            ld.load = false;
            ld.loaing = true;
        });


    }

    #body = null;
    #Build({}){


    }

    Load(){

        this.#loading=true;

        this.#loads.forEach(ld=>{

            
        });
    }
}