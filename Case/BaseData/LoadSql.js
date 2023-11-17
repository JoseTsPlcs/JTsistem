
class LoadSql extends Load {

    constructor(i) {
  
      super(i);
    }
  
    Load({type=null,php=null,sql=null,success=null,fail=null,log_resp=false,log_sql=false}){
  
      super.Load({});

      if(type!=null){

        switch(type){
            case 'row':
                php = 'Case/BaseData/Mysql_Row.php';
            break;
            case 'success':
                php = 'Case/BaseData/Mysql_Success.php';
            break;
        }
      }
  
      if(php == null){
  
        console.log("php is null",php);
        return;
      }
  
      if(sql == null){
  
        console.log("sql is null",sql);
        return;
      }
  
      if(log_sql) console.log(sql);
  
      let k = this;
  
      $.post(php, {sql : sql}, function(resp){
  
        resp = JSON.parse(resp);
        k.Loaded({data:resp});
        if(log_resp) console.log(resp);
        if(success!=null)success(resp);
  
      }).fail(function() {
  
  
        if(fail != null)fail();
      }).always().done();
  
    }
    
  
  }