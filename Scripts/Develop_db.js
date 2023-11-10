
$(document).ready(function() {

  const scn = new ScreenLoad({state:false});

  const cont = new Grid({
    cols:[[4,4,4],[12]],
    boxs:[
      {x:0,y:0,box:{tipe:5,default:'load schema of tables in qk' + icons.load ,class:'btn btn-primary',update:()=>{LoadTables()}}},
      {x:1,y:0,box:{tipe:5,default:'copi' + icons.edit, class:'btn btn-primary', update:()=>{CopySchema()}}},
      {x:0,y:1,box:{tipe:0}},
    ]
  });

  const dt = cont.GetColData({x:0,y:1});
  const bx = dt.boxs[0];

  const mysql = new Mysql();
  const ld = new dataBase();

  function LoadTables() {
  
    databaseLoad({success:()=>{

      PrintTables();
    }});
  }

  function databaseLoad({success=null,log=true}) {
    
    scn.SetState({state:true});
    mysql.Mysql_Row({
      sql:'SHOW TABLES',
      log_sql:log,
      log_resp:log,
      success:(resp)=>{
        
        var tables = [];
        resp.forEach(t => {
          tables.push(t.Tables_in_qk);
        });
            
        ld.LoadTables({
          tables:tables, 
          log,log,
          success:(i)=>{

            scn.SetState({state:false});
            if(success!=null)success(i);
          },
        });
        
      },
    });

  }

  function PrintTables() {
    
    bx.SetValue('');

    var str = '[';
    ld.GetTableData().forEach(t => {
      
      var t_str = JSON.stringify(t);
      //console.log(t);
      str += t_str + ',' + '\r\n';
    });
    str += ']';

    bx.SetValue(str);
  }
  
  function CopySchema() {
    
    navigator.clipboard.writeText(bx.GetValue());
    alert('db schema copied');
  }

  //console.log(TablesData({tables:['productos','ventas','clientes','productos','unidades']}));

});
