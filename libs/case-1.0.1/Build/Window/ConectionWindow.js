

class ConectionWindow extends ODD {

    constructor(i){

        super(i);
        this.#SetVariables(i);
        this.#Build(i);

        this.UpdateDataBase();
    }

    #database = null;

    #SetVariables({}){

        
    }

    //----------------

    #gr_conteiner = null;
    #wn_conection = null;
    #wn_schema=null;
    #tb_schema_tables=null;
    #tb_schema_fields=null;
    #wn_requests=null;
    
    #Build({parent}){

        let k = this;

        this.#gr_conteiner = new Grid({
            parent,
            cols:[[12],[12],[12]],
        });

        this.#wn_conection = new Window({
            parent:this.#gr_conteiner.GetColData({x:0,y:0}).col,
            title:"conection",blocked:false,
            grid:{
                cols:[[12],[12],[12],[12],[4,4,4],],
                labels:[
                    {x:0,y:0,name:"servidor",box:{tipe:1,class:"w-100",value:"localhost"}},
                    {x:0,y:1,name:"usuario",box:{tipe:1,class:"w-100",value:"Lip_Alonso"}},
                    {x:0,y:2,name:"contraseña",box:{tipe:1,class:"w-100",value:"kfEq2Li-xwv3L]rP"}},
                    {x:0,y:3,name:"basedatos",box:{tipe:1,class:"w-100",value:"lip_dv"}},
                ],
            },
            events:[
                {
                    name:"boxUpdate",
                    actions:[
                        {
                            name:"update",
                            action:()=>{


                            }
                        }
                    ],
                }
            ],
        });

        this.#wn_schema = new Window({
            parent:this.#gr_conteiner.GetColData({x:0,y:1}).col,
            title:"schema",blocked:false,   
            grid:{
                cols:[[12],[6,6]],
                boxs:[
                    {x:0,y:0,box:{id:"btn1",tipe:5,class:"btn btn-primary btn-sm",value:"load schema",update:()=>{k.#LoadSchema()}}},
                    {x:0,y:0,box:{id:"btn2",tipe:5,class:"btn btn-primary btn-sm",value:"copy schema",update:()=>{k.#GetCopyTablesSchema()}}},
                ],
            }
            
        });
        this.#tb_schema_tables = new Table_Grid({
            parent: this.#wn_schema.Conteiner_GetColData({x:0,y:1}).col,
            headers:[
                {name:"Index"},
                {name:"Table"},
                {name:""},
            ],
        });
        this.#tb_schema_fields = new Table_Grid({
            parent: this.#wn_schema.Conteiner_GetColData({x:1,y:1}).col,
            headers:[
                {name:"Field"},
                {name:"Type"},
                {name:"Key"},
                {name:"Extra"},
            ],
        });

        this.#wn_requests = new Window({
            parent:this.#gr_conteiner.GetColData({x:0,y:2}).col,
            title:"requests",blocked:false,   
            grid:{cols:[[6,6]],}
        });
    }

    //schema

    #schema = {
        tables:[
            {"name":"product_tipes","fields":[{"Field":"ID_PRODUCT_TIPE","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"TIPE","Type":"varchar(100)","Null":"NO","Key":"","Default":null,"Extra":""}]},
            {"name":"sales_products","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"ID_SALE","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ID_PRODUCT","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CANT","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PRICE UNIT","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""}]},
            {"name":"customers","fields":[{"Field":"ID_COSTUMER","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"NAME","Type":"varchar(100)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DIRECCION","Type":"varchar(300)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"REFERENCE","Type":"varchar(500)","Null":"NO","Key":"","Default":null,"Extra":""}]},
            {"name":"products","fields":[{"Field":"ID_PRODUCTO","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"NAME","Type":"varchar(250)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ID_PRODUCT_TIPE","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"UNID_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"STOCK_TOTAL","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ACTIVE","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""}]},
            {"name":"sales","fields":[{"Field":"ID_SALE","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"DATE_EMMIT","Type":"date","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"STATUS","Type":"varchar(50)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TOTAL","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""}]},
            {"name":"users","fields":[{"Field":"ID_USER","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"NAME","Type":"varchar(50)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ID_CLASS","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ACTIVE","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""}]},
        ],
        count:0,
        total:0,
    }

    #LoadSchema(){

        let k = this;
        //console.log("loading schema");

        this.#database.Mysql_Row({
            sql:"show tables",
            success:(result)=>{
                
              //console.log("show tables",result);
      
              k.#schema.count=0;
              k.#schema.total = result.length;
              k.#schema.tables=[];
      
              result.forEach(table => {
                
                k.#LoadSchema_LoadOneTable(table["Tables_in_lip_dv"]);          
              });
      
              if(k.#schema.total==0) LoadedDataBase();
            }
        });
    }

    #LoadSchema_LoadOneTable(table){

        let k = this;
        this.#database.Mysql_Row({
          sql:"describe " + table,
          success:(result)=>{
    
            //console.log("describe",table,result);
    
            k.#schema.count++;
            k.#schema.tables.push({
              name:table,
              fields:result,
            });
            if(k.#schema.count>=k.#schema.total) k.#LoadedSchema();
          }
        })
    }

    #LoadedSchema() {
    
        this.CallEvent({name:"loadedSchema",params:{tables:this.#schema.tables}});

        let u = this;
        var lines_tables = [];

        for (let y = 0; y < this.#schema.tables.length; y++) {

            const tb = this.#schema.tables[y];
            
            var line =  [
                {box:{tipe:5,value:"[/]",class:"btn btn-outline-primary btn-sm",update:()=>{

                    var tableName = u.#tb_schema_tables.Box_GetValue({x:1,y});
                    u.#LookUpTable({tableName});
                }}},
                {box:{tipe:0,value:tb.name,class:"w-100"}},
            ];
            lines_tables.push(line);
        }

        this.#tb_schema_tables.Clear();
        this.#tb_schema_tables.AddLines({lines:lines_tables});

        console.log(this.#schema.tables);
    }

    GetSchema(){

        return this.#schema;
    }

    #GetCopyTablesSchema(){

        var txt = "";
        this.#schema.tables.forEach(tb => {
            
            txt += JSON.stringify(tb) + ",\n";
        });

        console.log("copied",txt);
        navigator.clipboard.writeText(txt);
    }

    //---------events---------------

    #Event_Request_Success({sql,tipe,result}){

        

    }

    //----------private functions----------

    #LookUpTable({tableName}){

        var dt_table = this.#schema.tables.find(tb=>tb.name==tableName);
        var fields = dt_table.fields;
        var lines = fields.map((f)=>{

            return [
                {box:{tipe:0,value:f.Field,class:"w-100"}},
                {box:{tipe:0,value:f.Type,class:"w-100"}},
                {box:{tipe:0,value:f.Key,class:"w-100"}},
                {box:{tipe:0,value:f.Extra,class:"w-100"}},
            ];
        });

        this.#tb_schema_fields.Clear();
        this.#tb_schema_fields.AddLines({lines});
       
    }

    #GetMysql({action,}){

        
    }

    //---------public funcitons--------

    UpdateDataBase(){

        var server = this.#wn_conection.Conteiner_GetColData({x:0,y:0}).labels[0].GetBox().GetValue();
        var uss= this.#wn_conection.Conteiner_GetColData({x:0,y:1}).labels[0].GetBox().GetValue();
        var pass= this.#wn_conection.Conteiner_GetColData({x:0,y:2}).labels[0].GetBox().GetValue();
        var db = this.#wn_conection.Conteiner_GetColData({x:0,y:3}).labels[0].GetBox().GetValue();

        this.#database = new Sql({
            servidor:server,
            usuario:uss,
            pass:pass,
            baseDatos:db,
        });
    }

    GetDataBase(){

        return this.#database;
    }

    Load(){

        this.#LoadSchema();
    }

    Request({sql,tipe,success}){

        switch(tipe){

            case "row":

            this.#database.Mysql_Row({
                sql,
                success:(result)=>{
                    
                    this.#Event_Request_Success({sql,result});
                    success(result);
                }
            });

            break;

            case "success":

            this.#database.Mysql_Success({
                sql,
                success:(result)=>{
                    
                    this.#Event_Request_Success({sql,result});
                    success(result);
                }
            });

            break;
        }

        
    }

    GetMysql_Select({tableMain,selects,conditions,joins,limit}){

        console.log(tableMain,selects);

        var sql = "";

        sql = "SELECT ";
        
        var selectsCount = selects.length;
        for (let slc = 0; slc < selectsCount; slc++) {
            const select = selects[slc];
            
            var selectTable = select["table"];
            var selectField = select["field"];
            var selectAs = select["as"];
            var selectAction = select["action"];
            var selectActionExist = selectAction != null;
            var selectExistNext = slc < selectsCount-1;

            if(selectActionExist) sql += selectAction + "(";
            sql += selectTable + "." + selectField
            if(selectActionExist) sql += ")";

            if(selectAs) sql += " as " + selectAs;

            if(selectExistNext) sql += ", ";
        }

        sql += " FROM " + tableMain;
        
        if(limit!=null){

            var limit0 = limit[0];
            var limit1 = limit[1];

            sql+= " LIMIT " + limit0 + ", " + limit1;
        }


        return sql;
    }
}