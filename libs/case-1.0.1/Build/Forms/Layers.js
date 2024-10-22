
class Layers extends ODD {

    constructor(i){

        super(i);        
        this.#conectionsSet(i);
        this.#layersSet(i);
        this.#layersBuild(i);
    }
    
    #conections = [];
    #conectionsSet({conections=[]}){this.#conections=conections.filter(cn=>cn!=null);}

    #layers = [];
    #layersSet({layers=[]}){

        this.#layers = layers.filter(ly=>ly!=null);
    }
    #layerIndex = 0;
    #layersBuild({userData}){

        this.#layerIndex = 0;
        let k = this;
        this.#layers.forEach(layer => {
            
            if(layer.grid != null) this.#layerBuildGrid({grid:layer.grid});
            if(layer.modal != null) this.#layerBuildModal({modal:layer.modal});
            if(layer.steps != null) this.#layerBuildSteps({steps:layer.steps});
            if(layer.crudBody != null) this.#layerBuildCrudBody({crudBody:layer.crudBody,userData});
            if(layer.crud != null) this.#layerBuildCrud({crud:layer.crud,userData});
            if(layer.panel != null) this.#layerBuildPanel({panel:layer.panel});
            
            k.#layerIndex++;
        });
    }

    #layerBuildGrid({grid}){

        grid.items = grid.items.filter(itm=>itm!=null);

        var gridScript = GetGridConfig({
            panels:grid.items,
            labels:grid.labels,
        });
        gridScript.parent = this.parentGetContent({parentName:grid.parent});
        if(this.#layerIndex == 0){

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

        grid.build = new Grid(gridScript);

        grid.items.forEach(item => {
            
            this.#parentAdd({
                name:item.name,
                build:grid.build,
                conteiner:grid.build.GetColData({...item}).col,
            });
        });
    }
    #layerBuildModal({modal}){

        modal.build = new Modal({
            size:modal.size,
            parent:this.parentGetContent({parentName:modal.parent}),
        });

        this.#parentAdd({
            name:modal.name,
            build:modal.build,
            conteiner:modal.build.GetContent(),
        });
    }
    #layerBuildCrudBody({crudBody,userData}){

        crudBody.parent = this.parentGetContent({parentName:crudBody.parent});
        var script = this.crudSetBySchema({crud:{...crudBody},userData});
        crudBody.build = new Crud_Body({...script});

        crudBody.build.fieldsGet().forEach(field => {
            
            if(field.action == "div"){

                var fieldBoxs = crudBody.build.fieldGetBoxes({fieldName:field.name});
                
                this.#parentAdd({
                    name:field.name,
                    build:fieldBoxs[0],
                    conteiner:fieldBoxs[0].Blocks_Get()[0],
                });
                
            }

        });

        this.#parentAdd({
            name:crudBody.name,
            build:crudBody.build,
        });

    }
    #layerBuildCrud({crud,userData}){

        crud.parent = this.parentGetContent({parentName:crud.parent});
        var script = this.crudSetBySchema({crud:{...crud},userData});
        script = this.crudByConections({crud:{...script},conections:this.#conections});
        crud.build = new Crud({...script});

        var body = crud.build.bodyGet();
        body.panelsGet().filter(p=>(p.fields==null||p.fields.length==0)&&p.build.tipeGet()=="form").forEach(p => {

            this.#parentAdd({
                name:p.name,
                build:p.build,
                conteiner:p.build.buildGet().windowGet().Conteiner_Dom(),
            });

        });

        this.#parentAdd({
            name:crud.name,
            build:crud.build,
        });

    }
    #layerBuildSteps({steps}){
        
        steps.items = steps.items.filter(itm=>itm!=null);

        var script = steps.items.map(itm=>{

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

        steps.build = new Steps({
            parent:this.parentGetContent({parentName:steps.parent}),
            steps:script,
        });

        for (let itm = 0; itm < steps.items.length; itm++) {

            var item = steps.items[itm];
            this.#parentAdd({
                name:item.name,
                build:steps.build,
                conteiner:steps.build.GetStep({stepIndex:itm}).window.Conteiner_GetColData({x:0,y:0}).col,
            });
        }
    }
    #layerBuildPanel({panel}){

        var script = {...panel};
        
        script.parent = this.parentGetContent({parentName:script.parent});

        panel.build = new Panel({...script});

        this.#parentAdd({
            name:panel.name,
            build:panel.build,
            conteiner:null,
        });
    }

    //-----crud----

    crudSetBySchema({crud,userData}) {

        if(crud == null) crud = {};
    
        if(crud.schema){

            if(crud.loads == null) crud.loads = [];
            if(crud.selects == null) crud.selects = [];
  
            //set fields && filters!!
            crud.panels.forEach(panel => {
                
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

                                //select add
                                crud.selects.push({
                                    table:schema.table,
                                    field:fsch.select,
                                });
                                
    
                                //get load
                                var loadRequest = fsch.load;                                
                                var loadField = (loadRequest?{name:loadRequest.name,value:"value",show:"show"}:null);
                                var fieldAdd = {
                                    tipe:fset.tipe?fset.tipe:1,
                                    value:fsch.value,
                                    name:fsch.value,
                                    title:fsch.name,
                                    box:{...box},
                                    select:fsch.select,
                                    load:loadField,
                                    attributes,
                                    col:fset.col,
                                }

                                //loads
                                if(loadRequest) crud.loads.push(loadRequest);
    
                                if(fset.position == null) panel.fields.push(fieldAdd);
                                else panel.fields.unshift(fieldAdd);
                            }
                        }                    
    
                    });
                }
    
            });
            
        }
        
        return crud;
    }

    crudByConections({crud,conections=[]}){

        var cnxMaster = conections.filter(cnx=>cnx.masterCrud == crud.name);
        var cnxMaid = conections.filter(cnx=>cnx.maidCrud == crud.name);
        
        let u = this;
        cnxMaster.forEach(cnx => {
            
            u.#crudAddEvent({
                crud,eventName:"insertAfter",
                action:({primaryNew})=>{

                    var maidCrudBuild = u.parentGetBuild({parentName:cnx.maidCrud});
                    maidCrudBuild.joinSet({
                        name:cnx.masterCrud+"-cnx-"+cnx.maidCrud,
                        select:cnx.maidSelect,
                        value:primaryNew,
                    });
                    maidCrudBuild.InsertEvent({});
                }
            });
        });
        //console.log("crud",crud);
        
        return crud;
    }

    #crudAddEvent({crud,eventName,action}){

        if(crud.events == null) crud.events = [];
        crud.events.push({
            name:eventName,
            actions:[{
                action,
            }],
        });
    }

    #parents = [];
    #parentAdd({name,build,conteiner}){

        this.#parents.push({
            name,
            build,conteiner,
        });
    }
    parentGet({parentName}){
        
        var parentInfo = this.#parents.find(p=>p.name==parentName);
        if(parentInfo == null) console.log("ERROR PARENT ",parentName," NO FOUN IN LIST",this.#parents); 
        return parentInfo;
    }
    parentGetBuild({parentName}){

        var parentInfo = this.parentGet({parentName});
        return parentInfo ? parentInfo.build : null;
    }
    parentGetContent({parentName}){

        if(this.#layerIndex == 0){
            
            return document.body;
        }

        return this.parentGet({parentName}).conteiner;
    }
}