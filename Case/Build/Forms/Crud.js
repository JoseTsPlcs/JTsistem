
class Crud extends ODD {
nt
    /* 
        body: [form body]
        ->states
        ->
    */

    constructor(i){

        super(i);
        var newInfo = this._General_GetParams(i);
        this._General_Start(newInfo);
    }

    //------ODD-----

    _General_GetParams(i){

        var fields = i.fields;
        if(fields==null) fields=[];

        if(i.windows!=null){

            i.windows.forEach(window => {
                
                window.fields.forEach(field => {
                    
                    fields.push(field);
                });
                
            });
        }
        i.fields = fields;

        return {...i};
    }

    _General_Start(i){

        let k = this;

        
        //buil sql request
        this.#Sql_Build({title:i.title,tables:i.tables});

        //set variables
        this.#General_SetVariables({...i});

        //build form body
        this.#Body_Build({...i});
        
        //load data
        this.Loads_LoadAll({
            success:()=>{

                if(i.recive==null) k.States_SetStart({});
                else k.#Page_Recive({recive:i.recive});                
            }
        });
    }

    _tipe = "base";
    #General_SetVariables({tipe="base",fields=[],filters=[],loads=[],joins=[],selects=[],orders=[],states=[],triggers=[],stateDefault="reload",stateStart="reload",stateAfterInserted="reload",stateAfterSaved="reload",fieldsUpdateSave=true,newFieldsBlock=false}){

        //set values
        this.#Loads_Set({loads});
        this._joins = joins;
        this.Fields_Set({fields});
        this.#Selects_Set({extras:selects});
        this._filters = filters;
        this._orders=orders;

        this.#states.default = stateDefault;
        this.#states.start = stateStart;
        this.#states.afterInserted=stateAfterInserted;
        this.#states.afterSaved=stateAfterSaved;

        this.#newFieldsBlock = newFieldsBlock;

        this._tipe=tipe;

