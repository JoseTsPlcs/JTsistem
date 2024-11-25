
class CrudBrain extends ODD {

    constructor(i) {
        
        super(i);
        this.#bodySet(i);
    }

    #body = null;
    #bodySet({crudBody}){

        this.#body = crudBody;
        this.#dataFields = this.#body.fieldsGet().map(f=>{return {name:f.name,data:[]}});
    }

    #dataFields = [];
    #actionsField = [];
    #actionsFieldAdd({fieldName,value,primary}){

        this.#actionsField.push({fieldName,value,primary});
    }
    //{type:"",fields:[]} -> fields:{name:"",value:1},

    #dataSet({data}){

        this.#dataFields.forEach(fd => {
            
            fd.data = [];
        });
        this.#actionsField = [];
    }

    //fields => {field:name, value:1}
    actionOneField({type,name,value}){
        
        switch (type) {

            case "insert":
                
                var values = this.#body.fieldGetValues({fieldName:name});
                values.push(value);
                this.#body.fieldSetValues({fieldName:name,values});

            break;
        }

       
    }

}