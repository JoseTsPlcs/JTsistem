
class Mysql {

  constructor() {

  }

  Mysql({php=null,sql=null,success=null,fail=null,log_resp=false,log_sql=false}){

    if(php == null){

      console.log("php is null",php);
      return;
    }

    if(sql == null){

      console.log("sql is null",sql);
      return;
    }

    if(log_sql) console.log(sql);

    $.post(php, {sql : sql}, function(resp){

      resp = JSON.parse(resp);
      if(log_resp) console.log(resp);
      if(success!=null)success(resp.send);


    }).fail(function() {


      if(fail != null)fail();
    }).always().done();
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
