

class windowRequest extends ODD {

    constructor(i){

        super(i);
        this.#SetVariables(i);
        this.#Build(i);

    }

    #SetVariables({}){

        
    }

    #tbData = [];
    #op_tables = [];
    #op_joinTipes = [
        {value:"LEFT",show:"LEFT"},
        {value:"RIGTH",show:"RIGTH"},
    ];
    #op_inter = [
        {value:"LIKE",show:"LIKE"},
        {value:"=",show:"="},
        {value:"<=",show:"<="},
        {value:">=",show:">="},
    ];

    #wnd_request = null;
    #bx_tableMain = null;
    #lst_selects = null;
    #lst_conditions = null;
    #lst_joins = null;

    #Build({parent}){

        let wn = this;
        this.#wnd_request = new Window({
            parent,
            title:"request",
            grid:{
                cols:[
                    [12],//0-tableMain
                    [12],//1-selects
                    [12],//2-conditions
                    [12],//3-joins
                    [12],//
                ],
                labels:[
                    {x:0,y:0,name:"tableMain",box:{tipe:8,class:"w-100"}},
                ],
            },
            events:[
                {
                    name:"boxUpdate",
                    actions:[{
                        action:(prm)=>{
        
                            wn.Event_TableMainUpdate(prm);
                        }
                    }]
                }
            ],
        });
        this.#bx_tableMain = this.#wnd_request.Conteiner_GetColData({x:0,y:0}).labels[0].GetBox();
        
        this.#lst_selects = new List({
            parent:this.#wnd_request.Conteiner_GetColData({x:0,y:1}).col,
            fields:[
                {name:"table",box:{tipe:8,options:this.#op_tables}},
                {name:"field",box:{tipe:3}},
                {name:"as",box:{tipe:1,value:"",class:"w-100"}},
            ],
            events:[
                {
                    name:"updateFieldAs",
                    actions:[{
                        action:({k,y})=>{
        
                            var fields = k.Fields_GetAll();
                            var f_table = fields.find(f=>f.name=="table");
                            var f_field = fields.find(f=>f.name=="field");
                            var f_as = fields.find(f=>f.name=="as");
        
                            //console.log("y:",y,"fields:",fields,"f_table",f_table,"f_field:",f_field);
        
                            var v_table = f_table.boxs[y].GetValue();
                            var v_field = f_field.boxs[y].GetValue();
                            var v_as = v_table + "_" + v_field;
        
                            var bx_as = f_as.boxs[y];
                            bx_as.SetValue(v_as);
                        }
                    }]
                },
                {
                    name:"boxUpdate",
                    actions:[{
                        action:({field,k,y})=>{
        
                            if(field.name=="table"){
        
                                wn.#FieldByTable({k,y,fieldNameField:"field",fieldNameTable:"table"});
                                k.CallEvent({name:"updateFieldAs",params:{y}});
                            }
        
                            if(field.name=="field") k.CallEvent({name:"updateFieldAs",params:{y}});
                        }
                    }]
                },
                {
                    name:"addLine",
                    actions:[{
                        action:({k})=>{
        
                            var fields = k.Fields_GetAll();
                            var y = fields[0].boxs.length-1;
                            wn.#FieldByTable({k,y,fieldNameField:"field",fieldNameTable:"table"});
                            k.CallEvent({name:"updateFieldAs",params:{y}});
                        }
                    }],
                }
            ],
        });

        this.#lst_conditions = new List({
            parent:this.#wnd_request.Conteiner_GetColData({x:0,y:2}).col,
            fields:[
                {name:"before",box:{tipe:1,class:"w-100"}},
                {name:"table",box:{tipe:3,options:this.#op_tables}},
                {name:"field",box:{tipe:3,options:[]}},
                {name:"inter",box:{tipe:3,options:this.#op_inter}},
                {name:"value",box:{tipe:1,class:"w-100"}},
                {name:"after",box:{tipe:1,class:"w-100"}},
            ],
            events:[
                {
                    name:"boxUpdate",
                    actions:[{
                        action:({field,k,y})=>{
        
                            if(field.name=="table"){
        
                                wn.#FieldByTable({k,y,fieldNameField:"field",fieldNameTable:"table"});
                                k.CallEvent({name:"updateFieldAs",params:{y}});
                            }
        
                            if(field.name=="field") k.CallEvent({name:"updateFieldAs",params:{y}});
                        }
                    }]
                },
                {
                    name:"addLine",
                    actions:[{
                        action:({k})=>{
        
                            var fields = k.Fields_GetAll();
                            var y = fields[0].boxs.length-1;
                            wn.#FieldByTable({k,y,fieldNameField:"field",fieldNameTable:"table"});
                        }
                    }],
                }
            ],
        });

        this.#lst_joins = new List({
            parent:this.#wnd_request.Conteiner_GetColData({x:0,y:3}).col,
            fields:[
                {name:"main-table",box:{tipe:8,options:this.#op_tables}},
                {name:"main-field",box:{tipe:3}},
                {name:"join-table",box:{tipe:8,options:this.#op_tables}},
                {name:"join-field",box:{tipe:3}},
                {name:"tipe",box:{tipe:3,options:this.#op_joinTipes,value:"LEFT"}},
            ],
            events:[
                {
                    name:"boxUpdate",
                    actions:[{
                        action:({field,k,y})=>{
        
                            if(field.name=="main-table"){
        
                                wn.#FieldByTable({k,y,fieldNameField:"main-field",fieldNameTable:"main-table"});
                            }

                            if(field.name=="join-table"){
        
                                wn.#FieldByTable({k,y,fieldNameField:"join-field",fieldNameTable:"join-table"});
                            }
                        }
                    }]
                },
                {
                    name:"addLine",
                    actions:[{
                        action:({k})=>{
        
                            var fields = k.Fields_GetAll();
                            var y = fields[0].boxs.length-1;

                            wn.#FieldByTable({k,y,fieldNameField:"main-field",fieldNameTable:"main-table"});
                            wn.#FieldByTable({k,y,fieldNameField:"join-field",fieldNameTable:"join-table"});
                        }
                    }],
                }
            ],
        });

    }

    SetTableData({tablesData}) {
        
        this.#tbData = tablesData;
        this.#op_tables = this.#tbData.map((t)=>{return {value:t.name,show:t.name}});
        
        //console.log("bx_tableMain:",this.#bx_tableMain);
        this.#bx_tableMain.SetOptions(this.#op_tables);
        this.#bx_tableMain.SetValue(this.#op_tables[0].value);
        this.Event_TableMainUpdate({});

        this.#lst_selects.Field_SetOptions({fieldName:"table",options:this.#op_tables});
        this.#lst_conditions.Field_SetOptions({fieldName:"table",options:this.#op_tables});
        this.#lst_joins.Field_SetOptions({fieldName:"main-table",options:this.#op_tables});
        this.#lst_joins.Field_SetOptions({fieldName:"join-table",options:this.#op_tables});
    }

    Event_TableMainUpdate(params) {
    
        //console.log("eent");
        this.#lst_selects.Field_SetDefault({fieldName:"table",value:this.#bx_tableMain.GetValue()});
        this.#lst_conditions.Field_SetDefault({fieldName:"table",value:this.#bx_tableMain.GetValue()});
        this.#lst_joins.Field_SetDefault({fieldName:"main-table",value:this.#bx_tableMain.GetValue()});
        this.#lst_joins.Field_SetDefault({fieldName:"join-table",value:this.#bx_tableMain.GetValue()});
    }

    #FieldByTable({k,y,fieldNameField,fieldNameTable}){

        var fields = k.Fields_GetAll();
        var f_table = fields.find(f=>f.name==fieldNameTable);
        var f_field = fields.find(f=>f.name==fieldNameField);

        var v_table = f_table.boxs[y].GetValue();

        var tableDataFound = this.#tbData.find(t=>t.name==v_table);
        if(tableDataFound){

            var op_fields = tableDataFound.fields.map((f)=>{return{value:f["Field"],show:f["Field"]}});
            var v_field = op_fields[0].value;

            var bx_field = f_field.boxs[y];
            bx_field.SetOptions(op_fields);
            bx_field.SetValue(v_field);
        }
    }
    
}