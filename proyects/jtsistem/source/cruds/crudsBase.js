

const schemaExample = {

    table:"",
    fieldPrimary:"",
    fields:[
        {
            name:"",with:100,
            select:"",access:true,
            edit:{box:{}},
            show:{box:{}},
            filter:{box:{}},
            descripcion:"",
            tipe:"active/options",
            options:[],
            load:null,
        }
    ],
    panels:[
        {tipe:"",title:""},
    ],
}

var fieldTypes = [
    {
        tipe:"active",
        edit:{box:{tipe:6}},
        show:{box:{...bx_shw}},
        filter:{box:{tipe:4}},
    },
    {
        tipe:"options",
        edit:{box:{tipe:3}},
        show:{box:{...bx_shw}},
        filter:{box:{tipe:4}},
    },
    {
        tipe:"optionsSearch",
        edit:{box:{tipe:8,class:"w-100"}},
        show:{box:{...bx_shw}},
        filter:{box:{...bx_input}},
    },
    {
        tipe:"date",
        edit:{box:{...bx_date}},
        show:{box:{...bx_shw}},
        //filter:{box:{...bx_date}},
    },
    {
        tipe:"show",
        edit:{box:{...bx_shw}},
        show:{box:{...bx_shw}},
        filter:{box:{...bx_input}},
    },
    {
        tipe:"money",
        edit:{box:{...bx_input}},
        show:{box:{...bx_money}},
    },
    {
        tipe:"input",
        edit:{box:{...bx_input}},
        show:{box:{...bx_shw}},
        filter:{box:{...bx_input}},
    },
    {
        tipe:"cant",
        edit:{box:{...bx_cant}},
        show:{box:{...bx_shw}},
    },
    {
        tipe:"comment",
        edit:{box:{tipe:9,value:""}},
        show:{box:{...bx_shw}},
    }
];

