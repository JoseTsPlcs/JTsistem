
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

        //filter adding events
        /*const eventsStart = [
            {
                name:'reload',
                actions:[
                    {
                        name:'tools reload',
                        action:({k})=>{

                            k.#SetToolsByState({state:'reload'});//set tools of reload
                        }
                    },
                    {   
                        name:'load data',
                        action:({k})=>{

                            
                            k.#Action_Reload({});
                        }
                    }
                ],
            },
            {
                name:'print',
                actions:[
                    {
                        name:'print by data',
                        action:({k,data})=>{

                            k.#Action_Print({data:data});
                        }
                    }
                ],
            },
            {
                name:'new',
                actions:[
                    {   
                        name:'state new',
                        description:'set state to create new item',
                        action:({k})=>{

                            k.#SetToolsByState({state:'new'});
                        }
                    }
                ],
            },
            {
                name:'cancel',
                actions:[
                    {   
                        description:'cancel event and reload',
                        action:({k})=>{

                            k.CallEvent({name:'stateDefault'});
                        }
                    }
                ],
            },
            {
                name:'add',
                actions:[
                    {
                        name:'request sql insert',
                        description:' ',
                        action:({k,inserts})=>{

                            k.EventInsert({inserts:inserts});
                        }
                    }
                ],
            },
            {
                name:'insertsByFields',
                actions:[
                    {
                        name:'inserts by print',
                        action:({k})=>{

                            var inserts = [];
                            for (let f = 0; f < k._fields.length; f++) {

                                const fi = k._fields[f];
                                var fbox = fi.box;
                                var fsql = fi.sql;
                                if(fsql!=null&&fbox.tipe!=0&&fbox.tipe!=5){
                    
                                    //get value of field
                                    var value = k.CallEvent({name:'boxGetValue',params:{fieldIndex:f,y:0}});
                                    inserts.push({
                                        field:fsql.field,
                                        value:value,
                                    });
                                }
                            }

                            return inserts;
                        }
                    }
                ],
            },
            {
                name:'created',
                actions:[],
            },
            {
                name:'boxUpdate',//(w,x,y,updateValue,field)
                actions:[],
            },
            {
                name:'buildPrint',
                actions:[],
            },
            {
                name:'block',
                actions:[
                    {
                        description:'block the body',
                        action:({k})=>{

                            k.#SetToolsByState({state:'block'});
                        }
                    }
                ],
            },    
            {
                name:'update',
                actions:[],
            },
            {
                name:'delete',//(conditions)
                actions:[],
            },
            {
                name:'getBoxesOfField',//(fieldIndex),
                actions:[],
            },
            {
                name:'getBoxOfField',//(fieldIndex,y),
                actions:[
                    {
                        name:'default',
                        action:({k,fieldIndex,y})=>{

                            var boxes = k.CallEvent({name:'getBoxesOfField',params:{fieldIndex:fieldIndex}});
                            if(boxes!=null&&boxes.length>0){

                                if(y<boxes.length) return boxes[y];
                            }
                        }
                    }
                ],
            },
            {
                name:'boxGetValue',//(fieldIndex,y)
                actions:[],
            },
            {
                name:'boxSetValue',//(value,fieldIndex,y)
                actions:[],
            },
            {
                name:'stateDefault',
                actions:[],
            },
            {
                name:'fieldGet',//(w,x,y)
                actions:[]
            },
            {
                name:'reloaded',
                actions:[
                  {
                    name:'reload -> modal',
                    action:({k})=>{
  
                      if(modalBuild) modalBuild.SetActive({active:true});
                    }
                  }
                ],
            },
            {
                name:'block',
                actions:[
                  {
                    name:'block -> modal',
                    action:({k})=>{
  
                      if(modalBuild) modalBuild.SetActive({active:false});
                    }
                  }
                ],
            },
            {
                name:'new',
                actions:[
                  {
                    name:'reload -> modal',
                    action:({k})=>{
  
                      if(modalBuild) modalBuild.SetActive({active:true});
                    }
                  }
                ],
            },
            {
                name:'loadTables',
                actions:[
                    {
                        name:'load',
                        action:({k})=>{

                            k._loadsTables.Loads({loads:k._loads});
                        }
                    }
                ],
            },
            {
                name:'loadedTables',
                actions:[
                    {
                        name:'first load after stateDefault',
                        action:({k})=>{

                            k.CallEvent({name:'stateDefault',from:'after loadedtables'});
                        }
                    },
                ],
            },
            {
                name:'oneLoadedTable',
                actions:[
                    {
                        name:'one loaded of loadsTables',
                        action:(u)=>{
                            
                            k.#ActionLoadedOne({...u});
                        }
                    }
                ],
            },
            {
                name:'oneLoadTable',//(fieldSqlIndex)
                actions:[
                    {
                        name:'by fieldSql',
                        action:(u)=>{

                            k.#ActionLoadOne({...u});
                        }
                    }
                ],
            }
        ];
        if(i.events == null) i.events = [...eventsStart];
        else i.events = [...i.events, ...eventsStart];*/

        //filter fields
        if(i.fields==null)i.fields=[];
        i.fields.forEach(fi => {
            
            if(fi['delete']==true){

                fi['box'] = {
                    default:'x',
                    tipe:5,
                    class:'btn btn-outline-danger btn-sm',
                }
                fi['name']='';
            }

            if(fi['edit']==true){

                fi['box'] = {
                    default:'[/]',
                    tipe:5,
                    class:'btn btn-outline-primary btn-sm',
                }
                fi['name']='';
            }

            if(fi['new']==true){

                fi['box'] = {
                    default:'[+]',
                    tipe:5,
                    class:'btn btn-outline-primary btn-sm',
                }
                fi['name']='';
            }

            if(fi.box==null) fi.box={tipe:1};

            if(fi.box.tipe==1 && fi.box.class==null) fi.box.class = 'w-100 m-0';
            
        });

        //construc ODD
        super({...i,name:i.title});

        this.#Start_SetParams({...i});
        this.#Start_BuildComponents({...i});    
        this.#Actions_Loads();
        //this.CallEvent({name:'buildPrint',params:{...i}});
        //this.CallEvent({name:'loadTables'});
    }

    #Start_SetParams({tables=[],fields=[],loads=[],states=[]}){

        //set values
        this._tables = tables;
        this._loads = loads;
        this._fields = fields;

        //set statedata
        states.forEach(st => {
                
            this.SetDataState({...st});
        });

    }

    _body = null;
    #Start_BuildComponents({parent,title="crud",modal}){

        let k = this;

        //build modal
        var modalBuild = null;
        if(modal==true){

            modalBuild = new Modal({name:i.title});
            parent = modalBuild.GetContent();
        }

        //build sql that will use to do request to db
        this._sql = new Sql({name:(title+' [sql]'),logControl:[{name:'general',log:this.GetLogActive({logName:'sql'})}]});

        //build mysql that will to get sql by schema
        this._mysql = new Mysql({name:(title+' [mysql]'),logControl:[{name:'general',log:this.GetLogActive({logName:'mysql'})}]});
        this._mysql.AddTables({tables:this._tables});

        //build lodstables will use to load data
        this._loadsTables = new LoadTables({
            name:(title+' [loads]'),
            sql:this._sql,
            mysql:this._mysql,
            events:[
                {
                    name:'load',
                    actions:[
                        {
                            name:'call event of crud',
                            action:()=>{

                                k.CallEvent({name:'loadTables',from:'loads tables of loadtables'});
                            }
                        }
                    ]
                },
                {
                    name:'oneLoaded',
                    actions:[
                        {
                            name:'call event of crud',
                            action:(i)=>{

                                k.CallEvent({name:'oneLoadedTable',params:{...i},from:'load table of loadtables'});
                            }
                        }
                    ],
                },
                {
                    name:'loaded',
                    actions:[
                        {
                            name:'call event of crud',
                            action:()=>{

                                k.CallEvent({name:'loadedTables',from:'loads tables in crud'});
                            }
                        }
                    ]
                }
            ],
        });

        //build form body
        this._body = new Form_Body({
            name:title+'_body',
            parent:parent,
            logControl:[{name:'general',log:this.GetLogActive({logName:'body'})}],
            //this is when push button in the form body
            actions:[
                {
                    name:'reload',
                    action:()=>{
                        k.#Action_Reload({});
                    },
                },
                {
                    name:'new',
                    action:()=>{
                        
                        k.#SetToolsByState({state:'new'});
                    },
                },
                {
                    name:'cancel',
                    action:()=>{
                        k.CallEvent({name:'cancel'});
                    },
                },
                {
                    name:'add',
                    action:()=>{
                        k.CallEvent({name:'add'});
                    }
                },
                {
                    name:'sizes',
                    action:()=>{
                        k.CallEvent({name:'reload'});
                    }
                },
                {
                    name:'pages',
                    action:()=>{
                        k.CallEvent({name:'reload'});
                    }
                },
                {
                    name:'page_next',
                    action:()=>{
                        k.CallEvent({name:'reload'});
                        k._body.Pages_Next({add:1});
                    }
                },
                {
                    name:'page_back',
                    action:()=>{
                        k.CallEvent({name:'reload'});
                        k._body.Pages_Next({add:-1});
                    }
                },
                {
                    name:'save',
                    action:()=>{
                        k.CallEvent({name:'update'});
                    }
                },
                {
                    name:'delete',
                    action:()=>{
                        k.CallEvent({name:'delete'});
                    }
                },
                {
                    name:'load',
                    action:()=>{
                        k.CallEvent({name:'loadTables',from:'from button load in body'});
                    }
                }
            ],
        });
    }


    //-----------------sql----------------------

    _tables = [];
    _sql = null;
    _mysql = null;

    //----------------loads--------------------

    _loads = [];
    _loadsTables = null;

    #Actions_Loads(){

        let k = this;
        this._loadsTables.Loads({
            loads:this._loads,
            success:({loaded})=>{

                if(loaded) k.SetDefault();
            }
        });
    }

    //-----------------fields---------------

    _fields = [];
    GetFieldIndexByFieldSql({fieldSqlIndex=0}){

        var fieldIndex = -1;

        for (let f = 0; f < this._fields.length; f++) {

            const field = this._fields[f];
            if(field.sql!=null&&field.sql.field==fieldSqlIndex){

                return f;
            }
        }

        return fieldIndex;
    }

    GetFieldPriSqlInfo({}){

        return this._mysql.GetFieldPrimaryInfo({table:0});
    }

    GetConditionPrimary({y=0}){

        var fieldPrimaryInfo = this._mysql.GetFieldPrimaryInfo({table:0});
        var line = this.#data[y];
        var primaryValue = line[fieldPrimaryInfo['Field']];
        
        return {
            inter:'=',
            table:0,
            field:fieldPrimaryInfo['Index'],
            value:primaryValue,
        };
    }

    GetConditionPrimaryByValue({value=null}){

        var fieldPrimaryInfo = this._mysql.GetFieldPrimaryInfo({table:0});

        return {
            inter:'=',
            table:0,
            field:fieldPrimaryInfo['Index'],
            value:value,
        };
    }

    GetValueField({fieldSqlIndex=0,y=0}){

        var value = null;


        var valueData = this.GetDataFieldSql({fieldSqlIndex:fieldSqlIndex,y:y});

        var valuePrint = null;
        for (let f = 0; f < this._fields.length; f++) {

            const fi = this._fields[f];
            if(fi.sql!=null && fi.sql.field == fieldSqlIndex){

                valuePrint = this.CallEvent({name:'boxGetValue',params:{fieldIndex:f,y:y}});
                break;
            }

        }    
        
        //console.log(valuePrint,valueData);
        return valuePrint ? valuePrint : valueData;
    }
    
    
    //-------------Actions-------------

    #ActionLoadOne({fieldSqlIndex}){

        var field = this._fields.find(f=>f.sql!=null&&f.sql.field==fieldSqlIndex);
        if(field!=null&&field.load!=null){

            var loadIndex=field.load;
            let k = this;
            this._loadsTables.Load({
                load:k._loads[loadIndex],
                loadIndex:loadIndex,
                success:()=>{

                    k.CallEvent({name:'loadedTables'});
                }
            });
        }
        
    }

    #ActionLoadedOne({loadIndex,data}){

        var fieldIndex = this._fields.findIndex(f=>f.load!=null && f.load==loadIndex);
        
        if(fieldIndex!=-1){

            var options = this.#ActionLoad_GetOptionsByData({data:data});
            this.CallEvent({name:'setOptionsToField',params:{fieldIndex:fieldIndex,options:options}});
        }
    }

    #ActionLoad_GetOptionsByData({data}){

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
          {name:'load',show:false},
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

    #SetToolsByState({state=null}){

        //found data of state
        const stdt = this._statesData.find(d=>d.name == state);

        //confirm if datastate exist
        if(stdt == null){

            this.LogAction({
                type:'error',
                msg:'no found stdt with name ' + state
            });
            return;
        }

        let k = this;
        //work with the tools of state
        this._body.SetConfigTools({tools:stdt.tools});

    }

    SetDataState({name=null,tools=[]}){

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

    #data = [];

    GetDataFieldSql({y=0,fieldSqlIndex=0}){

        const size = this.#data.length;
        if(size == 0) return null;
        else{

            if(y >= size){

                this.LogAction({
                    type:'error',
                    msg:'y >= data.lengt ('+(size-1)+')'
                });
                return null;
            }
        }

        var sqlFieldInfo = this._mysql.GetFieldInfo({table:0,field:fieldSqlIndex});
        var line = this.#data[y];
        return line[sqlFieldInfo['Field']];
    }

    GetDataPrimary({y=0}){

        var line = this.#data[y];
        var fieldInfo = this._mysql.GetFieldPrimaryInfo({table:0});
        return this.GetDataFieldSql({y:y,fieldSqlIndex:fieldInfo['Index']});
    }

    //---------reload------------

    #Action_Reload({}){

        let k = this; 
        
        var selects = [];
        //selects by fields
        for (let f = 0; f < this._fields.length; f++) {
            const fi = this._fields[f];
            if(fi.sql!=null) selects.push({...fi.sql});
        };

        //push field primary if no exist
        var fieldPrimaryInfo = this._mysql.GetFieldPrimaryInfo({table:0});
        var fieldPrimaryIndex = fieldPrimaryInfo['Index'];
        var fieldPrimaryFound = selects.find(f=>f.field == fieldPrimaryIndex);
        if(fieldPrimaryFound==null){

            selects.push({
                table:0,
                field:fieldPrimaryIndex,
                //as:'primary',
            });
        }

        var conditions=[]
        //get conditions by conection
        if(this._conections.length>0){

            var conectionsCondition = {
                and:true,
                conditions:[],
            };

            this._conections.forEach(cn => {
            
                conectionsCondition.conditions.push({
                    table:0,
                    field:cn.field,
                    inter:'=',
                    value:cn.value,
                });
            });

            conditions.push(conectionsCondition);
        };
        

        //calculate size of all data and set pages
        k.#SetPages({
            conditions:conditions,
            success:()=>{

                //calculate limit
                var page = parseInt(this._body.Modulo_GetTool({name:'pages'}).GetValue());
                var size = parseInt(this._body.Modulo_GetTool({name:'sizes'}).GetValue()); 
                var limit = [(page-1)*size,size];

                //request sql data of reload
                k.#SqlReload({
                    selects:selects,
                    conditions:conditions,
                    limit:limit,
                    success:({data})=>{
                        
                        //print the resp

                        //k.CallEvent({name:'reloaded',params:{selects:selects,conditions:conditions,limit:limit}});
                        //k.CallEvent({name:'print',params:{data:data}});
                        k.#Action_Print({data:data});
                    }
                });
            }
        });
    }

    //set pages by the size of all data
    #SetPages({success,conditions=[]}){

        let k = this;
        //get size of data
        k.#RequestSizeData({
            conditions:conditions,
            success:({data})=>{

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

            pagesBox.SetOptions(pagesOptions);

            if(success!=null)success({});
        }});
    }

    //request in sql the data by fields
    #SqlReload({success,selects=[],conditions=[],limit=[]}){

        var sql = this._mysql.Select_Sql({
            table_main:0,
            selects:selects,
            limit:limit,
            conditions:conditions
        });

        this.LogAction({
            msg:{
                selects:selects,
                limit:limit,
                conditions:conditions,
                sql:sql,
            },
            logName:'eventSql',
        });

        let k = this;
        k._sql.Mysql_Row({
            sql:sql,
            success:(resp)=>{

                if(success!=null)success({data:resp});
                k.#data=resp;
            }
        });
    }

    //request in sql the size of all data
    #RequestSizeData({success,conditions=[]}){

        var fieldPrimaryInfo = this._mysql.GetFieldPrimaryInfo({table:0});

        var sql = this._mysql.Select_Sql({
            selects:[
                {
                    table:0,
                    field:fieldPrimaryInfo['Index'],
                    as:'size',
                    action:'count'
                },
            ],
            table_main:0,
            conditions:conditions,
        });

        this.LogAction({
            msg:{
                msg:'request size data',
                sql:sql,
                conditions:conditions
            },logName:'eventSql',
        })

        let k = this;
        k._sql.Mysql_Row({
            sql:sql,
            success:(resp)=>{

                if(success!=null)success({data:resp});
            }
        });
    }

    //--------------print-----------

    #Action_Print({data=[]}){

        for (let f = 0; f < this._fields.length; f++) {
            const field = this._fields[f];
            
            for (let y = 0; y < data.length; y++) {
                const line = data[y];
                
                if(field.sql!=null){

                    var fieldSqlInfo = this._mysql.GetFieldInfo({...field.sql});
                    var value = line[fieldSqlInfo['Field']];
                    var box = this._Action_Print_GetBox({fieldIndex:f,y:y});
                    if(box) box.setValue(value);
                }
            }

        }
    }

    _Action_Print_GetBox({fieldIndex,y}){


    }

    _Action_Print_GetBoxes({fieldIndex}){


    }

    //--------------insert---------------

    EventInsert({inserts=[],success}){

        let k = this;
        //push by conections
        if(this._conections.length>0){

            this._conections.forEach(cn => {
                
                inserts = this.PushToInserts({base:inserts,add:[{
                    field:cn.field,
                    value:cn.value,
                }]});
            });
        }

        //push to insert by fields
        var insertsByFields = this.CallEvent({name:'insertsByFields'});
        if(insertsByFields!=null && insertsByFields.length>0){

            inserts=this.PushToInserts({base:inserts,add:insertsByFields});
        }

        this.RequestMaxID({success:({data})=>{
            
            var max = data[0]['max'];
            if(max==null) max=0;
            var newPrimary = parseInt(max)+1;

            //push to insert newprimary
            var fieldPrimaryIndex = k._mysql.GetFieldPrimaryInfo({table:0})['Index'];  
            //delete all inserts that have primaryfieldindex
            for (var i = inserts.length - 1; i >= 0; --i) {
                if (inserts[i].field == fieldPrimaryIndex){
                    inserts.splice(i,1);
                }
            }
            //insert primaryfield value -> new primary
            inserts=k.PushToInserts({
                base:inserts,
                add:[{
                    field:fieldPrimaryIndex,
                    value:newPrimary,
                }]
            });

            k.SqlCreate({
                inserts:inserts,
                newPrimary:newPrimary,
                success:()=>{

                    k.CallEvent({name:'stateDefault'});
                }
            });
        }});
    }

    PushToInserts({base=[],add=[]}){

        var result = [...base];

        add.forEach(a => {
            
            var found = base.find(b=>b.field == a.field);
            if(found==null) result.push(a);
        });

        return result;
    }

    //request in sql max get primary
    RequestMaxID({success}){

        var fieldPrimaryInfo = this._mysql.GetFieldPrimaryInfo({table:0});

        var sql = this._mysql.Select_Sql({
            selects:[
                {
                    table:0,
                    field:fieldPrimaryInfo['Index'],
                    as:'max',
                    action:'max'
                },
            ],
            table_main:0,
        });

        this.LogAction({
            msg:{
                sql:sql,
            },logName:'eventSql',
        });

        let k = this;
        k._sql.Mysql_Row({
            sql:sql,
            success:(resp)=>{

                if(success!=null)success({data:resp});
            }
        });
    }

    //request in sql to insert new data by fields
    SqlCreate({inserts=[],success}){
    
        let k = this;

        var sql = this._mysql.Insert_Sql({
            table_main:0,
            inserts:inserts,
        });

        this.LogAction({msg:
            {
                sql:sql,
                inserts:inserts,
            },
            logName:'eventSql',
        });

        this._sql.Mysql_Success({
            sql:sql,
            success:(resp)=>{

                var fieldSqlPrimary = k._mysql.GetFieldPrimaryInfo({table:0});
                var newID = inserts.find(ins=>ins.field==fieldSqlPrimary['Index']).value;

                if(success!=null)success({resp:resp});
                k.CallEvent({name:'created',params:{inserts:inserts,newID:newID}});
            }
        });
        

    }

    //--------------update-----------------

    EventUpdate({y=0,success}){

        let k = this;

        var sets = [];
        //push set by fields
        for (let f = 0; f < this._fields.length; f++) {
            const fi = this._fields[f];
            
            if(fi.sql!=null){

                sets.push({
                    field:fi.sql.field,
                    value:this.CallEvent({name:'boxGetValue',params:{fieldIndex:f,y:y}})
                });          
            }
        }

        //remove set if fieldSql is primary
        var fieldPrimaryIndex = k.GetFieldPriSqlInfo({})['Index'];
        for (var i = sets.length - 1; i >= 0; --i) {
            if (sets[i].field == fieldPrimaryIndex){
                sets.splice(i,1);
            }
        }
        
        var conditions = [];
        //condition by primary
        var fieldPrimaryInfo = this.GetFieldPriSqlInfo({});
        var fieldPrimaryValue = this.GetDataFieldSql({fieldSqlIndex:fieldPrimaryInfo['Index'],y:y});
        conditions.push({
            and:true,
            conditions:[{
                table:0,
                field:fieldPrimaryInfo['Index'],
                inter:'=',
                value:fieldPrimaryValue,
            }],
        });

        this.SqlUpdate({
            sets:sets,
            conditions:conditions,
            success:()=>{

                k.CallEvent({name:'updated',from:'event update in crud'});
                if(success!=null)success({conditions:conditions,sets:sets});
            }
        })
    }

    //request in sql to update by sets and conditions
    SqlUpdate({sets=[],conditions=[],success}){

        if(sets.length<=0){

            this.LogAction({msg:['error sets to update is empty',sets,conditions]});
            return;
        }

        var sql = this._mysql.Update_Sql({
            table_main:0,
            sets:sets,
            conditions:conditions,
        });

        this.LogAction({msg:{
            sql:sql,
            sets:sets,
            conditions:conditions,
        },logName:'eventSql'});

        this._sql.Mysql_Success({
            sql:sql,
            success:(resp)=>{

                if(success!=null)success(resp);
            }
        })
    }

    //----------------delete-------------

    //request in sql to delete data by fields of body
    
    EventDelete({y=0,success}){

        var conditions=[];

        //push conditions by conection
        if(this._conections.length>0){

            var conditionConection = {
                and:true,
                conditions:[],
            }
            
            this._conections.forEach(cn => {
                
                conditionConection.conditions.push({
                    table:0,
                    field:cn.field,
                    inter:'=',
                    value:cn.value,
                })
            });

            conditions.push(conditionConection);
        }

        //condition by primary
        conditions.push({
            and:true,
            conditions:[{...this.GetConditionPrimary({y:y})}],
        });
        
        this.SqlDelete({conditions:conditions,success:success});
    }

    SqlDelete({success,conditions=[]}){

        let k = this;
        
        this.LogAction({msg:{
            conditions:conditions,
            //sql:sql,
        },logName:'eventSql'});

        var sql = k._mysql.Delete_Sql({
            table_main:0,
            conditions:conditions,
        }); 

        k._sql.Mysql_Success({
            sql:sql,
            success:(resp)=>{

                if(success!=null)success({resp:resp});
            }
        })

    }

    //----------------conections-----------

    _conections=[
        /*{
            name:'',
            table:0,
            field:0,
            value:5,
        }*/
    ];

    SetConection(i){

        var conectionIndex = this._conections.findIndex(cn=>cn.name==i.name);
        if(conectionIndex!=-1){

            this._conections[conectionIndex]=i;

        }else this._conections.push(i);
    }

    //-----------------Public Functions--------

    SetDefault(){

        this.#Action_Reload({});
    }
    
    
}