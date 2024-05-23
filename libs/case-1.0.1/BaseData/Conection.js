
/*
  use this to do request in sql
*/

class Conection extends ODD {

  constructor(i) {

    super(i);

    this.SetConfiguration(i);
  }

  config = {
    servidor: null,
    usuario: null,
    pass: null,
    baseDatos: null,
  }
  #schema = [];

  SetConfiguration({servidor,usuario,pass,baseDatos,schema}){

    this.config = {
      servidor,
      usuario,
      pass,
      baseDatos,
    };
    this.#schema = schema;
  }

  #listOfRest = [];

  Request({php, sql=null,success=null,fail=null,name,log=false}){ 

    switch (php) {
      case "row":
        php = '../../../libs/case-1.0.1/BaseData/Mysql_Row.php';
        break;

      case "success":
        php = '../../../libs/case-1.0.1/BaseData/Mysql_Success.php';
        break;
    
    }

    //console.log("request -> sql:",sql);

    let k = this;
    $.post(php, {...this.config,sql}, function(resp){

      try {
        resp = JSON.parse(resp);
    
      } catch (error) {
        
        console.log(resp);
        alert("se trato de pasar resp a JSON pero no se pudo");
      }

      if(resp.resp == false){

        console.log("msg:",resp.msg);
        console.log("sql:",resp.sql);
        alert(resp.msg);
      }

      if(success!=null)success(resp.send);


    }).fail(function() {

      
      k.#RequestFail({fail,msg:resp});

    }).always().done();

  }

  #RequestFail({fail,resp,msg}){

    //console.log(msg,resp);
    //alert(msg);
  }

  #AddRequestToList({sql,resp,name}){

    this.#listOfRest.push({
      sql,
      resp,
    });

  }

  //----mysql-------

  GetSql_Select({dbMain,tableMain,selects=[],joins=[],conditions=[],limit,orders=[]}){

    /*
    SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate
    FROM Orders
    INNER JOIN Customers ON Orders.CustomerID=Customers.CustomerID;
    */

    var sql = "SELECT ";

    var selects_length = selects.length;
    for (let slc = 0; slc < selects_length; slc++) {

      const select = selects[slc];
      var selectLast = slc == selects_length-1;
      var selectDb = select["db"];
      var selectTable = select["table"];
      var selectField = select["field"]
      var selectAs = select["as"];
      var selectAction = select["action"];

      if(selectAction) sql += selectAction + "(";
      sql += (selectDb?selectDb+".":"") + selectTable + "." + selectField;
      if(selectAction) sql += ")";
      if(selectAs) sql += " AS '" + selectAs + "'";
      if(!selectLast) sql += ", ";

    }

    sql += " FROM " +(dbMain?dbMain+".":"") + tableMain;

    var joins_length = joins.length;
    for (let jn = 0; jn < joins_length; jn++) {

      const join = joins[jn];
      var joinLast = jn == joins_length-1;

      var joinMainDb = join["main"]["db"];
      var joinMainTable = join["main"]["table"];
      var joinMainField = join["main"]["field"];

      var joinJoinDb = join["join"]["db"];
      var joinJoinTable = join["join"]["table"];
      var joinJoinField = join["join"]["field"];

      var joinTipe = join["tipe"];

      sql += " " + joinTipe + " JOIN " + (joinJoinDb?joinJoinDb+".":"") + joinJoinTable + " ON " 
      sql += (joinMainDb?joinMainDb+".":"") + joinMainTable + "." + joinMainField;
      sql += " = ";
      sql+= (joinJoinDb?joinJoinDb+".":"") + joinJoinTable + "." + joinJoinField;

      if(!joinLast) sql += " ";

    }

    sql += " " + this.GetSql_Where({conditions});

    var orders_lenght = orders.length;

    if(orders_lenght>0){

      sql+= " ORDER BY ";

      for (let ord = 0; ord < orders_lenght; ord++) {

        var order = orders[ord];
        var orderField = order["field"];
        var orderAsc = order["asc"];
        var orderLast = ord == orders_lenght-1;

        sql += orderField + " ";
        sql += orderAsc?"ASC":"DESC";
        sql += orderLast ? " ":",";
        
      }
      
    }

    if(limit!=null){

      sql += " LIMIT " + limit[0] + " , " + limit[1]; 
    }
    //console.log(sql);

    return sql;
  }

  GetSql_Insert({tableMain,inserts}){

    /*
    INSERT INTO table_name (column1, column2, column3, ...)
    VALUES (value1, value2, value3, ...);
    */

    var sql = "INSERT INTO " + tableMain + " (";

    var insert_length = inserts.length;

    for (let ins = 0; ins < insert_length; ins++) {

      const insert = inserts[ins];
      var insertLast = ins == insert_length-1;
      var insertField = insert["field"];
      
      sql+= insertField;
      if(!insertLast) sql += ", ";
      
    }

    sql += ") VALUES ("

    for (let ins = 0; ins < insert_length; ins++) {

      const insert = inserts[ins];
      var insertLast = ins == insert_length-1;
      var insertValue = "'"+insert["value"]+"'";
      
      sql+= insertValue;
      if(!insertLast) sql += ", ";
      
    }

    sql += ")"

    return sql;
  }

  GetSql_Update({tableMain,sets,conditions}){

    /*UPDATE table_name
    SET column1 = value1, column2 = value2, ...
    WHERE condition;*/

    var sql = "UPDATE " + tableMain + " SET ";

    var sets_length = sets.length;
    for (let st = 0; st < sets_length; st++) {
      const set = sets[st];
      var setLast = st == sets_length-1;
      var setField = set["field"];
      var setValue = "'" + set["value"] + "'";

      sql += setField + " = " + setValue;
      if(!setLast) sql += ", "; 
    }

    sql += " " + this.GetSql_Where({conditions});

    return sql;
  }

  GetSql_Where({conditions=[]}){

    var cond_length = conditions.length
    if(cond_length==0) return "";

    var sql = "WHERE ";

    for (let cond = 0; cond < cond_length; cond++) {

      const condition = conditions[cond];
      var conditionBefore = condition["before"];
      var conditionTable = condition["table"];
      var conditionField = condition["field"];
      var conditionInter = condition["inter"];
      var conditionValue = condition["value"];
      var conditionAfter = condition["after"];

      if(conditionBefore != null) sql += conditionBefore;
      sql += conditionTable + "." + conditionField; 
      sql += conditionInter;
      if(conditionValue!=null) sql +=  (conditionInter==" LIKE "?"'%":"'") + conditionValue + (conditionInter==" LIKE "?"%'":"'");
      if(conditionAfter != null) sql += conditionAfter;
      
    }

    return sql;
  }

  GetSql_Delete({tableMain, conditions}){

    //DELETE FROM table_name WHERE condition

    var sql = "DELETE FROM " + tableMain + " " + this.GetSql_Where({conditions});

    return sql;
  }

}
