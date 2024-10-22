
class Panelv2 extends ODD {


    constructor(i) {
        
        super(i);
        this.#setVariables(i);
        this.#Build(i);
    }

    #tipe = "";
    tipeGet(){return this.#tipe;}

    #title = "";
    titleSet({title}){
        
        if(this.#build instanceof PanelBuild) this.#build.titleSet({title});
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

                this.#build.fieldSetValues({values,fieldName});

                /*var field = this.fieldGet({fieldName});
                if(field.action != "div"){

                    var boxs = this.fieldGetBoxes({fieldName});
                    boxs[0].Block({active:(values.length == 0)});
                    var value = values.length > 0 ? values[0] : field.box.value;
                    boxs[0].SetValue(value);
                }*/
               
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
        var boxes = this.fieldGetBoxes({fieldName});
        boxes.forEach(box => {           
            
            box.SetOptions(options);
            box.SetValue(options[0].value);
        });
    }
    fieldGetValues({fieldName}){

        return this.fieldGetBoxes({fieldName}).map(bx=>{return bx.GetValue();})
    }
    fieldGetDomTutorial({fieldName}){

        switch (this.#tipe) {
            case "table":
                  
            return this.#build.fieldGet({fieldName}).th;

            case "form":

            return this.#build.fieldGetLabel({fieldName}).parentGet();
        }
    }

    #panelWindow = null;
    #panelConteiner = null;

    #build = null;
    buildGet(){return this.#build};

    #Build({parent,head=true,h,maxH}){

        this.#panelConteiner = parent;
        let k = this;

        var events = [
            {
                name:"boxUpdate",
                actions:[
                    {
                        action:(params)=>{

                            params.k=k;
                            if(params.recordIndex==null) params.recordIndex = params.y;
                            
                            k.CallEvent({name:"boxUpdate",params});
                            //console.log("panel -> event: boxupdate -> params:",params);
                            
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
                
                /*this.#build = new Window({
                    head,h,
                    title:this.#title,
                    parent:this.#panelConteiner,
                    fields:this._fields,
                    events,
                });*/

                this.#build = new PanelCards({
                    head,h,
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

    }

}