
class LoadTable extends Load {

    
    constructor(i){

        super(i);
    }


    Load(i){

        if(i.sql == null){

            this.LogAction({
                type:'error',
                msg:'error need sql to loadTable',
            });
            return;
        }

        super.Load(i);

        let k = this;
        i.sql.Load({
            php:i.php,
            sql:i.sql,
            success:(resp)=>{

                k.CallEvent({name:'loaded',params:{...resp}});
            }
        });
    }

}