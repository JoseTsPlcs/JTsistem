

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
        tipe:"show",
        edit:{box:{...bx_shw}},
        show:{box:{...bx_shw}},
    },
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
        edit:{box:{...bx_input,value:0}},
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
        tipe:"porcent",
        edit:{box:{...bx_cant,value:0}},
        show:{box:{...bx_shw,format:{end:"%"}}},
    },
    {
        tipe:"comment",
        edit:{box:{tipe:9,value:""}},
        show:{box:{...bx_shw}},
    }
];

function scr_base({schema=null,userData,fieldsSet=[],stateGeneral="hide",parent,title=null,panelTipe="table",h=0,events=[]}) {

    schema.fields.forEach(field => {

        if(field.access != true){
            
            
            
            field.access = Access_Get(userData.access,field.access); 
        }
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

        act.state = stateGeneral;
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
        fields,
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

class pageBuild extends ODD {

    constructor(i) {
        
        super(i);
        this.#setVaribles(i);
        this.#Build(i);
    }

    #setVaribles({}){


    }

    #layers = [];
    #parent = null;
    #Build({parent,layers=[]}){

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
    };

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

function SetFields(crud) {
    
    

    return crud;
}



class CrudsPage extends ODD {

    constructor(i){

        this.#Build(i);
    }

    #Build({cruds=[],groups=[]}){

        

    }
}
