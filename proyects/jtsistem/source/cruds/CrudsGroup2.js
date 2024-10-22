
function crudSetBySchema({crud,userData}) {

    if(crud == null) crud = {};

    if(crud.schema){

        let u = this;

        crud.tableMain = crud.schema.table;
        if(crud.selects == null) crud.selects = [];
        if(crud.orders == null) crud.orders = [];
        if(crud.inserts == null) crud.inserts = [];
        if(crud.conditions == null) crud.conditions = [];
        if(crud.loads == null) crud.loads = [];
        if(crud.filters == null) crud.filters = [];

        //condition & insert by company
        if(crud.schema.company == true){
            
            crud.conditions.push({
                table:crud.tableMain,
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
            });

            crud.inserts.push({
                table:crud.tableMain,
                field:"ID_COMPANY",
                tipe:"const",
                value:userData.company.id,
            });
        }

        //add select by primary
        crud.selects.push(
            {
                table:crud.schema.table,
                field:crud.schema.fieldPrimary,
                primary:true
            }
        );

        //add condition by company
        if(schema.company == true){
            
            crud.conditions.push({
                table:schema.table,
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
            });
        }

        //set fields && filters!!
        crud.panels.forEach(panel => {
            
            var addFilters = crud.addFilters != null ? crud.addFilters : panel.tipe == "table";
            
            if(panel.fields == null) panel.fields = [];
            panel.fields = panel.fields.filter(fld=>fld!=null);

            if(panel.fieldsSet){

                panel.fieldsSet.forEach(fset => {
                    
                    //field action
                    if(fset.action != null){

                        var fieldAction = {};
                        switch (fset.action) {

                            case "div":
                                fieldAction = {
                                    action:fset.action,
                                    name:fset.name,
                                    tipe:0,col:fset.col,
                                    box:{tipe:0,class:"bg-success conteiner w-100 p-0 m-0"},
                                }
                            break;

                            case "button":
                                fieldAction = {
                                    action:fset.action,
                                    name:fset.name,
                                    tipe:0,col:fset.col,
                                    box:{value:fset.value,tipe:5,class:(fset.class?fset.class:"bg-success conteiner w-100 p-0 m-0")},
                                }
                            break;
                        }
                        panel.fields.push(fieldAction);
                    }
                    else
                    {
                        var fsch = crud.schema.fields.find(fsch=>fsch.value == fset.value);
                        if(!fsch) console.log("NO FOUND FIELD SCHEMA", fset, schema.fields);
                        
                        var facc = fsch.access == true ? true : Access_Get(userData.access,fsch.access);

                        if(facc){

                            //loads
                            var load = fset.load ? fset.load : fsch.load;
                            if(load){

                                if(load.conditions == null) load.conditions = [];
                                load.conditions.push({
                                    before:load.conditions.length>0?" AND ":"",
                                    table:load.tableMain,
                                    field:"ID_COMPANY",
                                    inter:"=",
                                    value:userData.company.id,
                                });
                                crud.loads.push(load);
                            }

                            //fields
                            var ftype = fieldTypes.find(ftype=>ftype.tipe==fsch.tipe);

                            var boxByState = (fset.state == "edit"? ftype.edit.box: ftype.show.box);
                            var box = {...boxByState};
                            if(fset.showBox) box = {...fset.showBox};
                            if(fsch.options){
                                box.options = fsch.options;
                                box.value = fsch.options[0].value;
                            }
                            if(fset.boxValue) box.value = fset.boxValue;

                            var attributes = [];
                            if(panel.tipe == "table"){

                                var minWidth = null;
                                if(fsch.minWidth != null) minWidth = fsch.minWidth;
                                if(fset.minWidth != null) minWidth = fset.minWidth;
                                if(minWidth) attributes.push({name:"style",value:"min-width:"+minWidth+"px;"});

                                var maxWidth = null;
                                if(fsch.maxWidth != null) maxWidth = fsch.maxWidth;
                                if(maxWidth) attributes.push({name:"style",value:"max-width:"+maxWidth+"px;"});
                            }

                            //get load
                            var load = (load?{name:load.name,value:"value",show:"show"}:null);
                            var fieldAdd = {
                                tipe:fset.tipe?fset.tipe:1,
                                value:fsch.value,
                                name:fsch.value,
                                title:fsch.name,
                                box:{...box},
                                select:fsch.select,
                                load,
                                attributes,
                                col:fset.col,
                            }

                            if(fset.position == null) panel.fields.push(fieldAdd);
                            else panel.fields.unshift(fieldAdd);

                            //box update event
                            if(fset.update!=null){

                                /*this.#crudAddActionEventToScript({
                                    events: crud.events,
                                    eventName:"boxUpdate",
                                    action:({k,field})=>{
    
                                        if(field.name == fsch.name){
    
                                            fset.update({groups:u,field,crudBuild:k});
                                        }
                                    }
                                });*/
                            }

                            //selects
                            crud.selects.push({
                                table:crud.schema.table,
                                field:fsch.select,
                            });

                            //orders
                            if(fset.asc != null) crud.orders.push({table:schema.table,field:fsch.select,asc:fset.asc});                    

                            //add filter
                            if(addFilters && ftype.filter && ftype.filter.box){

                                var filterBox = {...ftype.filter.box};
                                if(fsch.options){

                                    filterBox.options = fsch.options;
                                    //filterBox.value = fsch.options[0].value;
                                }
                                if(fset.filter && fset.filter.value) filterBox.value = fset.filter.value;

                                crud.filters.push({
                                    name:fsch.name,
                                    box:filterBox,
                                    load,
                                    select:{
                                        table:crud.tableMain,
                                        field:fsch.select,
                                        //inter:ftype.filter.inter,
                                        //tipe:ftype.filter.tipe,
                                    },
                                });
                            }
                        }
                    }                    

                });
            }

        });

        //set stateTools
        if(crud.stateTools == null){

            switch (crud.panels[0].tipe) {
                case "table":
                    crud.stateTools = [
                        {
                            name:"reload",
                            tools:[
                                {name:"reload",show:true},
                                {name:"new",show:(crud.stateType!="show")},
                                {name:"sizes",show:true,value:10},
                                {name:"pages",show:true},
                            ],
                        },
                    ];
                break;
            
                case "form":
                    crud.stateTools = [
                        {
                            name:"reload",
                            tools:[
                                {name:"reload",show:true},
                                {name:"new",show:true},
                                {name:"sizes",show:false,value:1},
                                {name:"pages",show:true},
                            ],
                        },
                        {
                            name:"new",
                            tools:[
                                {name:"cancel",show:true},
                                {name:"insert",show:true},
                            ],
                        },
                    ];
                break;
            }
        }

    }
    
    return crud;
}

