
class CrudControl extends ODD {

    constructor(i) {
        
        super(i);
        i._className="CrudControl";

        this.#conection = db_lip;

        this.#bodyBuild(i);
    }

    #conection = null;

    //-----body------

    #body = null;
    #bodyBuild(i){

        //set events in body to work in control
        let c = this;
        var controlBodyEvents = [
            {
                name:"boxUpdate",
                actions:[{
                    action:({field,y,value})=>{

                        c.#dataLogUpdate({fieldName:field.name,y,value});
                    }
                }]
            }
        ];

        //set script to body
        var bodyScript = this.#bodyScriptModify({
            scriptBase:i,
            events:controlBodyEvents
        });

        this.#body = new Crud_Body(bodyScript);

        this.#body.stateSet({stateName:i.stateStart?i.stateStart:"reload"});
    }

    #bodyScriptModify({scriptBase,events=[]}){

        var scriptModify = {...scriptBase};

        if(scriptModify.events == null) scriptModify.events = [];
        scriptModify.events = [...scriptModify.events,...events];

        return scriptModify;
    }

    //-----data------

    #data = {
        name:"main",
        primarys:[],
        log:[],
    };

    //-----data logs

    #dataLog({fieldName,primary,y,type,values}){

        if(y!=null) primary = this.#data.primarys[y];

        this.#data.log.push({
            field:fieldName,
            primary,
            type,
            values
        });

        console.log("data:",this.#data);        
    }

    #dataLogUpdate({fieldName,y,value}){

        this.#dataLog({
            fieldName,
            primary:this.#data.primarys[y],
            type:"update",
            values:[value],
        });
    }

    //-----data actions

    dataSet({fields=[],primarys=[]}){

        fields.forEach(fset => {
            
            this.#body.fieldSetValues({fset});
        });
        this.#data.primarys = primarys;
        this.#data.log = [];
    }

    dataInsert({fields}){

        var primaryNext = this.#data.primarys.length == 0 ? 1 : this.#data.primarys[this.#data.primarys.length-1] + 1;
        fields.forEach(fset=>{

            var values = this.#body.fieldGetValues({fieldName:fset.name});
            values = [...values, ...fset.values];
            this.#body.fieldSetValues({fieldName:fset.name,values});

            this.#data.primarys.push(primaryNext);

            this.#dataLog({
                fieldName:fset.name,
                primary:primaryNext,
                type:"insert",
                value:fset.values,
            });
            
            primaryNext++;

        });
    }

    dataUpdate({fieldName,value,y}){

        var values = this.#body.fieldGetValues({fieldName});
        values[y] = value;
        this.#body.fieldSetValues({fieldName,values});

        this.#dataLogUpdate({fieldName,value,y});
    }

    dataDelete({y}){

        var values = this.#body.fieldGetValues({fieldName});
        values.splice(y,1);
        this.#body.fieldSetValues({fieldName,values});

        this.#dataLog({
            fieldName:"all",
            primary:this.#data.primarys[y],
            type:"delete",
        });
    }
    
}