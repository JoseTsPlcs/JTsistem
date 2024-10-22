
class Crud_Master extends ODD {

    constructor(i){

        super(i);

        this.#SetVariables(i);
        this.#Build(i);

        let k = this;

        this.#Load({
            success:()=>{

                
                k.SetState({stateName:this.#stateData.stateStart});
                k.#Event_StateSetFirst({});
            }
        });        
    }

    #ctr_log = {
        state:false,
        reloadSize:false,
        reload:false,
        update:false,
        insertPrimary:false,
        insert:false,
        delete:false,
    }

    #SetVariables({stateTools=[],questions=[],stateStart="reload",afterCancel="reload",afterDelete="reload",afterInsert="reload",afterUpdate="reload",newLinesStart=1,newActive=true,tableMain,selects,joins,inserts=[],orders=[],conditions=[],fields=[],filters=[],loads=[],insertNoAddFields=false,updateCurrent,panels=[]}){

        this.#conection = db_lip;
        this.#tableMain = tableMain;
        this.#selects = selects;
        this.#joins = joins;
        this.#conditions = conditions.filter(cnd=>cnd!=null);
        this.#orders = orders;
        this.#inserts = inserts;
        this.#inserts.forEach(ins => {
            if(ins.tipe==null) ins.tipe = "const";
        });
        this.#selectPrimary = selects.find(slc=>slc.primary==true);
        //this.#fields = fields.filter(f=>f!=null);

        loads=loads.filter(ld=>ld!=null);
        this.#loadData.max = loads.length;
        this.#loadData.data = loads;

        
        this.#newActive = newActive;
        this.#insertNoAddFields = insertNoAddFields;
        this.#updateCurrent = updateCurrent !=null ? updateCurrent : panels.find(p=>p.tipe == "table");
        this.#stateData.stateStart=stateStart;
        this.#stateData.afterCancel = afterCancel;
        this.#stateData.afterDelete = afterDelete;
        this.#stateData.afterInsert = afterInsert;
        this.#stateData.afterUpdate = afterUpdate;
        this.#stateData.newLinesStart = newLinesStart;
        //console.log("statetools to " + title, stateTools);
        
        this.#stateData.stateTools.forEach(st=>{
            
            var toolLoad = st.tools.find(t=>t.name == "load");
            if(toolLoad) toolLoad.show = loads.length > 0; 
            var toolConfig = st.tools.find(t=>t.name == "config");
            if(toolConfig) toolConfig.show = filters.length > 0; 
            /*var toolQuest = st.tools.find(t=>t.name == "question");
            if(toolQuest) toolQuest.show = true;*/
        }); 
        stateTools.forEach(st => {
                
            this.#State_SetTools({
                stateName:st.name,
                toolsSet:st.tools,
            });
        });
              
    }

    #conection;
    Conection_Get(){return this.#conection};

    #tableMain;
    #selects;
    #selectPrimary;
    #joins;
    #conditions;
    #orders;
    #inserts;

    #SelectGet({selectName}){

        var select = this.#selects.find(slc=>slc.field == selectName);
        return select;
    }

    SelectPrimaryGet(){

        return this.#selectPrimary;
    }

    //-------build----------

    #body = null;
    bodyGet(){return this.#body;}

    #Build({parent,title,head=true,attributes,panels,filters,config}){

        let k = this;
        this.#body = new Crud_Body({
            parent,title,head,
            filters,config,
            panels,
            events:[
                {
                    name:"configReload",
                    actions:[{
                        action:()=>{ k.SetState({stateName:"reload"});}
                    }]
                },
                {
                    name:"boxUpdate",
                    actions:[{
                        action:(params)=>{k.#Event_BoxUpdate(params);}
                    }],
                },
                {
                    name:"toolUpdate",
                    actions:[{
                        action:({tool,value})=>{

                            switch (tool.name) {
                                case "load":
                                    this.#Event_LoadsReseted({});
                                break;

                                case "sizes":
                                    this.#Event_UpdateToolReload({});
                                break;

                                case "reload":
                                    this.#Event_UpdateToolReload({});
                                break;

                                case "new":
                                    this.#Event_UpdateToolNew({});
                                break;

                                case "cancel":
                                    this.#Event_UpdateToolCancel({});
                                break;

                                case "insert":
                                    this.#Event_UpdateToolInsert({});
                                break;

                                case "update":
                                    this.#Event_UpdateToolUpdate({});
                                break;

                                case "delete":
                                    this.#Event_UpdateToolDelete({});
                                break;

                                case "pages":
                                    this.#Event_UpdateToolPages({});
                                break;

                                case "addLine":
                                    this.#New_AddLine({});
                                break;                            
                                
                            }
                        }
                    }]
                }
            ],
        });

        this.CallEvent({name:"build"});
    }

    //load

    #loadData={
        count:0,
        max:0,
        data:[],
    };

    #Load({success}){

        this.#loadData.count = 0;
        this.#loadData.max = this.#loadData.data.length;

        this.#body.LoadingScreenActive({active:true});

        if(this.#loadData.max == 0){

            this.#Loaded({success});
            return;
        }

        for (let loadIndex = 0; loadIndex < this.#loadData.data.length; loadIndex++) {

            const loadRequest = this.#loadData.data[loadIndex];
            this.#Load_OneLoad({loadIndex,loadRequest,success});
        }

    }

    #Load_OneLoad({loadIndex,loadRequest,success}){

        let k = this;
        this.#conection.Request({
            php:"row",name:"load-loadOne",//log:true,
            sql:this.#conection.GetSql_Select(loadRequest),
            success:(result)=>{

                k.#Load_OneLoaded({loadIndex,result,success});
            }
        })
    }

    #Load_OneLoaded({loadIndex,result,success}){

        this.#loadData.count++;
        this.#loadData.data[loadIndex].result = result;
        //this.#loadData.data[loadIndex].options = !result ? [] : result.map((rst)=>{return {value:rst["value"],show:rst["show"]}});

        if(this.#loadData.count >= this.#loadData.max){

            this.#Loaded({success});
        }
    }

    #Loaded({success}){

        this.#Loaded_SetOptionsTo({});
        this.#body.LoadingScreenActive({active:false});

        if(success!=null) success();
    }

    #Loaded_SetOptionsTo({}){

        let k = this;

        //fields
        this.#body.panelsGet().forEach(panel => {
            
            panel.build.fieldsGet().forEach(field => {
                
                if(field.load!=null&&field.load.field==null){                    

                    var loadOptions = this.Loaded_GetLoadOptions({
                        loadName:field.load.name,
                        loadShow:field.load.show,
                    });            
    
                    var valueDefault = loadOptions.length > 0 ? loadOptions[0].value : 1;
                    if(field.box.value!=null) valueDefault = field.box.value;
                    var rsp = this.#Event_SetOptionsToFields({field,loadOptions});
                    if(rsp !=null && rsp.loadOptions) loadOptions = rst.loadOptions;
    
                    field.box.options = loadOptions;
                    field.box.value = valueDefault;
                    
                    panel.build.fieldSetOptions({fieldName:field.name,options:loadOptions});

                    //if(field.load.name == "ld-product-recipe") console.log("LD PRODUCT RECIPE", field, loadOptions);
                }
            });
        });

        //filters
        this.#body.configGetWindowFilters().filtersGet().forEach(filter=>{
            //console.log("loaded setoptionsto",filter);

            if(filter.load){

                var loadOptions = this.Loaded_GetLoadOptions({
                    loadName:filter.load.name,
                    loadShow:filter.load.show,
                });                

                this.#body.configGetWindowFilters().Filter_SetOptions({
                    filterName:filter.name,
                    options:loadOptions,
                });
            }
        });
    }

    Loaded_GetLoadData({loadName}){

        //console.log(this.#loadData);
        var loadData = this.#loadData.data.find(ld=>ld.name==loadName);
        //console.log(loadName,loadData);
        return loadData;
    }

    Loaded_GetLoadOptions({loadName,loadShow}){

        var data = this.Loaded_GetLoadData({loadName});
        
        var ops = data.result.map((rst)=>{

            return {
                value:rst["value"],
                show:rst[loadShow],
            }
        });
        
        if(data.startOptions) ops = [...data.startOptions,...ops];

        return ops;

    }

    Load_Reset({success}){

        let k = this;
        this.#body.LoadingScreenActive({active:true});
        this.#Load({success:()=>{

            k.#body.LoadingScreenActive({active:false});
            if(success!=null) success();
            k.#Event_LoadsReseted({});
        }});
    }

    //reload

    #reloadData = [];
    #reloadDataSets = [
        /*{
            name:"main",
            results:[],
        },*/
    ];

    ReloadDataSetAdd({dataSetName,result=[]}){

        var dataSet = this.ReloadDataSetGet({dataSetName});
        if(dataSet == null) this.#reloadDataSets.push({name:dataSetName,result});
        else dataSet.result = result;
        
    }

    ReloadDataSetGet({dataSetName}){

        return this.#reloadDataSets.find(st=>st.name==dataSetName);
    }

    Reload_GetData(){

        return this.#reloadData;
    }

    Reload_GetData_Primarys(){

        return this.#reloadData.map((ln)=>{return ln[this.#selectPrimary.field]});
    }

    Reload({success,noUseReloadAfter=false}){

        let k = this;

        k.#Event_ReloadBefore({});

        k.#body.LoadingScreenActive({active:true});
        this.#Reload_GetSizeData({

            success:({size})=>{
                
                var sizeValue = parseFloat(k.Tools_GetBox({toolName:"sizes"}).GetValue());
                var pagesCount = Math.ceil(size/sizeValue);
                if(pagesCount<=0) pagesCount = 1; 

                var pagesOptions = [];
                for (let pg = 1; pg <= pagesCount; pg++) {
                    
                    pagesOptions.push({
                        show:"pag " + pg,
                        value:pg,
                    });                    
                }

                var pagesBox = k.Tools_GetBox({toolName:"pages"});
                var lastpage = pagesBox.GetValue();
                pagesBox.SetOptions(pagesOptions);

                var lastPageFound = pagesOptions.find(op=>op.value == lastpage);
                if(!lastPageFound) lastpage = pagesOptions[pagesOptions.length-1].value;

                pagesBox.SetValue(lastpage);
                
                k.#Reload_RequestData({success:({result})=>{

                    k.#body.LoadingScreenActive({active:false});
                    if(!noUseReloadAfter) k.#Event_ReloadAfter({reloadData:result});
                    k.#Reload_PrintData({result});
                }});
            }
        });
    }

    #Reload_GetSizeData({success}){

        let k = this;

        var reloadGetSizeData_sql = this.#conection.GetSql_Select({
            tableMain:k.#tableMain,
            selects:[{
                action:"count",
                table:k.#tableMain,
                field:k.#selectPrimary.field,
                as:"size",
            }],
            joins:k.#joins,
            conditions:k.#Reload_Conditions({}),
        });

        //console.log(this.#title + " - reload_getsizedata - sql:", reloadGetSizeData_sql);

        this.#conection.Request({
            php:"row",log:k.#ctr_log["reloadSize"],
            name:" -> reload-getsize",
            sql: reloadGetSizeData_sql,
            success:(result)=>{

                var size = 0;
                if(result && result.length>0) size = parseFloat(result[0]["size"]);
                
                //console.log("crud set -> count data",size);
                success({size});
            } 
        })

    }

    #Reload_RequestData({success}){
        
        let k = this;

        var size = parseFloat(this.Tools_GetBox({toolName:"sizes"}).GetValue());
        var page = parseFloat(this.Tools_GetBox({toolName:"pages"}).GetValue());

        var reloadDataSql = k.#conection.GetSql_Select({
            tableMain:k.#tableMain,
            selects:k.#selects,
            joins:k.#joins,
            conditions:k.#Reload_Conditions({}),
            limit:[((page-1)*size),size],
            orders:k.#orders,
        });

        //console.log("reload data sql:",reloadDataSql);

        this.#conection.Request({
            php:"row",log:k.#ctr_log.reload,
            name:" -> reload-reload",
            sql: reloadDataSql,
            success:(result)=>{
                
                k.#reloadData = result;
                if(success!=null)success({result});
            }
        });
    }

    #Reload_PrintData({result}){

        let k = this;
        
        var rst = this.#Event_printBefore({result});
        if(rst!=null && rst.data!=null) result = rst.data; 

        this.#body.panelsGet().forEach(panel => {
            
            panel.build.fieldsGet().forEach(field => {
                
                var select = field.select;
                
                if(select || field.action!=null){

                    if(panel.dataSet != null){

                        var dataset = this.#reloadDataSets.find(dst=>dst.name==panel.dataSet);
                        if(dataset != null) result = dataset.result;
                        else result = [];
                    }

                    var values = result.map(rst=>{return select ? rst[select] : field.box.value});
                    panel.build.fieldSetValues({fieldName:field.name,values});
                }
            });
        });

        this.#Event_printAfter({result});
    }

    #Reload_Conditions({}){

        var conditions = [];

        //filters
        var filtersCondition = this.#body.configGetWindowFilters().GetConditions();
        conditions = [...filtersCondition];


        //crud joins
        var crudJoinsLCount = this.#crudJoins.length;
        for (let jn = 0; jn < crudJoinsLCount; jn++) {

            var joinLast = jn == crudJoinsLCount-1;
            const join = this.#crudJoins[jn];
            conditions.push({
                table:this.#selectPrimary.table,
                field:join.field,
                inter:"=",
                value:join.value,
                after:(!joinLast ?" AND ": ""),
            });
        }

        //extras
        this.#conditions.forEach(cnd => {
            
            if(conditions.length>0) cnd.before = " AND ";
            conditions.push(cnd);
        });

        //console.log("reload-conditions:",conditions);

        var e_rsp = this.CallEvent({name:"reloadConditionsAfter",params:{conditions}});
        if(e_rsp != null && e_rsp.conditions != null) conditions = e_rsp.conditions;

        return conditions;
    }

    Reload_GetPrimaryValues({}){

        var primaryField = this.#selectPrimary.field;
        return this.#reloadData.map(ln=>{

            return ln[primaryField];
        });
    }

    //insert

    #insertNoAddFields = false;
    Insert({inserts=[],success}){

        var e_rst = this.#Event_InsertBefore({inserts});
        if(e_rst!=null){

            if(e_rst.block == true) return this.SetState({stateName:this.#stateData.afterInsert});;
            if( e_rst.inserts) inserts=e_rst.inserts;
        }
        //console.log(this.#title+"- before inserts -> ",inserts);

        let k = this;
        k.#body.LoadingScreenActive({active:true});
        this.#Insert_Request({inserts,success:({primaryNew})=>{

            k.#body.LoadingScreenActive({active:false});
            var rsp_ins = k.#Event_InsertAfter({field:k.#selectPrimary.field,value:primaryNew});
            if(rsp_ins != null && rsp_ins.stateBlock==true) return;
            k.SetState({stateName:k.#stateData.afterInsert});
        }})
    }

    #Insert_Request_PrimaryNew({success}){

        var primaryNewSql = this.#conection.GetSql_Select({
            tableMain:this.#tableMain,
            selects:[{
                action:"max",
                table:this.#tableMain,
                field:this.#selectPrimary.field,
                as:"primaryMax",
            }],
        });

        this.#conection.Request({
            php:"row",
            sql:primaryNewSql,
            name:"crud-insert-getPrimaryNew",
            success:(result)=>{

                var primaryMax = result[0]["primaryMax"];
                if(primaryMax == null) primaryMax = 0;
                else primaryMax = parseFloat(primaryMax);
                var primaryNew = primaryMax + 1;
                success({primaryNew});
            } 
        })
    }

    #Insert_Request({inserts=[],success}){

        let k = this;
        this.#Insert_Request_PrimaryNew({
            success:({primaryNew})=>{

                //-------------------------

                var insertSql_inserts = inserts;

                
                console.log("INSERT REQUEST BY INSERT IN FUNCION", [...insertSql_inserts]);

                //insert by inserts saved
                insertSql_inserts = [...insertSql_inserts,...k.#inserts];

                console.log("INSERT REQUEST BY SAVED", [...insertSql_inserts]);
                

                //insert by primary new
                insertSql_inserts.push({
                    field:k.#selectPrimary.field,
                    value:primaryNew,
                    tipe:"secuence",
                });

                //console.log("INSERT REQUEST ADDED PRIMARY", [...insertSql_inserts]);

                //inserst by crudjoins
                k.#crudJoins.forEach(jn=>{

                    //if no primary field
                    if(jn.field != k.#selectPrimary.field){

                        insertSql_inserts.push({
                            field: jn.field,
                            value:jn.value,
                            tipe:"const",
                        });
                    }                   
                });

                //console.log("INSERT REQUEST ADDED JOINS", [...insertSql_inserts]);

                if(!this.#insertNoAddFields){

                    //insert by fields
                    k.#body.fieldsGet().forEach(field => {
                        
                        //no button, no div and select exist
                        var select = k.#SelectGet({selectName:field.select});
                        if(field.box.tipe != 0 && select){
    
                            //no primary in insert because primary have a value
                            if(!select.primary){

                                var fieldSelecField = select.field;
                                if(this.#stateData.state == "new"){

                                    var fieldValues = k.#body.fieldGetValues({fieldName:field.name});                                    
                                    fieldValues.forEach(v => {
                                        
                                        insertSql_inserts.push({
                                            field: fieldSelecField,
                                            value: v,
                                        });
                                    });  
                                }
                                else
                                {
                                    insertSql_inserts.push({
                                        field: fieldSelecField,
                                        value: field.box.value,
                                    });  
                                }
                                  
                                
                                //console.log(field.name, fieldValues);
                            }                        
                        }
                    }); 
                }   

                //console.log("INSERT REQUEST ADDED FIELDS", [...insertSql_inserts]);
                

                //-----request------

                k.#conection.Request({
                    php:"success",log:true,
                    name:"-insert-insert",
                    sql: k.#conection.GetSql_Insert({
                        tableMain:this.#tableMain,
                        inserts:insertSql_inserts,
                    }),
                    success:()=>{

                        if(success!=null)success({primaryNew});
                    }
                });
            }
        })

    }

    //new

    #newActive=true;
    New({}){

        this.#New_StartLines({});
        this.#Event_NewAfter({});
    }

    #New_StartLines({}){

        this.#body.AddLine({startcount:this.#stateData.newLinesStart});
    }

    #New_AddLine({}){

        let k = this;
        this.#body.fieldsGet().forEach(field=>{

            var values = k.#body.fieldGetValues({fieldName:field.name});

            values.push(field.box.value);

            k.#body.fieldSetValues({
                fieldName:field.name,
                values,
            });
        });
    }

    #New_RemoveLine({y,from}){

        //console.log("remove line ", from);
        /*this.#conteiner_panels.forEach(panel => {

            var fieldsOfPanel = this.#fields.filter(f=>f.panel==panel.title);
            
            switch (panel.tipe) {
                case "table":

                console.log(panel);
                panel.build.RemoveLine({y});               

                break;

                case "form":

                fieldsOfPanel.forEach(f => {
                    
                    if(f.action == "edit") console.log("new -> field:",f);
                    this.SetValuesToBox({values:[f.box.value],fieldName:f.name});
                });

                break;
            }
        });*/
    }

    //update

    Update({success}){

        let k = this;
        k.#body.LoadingScreenActive({active:true});

         //----sql----

         var updateConditions = [];
         var updateSets = [];
        
         if(this.#update_listOfChanges.length>0){

            var updateChangeFist = this.#update_listOfChanges[0];
            updateConditions.push({
                table:this.#selectPrimary.table,
                field:this.#selectPrimary.field,
                inter:"=",
                value:updateChangeFist.primary,
            });
            
            updateChangeFist.fields.forEach(fch => {
                
                var field = this.#body.fieldGet({fieldName:fch.fieldName});
                if(field){
                    var select = this.#selects.find(slc=>slc.field==field.select);
                    if(select){

                        updateSets.push({
                            field:select.field,
                            value:fch.value,
                        });
                    }
                }
            });
         }

         var e_resp = this.CallEvent({name:"updateBefore",params:{conditions:updateConditions,sets:updateSets}})
         if(e_resp!=null){

            console.log("updatebefore",e_resp);

             if(e_resp.sets!=null)updateSets = e_resp.sets;
             if(e_resp.conditions!=null)updateConditions = e_resp.conditions;
         }        

         //----request----

         console.log("update:",updateSets,updateConditions);

         if(updateConditions.length>0){

            var updateSql = k.#conection.GetSql_Update({
                tableMain:k.#tableMain,
                sets: updateSets,
                conditions:updateConditions,
            });
   
            console.log("update:sel",updateSql);

            this.#conection.Request({
                php:"success",log:k.#ctr_log["update"],
                name:" -> update-request",
                sql:updateSql,
                success:()=>{
    
                    k.#Update_success({success});
                },
            });
         }
         else this.#Update_success({success});       
    }

    #Update_success({success,result}){

        this.#body.LoadingScreenActive({active:false});
        this.#update_listOfChanges=[];

        console.log("update->send state:",this.#stateData.afterUpdate);
        this.SetState({stateName:this.#stateData.afterUpdate});
        this.#Event_UpdateAfter({result});
        if(success!=null) success({result});
    }

    #update_listOfChanges = [
        /*{
            primary:3,
            fields:[
                {
                    fieldName:"",
                    value:1,
                }
            ]
        }*/
    ];
    #updateCurrent = false;

    Update_AddChangeField({fieldName,value,y=0}){

        var primary = this.Reload_GetData_Primarys({})[y];
        
        this.Update_AddChange({
            fieldName,
            value,
            primary,
        });
        
    }

    Update_AddChange({fieldName,value,primary}){

        var changePrimary = this.#update_listOfChanges.find(ch=>ch.primary==primary);
        if(changePrimary){

            var changeField = changePrimary.fields.find(f=>f.fieldName==fieldName);
            if(changeField){

                changeField.value = value;
            }
            else{

                changePrimary.fields.push({
                    fieldName,
                    value,
                });
            }
        }
        else
        {
            this.#update_listOfChanges.push({
                primary,
                fields:[
                    {
                        fieldName,
                        value,
                    }
                ],
            });
        }
        
        this.#Event_AddChange({fieldName,value,primary});
    }

    //delete

    Delete({primaryValue,success}){

        let k = this;
        k.#body.LoadingScreenActive({active:true});

        var deleteSql = this.#conection.GetSql_Delete({
            tableMain:k.#tableMain,
            conditions:[
                {
                    table:k.#selectPrimary.table,
                    field:k.#selectPrimary.field,
                    inter:"=",
                    value:primaryValue,
                }
            ],
        });

        //console.log("delete:",deleteSql);

        this.#conection.Request({
            php:"success",log:k.#ctr_log["delete"],
            sql:deleteSql,
            success:()=>{

                k.#body.LoadingScreenActive({active:false});
                k.SetState({stateName:k.#stateData.afterDelete});
                if(success!=null)success({primaryValue});
            }
        })
    }

    //block
    #Block({active=true}){

        this.#body.Block({active});
        this.#Event_BlockAfter({active});
    }

    //state

    #stateData = {
        state:"reload",
        states:["reload","find","nofound","block","new"],
        stateBase:"reload",
        stateStart:"reload",
        stateTools:[
            {
                name:"new",
                tools:[
                    {name:"config",show:false},
                    {name:"load",show:false},

                    {name:"excel",show:false},
                    {name:"pdf",show:false},
                    {name:"question",show:false},

                    {name:"sizes",show:false},
                    {name:"reload",show:false},
                    {name:"update",show:false},
                    {name:"new",show:false},
                    {name:"insert",show:false},
                    {name:"cancel",show:false},
                    {name:"addLine",show:false},
                    {name:"delete",show:false},
                    
                    {name:"pages",show:false},
                ],
            },
            {
                name:"reload",
                tools:[
                    {name:"config",show:false},
                    {name:"load",show:false},
                    
                    {name:"excel",show:false},
                    {name:"pdf",show:false},
                    {name:"question",show:false},

                    {name:"sizes",show:false},
                    {name:"reload",show:false},
                    {name:"update",show:false},
                    {name:"new",show:false},
                    {name:"insert",show:false},
                    {name:"cancel",show:false},
                    {name:"addLine",show:false},
                    {name:"delete",show:false},
                    
                    {name:"pages",show:false},
                ],
            },
            {
                name:"block",
                tools:[
                    {name:"config",show:false},
                    {name:"load",show:false},

                    {name:"excel",show:false},
                    {name:"pdf",show:false},
                    {name:"question",show:false},

                    {name:"sizes",show:false},
                    {name:"reload",show:false},
                    {name:"update",show:false},
                    {name:"new",show:false},
                    {name:"insert",show:false},
                    {name:"cancel",show:false},
                    {name:"addLine",show:false},
                    {name:"delete",show:false},
                    
                    {name:"pages",show:false},
                ],
            },
        ],
        afterInsert:"reload",
        afterUpdate:"reload",
        afterCancel:"reload",
        afterDelete:"reload",
        newLinesStart: 10,
    }

    StateGet(){

        return this.#stateData.state;
    }

    SetState({stateName,noUseReloadAfter=false}){

        this.#stateData.state = stateName;
        //set tools
        var StateToolsData = this.#stateData.stateTools.find(stT=>stT.name == stateName);

        this.#body.toolsGet().forEach(tool => {
            
            var stateToolData = StateToolsData.tools.find(stTool => stTool.name == tool.name);

            if(stateToolData!=null){
                

                this.Tools_OneToolSetShow({
                    toolName:tool.name,
                    show:stateToolData.show,
                    value:stateToolData.value,
                });
            }
            else
            {

                this.Tools_OneToolSetShow({
                    toolName:tool.name,
                    show:false,
                });
            }

        });

        if(this.#stateData.state!="")this.#Block({active:false});


        switch (this.#stateData.state) {
            case "new":
                
                this.New({});
            break;

            case "reload":
                
                this.Reload({noUseReloadAfter});
            break;

            case "block":
                
                this.#Block({active:true});
            break;
        }

        this.CallEvent({name:"setStateAfter",params:{stateName}});

    }

    #State_SetTools({stateName,toolsSet=[]}){


        var stateToolsData = this.#stateData.stateTools.find(st=>st.name==stateName);

        stateToolsData.tools.forEach(toolData => {

            var toolSet = toolsSet.find(fset=>fset.name == toolData.name);

            if(toolSet == null) toolSet = {...toolData};
            toolData.show = toolSet.show;
            if(toolSet.value != null) toolData.value = toolSet.value;
            if(toolSet.descripcion != null) toolData.descripcion = toolSet.descripcion;

        });

    }

    #State_GetTools({stateName}){

        return this.#stateData.stateTools.find(st=>st.name==stateName);
    }

    //crudJoin

    #crudJoins = [];

    /*{
        name:"",
        field:,
        value:,
    }*/
    
    CrudJoins_Set({name,field,value}){

        var crudjoinExistIndex = this.#crudJoins.findIndex(j=>j.field==field);
        //console.log(crudjoinExistIndex);
        if(crudjoinExistIndex>=0){

            this.#crudJoins[crudjoinExistIndex].value = value;
        }
        else{

            this.#crudJoins.push({name,field,value});
        }


    }    

    //---------events----------

    #Event_UpdateToolPDF({}){

        this.CallEvent({name:"toolPdfUpdate"});
    }

    #Event_UpdateToolReload({}){

        this.Reload({});
    }

    #Event_UpdateToolNew({}){
        
        if(this.#newActive) this.SetState({stateName:"new"});
        this.CallEvent({name:"toolNewUpdate"});
    }

    #Event_UpdateToolInsert({}){

        this.Insert({});
    }

    #Event_UpdateToolCancel({}){

        this.SetState({stateName:this.#stateData.afterCancel});
        this.CallEvent({name:"toolCancelUpdate"});
    }

    #Event_UpdateToolUpdate({}){

        this.Update({});
    }
    
    #Event_UpdateToolPages({}){

        this.Reload({});
    }

    #Event_UpdateToolExcel({}){

        var data = [];

        var header = [];
        /*this.#fields.forEach(field => {
            
            header.push(field.name);
        });
        data.push(header);

        let k = this;
        var total = this.GetValues({fieldName:this.#fields[0].name}).length;
        for (let index = 0; index < total; index++) {
            
            var line = [];
            this.#fields.forEach(field => {
                
                line.push(k.GetValue({
                    fieldName:field.name,
                    y:index,
                }));
            });
            data.push(line);            
        }*/


        // Datos de ejemplo
        /*const data = [
            ["Nombre", "Edad", "Correo"],
            ["Juan", 30, "juan@example.com"],
            ["María", 25, "maria@example.com"],
            ["Carlos", 35, "carlos@example.com"]
        ];*/

        // Crear una nueva hoja de trabajo
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Crear un nuevo libro de trabajo
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Hoja1");

        // Generar un archivo Excel
        XLSX.writeFile(workbook, "Data.xlsx");
    }

    #Event_UpdateToolDelete({}){

        this.Delete({
            primaryValue: this.#reloadData[0][this.#selectPrimary.field],
        });
    }
    //#update
    #Event_BoxUpdate(u){

        let k = this;
        u.k = this;
        u.primaryValues = this.#reloadData.map(ln=>{return ln[k.#selectPrimary.field]});
        

        if(u.field.action == "delete"){

            var panel = this.#body.panelGet({panelName:u.field.panel.name});
            if(panel.build.tipeGet() == "table"){

                switch (this.#stateData.state) {
                    case "reload":

                        var primaryField = this.#selectPrimary["field"];
                        var line = this.#reloadData[u.y];
                        var primaryValue = line[primaryField];

                        k.Delete({primaryValue});
                        
                    break;
                
                    case "new":

                        k.#New_RemoveLine({y:u.y,from:"boxupdate"});
                        
                    break;
                }
                
            }
        }

        this.CallEvent({name:"boxUpdate",params:{...u}});

        //----update change-----
        
        var panel = this.#body.panelGet({panelName:u.field.panel.name});
        var panelIsTable = panel.build.tipeGet()=="table";
        var y = panelIsTable ? u.y : 0;
        var value = panel.build.fieldGetValues({fieldName:u.field.name})[y];
        var primary = u.primaryValues[y];

        if(this.#stateData.state!="new" && u.field.action==null){

            if(u.field.box.tipe !=0 && u.field.box.tipe !=5){

                this.Update_AddChange({
                    fieldName:u.field.name,
                    value,primary,
                }); 
            }              
        }    

    }

    #Event_ReloadBefore(params){

        //console.log(this.#title,"reload after");
        this.CallEvent({name:"reloadBefore",params});
    }

    #Event_ReloadAfter(params){

        //console.log(this.#title,"reload after");
        this.CallEvent({name:"reloadAfter",params});
    }

    #Event_printBefore(params){

        var result = this.CallEvent({name:"printBefore",params});
        return result;
    }

    #Event_printAfter(params){

        this.CallEvent({name:"printAfter",params});
    }

    #Event_UpdateAfter(params){

        this.CallEvent({name:"updateAfter",params});
    }

    #Event_InsertBefore(params){

        //console.log("cruset insert before!!!");
        return this.CallEvent({name:"insertBefore",params});
    }

    #Event_InsertAfter(params){

        return this.CallEvent({name:"insertAfter",params});
    }

    #Event_NewAfter(params){

        this.CallEvent({name:"newAfter",params});
    }

    #Event_BlockAfter(params){

        this.CallEvent({name:"blockAfter",params});
    }

    #Event_AddChange({fieldName,value,primary}){

        this.CallEvent({name:"addChange",params:{fieldName,value,primary}});
        
        if(this.#updateCurrent) this.Update({});

    }

    #Event_StateSetFirst({}){

        this.CallEvent({name:"stateSetFirst"});
    }

    #Event_SetOptionsToFields(params){

        this.CallEvent({name:"setOptionsToFields",params});
    }

    #Event_LoadsReseted(params){

        this.CallEvent({name:"loadsReseted",params});
    }

    //---------public functions-----------


    Tools_OneToolSetShow({toolName,show,value}){

        var tool = this.#body.toolsGet().find(t=>t.name==toolName);
        //if(toolName=="pages") console.log("toolName:",toolName,"tool:",tool,"show:",show,"value:",value);

        if(value!=null) tool.dom.SetValue(value);

        tool.show = show;
        if(show==false) tool.dom.Hide();
        else tool.dom.Show();
        //.Block({active});
    }

    Tools_GetBox({toolName}){

        var tool = this.#body.toolsGet().find(t=>t.name==toolName);
        return tool.dom;
    }


    

}