        this.States_SetStateTools({states});
    }

    //--------------body---------
    _body = null;
    #Body_Build({title,parent,filters,windows,fields,h=350,head,blocked=true,show,configShow=false,modal}){

        let k = this;

        var bodyparams = {
            headCrud:k,
            filters,
            configShow,
            title:title,
            id:title,
            modal,head,show,blocked,
            name:title+"_body",
            parent:parent,h,
            windows,
            fields,
            events:[
                {
                    name:"boxUpdate",
                    actions:[
                        {
                            name:"base",
                            action:(i)=>{

                                i.k=k;
                                //k.Fields_GetInfo({})
                                //console.log("crud->Call event boxupdate->i:",i);
                                k.CallEvent({name:"boxUpdate",params:{...i}});
                            }
                        }
                    ],
                },
                {
                    name:"reloadUpdate",
                    actions:[
                        {
                            name:"base",
                            action:()=>{

                                k.States_SetState({state:"reload"});
                            }
                        }
                    ]
                },
                {
                    name:"newUpdate",
                    actions:[
                        {
                            name:"base",
                            action:()=>{

                                k.States_SetState({state:"new"});
                            }
                        }
                    ]
                },
                {
                    name:"saveUpdate",
                    actions:[
                        {
                            name:"base",
                            action:()=>{

                                k.Update_Action({success:()=>{

                                    k.States_SetDefault();
                                }});
                            }
                        }
                    ]
                },
                {
                    name:"cancelUpdate",
                    actions:[
                        {
                            name:"base",
                            action:()=>{

                                k.Cancel_Action();
                            }
                        }
                    ],
                },
                {
                    name:"addUpdate",
                    actions:[
                        {
                            name:"base",
                            action:()=>{

                                k.Insert_Action();
                            }
                        }
                    ]
                },
            ],
        };

        switch(this._tipe){

            case "form":
            this._body = new Crud_Form({...bodyparams});
            break;

            case "table":
            this._body = new Crud_Table({...bodyparams});
            break;
        }

        //console.log("crud->body_build->body:",this._body,this._tipe);
        this._fields.forEach(field => {

            var boxes = k._body.Fields_GetBoxes({fieldName:field.name});
            field.boxes = boxes;
        });        
    }

    #Body_Filter_SetOptionsToFilter({filterName,options}){

        var box = this._body.Config_Filters_GetBox({filterName});
        box.SetOptions(options);
        box.SetDefault();
    }

    #Body_Print({data=[]}){

        var e_resp = this.CallEvent({name:"printBefore",params:{data}});
        if(e_resp!=null&&e_resp.data!=null) data = e_resp.data;

        var resultPrint = [];
        let k = this;

        for (let y = 0; y < data.length; y++) {
            const line = data[y];
            
            var newLine = [];
            this._fields.forEach(field => {
                
                var fieldSelect = field.select;
                if(fieldSelect!=null){

                    var selectInfo = k.Selects_Get({selectIndex:fieldSelect.index});
                    //console.log("crud->body_print->foreach data-> foreach field->params; field:",field,"selectInfo",selectInfo);
                    var value = line[selectInfo.name];
                    newLine.push({
                        field:field,
                        y:y,
                        value:value,
                    });
                }

            });
            resultPrint.push(newLine);
        }        

        this._body.Print({print:resultPrint});
        //console.log("crud->body_print->params; data:",data,"->result:",resultPrint,"e_resp:",e_resp);
        this.CallEvent({name:"printAfter",params:{data}});
    }

    Body_SetValue({fieldName,fieldIndex,y,value}){

        this._body.Fields_SetValue({y,fieldName,fieldIndex,value});
    }

    Body_GetValue({fieldName,fieldIndex,y}){

        return this._body.Fields_GetValue({y,fieldName,fieldIndex});
    }

    Body_GetWindow({windowIndex}){

        return this._body.Form_GetWindow({windowIndex}).build;
    }

    Body_Modal_SetActive({active=true}){

        this._body.Modal_SetActive({active});
    }

    //-----------------sql----------------------

    _joins = [];
    _sql = null;
    _mysql = null;
    _primary = {
        name:"primary",
        tableIndex:0,
        fieldSqlIndex:0,
        as:"ID",
        data:[],
    };
    _filters = [];

    #Sql_Build({title,tables}){

         //build sql that will use to do request to db
         this._sql = new Sql({name:(title+" [sql]"),logControl:[{name:"general",log:this.GetLogActive({logName:"sql"})}]});

         //build mysql that will to get sql by schema
         this._mysql = new Mysql({name:(title+" [mysql]"),logControl:[{name:"general",log:this.GetLogActive({logName:"mysql"})}]});
         this._mysql.AddTables({tables:tables});

         //set primary information
         var primaryFieldInfo = this._mysql.GetFieldPrimaryInfo({table:this._primary.tableIndex});
         this._primary.fieldSqlIndex = primaryFieldInfo["Index"];
         this._primary.as = primaryFieldInfo["Field"];
 
    }

    #Sql_Request({action=null,config=null,success,useScreen=true,logSql=false}){

        let k = this;
        if(useScreen) this.#ScreamLoad({show:true});
        this._sql.LoadByMysql({
            action:action,
            mysql:this._mysql,
            config:config,
            logSql:logSql,
            fail:(f)=>{

                k.#ScreamLoad({show:false});
                k.#Sql_Fail(f)
            },
            success:(resp)=>{

                k.#ScreamLoad({show:false});
                if(success!=null) success(resp);
            }
        });
    }

    #Sql_Fail(faiInformation){

        
        console.log(faiInformation);
    }

    //-----------------fields---------------

    _fields = [];
    Fields_GetInfo({fieldName,fieldIndex=0,fieldSqlIndex=null}){

        if(fieldName!=null)fieldIndex=this._fields.findIndex(f=>f.name==fieldName);
        if(fieldSqlIndex!=null)fieldIndex=this._fields.findIndex(f=>f.sql!=null&&f.sql.field==fieldSqlIndex);

        return this._fields[fieldIndex];
    }
    
    Fields_Set({fields}){

        for (let f = 0; f < fields.length; f++) {
            var field = fields[f];

            field.index = f;
            field.sql = Param_GetSql(field.sql);
            field.load = Param_GetLoad(field.load);
            field = Param_GetField(field);

            //console.log("crud->fields_set->foreach fields->params:",field);
        }

        this._fields = fields;
        //console.log("crud - fields_set, params:",fields);
    }
    
    //-------------loads-------------

    _loads = [];
    _loadsCount = 0;
    _loadsLoaded = false;

    #Loads_Set({loads=[]}){

        var index = 0;
        this._loads = loads.map((ld)=>{

            var request = ld;

            var setRequest = request!=null && (Number.isInteger(request)== true || Number.isInteger(request.tableIndex) == true);
            if(setRequest){
    
                var tableIndex = Number.isInteger(request)? request : request.tableIndex;
                request = {
                    table_main:tableIndex,
                    selects:[
                        {table:tableIndex,field:0,as:"value"},
                        {table:tableIndex,field:1,as:"show"},
                    ],
                }
            };

            index++;
            return {
                request,
                index:index-1,
                data:[],
            };
        });
        //console.log("crud->loads_set, params-> loads:",loads,"results-> _loads:",this._loads);
    }
 
    Loads_LoadAll({success}){

        this._loadsCount=0;
        this._loadsLoaded=false;
        this.#ScreamLoad({show:true});

        if(this._loads.length<=0) this.#Loads_Loaded({success:success});
        else
        {

            for (let ld = 0; ld < this._loads.length; ld++) {
                
                this.Loads_OneLoad({loadIndex:ld,success:success,useScreen:false});            
            }
        }
        
    }

    Loads_OneLoad({loadIndex,success,useScreen}){

        let k = this;
        var load = this._loads.find(ld=>ld.index==loadIndex);
        //console.log("crud->loads_oneload->loadindex:",loadIndex,"result; load:",load);
        this.#Sql_Request({
            useScreen:useScreen,
            action:"select",
            config:{...load.request},
            logSql:false,
            success:(data)=>{

                k.#Loads_OneLoaded({loadIndex:loadIndex,data:data,success:success});
            }
        })
    }

    #Loads_OneLoaded({loadIndex,data,success}){

        let k = this;

        var load = this._loads.find(ld=>ld.index==loadIndex);
        var e_resp = this.CallEvent({name:"oneLoadedBefore",params:{load,data}});

        //set data to load
        if(e_resp!=null&&e_resp.data!=null) data = e_resp.data;
        load.data = data;

        //sett options to load
        var options = k.#Loads_GetOptionsByData({data:data});
        load.options = options;
        //console.log("crud->loads_oneloeded->params:loadindex",loadIndex,"results->options:",options);

        //set loadoptions to fields
        this.#loads_SetOneLoadToFields({loadIndex});

        //set loadoptions to filter
        this.#loads_SetOneLoadToFilters({loadIndex});

        this._loadsCount++;
        if(this._loadsCount>=this._loads.length){

            this.#Loads_Loaded({success});
        }

        this.CallEvent({name:"oneLoaded",params:{load,data}});
    }

    #loads_SetOneLoadToFilters({loadIndex}){

        var load = this.Loads_Get({loadIndex});
        var options = load.options;

        var filters = this._body.Config_Filters_GetAll();
        var filtersSelecteds = filters.filter(f=>f.load!=null&&f.load.loadIndex==loadIndex); 

        //console.log("crud->loads_setloadtofilters->params; filters:",filters,"filtersSelecteds:",filtersSelecteds,"loadindex",loadIndex);

        let k = this;
        filtersSelecteds.forEach(filter => {
            
            //console.log("crud->loads_setloadtofilters->foreach filtersSelecteds, params: filter",filter);
            
            k.#Body_Filter_SetOptionsToFilter({filterName:filter.name,options});
        });
    }

    #loads_SetOneLoadToFields({loadIndex}){

        var load = this.Loads_Get({loadIndex});

        var fieldsSelecteds = this._fields.filter(f=>f.load!=null&&f.load.loadIndex==loadIndex); 
        //console.log("crud->loads_setloadtofields->params; fields:",this._fields,"fieldsSelecteds:",fieldsSelecteds,"load:",load);

        let k = this;
        fieldsSelecteds.forEach(field => {
            
            k._body.Fields_SetOptions({
                windowIndex:field.windowIndex,
                fieldName:field.name,
                options:load.options,
            });
        });
    }

    Loads_SetLoadsToFields({}={}){

        let k = this;
        this._loads.forEach(load => {
           
            k.#loads_SetOneLoadToFields({loadIndex:load.index});
        });
    }

    #Loads_Loaded({success}){

        this._loadsLoaded=true;
        this.#ScreamLoad({show:false});
        if(success!=null)success();
    }

    Loads_Get({loadIndex}){

        var loadFound = this._loads.find(ld=>ld.index==loadIndex);
        return loadFound;
    }

    Loads_GetData({loadIndex}){
        
        var loadData = this._loads.find(ld=>ld.index == loadIndex);
        return loadData.data;
    }

    #Loads_GetOptionsByData({data=[]}){

        var options = [];
        data.forEach(line => {
            
            options.push({
                value: line["value"],
                show: line["show"],
            });
        });

        return options;
    }

    //--------------states-------------

    #states = {
        data:[
            {name:"reload",tools:[
                {name:"config",show:true},
                {name:"load",show:true},
                {name:"sizes",show:true},
                {name:"reload",show:true},
                {name:"save",show:true},
                {name:"new",show:true},
                {name:"page_back",show:true},
                {name:"pages",show:true},
                {name:"page_next",show:true},
              ]},
              {name:"new",tools:[
                {name:"load",show:true},
                {name:"add",show:true},
                {name:"cancel",show:true},
              ]},
              {name:"block",tools:[
      
              ]},
        ],
        value:"reload",
        default:"reload",
        start:"reload",
        afterSaved:"reload",
        afterInserted:"reload",
    };

    #States_SetTools({stateName=null}){

        var stateData = this.#states.data.find(st=>st.name==stateName);
        if(stateData==null)return;

        this._body.Tools_Set({tools:stateData.tools});
    }

    States_SetDefault(params){

        if(this._recive!=null) PageSend({url:this._recive.from});
        this.States_SetState({state:this._stateDefault,params:params});        
    }

    States_SetStart(){

        this.States_SetState({state:this.#states.start});   
    }

    States_SetState({state="reload",params=null}){

        this.#States_SetTools({stateName:state});

        switch (state) {
            case "reload":
                this.Block_Action({active:false});
                this.Reload_Action({...params});
                break;

            case "new":
                this.New_Action({});
                break;

            case "block":
                this.Block_Action({active:true});
                break;
        
            default:
                break;
        }
        this._state = state;
        this.CallEvent({name:"setState",params:{state}});
    } 
    
    States_SetToolsData({name,tools}){

        var stateDataIndex = this.#states.data.findIndex(st=>st.name==name);
        var stateData = this.#states.data[stateDataIndex];

        tools.forEach(tool => {
            
            var tooldataIndex = stateData.tools.findIndex(t=>t.name==tool.name);
            if(tooldataIndex!=-1){

                stateData.tools[tooldataIndex] = tool;
            }else
            {
                stateData.tools.push(tool);
            }
        });
    }

    States_SetStateTools({states=[]}){

        let k = this;
        states.forEach(st => {
            
            k.States_SetToolsData({
                name:st.name,
                tools:st.tools,
            });
        });
    }

    //------------data------------

    #data = [];
    #Data_SetData({data=[]}){

        this.#data = data;
    }

    Data_GetValue({y,selectName}){

        var values = this.Data_GetValues({selectName});
        var value = values[y];
        //console.log("crud->data_getvalues->params; y:",y,"->result; values:",values,"value:",value);
        return value;
    }

    Data_GetValues({selectName}){

        var select = this.Selects_Get({selectName});
        var values = this.#data.map((di)=>{return di[select.name]});
        //console.log("crud->data_getvalues->params;selectName:",selectName,"results; select",select,"values:",values);
        return values;
    }

    //--------------selects-----------

    #selects = [];

    #Selects_Set({extras=[]}){
        
        //--------add request------

        this.#Selects_Add({
            table:this._primary.tableIndex,
            field:this._primary.fieldSqlIndex,
            name:this._primary.name,
        });

        //extras
        extras.forEach(ext => {
            
            this.#Selects_Add({
                table:ext.table,
                field:ext.field,
                name:ext.as,
            })
        });

        //fields
        this._fields.forEach(field => {

            //console.log("crud->selects_set->foreach fields->params: field",field);

            if(field.sql!=null){

                var selectIndex = this.#Selects_Add({
                    field:field.sql.field,
                    table:field.sql.table,
                    name:field.name,
                });
                field.select = {index:selectIndex};
            }

            if(field.selectName!=null){

               var selectIndex = this.#selects.findIndex(slc=>slc.name==field.selectName);
               field.select = {index:selectIndex};
            }
        });
    }

    #Selects_Add({table,field,name}){

        var index = this.#selects.findIndex(slc=>slc.table==table&&slc.field==field);
        if(index==-1){

            index  = this.#selects.length;
            this.#selects.push({table,field,name,index});
        }

        return index;
    }

    Selects_Get({selectName,selectIndex}){

        var index = selectIndex;
        if(selectName!=null)index=this.#selects.findIndex(slc=>slc.name==selectName);        

        var result = this.#selects[index];

        //console.log("crud->selects_get->params; selectName:",selectName,"selectIndex:",index);

        return result;
    }

    //---------reload------------

    _orders=[];

    Reload_Action({lastPage=false}={}){

        let k = this;
        
        var selects = this.#selects.map((slc)=>{
            return {
                table:slc.table,
                field:slc.field,
                as:slc.name,
            }
        });

        var conditions=[];
        //get conditions by conection
        if(this._conections.length>0){

            var conectionsCondition = {
                and:true,
                conditions:[],
            };

            this._conections.forEach(cn => {
                
                conectionsCondition.conditions.push({
                    table:0,
                    field:cn.fieldSqlIndex,
                    inter:"=",
                    value:cn.value,
                });
            });

            conditions.push(conectionsCondition);
        };

        //get conditions by filters
        var filterConditions = k._body.Config_Filters_GetConditions();
        //console.log("crud->reload_action->result; filterconditions:",filterConditions);
        conditions=[...conditions,...filterConditions];
        
        var joins = [...this._joins];

        //console.log("crud->reload_action->param; selects:",selects,"conditions:",conditions);
        
        //calculate size of all data and set pages
        k.#Reload_SetPages({
            conditions:conditions,
            joins:joins,
            orders:k._orders,
            success:()=>{  

                var pagesBox = k._body.Form_GetBuild().Tools_GetBox({name:"pages"});
                var sizesBox = k._body.Form_GetBuild().Tools_GetBox({name:"sizes"});

                if(lastPage) pagesBox.SetLastOption();

                //calculate limit
                var page = parseInt(pagesBox.GetValue());
                var size = parseInt(sizesBox.GetValue()); 
                var limit = [(page-1)*size,size];

                //request sql data of reload
                k.#Sql_Request({
                    action:"select",
                    config:{
                        table_main:0,
                        selects:selects,
                        conditions:conditions,
                        joins:joins,
                        limit:limit,
                    },//logSql:true,
                    success:(data)=>{
                        
                        //print the resp
                        k.#Data_SetData({data:data});
                        k.#Body_Print({data:data});
                        k.CallEvent({name:"reloaded",params:{data:data}});
                    }
                });
            }
        });
    }

    //set pages by the size of all data
    #Reload_SetPages({success,conditions=[],joins=[]}){

        let k = this;
        //get size of data
        this.#Sql_Request({
            action:"select",
            config:{
                selects:[
                    {
                        table:0,
                        field:this._primary.fieldSqlIndex,
                        as:"size",
                        action:"count"
                    },
                ],
                table_main:0,
                conditions:conditions,
                joins:joins,
            },
            //logSql:true,
            success:(data)=>{

                //calculate number of pages
                var sizesBox = k._body.Tools_GetBox({name:"sizes"});
                var pagesBox = k._body.Tools_GetBox({name:"pages"});


                var sizeTotal = parseInt(data[0]["size"]);
                var size = parseInt(sizesBox.GetValue());
                var PagesTotal = Math.ceil(sizeTotal/size);
                if(PagesTotal<=0) PagesTotal = 1;

                //set pages to tool
                var pagesOptions = [];
                for (let pg = 1; pg <= PagesTotal; pg++) {
                    
                    pagesOptions.push({
                        value:pg,
                        show:"pag " + pg,
                    });
                }
                
                var lastPage = pagesBox.GetValue(); 
                //console.log("last page",lastPage,"pages",PagesTotal);
                if(lastPage > PagesTotal) lastPage = PagesTotal;

                pagesBox.SetOptions(pagesOptions);
                pagesBox.SetValue(lastPage);
                

                if(success!=null)success({});
            }
        });
    }

    //---------------new------------

    #newFieldsBlock = false;
    New_Action({}={}){

        this._body.FieldsUpdate_Clear();
        this._body.Clear({});
        this._body.Block({active:this.#newFieldsBlock});
        this.CallEvent({name:"newed"});
    }

    Block_Action({active=true}={}){

        this._body.Block({active});
    }

    //--------------insert---------------

    Insert_Action({inserts=[],addConections=true,addFields=true}={}){

        let k = this;
        //push by conections
        if(addConections){

            inserts = this.#Insert_Action_PushToInserts({
                base:inserts,
                add:this.#Insert_GetInsertsByConections({}),
            });
        }

        //push to insert by fields
       if(addFields){

        var insertsByFields = [];

        for (let f = 0; f < this._fields.length; f++) {

            const field = this._fields[f];
            var boxes = field.boxes
            if(field.sql!=null && boxes!=null){

                boxes.forEach(bx => {
                    
                    insertsByFields.push({
                        field:field.sql.field,
                        value:bx.GetValue(),
                    });
                });
            }
        }

        inserts = this.#Insert_Action_PushToInserts({base:inserts,add:insertsByFields});
       }

        //calculate new id
        this.#Sql_Request({
            action:"select",
            config:{
                selects:[
                    {
                        table:this._primary.tableIndex,
                        field:this._primary.fieldSqlIndex,
                        as:"max",
                        action:"max"
                    },
                ],
                table_main:0,
            },
            logSql:false,
            success:(data)=>{

                var max = data[0]["max"];
                if(max==null) max=0;
                var newPrimary = parseInt(max)+1;

                //push to insert newprimary
                  
                //delete all inserts that have primaryfieldindex
                for (var i = inserts.length - 1; i >= 0; --i) {
                    if (inserts[i].field == k._primary.fieldSqlIndex){
                        inserts.splice(i,1);
                    }
                }
                //insert primaryfield value -> new primary
                inserts=k.#Insert_Action_PushToInserts({
                    base:inserts,
                    add:[{
                        field:k._primary.fieldSqlIndex,
                        value:newPrimary,
                    }]
                });

                k.#Sql_Request({
                    action:"insert",
                    config:{
                        table_main:this._primary.tableIndex,
                        inserts:inserts,
                    },
                    logSql:false,
                    success:()=>{

                        k.CallEvent({name:"inserted",params:{newPrimary:newPrimary,fieldIndexPrimary:k._primary.fieldSqlIndex}});
                        k.States_SetState({state:k._stateAfterInserted,params:{lastPage:true}});
                        //k.States_SetDefault({primaryValue:newPrimary,params:{lastPage:true}});
                    }
                });

            }
        });
    }    

    #Insert_Action_PushToInserts({base=[],add=[]}){

        var result = [...base];

        add.forEach(a => {
            
            var found = base.find(b=>b.field == a.field);
            if(found==null) result.push(a);
        });

        return result;
    }

    #Insert_GetInsertsByConections({}={}){

        return this._conections.map(cn=>{

            return {
                field:cn.fieldSqlIndex,
                value:cn.value,
            }
        });

    }

    //--------------update-----------------

    #fieldsUpdate = {
        data:[],
        total:0,
        count:0,
        save:true,
    }

    Update_Action({success}={}){

        this.#fieldsUpdate.data = this._body.FieldsUpdate_GetData();
        this.#fieldsUpdate.total = this.#fieldsUpdate.data.length;
        this.#fieldsUpdate.count = 0;
        this.#fieldsUpdate.save = false;

        if(this.#fieldsUpdate.total>0){

            this.#fieldsUpdate.data.forEach(fup => {

                this.#Update_OneLoad({fieldUpdate:fup,success});
            });
            
        }else this.#Update_Success({success});     
    }

    #Update_OneLoad({fieldUpdate,success}){

        let k = this;

        //console.log("crud->update_oneload->params; fieldupdate:",fieldUpdate);
        
        var sets = [];
        fieldUpdate.fields.forEach(fup => {
            
            var field = k.Fields_GetInfo({fieldIndex:fup.fieldIndex});
            var sql = field.sql;
            if(sql!=null&&sql.table==k._primary.tableIndex){

                sets.push({
                    field:sql.field,
                    value:fup.value,
                });
            }
            
        });

        this.#Sql_Request({
            action:"update",
            config:{
                table_main:k._primary.tableIndex,
                sets:sets,
                conditions:[{
                    and:true,
                    conditions:[{
                        table:k._primary.tableIndex,
                        field:k._primary.fieldSqlIndex,
                        inter:"=",
                        value:this.Data_GetValue({selectName:k._primary.name,y:fieldUpdate.y}),
                    }]
                }],
            },logSql:true,
            success:()=>{

                k.#Update_OneLoaded({fieldUpdate,success})
            }
        })
    }

    #Update_OneLoaded({fieldUpdate,success}){

        this.#fieldsUpdate.count++;
        this.#fieldsUpdate.data.splice(fieldUpdate.index, 1);

        if(this.#fieldsUpdate.count >= this.#fieldsUpdate.total){

            this.#Update_Success({success});
        }
    }

    #Update_Success({success}){

        //this.#FieldsUpdate_Clear();
        this.CallEvent({name:"updated",params:{}});
        if(success!=null)success({});
        this.States_SetState({state:this._stateAfterSaved});
        //this.States_SetDefault({});
    }

    //----------------delete-------------

    Delete_Action({y=-1,primaryValue,conditions=[],success}){

        //condition by primary
        if(y!=-1) primaryValue = this.Data_GetValue({selectName:this._primary.name,y});

        if(primaryValue!=null){

            conditions.push({
                and:true,
                conditions:[{
                    table:this._primary.tableIndex,
                    field:this._primary.fieldSqlIndex,
                    inter:"=",
                    value:primaryValue,
                }],
            });
        }
        
        
        let k = this;
        this.#Sql_Request({
            action:"delete",
            config:{
                table_main:k._primary.tableIndex,
                conditions:conditions,
            },
            success:()=>{

                k.CallEvent({name:"deleted",params:{primaryValue,y}});
                k.States_SetDefault({});
                if(success!=null) success();
            },
        });

    }

    //------------------cancel-------------

    Cancel_Action({}={}){

        this.CallEvent({name:"canceled"});
        this.States_SetDefault();
    }

    //----------------conections-----------

    _conections = [
        /*{
            name:"",
            fieldSqlIndex:0,
            value:0,
        }*/
    ]

    Conection_SetConection({name,fieldSqlIndex,value}){
        
        var conectionIndex = this._conections.findIndex(cnx=>cnx.name==name);
        if(conectionIndex==-1){

            this._conections.push({name:name,fieldSqlIndex:fieldSqlIndex,value:value});
        }else
        {
            if(fieldSqlIndex!=null) this._conections[conectionIndex].fieldSqlIndex=fieldSqlIndex;
            if(value!=null) this._conections[conectionIndex].value=value;
        }
    }

    //-----------------page------------

    _recive = null;

    #Page_Recive({recive}){

        this._recive=recive;

        if(this._recive.conections!=null){

            this._recive.conections.forEach(cnx => {
                
                this.Conection_SetConection({...cnx});
            });
        }

        this.States_SetState({...this._recive});
    }

    //-----------------Public Functions--------

    #ScreamLoad({show=true}){

        if(this._body!=null){
            
            this._body.Form_GetBuild().LoadScreen_SetState({show:show});
        }
    }
    
}