
class LoadTables extends ODD {

    constructor(i={}){

        const eventsNew = [
            {name:'load',actions:[]},
            {name:'oneLoaded',actions:[]},
            {name:'loaded',actions:[]},
        ];
        if(i.events==null) i.events = [...eventsNew];
        else i.events = [...i.events,...eventsNew];

        super(i);

        if(i.sql) this.#sql = i.sql;
        if(i.mysql) this.#mysql = i.mysql;
    }

    #sql = null;
    #mysql = null;
    #results = [];
    #total = 0;
    #count = 0;

    GetResults(){

        return this.#results;
    }

    Loads({loads=[],success}){
        
        let k = this;
        this.#total = loads.length;
        this.#results = [];

        if(this.#total == 0){
            
            
            k.CallEvent({name:'loaded'});
        }
        else
        {

            for (let ld = 0; ld < loads.length; ld++) {
                const load = loads[ld];
                k.Load({
                    load:load,
                    loadIndex:ld,
                    success:success,
                });                            
            }
        }

        

    }

    Load({load,loadIndex,success}){

        let k = this;
        var Selectsql = k.#mysql.Select_Sql({...load});
        k.#sql.Mysql_Row({
            sql:Selectsql,
            success:(data)=>{
                
                var loaded = k.#count+1>=k.#total;

                var pass = {
                    data:data,
                    count:k.count,
                    loadIndex:loadIndex,
                    info:load,
                    loaded:loaded,
                };

                if(success!=null)success({...pass});
                k.CallEvent({name:'oneLoaded',params:{...pass}});

                k.#results.push({
                    data:data,
                    info:{
                        ...load,
                        index:loadIndex,
                    },
                });
                k.#count++;

                if(loaded){

                    k.CallEvent({name:'loaded'});
                }
            }
        });
    }

}