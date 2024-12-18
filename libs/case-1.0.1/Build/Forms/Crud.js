
class Crud extends ODD {

    constructor(i){

        super(i);

        this.#SetVariables(i);
        this.#Build(i);

        let k = this;

        this.#Load({
            success:()=>{

                k.#questionsSetTutorials();
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

    #SetVariables({title,stateTools=[],questions=[],stateStart="reload",afterCancel="reload",afterDelete="reload",afterInsert="reload",afterUpdate="reload",newLinesStart=1,newActive=true,tableMain,selects,joins,inserts=[],orders=[],conditions=[],fields=[],filters=[],loads=[]}){

        this.#title = title;
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
        this.#fields = fields.filter(f=>f!=null);

        loads=loads.filter(ld=>ld!=null);
        this.#loadData.max = loads.length;
        this.#loadData.data = loads;

        
        this.#newActive = newActive;
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
            var toolQuest = st.tools.find(t=>t.name == "question");
            if(toolQuest) toolQuest.show = true;
        }); 
        stateTools.forEach(st => {
                
            this.#State_SetTools({
                stateName:st.name,
                toolsSet:st.tools,
            });
        });
              
        
        //question
        this.#questionSet({questions});
        var questions = [...this.#questions];

        var questions_op = questions.map(q=>{return {value:q.value,show:q.show}});
        var questionTool = this.#bodyTools.find(t=>t.name=="question");
        questionTool.box.options = questions_op;
    }

    #questions = [
        {value:"v1",show:"¿como lo utilizo?",tutorial:null,elementsInfo:[]},
        //{value:"v2",show:"¿que significan los campos?",tutorial:null,elementsInfo:[]},
        //{value:"v3",show:"¿como lo utilizo?",tutorial:null},
    ];
    questionsGet(){return this.#questions};

    #questionSet({questions=[]}){

        questions.forEach(q => {
            
            var qfound = this.#questions.find(qf=>qf.value==q.value);
            if(qfound){

                //console.log("set question!!--------");
                //console.log("set q " + q.value, q.elementsInfo,qfound);
                
                qfound.elementsInfo = q.elementsInfo.filter(e=>e!=null);
            }
        });
    }

    #questionsSetTutorials(){

        //console.log("-----------settutorial-------");

        this.#questionSetTutorialQ1();

        /*var questionQ2 = this.#questions.find(q=>q.value=="v2");
        var v2ElementsInfo = [...questionQ2.elementsInfo];
        
        this.#fields.filter(fld=>fld.descripcion != null).forEach(fld=>{

            var panel = this.#PanelGet({panelTitle:fld.panel});
            var divConteiner = null;
                 

            switch (panel.tipe) {
                case "table":
                    
                    var tbField = panel.build.fieldGet({fieldName:fld.name});    
                    divConteiner = tbField.th;
                    
                break;

                case "form":

                    divConteiner = panel.build.fieldGetLabel({fieldName:fld.name}).parentGet();

                break;
            }

            if(divConteiner){

                v2ElementsInfo.push({
                    id:divConteiner.id,
                    descripcion:fld.descripcion,
                });
            }
            
        });

        var questOpDom = $('#'+this.#bodyTools.find(t=>t.name=="question").dom.Blocks_Get()[2].id);
        if(v2ElementsInfo.length == 0) questOpDom.hide();
        else questOpDom.show();
        
        questionQ2.tutorial = new Tutorial({elementsInfo:v2ElementsInfo});*/

        this.CallEvent({name:"setTutorials"});
        
    }

    #questionSetTutorialQ1(){

        var question = this.#questions.find(q=>q.value=="v1");
        var v1ElementsInfo = [...question.elementsInfo];

        this.#bodyTools.forEach(tool => {
            
            if(tool.show == true && tool.descripcion!=null){

                v1ElementsInfo.push({
                    id: this.Tools_GetBox({toolName:tool.name}).Blocks_Get()[0].id,
                    descripcion: tool.descripcion,
                });
            }   
        });

        this.#fields.filter(fld=>fld.descripcion != null).forEach(fld=>{

            var panel = this.#PanelGet({panelTitle:fld.panel});
            var divConteiner = null;
                 

            switch (panel.tipe) {
                case "table":
                    
                    var tbField = panel.build.fieldGet({fieldName:fld.name});    
                    divConteiner = tbField.th;
                    
                break;

                case "form":

                    divConteiner = panel.build.fieldGetLabel({fieldName:fld.name}).parentGet();

                break;
            }

            if(divConteiner){

                v1ElementsInfo.push({
                    id:divConteiner.id,
                    descripcion:fld.descripcion,
                });
            }
            
        });
        
        var questOpDom = $('#'+this.#bodyTools.find(t=>t.name=="question").dom.Blocks_Get()[1].id);
        if(v1ElementsInfo.length == 0) questOpDom.hide();
        else questOpDom.show();
        
        //console.log(this.#fields[0].name + " question 1", v1ElementsInfo);
        question.tutorial = new Tutorial({elementsInfo:v1ElementsInfo});
    }

    #questionEvent({value}){

        console.log("event question " + value);
        
        if(value){

            var question = this.#questions.find(q=>q.value == value);
            if(question.tutorial){

                question.tutorial.startTutorial();
            }
        }
    }

    #title="crud";
    #conection;
    Conection_Get(){return this.#conection};

    #tableMain;
    #selects;
    #selectPrimary;
    #joins;
    #conditions;
    #orders;
    #inserts;

    //------fields-------

    #fields;
    fieldsGet(){return this.#fields}
    fieldGetTutorialElement({fieldName}){

        var fld = this.#fields.find(f=>f.name==fieldName);
        var panel = this.#PanelGet({panelTitle:fld.panel});

        switch (panel.tipe) {
            case "table":
                
                var tbField = panel.build.fieldGet({fieldName:fld.name});    
            return tbField.th;

            case "form":

            return panel.build.fieldGetLabel({fieldName:fld.name}).parentGet();
        }
    }

    Field_Get({fieldName}){

        return this.#fields.find(f=>f.name==fieldName);
    }

    #Fields_SetOptions({options}){


    }

    #SelectGet({selectName}){

        var select = this.#selects.find(slc=>slc.field == selectName);
        return select;
    }

    SelectPrimaryGet(){

        return this.#selectPrimary;
    }

    //-------build----------

    #Build({parent,title,head=true,attributes,panels,filters,configShow,configHead,configTitle,configToolsPositions,config}){

        

        this.#Build_Body({parent,title,head,attributes});
        this.#Build_Panels({panels});
        this.#Config_Build({filters,configShow,configHead,configTitle,configToolsPositions,config});

        this.#LoadingScreenBuild({parent:this.#bodyWindow.Conteiner_Dom()});
        this.LoadingScreenSetActive({active:false});

        this.CallEvent({name:"build"});
    }

    #bodyWindow;
    #bodyForm = null;
    #bodyTools = [
        {x:0,y:1,index:0,name:"config",descripcion:"selecciona para realizar una busqueda",box:{tipe:5,value:'<i class="bi bi-gear"></i>',class:"btn btn-primary btn-sm",update:()=>{this.Config_ShowChange()}},dom:null},
        {x:0,y:1,index:1,name:"load",descripcion:"selecciona para cargar datos externos",box:{tipe:5,value:'<i class="bi bi-database"></i>',class:"btn btn-primary btn-sm",update:()=>{this.#Load({})}},dom:null},

        {x:2,y:1,index:0,name:"excel",descripcion:"descargar datos en archivo excel",box:{id:"btn1",tipe:5,value:"excel",class:"btn btn-success btn-sm",update:()=>{this.#Event_UpdateToolExcel({})}},dom:null},
        {x:2,y:1,index:1,name:"question",box:{id:"btn2",tipe:5,value:'<i class="bi bi-question-circle"></i>',class:"btn btn-secondary btn-sm",update:(info)=>{this.#questionEvent({value:info});}},dom:null},

        {x:0,y:3,index:0,name:"sizes",descripcion:"seleccion la cantidad de registros ver",box:{tipe:3,value:1,options:[{show:1,value:1},{show:10,value:10},{show:25,value:25},{show:50,value:50},{show:999,value:999}],update:()=>{this.#Event_UpdateToolPages({})}},dom:null},

        {x:1,y:3,index:0,name:"reload",descripcion:"selecciona para recargar",box:{id:"btn1",tipe:5,value:"recargar",class:"btn btn-primary btn-sm",update:()=>{this.#Event_UpdateToolReload({})}},dom:null},
        {x:1,y:3,index:1,name:"update",descripcion:"selecciona para actualizar",box:{id:"btn2",tipe:5,value:"actualizar",class:"btn btn-primary btn-sm",update:()=>{this.#Event_UpdateToolUpdate({})}},dom:null},
        {x:1,y:3,index:2,name:"new",descripcion:"selecciona para crear nuevo registro",box:{id:"btn3",tipe:5,value:"nuevo",class:"btn btn-primary btn-sm",update:()=>{this.#Event_UpdateToolNew({})}},dom:null},
        {x:1,y:3,index:3,name:"insert",descripcion:"selecciona para insertar nuevo registro",box:{id:"btn4",tipe:5,value:"insertar",class:"btn btn-primary btn-sm",update:()=>{this.#Event_UpdateToolInsert({})}},dom:null},
        {x:1,y:3,index:4,name:"delete",descripcion:"selecciona para borrar registro",box:{id:"btn5",tipe:5,value:"borrar",class:"btn btn-danger btn-sm",update:()=>{this.#Event_UpdateToolDelete({})}},dom:null},
        {x:1,y:3,index:5,name:"cancel",descripcion:"selecciona para cancelar",box:{id:"btn6",tipe:5,value:"cancelar",class:"btn btn-danger btn-sm",update:()=>{this.#Event_UpdateToolCancel({})}},dom:null},
        {x:1,y:3,index:6,name:"addLine",descripcion:"selecciona para añadir nueva linea para insertar registro",box:{id:"btn7",tipe:5,value:"añadir linea",class:"btn btn-primary btn-sm",update:()=>{this.#New_AddLine({})}},dom:null},
        {x:1,y:3,index:7,name:"pdf",descripcion:"descargar datos en pdf",box:{id:"btn8",tipe:5,value:"pdf",class:"btn btn-danger btn-sm",update:()=>{this.#Event_UpdateToolPDF({})}},dom:null},

        {x:2,y:3,index:0,name:"pages",descripcion:"selecciona pagina que ver",box:{tipe:3,value:1,options:[{show:"pag1",value:1}],update:()=>{this.#Event_UpdateToolPages({})}},dom:null},
    ];
    #Build_Body({parent,title,head,attributes=[]}){
        
        //console.log("set",attributes);

        this.#bodyWindow = new Window({
            instance:"window main",log:true,
            parent,title,attributes,head,
            grid:{
                cols:[
                    [12],//0 - config
                    [4,4,4],//1 - top
                    [12],//2 - conteiner
                    [3,6,3],//3 - botton
                ],
                boxs:[
                    ...this.#bodyTools,
                ],
                attributes:[
                    {y:0,x:0,attributes:[{name:"class",value:""}]},

                    {y:1,x:0,attributes:[{name:"class",value:"d-flex justify-content-start "}]},
                    {y:1,x:1,attributes:[{name:"class",value:""}]},
                    {y:1,x:2,attributes:[{name:"class",value:"d-flex justify-content-end "}]},

                    {y:2,x:0,attributes:[{name:"class",value:""}]},

                    {y:3,x:0,attributes:[{name:"class",value:"d-flex justify-content-start "}]},
                    {y:3,x:1,attributes:[{name:"class",value:"d-flex justify-content-center "}]},
                    {y:3,x:2,attributes:[{name:"class",value:"d-flex justify-content-end "}]},
                ],
            },
        });

        this.#config.parentDom = this.#bodyWindow.Conteiner_GetColData({x:0,y:0}).col;

        //set dom to tools
        this.#bodyTools.forEach(tool => {
            
            tool.dom = this.#bodyWindow.Conteiner_GetColData({x:tool.x,y:tool.y}).boxs[tool.index];
        });
        let k = this;
        this.#bodyTools.forEach(tool=>{

            k.Tools_OneToolSetShow({toolName:tool.name,show:false});
        });
    }

    #conteiner_gr;
    #conteiner_panels = [];
    #Build_Panels({panels=[],breaklevel}){

        panels = panels.filter(p=>p!=null);
        panels.forEach(pn => {
            
            if(pn.tag == null && pn.title != null) pn.tag = pn.title;
        });

        var lastY = 0;
        var lastX = 0;
        var colless = 12;
        var line = [];
        var panels_cols = [];
        var atts = [];

        for (let y = 0; y < panels.length; y++) {

            const panel = panels[y];
            panel.y = lastY;
            panel.x = lastX;

            line.push(panel.col);
            atts.push({
                x:panel.x,
                y:panel.y,
                attributes:[
                    {name:"class",value:"col-"+panel.col},
                ],
            });
            colless -=  panel.col;

            if(colless<=0){

                panels_cols.push(line);
                lastY++;
                lastX=0;
                line = [];
                colless = 12;
            }else lastX++;
        }

        var gridConfig = GetGridConfig({panels,breaklevel});
        //console.log("crud set -> ","panels:",panels," gridConfig:",gridConfig);        

        this.#conteiner_gr = new Grid({
            parent:this.#bodyWindow.Conteiner_GetColData({x:0,y:2}).col,
            //cols:panels_cols,
            cols:gridConfig.cols,
            attributes:gridConfig.attributes,
        });

        let k = this;
        var events = [
            {
                name:"boxUpdate",
                actions:[
                    {
                        name:"call box event update",
                        action:(i)=>{

                            k.#Event_BoxUpdate(i);
                        }
                    }
                ],
            }
        ];

        panels.forEach(panel => {
            
            var fieldsOfPanel = this.#fields.filter(f=>f.panel==panel.title);
            panel.parent = this.#conteiner_gr.GetColData({x:panel.x,y:panel.y}).col;
            switch(panel.tipe){

                case "form":
                    panel.build = new Window({
                        instance:"panel " + panel.title,
                        parent: panel.parent,
                        title: panel.tag,
                        blocked:panel.blocked,
                        show:panel.show,
                        head:panel.head,
                        h:panel.h,
                        grid:{
                            cols: this.#GetColsOfPanels({panels:fieldsOfPanel}),
                        },
                        fields:fieldsOfPanel,
                        events,
                    });
                break;

                case "table":
                    panel.build = new Table_Grid({
                        attributes: panel.attributes,
                        parent: panel.parent,
                        fields:fieldsOfPanel,
                        h:panel.h,
                        events,
                    });
                break;
            }            

        });
        this.#conteiner_panels = panels;

        //console.log("build conteiners panels",this.#conteiner_panels);
    }

    #PanelGet({panelTitle}){

        var panelInfo = this.#conteiner_panels.find(p=>p.title==panelTitle);
        return panelInfo;
    }

    Panels_GetBuild({panelTitle}){

        return this.#conteiner_panels.find(p=>p.title==panelTitle).build;
    }

    //--------loading------

    #loadingScreen = null;

    #LoadingScreenBuild({parent}){


        this.#loadingScreen = new LoadingScreen({
            parent,
            active:false,  
        });

    }

    LoadingScreenSetActive({active=true}){

        this.#loadingScreen.SetActive({active});
    }

    //-------config------

    #config = {
        parentDom:null,
        show:true,
    };
    Config_ShowSet({show,slow=false}){

        this.#config.show=show;
        var idParentDom = this.#config.parentDom.id;
        if(this.#config.show) $('#'+idParentDom).show((slow?"slow":null));
        else $('#'+idParentDom).hide((slow?"slow":null));
    }
    Config_ShowChange(){

        this.Config_ShowSet({show:!this.#config.show,slow:true});
    }

    #Config_Build({filters,configShow=false,configHead=true,configTitle="fitros",configToolsPositions=[],config}){

        //if(config!=null) console.log("-------------buildconfig",config);
        
        
        this.#Filters_Build({
            filters,
            title:configTitle,
            head:configHead,
            toolsPositions:configToolsPositions,
            questions:(config?config.questions:[]),
        });

        this.Config_ShowSet({show:configShow,slow:false});
    }

    //--------filters-----------

    #filters = null;
    Filters_Get(){return this.#filters};

    #Filters_Build({filters=[],title,head,show,blocked,toolsPositions=[],questions=[]}){

        let k = this;
        this.#filters = new windowFilters({
            log:false,
            parent: this.#bodyWindow.Conteiner_GetColData({x:0,y:0}).col,
            title,head,show,blocked,toolsPositions,
            filters,questions,
            events:[
                {
                    name:"reload",
                    actions:[
                        {
                            action:()=>{

                                k.SetState({stateName:"reload"});
                            }
                        }
                    ],
                }
            ],
        });
    }

    //-------private functions------

    #GetColsOfPanels({panels}){


        var lastY = 0;
        var lastX = 0;
        var colless = 12;
        var line = [];
        var panels_cols = [];
        for (let y = 0; y < panels.length; y++) {

            const panel = panels[y];
            panel.y = lastY;
            panel.x = lastX;

            line.push(panel.col);
            colless -=  panel.col;

            if(colless<=0){

                panels_cols.push(line);
                lastY++;
                lastX=0;
                line = [];
                colless = 12;
            }else lastX++;
        }

        return panels_cols;
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

        this.LoadingScreenSetActive({active:true});

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
        this.LoadingScreenSetActive({active:false});

        if(success!=null) success();
    }

    #Loaded_SetOptionsTo({}){

        let k = this;

        //fields
        this.#fields.forEach(field => {
            
            //console.log(field.name);
            //console.log(field.box.options!=null);

            if(field.load!=null&&field.load.field==null){
                    
                var loadOptions = this.Loaded_GetLoadOptions({
                    loadName:field.load.name,
                    loadShow:field.load.show,
                });            

                var valueDefault = loadOptions.length > 0 ? loadOptions[0].value : 1;
                if(field.box.value!=null) valueDefault = field.box.value;
                var rsp = this.#Event_SetOptionsToFields({field,loadOptions});
                if(rsp !=null && rsp.loadOptions) loadOptions = rst.loadOptions;

                //var lastOptions = field.load.startOptions;
                //if(lastOptions!=null) loadOptions = [...lastOptions,...loadOptions];
                field.box.options = loadOptions;
                field.box.value = valueDefault;

                var boxes = k.GetBoxs({fieldName:field.name});
                //console.log(boxes);
                boxes.forEach(box => {
                    
                    //console.log(box);
                    box.SetOptions(loadOptions);
                }); 
            }

            //console.log(field.box.options!=null);

        });

        console.log(this.#fields);

        //filters
        this.#filters.Filters_Get().forEach(filter=>{

            if(filter.load){

                var loadOptions = this.Loaded_GetLoadOptions({
                    loadName:filter.load.name,
                    loadShow:filter.load.show,
                });

                this.#filters.Filter_SetOptions({
                    filterName:filter.name,
                    options:loadOptions,
                })
                //var filterBox = this.#filters.Filter_GetBox({filterName:filter.name});
                //filterBox.SetOptions(loadOptions);

                /*if(filter.box.tipe == 4 || filter.box.tipe == 3){

                    var valuesAll = loadOptions.map((op)=>{return op.show});
                    filterBox.SetValue(valuesAll);
                }*/
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
        this.LoadingScreenSetActive({active:true});
        this.#Load({success:()=>{

            k.LoadingScreenSetActive({active:false});
            if(success!=null) success();
            k.#Event_LoadsReseted({});
        }});
    }

    //reload

    #reloadData = [];

    Reload_GetData(){

        return this.#reloadData;
    }

    Reload_GetData_Primarys(){

        return this.#reloadData.map((ln)=>{return ln[this.#selectPrimary.field]});
    }

    Reload({success}){

        let k = this;

        k.#Event_ReloadBefore({});

        k.LoadingScreenSetActive({active:true});
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

                    k.LoadingScreenSetActive({active:false});
                    k.#Event_ReloadAfter({reloadData:result});
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
            name:k.#title+" -> reload-getsize",
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

        console.log("reload data sql:",reloadDataSql);

        this.#conection.Request({
            php:"row",log:k.#ctr_log.reload,
            name:k.#title+" -> reload-reload",
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

        this.#conteiner_panels.forEach(panel => {
            
            var panelFields = this.#fields.filter(f=>f.panel==panel.title);
            panelFields.forEach(field => {
                
                var select = field.select;
                if(select || field.action!=null){

                    var values = result.map(rst=>{return select ? rst[select] : field.box.value});
                    k.SetValuesToBox({values,fieldName:field.name});
                }
                

            });
            
        });

        this.#Event_printAfter({result});
    }

    #Reload_Conditions({}){

        var conditions = [];

        //filters
        //console.log(this.#filters);
        var filtersCondition = this.#filters.GetConditions();
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

    Insert({inserts=[],success}){

        var e_rst = this.#Event_InsertBefore({inserts});
        if(e_rst!=null){

            if(e_rst.block == true) return this.SetState({stateName:this.#stateData.afterInsert});;
            if( e_rst.inserts) inserts=e_rst.inserts;
        }
        //console.log(this.#title+"- before inserts -> ",inserts);

        let k = this;
        k.LoadingScreenSetActive({active:true});
        this.#Insert_Request({inserts,success:({primaryNew})=>{

            k.LoadingScreenSetActive({active:false});
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

                //console.log(this.#title+"- insert start -> ",[...insertSql_inserts]);

                //insert by inserts saved
                insertSql_inserts = [...insertSql_inserts,...k.#inserts];

                //console.log(this.#title+"- insert add insert in form -> ",[...insertSql_inserts]);

                //insert by primary new
                insertSql_inserts.push({
                    field:k.#selectPrimary.field,
                    value:primaryNew,
                    tipe:"secuence",
                });

                //console.log(this.#title+"- insert add primary new -> ",[...insertSql_inserts]);

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

                //insert by fields
                k.#fields.forEach(field => {
                    
                    //no button, no div and select exist
                    var select = k.#SelectGet({selectName:field.select});
                    if(field.box.tipe != 0 && select){
  
                        //no primary in insert because primary have a value
                        if(!select.primary){

                            var fieldSelecField = select.field;
                            var fieldValues = k.GetValues({fieldName:field.name});

                            fieldValues.forEach(v => {
                                
                                insertSql_inserts.push({
                                    field: fieldSelecField,
                                    value: v,
                                });
                            });    
                            
                            //console.log(field.name, fieldValues);
                        }                        
                    }
                });    
                
                console.log(this.#title+"- go to insert -> ",[...insertSql_inserts]);

                //-----request------

                k.#conection.Request({
                    php:"success",log:true,
                    name:k.#title+"-insert-insert",
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

        this.#conteiner_panels.forEach(panel => {

            var fieldsOfPanel = this.#fields.filter(f=>f.panel==panel.title);
            
            switch (panel.tipe) {
                case "table":

                fieldsOfPanel.forEach(f => {
                        
                    var value = "";
                    var box = null;

                    value = f.box.value;
                    //else box = {tipe:0};

                    var values = [];
                    for (let cnt = 0; cnt < this.#stateData.newLinesStart; cnt++) {
                        
                        values.push(value);
                    }

                    this.SetValuesToBox({values,fieldName:f.name,box});
                });                   

                break;

                case "form":

                fieldsOfPanel.forEach(f => {
                    
                    if(f.action == "edit") console.log("new -> field:",f);
                    this.SetValuesToBox({values:[f.box.value],fieldName:f.name});
                });

                break;
            }
        });
    }

    #New_AddLine({}){

        this.#conteiner_panels.forEach(panel => {

            var fieldsOfPanel = this.#fields.filter(f=>f.panel==panel.title);
            
            switch (panel.tipe) {
                case "table":

                fieldsOfPanel.forEach(f => {
                        
                    var value = "";
                    var box = null;

                    value = f.box.value;
                    //else box = {tipe:0};

                    var values = this.GetValues({fieldName:f.name});
                    values.push(value);

                    this.SetValuesToBox({values,fieldName:f.name,box});
                });                   

                break;

                case "form":

                fieldsOfPanel.forEach(f => {
                    
                    if(f.action == "edit") console.log("new -> field:",f);
                    this.SetValuesToBox({values:[f.box.value],fieldName:f.name});
                });

                break;
            }
        });
    }

    #New_RemoveLine({y,from}){

        console.log("remove line ", from);
        this.#conteiner_panels.forEach(panel => {

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
        });
    }

    //update

    #Update({success}){

        let k = this;
        k.LoadingScreenSetActive({active:true});

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
                
                var field = this.#fields.find(fd=>fd.name==fch.fieldName);
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
                name:k.#title+" -> update-request",
                sql:updateSql,
                success:()=>{
    
                    k.#Update_success({success});
                },
            });
         }
         else this.#Update_success({success});       
    }

    #Update_success({success,result}){

        this.LoadingScreenSetActive({active:false});
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

        console.log(this.#title,"-> update change", "field:",fieldName," value:",value,"list:",this.#update_listOfChanges);
        this.#Event_AddChange({fieldName,value,primary});
    }

    //delete

    Delete({primaryValue,success}){

        let k = this;
        k.LoadingScreenSetActive({active:true});

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

                k.LoadingScreenSetActive({active:false});
                k.SetState({stateName:k.#stateData.afterDelete});
                if(success!=null)success({primaryValue});
            }
        })
    }

    //block
    #Block({active=true}){

        
        this.#conteiner_panels.forEach(panel => {

            var fieldsOfPanel = this.#fields.filter(f=>f.panel==panel.title);
            
            switch (panel.tipe) {
                case "table":

                    if(active){

                        fieldsOfPanel.forEach(f => {
                        
                            this.SetValuesToBox({values:[],fieldName:f.name});
                        });
                    }

                break;

                case "form":

                fieldsOfPanel.forEach(f => {
                    
                    this.SetValuesToBox({values:[f.box.value],fieldName:f.name});
                    this.GetBoxs({fieldName:f.name})[0].Block({active});
                });

                break;
            }
        });
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

    SetState({stateName}){

        this.#stateData.state = stateName;
        //set tools
        var StateToolsData = this.#stateData.stateTools.find(stT=>stT.name == stateName);
        //console.log("set tool by state: " + stateName + " of crud: " + this.#title+" statetoolsdata:", StateToolsData);
        if(this.#ctr_log.state)console.log(this.#title, " -> state: " + stateName, "stateToolsData:",StateToolsData);

        this.#bodyTools.forEach(tool => {
            
            var stateToolData = StateToolsData.tools.find(stTool => stTool.name == tool.name);

            //if(tool.name=="pages")console.log(this.#title," state: ",stateName," tool: ",tool, "statetooldata: ",stateToolData);

            if(stateToolData!=null){

                if(this.#title == "orden de produccion"){

                    
                    if(tool.name == "delete") console.log("-------delete statetooldata:", stateToolData);
                    
                }
                

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
                
                this.Reload({});
            break;

            case "block":
                
                this.#Block({active:true});
            break;
        }

        this.CallEvent({name:"setStateAfter",params:{stateName}});
        this.#questionSetTutorialQ1();

    }

    #State_SetTools({stateName,toolsSet=[]}){

        var logFuncion = "State_setTools of crud: " + this.#title;

        var stateToolsData = this.#stateData.stateTools.find(st=>st.name==stateName);

        console.log(logFuncion, "statetoolsdata:",stateToolsData);

        stateToolsData.tools.forEach(toolData => {

            var toolSet = toolsSet.find(fset=>fset.name == toolData.name);
            
            //console.log("set tool values state: " + stateName + " of crud: " + this.#title+ " tooldata:", toolData, "toolset:",toolSet);

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

        this.#Update({});
    }
    
    #Event_UpdateToolPages({}){

        this.Reload({});
    }

    #Event_UpdateToolExcel({}){

        var data = [];

        var header = [];
        this.#fields.forEach(field => {
            
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
        }


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

    #Event_BoxUpdate(u){

        let k = this;
        u.k = this;
        u.primaryValues = this.#reloadData.map(ln=>{return ln[k.#selectPrimary.field]});
        //console.log("crud -> event box update",u);
        

        if(u.field.action == "delete"){

            var panel = this.#conteiner_panels.find(p=>p.title == u.field.panel);
            if(panel.tipe == "table"){

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

        var panel = this.#conteiner_panels.find(p=>p.title==u.field.panel);
        var panelIsTable = panel.tipe=="table";
        var y = panelIsTable ? u.y : 0;
        var value = this.GetValues({fieldName:u.field.name})[y];
        var primary = u.primaryValues[y];

        if(this.#stateData.state!="new" && u.field.action==null){

            //console.log(this.#stateData.state,"boxupdate -> add update, field:",u.field.name,",value:",value,",primary:",primary);

            if(u.field.box.tipe !=0 && u.field.box.tipe !=5){

                this.Update_AddChange({
                    fieldName:u.field.name,
                    value,primary,
                }); 
            }              
        }    

        //-------if load change----------

        var fieldsLoadByField = this.#fields.filter(f=>f.load!=null&&f.load.field!=null);
        //console.log("fieldsload",fieldsLoadByField);
        if(fieldsLoadByField.length>0){

            fieldsLoadByField.forEach(f_ld => {
                
                var load = f_ld.load;
                if(load.field == u.field.name){

                    var loadData = this.Loaded_GetLoadData({loadName:load.name});
                    var dataFound = loadData.result.find(rst=>rst[load.value]==value);
                    if(dataFound){

                        console.log(u.field,loadData);
                        var boxs = this.GetBoxs({fieldName:load.field});
                        boxs[y].SetValue(dataFound[load.show]);
                    }
                }
            });
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

        if(this.#stateData.state=="reload"){

            var field = this.#fields.find(f=>f.name==fieldName);
            if(field != null){

                var panel = this.#conteiner_panels.find(p=>p.title==field.panel);
                var panelIsTable = panel.tipe=="table";
                if(panelIsTable) this.#Update({});
            }
           
        }

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

        var tool = this.#bodyTools.find(t=>t.name==toolName);
        //if(toolName=="pages") console.log("toolName:",toolName,"tool:",tool,"show:",show,"value:",value);

        if(value!=null) tool.dom.SetValue(value);

        tool.show = show;
        if(show==false) tool.dom.Hide();
        else tool.dom.Show();
        //.Block({active});
    }

    Tools_GetBox({toolName}){

        var tool = this.#bodyTools.find(t=>t.name==toolName);
        return tool.dom;
    }

    GetBoxs({fieldName}){

        var field = this.#fields.find(f=>f.name == fieldName);
        if(field == null) return null;

        var panel = this.#conteiner_panels.find(p=>p.title == field.panel);
        var boxs = [];

        //console.log("fieldName:",fieldName,"field:",field);

        switch(panel.tipe){

            case "table":
                
                boxs = panel.build.Fields_GetBoxs({fieldName});
            break;

            case "form":

                boxs = [panel.build.Fields_GetBox({fieldName})];
            break;
        }

        return boxs;
    }

    GetValues({fieldName}){

        var boxes =  this.GetBoxs({fieldName});
        if(boxes == null) return null;

        var values = boxes.map(bx=>{

            return bx.GetValue();
        });

        return values;
    }

    GetValue({fieldName,y}){

        var values = this.GetValues({fieldName});
        if(values == null){
            console.log("values is null, fieldName: " + fieldName);
            return null;
        }

        return values[y];
    }

    SetValuesToBox({values=[],fieldName,box}){

        var field = this.#fields.find(f=>f.name == fieldName);
        if(field == null) return;

        var panel = this.#conteiner_panels.find(p=>p.title==field.panel);

        switch (panel.tipe) {

            case "table":
                
                //console.log(fieldName,values,box);
                panel.build.Fields_SetValues({values,fieldName,boxNew:box});
                
            break;
        
            case "form":

                var boxs = this.GetBoxs({fieldName});
                boxs[0].SetValue(values[0]);

            break;
        }

    }

    SetValue({fieldName,y,value}){

        var boxes = this.GetBoxs({fieldName});
        var box = boxes && y < boxes.length  ? boxes[y] : null;
        if(box) box.SetValue(value);
    }

    

}