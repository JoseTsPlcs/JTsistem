
class Config extends Form {

    constructor(i){

        i.title = "filtros";
        
        //console.log("filters-_constructor","params",i);
        super(i);
    }

    _General_GetParams(i){

        i.h=0;

        if(i.filters!=null){

            i.filters.forEach(filter => {
            
                filter.load = Param_GetLoad(filter.load);
                filter.sql = Param_GetSql(filter.sql);
            });
        }        

        //console.log("filters->general_gerparams->params; filters:",i.filters);
        
        var filtersWindow = {
            head:false,
            title:"window filter",
            blocked:true,
            h:0,
            fields:i.filters,
        };
        i.windows=[filtersWindow];

        i.tools=[
            {name:'reload',x:1,y:3,box:{tipe:5,value:'recargar',class:'btn btn-outline-primary btn-sm'}},
            {name:'clear',x:1,y:3,box:{tipe:5,value:'limpiar',class:'btn btn-outline-danger btn-sm'}},
        ];

        return super._General_GetParams(i);
    }

    Filters_GetValue({filterName,filterIndex}){

       return this.Window_Fields_GetValue({
            windowIndex:0,
            fieldName:filterName,
            fieldIndex:filterIndex,
       });
    }

    Filters_GetBox({filterName,filterIndex}){

        return this.Window_Fields_GetBox({
            windowIndex:0,
            fieldName:filterName,
            fieldIndex:filterIndex,
        });
    }

    Filter_GetAll(){
  
        var window = this.Window_GetWindow({windowIndex:0});
        return window.build.Fields_Get();
    }

    Filters_GetConditions(){

        var conditions = [];

        let k = this;
        var filters = this.Filter_GetAll();
        filters.forEach(filter => {
           
            var box = k.Filters_GetBox({filterName:filter.name});
            var value = box.GetValue();
            var sql = filter.sql;

            if(sql!=null){

                switch(box.GetTipe()){

                    case 1:
    
                    conditions.push({
                        and:true,
                        conditions:[
                            {
                                table:sql.table,
                                field:sql.field,
                                inter:"LIKE",
                                value:value,
                                and:false,
                            },
                            {
                                table:sql.table,
                                field:sql.field,
                                inter:"IS",
                                value:"NULL",
                            }
                        ],
                    });
                    
                    break;
            
                    case 4:
                    
                    var optionsConditions = {
                        and:true,
                        conditions:[],
                    };
                    value.forEach(v => {
                    
                        optionsConditions.conditions.push({
                            table:sql.table,
                            field:sql.field,
                            inter:"=",
                            value:v,
                            and:false,
                        });
                    });
                    conditions.push(optionsConditions);                     
    
                    break;
    
                    default:
    
                        conditions.push({
                            and:true,
                            conditions:[
                                {
                                    table:sql.table,
                                    field:sql.field,
                                    inter:(sql.inter?sql.inter:"="),
                                    value:value,
                                    and:false,
                                },
                            ],
                        });
    
                        break;
                }
            }          

            //console.log("config->filters_getconditions->foreach filters->params; filter:",filter,"box:",box);
        });

        //console.log("config->filters_getconditions->foreach filters->params; conditions:",conditions);
        return conditions;
    }

    
}