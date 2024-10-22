

class PanelBuild extends ODD {


    constructor(i) {
        
        super(i);

        i.parent = this._BuildGetParent({parent:i.parent});
        
        this.titleSet(i);
        this.fieldsSet(i);
        this._Build(i);
    }

    _name = "namePanel";
    nameGet(){return this._name;}

    _type = "panel";
    typeGet(){return this._type;}

    _title = "paneBuild";
    title(){return this._title};
    titleSet({title}){ this._title = title;}

    _fields = [];
    fieldsSet({fields=[]}){

        for (let fld = 0; fld < fields.length; fld++) {
            
            var field = fields[fld];
            if(field.title == null) field.title = field.name;
            field.index = fld;
            field.panel = {name:this._name,build:this};
            if(field.box == null) field.box = {tipe:0};
        }

        this._fields = fields;
    }
    fieldsGet(){return this._fields;}
    fieldGet({fieldName}){

        return this._fields.find(fld=>fld.name==fieldName);
    }
    fieldSetValues({fieldName,values=[]}){
        
        var boxes = this.fieldGetBoxes({fieldName});
        
        for (let bx = 0; bx < boxes.length; bx++) {

            if(bx < values.length){

                var box = boxes[bx];
                box.SetValue(values[bx]);
            }            
        }

    }
    _fieldSetBoxes({fieldName,boxes=[]}){

        var field = this.fieldGet({fieldName});
        if(field) field.boxes = boxes;
    }
    fieldGetBoxes({fieldName}){

        var boxes = [];

        var field = this.fieldGet({fieldName});
        if(field && field.boxes) boxes = field.boxes;

        return boxes;
    }
    fieldSetOptions({fieldName,options}){
        
        var boxes = this.fieldGetBoxes({fieldName});

        boxes.forEach(box => {           
            
            box.SetOptions(options);
        });
    }
    fieldGetValues({fieldName}){

        return this.fieldGetBoxes({fieldName}).map(bx=>{return bx.GetValue();})
    }
    fieldSetTitle({fieldName,title}){

        var field = this.fieldGet({fieldName});
        if(field) field.title = title;
    }
    fieldRemove({fieldName,index}){

        this._fields.forEach(field => {
           
            var values = this.fieldGetValues({fieldName:field.name});
            values.splice(index,1);
            this.fieldSetValues({fieldName:field.name,values});
        });
    }
    fieldsSetValues({fields}){

        
    }


    _buildBlocks=[];
    _builded = false;
    _Build({parent}){

        if(parent == null) parent = document.body;
        this._Building({parent});
        this._Builded();
    }
    _Building({parent}){

        this.CallEvent({name:"building",params:{parent}});
    }
    _Builded(){

        this._builded = true;
    }
    _BuildUpdate(){}
    _BuildGetParent({parent}){

        return parent == null ? document.body: parent;
    }
    
}