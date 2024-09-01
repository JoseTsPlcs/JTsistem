
class Panel extends ODD {


    constructor(i) {
        
        super(i);
        this.#setVariables(i);
        this.#Build(i);
    }

    #tipe = "";
    tipeGet(){return this.#tipe;}
    #title = "";
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
            field.index = fld;
            field.panel = {name:this.#name,build:null};
        }

        this._fields = fields;
    }
    fieldsGet(){return this._fields;}
    fieldGet({fieldName}){

        return this._fields.find(fld=>fld.name==fieldName);
    }
    fieldSetValues({fieldName,values=[]}){
        

        switch (this.#tipe) {

            case "table":
                
                this.#build.Fields_SetValues({values,fieldName});
            break;
        
            case "form":
                
                if(this.fieldGet({fieldName}).action != "div"){

                    var boxs = this.fieldGetBoxes({fieldName});
                    boxs[0].SetValue(values[0]);
                }
               
            break;
        }

    }
    fieldGetBoxes({fieldName}){

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
        
        var boxes = this.fieldGetBoxes({fieldName});

        boxes.forEach(box => {           
            
            box.SetOptions(options);
        });
    }
    fieldGetValues({fieldName}){

        return this.fieldGetBoxes({fieldName}).map(bx=>{return bx.GetValue();})
    }

    #panelWindow = null;
    #panelConteiner = null;
    #build = null;

    #Build({parent,head=true,h}){

        /*this.#panelWindow = new Window({
            parent,title:"title panel",h:0,
            head:false,blocked:true,
            grid:{
                cols:[[12]],
            }
        });

        this.#panelConteiner = this.#panelWindow.Conteiner_GetColData({x:0,y:0}).col;*/
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
                    head:false,h,
                    parent:this.#panelConteiner,
                    fields:this._fields,
                    events,
                });
                
            break;
        
            case "form":
                
                this.#build = new Window({
                    head,h,
                    title:this.#title,
                    parent:this.#panelConteiner,
                    fields:this._fields,
                    events,
                });
                
            break;
        }
    }

}