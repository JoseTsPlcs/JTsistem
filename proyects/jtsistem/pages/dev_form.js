
$(document).ready(function() {

  var op_tableNull = {value:"null",show:"seleccionar tabla"};
  var op_tables = [];
  var tablesData = [];
  
  var scrn = new ScreenLoad({});
  var fm = new Form({
    title:"selects",

    fields:[
      {col:12,name:"tabla",tipe:0,box:{tipe:8,value:op_tableNull.value,options:[op_tableNull]}},
      {col:12,name:"lista de campos",tipe:2,box:{tipe:0}},
    ],

    tools:[
      {position:"head-left",name:"load-tables",box:{tipe:5,value:"cargar tablas",class:"btn btn-outline-primary btn-sm"}},
      {position:"head-left",name:"copy-selects",box:{tipe:5,value:"copiar selects",class:"btn btn-outline-primary btn-sm",update:()=>{CopySelects()}}},
      {position:"head-left",name:"copy-schema",box:{tipe:5,value:"copiar schema", class:"btn btn-primary btn-sm",update:()=>{CopySchema()}}}
    ],

    events:[
      {
        name:"builded",
        actions:[{
          action:()=>{

            LoadTables();
          }
        }]
      },
    ],
  }); 

  var ld_tables = new Loads({
    screenLoad:scrn,
    conection:db_lip,
  });

  function LoadTables() {
    
    var sql = `
    SELECT TABLE_NAME
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'lip_dv';
    `;

    scrn.SetState({state:true});
    db_lip.Request({
      sql,php:"row",
      success:(resp)=>{

        scrn.SetState({state:false});

        var loads = resp.map((tb)=>{

          var tableName = tb.TABLE_NAME;
          return {
            table:tableName,
            name:"ld-"+tableName,
            sql:'DESCRIBE '+tableName,
          };
        });

        //console.log(loads);

        ld_tables.Load({
          loads,
          success:({loads})=>{

            tablesData = loads;
            op_tables = loads.map(ld=>{return {value:ld.table,show:ld.table}});
            op_tables = [op_tableNull,...op_tables];
            fm.Field_GetBox({fieldName:"tabla"}).SetOptions(op_tables);
          }
        });
      }
    });
  }

  function CopySelects() {
    
    var tableName = fm.Field_GetBox({fieldName:"tabla"}).GetValue();
    var tableData = tablesData.find(tb=>tb.table == tableName);
    console.log(tableName,tableData);
    var copiSelects = '';

    tableData.result.forEach(field => {
      
      copiSelects += '{table:"'+tableName+'",field:"'+field.Field+'"'+(field.Key=="PRI"?',primary:true':'')+'},' + '\n'
    });
    navigator.clipboard.writeText(copiSelects);

    alert("se copiaron los selects de la tabla " + tableName);
  }

  function CopySchema() {
    
    var tableName = fm.Field_GetBox({fieldName:"tabla"}).GetValue();
    var tableData = tablesData.find(tb=>tb.table == tableName);
    console.log(tableName,tableData);


    var copi = '{' + '\n';
    copi += "name: " + "'" + tableName + "'," + '\n';
    copi += "fields:["  + '\n';

    tableData.result.forEach(field => {
      
      copi += '{\n  name:"'+field.Field+'"'+(field.Key=="PRI"?', primary:true':'')+ ', active:true, \n';
      copi += ' title:"fieldName", tipe:"none"'+ '\n' +'},' + '\n';
    });

    copi += '],';
    copi += '\n';
    copi += "}"

    navigator.clipboard.writeText(copi);

    alert("se copiaron el schema de la tabla " + tableName);
  }

  //scr_admin({});
  
});
