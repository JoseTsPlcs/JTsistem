
class Panel extends ODD {


    constructor(i) {

        super(i);
        this._className = "Panel";

        this.#setVariables(i);
        this.#Build(i);
    }

    #tipe = "";
    tipeGet(){return this.#tipe;}

    #title = "";
    titleSet({title}){
        
        if(this.#build instanceof PanelBuild) this.#build.titleSet({title});
    }
    showGet(){

        return this.#tipe == "table" ? true : this.#build.Conteiner_isShow({});
    }

    #name = "";
    nameGet(){return this.#name;}

    #setVariables({tipe,name,title="panel",fields=[]}){

        this.#tipe = tipe;
        this.#name = name;
        this.#title = title;
        this.fieldsSet({fields});
    }


    _fields = [];
    fieldsSet({fields=[]}){

        for (let fld = 0; fld < fields.length; fld++) {
            
            var field = fields[fld];
            if(field.title == null) field.title = field.name;
            field.index = fld;
            field.panel = {
                name:this.#name,
                tipe:this.#tipe,
                build:null
            };
        }

        this._fields = fields;
    }
    fieldSetTitle({fieldName,title}){

        switch (this.#tipe) {
            case "table":
                this.#build.FieldSetTitle({fieldName,title});    
            break;
        
            default:
                break;
        }
    }
    fieldsGet(){return this._fields;}
    fieldGet({fieldName}){

        return this._fields.find(fld=>fld.name==fieldName);
    }
    fieldSetValues({fieldName,values=[]}){
        
        if(this.#build instanceof PanelBuild){

            var field = this.fieldGet({fieldName});
            this.#build.fieldSetValues({fieldName,values,boxNew:field.box});
        }

        switch (this.#tipe) {

            case "table":
                
                this.#build.Fields_SetValues({values,fieldName});
            break;
        
            case "form":
                
                var field = this.fieldGet({fieldName});
                if(field.action != "div" && field.action!="button"){

                    var boxs = this.fieldGetBoxes({fieldName});
                    boxs[0].Block({active:(values.length == 0)});
                    var value = values.length > 0 ? values[0] : field.box.value;
                    boxs[0].SetValue(value);
                }
               
            break;
        }

    }
    fieldGetBoxes({fieldName}){

        if(this.#build instanceof PanelBuild){

            return this.#build.fieldGetBoxes({fieldName});
        }

        var boxs = [];

        switch(this.#tipe){

            case "table":
                
                boxs = this.#build.Fields_GetBoxs({fieldName});
            break;

            case "form":
                
                var box = this.#build.Fields_GetBox({fieldName});
                boxs = box ? [box] : [];
            break;
        }

        return boxs;
    }
    fieldSetOptions({fieldName,options}){
        
        var field = this.fieldGet({fieldName});
        field.options = options;
        field.box.options = options;
        if(field.box.options) field.box.value = field.box.options[0].value;

        var lastValues = this.fieldGetValues({fieldName});
        var boxes = this.fieldGetBoxes({fieldName});
        
        this.LogAction({
            type:"fieldSetOptions",
            showNoLog:true,
            msg:{field,options},
        });
        
        for (let b = 0; b < boxes.length; b++) {

            const box = boxes[b];
            box.SetOptions(options);
            var setvalue = lastValues[b];
            if(!options.find(op=>op.value==setvalue)) setvalue = options[0].value;
            box.SetValue(setvalue);
            
        }
    }
    fieldGetValues({fieldName}){

        return this.fieldGetBoxes({fieldName}).map(bx=>{return bx.GetValue();})
    }
    fieldGetDomTutorial({fieldName}){

        switch (this.#tipe) {
            case "table":
                  
            var field = this.fieldGet({fieldName});
            var boxes = this.fieldGetBoxes({fieldName});
            if(boxes.length == 0) return this.#build.fieldGet({fieldName}).th;

            if(field.box.tipe == 8) return boxes[boxes.length-1].parentGet();

            return boxes[boxes.length-1].Blocks_Get()[0];

            case "form":

            return this.#build.fieldGetLabel({fieldName}).parentGet();
        }
    }
    fieldGetTutorialElement({fieldName,recordName,last=true}){

        var dom = null;
        var field = this.fieldGet({fieldName});
        switch (this.#tipe) {
            case "table":
                var boxes = this.fieldGetBoxes({fieldName});
                if(boxes.length == 0) dom = this.#build.fieldGet({fieldName}).th;
                if(boxes.length>0 && field.box.tipe == 8) dom = boxes[(last?boxes.length-1:0)].parentGet();
                if(dom==null) dom = boxes[(last?boxes.length-1:0)].Blocks_Get()[0];
            break;

            case "form":
                dom = this.#build.fieldGetLabel({fieldName}).parentGet();
            break;
        }

        return {
            id:dom.id,
            descripcion:TutorialDescripcion({
                recordName,
                fieldName:field.title,
                descripcion:field.descripcion,
                boxTipe:field.box.tipe,
            }),
        }
    }

    #panelWindow = null;
    #panelConteiner = null;
    #build = null;
    buildGet(){return this.#build};

    #Build({parent,head=true,h,maxH,borderR=true,borderL=true,borderTop=true,borderBottom=true}){

        this.#panelConteiner = parent;
        let k = this;

        var events = [
            {
                name:"boxUpdate",
                actions:[
                    {
                        action:(params)=>{

                            params.k=k;                            
                            k.CallEvent({name:"boxUpdate",params});
                        }
                    }
                ],
            }
        ];
        

        switch (this.#tipe) {
            case "table":

                this.#build = new Table_Grid({
                    head:false,h,maxH,
                    parent:this.#panelConteiner,
                    fields:this._fields,
                    events,
                });
                
            break;
        
            case "form":
                
                this.#build = new Window({
                    head,h,borderR,borderL,borderTop,borderBottom,
                    title:this.#title,
                    parent:this.#panelConteiner,
                    fields:this._fields,
                    events,
                });
                
            break;

            case "kpi":

                this.#build = new PanelKpi({
                    parent,
                    title:this.#title,
                    fields:this._fields,
                });

            break;

            case "chart":
                
                this.#build = new PanelChart({
                    parent,
                    title:this.#title,
                    fields:this._fields,
                });

            break;
        }

        this._fields.forEach(f => {
            
            f.panel.build = this;
        });
    }

}