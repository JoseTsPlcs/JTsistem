
class Crud_Master extends ODD {

    constructor(i){

        if(true){

            i.logControl = [
                {name:"load",active:true},

                {name:"tutorialSet",active:false},
                {name:"tutorialPlay",active:true},

                {name:"state",active:false},
                {name:"stateSet",active:true},
                {name:"stateSetVariables",active:true},

                {name:"fieldBoxUpdate",active:false},
                {name:"fieldSetValue",active:false},
                {name:"fieldSetOptions",active:false},

                {name:"insert",active:false},
            ];
        }

        super(i);
        this._className = "crudMaster";

        this.#tutorialsSet(i);
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
        loaded:true,
        load:true,
    }

    #SetVariables({stateTools=[],questions=[],stateStart="reload",afterCancel="reload",afterDelete="reload",afterInsert="reload",afterUpdate="reload",newLinesStart=1,newActive=true,tableMain,selects,joins,inserts=[],orders=[],conditions=[],fields=[],filters=[],loads=[],insertToEnd=true,updateCurrent,panels=[]}){

        this.#conection = db_lip;
        this.#tableMain = tableMain;
        this.#selects = selects;
        this.#joins = joins;
        this.#conditions = conditions.filter(cnd=>cnd!=null);
        this.#orders = orders;
        this.#inserts = inserts.filter(ins=>ins!=null);
        this.#inserts.forEach(ins => {
            if(ins.tipe==null) ins.tipe = "const";
        });
        this.#selectPrimary = selects.find(slc=>slc.primary==true);
        //this.#fields = fields.filter(f=>f!=null);

        loads=loads.filter(ld=>ld!=null);
        this.#loadData.max = loads.length;
        this.#loadData.data = loads;

        
        this.#newActive = newActive;
        this.#insertToEnd = insertToEnd;
        this.#updateCurrent = updateCurrent !=null ? updateCurrent : panels.find(p=>p.tipe == "table");
        this.#stateData.stateStart=stateStart;
        this.#stateData.afterCancel = afterCancel;
        this.#stateData.afterDelete = afterDelete;
        this.#stateData.afterInsert = afterInsert;
        this.#stateData.afterUpdate = afterUpdate;
        this.#stateData.newLinesStart = newLinesStart;
              
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
    #parentBuild = null;
    #Build({parentBuild,parent,title,head=true,attributes,panels,filters,config,states,recordName}){

        this.#parentBuild = parentBuild;
        let k = this;
        this.#body = new Crud_Body({
            name:this._name,logControl:this._logControl,
            parent,title,head,recordName,
            filters,config,
            panels,states,tutorials:this.#tutorials.data,
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
                            
                            this.CallEvent({name:"toolUpdate",params:{tool}});

                            if(tool.active == false) return;

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
                                
                                case "tutorial":
                                    this.tutorialPlay({value});
                                break;
                                
                            }
                        }
                    }],
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

        console.log("laoded",this.#loadData);
        

        this.#Loaded_SetOptionsTo({});
        this.#body.LoadingScreenActive({active:false});
        this.CallEvent({name:"loaded"});

        if(success!=null) success();
    }

    #Loaded_SetOptionsTo({}){

        let k = this;

        //fields
        /*this.#body.panelsGet().forEach(panel => {
            
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
        });*/

        //fields
        this.#body.fieldsGet().filter(f=>f.load!=null).forEach(f=>{

            var options = this.Loaded_GetLoadOptions({
                loadName:f.load.name,
                loadShow:f.load.show,
            });

            this.LogAction({
                type:"load",
                action:"load -> set options to fields",
                msg:{field:f,options},
            });

            
            this.#body.fieldSetOptions({fieldName:f.name,options});
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

    //tutorials
    
    #tutorials = {
        data:[],
        block:false,
        build:null,
        generalDescripcion:"",
    };
    tutorialsGet(){return this.#tutorials.data;}
    #tutorialsSet({tutorials=[],descripcion=""}){

        //this.LogAction({type:"tutorialSet",action:"tutorialsSet",msg:{tutorialsExtras:tutorials}});
        
        let k = this;
        this.#tutorials.generalDescripcion = descripcion;
        this.#tutorials.data = [
            {value:"how",show:"¿que es esto?",active:true},
            {value:"use",show:"¿como lo uso?",active:true},
            {value:"search",show:"¿como realizo una busqueda?",active:true},
            {
                value:"insert",show:"¿como ingreso un [registro]?",
                elementsInfo:({k})=>{

                    var toolName = "insert";
                    if(k.bodyGet().toolsGet().find(t=>t.name=="new").show) toolName = "new";

                    return [{
                        ...k.bodyGet().toolGetTutorialElement({toolName}),
                        eventNext:({element})=>{

                            if(k.#body.toolGet({toolName:"insert"}).show){

                                k.InsertEvent({
                                    success:()=>{
    
                                        k.CallEvent({name:"tutorialInsertEnd",params:{k}});
                                    }
                                });
                            }
                            else{

                                element.click();
                                k.CallEvent({name:"tutorialInsertEnd",params:{k}});   
                            }                     
                        }
                    }];
                },
                eventActive:()=>{

                    return k.#body.toolGet({toolName:"insert"}).show || k.#body.toolGet({toolName:"new"}).show;
                }
            },
            ...tutorials,
        ];

        if(tutorials.length>0)this.LogAction({type:"tutorialSet",action:"tutorialsSet - add new tutorials",msg:{tutorials:this.#tutorials.data}});
    }
    tutorialSetBlock({block=false}){this.#tutorials.block = block;}

    tutorialPlay({value="use",success=null}){
        let k = this;

        if(this.#tutorials.block == true)return;

        var elementsInfo = this.tutorialElementsInfoGet({value});

        if(elementsInfo.length > 0){

            this.LogAction({
                type:"tutorialPlay",
                action:"tutorialPlay",
                msg:{value,elementsInfo},
            });

            this.#tutorials.build = new Tutorial({
                elementsInfo,
                eventElementPlay:(params)=>{
    
                    k.CallEvent({name:"tutorialPlayElement",params});
                },
                eventStart:({})=>{
                    
                    k.CallEvent({name:"tutorialStart"});
                },
                eventEnd:(params)=>{
                    
                    var eventEndParams = {...params,value};
                    k.LogAction({
                        type:"tutorialPlay",
                        action:"tutorialEnd",
                        msg:eventEndParams,
                    });
                    k.CallEvent({name:"tutorialEnd",params:eventEndParams});
                    if(success!=null) success();
                }
            });
            this.#tutorials.build.startTutorial();
        }
        else
        {
            this.LogAction({
                type:"tutorialPlay",
                action:"tutorialPlay",
                msg:("error tutorial " + value + " no have elements")
            });
        }

    }

    tutorialElementsInfoGet({value="use"}){

        let k = this;
        var elementsInfo = [];

        switch (value) {

            case "how":

                elementsInfo.push({
                    id:this.#body.bodyWindowGet().HeadGetDom().id,
                    descripcion:this.#tutorials.generalDescripcion,
                });
            break;

            case "use":
                
                this.#body.panelsGet().filter(p=>((p.tipe=="form" && p.build.buildGet().Conteiner_isShow({}))||p.tipe!="form")).forEach(p=>{

                    if(p.descripcion!=null){
                    
                        elementsInfo.push({
                            id:p.build.buildGet().parentGet().id,
                            descripcion:p.descripcion,
                        });
                    }
                    
                });

                this.#body.fieldsGet().filter(f=>((f.panel.tipe=="form" && f.panel.build.buildGet().Conteiner_isShow({}))||f.panel.tipe!="form")&&(f.action!="div")).forEach(f => {                   

                    elementsInfo.push({
                        ...this.#body.fieldGetElementTutorial({fieldName:f.name}),
                        name:f.name,
                    });
                });

                this.#body.toolsGet().filter(t=>t.show==true&&t.name!="tutorial"&&t.name!="title").forEach(tool => {
                
                    elementsInfo.push({
                        ...this.#body.toolGetTutorialElement({toolName:tool.name}),
                    });
                });


            break;

            case "search":

                if(this.#body.configGetShow()==false){

                    elementsInfo.push({
                        ...this.#body.toolGetTutorialElement({toolName:"config"}),
                        //descripcion:"selecciona configuracion para desplegar filtros de busqueda",
                        eventNext:({element})=>{
    
                            k.#body.ConfigSetState({show:true,slow:true});
                            setTimeout(()=>{
    
                                k.#body.configGetWindowFilters().tutorialPlay();
                            },1000);
                        }
                    });
                }
                else this.#body.configGetWindowFilters().tutorialPlay();

                

            break;
        }

        var tutorialInfo = this.#tutorials.data.find(t=>t.value==value);
        if(tutorialInfo && tutorialInfo.elementsInfo != null) elementsInfo = tutorialInfo.elementsInfo({k:this,value});

        
        var resp = k.CallEvent({name:"tutorialGetElementsInfo",params:{elementsInfo,value}});
        if(resp!=null && resp.elementsInfo !=null) elementsInfo = resp.elementsInfo;

        return elementsInfo;
    }

    #tutorialUpdateTool(){

        this.#tutorials.data.find(t=>t.value=="how").active = this.#tutorials.generalDescripcion != "";
        this.#tutorials.data.find(t=>t.value=="use").active = this.#body.toolsGet().filter(t=>t.show==true).length > 0;
        this.#tutorials.data.find(t=>t.value=="search").active = this.#body.toolsGet().find(t=>t.name=="config").show || this.#body.configGetShow();
        //this.#tutorials.data.find(t=>t.value=="insert").active = this.#body.toolsGet().find(t=>t.name=="new").show || this.#body.toolsGet().find(t=>t.name=="insert").show;
        
        var blocks = this.#body.toolGetBox({toolName:"tutorial"}).Blocks_Get();
        
        for (let index = 0; index < this.#tutorials.data.length; index++) {
            
            var domID = blocks[index+1].id;

            var tutorialInfo = this.#tutorials.data[index];
            var active = tutorialInfo.active;
            if(tutorialInfo.eventActive!=null) active = tutorialInfo.eventActive();

            if(active) $('#'+domID).show();
            else $('#'+domID).hide();
        }
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

    Reload({success,noUseReloadAfter=false,setLastPage=false}){

        let k = this;

        k.#Event_ReloadBefore({});

        k.#body.LoadingScreenActive({active:true});
        this.#Reload_GetSizeData({

            success:({size})=>{
                
                var sizeValue = parseFloat(k.#body.toolGetBox({toolName:"sizes"}).GetValue());
                var pagesCount = Math.ceil(size/sizeValue);
                if(pagesCount<=0) pagesCount = 1; 

                var pagesOptions = [];
                for (let pg = 1; pg <= pagesCount; pg++) {
                    
                    pagesOptions.push({
                        show:"pag " + pg,
                        value:pg,
                    });                    
                }

                var pagesBox = k.#body.toolGetBox({toolName:"pages"});
                var lastpage = pagesBox.GetValue();
                pagesBox.SetOptions(pagesOptions);

                var lastPageFound = pagesOptions.find(op=>op.value == lastpage);
                if(!lastPageFound || setLastPage) lastpage = pagesOptions[pagesOptions.length-1].value;

                pagesBox.SetValue(lastpage);
                
                k.#Reload_RequestData({success:({result})=>{

                    k.#body.LoadingScreenActive({active:false});
                    if(!noUseReloadAfter) k.#Event_ReloadAfter({reloadData:result});

                    k.#Reload_PrintData({result,success});
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

        //console.log(this._name + " - reload_getsizedata - sql:", reloadGetSizeData_sql);

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

        var size = parseFloat(this.#body.toolGetBox({toolName:"sizes"}).GetValue());
        var page = parseFloat(this.#body.toolGetBox({toolName:"pages"}).GetValue());

        var reloadDataSql = k.#conection.GetSql_Select({
            tableMain:k.#tableMain,
            selects:k.#selects,
            joins:k.#joins,
            conditions:k.#Reload_Conditions({}),
            limit:[((page-1)*size),size],
            orders:k.#orders,
        });

        //console.log(this._name +" -> reload data sql:",reloadDataSql);

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

    #Reload_PrintData({result,success}){

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
        if(success!=null) success();
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

        //console.log("RELOAD CONDITIONS",conditions);

        return conditions;
    }

    Reload_GetPrimaryValues({}){

        var primaryField = this.#selectPrimary.field;
        return this.#reloadData.map(ln=>{

            return ln[primaryField];
        });
    }

    //insert

    InsertEvent({success}){

        if(this.#body.stateGet()=="reload"){

            this.Insert({
                noAddFields:true,
                success,
            });

        }
        else { 

            //console.log("no add fields",this.#body.panelsGet()[0].tipe=="table");
            
            this.Insert({
                noAddFields:this.#body.panelsGet()[0].tipe=="table",
                success
            });
        }
    }

    #insertToEnd = true;
    insertToEndGet(){return this.#insertToEnd;}
    Insert({inserts=[],noInserts=false,noAddFields=false,noJoins=false,success}){

        var e_rst = this.#Event_InsertBefore({inserts});
        if(e_rst!=null){

            if(e_rst.block == true) return this.SetState({stateName:this.#stateData.afterInsert});;
            if( e_rst.inserts) inserts=e_rst.inserts;
        }

        let k = this;

        k.#body.LoadingScreenActive({active:true});
        this.#InsertByCruds({
            inserts,
            success:({inserts=[]})=>{

                this.#Insert_Request({
                    inserts,
                    noInserts,
                    noAddFields,
                    noJoins,
                    success:({primaryNew,msg,resp})=>{

                        k.#body.LoadingScreenActive({active:false});
                        var params = {field:k.#selectPrimary.field,value:primaryNew,msg,resp};
                        var rsp_ins = k.#Event_InsertAfter(params);
                        if(rsp_ins != null && rsp_ins.stateBlock==true) return;
                        k.SetState({stateName:k.#stateData.afterInsert,setLastPage:k.#insertToEnd,success});
                    }
                });
            }
        });        
    }

    #InsertByCruds({inserts=[],success}){

        let k = this;

        if(this.#crudInserts.length > 0){

            var crudIns = this.#crudInserts[0];
            var listOfInsert = crudIns.list;

            var max = listOfInsert.length-1;
            var count = 0;

            function playInsert({index}) {
                                                
                console.log("insert "+index+"/"+max);

                var item = listOfInsert[index];
                crudIns.build.Insert({
                    inserts:item.inserts,
                    noAddFields:true,
                    success:({value})=>{

                        item.primary = value;
                        count++;
                        if(count <= max){
                            
                            playInsert({index:count});
                        }
                        else{

                            var crudsInserts = k.crudInsertsGet();
                            var primaryValues = [];
                            crudIns.list.forEach(item => {
                                
                                primaryValues.push(item.primary);
                                inserts.push({
                                    field:"ID_PAY",
                                    value:item.primary,
                                });
                            });

                            console.log("UPDATE PAYS",primaryValues);

                            /*k.Insert({
                                inserts,
                            });*/

                            success({inserts});
                        }
                    }
                });  
            }

            playInsert({index:count});
        }
        else
        {
            success({inserts});
        }
        
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

    #Insert_Request({inserts=[],success,noInserts=false,noAddFields=false,noJoins=false}){

        let k = this;
        this.#Insert_Request_PrimaryNew({
            success:({primaryNew})=>{

                //-------------------------

                var insertSql_inserts = k.Insert_GetInserts({inserts,noInserts,noAddFields,noJoins});      
                
                //insert by primary new
                insertSql_inserts.push({
                    field:k.#selectPrimary.field,
                    value:primaryNew,
                    tipe:"secuence",
                });

                //-----request------

                k.#conection.Request({
                    php:"success",log:true,
                    name:"-insert-insert",
                    sql: k.#conection.GetSql_Insert({
                        tableMain:this.#tableMain,
                        inserts:insertSql_inserts,
                    }),
                    success:(result,msg,resp)=>{
                        
                        if(success!=null)success({primaryNew,msg,resp});
                    }
                });
            }
        })

    }

    Insert_GetInserts({inserts=[],noInserts=false,noAddFields=false,noJoins=false}){

        var insertSql_inserts = [];
        let k = this;

        this.LogAction({
                type:"insert",
                action:"insert_getInserts",
                msg:{
                    inserts,
                    noInserts,
                    noAddFields,
                    noJoins,
                },
        })
        //console.log("INSERT REQUEST BY INSERT IN FUNCION", [...insertSql_inserts]);

        //insert by inserts saved
        insertSql_inserts = [...inserts];

        if(!noInserts){

            k.#inserts.forEach(ins => {
                
                insertSql_inserts.push(ins);
            });
        }

        //console.log("INSERT REQUEST BY SAVED", [...insertSql_inserts]);

        //console.log("INSERT REQUEST ADDED PRIMARY", [...insertSql_inserts]);

        //inserst by crudjoins
        if(!noJoins){

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
        }

        //console.log("INSERT REQUEST ADDED JOINS", [...insertSql_inserts]);

        if(!noAddFields){

            //insert by fields
            k.#body.fieldsGet().forEach(field => {
                
                //no button, no div and select exist,
                var select = k.#selects.find(slc=>slc.as==field.select||slc.field==field.select);
                if(field.box.tipe != 0 && select){

                    //no primary in insert because primary have a value
                    if(!select.primary){

                        var fieldSelecField = select.field;
                        if(this.#stateData.state != "new"){

                            var fieldValues = k.#body.fieldGetValues({fieldName:field.name}); 

                            k.LogAction({
                                type:"insert",
                                action:"getInserts - addfields",
                                msg:{
                                    field,
                                    fieldValues,
                                },
                            });

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

        return insertSql_inserts;
    }

    //new

    #newActive=true;
    New({}){

        this.#New_StartLines({});
        this.#Event_NewAfter({});
    }

    #New_StartLines({}){

        //this.#body.AddLine({startcount:this.#stateData.newLinesStart});
    }

    #New_AddLine({}){

        let k = this;
        /*this.#body.fieldsGet().forEach(field=>{

            var values = k.#body.fieldGetValues({fieldName:field.name});

            values.push(field.box.value);

            k.#body.fieldSetValues({
                fieldName:field.name,
                values,
            });
        });*/
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
                    var select = this.#selects.find(slc=>slc.field==field.select||slc.as==field.select);
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

         if(updateConditions.length>0 && updateSets.length>0){

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
        stateStart:"reload",
        afterInsert:"reload",
        afterUpdate:"reload",
        afterCancel:"reload",
        afterDelete:"reload",
        newLinesStart: 10,
    }

    StateGet(){

        return this.#body.stateGet();
    }

    SetState({stateName,noUseReloadAfter=false,setLastPage=false,success}){

        this.LogAction({type:"stateSet",action:"setState",msg:{stateName}});
        
        this.#body.stateSet({stateName});
        this.#Block({active:(stateName=="block")});

        switch (stateName) {
            case "new":
                
                this.New({});
            break;

            case "reload":
                
                this.Reload({noUseReloadAfter,setLastPage,success});
            break;

            case "block":
                
                
            break;
        }

        this.#tutorialUpdateTool();
        this.CallEvent({name:"setStateAfter",params:{stateName}});

    }

    //crudJoin

    #crudJoins = [];
    crudJoinsGet(){return this.#crudJoins}
    
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

    #crudUpdates = [];
    crudMaidAdd({name,build,maidSelect}){

        
    }

    #crudInserts = [];
    crudInsertsGet(){return this.#crudInserts;}
    crudInsertSet({name,build,inserts}){

        var crudInsertFound = this.#crudInserts.find(cr=>cr.name==name);
        if(crudInsertFound != null){

            crudInsertFound.build = build;
            crudInsertFound.list.push({
                primary:null,
                inserts,
            });
        }
        else{

            this.#crudInserts.push({
                name,build,
                list:[{
                    primary:null,
                    inserts:inserts,
                }],
            });
        }
        
        this.CallEvent({name:"crudInsertSet"});
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

        this.InsertEvent({});
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
        
        this.LogAction({
            type:"fieldBoxUpdate",
            action:"fieldBoxUpdate",
            msg:{...u},
        });
        

        if(u.field.action == "delete"){

            var panel = this.#body.panelGet({panelName:u.field.panel.name});

            this.LogAction({
                type:"fieldBoxUpdate",
                action:"field delete update",
                msg:{...u,panel},
            });

            if(panel.build.tipeGet() == "table"){

                switch (this.#body.stateGet()) {
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

                this.Update_AddChangeField({
                    fieldName:u.field.name,
                    value,y
                });
                /*this.Update_AddChange({
                    fieldName:u.field.name,
                    value,y
                });*/ 
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


    

}