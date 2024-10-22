
class Crud extends ODD {

    constructor(i){

        if(i.events == null)i.events = [];
        i.events.push({
            name:"recordUpdate",
            actions:[{
                action:({k})=>{

                    console.log("crud -> record update",k.#records);
                }
            }]
        });

        super(i);
        
        this.#schemaSetVariable(i);
        this.#bodyBuild(i);
        this.#LoadsBuild(i);
        let u = this;
        this.#loads.Load({success:()=>{

            var stateStart = i.stateStart ? i.stateStart : "reload";
            u.#body.stateSet({stateName:stateStart});
        }});
    }

    #loads = null;
    #LoadsBuild({loads}){
        let u = this;
        this.#loads = new Loads({
            loads,
            conection:this.#conection,
            events:[
                {
                    name:"loaded",
                    actions:[{
                        action:({k})=>{

                            u.#loadsLoaded({k});
                        }
                    }]
                }
            ]
        });
    }
    #loadsLoaded({k}){

        let u = this;
        k.Loads_Get().forEach(load => {
           
            load.options = load.result.map(rst=>{return {value:rst.value,show:rst.show}});
            
            u.#body.fieldsGet().filter(f=>f.load!=null).forEach(field => {

                field.box.options = load.options;
                u.#body.fieldSetOptions({fieldName:field.name,options:load.options});
            });
        });
    }

    #body = null;
    bodyGet(){return this.#body;}
    #bodyBuild(i){

        let u = this;
        this.#body = new Crud_Body_v2({
            ...i,
            events:[
                {
                    name:"boxUpdate",
                    actions:[{
                        action:(params)=>{u.#bodyEventBoxUpdate(params)}
                    }]
                },
                {
                    name:"toolUpdate",
                    actions:[{
                        action:({tool})=>{

                            u.#bodyEventTool({tool});
                            
                        }
                    }],
                },
                {
                    name:"setStateAfter",
                    actions:[{
                        action:(params)=>{u.#bodyEventStateSet(params)}
                    }]
                }
            ],
        });
    }

    #bodyEventBoxUpdate(params){

        //console.log("boxUpdate params:",params);
        
        if(params.field && params.field.box.tipe != 0){

            var indexofPanel = params.recordIndex;
            var index = this.#records.print[indexofPanel];

            this.CallEvent({name:"boxUpdate",params:{...params,k:this,index,indexofPanel}});

            
            
            //console.log("boxUpdate params:",params,"index:",index);
            
            if(params.field.action == null ){
                
                if(this.#records.print.length > 0){

                    
                    var value = this.#body.fieldGetValues({fieldName:params.field.name})[indexofPanel];
                    this.recordUpdate({
                        index,
                        fields:[{field:params.field.select,value}],
                    });
                    this.PrintData();
                }
                
            }
            else
            {

                if(params.field.action == "delete"){

                    this.recordDelete({index});
                    this.PrintData();
                    /*this.#body.panelsGet().forEach(pn=>{

                        var pnBuild = pn.build;
                        if(pnBuild.tipeGet()=="table"){
                            
                            pnBuild.buildGet().RemoveLine({y:indexofPanel});
                        }
                        else pnBuild.buildGet().fieldRemove({fieldName:params.field.name,index:indexofPanel});
                    });*/
                }
            }
        }
    }

    #bodyEventTool({tool}){

        let u = this;
        u.CallEvent({name:"toolUpdate",params:{tool}});
        if(tool.active == false) return;

        switch (tool.name) {
            case "addLine":
                
                u.#bodyEventAddLine({tool});

            break;

            case "insert":

                u.#UpdateEvent({});
            break;

            case "new":

                u.#body.stateSet({stateName:"new"});
                //u.#recordIndexPrint = [];
            break;

            case "reload":

                u.#body.stateSet({stateName:"reload"});
            break;

            case "update":

                u.#UpdateEvent({});
            break;

            case "delete":

                u.recordDelete({index:u.#records.print[0]});
            break;

            case "data":

                console.log("records data of crud:",u.#records.data);
                u.recordGetDataJoined({});
                
            break;

            case "cancel":

                u.#body.stateSet({stateName:"reload"});
            break;
        }

        if(tool.name == "sizes" || tool.name == "pages"){

            u.#bodySetPagesAndSizes({size:u.#records.data.length});
            u.PrintData({});

            switch (u.#body.stateGet()) {
                case "reload":
                    
                        //u.#ReloadRecords({});
                    break;
            
                case "new":
                    
                    /*if(tool.name == "sizes"){

                        u.#bodySetPagesAndSizes({size:u.#records.data.length});
                        u.PrintData({});
                    }
                    else
                    {

                        u.PrintData({});
                    }*/

                break;
            }

            
        }
    }

    #bodyEventStateSet({stateName}){

        switch (stateName) {
            case "new":

                this.recordSetData({data:[]});
                this.PrintData({});
                //this.PrintNew({});

            break;

            case "reload":

                let k = this;
                this.#ReloadSetData({
                    success:()=>{

                        k.#ReloadRecords({});
                    }
                });
            break;
        
            default:
                break;
        }

        this.CallEvent({name:"stateSetAfter",params:{stateName}});
    }

    #bodySetPagesAndSizes({size,setLastPage=false}){

        var sizeValue = parseFloat(this.#body.toolGetBox({toolName:"sizes"}).GetValue());
        var pagesCount = Math.ceil(size/sizeValue);
        if(pagesCount<=0) pagesCount = 1; 

        var pagesOptions = [];
        for (let pg = 1; pg <= pagesCount; pg++) {
            
            pagesOptions.push({
                show:"pag " + pg,
                value:pg,
            });                    
        }

        var pagesBox = this.#body.toolGetBox({toolName:"pages"});
        var lastpage = pagesBox.GetValue();
        pagesBox.SetOptions(pagesOptions);

        var lastPageFound = pagesOptions.find(op=>op.value == lastpage);
        if(!lastPageFound || setLastPage) lastpage = pagesOptions[pagesOptions.length-1].value;

        pagesBox.SetValue(lastpage);
    }

    #bodyGetRangeIndex({}){

        var page = this.#body.toolGetBox({toolName:"pages"}).GetValue();
        var size = this.#body.toolGetBox({toolName:"sizes"}).GetValue();
        var start = (page - 1) * size;
        var end = page * size;
        return {start,end};
    }

    #bodyEventAddLine({}){

        var fields = [];
        this.#body.fieldsGet().filter(f=>f.select!=null &&f.action==null&&f.box.tipe!=0).forEach(field=>{
            
            fields.push({
                field:field.select,
                value:[field.box.value],
            });
        });

        var joins = [];
        this.#joinsCrud.forEach(jn => {
            
            joins.push({
                field:jn.select,
                value:jn.value,
                index:jn.index,
            });
        });

        this.recordAdd({fields,joins});
        this.#bodySetPagesAndSizes({size:this.#records.data.length,setLastPage:true});
        this.PrintData({});
    }

    //------schema

    #tableMain;
    #selectPrimary;
    #conection;
    #inserts;
    #selects;
    #conditions;
    #orders;

    #schemaSetVariable({schema,tableMain,selectPrimary,fields=[],selects=[],inserts=[],conditions=[],joins=[],orders=[]}){

        this.#selects = selects;

        if(schema){

            tableMain = schema.table;
            selectPrimary = schema.fieldPrimary;
        }        

        this.#conection = db_lip;
        this.#tableMain = tableMain;
        this.#selectPrimary = selectPrimary;
        this.#inserts = inserts;

        this.#selects.forEach(slc => {if(slc.table == null) slc.table = this.#tableMain;});

        this.#conditions = conditions;
        this.#joinsCrud = joins;
        this.#orders = orders;
    }

    #schemGetNewPrimary({success}){

        var primaryNewConfig = {
            tableMain:this.#tableMain,
            selects:[{
                action:"max",
                table:this.#tableMain,
                field:this.#selectPrimary,
                as:"primaryMax",
            }],
        };        

        this.#conection.Request({
            php:"row",
            sql:this.#conection.GetSql_Select({...primaryNewConfig}),
            success:(result)=>{

                var primaryMax = result[0]["primaryMax"];
                if(primaryMax == null) primaryMax = 0;
                else primaryMax = parseFloat(primaryMax);
                var primaryNew = primaryMax + 1;

                success({primaryNew});
            }
        });
    }

    //-----joins----

    #joinsCrud = [];
    joinSet({name,select,value,index}){

        var joinFound = this.#joinsCrud.find(jn=>jn.name==name);
        if(joinFound == null){

            this.#joinsCrud.push({
                name,
                select,
                value,
                index,
            });
        }
        else 
        {
            joinFound.value = value;
            joinFound.index = index;
            console.log("crud: " + this._name + " set join: ",joinFound);
        }
    }

    //------records------

    #records = {
        data:[],
        actions:[],
        print:[],
    };
    recordGetData(){return this.#records.data;}

    recordGetDataJoined(){

        var dataJoined = [];

        this.#records.data.forEach(d=>{

            var JoinOn = true;

            if(d.joins!=null){

                d.joins.forEach(djn => {
               
                    var dataJoinOn = this.#joinsCrud.find(jn=>jn.select==djn.field && (jn.value!=null?jn.value==djn.value:jn.index==djn.index));
                    if(JoinOn && dataJoinOn == null){
    
                        console.log("crud: "+ this._name + " data join off data:",d,"joins:",this.#joinsCrud);
                        
                        JoinOn = false;
                    }
                });
            }
            

            if(JoinOn) dataJoined.push(d);
        });

        //console.log("crud: "+this._name+" joined data",dataJoined," joins:",this.#joinsCrud);
        return dataJoined;
    }

    recordSetData({data=[]}){

        for (let i = 0; i < data.length; i++) data[i].index = i;
        this.#records.data = data;
        this.#records.actions = [];

        this.#bodySetPagesAndSizes({size:this.#records.data.length});

        this.CallEvent({name:"recordUpdate"});   
    }

    recordAdd({primary,fields,joins}){

        var index = this.#records.data.length;
        this.#records.actions.push({
            type:"new",
            primary,
            fields,
            joins,
            index
        });
        this.#records.data.push({fields,primary,joins,index});
        this.CallEvent({name:"recordUpdate",params:{type:"add"}});
    }

    recordUpdate({index,fields}){

        if(index == null || index >= this.#records.data.length){

            console.log("error no se puede editar index("+index+") > max ",this.#records.data);
            return;
        }

        var primary = this.#records.data[index].primary;

        console.log("record update, index:",index,"fields:",fields);
        

        this.#records.actions.push({
            type:"update",
            index,
            fields,
            primary,
        });

        var recordData = this.#records.data[index];
        fields.forEach(field => {
            
            var fieldData = recordData.fields.find(d=>d.field==field.field);
            fieldData.value = field.value;
        });

        
        this.CallEvent({name:"recordUpdate",params:{type:"add"}});
    }

    recordDelete({index}){

        var primary = this.#records.data[index].primary;
        this.#records.data.splice(index,1);
        this.#records.actions.push({
            type:"delete",
            index,
            primary
        });
        for (let index = 0; index < this.#records.data.length; index++) this.#records.data[index].index = index;
        
        this.CallEvent({name:"recordUpdate",params:{type:"delete"}});
    }

    //-----reloads---

    #reloads = [];

    #ReloadSetData({success}){

        let k = this;

        k.#body.LoadingScreenActive({active:true});
        this.#ReloadGetSizes({
            conditions:this.#ReloadConditions({}),
            joins:[],
            success:({totalRecords})=>{

                var data = [];
                for (let i = 0; i < totalRecords; i++) data.push({primary:i,fields:[]});
                this.recordSetData({data});

                k.#body.LoadingScreenActive({active:false});

                if(success != null) success();
            }
        });

    }

    #ReloadRecords({success}){

        let k = this;

        //selects
        var selects = [...this.#selects];
        selects.push({
            table:this.#tableMain,
            field:this.#selectPrimary,
            as:"primary",
        });

        //request
        var size = parseFloat(this.#body.toolGetBox({toolName:"sizes"}).GetValue());
        var page = parseFloat(this.#body.toolGetBox({toolName:"pages"}).GetValue());

        k.#body.LoadingScreenActive({active:true});

        this.#conection.Request({
            php:"row",
            sql: k.#conection.GetSql_Select({
                tableMain:k.#tableMain,
                selects,
                //joins,
                conditions:k.#ReloadConditions({}),
                limit:[((page-1)*size),size],
                orders:k.#orders,
            }),
            success:(result)=>{
                
                var range = k.#bodyGetRangeIndex({});
                for (let index = range.start; index < range.end; index++) {
                    
                    var data =  k.#records.data[index];
                    var rstIndex = index-range.start;

                    if(rstIndex < result.length){

                        var rst = result[rstIndex];
                        data.primary = rst["primary"];
                        data.fields = [];
                        
                        selects.forEach(slc => {
                        
                            data.fields.push({
                                field:slc.field,
                                value:rst[slc.field],
                            });
                        });
                    }
                    
                }

                k.#body.LoadingScreenActive({active:false});
                k.PrintData({});

                if(success!=null) success();
                //k.#ReloadSuccess({result,selects,totalRecords});
            }
        });

    }

    #ReloadGetSizes({conditions,joins,success}){

        let k = this;
        this.#conection.Request({
            php:"row",
            sql: k.#conection.GetSql_Select({
                tableMain:k.#tableMain,
                selects:[{
                    action:"count",
                    table:k.#tableMain,
                    field:k.#selectPrimary,
                    as:"size",
                }],
                joins,
                conditions,
            }),
            success:(result)=>{

                var totalRecords = 0;
                if(result && result.length>0) totalRecords = parseFloat(result[0]["size"]);
                
                //console.log("crud set -> count data",totalRecords);
                success({totalRecords});
            } 
        });
    }

    #ReloadSuccess({result,selects,totalRecords}){

        this.#body.LoadingScreenActive({active:false});

        //get data to print
        var data = [];
        var range = this.#bodyGetRangeIndex({});

        console.log("totalRecord:",totalRecords,"range",range,"result",result);
        

        for (let i = 0; i < totalRecords; i++) {
            
            if(range.start <= i && i < range.end){

                var rstIndex = i-range.start;
                //console.log("index result",rstIndex);
                
                var rst = result[rstIndex];
                var line = {
                    primary:rst["primary"],
                    fields:[],
                };
                selects.forEach(slc => {
                    
                    line.fields.push({
                        field:slc.field,
                        value:rst[slc.field],
                    });
                });
                data.push(line);
            }
            else
            {
                data.push({primary:i,fields:[]});
            }
        }

        //console.log("reload calculate data",data,"size:",size);
        

        //set to record
        this.recordSetData({data});
        this.PrintData({});
    }

    #ReloadConditions({}){

        var conditions = [];

        //filters
        var filtersCondition = this.#body.configGetWindowFilters().GetConditions();
        conditions = [...filtersCondition];


        //crud joins
        var joinmMax = this.#joinsCrud.length;
        for (let jn = 0; jn < joinmMax; jn++) {

            const jncrd = this.#joinsCrud[jn];
            if(jncrd.value){

                var joinLast = jn == joinmMax-1;
                conditions.push({
                    table:this.#tableMain,
                    field:jncrd.select,
                    inter:"=",
                    value:jncrd.value,
                    after:(!joinLast ?" AND ": ""),
                });
            }   
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

    //-----print-----
    
    PrintData(){

        var dataJoined = this.recordGetDataJoined({});
        var indexsRecords = [];
        var range = this.#bodyGetRangeIndex({});
        
        for (let i = range.start; i < range.end; i++)if(i < dataJoined.length) indexsRecords.push(dataJoined[i].index);
        
        this.PrintByIndexsRecords({indexsRecords});
    }

    PrintByIndexsRecords({indexsRecords=[]}){

        var requestData = false;
        indexsRecords.forEach(index => {
            
            if(this.#records.data[index].fields.length == 0) requestData = true;
        });

        let k = this;
        if(requestData){

            this.#ReloadRecords({
                success:()=>{

                    SetIndexRecords(k);
                }
            });

        }else SetIndexRecords(k);
        
        
        function SetIndexRecords(k) {
            
            //console.log("print indexrecords:",indexsRecords);
            k.CallEvent({name:"printByIndexs",params:{indexsRecords}});

            var data = [];
            k.#records.print = indexsRecords;
            k.#records.print.forEach(indexRecord => {
                
                if(indexRecord < k.#records.data.length) data.push(k.#records.data[indexRecord]);
            });

            //console.log("indexs:",indexsRecords,"data:",data);
            
            k.#body.fieldsGet().forEach(field => {

                var values = [];
                //console.log("data:",data);
                
                data.forEach(line => {
                    
                    var printValue = null;

                    //print if is action
                    if(field.action) printValue = field.box.value;

                    //print by data
                    //console.log("line of data :",line);
                    
                    var lineField = line.fields.find(fld=>(fld.field==field.name || fld.field==field.select));
                    if(lineField) printValue = lineField.value;
                    if(field.select == "primary") printValue = line.primary;

                    if(printValue == null) printValue = "";
                    values.push(printValue);
                });

                //console.log("set values to field ",field," values:",values);
                
                k.#body.fieldSetValues({fieldName:field.name,values});
            });
        }
        
    }

    //-----update----
    
    #UpdateEvent({}){

        let  k = this;
        k.#body.LoadingScreenActive({active:true});
        
        //----insert----
        this.#UpdateInsert({
            success:()=>{

                //------delete--------
                k.#UpdateDelete({

                    success:()=>{

                        k.#UpdateUpdate({
                            success:()=>{

                                k.recordSetData({data:[]});
                                k.#body.LoadingScreenActive({active:false});
                                //k.#body.stateSet({stateName:"reload"});                           
                            }
                        });                        
                    }
                })
            }
        })

        
    }

    #UpdateDelete({success}){

        var deleteConfig = {
            tableMain:this.#tableMain,
            conditions:[],
        }

        var deleteActions = this.#records.actions.filter(act=>act.type=="delete" && act.primary!=null);
        for (let a = 0; a < deleteActions.length; a++) {
            
            var act = deleteActions[a];

            deleteConfig.conditions.push({
                before:(a==0 ? " ( " : " OR "),
                table:this.#tableMain,
                field:this.#selectPrimary,
                inter:"=",
                value:act.primary,
                after:(a==deleteActions.length-1 ? " ) " : ""),
            });
        }

        console.log("delete config:",deleteConfig);
        

        if(deleteConfig.conditions.length>0){

            this.#conection.Request({
                php:"success",
                sql:this.#conection.GetSql_Delete({...deleteConfig}),
                success:(result)=>{
    
                    if(success!=null) success(result);
                }
            });
        }
        else success();

    }

    #UpdateInsert({success}){

        let k = this;

        var recordsInserts = [];
        k.#records.data.filter(d=>d.primary==null).forEach(d=>{

            var recordInsert = {
                index:d.index,
                inserts:[],
            };

            d.fields.forEach(fld => {

                recordInsert.inserts.push({
                    field:fld.field,
                    value:fld.value,
                });
            });

            d.joins.filter(jn=>jn.value != null).forEach(jn => {

                recordInsert.inserts.push({
                    field:jn.field,
                    value:jn.value,
                });
            });

            recordsInserts.push(recordInsert);
        }); 

        var insertsData = [];
        recordsInserts.forEach(r => {
            
            r.inserts.forEach(ins => {
                
                insertsData.push(ins);
            });
        });

        console.log("inserts data:",insertsData, "records:",recordsInserts);
        

        if(insertsData.length >0){

            k.#body.LoadingScreenActive({active:true});
            this.#schemGetNewPrimary({
                success:({primaryNew})=>{

                    var insertConfig = {
                        tableMain:k.#tableMain,
                        inserts:[],
                    }

                    //insert by primary new
                    insertConfig.inserts.push({
                        field:k.#selectPrimary,
                        value:primaryNew,
                        tipe:"secuence",
                    });

                    //insert by joins
                    k.#inserts.forEach(ins => {
                        
                        insertConfig.inserts.push({
                            ...ins,
                            tipe:(ins.tipe?ins.tipe:"const"),
                        });
                    });

                    //add inserts data
                    insertsData.forEach(ins => {insertConfig.inserts.push({...ins})});

                    //request
                    k.#conection.Request({
                        php:"success",
                        sql:k.#conection.GetSql_Insert({...insertConfig}),
                        success:(result)=>{

                            for (let r = 0; r < recordsInserts.length; r++) {
                                const rcd= recordsInserts[r];
                                k.#records.data[rcd.index].primary = (primaryNew + r);
                            }

                            k.#body.LoadingScreenActive({active:false});
                        }
                    });
                }
            });
        }
        else success();
       
    }

    #UpdateUpdate({success}){
        
        let k = this;
        var updateActions = this.#records.actions.filter(act=>act.type=="update"&&act.primary!=null);

        //console.log("update actions:",updateActions);
        
        var updates = [];
        let uniquePrimary = [...new Set(updateActions.map(item => item.primary))];

        uniquePrimary.forEach(primary => {
            
            var updateActionsByIndex = updateActions.filter(act=>act.primary==primary);
            var fields = [];
            updateActionsByIndex.forEach(act => {
                
                act.fields.forEach(fld => {
                    
                    var fieldFound = fields.find(f=>f.name == fld.field);
                    if(fieldFound == null){

                        fields.push({
                            name:fld.field,
                            values:[fld.value],
                        });
                    }
                    else fieldFound.values.push(fld.value);
                });
            });

            //console.log("update data fields:",fields);

            updates.push({
                primary,
                fields:fields.map(f=>{return {field:f.name,value:f.values[f.values.length-1]}}),
            });

        });

        console.log("total updates:",updates);

        var count = 0;
        var max = updates.length;
        UpdateRequest();

        function UpdateRequest() {

            if(count < max){

                var config = {
                    tableMain:k.#tableMain,
                    sets:updates[count].fields,
                    conditions:[{
                        table:k.#tableMain,
                        field:k.#selectPrimary,
                        inter:"=",
                        value:updates[count].primary,
                    }],
                }
                
                k.#conection.Request({
                    php:"success",
                    sql:k.#conection.GetSql_Update({...config}),
                    success:()=>{

                        //console.log("updated " + count + "/" + max);
                        
                        count++;
                        UpdateRequest();
                    }
                });
            }
            else
            {

                success();
            }
        }
    }

}