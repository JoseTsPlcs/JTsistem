
class Form_Load extends ODD {

    constructor(i){

        super(i);

        this.AddEvents({events:[
            {name:'loads_loaded'},
        ]});

        this.#database = new dataBase();
        this.#database.SetTables({tables:i.tables});
        this.#loads = new LoadsData({name:i.name+' [loads]'});
        //this.#table = new LoadTable({name:i.name+' [table load]',table_main:i.table_main});
    }

    #database = null;

    #loads = null;
    Loads_Load({success=null}){

        let k = this;
        this.#loads.Load({database:this.#database,success:()=>{

            k.CallEvent({name:'loads_loaded'});
            if(success!=null)success();
        }});
    }

    /*#table = null;
    Table_Load(i){

        this.#table.Select({
            ...i,
            database:this.#database,
            success:(e)=>{

                if(i.success!=null)i.success(e);
            }
        });
    }*/

    #tables = [];
    #tablesCount = 0;

    Tables_Load({tables=[],success=null}){

        let k = this;

        const total = tables.length;
        this.#tables = [];
        this.#tablesCount = 0;

        if(total == 0){

            this.#Tables_Load({success:success});
            return;
        }

        for (let tb = 0; tb < total; tb++) {
            
            this.#tables.push(new LoadTable({
                name:k._name+'[table '+tb+' load]',
            }));
        }

        tables.forEach(tb => {
            
            tb.Select({
               ...tb,
               success:(e)=>{

                k.#Tables_OneLoad({success:success});
               }, 
            })
        });
    }

    #Tables_OneLoad({success=null}={}){

        if(this.#tablesCount >= this.#tables.length){

            this.#Tables_Load({success:success});
        }
    }

    #Tables_Load({success=null}){

        if(success!=null) success();
    }

}