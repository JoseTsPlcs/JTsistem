
class Filters extends ODD {

    #body = null;
    #filters_conections = [];

    constructor(i){

        super(i);
        this.Build({...i});

        this.AddEvents({events:[
            {name:'reload_before',actions:[]},
            {name:'reload_after',actions:[]},

            {name:'clear_before',actions:[]},
            {name:'clear_after',actions:[]},
        ]})
    }

    Build({parent=null,filters=[],h_min=100}){


        var cols = [];
        var labels = [];

        for (let f = 0; f < filters.length; f++) {
            const fi = filters[f];

            cols.push([12]);
            labels.push({
                x:0,y:f,
                ...fi,
            });

            const conect = fi.conection;
            if(conect != null){

                this.#filters_conections.push({
                    name:fi.name,
                    conection:conect,
                });
            }
        }

        this.#body = new Modulo({
            parent:parent,
            h_min:h_min,
            title:'filtros',
            grid:{
                cols:cols,
                labels:labels,
            },
            tools:[
                {x:1,y:3,name:'reload',box:{tipe:5,value:'Reload',class:'btn btn-primary'},action:()=>{this.#Reload()}},
                {x:1,y:3,name:'clear',box:{tipe:5,value:'Clear',class:'btn btn-danger'},action:()=>{this.#Clear()}},
            ],

        });
    }

    FilterGetBox({name=null}){

        if(name == null){
            
            this.LogAction({type:'error',msg:'need name of filter', msg1:this.#body});
            return;
        }

        const gd =  this.#body.Conteiner_Grid();
        const label = gd.GetLabel({name:name});

        if(label == null){

            this.LogAction({type:'error',msg:'sorry couldnt found label of filter ' + name, msg1:gd});
            return null;
        }

        return label.GetBox();
    }

    #Clear(){
        
        this.CallEvent({name:'clear_before',params:{}});

        const gd =  this.#body.Conteiner_Grid();
        const bxs = gd.GetAllBoxes();

        bxs.forEach(bx => {
            
            bx.SetDefault();
        });
        
        this.CallEvent({name:'clear_after',params:{}});
    }

    #Reload(){


        this.CallEvent({name:'reload_after',params:{
            
        }});
    }

    GetConditions({}={}){

        var conditions = [];

        this.#filters_conections.forEach(cnx => {
            
            var bx = this.FilterGetBox({name:cnx.name});
            if(bx != null){

                var v = bx.GetValue();
                var t = bx.GetTipe();
                var condition = {
                    and:true,
                    conditions:[],
                };

                //if is select multiple
                if(t == 4){

                    v.forEach(vi => {
            
                        condition.conditions.push({
                          and:false,
                          table:cnx.table,
                          field:cnx.field,
                          inter:cnx.inter,
                          value:vi,
                        });
                    });
            
                    cond.conditions.push({
                        and:false,
                        table:cnx.conection.table,
                        field:cnx.conection.field,
                        inter:'IS',
                        value:'NULL',
                    });

                }else{

                    condition.conditions.push({
                        and:false,
                        table:cnx.conection.table,
                        field:cnx.conection.field,
                        inter:cnx.conection.inter,
                        value:v,
                    });

                    if(t == 1 && v == ''){

                        cond.conditions.push({
                            and:false,
                            table:cnx.table,
                            field:cnx.field,
                            inter:'IS',
                            value:'NULL',
                        });
                    }
                }

                conditions.push(condition);

            }else this.LogAction({type:'error',msg:['could find box of filter', cnx]});
        });

        return conditions;
    }

}