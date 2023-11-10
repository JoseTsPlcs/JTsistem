
class LoadData extends ODD{

    #loading=false;
    #load=null;
    #data=null;
    GetData(){
        return this.#data;
    }

    constructor(i){

        super(i);
        this.AddEvents({events:[
            {name:'load_start'},
            {name:'load_end'},
        ]});
    }

    Load({database=null,load=null,success=null}){

        if(database==null){
            this.LogAction({type:'error',msg:'error need database'});
            return;
        }

        if(load){

            if(load.table != null){

                load = {
                    table_main:load.table,
                    selects:[
                        {table:load.table,field:0,as:'value'},
                        {table:load.table,field:1,as:'show'},
                    ],
                }
            }
           
            this.#load=load;
        }

        if(this.#load==null){
            this.LogAction({type:'error',msg:'error need load'});
            return;
        }

        this._setName({name: this._name + ' ' + database.getTableData({index:load.table_main}).name + ' load'});
        
        let k = this;
        this.#loading=true;
        this.CallEvent({name:'load_start',events:{load:this.#load}});
        database.Select_Sql({
            ...this.#load,
            log_sql:k._log,
            log_resp:k._log,
            success:(resp)=>{

                k.#data = resp;
                k.#loading = false;
                k.CallEvent({name:'load_end',events:{load:k.#load,data:resp}});
                if(success!=null)success(resp);
            }
        });
    }

    

    

}