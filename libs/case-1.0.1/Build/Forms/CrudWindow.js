
class CrudWindow extends ODD {

    constructor(i){

        super(i);
        this.#SetVariables(i);
        this.#Build(i);

        this.#Update_OpsPanels();
        this.#Update_OpsTables();
        this.#Update_OpsSelects();
    }

    #SetVariables({}){

    }

    #stps_conteiner;
    #ops_boxs = [
        {show:"div",value:"div"},
        {show:"input",value:"input"},
        {show:"date",value:"date"},
        {show:"options",value:"options"},
        {show:"selects multiple",value:"selects multiple"},
        {show:"buttons",value:"buttons"},
        {show:"check",value:"check"},
        {show:"switch",value:"switch"},
        {show:"search",value:"search"},
        {show:"text area",value:"text area"},
    ];
    #ops_tool_position = [
        {show:"",value:""},
    ];
    #ops_tipe = [
        {show:"modulo",value:"modulo"},
        {show:"table",value:"table"},
    ];

    //-----body-----
    //tools
    //panels (window, tables)
    //fields
    #wn_body;
    #lst_tools;
    #lst_panels;
    #ops_panels;

    #Update_OpsPanels(){

        var data = this.#lst_panels.GetData();
        var ops = data.map((line)=>{

            var v = line[2];
            return {show:v,value:v};
        });
        this.#ops_panels = ops;
        
        this.#lst_fields.SetOptionsToField({fieldName:"panel",options:this.#ops_panels});
    }

    //----request-----
    //tablemain
    //loads
    //selects
    //conditions
    //joins

    #wn_request;

    #wn_tableMain;
    #bx_tableMain;
    #ops_tables;
    #data_tables;

    #lst_selects;
    #ops_selects;

    #lst_conditions;
    #lst_joins;

    #Update_OpsSelects(){

        var data = this.#lst_selects.GetData();
        var ops = data.map((line)=>{

            var v = line[2];
            return {show:v,value:v};
        });
        this.#ops_selects = ops;
    }

    #Update_OpsTables(){

        if(this.#data_tables == null) return;

        var ops = this.#data_tables.map((t)=>{

            var v = t.name;
            return {show:v,value:v};
        });
        this.#ops_tables = ops;

        this.#bx_tableMain.SetOptions(this.#ops_tables);;
        this.#lst_selects.SetOptionsToField({fieldName:"table",options:this.#ops_tables});
    }

    #GetFieldsOpsByTableName({tableName}){

        console.log(tableName,this.#data_tables);
        var data_table = this.#data_tables.find(tb=>tb.name==tableName);
        var ops = data_table.fields.map((t)=>{

            var v = t.Field;
            return {show:v,value:v};
        });

        return ops;
    }

    #SetFieldsOptionsToList({list,field,y,tableFieldName,fieldFieldName}){

        if(field.name == tableFieldName){   

            var tableName = list.GetValue({fieldName:tableFieldName,y});
            var ops = this.#GetFieldsOpsByTableName({tableName});
            list.SetOptionsToField({fieldName:fieldFieldName,options:ops,y});
        }
    }

    #Update_Selects(){

        var data = this.#lst_selects.GetData();
        var ops = data.map((line)=>{

            var v = line[2];
            return {show:v,value:v};
        });
        this.#ops_selects = ops;
        
        this.#lst_fields.SetOptionsToField({fieldName:"print",options:this.#ops_selects});
    }


    //-----crud----
    //fields
    //state
    #wn_crud;
    #lst_fields;
    #wn_state;
    #lst_states;
    #lst_filters;

    #Build({parent}){

        this.#stps_conteiner = new Steps({parent,steps:[
            {name:"body",window:{grid:{cols:[[12],[12]]}}},
            {name:"request",window:{grid:{cols:[[12],[12],[12],[12],[12],[12],]}}},
            {name:"crud",window:{grid:{cols:[[12],[12],[12],[12],[12]]}}},
        ]});
        this.#stps_conteiner.SetStepIndex({stepIndex:1});

        this.#Build_Body({});
        this.#Build_Request({});
        this.#Build_State({});
    }

    #Build_Body({}){

        let u = this;
        this.#wn_body = this.#stps_conteiner.GetStep({stepIndex:0}).window;
        
        this.#lst_panels = new List({
            parent: this.#wn_body.Conteiner_GetColData({x:0,y:0}).col,
            title:"panels",show:true,blocked:false,
            fields:[
                {name:"col",box:{tipe:1,class:"w-100"}},
                {name:"y",box:{tipe:1,class:"w-100"}},
                {name:"name",box:{tipe:1,class:"w-100"}},
                {name:"tipe",box:{tipe:3,class:"w-100"}},
            ],
            data:[
                [12,0,"main","form"]
            ],
            events:[
                {
                    name:"boxUpdate",
                    actions:[
                        {
                            action:()=>{

                                u.#Update_OpsPanels();
                            }
                        }
                    ],
                }
            ],
        });

        this.#lst_tools = new List({
            parent: this.#wn_body.Conteiner_GetColData({x:0,y:1}).col,
            title:"tools",show:true,blocked:false,
            fields:[
                {name:"show",box:{tipe:6,name:"show",class:"w-100"}},
                {name:"name",box:{tipe:0,class:"w-100"}},
                {name:"box",box:{tipe:0,class:"w-100",options:this.#ops_boxs}},
                {name:"value",box:{tipe:0,class:"w-100"}},
                {name:"class",box:{tipe:0,class:"w-100"}},
            ],
            delet:false,index:true,add:false,
            data:[
                [1,"load","button","icon.db","btn btn-outline-primary"],
                [1,"settings","button","icon.settings","btn btn-outline-primary"],

                [0,"excel","button","icon.excel","btn btn-outline-primary"],
                [0,"pdf","button","icon.pdf","btn btn-outline-primary"],

                [1,"sizes","options","1","btn btn-outline-primary"],

                [1,"reload","button","recargar","btn btn-outline-primary"],
                [1,"update","button","actualizar","btn btn-outline-primary"],
                [1,"new","button","nuevo","btn btn-outline-primary"],
                [0,"insert","button","añadir","btn btn-outline-primary"],
                [0,"delete","button","borrar","btn btn-outline-danger"],
                [0,"clear","button","limpiar","btn btn-outline-primary"],
                [0,"cancel","button","cancelar","btn btn-outline-danger"],

                [1,"page","options","1","btn btn-outline-primary"],
            ],
        });
    }

    #Build_Request({}){

        let u = this;

        this.#wn_request = this.#stps_conteiner.GetStep({stepIndex:1}).window;

        this.#wn_tableMain = new Window({
            parent:this.#wn_request.Conteiner_GetColData({x:0,y:0}).col,
            title:"table main",blocked:false,show:true,h:0,
            grid:{
                cols:[[12]],
                labels:[
                    {x:0,y:0,name:"table Main",box:{tipe:3,class:"w-100"}},
                ],
            }
        });
        this.#bx_tableMain = this.#wn_tableMain.Conteiner_GetColData({x:0,y:0}).labels[0].GetBox();

        this.#lst_selects = new List({
            parent:this.#wn_request.Conteiner_GetColData({x:0,y:1}).col,
            title:"selects",blocked:false,show:true,
            fields:[
                {name:"table",box:{tipe:3,class:"w-100"}},
                {name:"field",box:{tipe:3,class:"w-100"}},
                {name:"as",box:{tipe:1,class:"w-100"}},
            ],
            events:[
                {
                    name:"boxUpdate",
                    actions:[
                        {
                            action:({k,field,y})=>{

                                u.#SetFieldsOptionsToList({
                                    list:k,
                                    field:field,
                                    y,
                                    tableFieldName:"table",
                                    fieldFieldName:"field",
                                });

                                if(field.name == "field" || field.name == "table"){

                                    var t = k.GetValue({fieldName:"table",y});
                                    var f = k.GetValue({fieldName:"field",y});
                                    var nm = t+"-"+f;
                                    k.SetValue({fieldName:"as",value:nm,y});

                                    u.#Update_Selects();
                                }
                            }
                        }
                    ]
                }
            ]
        });

        this.#lst_conditions = new List({
            parent:this.#wn_request.Conteiner_GetColData({x:0,y:2}).col,
            title:"conditions",blocked:false,show:false,
            fields:[
                {name:"table",box:{tipe:3,class:"w-100"}},
                {name:"field",box:{tipe:3,class:"w-100"}},
                {name:"condition",box:{tipe:3,class:"w-100"}},
                {name:"value",box:{tipe:1,class:"w-100"}},
                {name:"next",box:{tipe:3,class:"w-100"}},
            ],
        });

        this.#lst_joins = new List({
            parent:this.#wn_request.Conteiner_GetColData({x:0,y:3}).col,
            title:"joins",blocked:false,show:false,
            fields:[
                {name:"table_main",box:{tipe:3,class:"w-100"}},
                {name:"field_main",box:{tipe:3,class:"w-100"}},
                {name:"table_join",box:{tipe:3,class:"w-100"}},
                {name:"field_join",box:{tipe:3,class:"w-100"}},
            ],
        });

    }

    #Build_State({}){

        this.#wn_crud = this.#stps_conteiner.GetStep({stepIndex:2}).window;

        this.#wn_state = new Window({
            parent: this.#wn_crud.Conteiner_GetColData({x:0,y:0}).col,
            title:"state",head:true,blocked:false,show:false,
            grid:{
                cols:[[12],[12]],
                labels:[
                    {x:0,y:0,name:"state",box:{tipe:3,class:"w-100"}},
                ],
            },
        });

        this.#lst_states = new List({
            parent: this.#wn_state.Conteiner_GetColData({x:0,y:1}).col,
            title:"states",head:false,
            delet:false,index:true,
            fields:[
                {name:"state",box:{tipe:0,class:"w-100"}},
            ],
            data:[
                ["reload"],
                ["new"],
                ["found"],
                ["block"],
            ],
        })

        this.#lst_fields = new List({
            parent: this.#wn_crud.Conteiner_GetColData({x:0,y:1}).col,
            title:"fields",blocked:false,show:true,
            fields:[
                {name:"panel",box:{tipe:3,class:"w-100"}},
                {name:"name",box:{tipe:1,class:"w-100"}},
                {name:"box",box:{tipe:3,options:this.#ops_boxs,class:"w-100"}},
                {name:"print",box:{tipe:3,class:"w-100"}},
                //{name:"primary",box:{tipe:1,class:"w-100"}},
            ],
            data:[
                ["main","field 1","input","primary"]
            ],
        });

        this.#lst_filters = new List({
            parent: this.#wn_crud.Conteiner_GetColData({x:0,y:2}).col,
            title:"filters",blocked:false,show:true,
            fields:[
                //{name:"panel",box:{tipe:3,class:"w-100"}},
                {name:"name",box:{tipe:1,class:"w-100"}},
                {name:"box",box:{tipe:3,options:this.#ops_boxs,class:"w-100"}},
                {name:"table",box:{tipe:1,class:"w-100"}},
                {name:"field",box:{tipe:1,class:"w-100"}},
                {name:"inter",box:{tipe:1,class:"w-100"}},
            ],
        });
    }

    SetTables({tables}){

        this.#data_tables = tables;
        //console.log("set tables", tables);
        this.#Update_OpsTables();
    }

    Print({tableMain,selects,conditions,fields,filters}){

        //console.log("print",tableMain,selects,conditions,fields,filters);
        //console.log(this.#bx_tableMain);

        if(tableMain!=null) this.#bx_tableMain.SetValue(tableMain);
        if(selects!=null) this.#lst_selects.Print({data:selects});
        if(conditions!=null) this.#lst_conditions.Print({data:conditions});

        if(fields!=null)this.#lst_fields.Print({data:fields});
        //if(filters!=null)this.#lst_filters.Print({data:filters});
    }
}