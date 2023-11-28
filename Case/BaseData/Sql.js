
/*
  use this to do request in sql
*/

class Sql extends ODD {

  constructor(i) {

    super(i);
  }

  LoadByMysql({action,mysql,config,success,fail,logSql=false}){

        if(action==null){
            
            this.LogAction({type:'error',msg:'LoadByMysql(), action is null'});
            return;
        }

        if(mysql==null){
            this.LogAction({type:'error',msg:'LoadByMysql(), mysql is null'});
            return;
        }

        var sql = null;
        if(config!=null){

            switch (action) {
                case 'select':
                    sql = mysql.Select_Sql({...config});
                    break;
            
                case 'update':
                    sql = mysql.Update_Sql({...config});
                    break;

                case 'insert':
                    sql = mysql.Insert_Sql({...config});
                    break;

                case 'delete':
                    sql = mysql.Delete_Sql({...config});
                    break;

                default:
                    break;
            }
        }
        if(logSql)console.log(sql);

        var php = action == 'select' ? 'Case/BaseData/Mysql_Row.php' : 'Case/BaseData/Mysql_Success.php';

        this.Load({
          php:php,
          sql:sql,
          success:success,
          fail:fail,
        })
  }

  Load({php=null,sql=null,success=null,fail=null}){


    if(php == null){

      return;
    }

    if(sql == null){

      return;
    }

    /*this.LogAction({msg:{
      sql:sql,
      php:php,
    },LogAction:'general'});*/

    let k = this;

    $.post(php, {sql : sql}, function(resp){

      //k.Loaded();
      //console.log(resp);
      resp = JSON.parse(resp);
      if(success!=null)success(resp.send);


    }).fail(function() {

      if(fail != null)fail();
    }).always().done();

  }

  Mysql(i){

    this.Load({...i});
  }

  GetPath(){

    return '';
  }

  Mysql_Row(i){

    if(i==null) return;
    i.php = this.GetPath() + 'Case/BaseData/Mysql_Row.php';
    this.Mysql(i);
  }

  Mysql_Success(i){

    if(i==null)return;
    i.php = this.GetPath() + 'Case/BaseData/Mysql_Success.php';
    this.Mysql(i);
  }

}
