
class Crud extends ODD {
nt
    /* 
        body: [form body]
        ->states
        ->
    */

    constructor(i){

        //----------------filter Info------------

        //filter set title
        if(i.title==null)i.title='CRUD';

        //filter adding logControl
        const logControlStart = [
            {
                name:'sql',
                log:true,
            },
        ];
        if(i.logControl == null) i.logControl = [...logControlStart];
        else i.logControl = [...i.logControl, ...logControlStart];

        //filter loads
        if(i.loads!=null){

            for (let ld = 0; ld < i.loads.length; ld++) {
                var ldi = i.loads[ld];
                var setLoad = ldi!=null && (Number.isInteger(ldi)== true || Number.isInteger(ldi.tableIndex) == true);
                if(setLoad){
    
                    var tableIndex = (Number.isInteger(ldi)== true) ? ldi : ldi.tableIndex;
    
                    i.loads[ld] = {
                        table_main:tableIndex,
                        selects:[
                            {table:tableIndex,field:0,as:'value'},
                            {table:tableIndex,field:1,as:'show'},
                        ],
                        ...ld,
                    }
                }//console.log(setLoad,ldi);
            }
        }

        //filter fields
        if(i.fields==null)i.fields=[];
        i.fields.forEach(fi => {
            
            if(fi.sql!=null&&Number.isInteger(fi.sql)==true) fi.sql = {field:fi.sql,table:0};
            if(fi.sql!=null&&fi.sql.table==null) fi.sql.table = 0;

            if(fi.load!=null&&Number.isInteger(fi.load)==true)fi.load={index:0,fieldName:'show'};

            if(fi['delete']==true){

                fi['box'] = {
                    default:'x',
                    tipe:5,
                    class:'btn btn-outline-danger btn-sm',
                }
                //fi['name']='';
            }

            if(fi['edit']==true){

                fi['box'] = {
                    default:'[/]',
                    tipe:5,
                    class:'btn btn-outline-primary btn-sm',
                }
                fi['name']='edit';
            }

            if(fi['new']==true){

                fi['box'] = {
                    default:'[+]',
                    tipe:5,
                    class:'btn btn-outline-primary btn-sm',
                }
                //fi['name']='';
            }

            if(fi.box!=null&&Number.isInteger(fi.box)==true) fi.box={tipe:fi.box};
            if(fi.box==null) fi.box={tipe:0};

            if((fi.box.tipe==1 || fi.box.tipe==8) && fi.box.class==null) fi.box.class = 'w-100 m-0';
            
            if(fi.box.tipe == 6 && fi.box.name == null){
                fi.tipe=0;
                fi.box.name = fi.name;
            }

            if(fi.box.tipe==5) fi.tipe=0;

            if(fi.box.tipe==3) fi.tipe=2;

            if(fi.box.tipe==2&&fi.box.default==null) fi.box.default = Date_Today(0);
        });

        //filter filters
        var bodyFilters = {
            cols:[],
            labels:[],
        };
        if(i.filters==null)i.filters=[];
        var filtersY = 0;
        i.filters.forEach(f => {
            
            bodyFilters.cols.push([12]);

            if(f.sql!=null&&Number.isInteger(f.sql) == true) f.sql = {table:0,field:f.sql};
            if(f.sql!=null&&f.sql.table==null)f.sql.table=0;
            
            if(f.box==null) f.box={tipe:1};
            if(f.box.class==null)f.box.class='w-100';
            if(f.box.tipe==4&&f.box.options==null)f.box.options=[{value:0,show:('no '+f.name)},{value:1,show:f.name}]; 

            f.x=0;
            f.y=filtersY;

            var label = {
                x:f.x,y:f.y,
                name: f.name,
                box: f.box,
            };

            filtersY++;
            bodyFilters.labels.push(label);
        });

        //filter to add events
        const eventsNew = [
            {
                name:'newed',
                actions:[
                    {
                        name:'base newed',
                        action:()=>{

                            k.New_Action({});
                        }
                    }
                ],
            }
        ];
        if(i.events==null) i.events=eventsNew;
        else i.events=[...i.events,...eventsNew];

        //construc ODD
        super({...i,name:i.title});

        let k = this;
        this.#Start_SetParams({...i});
        this._Start_BuildComponents({...i,bodyFilters:bodyFilters});    
        this.Loads_LoadAll({
            success:()=>{k.#SetStart({})}
        });
    }

    _tipe = "base";
    #Start_SetParams({tables=[],fields=[],filters=[],loads=[],joins=[],states=[],triggers=[],stateDefault='reload',stateStart='reload'}){

        //set values
        this._tables = tables;
        this._loads = loads;
        this._joins = joins;
        this._fields = fields;
        this._filters = filters;
        this._stateDefault = stateDefault;
        this._stateStart = stateStart;
        this._triggers = triggers;

        //set statedata
        states.forEach(st => {
                
            this.States_SetData({...st});
        });

    }
    
