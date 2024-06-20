
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
    selects = selects.filter(slc=>slc!=null);
    joins = joins.filter(slc=>slc!=null);
    conditions = conditions.filter(slc=>slc!=null);

    var sql = "SELECT ";

    var selects_length = selects.length;
    for (let slc = 0; slc < selects_length; slc++) {

      const select = selects[slc];
      var selectSql = select["sql"] ? select["sql"] : "";
      var selectLast = slc == selects_length-1;
      var selectDb = select["db"];
      var selectTable = select["table"];
      var selectField = select["field"]
      var selectAs = select["as"];
      var selectAction = select["action"];

      if(selectSql == ""){

        if(selectAction) selectSql += selectAction + "(";
        selectSql += (selectDb?selectDb+".":"") + selectTable + "." + selectField;
        if(selectAction) selectSql += ")";
        if(selectAs) selectSql += " AS '" + selectAs + "'";
      }

      sql += selectSql;
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
      var joinJoinAs = join["join"]["as"];
      var joinJoinTable = join["join"]["table"];
      var joinJoinField = join["join"]["field"];

      var joinTipe = join["tipe"];

      sql += " " + joinTipe + " JOIN " + (joinJoinDb?joinJoinDb+".":"") + joinJoinTable + (joinJoinAs?" AS " + joinJoinAs :"") + " ON " 
      sql += (joinMainDb?joinMainDb+".":"") + joinMainTable + "." + joinMainField;
      sql += " = ";
      sql+= (joinJoinDb?joinJoinDb+".":"") + (joinJoinAs?joinJoinAs:joinJoinTable) + "." + joinJoinField;

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

  GetSql_Insert({tableMain,inserts=[]}){

    /*
    INSERT INTO table_name (column1, column2, column3, ...)
    VALUES (value1, value2, value3, ...);
    */

    //---------------

    /*{
      name:"ID_PRIMARY",
      tipe:"values",
      value:1,
    }*/

    var columns = [];
    inserts.forEach(ins => {
      
      var insertField = ins.field;
      var insertValue = ins.value;
      var insertTipe = ins.tipe ? ins.tipe : "values";
      var columnFound = columns.find(c=>c.name==insertField);
      if(!columnFound){

        columns.push({
          name:insertField,
          values:[insertValue],
          tipe: insertTipe,
        });
      }
      else
      {

        columnFound.values.push(insertValue);
      }

    });

    var linesTotal = 0;
    columns.forEach(col => {
      
      var count = col.values.length;
      if(count>linesTotal) linesTotal = count;
    });

    columns.forEach(col => {
      
      var fillCount = linesTotal - col.values.length;
      var lastValue = col.values[col.values.length-1];

      switch (col.tipe) {
        case "const":
          
          for (let c = 0; c < fillCount; c++) {
            
            col.values.push(lastValue);
          }
        break;

        case "secuence":
          
          for (let c = 0; c < fillCount; c++) {
            
            lastValue += 1;
            col.values.push(lastValue);
          }
        break;
      }

    });

    var fields = columns.map(col=>col.name);
    var lines = [];
    for (let ln = 0; ln < linesTotal; ln++) {
      
      var lineOne = [];
      
      columns.forEach(col => {
        
        lineOne.push(col.values[ln]);
      });

      lines.push(lineOne);
    }

    

    //---------------
    console.log(inserts,columns,fields,lines);

    var sql = "INSERT INTO " + tableMain + " (";

    var fieldsLength = fields.length;
    for (let f = 0; f < fieldsLength; f++) {

      var field = fields[f];
      var fieldLast = f == fieldsLength - 1;
      sql += field;
      sql += fieldLast ? "" : ",";
    }

    sql += ") VALUES "

    var linesLength = lines.length;
    for (let ln = 0; ln < linesLength; ln++) {

      
      var line = lines[ln];
      var lineLast = ln == linesLength - 1;
      sql += "(";

        var values = line;
        var valuesLength = values.length;
        for (let v = 0; v < valuesLength; v++) {

          var value = values[v];
          var valueLast = v == valuesLength - 1;
          var useComillas = value != "null";
          var sql_comillas = useComillas ? "'" : "";
          
          sql += sql_comillas + value + sql_comillas;
          sql += valueLast ? "" : ",";
        }

      sql += ")";
      sql += lineLast ? "" : ",";
      
    }
    

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
      if(setValue=="'null'") setValue = "NULL";

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