function scr_base({schema=null,userData,fieldsSet=[],stateGeneral="hide",parent,title=null,panelTipe="table",h=0,events=[]}) {

    schema.fields.forEach(field => {

        if(field.access != true) field.access = Access_Get(userData.access,field.access); 
        if(field.width == null) field.width = 100;
    });

    //set box by fieldType
    schema.fields.forEach(field => {

        var fieldTypeData = fieldTypes.find(f=>f.tipe==field.tipe);
        if(fieldTypeData){

            var options = field.options ? field.options : [];
            field.show = {box:{...fieldTypeData.show.box,options,name:field.name}};
            field.edit = {box:{...fieldTypeData.edit.box,options,name:field.name}};
            if(fieldTypeData.filter) field.filter = {box:{...fieldTypeData.filter.box,options}};
        }

    });
    

    //set state default, filter active
    schema.fields.forEach(act=>{

        act.state=stateGeneral;
        if(act.filter) act.filter.active = true;
    });

    //set state by fieldsSet
    var actives = [];
    if(fieldsSet.length>0){

        fieldsSet.forEach(fset => {
            
            //set state to field
            var actFound = schema.fields.find(act=>act.value==fset.value);
            if(actFound){

                if(actFound.filter && fset.filter){
                    if(fset.filter.active !=null) actFound.filter.active = fset.filter.active;
                    if(fset.filter.value !=null) actFound.filter.box.value = fset.filter.value;
                };
                if(fset.state != null) actFound.state = fset.state;
                if(actFound.access && actFound.state == "hide") actFound.access = false;
                if(fset.col != null) actFound.col = fset.col;
                if(fset.label != null) actFound.label = fset.label;
                if(fset.load != null) actFound.load = fset.load;
                
                //if(fset.value=="name")console.log("---------fasmdoaksmdasd",actFound);
                
                actives.push(actFound);
            }
            
        });
    };

    actives = [...actives.filter(fld=>fld.access == true && fld.state != "hide")];

    var condCompany = {
        table:schema.table,
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    };
    var insCompany = {
        field:"ID_COMPANY",
        value:userData.company.id,
    };

    var parentModalIs = parent instanceof Modal;
    var parentModalEvent = {
        name:"modalSetActive",
        actions:[{
            action:({active})=>{

                if(parent && parentModalIs) parent.SetActive({active});
            }
        }]
    };

    var panelMain = {title:"main",name:"main",head:false,tipe:panelTipe,h};

    var stateTools = [
        {
            name:"reload",
            tools:[
                {name:"sizes",show:(panelTipe=="table"?true:!parentModalIs),value:(panelTipe=="table"?10:1)},
                {name:"reload",show:true},
                {name:"new",show:!parentModalIs},
                {name:"pages",show:!parentModalIs},
                {name:"cancel",show:parentModalIs},
                {name:"update",show:panelTipe=="form"},
            ],
        },
        {
            name:"new",
            tools:[
                {name:"cancel",show:true},
                {name:"insert",show:true},
            ],
        }
    ];
    
    //-----filters------
    var filters = [];
    if(panelTipe == "table"){

        filters = actives.filter(act=>act.filter!=null && act.filter.active && act.filter.box!=null).map(act=>{

            return {
                name:act.name,
                select:act.select,
                box:act.filter.box,
                select:{table:(act.table?act.table:schema.table),field:act.select},
                descripcion:"buscar por " + act.descripcion,
                load:act.load?{name:act.load.name,value:"value",show:"show"}:null,
            }
        });
    }
    //------fields-----
    var fields = actives.map(act=>{

        
        var fld = {
            panel:"main",col:act.col,tipe:(act.label?act.label:1),
            name:act.name,
            select:act.select,
            box:{...(act.state=="edit"?act.edit.box:act.show.box)},
            descripcion:act.descripcion,
            attributes:(panelTipe=="table"?[{name:"style",value:"min-width: "+act.width+"px;"}]:null),
            load:(act.load?{name:act.load.name,value:"value",show:"show"}:null),
        }

        return fld;
    });
    panelMain.fields = fields;
    
    var panels = [panelMain];

    //---selects----
    var selects = actives.map(act=>{

        return {
            table:act.table?act.table:schema.table,
            field:act.select,
            sql:act.sql,
        }
    });
    selects.push({
        table:schema.table,
        field:schema.fieldPrimary,
        primary:true,
    });

    //----joins----
    var joins = [];
    actives.filter(act=>act.conection && act.conection.joins!=null).forEach(act=>{

        act.conection.joins.forEach(join => {
           
            if(join.tipe==null) join.tipe="LEFT";
            joins.push(join);
        });
    });

    //----loads---
    var loads = actives.filter(act=>act.load!=null).map(act=>{

        if(act.load.conditions==null) act.load.conditions = [];
        
        if(!act.load.conditions.find(cnd=>cnd.field=="ID_COMPANY")){

            act.load.conditions.push({
                ...condCompany,
                before:act.load.conditions.length>0?" AND (":"(",
                table:act.load.tableMain,
                after:")",
            });
        }
        return act.load;
    });

    if(parentModalIs) events.push(parentModalEvent);
    
    var script = {
        title,
        parent:(parentModalIs?parent.GetContent():parent),
        panels,
        stateStart:(parentModalIs && panelTipe=="form"?"block":"reload"),
        afterInsert:(parentModalIs && panelTipe=="form"?"block":"reload"),
        afterUpdate:(parentModalIs && panelTipe=="form"?"block":"reload"),
        afterCancel:(parentModalIs && panelTipe=="form"?"block":"reload"),
        stateTools,

        tableMain:schema.table,
        selects,
        inserts:(schema.company==false?[]:[insCompany]),
        conditions:[
            (schema.company==false?null:condCompany),
        ],
        joins,
        loads,

        filters,
        events,
    };
    
    return script;
}