    _Start_BuildComponents({parent,title="crud",modal,bodyFilters}){

        let k = this;

        //build modal
        if(modal==true){

            this.#Modal_Build({}); 
            parent = this._modal.GetContent();
        }

        //build sql that will use to do request to db
        this._sql = new Sql({name:(title+' [sql]'),logControl:[{name:'general',log:this.GetLogActive({logName:'sql'})}]});

        //build mysql that will to get sql by schema
        this._mysql = new Mysql({name:(title+' [mysql]'),logControl:[{name:'general',log:this.GetLogActive({logName:'mysql'})}]});
        this._mysql.AddTables({tables:this._tables});
        this._fieldPrimaryInfo = this._mysql.GetFieldPrimaryInfo({table:0});

        //build form body
        this.#Body_Build({title,parent,bodyFilters});
    }

    //--------------body---------
    _body = null;
    #Body_Build({title,parent,bodyFilters}){

        let k = this;
        this._body = new Form_Body({
            title:title,
            name:title+'_body',
            parent:parent,
            logControl:[{name:'general',log:this.GetLogActive({logName:'body'})}],
            filters:bodyFilters,
            //this is when push button in the form body
            actions:[
                {
                    name:'reload',
                    action:()=>{

                        k.Reload_Action({});
                    },
                },
                {
                    name:'new',
                    action:()=>{

                        if(k._fieldsUpdate.length>0 && !confirm("se ha realizado cambios sin guardar, ¿segura que quiere continua?")){

                            return;
                        }

                        k.CallEvent({name:'newed'});
                    },
                },
                {
                    name:'cancel',
                    action:()=>{

                        k.CallEvent({name:'canceled'});
                        k.SetDefault({});
                    },
                },
                {
                    name:'add',
                    action:()=>{

                        k.Action_Insert({success:()=>{

                            //clear filters
                            //set last page
                            //reload
                        }});
                    }
                },
                {
                    name:'sizes',
                    action:()=>{
                        k.Reload_Action({});
                    }
                },
                {
                    name:'pages',
                    action:()=>{
                        k.Reload_Action({});
                    }
                },
                {
                    name:'page_next',
                    action:()=>{

                        k._body.Pages_Next({add:1});
                        k.Reload_Action({});
                    }
                },
                {
                    name:'page_back',
                    action:()=>{
                        
                        k._body.Pages_Next({add:-1});
                        k.Reload_Action({});
                    }
                },
                {
                    name:'save',
                    action:()=>{
                        k._Action_Update({y:0});
                    }
                },
                {
                    name:'delete',
                    action:()=>{
                        k._Action_Delete({y:0});
                    }
                },
                {
                    name:'load',
                    action:()=>{
                        
                        k.Loads_LoadAll({});
                    }
                }
            ],
        });
    }

    //---------------modal---------

    _modal = null;
    #Modal_Build({}){

        this._modal = new Modal({name:title});
    }
    
    Modal_SetActive({active=true}){
        //console.log(this._name,'modal_setactive active:'+active);
        if(this._modal!=null)this._modal.SetActive({active:active});
    }

    //-----------------sql----------------------

    _tables = [];
    _joins = [];
    _sql = null;
    _mysql = null;
    _fieldPrimaryInfo=null;
    _filters = [];

    #Sql_Request({action=null,config=null,success,useScreen=true}){

        let k = this;
        if(useScreen) this.#Action_Print_ScreenLoad({show:true});
        this._sql.LoadByMysql({
            action:action,
            mysql:this._mysql,
            config:config,
            logSql:true,
            fail:(f)=>{

                k.#Action_Print_ScreenLoad({show:false});
                k.#Sql_Fail(f)
            },
            success:(resp)=>{

                k.#Action_Print_ScreenLoad({show:false});
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

    Fields_GetAllInfo({}){

        return this._fields;
    }
    
    
    //-------------loads-------------

    _loads = [];
    _loadsData = [];
    _loadsCount = 0;
    _loadsLoaded = false;
 
    Loads_LoadAll({success}){

        this._loadsData=[];
        this._loadsCount=0;
        this._loadsLoaded=false;
        this.#Action_Print_ScreenLoad({show:true});

        if(this._loads.length<=0) this.#Loads_Loaded({success:success});
        else
        {

            for (let ld = 0; ld < this._loads.length; ld++) {
            
                this.#Loads_OneLoad({loadIndex:ld,success:success,useScreen:false});            
            }
        }
        
    }

    #Loads_OneLoad({loadIndex=0,success,useScreen}){

        let k = this;
        var load = this._loads[loadIndex];
        this.#Sql_Request({
            useScreen:useScreen,
            action:'select',
            config:{...load},
            success:(data)=>{

                k._loadsData.push({
                    data:data,
                    index:loadIndex,
                });

                k.#Loads_OneLoaded({loadIndex:loadIndex,data:data,success:success});
            }
        })
    }

    #Loads_OneLoaded({loadIndex,data,success}){

        let k = this;

        var loadIndex = this._loadsData.findIndex(ld=>ld.index==loadIndex);
        if(loadIndex==-1){
            
            this._loadsData.push({
                index:loadIndex,
                data:data,
            });
        }else this._loadsData[loadIndex].data = data;

        //get options by load
        var options = k.#Loads_GetOptionsByData({data:data});

        //set loadoptions to fields
        var fieldIndex = k._fields.findIndex(f=>f.load!=null&&f.load.index==loadIndex);
        if(fieldIndex != -1){

            var field = k._fields[fieldIndex];
            field.loadOptions = options;
            this._Action_Print_SetLoadOptionToBoxes({fieldIndex:fieldIndex});
        }

        //set loadoptions to filter
        var filter = k._filters.find(f=>f.load !=null&&f.load.index==loadIndex);
        if(filter != null){

            filter.loadOptions = options;
            var box = k._body.Filter_GetCol_Data({...filter}).labels[0].GetBox();
            box.SetOptions(options);
            //console.log(filter,box,options);
        }

        this._loadsCount++;
        if(this._loadsCount>=this._loads.length){

            this.#Loads_Loaded({success});
        }
    }

    #Loads_Loaded({success}){

        this._loadsLoaded=true;
        this.#Action_Print_ScreenLoad({show:false});
        if(success!=null)success();
    }

    #Loads_GetOptionsByData({data}){

        var options = [];
        data.forEach(line => {
            
            options.push({
                value: line['value'],
                show: line['show'],
            });
        });

        return options;
    }

    //--------------states-------------

    _statesData = [
        {name:'reload',tools:[
          {name:'filter',show:true},
          {name:'load',show:true},
          {name:'sizes',show:true},
          {name:'reload',show:true},
          {name:'save',show:true},
          {name:'new',show:true},
          {name:'delete',show:true},
          {name:'add',show:false},
          {name:'cancel',show:false},
          {name:'page_back',show:true},
          {name:'pages',show:true},
          {name:'page_next',show:true},
        ]},
        {name:'new',tools:[
          {name:'filter',show:false},
          {name:'load',show:true},
          {name:'sizes',show:false},
          {name:'reload',show:false},
          {name:'save',show:false},
          {name:'new',show:false},
          {name:'delete',show:false},
          {name:'add',show:true},
          {name:'cancel',show:true},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
        ]},
        {name:'block',tools:[
          {name:'filter',show:false},
          {name:'load',show:false},
          {name:'sizes',show:false},
          {name:'reload',show:false},
          {name:'save',show:false},
          {name:'new',show:false},
          {name:'delete',show:false},
          {name:'add',show:false},
          {name:'cancel',show:false},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
        ]},
    ];

    #States_SetTools({stateName=null}){

        //found data of state
        const stdt = this._statesData.find(d=>d.name == stateName);

        //confirm if datastate exist
        if(stdt == null){

            this.LogAction({
                type:'error',
                msg:'no found stdt with name ' + state
            });
            return;
        }
        //work with the tools of state
        this._body.SetConfigTools({tools:stdt.tools});

    }

    States_SetData({name=null,tools=[]}){

        //found data of name
        var stateIndex = this._statesData.findIndex(d=>d.name==name);
        if(stateIndex!=-1){

            var stateData = this._statesData[stateIndex];
            tools.forEach(t => {
                
                var toolIndex = stateData.tools.findIndex(st_t=>st_t.name==t.name);
                if(toolIndex!=-1){

                    stateData.tools[toolIndex]=t;
                }
                else
                {
                    this.LogAction({type:'error',msg:[
                        'no found tool in state',
                        stateData,t
                    ]});
                }
            });

        }else this.LogAction({type:'error',msg:('no found state named '+state)});
    }

    //------------data------------

    _data = [];
    #Data_SetData({data=[]}){

        this._data = data;
    }

    #Data_GetFieldSql({y=0,fieldSqlIndex=0}){

        var fieldInfo = this._mysql.GetFieldInfo({field:fieldSqlIndex});
        var line = this._data[y];
        return line[fieldInfo['Field']];
    }

    Data_GetValue({fieldSqlName,y}){

        return this._data[y][fieldSqlName];
    }

    //---------reload------------

    Reload_Action({lastPage=false}){

        let k = this;
        
        this.#States_SetTools({stateName:'reload'});
        
        var selects = [];
        //selects by fields
        for (let f = 0; f < this._fields.length; f++) {
            const fi = this._fields[f];
            if(fi.sql!=null) selects.push({...fi.sql});
        };

        //push field primary if no exist
        var fieldPrimaryInfo = this._mysql.GetFieldPrimaryInfo({table:0});
        var fieldPrimaryIndex = fieldPrimaryInfo['Index'];
        selects.push({
            table:0,
            field:fieldPrimaryIndex,
            as:'primary',
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
                    inter:'=',
                    value:cn.value,
                });
            });

            conditions.push(conectionsCondition);
        };

        //get conditions by filters
        if(this._filters.length>0){        

            for (let f = 0; f < k._filters.length; f++) {
                const filter = k._filters[f];
                var sql = filter.sql;
                if(sql!=null){
    
                    var box = k._body.Filter_GetCol_Data({...filter}).labels[0].GetBox();
                    var value = box.GetValue();
                    
                    //console.log(value,box.GetTipe(),filter);

                    switch (box.GetTipe()) {
                        case 1:

                            conditions.push({
                                and:true,
                                conditions:[
                                    {
                                        table:sql.table,
                                        field:sql.field,
                                        inter:'LIKE',
                                        value:value,
                                        and:false,
                                    },
                                    {
                                        table:sql.table,
                                        field:sql.field,
                                        inter:'IS',
                                        value:'NULL',
                                    }
                                ],
                            });
                            
                            break;
                    
                        case 4:

                            var optionsConditions = {
                                and:true,
                                conditions:[],
                            };
                            value.forEach(v => {
                               
                                optionsConditions.conditions.push({
                                    table:sql.table,
                                    field:sql.field,
                                    inter:'=',
                                    value:v,
                                    and:false,
                                });
                            });
                            conditions.push(optionsConditions);

                            break;

                        default:

                            conditions.push({
                                and:true,
                                conditions:[
                                    {
                                        table:sql.table,
                                        field:sql.field,
                                        inter:(sql.inter?sql.inter:"="),
                                        value:value,
                                        and:false,
                                    },
                                ],
                            });

                            break;
                    }
                    
                }               
            }

        }

        var joins = [...this._joins];
        
        //console.log(this._mysql.Where_Sql({conditions:conditions}));

        //calculate size of all data and set pages
        k.#Reload_SetPages({
            conditions:conditions,
            joins:joins,
            success:()=>{  

                //calculate limit
                var page = parseInt(this._body.Modulo_GetTool({name:'pages'}).GetValue());
                var size = parseInt(this._body.Modulo_GetTool({name:'sizes'}).GetValue()); 
                var limit = [(page-1)*size,size];

                //request sql data of reload
                k.#Sql_Request({
                    action:'select',
                    config:{
                        table_main:0,
                        selects:selects,
                        conditions:conditions,
                        joins:joins,
                        limit:limit,
                    },
                    success:(data)=>{
                        
                        //print the resp
                        k._Action_Print({data:data});
                        k.CallEvent({name:'reloaded',params:{data:data}});
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
            action:'select',
            config:{
                selects:[
                    {
                        table:0,
                        field:this._fieldPrimaryInfo['Index'],
                        as:'size',
                        action:'count'
                    },
                ],
                table_main:0,
                conditions:conditions,
                joins:joins,
            },
            success:(data)=>{

                //calculate number of pages
                var sizeTotal = parseInt(data[0]['size']);
                var pagesBox = k._body.Modulo_GetTool({name:'pages'});
                var size = parseInt(k._body.Modulo_GetTool({name:'sizes'}).GetValue());
                var PagesTotal = Math.ceil(sizeTotal/size);
                if(PagesTotal<=0) PagesTotal = 1;

                //set pages to tool
                var pagesOptions = [];
                for (let pg = 1; pg <= PagesTotal; pg++) {
                    
                    pagesOptions.push({
                        value:pg,
                        show:'pag ' + pg,
                    });
                }

                k.LogAction({msg:{
                    msg:'calculate and set pages',
                    sizeTotal: sizeTotal,
                    size:size,
                    PagesTotal:PagesTotal,
                    pagesOptions:pagesOptions,
                },logName:'eventSql'});
                
                var lastPage = pagesBox.GetValue(); 
                //console.log("last page",lastPage,"pages",PagesTotal);
                if(lastPage > PagesTotal) lastPage = PagesTotal;

                pagesBox.SetOptions(pagesOptions);
                pagesBox.SetValue(lastPage);
                

                if(success!=null)success({});
            }
        });
    }

    //--------------print-----------
    
    _Action_Print({data=[]}){

        this.#Data_SetData({data:data});

        let k = this;

        for (let f = 0; f < this._fields.length; f++) {
            const field = this._fields[f];

            //set load options
            this._Action_Print_SetLoadOptionToBoxes({fieldIndex:f});

            var boxes = this._Action_Print_GetBoxes({fieldIndex:f});
            for (let y = 0; y < boxes.length; y++) {
                
                const box = boxes[y];

                //set update
                if(field.box.tipe != 0){
   
                    box.SetUpdate((value)=>{

                        k._Print_BoxUpdate({value:value,fieldIndex:f,y:y});
                    });
                }

                //print data
                if(y < data.length){

                    const line = data[y];               
                    if(field.sql!=null){
    
                        var fieldSqlInfo = this._mysql.GetFieldInfo({...field.sql});
                        var value = line[fieldSqlInfo['Field']];
                        if(box) box.SetValue(value);
                    }
                }

            }

        }

        this._fieldsUpdate=[];
    }

    _Action_Print_SetLoadOptionToBoxes({fieldIndex,field,loadOptions=null}){

        var field = this._fields[fieldIndex];
        var loadOptions = field.loadOptions;

        if(loadOptions!=null){

            var boxes = this._Action_Print_GetBoxes({fieldIndex:fieldIndex});
            boxes.forEach(box => {
                
                box.SetOptions(loadOptions);
            });
        }

    }

    _Action_Print_GetBox({fieldName,fieldIndex=null,y}){

        var boxes = this._Action_Print_GetBoxes({fieldIndex:fieldIndex,fieldName:fieldName});

        if(boxes==null)return null;
        if(y>=boxes.length)return null;

        return boxes[y];
    }

    Print_GetValue({fieldName,fieldIndex=null,y}){

        var box = this._Action_Print_GetBox({fieldName,fieldIndex,y});
        return box.GetValue();
    }

    Print_SetValue({fieldName,fieldIndex,value,y=null}){

        if(y==null){

            var boxes = this._Action_Print_GetBoxes({fieldName,fieldIndex});
            boxes.forEach(box => {
                
                box.SetValue(value);
            });
        }else
        {
            var box = this._Action_Print_GetBox({fieldName,fieldIndex,y});
            box.SetValue(value);
        }
        
    }

    _Action_Print_GetBoxes({fieldIndex,fieldName}){

        return [];
    }

    _fieldsUpdate = [
        //{fieldIndex:0,y:0,value:1},
    ];

    _Print_BoxUpdate({fieldIndex,y,value}){

        this._fieldsUpdate.push({
            fieldIndex:fieldIndex,
            y:y,
            value:value,
        });
    
        //----events----
        this.CallEvent({name:'boxUpdate',params:{y:y,fieldIndex:fieldIndex,field:this._fields[fieldIndex],value:value}});
     
    }

    #Action_Print_ScreenLoad({show=true}){

        if(this._body!=null){
            
            this._body.LoadScreen_SetState({show:show});
        }
    }

    //--------------trigger-----------------

    _triggers = [
        /*{
          trigger:{fieldName:'cliente',toolName:'add'},
          actions:[
            {
                name:'action',
                params:[
                    {name:'param1',value:10},
                    {name:'param2',trigger:true},
                    {name:'param4',build:null},
                ],
            },
          ],
        },*/
    ];

    #Trigger_AddOne(triggerData){

        triggerData.load = {
            total:triggerData.actions.length,
            count:0,
            loading:false,
        }
        this._triggers.push(triggerData);
    }

    #Trigger_BoxUpdate({}){

        
    }

    #Trigger_CallOne({params=[],triggerData,success}){

        triggerData.load.loading=true;
        triggerData.load.count=0;

        let k = this;
        triggerData.actions.forEach(action => {
            
            var triggerParams = [...params,...action.params];
            
            k.Trigger_Action({
                actionName:action.name,
                params:triggerParams,
                success:()=>{

                    triggerData.load.count++;
                    if(triggerData.load.count>=triggerData.load.total){

                        triggerData.load.count=0;
                        triggerData.load.loading=false;
                        if(success!=null)success();
                    }
                }
            });
        });
    }

    _triggerActionsData=[
        {
            name:'printLoadData',
            params:['loadIndex','printField'],
        },
        {
            name:'modal',
            params:['build','active'],
        },
        {
            name:'setConection',
            params:['name','field','value'],
        },
        {
            name:'reload',
            params:[],
        },

    ];

    Trigger_Action({actionName,params,success}){

        function GetValue(paramName) {
            
            var dlf = null;
            switch (paramName) {
                case 'build':
                    df=this;
                    break;
            }

            var param = params.find(pr=>pr[0]==paramName);
            return param?param[1]:dlf;
        }

        switch (actionName) {

            case 'printLoadData':

                var data = this._loadsData[GetValue('loadIndex')].data;
                var foundInData = data.find(d=>d.value==GetValue('searchValue'));
                var printValue = foundInData[GetValue('printField')];

                var boxs = this._Action_Print_GetBoxes({fieldName:GetValue('printField')});
                boxs.forEach(bx => {

                    bx.SetValue(printValue);
                });

            break;

            case 'modal':
                GetValue('build').Modal_SetActive({active:GetValue('active')});
            break;

            case 'conection':

                var ParentValue = triggerBuild.Print_GetValue({fieldName:params.valueFieldName,y:triggerParams.y});
                this.Conection_SetConection({
                    name:params.name,
                    fieldSqlIndex:params.fieldSqlIndex,
                    value:ParentValue,
                });
            break;

            case 'reload':
                this.Reload_Action({});
            break;

            case 'new':
                this.New_Action({});
            break;

            case 'load':
                this.#Loads_OneLoad({
                    loadIndex:params.loadIndex,
                    useScreen:true,
                });
            break;

            case 'setFieldValue':

            var valueFrom = triggerParams.params.newPrimary;
            console.log(triggerParams, valueFrom);
            var boxesTo = this._Action_Print_GetBoxes({fieldName:params.fieldName});
            boxesTo.forEach(bx => {
                
                bx.SetValue(valueFrom);
            });

            break;
        }

        if(actionName!='load'){

           if(success!=null) success();
        }
    }
    
    //--------------clear---------------

    Clear_Action({}){

        this._fieldsUpdate = [];
        this.#Clear_Fields({});
        this.CallEvent({name:'cleared'});
    }

    #Clear_Fields({}){

        for (let f = 0; f < this._fields.length; f++) {
            const field = this._fields[f];
            
            var boxes = this._Action_Print_GetBoxes({fieldIndex:f});
            if(boxes!=null){

                boxes.forEach(bx => {
                    
                    if(bx.GetTipe()!=5)bx.SetDefault({});
                });
            }
        }
    }

    //--------------block------------

    Block_Action({}){

        this.Clear_Action({});
        this.#States_SetTools({stateName:"block"});
    }


    //---------------new------------

    New_Action({}){

        this._fieldsUpdate = [];
        this.Clear_Action({});
        this.#States_SetTools({stateName:"new"});
    }

    //--------------insert---------------

    Action_Insert({inserts=[],addConections=true,addFields=true}){

        let k = this;
        //push by conections
        if(addConections){

            inserts = this.#Action_Insert_PushToInserts({
                base:inserts,
                add:this.#Insert_GetInsertsByConections({}),
            });
        }

        //push to insert by fields
       if(addFields){

        var insertsByFields = [];
        for (let f = 0; f < this._fields.length; f++) {

            const field = this._fields[f];
            var boxes = this._Action_Print_GetBoxes({fieldIndex:f});
            if(field.sql!=null && boxes!=null){

                boxes.forEach(bx => {
                    
                    insertsByFields.push({
                        field:field.sql.field,
                        value:bx.GetValue(),
                    });
                });
            }
        }
        inserts = this.#Action_Insert_PushToInserts({base:inserts,add:insertsByFields});
       }

        //calculate new id
        this.#Sql_Request({
            action:'select',
            config:{
                selects:[
                    {
                        table:0,
                        field:this._fieldPrimaryInfo['Index'],
                        as:'max',
                        action:'max'
                    },
                ],
                table_main:0,
            },
            success:(data)=>{

                var max = data[0]['max'];
                if(max==null) max=0;
                var newPrimary = parseInt(max)+1;

                //push to insert newprimary
                  
                //delete all inserts that have primaryfieldindex
                for (var i = inserts.length - 1; i >= 0; --i) {
                    if (inserts[i].field == k._fieldPrimaryInfo['Index']){
                        inserts.splice(i,1);
                    }
                }
                //insert primaryfield value -> new primary
                inserts=k.#Action_Insert_PushToInserts({
                    base:inserts,
                    add:[{
                        field:k._fieldPrimaryInfo['Index'],
                        value:newPrimary,
                    }]
                });

                k.#Sql_Request({
                    action:'insert',
                    config:{
                        table_main:0,
                        inserts:inserts,
                    },
                    success:()=>{

                        k.CallEvent({name:'inserted',params:{newPrimary:newPrimary,fieldIndexPrimary:k._fieldPrimaryInfo['Index']}});
                        k.SetDefault({primaryValue:newPrimary});
                    }
                });

            }
        });
    }

    #Action_Insert_PushToInserts({base=[],add=[]}){

        var result = [...base];

        add.forEach(a => {
            
            var found = base.find(b=>b.field == a.field);
            if(found==null) result.push(a);
        });

        return result;
    }

    #Insert_GetInsertsByConections({}){

        return this._conections.map(cn=>{

            return {
                field:cn.fieldSqlIndex,
                value:cn.value,
            }
        });

    }

    //--------------update-----------------

    _Action_Update({y=0,success}){

        let k = this;
        var sets = [];

        //push set by fieldsUpdate
        this._fieldsUpdate.forEach(f => {
           
            var field = k._fields[f.fieldIndex];    
            if(field.sql!=null){

                var value = k._Action_Print_GetBox({fieldIndex:f.fieldIndex,y:f.y}).GetValue();
                sets.push({
                    field:field.sql.field,
                    value:value,
                });
            }
        });

        //remove set if fieldSql is primary
        var fieldPrimaryIndex = this._fieldPrimaryInfo['Index'];
        for (var i = sets.length - 1; i >= 0; --i) {
            if (sets[i].field == fieldPrimaryIndex){
                sets.splice(i,1);
            }
        }
        
        var conditions = [];
        //condition by primary
        var fieldPrimaryValue = this.#Data_GetFieldSql({fieldSqlIndex:this._fieldPrimaryInfo['Index'],y:y});
        conditions.push({
            and:true,
            conditions:[{
                table:0,
                field:this._fieldPrimaryInfo['Index'],
                inter:'=',
                value:fieldPrimaryValue,
            }],
        });

        if(sets.length<=0){ 

            k.#Update_Success({success});
            this.LogAction({msg:['error sets to update is empty',sets,conditions]});
            return;
        }

        this.#Sql_Request({
            action:'update',
            config:{
                table_main:0,
                sets:sets,
                conditions:conditions,
            },
            success:()=>{

                k.#Update_Success({success,sets,conditions});
            }
        });
    }

    #Update_Success({success,sets,conditions}){

        this._fieldsUpdate = [];
        this.CallEvent({name:'updated',params:{sets:sets,conditions:conditions}});
        if(success!=null)success({conditions:conditions,sets:sets});
    }

    //----------------delete-------------

    //request in sql to delete data by fields of body
    
    _Action_Delete({y=0,success}){

        var conditions=[];

        //condition by primary
        var primaryFieldIndex = this._fieldPrimaryInfo['Index'];
        var primaryValue = this.#Data_GetFieldSql({fieldSqlIndex:primaryFieldIndex,y:y});
        conditions.push({
            and:true,
            conditions:[{
                table:0,
                field:primaryFieldIndex,
                inter:'=',
                value:primaryValue,
            }],
        });
        
        let k = this;
        this.#Sql_Request({
            action:'delete',
            config:{
                table_main:0,
                conditions:conditions,
            },
            success:()=>{

                k.SetDefault({});
                if(success!=null) success();
            },
        })

    }

    //----------------conections-----------

    _conections = [
        /*{
            name:'',
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

    Conection_GetValue({y=0,fieldSqlIndex=0}){
        
        var fieldIndex = this._fields.findIndex(f=>f.sql!=null&&f.sql.field==fieldSqlIndex);
        
        if(fieldIndex != -1){

            var box = this._Action_Print_GetBox({y:y,fieldIndex:fieldIndex});
            //console.log(box);
            return box.GetValue();

        }else{

            return this.#Data_GetFieldSql({y:y,fieldSqlIndex:fieldSqlIndex});
        }
    }

    //-----------------Public Functions--------

    //[reload,new]
    _stateDefault = 'reload';
    _stateStart = 'reload';

    SetDefault(params){

        this.#SetState({state:this._stateDefault,params:params});         
    }

    #SetStart(){

        this.#SetState({state:this._stateStart});   
    }

    #SetState({state='reload',params=null}){

        switch (state) {
            case 'reload':
                this.Reload_Action({...params});
                break;

            case 'new':
                this.New_Action({});
                break;
        
            default:
                break;
        }
    }    
    
}