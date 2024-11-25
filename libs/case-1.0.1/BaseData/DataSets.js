
class DataSets extends ODD {

    constructor(i) {
        
        i._className="DataSets";
        super(i);
        this.ConectionSet({conection:db_lip});
        this.dataSetsSet({dataSets:i.dataSets});
    }

    #conection = null;
    ConectionSet({conection}){

        this.#conection = conection;
    }

    #dataSets = [];
    dataSetsSet({dataSets=[]}){this.#dataSets=dataSets;}
    dataSetsGet(){return this.#dataSets;}
    dataSetGet({name}){return this.#dataSets.find(d=>d.name==name);}
    dataSetAdd({name,request}){

        var dataSetNew = {
            name,
            state:"none",
            request
        };
        this.#dataSets.push(dataSetNew);
    }

    #state = "done";
    stateGet(){return this.#state;}

    #total = 0;
    #count = 0;

    Load({success}){
        console.log("loadddd",this.#dataSets);
        
        this.#state = "loading";
        this.#total = this.#dataSets.length;
        this.#count = 0;

        this.CallEvent({name:"load"});

        if(this.#total==0) this.#Loaded({success});
        else
        {
            for (let d = 0; d < this.#total; d++) {
                
                this.#LoadOne({dataSet:this.#dataSets[d],success});
            }            
        }
    }

    #LoadOne({dataSet,success}){

        let k = this;
        var sql = this.#conection.GetSql_Select({...dataSet.request});
        dataSet.sql = sql;
        dataSet.state="loading";
        this.#conection.Request({
            php:"row",sql,
            success:(result)=>{

                k.#LoadedOne({dataSet,result,success});
            }
        });
    }

    #LoadedOne({dataSet,result,success}){

        dataSet.result = result;
        dataSet.state="loaded";
        this.#count++;
        if(this.#count>= this.#total) this.#Loaded({success});
    }

    #Loaded({success}){

        this.#state = "loaded";
        if(success!=null)success();
        this.CallEvent({name:"loaded"});
    }

}