function pageBuildCruds({userData,pageData}) {
    
    var pageBuildInfo = pages.find(pg=>pg.value==pageData.name);
    if(!pageBuildInfo) return;

    pageBuildInfo.parents = [];
    
    //build parent by layers
    for (let layerIndex = 0; layerIndex < pageBuildInfo.layers.length; layerIndex++) {

        var layerInfo = pageBuildInfo.layers[layerIndex];

        //------grid------------
        if(layerInfo.grid){

            layerInfo.grid.build = new Grid({
                parent:GetParentOfLayer({parentName:layerInfo.grid.parent}),
                ...GetGridConfig({
                    panels:layerInfo.grid.items,
                    labels:layerInfo.grid.labels,
                }),
            });
    
            layerInfo.grid.items.forEach(item => {
                
                AddParent({
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
                parent:GetParentOfLayer({parentName:layerInfo.modal.parent}),
            });

            AddParent({
                name:layerInfo.modal.name,
                build:layerInfo.modal.build,
                conteiner:layerInfo.modal.build.GetContent(),
            });
        }

        //-----steps-------
        if(layerInfo.steps){

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
                parent:GetParentOfLayer({parentName:layerInfo.steps.parent}),
                steps,
            });

            for (let itm = 0; itm < layerInfo.steps.items.length; itm++) {

                var item = layerInfo.steps.items[itm];
                AddParent({
                    name:item.name,
                    build:layerInfo.steps.build,
                    conteiner:layerInfo.steps.build.GetStep({stepIndex:itm}).window.Conteiner_GetColData({x:0,y:0}).col,
                });
            }
        }

        function AddParent({name,conteiner,build}) {
            

            pageBuildInfo.parents.push({
                name,
                conteiner,
                build,
            });
        }

        function GetParentOfLayer({parentName}) {
            var parent = pageData.body;
            
            if(layerIndex > 0){

                var parent = pageBuildInfo.parents.find(prnt=>prnt.name==parentName).conteiner;
            }
            

            return parent;
        }
        
    }

    //set recive if have a conection to crud && set parent
    pageBuildInfo.cruds.forEach(crd => {
        
        crd.parent = GetParentOfLayer({parentName:crd.parent});
        
        if(crd.conections){

            crd.conections.forEach(cnx => {
                
                var crdJoin = pageBuildInfo.cruds.find(crdJn=>crdJn.name==cnx.join.crud);
                if(crdJoin) crdJoin.recive = true;
            });
        }

    });

    //build crud
    pageBuildInfo.cruds.forEach(crd => {

        //set to fieldSet no filters if recive conection
        if(crd.fieldsSet && crd.recive == true){

            crd.fieldsSet.forEach(fset => { 
                fset.filter={active:false}
            });
            
        }

        var crudEdit = (crd.conections && crd.conections.find(cnx=>cnx.main.event=="edit"));
        
        //get script of cruds
        var script = {
            ...scr_base({
                ...crd,
                userData,
            }),
            stateStart:crd.stateStart,
            afterCancel:crd.afterCancel,
            stateTools:crd.statetools,
            newActive:!crudEdit,
        };

        if(crd.tableMain) script.panels = crd.panels;
        if(crd.selects) script.selects = crd.selects;
        if(crd.joins) script.joins = crd.joins;
        if(crd.panels) script.panels = crd.panels;
        if(crd.head == false) script.head = crd.head;
        

        //set delete
        if(crd.delete == true){
            script.panels[0].fields.unshift({
                ...fld_delete,
            });
        }

        //add events
        script.events = [];

        //by conections
        if(crd.conections){

            crd.conections.forEach(cnx=>{

                if(cnx.main.event=="edit"){

                    script.panels[0].fields.unshift({
                        ...fld_edit,
                    });
                }

                addEventToCrud({
                    crudScript:script,
                    eventName:"boxUpdate",
                    action:({field,y,k})=>{

                        if(field.name == "edit" && cnx.main.event=="edit"){
                                    
                            triggerConection({
                                crudTriggerBuild:k,
                                conection:cnx,y
                            });                                                                    
                        }
                    }
                });
      
                
                addEventToCrud({
                    crudScript:script,
                    eventName:"reloadAfter",
                    action:({k})=>{

                        if(cnx.main.event=="reload"){
                            
                                        
                            triggerConection({
                                crudTriggerBuild:k,
                                conection:cnx,y:0,
                            });

                            if(script.title=="orden de produccion") console.log("reloadAfter Event!!!!", k);
                        
                        }
                    }
                });

                addEventToCrud({
                    crudScript:script,
                    eventName:"reloadBefore",
                    action:({k})=>{

                        if(cnx.main.event=="reload"){

                            var crudJoin = pageBuildInfo.cruds.find(crdJn=>crdJn.name==cnx.join.crud);
                            if(crudJoin) crudJoin.build.SetState({stateName:"block"});
                        }
                    }
                });

                addEventToCrud({
                    crudScript:script,
                    eventName:"toolNewUpdate",
                    action:({k})=>{
                        
                        if(cnx.main.event=="edit"){

                            var crudJoinBuild = pageBuildInfo.cruds.find(cr=>cr.name==cnx.join.crud).build;
                            crudJoinBuild.SetState({stateName:"new"});
                        }
                    }
                });
            });
        }
        //by modal
        if(crd.modal){

            var md = pageBuildInfo.parents.find(prnt=>prnt.name==crd.modal).build;
            

            script.events.push({
                name:"modalSetActive",
                actions:[{
                    action:({active})=>{
                        
                        md.SetActive({active});
                    }
                }]
            });
            script.events.push({
                name:"blockAfter",
                actions:[{
                    action:({k})=>{

                        k.CallEvent({name:"modalSetActive",params:{active:false}});
                    }
                }]
            });
            script.events.push({
                name:"reloadBefore",
                actions:[{
                    action:({k})=>{
                        
                        k.CallEvent({name:"modalSetActive",params:{active:true}});
                    }
                }]
            });
            script.events.push({
                name:"newAfter",
                actions:[{
                    action:({k})=>{

                        k.CallEvent({name:"modalSetActive",params:{active:true}});
                    }
                }]
            });

        }

        

        //if(script.title=="receta") console.log("daskdmaskdkmas SCRIPT!!!-----",script);

        crd.build = new Crud_Master({...script});
    });


    function triggerConection({y,crudTriggerBuild,conection}) {
        
        var valuePrimary = crudTriggerBuild.Reload_GetData()[y][conection.main.select];
        var crudInfoJoin = pageBuildInfo.cruds.find(cu=>cu.name==conection.join.crud);
        
        if(crudInfoJoin){

            crudInfoJoin.build.CrudJoins_Set({
                name:"md-"+conection.join.crud,
                field:conection.join.select,
                value:valuePrimary,
            });
            crudInfoJoin.build.SetState({stateName:"reload"});
        }  
    }

    function addEventToCrud({crudScript,eventName,action}) {
        
        if(crudScript.events == null) crudScript.events = [];

        var eventInfo = crudScript.events.find(eventInfo=>eventInfo.name==eventName);
        
        if(eventInfo == null){
            
            crudScript.events.push({
                name:eventName,
                actions:[{action}],
            });
        }
        else{

            eventInfo.actions.push({action});      
        }

    }

}

