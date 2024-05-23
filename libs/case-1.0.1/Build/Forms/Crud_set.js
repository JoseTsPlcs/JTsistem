
class Crud_set extends ODD {

    constructor(i){

        super(i);

        this.#SetVariables(i);
        this.#Build(i);

        let k = this;

        if(i.stateTools){

            i.stateTools.forEach(st => {
                
                //console.log(st);
                this.#State_SetTools({
                    stateName:st.name,
                    toolsSet:st.tools,
                });
            });
        }

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

    #SetVariables({title,stateStart="reload",stateBase="reload",newActive=true,tableMain,selects,joins,inserts=[],orders=[],conditions=[],fields=[],loads=[]}){

        this.#title = title;
        this.#conection = db_lip;
        this.#tableMain = tableMain;
        this.#selects = selects;
        this.#joins = joins;
        this.#conditions = conditions;
        this.#orders = orders;
        this.#inserts = inserts;
        this.#selectPrimary = selects.find(slc=>slc.primary==true);
        this.#fields = fields;

        this.#newActive = newActive;
        this.#stateData.stateStart=stateStart;
        this.#stateData.stateBase=stateBase;

        this.#loadData.max = loads.length;
        this.#loadData.data = loads;
    }

    #title="crud";
    #conection;
    #tableMain;
    #selects;
    #selectPrimary;
    #joins;
    #conditions;
    #orders;
    #inserts;

    //------fields-------

    #fields;
    #Fields_SetOptions({options}){


    }

    #SelectGet({selectName}){

        var select = this.#selects.find(slc=>slc.field == selectName);
        return select;
    }

    //-------build----------

    #Build({parent,title,panels,filters,configShow}){


        this.#Build_Body({parent,title});
        this.#Build_Panels({panels});
        this.#Config_Build({filters,configShow});

        this.#Loading_Build({parent:this.#body_w.Conteiner_Dom()});
        this.#Loading_SetActive({active:false});
    }

    #body_w;
    #body_tools = [
        {x:0,y:1,index:0,name:"config",box:{tipe:5,value:"config",class:"btn btn-outline-primary btn-sm",update:()=>{this.Config_ShowChange()}},dom:null},
        {x:0,y:1,index:1,name:"load",box:{tipe:5,value:"load",class:"btn btn-outline-primary btn-sm"},dom:null},

        {x:2,y:1,index:0,name:"excel",box:{id:"btn1",tipe:5,value:"excel",class:"btn btn-outline-success btn-sm"},dom:null},
        {x:2,y:1,index:1,name:"pdf",box:{id:"btn2",tipe:5,value:"pdf",class:"btn btn-outline-danger btn-sm"},dom:null},

        {x:0,y:3,index:0,name:"sizes",box:{tipe:3,value:1,options:[{show:1,value:1},{show:10,value:10},{show:50,value:50}]},dom:null},

        {x:1,y:3,index:0,name:"reload",box:{id:"btn1",tipe:5,value:"recargar",class:"btn btn-outline-primary btn-sm",update:()=>{this.#Event_UpdateToolReload({})}},dom:null},
        {x:1,y:3,index:1,name:"update",box:{id:"btn2",tipe:5,value:"actualizar",class:"btn btn-outline-primary btn-sm",update:()=>{this.#Event_UpdateToolUpdate({})}},dom:null},
        {x:1,y:3,index:2,name:"new",box:{id:"btn3",tipe:5,value:"nuevo",class:"btn btn-outline-primary btn-sm",update:()=>{this.#Event_UpdateToolNew({})}},dom:null},
        {x:1,y:3,index:3,name:"insert",box:{id:"btn4",tipe:5,value:"insertar",class:"btn btn-outline-primary btn-sm",update:()=>{this.#Event_UpdateToolInsert({})}},dom:null},
        {x:1,y:3,index:4,name:"delete",box:{id:"btn5",tipe:5,value:"borrar",class:"btn btn-outline-danger btn-sm",update:()=>{this.#Event_UpdateToolDelete({})}},dom:null},
        {x:1,y:3,index:5,name:"cancel",box:{id:"btn6",tipe:5,value:"cancelar",class:"btn btn-outline-danger btn-sm",update:()=>{this.#Event_UpdateToolCancel({})}},dom:null},

        {x:2,y:3,index:0,name:"pages",box:{tipe:3,value:1,options:[{show:"pag1",value:1}],update:()=>{this.#Event_UpdateToolPages({})}},dom:null},
    ];
    #Build_Body({parent,title}){

        this.#body_w = new Window({
            parent,title,
            grid:{
                cols:[
                    [12],//0 - config
                    [4,4,4],//1 - top
                    [12],//2 - conteiner
                    [4,4,4],//3 - botton
                ],
                boxs:[
                    ...this.#body_tools,
                ],
                attributes:[
                    {y:1,x:0,attributes:[{name:"class",value:"d-flex justify-content-start"}]},
                    {y:1,x:2,attributes:[{name:"class",value:"d-flex justify-content-end"}]},

                    {y:3,x:0,attributes:[{name:"class",value:"d-flex justify-content-start"}]},
                    {y:3,x:1,attributes:[{name:"class",value:"d-flex justify-content-center"}]},
                    {y:3,x:2,attributes:[{name:"class",value:"d-flex justify-content-end"}]},
                ],
            }
        });

        this.#config.parentDom = this.#body_w.Conteiner_GetColData({x:0,y:0}).col;

        //set dom to tools
        this.#body_tools.forEach(tool => {
            
            tool.dom = this.#body_w.Conteiner_GetColData({x:tool.x,y:tool.y}).boxs[tool.index];
        });
    }

    #conteiner_gr;
    #conteiner_panels = [];
    #Build_Panels({panels=[]}){

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

        //console.log("crud set -> ", panels_cols, panels);

        this.#conteiner_gr = new Grid({
            parent:this.#body_w.Conteiner_GetColData({x:0,y:2}).col,
            cols:panels_cols,
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
                        parent: panel.parent,
                        title: panel.title,
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

    //--------loading------

    #loading = {
        state:false,
        dom:null,
    }

    #Loading_Build({parent}){

        /*<div id="contenedor-carga">
            <div id="carga">
                <div class="spinner"></div>
            </div>
        </div>*/
        //console.log("parent",parent);

        this.#loading.dom = document.createElement("div");
        this.#loading.dom.setAttribute("id","contenedor-carga");
        parent.appendChild(this.#loading.dom);

        var dom1 = document.createElement("div");
        dom1.setAttribute("id","carga");
        this.#loading.dom.appendChild(dom1);


        var dom2 = document.createElement("div");
        dom2.setAttribute("class","spinner");
        dom1.appendChild(dom2);

    }

    #Loading_SetActive({active=true}){

        this.#loading.state = active;
        this.#loading.dom.style.display = this.#loading.state ? "block":"none";
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

    #Config_Build({filters,configShow=false}){

        this.#Filters_Build({filters});

        this.Config_ShowSet({show:configShow,slow:false});
    }

    //--------filters-----------

    #filterWindow = null;
    #Filters_Build({filters=[]}){

        let k = this;
        this.#filterWindow = new windowFilters({
            parent: this.#body_w.Conteiner_GetColData({x:0,y:0}).col,
            title:"filtros",
            filters,
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

        this.#Loading_SetActive({active:true});

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
        this.#Loading_SetActive({active:false});

        if(success!=null) success();
    }

    #Loaded_SetOptionsTo({}){

        let k = this;

        //fields
        this.#fields.forEach(field => {
            
            if(field.load!=null){
                    
                var loadOptions = this.Loaded_GetLoadOptions({
                    loadName:field.load.name,
                    loadShow:field.load.show,
                });
                var valueDefault = loadOptions[0].value;
                var rsp = this.#Event_SetOptionsToFields({field,loadOptions});

                if(rsp !=null && rsp.loadOptions) loadOptions = rst.loadOptions;

                field.box.options = loadOptions;
                field.box.value = valueDefault;

                var boxes = k.GetBoxs({fieldName:field.name});
                boxes.forEach(box => {
                    
                    box.SetOptions(loadOptions);
                }); 
            }

        });

        //filters
        this.#filterWindow.Filters_Get().forEach(filter=>{

            if(filter.load){

                var loadOptions = this.Loaded_GetLoadOptions({
                    loadName:filter.load.name,
                    loadShow:filter.load.show,
                });
                var filterBox = this.#filterWindow.Filter_GetBox({filterName:filter.name});
                filterBox.SetOptions(loadOptions);

                if(filter.box.tipe == 4){

                    var valuesAll = loadOptions.map((op)=>{return op.show});
                    filterBox.SetValue(valuesAll);
                }
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
        //console.log(loadName,data,ops);
        return ops;

    }

    Load_Reset({success}){

        let k = this;
        this.#Loading_SetActive({active:true});
        this.#Load({success:()=>{

            k.#Loading_SetActive({active:false});
            k.#Event_LoadsReseted({});
            if(success!=null) success();
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
        k.#Loading_SetActive({active:true});
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
                pagesBox.SetValue(lastpage);
                
                k.#Reload_RequestData({success:({result})=>{

                    k.#Loading_SetActive({active:false});
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

                var sizeResult = result[0]["size"];
                var size = parseFloat(sizeResult);
                
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
        //console.log(this.#filterWindow);
        var filtersCondition = this.#filterWindow.GetConditions();
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
        if(e_rst && e_rst.inserts) inserts=e_rst.inserts;

        //console.log(this.#title+"-insert -> ",inserts);
        let k = this;
        k.#Loading_SetActive({active:true});
        this.#Insert_Request({inserts,success:({primaryNew})=>{

            k.#Loading_SetActive({active:false});
            var rsp_ins = k.#Event_InsertAfter({field:k.#selectPrimary.field,value:primaryNew});
            if(rsp_ins != null && rsp_ins.stateBlock==true) return;
            k.#SetBaseState();
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

                var insertSql_inserts = inserts;

                //insert by inserts saved
                insertSql_inserts = [...insertSql_inserts,...k.#inserts];

                //insert by primary new
                insertSql_inserts.push({
                    field:k.#selectPrimary.field,
                    value:primaryNew,
                });

                //inserst by crudjoins
                k.#crudJoins.forEach(jn=>{

                    //if no primary field
                    if(jn.field != k.#selectPrimary.field){

                        insertSql_inserts.push({
                            field: jn.field,
                            value:jn.value,
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
                            var fieldValue = k.GetValue({fieldName:field.name,y:0});

                            insertSql_inserts.push({
                                field: fieldSelecField,
                                value: fieldValue,
                            });
                        }                        
                    }
                });    
                
                console.log(insertSql_inserts);

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

        this.#conteiner_panels.forEach(panel => {

            var fieldsOfPanel = this.#fields.filter(f=>f.panel==panel.title);
            
            switch (panel.tipe) {
                case "table":

                    fieldsOfPanel.forEach(f => {
                        
                        this.SetValuesToBox({values:[f.box.value],fieldName:f.name});
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
        this.#Event_NewAfter({});
    }

    //update

    #Update({success}){

        let k = this;
        k.#Loading_SetActive({active:true});
        if(this.#update_listOfChanges.length > 0 && this.#update_listOfChanges[0].fields.length > 0){

            //----sql----
            
            var updateConditions = [];
            var updateChangeFist = this.#update_listOfChanges[0];
            updateConditions.push({
                table:this.#selectPrimary.table,
                field:this.#selectPrimary.field,
                inter:"=",
                value:updateChangeFist.primary,
            });

            var updateSets = [];
            updateChangeFist.fields.forEach(fch => {
                
                var field = this.#fields.find(fd=>fd.name==fch.fieldName);
                var select = this.#selects.find(slc=>slc.field==field.select);
                if(select){

                    updateSets.push({
                        field:select.field,
                        value:fch.value,
                    });
                }
            });

            //----request----

            if(updateSets.length>0){

                this.#conection.Request({
                    php:"success",log:k.#ctr_log["update"],
                    name:k.#title+" -> update-request",
                    sql:k.#conection.GetSql_Update({
                        tableMain:k.#tableMain,
                        sets: updateSets,
                        conditions:updateConditions,
                    }),
                    success:()=>{
        
                        k.#Update_success({success});
                    },
                })
            }
            else this.#Update_success({success});           
            
        }
        else this.#Update_success({success});
    }

    #Update_success({success,result}){

        this.#Loading_SetActive({active:false});
        this.#update_listOfChanges=[];
        this.#SetBaseState();
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
        k.#Loading_SetActive({active:true});

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

                k.#Loading_SetActive({active:false});
                k.#SetBaseState({});
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
                    {name:"load",show:true},

                    {name:"excel",show:false},
                    {name:"pdf",show:false},

                    {name:"sizes",show:false},
                    {name:"reload",show:false},
                    {name:"update",show:false},
                    {name:"new",show:false},
                    {name:"insert",show:true},
                    {name:"cancel",show:true},
                    
                    {name:"pages",show:false},
                ],
            },
            {
                name:"reload",
                tools:[
                    {name:"config",show:true},
                    {name:"load",show:true},
                    
                    {name:"excel",show:true},
                    {name:"pdf",show:true},

                    {name:"sizes",show:true},
                    {name:"reload",show:true},
                    {name:"update",show:true},
                    {name:"new",show:true},
                    {name:"insert",show:false},
                    {name:"cancel",show:false},
                    
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

                    {name:"sizes",show:false},
                    {name:"reload",show:false},
                    {name:"update",show:false},
                    {name:"new",show:false},
                    {name:"insert",show:false},
                    {name:"cancel",show:false},
                    
                    {name:"pages",show:false},
                ],
            },
        ],
    }

    SetState({stateName}){

        this.#stateData.state = stateName;
        //set tools
        var StateToolsData = this.#stateData.stateTools.find(stT=>stT.name == stateName);
        if(this.#ctr_log.state)console.log(this.#title, " -> state: " + stateName, "stateToolsData:",StateToolsData);

        this.#body_tools.forEach(tool => {
            
            var stateToolData = StateToolsData.tools.find(stTool => stTool.name == tool.name);

            //if(tool.name=="pages")console.log(this.#title," state: ",stateName," tool: ",tool, "statetooldata: ",stateToolData);

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
                
                this.Reload({});
            break;

            case "block":
                
                this.#Block({active:true});
            break;
        }

    }

    #SetBaseState(){

        this.SetState({stateName:this.#stateData.stateBase});
    }

    #State_SetTools({stateName,toolsSet=[]}){

        var stateToolsData = this.#stateData.stateTools.find(st=>st.name==stateName);

        toolsSet.forEach(toolSet => {
            
            var toolData = stateToolsData.tools.find(toolData=>toolData.name==toolSet.name);
            
            toolData.show = toolSet.show;
            toolData.value = toolSet.value;

            //if(toolData.name=="pages")console.log(stateName,toolData,toolSet);
        });


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

        this.#SetBaseState();
        this.CallEvent({name:"toolCancelUpdate"});
    }

    #Event_UpdateToolUpdate({}){

        this.#Update({});
    }
    
    #Event_UpdateToolPages({}){

        this.Reload({});
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
        //console.log("event box update",u);
        

        if(u.field.action == "delete"){

            var panel = this.#conteiner_panels.find(p=>p.title == u.field.panel);
            if(panel.tipe == "table"){

                var primaryField = this.#selectPrimary["field"];
                var line = this.#reloadData[u.y];
                var primaryValue = line[primaryField];

                k.Delete({primaryValue});

                /*this.#conection.Request({
                    php:"success",name:"delete-request",
                    sql:k.#conection.GetSql_Delete({
                        tableMain:k.#tableMain,
                        conditions:[
                            {
                                field:k.#selectPrimary.field,
                                inter:"=",
                                value:primaryValue,
                            }
                        ],
                    }),
                    success:()=>{
                        
                        k.#SetBaseState({});
                    }
                })*/
            }
        }

        this.CallEvent({name:"boxUpdate",params:{...u}});

        //----update change-----

        var panel = this.#conteiner_panels.find(p=>p.title==u.field.panel);
        var panelIsTable = panel.tipe=="table";
        var y = panelIsTable ? u.y : 0;
        var value = this.GetValues({fieldName:u.field.name})[y];
        var primary = u.primaryValues[y];

        if(this.#stateData.state!="new"){

            //console.log(this.#stateData.state,"boxupdate -> add update, field:",u.field.name,",value:",value,",primary:",primary);

            if(u.field.box.tipe !=0 && u.field.box.tipe !=5){

                this.Update_AddChange({
                    fieldName:u.field.name,
                    value,primary,
                }); 
            }              
        }    
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
            var panel = this.#conteiner_panels.find(p=>p.title==field.panel);
            var panelIsTable = panel.tipe=="table";
            if(panelIsTable) this.#Update({});
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

        var tool = this.#body_tools.find(t=>t.name==toolName);
        //if(toolName=="pages") console.log("toolName:",toolName,"tool:",tool,"show:",show,"value:",value);

        if(value!=null) tool.dom.SetValue(value);

        if(show==false) tool.dom.Hide();
        else tool.dom.Show();
    }

    Tools_GetBox({toolName}){

        var tool = this.#body_tools.find(t=>t.name==toolName);
        return tool.dom;
    }

    GetBoxs({fieldName}){

        var field = this.#fields.find(f=>f.name == fieldName);
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

        var values = this.GetBoxs({fieldName}).map(bx=>{

            return bx.GetValue();
        });

        return values;
    }

    GetValue({fieldName,y}){

        var values = this.GetValues({fieldName});
        if(values==null) console.log("values is null, fieldName: " + fieldName);

        return values[y];
    }

    SetValuesToBox({values=[],fieldName}){

        var field = this.#fields.find(f=>f.name == fieldName);
        var panel = this.#conteiner_panels.find(p=>p.title==field.panel);

        switch (panel.tipe) {

            case "table":
                
                //console.log(fieldName,values);
                panel.build.Fields_SetValues({values,fieldName});
                
            break;
        
            case "form":

                var boxs = this.GetBoxs({fieldName});
                boxs[0].SetValue(values[0]);

            break;
        }

    }

    

}