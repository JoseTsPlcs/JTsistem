
class List extends ODD {


    constructor(i){

        super(i);
        this.#SetVariables(i);
        this.#Build(i);
        this.PrintData(i);
    }

    #field_delete = {
        name:"delete",
        box:{
            tipe:5,
            class:"btn btn-danger btn-sm text-white",
            value:"X",
        },
        action:"delete",
    };

    #SetVariables({fields=[]}){

        fields.unshift(this.#field_delete);
    }

    #grConteiner = null;
    #table = null;
    #Build({parent=null,h=0,fields=[],events=[]}){

        let k = this;
        this.#grConteiner = new Grid({
            parent,
            cols:[
                [12],
                [12],
            ],
            boxs:[
                {x:0,y:0,box:{id:"btn1",tipe:5,value:"add",class:"btn btn-primary btn-sm",update:()=>{this.AddLine({})}}},
            ],
        });
        this.#table = new Table_Grid({
            parent:this.#grConteiner.GetColData({x:0,y:1}).col,
            h,
            fields,
            events:[
                {
                    name:"boxUpdate",
                    actions:[{
                        action:(prm)=>{

                            //console.log("table boxupdate",prm);
                            k.#Events_BoxUpdate(prm);                        
                        }
                    }],
                },
                //...events,
            ],
        });

        
    }

    #Events_BoxUpdate(params){
        
        params.k=this;

        //console.log("list boxupdate",params);
        this.CallEvent({name:"boxUpdate",params});
        if(params.field.action=="delete") this.#Event_DeleteLine(params);
    }

    #Event_DeleteLine(params){

        this.DeleteLine(params);
    }

    #Event_AddLine(params){

        this.CallEvent({name:"addLine",params});
    }

    //-----------------

    PrintData({data=[]}){

        var maxLines = 0;
        data.forEach(line => {
            
            this.#table.Fields_SetValues({
                fieldName:line.fieldName,
                values:line.values,
            });

            if(line.values.length>maxLines)maxLines=line.values.length;
        });

        var dlt_values = [];
        for (let index = 0; index < maxLines; index++) {
            dlt_values.push(this.#field_delete.box.value);
        }
        this.#table.Fields_SetValues({
            fieldName:this.#field_delete.name,
            values:dlt_values,
        });

        this.CallEvent({name:"printAfter",params:{data}});
    }

    DeleteLine({y}){    

        var data = [];
        var fields = this.#table.Fields_GetAll();
        fields.forEach(field => {
                
            var values = this.#table.Fields_GetValues({fieldName:field.name});
            data.push({
                fieldName:field.name,
                values,
            });
        });

        //console.log("data:",data);

        data.forEach(line => {

            line.values.splice(y, 1);
            
            this.#table.Fields_SetValues({
                fieldName:line.fieldName,
                values:line.values,
            });
        });

    }

    AddLine({valuesNew=[]}){

        var fields = this.#table.Fields_GetAll();
        fields.forEach(field => {
                
            var values = this.#table.Fields_GetValues({fieldName:field.name});

            var valueNew = "";

            if(field.box && field.box.value) valueNew=field.box.value;

            values.push(valueNew);

            this.#table.Fields_SetValues({values,fieldName:field.name});
        });
        
        this.#Event_AddLine({});
    }

    Field_SetOptions({fieldName,options}){

        var fields = this.#table.Fields_GetAll();
        var field = fields.find(f=>f.name==fieldName);
        field.box.options = options;
        field.boxs.forEach(bx => {
            
            bx.SetOptions(options);
        });
    }

    Field_SetDefault({fieldName,value}){

        var fields = this.#table.Fields_GetAll();
        var field = fields.find(f=>f.name==fieldName);
        field.box.value = value;

        //console.log("fieldName:",fieldName,"field:",this.#table.Fields_GetAll());
    }

    Field_GetValues({fieldName}){

        return this.#table.Fields_GetValues({fieldName});
    }

    Fields_GetAll(){

        return this.#table.Fields_GetAll();
    }
    
    
}