class CrudsPage extends ODD {

    constructor(i) {
        
        super(i);
        this.#setVaribles(i);
        this.#Build(i);
    }

    #setVaribles({}){


    }

    #Build({userData,pageData}){

        
        var pageBuildInfo = pages.find(pg=>pg.value==pageData.name);
        if(!pageBuildInfo) return;

        pageBuildInfo.parents = [];
        
        this.#layersBuild({parent:pageData.body,layers:pageBuildInfo.layers});
        this.#crudsBuild({cruds:pageBuildInfo.cruds,userData});
    };

    #cruds=[];
    #crudsBuild({cruds=[],userData}){

        this.#cruds = cruds;
        this.#cruds.forEach(crud => {
            
            var script = this.#crudGetScript({...crud,userData});
            script.parent = this.#parentGetConteiner({layerIndex:999,parentName:crud.parent});
            console.log("GET SCRIPT OF CRUD ",crud, "SCRIPT:",script);
            
            crud.build = new Crud_Master(script);
        });
    }

    #crudGetScript({userData,title,head=true,schema,panels=[],statetools,conections=[]}){

        let u = this;

        var tableMain = schema.table;
        var selects = [
            {
                table:schema.table,
                field:schema.fieldPrimary,
                primary:true
            }
        ];
        var conditions = [];
        var loads = [];

        if(schema.company == true){

            conditions.push({
                table:schema.table,
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
            });
        }

        panels.forEach(panel => {

            if(panel.fieldsSet){

                panel.fields=[];
                panel.fieldsSet.forEach(fset => {
                    
                    var fsch = schema.fields.find(fsch=>fsch.value == fset.value);
                    var facc = fsch.access == true ? true : Access_Get(fsch.access);

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
                            loads.push(load);
                        }

                        //fields
                        var ftype = fieldTypes.find(ftype=>ftype.tipe==fsch.tipe);

                        var box = (fset.state == "show"? ftype.show.box: ftype.edit.box);
                        if(fsch.options) box.options = fsch.options;

                        panel.fields.push({
                            value:fsch.value,
                            name:fsch.name,
                            box:box,
                            select:fsch.select,
                            load:(load?{name:load.name,value:"value",show:"show"}:null),
                        });

                        //selects
                        selects.push({
                            table:schema.table,
                            field:fsch.select,
                        });

                        
                    }

                });
            }

        });

        var events = [];
        conections.forEach(cnx => {
            
            switch (cnx.main.event) {
                case "reload":

                    this.#crudAddActionEventToScript({
                        events,
                        eventName:"reloadAfter",
                        action:({k})=>{

                            var mainValues = u.#crudGetValues({
                                crudBuild:k,
                                select:cnx.main.select,
                                schema,
                                fieldValue:cnx.main.fieldValue,
                            });

                            switch (cnx.main.action) {
                                case "sum":
                                
                                    mainValues = [mainValues.reduce((acc,v)=>{return parseFloat(acc) + parseFloat(v)},0)];

                                break;
                            }                                                        

                            var crudBuild = cnx.join.crud ? u.#crudGetBuild({crudName:cnx.join.crud}) : k;

                            switch (cnx.join.action) {
                                case "join":
                                    
                                    crudBuild.CrudJoins_Set({
                                        name:"cnx-"+cnx.join.crud,
                                        field:cnx.join.select,
                                        value:mainValues[0],
                                    });
                                    crudBuild.SetState({stateName:"reload"});
                                break;

                                case "print":

                                    crudBuild.bodyGet().fieldSetValues({
                                        fieldName:cnx.join.fieldName,
                                        values:mainValues,
                                    });

                                break;
                            }

                            
                        }
                    });
                    
                break;
            
                case "fieldUpdate":

                    this.#crudAddActionEventToScript({
                        events,
                        eventName:"boxUpdate",
                        action:({k,field})=>{
                            
                            var mainfsch = schema.fields.find(fsch=>fsch.value==cnx.main.fieldValue);
                            if(mainfsch && field.name == mainfsch.name){

                                var mainvalues = k.bodyGet().fieldGetValues({fieldName:mainfsch.name});

                                switch (cnx.join.action) {
                                    case "loadPrint":
                                    
                                        var loadData = k.Loaded_GetLoadData({loadName:cnx.join.loadName});
                                        var loadResult = loadData.result;
                                        var loadRegistro = loadResult.find(rst=>rst.value == mainvalues[0]);

                                        cnx.join.fields.forEach(fprint => {

                                            var joinfsch = schema.fields.find(fsch=>fsch.value==fprint.value);
                                            var joinvalues = [loadRegistro[fprint.select]]; 
                                            k.bodyGet().fieldSetValues({fieldName:joinfsch.name,values:joinvalues});
                                        });                                                                         

                                    break;
                                }
                            }

                        }
                    })

                break;
            }

        });
        

        return {
            title,head,
            stateTools:statetools,
            panels,
            configShow:false,

            tableMain,
            selects,
            loads,
            events,
        }

    }

    #crudAddActionEventToScript({events,eventName,action}){
        
        var event = events.find(e=>e.name==eventName);
        if(event == null){

            event = {name:eventName,actions:[]};
            events.push(event);
        }
        event.actions.push({action});
    }

    #crudGetBuild({crudName}){

        return this.#cruds.find(crd=>crd.name==crudName).build;
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

    #layersBuild({parent,layers=[]}){

        this.#parent = parent;
        this.#layers = layers;

        for (let layer = 0; layer < this.#layers.length; layer++) {

            var layerInfo = this.#layers[layer];

            //------grid------------
            if(layerInfo.grid){

                var gridScript = GetGridConfig({
                    panels:layerInfo.grid.items,
                    labels:layerInfo.grid.labels,
                });
                gridScript.parent = this.#parentGetConteiner({layerIndex:layer,parentName:layerInfo.grid.parent});
                //console.log("LAYER BUILD GRID", gridScript);
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
            
        }
    }

    #parents = [];
    #parentGetConteiner({layerIndex=0,parentName}){

        if(layerIndex == 0) return this.#parent;

        var parent = this.#parents.find(p=>p.name==parentName);
        return parent.conteiner;
    }
    #parentAdd({name,build,conteiner}){

        this.#parents.push({
            name,
            build,
            conteiner
        });
    }
}
