

class windowConection extends ODD {

    constructor(i){

        super(i);
        this.#SetVariables(i);
        this.#Build(i);

        this.#Conection_Create();
        this.#LoadSchema_AllTables({success:i.success});
    }

    #SetVariables({}) {
        
        
    }

    #window = null;
    #Build({parent}){

        this.#window = new Window({
            parent,
            title:"conection",
            grid:{
                cols:[
                    [12],//0-created
                    [12],//1
                    [12],//2
                    [12],//3
                    [12],//4
                    [12],//5-buttons
                    [6,6],//6-tables && fields
                ],
                labels:[
                    {x:0,y:1,name:"servidor",box:{tipe:1,class:"w-100",value:"localhost"}},
                    {x:0,y:2,name:"usuario",box:{tipe:1,class:"w-100",value:"Lip_Alonso"}},
                    {x:0,y:3,name:"contraseña",box:{tipe:1,class:"w-100",value:"kfEq2Li-xwv3L]rP"}},
                    {x:0,y:4,name:"baseDatos",box:{tipe:1,class:"w-100",value:"lip_dv"}},
                ],
                boxs:[
                    {x:0,y:0,box:{tipe:0,value:0,options:[{value:0,show:"no created",class:"rounded text-center bg-danger text-white"},{value:1,show:"created",class:"rounded text-center bg-success text-white"}]}},
                    {x:0,y:5,box:{tipe:5,id:"btn1",value:"create",class:"btn btn-primary btn-sm",update:()=>{this.#Conection_Create()}}},
                    {x:0,y:5,box:{tipe:5,id:"btn2",value:"loadSchema",class:"btn btn-primary btn-sm"}},
                ],
                attributes:[
                    {x:0,y:5,attributes:[{name:"class",value:"d-flex justify-content-center"}]}
                ],
            },
        });
    }

    #conection = null;
    #Conection_Create(){

        this.#conection = new Conection({
            servidor:this.#window.Conteiner_GetColData({x:0,y:1}).labels[0].GetBox().GetValue(),
            usuario:this.#window.Conteiner_GetColData({x:0,y:2}).labels[0].GetBox().GetValue(),
            pass:this.#window.Conteiner_GetColData({x:0,y:3}).labels[0].GetBox().GetValue(),
            baseDatos:this.#window.Conteiner_GetColData({x:0,y:4}).labels[0].GetBox().GetValue(),
        });

        var boxShow = this.#window.Conteiner_GetColData({x:0,y:0}).boxs[0];
        boxShow.SetValue(this.#conection?1:0);
    }

    #Schema = {
        tables:[
            //{name:"",fields:[]}
        ],
        count:0,
        total:0,
    };
    
    LoadSchema(){

        this.#LoadSchema_AllTables({

            success:()=>{


            }
        });
    }

    #LoadSchema_AllTables({success}){

        let k = this;

        var allTablesSql = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = '`+this.#conection.config.baseDatos+`'
        ORDER BY table_name ASC;
        `;

        this.#Schema.count=0;

        this.#conection.Request({
            php:"row",sql:allTablesSql,
            success:(result)=>{

                k.#Schema.total = result.length;
                result.forEach(table => {
                    
                    k.#Schema.tables.push({
                        name:table.table_name,
                        fields:[],
                    });

                    k.#LoadSchema_OneTable({tableName:table.table_name,success});
                });
            }
        });
    }

    #LoadSchema_OneTable({tableName,success}){

        let k = this;

        var oneTableSql = `
        SHOW COLUMNS FROM `+tableName+`;
        `;

        this.#conection.Request({
            php:"row",sql:oneTableSql,
            success:(result)=>{

                var tableData = k.#Schema.tables.find(t=>t.name==tableName);
                tableData.fields = result;

                k.#LoadSchema_OneTableLoaded({success});
            }
        })
    }

    #LoadSchema_OneTableLoaded({success}){

        this.#Schema.count++;
        if(this.#Schema.count>=this.#Schema.total){

            //console.log("schema:",this.#Schema);
            if(success!=null)success({tables:this.#Schema.tables});
        }
    }
    
}