class CrudsGroup extends ODD {
    
    constructor(i) {
        
        super(i);
        if(i.conections == null) i.conections = [];
        this.#setVaribles(i);
        this.#Build(i);
    }

    #setVaribles({test=false,groups=[],layers=[],conections=[]}){

        this.#test = test;
        groups = groups.filter(gp=>gp!=null);
        groups.forEach(gp => {
            
            if(gp.layers){

                gp.layers.forEach(ly => {
                
                    layers.push(ly);
                });
            }
            
            if(gp.conections){

                gp.conections.forEach(cnx=>{

                    conections.push(cnx);
                    console.log("GROUP SET ONE CONECTION",cnx,[...conections]);
                });
            }

        });
    }

    #test = true;

    #conections = [];

    #Build({userData,parent,layers=[],cruds=[],conections=[]}){
        
        console.log("GROUP BUILD: CONECTIONS",layers);

        layers = layers.filter(ly=>ly!=null);
        conections = conections.filter(cnx=>cnx!=null);

        this.#conections = conections;
        this.#layersBuild({parent,layers,userData});
        //this.#crudsBuild({cruds,userData});
    };

    #cruds=[];#fromPage = null;

    #crudSetByConections({crud}){

        if(crud.events==null) crud.events = [];
        let u = this;

        //add events to modal
        if(crud.modalBuild){

            this.#crudAddActionEventToScript({
                events:crud.events,
                eventName:"reloadBefore",
                action:({})=>{
    
                    crud.modalBuild.SetActive({active:true});
                }
            });

            this.#crudAddActionEventToScript({
                events:crud.events,
                eventName:"blockAfter",
                action:({})=>{
    
                    crud.modalBuild.SetActive({active:false});
                }
            });

            this.#crudAddActionEventToScript({
                events:crud.events,
                eventName:"newAfter",
                action:({})=>{
    
                    crud.modalBuild.SetActive({active:true});
                }
            });

            crud.afterCancel = "block";
        }  

        let editName = crud.name + "-edit";
        let addName = crud.name + "-add";
        let cnxName = crud.name+"-cnx";
        
        //conections
        var cnxMaster = this.#conections.filter(cnx=>cnx.masterName == crud.name);
        var cnxMasterfmFm = cnxMaster.filter(cnx=>cnx.event == "formForm");
        var cnxMasterList = cnxMaster.filter(cnx=>cnx.event == "list");
        var cnxMasterTbFm = cnxMaster.filter(cnx=>cnx.event == "tableForm");
        var cnxMasterfmExt = cnxMaster.filter(cnx=>cnx.event == "formExtend");
        var cnxMasterSearch = cnxMaster.filter(cnx=>cnx.event == "search");
        var cnxMasterSum = cnxMaster.filter(cnx=>cnx.event == "sum");
        var cnxMasterEdit = cnxMaster.filter(cnx=>cnx.event == "btn-edit");
        var cnxMasterCnx = cnxMaster.filter(cnx=>cnx.event == "cnx");

        
        var cnxMaid = this.#conections.filter(cnx=>cnx.maidName == crud.name);
        var cnxMaidfmFm = cnxMaid.filter(cnx=>cnx.event == "formForm");
        var cnxMaidList = cnxMaid.filter(cnx=>cnx.event == "list");
        var cnxMaidTbFm = cnxMaid.filter(cnx=>cnx.event == "tableForm");
        var cnxMaidfmExt = cnxMaid.filter(cnx=>cnx.event == "formExtend");
        var cnxMaidSum = cnxMaid.filter(cnx=>cnx.event == "sum");
        var cnxMaidEdit = cnxMaid.filter(cnx=>cnx.event == "btn-edit");
        var cnxMaidCnx = cnxMaid.filter(cnx=>cnx.event == "cnx");
        
        //set states
        if((cnxMaster.length > 0 || cnxMaid.length > 0) && !(cnxMasterCnx.length > 0 || cnxMaidCnx.length > 0)){

            crud.afterCancel = "reload";
            crud.afterInsert = "reload";
            crud.afterUpdate = "reload";
            crud.newActvie = true;
            crud.updateCurrent = null;

            crud.stateTools = [
                {
                    name:"reload",
                    tools:[
                        {name:"load",show:false},
                        {name:"question",show:false},

                        {name:"reload",show:false},
                        {name:"update",show:false},
                        {name:"new",show:false},
                        {name:"cancel",show:false},
                        {name:"sizes",show:false,value:1},
                        {name:"pages",show:false},

                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                    ],
                },
                {
                    name:"new",
                    tools:[
                        {name:"load",show:false},
                        {name:"question",show:false},

                        {name:"insert",show:true},
                        {name:"addLine",show:false},
                        {name:"cancel",show:true},
                    ],
                },
                {
                    name:"block",
                    tools:[
                        {name:"load",show:false},
                        {name:"question",show:false},
                        {name:"insert",show:false},
                    ],
                },
            ];
        }

        //bnt-edit -> (masterName,masterField,masterSelect,maidSelect)
        if(cnxMasterEdit.length > 0 || cnxMaidEdit.length > 0){

            if(cnxMasterEdit.length > 0){

                cnxMasterEdit.forEach(cnx => {

                    var cnxName = cnx.masterName + "-cnx-" + cnx.maidName;
                    var cnxEditName = cnx.masterName + "-edit-" + cnx.maidName;

                    crud.panels[0].fields.unshift({
                        ...fld_edit,
                        name:cnxEditName,
                    });

                    u.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"boxUpdate",
                        action:({field,y,k})=>{

                            if(field.name == cnxEditName){
                                
                                var value = null;

                                if(cnx.masterFieldName){

                                    var crudMaster = k;
                                    var masterValues = crudMaster.bodyGet().fieldGetValues({fieldName:cnx.masterFieldName});
                                    console.log("MASTER VALUES",masterValues);
                                    value = masterValues[y];
                                }
                                
                                if(value != null){

                                    var crudMaid = u.crudGetBuild({crudName:cnx.maidName});
                                    crudMaid.CrudJoins_Set({
                                        name:cnxName,
                                        value,
                                        field:cnx.maidSelect,
                                    });
                                    crudMaid.SetState({stateName:"reload"});
                                }                                
                            }
                        }
                    });
                });
            }

            if(cnxMaidEdit.length > 0){

                crud.stateStart = "block";
                crud.afterCancel = "block";
                crud.stateTools[0].tools.find(t=>t.name=="reload").show=false;
                crud.stateTools[0].tools.find(t=>t.name=="update").show=true;
                crud.stateTools[0].tools.find(t=>t.name=="cancel").show=true;
            }
        }

        //cnx -> masterAction == "edit/new" masterFieldName
        if(cnxMasterCnx.length > 0 || cnxMaidCnx.length > 0){

            if(cnxMasterCnx.length > 0){

                cnxMasterCnx.forEach(cnx => {

                    let editName = cnx.masterName + "-edit-" + cnx.maidName;
                    let addName = cnx.masterName + "-add-" + cnx.maidName;

                    if(cnx.masterAction == "edit"){

                        crud.panels[0].fields.unshift({
                            ...fld_edit,
                            name:editName,
                        });

                        u.#crudAddActionEventToScript({
                            events:crud.events,
                            eventName:"boxUpdate",
                            action:({k,field,y})=>{
    
                                if(field.name == editName){
                                    
                                    u.#crudConectToMaid({...cnx,y});
                                }                            
                            }
                        });
                    }

                    if(cnx.masterAction == "new"){

                        crud.newActive = false;
                        u.#crudAddActionEventToScript({
                            events:crud.events,
                            eventName:"toolNewUpdate",
                            action:({})=>{
    
                                u.#crudConectToMaid({...cnx,maidState:"new"});                                                       
                            }
                        });
                    }
                    
                    if(cnx.masterFieldName != null){

                        
                        var fieldIndex = crud.panels[0].fields.findIndex(f=>f.name==cnx.masterFieldName);
                        crud.panels[0].fields[fieldIndex].col = 8,
                        crud.panels[0].fields[fieldIndex].colAllLevel = true,

                        crud.panels[0].fields.splice(
                            fieldIndex+1,0,
                            {
                                ...fld_edit,
                                name:editName,col:2,tipe:0,
                                colAllLevel:true,
                            }
                        );
                        crud.panels[0].fields.splice(
                            fieldIndex+1,0,
                            {
                                ...fld_add,
                                name:addName,col:2,tipe:0,
                                colAllLevel:true,
                            }
                        );

                        u.#crudAddActionEventToScript({
                            events:crud.events,
                            eventName:"boxUpdate",
                            action:({field})=>{
    
                                if(field.name == editName) u.#crudConectToMaid({...cnx});
                                if(field.name == addName) u.#crudConectToMaid({...cnx,maidState:"new"});
                            }
                        });
                    }
                    else
                    {
                        u.#crudAddActionEventToScript({
                            events:crud.events,
                            eventName:"reloadAfter",
                            action:({k})=>{
    
                                if(cnx.masterAction == null) u.#crudConectToMaid({...cnx});
                            }
                        });
                    }
                });
            }

            if(cnxMaidCnx.length > 0){

                crud.filters = [];                
                crud.stateStart = "new";
                //crud.updateCurrent = true;

                if(cnxMaidCnx[0].type!="show" && crud.panels[0].tipe=="table"){

                    crud.panels[0].fields.unshift({
                        ...fld_delete,
                    });
                }
            }
        }

        //formForm -> form - form (masterFieldName,maidSelect)
        if(cnxMasterfmFm.length > 0 || cnxMaidfmFm.length > 0){

            if(cnxMasterfmFm.length > 0){                

                cnxMasterfmFm.forEach(cnx => {

                    var masterFieldIndex = crud.panels[0].fields.findIndex(f=>f.name==cnx.masterFieldName);
                    var masterField = crud.panels[0].fields[masterFieldIndex];
                    masterField.tipe = 0;
                    masterField.col = 8;
                    masterField.colAllLevel = true;

                    var cnxAddName = addName + "-" + cnx.maidName;
                    var cnxEditName = editName + "-" + cnx.maidName;

                    crud.panels[0].fields.splice(
                        masterFieldIndex+1,0,
                        {
                            ...fld_edit,
                            colAllLevel:true,
                            name:cnxEditName,col:2
                        }
                    );
                    crud.panels[0].fields.splice(
                        masterFieldIndex+1,0,
                        {
                            ...fld_add,
                            colAllLevel:true,
                            name:cnxAddName,col:2
                        }
                    );
                    
                    this.#crudAddActionEventToScript({
                    events:crud.events,
                    eventName:"boxUpdate",
                    action:({field,k})=>{

                        var maidCrud = u.crudGetBuild({crudName:cnx.maidName});                        

                        if(field.name == cnxEditName){
                                                      
                            var value = k.bodyGet().fieldGetValues({fieldName:cnx.masterFieldName})[0];
                            maidCrud.CrudJoins_Set({
                                name:cnxName,
                                field:cnx.maidSelect,
                                value,
                            });
                            maidCrud.SetState({stateName:"reload"});
                        }

                        if(field.name == cnxAddName){

                            maidCrud.SetState({stateName:"new"});
                        }
                    }
                });
                });
            }

            if(cnxMaidfmFm.length > 0){

                crud.stateStart = "block";
                crud.afterCancel = "block";
                crud.stateTools[0].tools.find(t=>t.name=="reload").show=true;
                crud.stateTools[0].tools.find(t=>t.name=="update").show=true;
                crud.stateTools[0].tools.find(t=>t.name=="cancel").show=true;

                cnxMaidfmFm.forEach(cnx => {
                    
                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"insertAfter",
                        action:({field,value})=>{

                            var crudMaster = u.crudGetBuild({crudName:cnx.masterName});
                            crudMaster.Load_Reset({success:()=>{

                                
                                if(crud.modalBuild) crud.modalBuild.SetActive({active:false});
                                var masterField = crudMaster.bodyGet().fieldsGet().find(f=>f.value==cnx.masterFieldName);
                                crudMaster.bodyGet().fieldSetValues({fieldName:masterField.name,values:[value]});
                                crudMaster.Update_AddChangeField({fieldName:masterField.name,value});
                            }});
                        }
                    });

                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"updateAfter",
                        action:({})=>{

                            if(crud.modalBuild) crud.modalBuild.SetActive({active:false});
                            
                            var crudMaster = u.crudGetBuild({crudName:cnx.masterName});
                            
                            crudMaster.Load_Reset({});
                        }
                    });
                });
            }
        }

        //list -> form - table
        if(cnxMaidList.length > 0 || cnxMasterList.length > 0){

            
            if(cnxMasterList.length > 0){
                
                var cnxMasterIsMaid = this.#conections.filter(cnx=>cnx.maidName == crud.name);

                if(cnxMasterIsMaid.length == 0){

                    crud.stateTools[0].tools.find(t=>t.name=="reload").show=true;
                    crud.stateTools[0].tools.find(t=>t.name=="update").show=(cnxMasterList[0].type!="show");
                    crud.stateTools[0].tools.find(t=>t.name=="new").show=this.#test;
                    crud.stateTools[0].tools.find(t=>t.name=="pages").show=(cnxMasterList[0].type!="show");

                    if(!this.#test){

                        crud.stateStart = "block";
                        crud.stateTools[2].tools.find(t=>t.name=="insert").show=true;   
                        crud.afterUpdate = "block";
                    }
                }

                cnxMasterList.forEach(cnx => {
                    
                    //reloadAfter
                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"reloadAfter",
                        action:({k})=>{

                            var maidCrud = u.crudGetBuild({crudName:cnx.maidName});
                            maidCrud.CrudJoins_Set({
                                name:"join-"+cnx.masterName,
                                field:cnx.maidSelect,
                                value:k.Reload_GetData()[0][cnx.masterSelect],
                            });
                            maidCrud.SetState({stateName:"reload"});                         
                        }
                    });

                    //newAfter
                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"newAfter",
                        action:({k})=>{

                            var maidCrud = u.crudGetBuild({crudName:cnx.maidName});
                            maidCrud.SetState({stateName:"block"});
                        }
                    });

                    //insertAfter
                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"insertAfter",
                        action:({field,value,k})=>{

                            /*var maidCrud = u.crudGetBuild({crudName:cnx.maidName});
                            maidCrud.CrudJoins_Set({
                                name:"join-"+cnx.masterName,
                                field:cnx.maidSelect,
                                value,
                            });
                            maidCrud.Insert({});*/
                            k.CrudJoins_Set({
                                name:"join-"+cnx.masterName,
                                field:cnx.masterSelect,
                                value,
                            });
                            k.SetState({stateName:"reload"});
                        }
                    });

                    //updateAfter
                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"updateAfter",
                        action:({})=>{

                            var maidCrud = u.crudGetBuild({crudName:cnx.maidName});
                            maidCrud.Update({});
                        }
                    });

                    //blockAfter
                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"blockAfter",
                        action:({k})=>{

                            var maidCrud = u.crudGetBuild({crudName:cnx.maidName});
                            maidCrud.SetState({stateName:"block"});
                        }
                    });

                    //setStateAfter
                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"setStateAfter",
                        action:({k,stateName})=>{

                            var open = stateName!="block";
                            k.bodyGet().panelsGet().forEach(panel => {

                                var build = panel.build.buildGet();
                                if(build instanceof Window){
                                                                 
                                    build.Conteiner_Show({show:open,slow:open,ignoreBlock:true});
                                }
                            });
                        }
                    });

                });

            }

            if(cnxMaidList.length > 0){

                var cnxMaidOfMaid = this.#conections.filter(cnx=>cnx.event == "tableForm" && cnx.masterName == cnxMaidList[0].maidName);
                crud.filters = [];

                crud.stateStart="block";
                crud.updateCurrent = true;
                crud.stateTools[0].tools.find(t=>t.name=="new").show=false;
                crud.stateTools[0].tools.find(t=>t.name=="pages").show=false;
                crud.stateTools[0].tools.find(t=>t.name=="sizes").show=false;
                crud.stateTools[0].tools.find(t=>t.name=="sizes").value=999;
                crud.stateTools[0].tools.find(t=>t.name=="insert").show=(cnxMaidList[0].type!="show" && cnxMaidOfMaid.length == 0);

                
                crud.stateTools[1].tools.find(t=>t.name=="insert").show=false;
                crud.stateTools[1].tools.find(t=>t.name=="cancel").show=false;
                crud.stateTools[1].tools.find(t=>t.name=="addLine").show=false;

                if(cnxMaidList[0].type!="show"){

                    crud.panels[0].fields.unshift({
                        ...fld_delete,
                    });
                }

                crud.panels[0].fields.forEach(field => {
                    
                    if(field.attributes == null) field.attributes = [];
                    field.attributes.push({name:"class",value:"m-0 py-0 pr-1 pl-0"});
                });
            }
        }
        
        //tableForm -> table - form (masterSelect,maidSelect)
        if(cnxMaidTbFm.length > 0 || cnxMasterTbFm.length > 0){

            if(cnxMasterTbFm.length > 0){

                crud.panels[0].fields.unshift({
                    ...fld_edit,name:editName,
                });

                var cnxMaidOfMaster = this.#conections.filter(cnx=>cnx.maidName == cnxMasterTbFm[0].masterName);
                crud.stateTools[0].tools.find(t=>t.name=="reload").show= cnxMaidOfMaster.length == 0;
                crud.stateTools[0].tools.find(t=>t.name=="new").show=crud.stateType!="show";
                crud.stateTools[0].tools.find(t=>t.name=="pages").show=true;
                crud.stateTools[0].tools.find(t=>t.name=="sizes").show=true;
                crud.stateTools[0].tools.find(t=>t.name=="sizes").value = 10;
                crud.newActive = false;               

                cnxMasterTbFm.forEach(cnx => {
                    
                    //boxUpdate
                    this.#crudAddActionEventToScript({
                        events:crud.events,
                        eventName:"boxUpdate",
                        action:({k,field,y})=>{

                            if(field.name==editName){

                                var maidCrud = u.crudGetBuild({crudName:cnx.maidName});
                                var value = k.Reload_GetData()[y][cnx.masterSelect];
                                
                                maidCrud.CrudJoins_Set({
                                    name:cnxName,
                                    field:cnx.maidSelect,
                                    value,
                                });

                                maidCrud.SetState({stateName:"reload"});
                            }
                        }
                    });

                    //tool new
                    this.#crudAddActionEventToScript({
                        events: crud.events,
                        eventName:"toolNewUpdate",
                        action:({k})=>{

                            var maidCrud = u.crudGetBuild({crudName:cnx.maidName});
                            var cnxOfMaid = u.#conections.filter(cnxu=>cnxu.masterName==cnx.maidName);
                            
                            if(cnxOfMaid.length > 0) k.Insert({});
                            else maidCrud.SetState({stateName:"new"});
                        }
                    });
                });

                if(!crud.panels[0].fields.find(f=>f.action=="delete") && crud.schema.delete == true){

                    crud.panels[0].fields.unshift({
                        ...fld_delete,
                    });
                }
                
            }
            
            if(cnxMaidTbFm.length > 0){
                
                crud.stateStart = "block";
                crud.afterCancel = "block";
                crud.afterInsert = "block";
                crud.stateTools[0].tools.find(t=>t.name=="reload").show=(cnxMaidTbFm[0].type != "show");
                crud.stateTools[0].tools.find(t=>t.name=="update").show=(cnxMaidTbFm[0].type != "show");
                crud.stateTools[0].tools.find(t=>t.name=="cancel").show=(cnxMaidTbFm[0].type != "show");

                cnxMaidTbFm.forEach(cnx => {
                    
                    //insert after
                    this.#crudAddActionEventToScript({
                        events: crud.events,
                        eventName:"insertAfter",
                        action:({k,field,value,resp})=>{

                            if(resp == true){

                                var masterCrud = u.crudGetBuild({crudName:cnx.masterName});
                                if(masterCrud.SelectPrimaryGet().field==cnx.masterSelect) masterCrud.SetState({stateName:"reload"});
                                else
                                {
                                    console.log("TABLE FORM INSERT NEW FORM FROM",crud.title);                                
                                    masterCrud.Insert({
                                        inserts:[{field,value,tipe:"value"}],
                                        success:()=>{
        
                                            masterCrud.SetState({stateName:"reload"});
                                        }
                                    });
                                }
                            }
                        }
                    });

                    //updateAfter
                    this.#crudAddActionEventToScript({
                        events: crud.events,
                        eventName:"updateAfter",
                        action:({})=>{
                            
                            if(crud.modalBuild && cnxMaid.length > 0){

                                crud.modalBuild.SetActive({active:false});
                                var masterCrud = u.crudGetBuild({crudName:cnx.masterName});
                                masterCrud.SetState({stateName:"reload"});
                            }
                        }
                    });
                });
            }
        }

        //formExtend -> form - form
        if(cnxMaidfmExt.length > 0 || cnxMasterfmExt.length > 0){

            if(cnxMasterfmExt.length > 0){

                crud.stateTools[0].tools.find(t=>t.name=="reload").show=true;
                crud.stateTools[0].tools.find(t=>t.name=="update").show=true;
                crud.stateTools[0].tools.find(t=>t.name=="new").show=true;
                crud.stateTools[0].tools.find(t=>t.name=="pages").show=true;

                cnxMasterfmExt.forEach(cnx => {
                   
                    //reloadBefore
                    this.#crudAddActionEventToScript({
                        events: crud.events,
                        eventName:"reloadAfter",
                        action:({k})=>{

                            var value = k.Reload_GetData()[0][cnx.masterSelect];
                            var crudMaid = u.crudGetBuild({crudName:cnx.maidName});
                            crudMaid.CrudJoins_Set({
                                name:cnxName,
                                field:cnx.maidSelect,
                                value,
                            });
                            crudMaid.SetState({stateName:"reload"});
                        }
                    });

                    this.#crudAddActionEventToScript({
                        events: crud.events,
                        eventName:"setStateAfter",
                        action:({stateName})=>{

                            var crudMaid = u.crudGetBuild({crudName:cnx.maidName});
                            crudMaid.SetState({stateName});
                        }
                    });
                });                
            }

            if(cnxMaidfmExt.length > 0){

                crud.stateTools[1].tools.find(t=>t.name=="insert").show=false;
                crud.stateTools[1].tools.find(t=>t.name=="cancel").show=false;
            }
        }

        //search (searchValue,masterSelect)
        if(cnxMasterSearch.length > 0){
            
            cnxMasterSearch.forEach(cnx => {
                
                this.#crudAddActionEventToScript({
                    events: crud.events,
                    eventName:"stateSetFirst",
                    action:({k})=>{

                        var pageData = PageRecive();
                        var searchValue = pageData ?  pageData[cnx.searchValue]: null;
                        if(searchValue){
    
                            u.#fromPage = pageData.from;
                            k.CrudJoins_Set({
                            name:"search-",
                            field:cnx.masterSelect,
                            value:searchValue,
                            });
                            k.SetState({stateName:"reload"});
                        }
                    }
                });

                this.#crudAddActionEventToScript({
                    events: crud.events,
                    eventName:"updateAfter",
                    action:({k})=>{

                        if(u.#fromPage) PageSend({url:u.#fromPage});
                    }
                });
            });
        }

        //sum (masterName,masterFieldValue, maidName,maidFieldValue)
        if(cnxMasterSum.length > 0 || cnxMaidSum.length > 0){

            if(cnxMaidSum.length > 0){

                cnxMaidSum.forEach(cnx => {
                    
                    this.#crudAddActionEventToScript({
                        events: crud.events,
                        eventName:"printAfter",
                        action:({k})=>{
    
                            var maidValues = k.bodyGet().fieldGetValues({fieldName:cnx.maidFieldName});
                            var sum = maidValues.reduce((acc,v)=>{return acc+parseFloat(v)},0);
                            
                            var crudMaster = u.crudGetBuild({crudName:cnx.masterName});
                            crudMaster.bodyGet().fieldSetValues({fieldName:cnx.masterFieldName,values:[sum]});
                            var masterField = crudMaster.bodyGet().fieldGet({fieldName:cnx.masterFieldName});

                            if(masterField.box.tipe==0){

                                var primary = crudMaster.Reload_GetPrimaryValues({})[0];
                                crudMaster.Update_AddChange({
                                    fieldName:cnx.masterFieldName,
                                    value:sum,
                                    primary,
                                });
                            };

                        }
                    })
                });
            }
        }
        
        return crud;
    }

    #crudAddActionEventToScript({events=[],eventName,action}){
        
        var event = events.find(e=>e.name==eventName);
        if(event == null){

            event = {name:eventName,actions:[]};
            events.push(event);
        }
        event.actions.push({action});
    }

    #crudGetValue({crudName,selectName,fieldName,y=0}){

        var value = null;

        var crudBuild = this.crudGetBuild({crudName});
        
        if(selectName){

            var data = crudBuild.Reload_GetData();
            value = data[y][selectName];
        }

        if(fieldName){

            var values = crudBuild.bodyGet().fieldGetValues({fieldName});
            value = values[y];
        }

        return value;
    }

    #crudConectToMaid({masterName,masterSelect,masterFieldName,y=0,maidName,maidSelect,maidState="reload"}){

        if(maidState == "new"){

            var maidCrudBuild = this.crudGetBuild({crudName:maidName});
            maidCrudBuild.SetState({stateName:"new"});
            return;
        }

        var cnxName = masterName + "-cnx-" + maidName;
        var masterValue = null;
        var masterCrudBuild = this.crudGetBuild({crudName:masterName});
        
        if(masterSelect){

            var data = masterCrudBuild.Reload_GetData();
            masterValue = data[y][masterSelect];
        }

        if(masterFieldName){

            var values = masterCrudBuild.bodyGet().fieldGetValues({fieldName:masterFieldName});
            masterValue = values[y];
        }

        if(masterValue){

            var maidCrudBuild = this.crudGetBuild({crudName:maidName});
            
            maidCrudBuild.CrudJoins_Set({
                name:cnxName,
                field:maidSelect,
                value:masterValue,
            });
            maidCrudBuild.SetState({stateName:"reload"});
        }
    }

    #crudSetParent({crud}){

        if(typeof crud.parent === "string"){

            var parentInfo = this.parentGet({parentName:crud.parent});
            var parentBuild = parentInfo ? parentInfo.build : this.#parent;
            var parent = parentInfo && parentInfo.conteiner ? parentInfo.conteiner : this.#parent;
            crud.parent = parent;

            if(crud.modal){

                var modalInfo = this.parentGet({parentName:crud.modal});
                crud.modalBuild = modalInfo.build;

            }else if(parentBuild instanceof Modal) crud.modalBuild = parentBuild;
        }
        
        return crud;
    }

    crudGetBuild({crudName}){

        return this.#cruds.find(crd=>crd.name==crudName).build;
    }

    CrudJoin({masterCrud,masterSelect,masterFieldValue,y=0,maidCrud,maidSelect}){

        var cr_master = this.crudGetBuild({crudName:masterCrud});
        var value = null;

        if(masterSelect!=null) cr_master.Reload_GetData()[y?y:0][masterSelect];
        if(masterFieldValue !=null){

           var field = cr_master.bodyGet().fieldsGet().find(f=>f.value==masterFieldValue);
           var values = cr_master.bodyGet().fieldGetValues({fieldName:field.name});
           
           if(values != null && values.length > 0) value = values[y?y:0];
        }

        var cr_join = this.crudGetBuild({crudName:maidCrud});
        if(value){

            cr_join.CrudJoins_Set({
                name:"cnx-"+masterCrud,
                field:maidSelect,
                value,
            });
            cr_join.SetState({stateName:"reload"});

        }
        else cr_join.SetState({stateName:"block"});
    }

    #crudGetValues({crudBuild,select,schema,fieldValue}){

        if(select) return crudBuild.Reload_GetData().map(rst=>{return rst[select]});

        if(fieldValue){

            var fsch = schema.fields.find(f=>f.value == fieldValue);
            return crudBuild.bodyGet().fieldGetValues({fieldName:fsch.name});
        }

        return [];
    }

    #schemaGetFieldName({schema,fieldValue}){

        return schema.fields.find(f=>f.value==fieldValue).name;
    }

    #layers = [];
    #parent = null;
    #layersBuild({parent,layers=[],userData}){

        this.#parent = parent;
        this.#layers = layers;

        for (let layer = 0; layer < this.#layers.length; layer++) {

            var layerInfo = this.#layers[layer];

            //------grid------------
            if(layerInfo.grid){

                layerInfo.grid.items = layerInfo.grid.items.filter(itm=>itm!=null);

                var gridScript = GetGridConfig({
                    panels:layerInfo.grid.items,
                    labels:layerInfo.grid.labels,
                });
                gridScript.parent = this.#parentGetConteiner({layerIndex:layer,parentName:layerInfo.grid.parent});
                if(layer == 0){

                    var attributes = [];
                    for (let y = 0; y < gridScript.cols.length; y++) {
                        
                        var row = gridScript.cols[y];
                        
                        for (let x = 0; x < row.length; x++) {
                            
                            var col = row[x];

                            attributes.push({
                                x,y,
                                attributes:[{
                                    name:"class",
                                    value:"col-12 col-md-"+col+" px-0 px-md-"+paddinForms+" pt-"+paddinForms +" pt-md-0"
                                }]
                            });    
                        }

                    }
                    gridScript.attributes = attributes;
                }
                
                layerInfo.grid.build = new Grid(gridScript);
        
                layerInfo.grid.items.forEach(item => {
                    
                    this.#parentAdd({
                        name:item.name,
                        build:layerInfo.grid.build,
                        conteiner:layerInfo.grid.build.GetColData({...item}).col,
                    });
                });
            }
        
            //-----modal----------
            if(layerInfo.modal){

                layerInfo.modal.build = new Modal({
                    size:layerInfo.modal.size,
                    parent:this.#parentGetConteiner({layerIndex:layer,parentName:layerInfo.modal.parent}),
                });

                this.#parentAdd({
                    name:layerInfo.modal.name,
                    build:layerInfo.modal.build,
                    conteiner:layerInfo.modal.build.GetContent(),
                });
            }

            //-----steps-------
            if(layerInfo.steps){

                layerInfo.steps.items = layerInfo.steps.items.filter(itm=>itm!=null);

                var steps = layerInfo.steps.items.map(itm=>{

                    return {
                        name:(itm.title?itm.title:itm.name),
                        window:{
                            name:itm.name,head:false,
                            grid:{
                                cols:[[12]],
                            }
                        }
                    }
                });

                layerInfo.steps.build = new Steps({
                    parent:this.#parentGetConteiner({layerIndex:layer,parentName:layerInfo.steps.parent}),
                    steps,
                });

                for (let itm = 0; itm < layerInfo.steps.items.length; itm++) {

                    var item = layerInfo.steps.items[itm];
                    this.#parentAdd({
                        name:item.name,
                        build:layerInfo.steps.build,
                        conteiner:layerInfo.steps.build.GetStep({stepIndex:itm}).window.Conteiner_GetColData({x:0,y:0}).col,
                    });
                }
            }

            //------crudBody-----
            if(layerInfo.crudBody){
                
                layerInfo.crudBody.parent = this.#parentGetConteiner({layerIndex:layer,parentName:layerInfo.crudBody.parent});
                var script = crudSetBySchema({crud:{...layerInfo.crudBody},userData});
                layerInfo.crudBody.build = new Crud_Body({...script});

                layerInfo.crudBody.build.fieldsGet().forEach(field => {
                    
                    if(field.action == "div"){

                        var fieldBoxs = layerInfo.crudBody.build.fieldGetBoxes({fieldName:field.name});
                        
                        this.#parentAdd({
                            name:field.name,
                            build:fieldBoxs[0],
                            conteiner:fieldBoxs[0].Blocks_Get()[0],
                        });
                        
                    }

                });

                this.#parentAdd({
                    name:layerInfo.crudBody.name,
                    build:layerInfo.crudBody.build,
                });
            }
            
            //------crud-----
            if(layerInfo.crud){

                this.#cruds.push(layerInfo.crud);
                
                var script = null;                
                script = crudSetBySchema({crud:layerInfo.crud,userData});
                script = this.#crudSetParent({crud:script});
                script = this.#crudSetByConections({userData,crud:script});
                
                layerInfo.crud.build = new Crud_Master(script);

                layerInfo.crud.build.bodyGet().fieldsGet().forEach(field => {
                    
                    if(field.action == "div"){

                        var fieldBoxs = layerInfo.crud.build.bodyGet().fieldGetBoxes({fieldName:field.name});
                        
                        this.#parentAdd({
                            name:field.name,
                            build:fieldBoxs[0],
                            conteiner:fieldBoxs[0].Blocks_Get()[0],
                        });
                        
                    }

                });

                this.#parentAdd({
                    name:layerInfo.crud.name,
                    build:layerInfo.crud.build,
                });
            }

            //------panel-------
            if(layerInfo.panel){

                var prnt = this.#parentGetConteiner({layerIndex:layer,parentName:layerInfo.panel.parent});
                
                layerInfo.panel.build = new Panel({
                    ...layerInfo.panel,
                    parent:prnt,
                });

                this.#parentAdd({
                    name:layerInfo.panel.name,
                    build:layerInfo.panel.build,
                });

                if(layerInfo.panel.tipe=="form"){

                    layerInfo.panel.build.fieldsGet().forEach(field => {
                    
                        if(field.action == "div"){
    
                            var fieldBoxs = layerInfo.panel.build.fieldGetBoxes({fieldName:field.name});
                            
                            this.#parentAdd({
                                name:field.name,
                                build:fieldBoxs[0],
                                conteiner:fieldBoxs[0].Blocks_Get()[0],
                            });
                            
                        }
    
                    });
                }
            }
            

        }
    }

    #parents = [];
    parentGet({parentName}){

        var parent = this.#parents.find(p=>p.name==parentName);
        if(parent == null) console.log("PARENT GET ",parentName, "RESULT IS NULL",parent,"LSIT",this.#parents);
        return parent;
    }
    #parentGetConteiner({layerIndex=0,parentName}){

        if(layerIndex == 0) return this.#parent;

        
        var parent = this.#parents.find(p=>p.name==parentName);
        if(parent==null) console.log("PARENT GET CONTEINER IN GROUP PANRENTNAME",parentName);
        
        var conteiner = parent.conteiner;
        
        return conteiner;
    }
    parentGetBuild({parentName}){

        var parent = this.parentGet({parentName});
        return parent.build;
    }
    #parentAdd({name,build,conteiner}){
        

        this.#parents.push({
            name,
            build,
            conteiner
        });
    }
}

