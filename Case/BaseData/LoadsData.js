
class LoadsData extends ODD {

    #loading=false;
    #loads = [];
    #loadcount = 0;

    constructor(i){

        super(i);
        this.AddEvents({events:[
            {name:'loads_start',actions:[]},
            {name:'loads_end',actions:[]},
        ]});
    }

    Load({database=null, loads=[]}){

        let k = this;
        //console.log("------loads-----", loads);

        if(database==null){
            this.LogAction({type:'error',msg:'error need database'});
            return;
        }

        if(this.#loading){
            this.LogAction({type:'error',msg:'error loads is loading'});
            return;
        }

        //crea new loaddata to loads new
        if(loads.length>0){

            this.#loads = [];
            loads.forEach(ld => {
            
                var ldi = new LoadData({
                    log:this._log,
                    name:this._name,
                    events:[{name:'load_end',actions:[{
                        description:'load one by loads',
                        action:()=>{
    
                            k.OneLoad();
                        }
                    }]}],
                });
                this.#loads.push(ldi);
            });
        }
        

        //start loads
        this.CallEvent({name:'loads_start',params:{}});
        this.#loading=true;
        this.#loadcount = 0;
        const mx = this.#loads.length;
        if(mx > 0){

            for (let index = 0; index < mx; index++) {

                var ld = this.#loads[index];
                var ldi = index < loads.length ? loads[index] : null;
                ld.Load({
                    database:database,
                    load:ldi,
                });
            }
        }else Loaded();
        
    }

    OneLoad({}={}){

        this.#loadcount++;
        if(this.#loadcount >= this.#loads.length){

            this.Loaded();
        }
    }

    Loaded(){

        this.#loading=false;
        this.CallEvent({name:'loads_end',params:{}});
    }

    GetData({index=null}={}){

        if(index==null){

            var dt = [];
            this.#loads.forEach(ld => {
                
                dt.push(ld.GetData());
            });
            return dt;
        }else
        {
            //console.log(this.#loads, index);
            return this.#loads[index].GetData();
        }
    }

}