
class windowCrud extends ODD {

    constructor(i){

        super(i);
        this.#Build(i);
    }

    #op_states = [
        {value:"reload",show:"reload"},
        {value:"new",show:"new"},
        {value:"block",show:"block"},
    ];
    #ops_tools = [
        {name:"config"},
        {name:"load"},
        {name:"excel"},
        {name:"pdf"},
        {name:"sizes"},
        {name:"reload"},
        {name:"update"},
        {name:"new"},
        {name:"insert"},
        {name:"cancel"},
        {name:"pages"},
    ];

    #stps=null;

    #Build({parent}){

        this.#stps = new Steps({
            parent,
            steps:[
                {
                    name:"form",
                    window:{
                        grid:{
                            cols:[
                                [12],//0-title
                                [6,6],//1-states
                                [12],//2-panels
                                [12],//3-tools
                            ],
                            labels:[
                                {x:0,y:0,name:"title",box:{tipe:1,value:"titulo",class:"w-100"}},
                                {x:0,y:1,name:"stateStart",box:{tipe:3,value:"reload",options:this.#op_states,class:"w-100"}},
                                {x:1,y:1,name:"stateBase",box:{tipe:3,value:"reload",options:this.#op_states,class:"w-100"}},
                            ],
                        }
                    },
                },
                {
                    name:"conection",
                    window:{
                        grid:{cols:[[12]]},
                    }
                },
                {
                    name:"request",
                    window:{
                        grid:{
                            cols:[
                                [12],
                            ],
                        }
                    },
                },
                {
                    name:"loads",
                    window:{
                        title:"loads",
                        cols:[
                            [12],
                        ],
                    },
                },
                {
                    name:"filters",
                    window:{
                        grid:{
                            cols:[
                                [12],
                            ],
                        }
                    },
                },
                {
                    name:"fields",
                    window:{
                        title:"fields",
                        cols:[
                            [12],
                        ],
                    },
                },
                {
                    name:"events",
                    window:{
                        title:"events",
                        cols:[
                            [12],
                        ],
                    },
                },
            ],
            stepName:"fields",
        });
        //this.#stps.SetStepIndex({stepName:"request"});

        this.#Build_Conection({});
        this.#Build_Form({});
        this.#Build_Request({});
        this.#Build_Fields({});
    }

    #fm_lst_panels = null;

    #Build_Form({}){

        var prnt_panels = this.#stps.GetStep({stepIndex:0}).window.Conteiner_GetColData({x:0,y:2}).col;
        var prnt_tools = this.#stps.GetStep({stepIndex:0}).window.Conteiner_GetColData({x:0,y:3}).col;

        new List({
            parent:prnt_panels,
            fields:[
                {name:"col",box:{tipe:1,value:12}},
                {name:"y",box:{tipe:1,value:"0"}},
                {name:"title",box:{tipe:1,value:"main"}},
                {name:"tipo",box:{tipe:3,value:"form",options:[{value:"form",show:"form"},{value:"table",show:"table"},]}},
            ],
            data:[
                {fieldName:"col",values:[12]},
                {fieldName:"y",values:[0]},
                {fieldName:"title",values:["main"]},
                {fieldName:"tipo",values:["form"]},
            ],
        });

        var stps_states = new Steps({
            parent:prnt_tools,
            steps:this.#op_states.map((st)=>{
        
                return {
                    name:st.show,
                    grid:{cols:[[12]]},
                }
            }),
        });

        for (let st = 0; st < this.#op_states.length; st++) {
    
            const state = this.#op_states[st];
            var data = [
                {fieldName:"name",values:[]},
                {fieldName:"show",values:[]},
                {fieldName:"value",values:[]},  
            ];
        
            data[0].values = this.#ops_tools.map((t)=>{
        
                return t.name;
            });
            data[1].values = this.#ops_tools.map((t)=>{
        
                if(state.show=="reload"){
        
                    if(t.name == "insert")return 0;
                    if(t.name == "cancel")return 0;
                }
        
                if(state.show=="new"){
        
                    if(t.name != "insert"&&t.name != "cancel")return 0;
                }
        
                return state.show == "block" ? 0 : 1;
            });
            data[2].values = this.#ops_tools.map((t)=>{
        
                if(t.name == "sizes") return 1;
                if(t.name == "pages") return 1;
        
                return "";
            });
        
            //console.log("toolData:",data);
            
            new List({
                parent:stps_states.GetStep({stepIndex:st}).window.Conteiner_GetColData({x:0,y:0}).col,
                fields:[
                    {name:"name",box:{tipe:1}},
                    {name:"show",box:{tipe:6,name:"show",value:0}},
                    {name:"value",box:{tipe:1,class:"w-100",value:""}},
                ],
                data,
            });
        }
    }

    
    #Build_Conection({}){

        let k = this;
        var parent = this.#stps.GetStep({stepName:"conection"}).window.Conteiner_GetColData({x:0,y:0}).col;
        new windowConection({
            parent,
            success:({tables})=>{

                k.#Event_LoadedTables({tables});
            }
        })
    }

    #Event_LoadedTables({tables}){

        //console.log("event load tables",tables);
        this.#rsq_window.SetTableData({tablesData:tables});
    }

    #rsq_window = null;
    #Build_Request({}){

        var w_request = this.#stps.GetStep({stepName:"request"}).window;
        this.#rsq_window = new windowRequest({
            parent:w_request.Conteiner_GetColData({x:0,y:0}).col,
        });
    }

    #fld_list = null;
    #Build_Fields({}){

        this.#fld_list = new List({
            parent:this.#stps.GetStep({stepName:"fields"}).window.Conteiner_GetColData({x:0,y:0}).col,
            fields:[

                {name:"panel",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 150px;"}]},
                {name:"col",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 70px;"}]},
                {name:"y",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 70px;"}]},

                {name:"name",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 150px;"}]},

                {name:"box-tipe",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 100px;"}]},
                {name:"box-value",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 70px;"}]},
                {name:"box-options",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 100px;"}]},

                {name:"attribute-class",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 200px;"}]},
                {name:"attribute-style",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 200px;"}]},

                {name:"select",box:{tipe:1,class:"w-100"},attributes:[{name:"style",value:"min-width: 150px;"}]},
            ],
        })
    }
    
    
}

new windowCrud({});




