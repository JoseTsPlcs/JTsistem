
class Loads extends ODD {

    constructor(i){

        super(i);
        this.#SetVariables(i);
    }

    #loads = [];
    #count=0;
    #total=0;
    #conection = null;
    #screenload = null;

    #SetVariables({loads=[],conection,screenLoad}){

        this.#loads=loads;
        this.#conection=conection;
        this.ScreenLoad_SetVariables({screenLoad});
    }

    ScreenLoad_SetVariables({screenLoad}){

        this.#screenload=screenLoad;
    }

    Loads_Get(){

        return this.#loads;
    }

    //------

    Load({success}){

        this.#total=this.#loads.length;
        this.#count=0;

        if(this.#screenload) this.#screenload.SetState({state:true});

        if(this.#total==0) this.#Loaded({success});
        else
        {

            this.#loads.forEach(load => {
                
                this.#OneLoad({load,success});
            });
        }
    }   

    #OneLoad({load,success}){

        let k = this;
        //console.log("loads -> one load, load:",load);
        var loadSql = this.#conection.GetSql_Select({...load});
        this.#conection.Request({
            php:"row",sql:loadSql,
            success:(result)=>{


                load.result = result;
                k.#OneLoaded({success});
            }
        })
    }

    #OneLoaded({success}){

        this.#count++;
        if(this.#count>=this.#total) this.#Loaded({success});
    }

    #Loaded({success}){
        
        //console.log("loads - loaded");
        if(this.#screenload) this.#screenload.SetState({state:false});
        var params =  {loads:this.#loads};
        this.CallEvent({name:"loaded",params});
        if(success!=null)success(params);
    }
}