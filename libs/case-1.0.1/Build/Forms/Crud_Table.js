
class Crud_Table extends Crud_Body {

    constructor(i){

        i.windows = [{
            title:"table conteiner",
            head:false,
        }];

        super(i);
        //console.log("crud_table->params; i:",i);

        this._Tools_OneSet({name:"sizes",value:10});

        this.#Table_Build({...i});
    }

    //------------print---------

    Print_BuildBoxes({data=[]}){

        this.#Table_SetLines({count:data.length});
        //console.log("crud_table->data->params; data:",data);
        super.Print_BuildBoxes({data});        
    }

    Clear({}={}){

        this.#Table_SetLines({count:1,boxUpdate:false});
    }

    Block({active}={}){

        if(active) this.#Table_SetLines({count:0,boxUpdate:false});
    }

    //------------fields-----------

    Fields_GetBoxes({fieldName,fieldIndex}){
        
        //super.Fields_GetBoxes({fieldName,fieldIndex});
        
        var indexHeader = this.#table.headers.findIndex(h=>h.name==fieldName);
        var boxes = [];

        if(indexHeader!=-1)boxes = this.#table.build.BoxesOfColum({x:indexHeader});

        //console.log("crud_table->fields_getboxes->params; fieldName:",fieldName,"headers:",this.#table.headers,"->results; indexHeader:",indexHeader,"boxes:",boxes);

        return boxes;
    }
    
    //------------table------------

    #table = {
        build:null,
        headers:[],
        fields:[],
    };

    #Table_Build({fields=[]}){

        this.#table.fields = fields;

        var x = 0;
        this.#table.headers = fields.map((field)=>{

            x++;
            return {    
                x:x-1,
                name:field.name,
                attributes:[{}],
            }
        });

        var window = this.Form_GetWindow({windowIndex:0});
        
        //console.log("crud_table->table_build->params; fields:",fields,"result; window:",window,"headers:",this.#table.headers);
        
        var parent = window.build.Conteiner_Dom();

        this.#table.build = new Table_Grid({
            parent,
            headers:this.#table.headers,
        });
    }

    #Table_SetLines({count=0,boxUpdate=true}){

        this.#table.build.Clear();
        let k = this;

        var newLines = [];
        for (let y = 0; y < count; y++) {

            var newLine = this.#table.fields.map((field)=>{

                var box = {...field.box};
                box.update = (value)=>{

                    if(boxUpdate){

                        if(box.tipe != 5 && box.tipe != 0){

                            k._FieldsUpdate_Add({
                                fieldIndex:field.index,
                                value,
                                y,
                            });
                            k._head.Update_Action();
                        }  
                        
                        if(field.action == "delete"){

                            k._head.Delete_Action({y});
                        }
                    };                   

                    k.CallEvent({name:"boxUpdate",params:{value,field,y}});
                };

                return {box:{...box}};
            });

            newLines.push(newLine);
        };
        this.#table.build.AddLines({lines:newLines});

        //console.log("crud_table->table_setlines->count:",count);
        this._head.Loads_SetLoadsToFields();
    }
    
}