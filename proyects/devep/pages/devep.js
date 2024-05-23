
class devep {

    constructor(i){

        this.#Build(i);
    }

    #steps = null;
    #Build({}){

        let k = this;

        this.#steps = new Steps({
            steps:[
                {
                    name:"paginas",
                    window:{grid:{cols:[[6,6]]}},
                },
                {
                    name:"cruds",
                    window:{grid:{cols:[[12]]}},
                },
            ],
        });
        
        this.#secc_lst = new List({
            parent:this.#steps.GetStep({stepName:"paginas"}).window.Conteiner_GetColData({x:0,y:0}).col,
            fields:[
                {name:"seccion",box:{tipe:1,class:"w-100"}},
            ],
            events:[
                {
                    name:"printAfter",
                    actions:[{
                        action:({})=>{
                            
                            //k.Seccion_Update();
                        }
                    }]
                }
            ],
        });
        
        this.#pags_lst = new List({
            parent:this.#steps.GetStep({stepName:"paginas"}).window.Conteiner_GetColData({x:1,y:0}).col,
            fields:[
                {name:"seccion",box:{tipe:3,class:"w-100"}},
                {name:"pagina",box:{tipe:1,class:"w-100"}},
            ],
        });

        this.#cruds_lst = new List({
            parent:this.#steps.GetStep({stepName:"cruds"}).window.Conteiner_GetColData({x:0,y:0}).col,
            fields:[
                //{name:"secc-pag",box:{tipe:3,class:"w-100"}},
                {name:"crudName",box:{tipe:1,class:"w-100"}},
                {name:"edit",box:{tipe:5,class:"btn btn-primary btn-sm",value:"[/]"}},
            ],
        });

        //-------print data-------

        
        this.#secc_lst.PrintData({
            data:[
                {fieldName:"seccion",values:["ventas","compras","contactos","inventario"]}
            ],
        });
        this.Seccion_Update();
        this.#pags_lst.PrintData({
            data:[
                {fieldName:"seccion",values:["ventas","ventas","compras","compras","contactos","contactos","inventario","inventario","inventario"]},
                {fieldName:"pagina",values:["nueva","control","nueva","control","clientes","proveedores","productos","precios","stock"]},
            ],
        });
        this.Paginas_Update();

        this.#cruds_lst.PrintData({
            data:[
                //{fieldName:"secc-pag",values:["ventas-nueva","ventas-control","compras-nueva"]},
                {fieldName:"crudName",values:["sales-new","sales-control","buy-new"]},
                {fieldName:"edit",values:["[/]","[/]","[/]"]},
            ],
        });
        
        
    }

    #secc_op = [];
    #secc_lst = null;
    Seccion_Update() {
            
        var values = this.#secc_lst.Field_GetValues({fieldName:"seccion"});
        this.#secc_op = values.map((v)=>{return {value:v,show:v}});
        this.#pags_lst.Field_SetOptions({fieldName:"seccion",options:this.#secc_op});
        this.#pags_lst.Field_SetDefault({fieldName:"seccion",value:this.#secc_op[0].value});
    }

    #pags_lst = null;
    #pags_op = [];
    Paginas_Update(){

        var values_secc = this.#pags_lst.Field_GetValues({fieldName:"seccion"});
        var values_pag = this.#pags_lst.Field_GetValues({fieldName:"pagina"});

        this.#pags_op = [];
        for (let op = 0; op < values_secc.length; op++) {
            
            var v_secc = values_secc[op];
            var v_pag = values_pag[op];
            var value = v_secc + "-" + v_pag;
            this.#pags_op.push({
                value,
                show:value,
            });            
        }
        
        //this.#cruds_lst.Field_SetOptions({fieldName:"secc-pag",options:this.#pags_op});
        //this.#cruds_lst.Field_SetDefault({fieldName:"secc-pag",value:this.#pags_op[0].value});
    }
    
    #cruds_lst = null;
}


new devep({

});