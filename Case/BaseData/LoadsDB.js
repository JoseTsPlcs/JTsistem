
class LoadsDB extends Load {

    #mysql = null;
    constructor(i){

        super(i);
        this.#mysql = new Mysql({name:i.name+' [mysql]',log:i.log,tables:i.tables});
    }

    #loads = [];
    data({index=null}={}){

        var dt = [];
        this.#loads.forEach(ld => {
            
            dt.push(ld.data().send);
        });
        return dt;
    }

    #count = 0;
    Load({loads=[]}){

        super.Load({});

        this.#loads=[];
        this.#count=0;

        const total = loads.length;

        if(total == 0){

            this.Loaded();
            return;
        }

        let k = this;
        for (let ldi = 0; ldi < total; ldi++) {

            const ld = loads[ldi];
            
            //....create load
            var ldnew = new LoadSql({
                name:k._name +' * load '+ldi,
                log:this._log,
                events:[{name:'loaded',actions:[
                    {
                        description:'one load was loaded',
                        action:({send})=>{

                            k.#OneLoaded({index:ldi,data:send});
                        }
                    }
                ]}],
            });

            //event
            k.LogAction({type:'log',msg:'one load index:'+ldi});

            ldnew.Load(k.#GetConfigLoad(ld));

            this.#loads.push(ldnew);
        }
        
    }

    #GetConfigLoad(ld){

        var config = {
            sql:null,
            type:null,
            log_sql:ld.log_sql,
            log_resp:ld.log_resp,
        };

        if(ld!=null){

            config.sql = ld.sql;
            config.type = ld.type;

            switch (ld.action) {
                case 'select':
                    config.sql = this.#mysql.Select_Sql({...ld});
                    config.type = 'row';
                  break;
                  case 'update':
                    config.sql = this.#mysql.Update_Sql({...ld});
                    config.type = 'success';
                  break;
                  case 'insert':
                    config.sql = this.#mysql.Insert_Sql({...ld});
                    config.type = 'success';
                  break;
                  case 'delete':
                    config.sql = this.#mysql.Delete_Sql({...ld});
                    config.type = 'success';
                  break;
            }
        }
        
        return config;
    }

    #OneLoaded({index=null,data=null}){

        this.LogAction({type:'log',msg:'one loaded index:'+index});

        this.#count++;
        if(this.#count>=this.#loads.length){

            this.Loaded();
        }
    }

}