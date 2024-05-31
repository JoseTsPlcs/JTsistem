

class windowFilters extends ODD {

    constructor(i){

        super(i);

        this.#SetVariables(i);
        this.#Build(i);
    }

    //------set variables

    #SetVariables({filters}){

        this.#filters = filters;
    }

    //-------filters

    #filters = [];
    Filter_Get({filterName}){

        return this.#filters.find(f=>f.name==filterName);
    }

    Filter_SetOptions({filterName,options,value}){

        var filter = this.Filter_Get({filterName});
        if(value == null){

            switch(filter.box.tipe){

                case 4:
                    value = options.map((op)=>{return op.show});
                break;

                case 3:
                    value = options[options.length-1].value;
                break;

                default:
                    value=filter.box.value;
                break;
            }
        } 
        var box = this.Filter_GetBox({filterName});
        box.SetOptions(options);
        box.SetValue(value);

        console.log("filterName:",filterName,"options:",options,"value:",value);
    }

    Filter_GetBox({filterName}){

        var filter = this.Filter_Get({filterName});
        //console.log("getbox:",filter);
        var colData = this.#window.Conteiner_GetColData({x:filter.x,y:filter.y});
        return colData.labels[0].GetBox();
    }

    Filters_Get(){

        return this.#filters;
    }

    //--------build

    #window = null;
    #Build({parent,title}){

        var windowConfig = GetGridConfig({panels:this.#filters});

        var content = new Grid({
            parent,
            cols:[
                [12],
                [12]
            ],
            boxs:[
                {x:0,y:1,box:{id:1,tipe:5,class:"btn btn-primary btn-sm",value:"recargar",update:()=>{this.#Reload()}}},
                {x:0,y:1,box:{id:2,tipe:5,class:"btn btn-primary btn-sm",value:"limpiar",update:()=>{this.#Clear()}}},
            ],
            attributes:[
                {y:1,x:0,attributes:[{name:"class",value:"d-flex justify-content-center align-items-center"}]},
            ],
        });

        this.#window = new Window({
            parent:content.GetColData({x:0,y:0}).col,
            h:0,
            title,
            grid:{
                cols:windowConfig.cols,
            },
            fields:windowConfig.panels,
            /*fields:[
                {col:12,y:0,name:"filter1",box:{tipe:1}},
            ],*/
            
        });
    }

    //-------

    #Reload(){

        this.CallEvent({name:"reload"});
    }

    #Clear(){

        this.CallEvent({name:"clear"});
    }

    //--------

    GetConditions() {
        
        var conditions = [];

        var filtersSlc = this.#filters.filter(f=>f.select!=null);
        var filterCount = filtersSlc.length;
        for (let f = 0; f < filterCount; f++) {

            const filter =filtersSlc[f];
            var select = filter.select;
            var tipe = select.tipe;
            var last = f == filterCount-1;
            var box = this.Filter_GetBox({filterName:filter.name});
            var values = box.GetValue();
            var existBefore = conditions.length > 0;
            //console.log(filter,values);       
            switch (filter.box.tipe) {
                case 4:

                    //values.push(0);
                    var valuesCount = values.length;
                    for (let v = 0; v < valuesCount; v++) {

                        const vi = values[v];
                        var first = v == 0;
                        var last = v == valuesCount-1;

                        conditions.push({
                            before:(first?((existBefore?" AND ":"") + " ("):""),
                            table:select.table,
                            field:select.field,
                            inter:"=",
                            value:vi,
                            after:(last?")":" OR "),
                        });
                    }                   
                    
                break;

                case 2:

                    conditions.push({
                        before:(existBefore?" AND ":""),
                        table:select.table,
                        field:select.field,
                        inter:(tipe=="min"?" >= ": " <="),
                        value:values,
                    });

                break;

                case 1:

                    conditions.push({
                        before:(existBefore?" AND (":"("),
                        table:select.table,
                        field:select.field,
                        inter:" LIKE ",
                        value:values,
                    });

                    conditions.push({
                        before:" OR ",
                        table:select.table,
                        field:select.field,
                        inter:" IS NULL",
                        after:")",
                        value:null,
                    });

                break;
            
                default:

                    conditions.push({
                        before:(existBefore?" AND ":""),
                        table:select.table,
                        field:select.field,
                        inter:"=",
                        value:values,
                    });

                break;
            }

        }

        //console.log("crud filter-----------",conditions);

        return conditions;

    }


}