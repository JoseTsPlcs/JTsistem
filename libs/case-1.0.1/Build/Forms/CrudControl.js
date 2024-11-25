
class CrudControl extends ODD {

    constructor(i) {
        
        super(i);
        i._className="CrudControl";

        this.#conection = db_lip;
        this.#groupBuild(i);
        this.#brainBuild({});
        this.#dataSetsBuild(i);
        this.#Start({});
    }

    #conection = null;
    #group = null;
    #cruds = [
        {
            name:"cr-sale",
            schema:sch_sales,
            type:"1",
            body:null,
            brain:null,
        },
        {
            name:"cr-items",
            schema:sch_sales_products,
            type:"*",
            body:null,
            brain:null,
        },
    ];
    #cnx = [
        {
            main:"cr-sale",
            join:"cr-items",
        }
    ];
    #groupBuild({group}){

        let u = this;
        this.#group = new CrudsGroup({
            userData,pageData,
            layers:[
                {
                    grid:{
                        items:[
                            {name:"prnt-main",col:4},
                            {name:"prnt-items",col:8},
                        ],
                    }
                },
                {
                    crudBody:{
                        parent:"prnt-main",name:"cr-sale",
                        title:"venta",
                        schema:sch_sales,
                        panels:[
                            {
                                title:"main",tipe:"form",
                                fieldsSet:[
                                    {value:"emmit",state:"edit"},
                                    {value:"status",state:"edit"},
                                    {value:"pay",state:"edit"},
                                    {value:"customer",state:"edit"},
                                    {value:"doc",state:"edit"},
                                ],
                            }
                        ],
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"insert",show:true},
                                ],
                            },
                            {
                                name:"reload",
                                tools:[
                                    {name:"insert",show:true},
                                ],
                            }
                        ],
                        events:[{
                            name:"toolUpdate",
                            actions:[{
                                action:({tool})=>{

                                    if(tool.name=="insert") u.#groupEventInsert({crudName:"cr-sale"});
                                }
                            }]
                        }],
                    }
                },
                {
                    crudBody:{
                        parent:"prnt-items",title:"lista de productos",
                        schema:sch_sales_products,name:"cr-items",
                        panels:[
                            {
                                tipe:"table",
                                fields:[
                                    {...fld_delete},
                                ],
                                fieldsSet:[
                                    {value:"item",state:"edit",minWidth:300},
                                    {value:"cant",state:"edit"},
                                    {value:"priceUnit",state:"edit"},
                                    {value:"priceTotal",state:"edit"},
                                ],
                            }
                        ],
                        states:[
                            {
                                name:"new",
                                tools:[
                                    {name:"insert",show:true},
                                ],
                            },
                            {
                                name:"reload",
                                tools:[
                                    {name:"insert",show:true},
                                ],
                            }
                        ],
                        events:[{
                            name:"toolUpdate",
                            actions:[{
                                action:({tool})=>{

                                    if(tool.name=="insert") u.#groupEventInsert({crudName:"cr-items"});
                                }
                            }]
                        }],
                    }
                },
            ],
        });

        this.#cruds[0].body = this.#group.parentGetBuild({parentName:"cr-sale"});
        this.#cruds[1].body = this.#group.parentGetBuild({parentName:"cr-items"});
    }
    #groupEventInsert({crudName}){

        var cr = this.#cruds.find(cr=>cr.name==crudName);

        if(crudName=="cr-items"){

            cr.body.fieldsGet().forEach(f => {
                cr.body.fieldAction({type:"insert",name:f.name,value:f.box.value});
            });
            
        }

        if(crudName=="cr-sale"){

            this.#groupInsert({});
        }
    }

    #groupCrudRequest({crudName,type,success,primary}){

        var cr = this.#cruds.find(c=>c.name==crudName);
        var request = cr.body.requestGet({schema:cr.schema,type,primary});    
        
        this.#conection.Request({
            php:request.php,
            sql:request.sql,
            success:(result)=>{

                success({result});
            }
        });

    }

    #groupInsert({}){

        let k = this;
        this.#groupCrudRequest({
            type:"primary",
            crudName:"cr-sale",
            success:({result})=>{

                var salePrimaryNew = parseFloat(result[0]["MAX"]) + 1;
                k.#groupCrudRequest({
                    type:"insert",
                    crudName:"cr-sale",
                    primary:salePrimaryNew,
                    success:({result})=>{

                        k.#groupCrudRequest({
                            type:"insert",
                            crudName:"cr-items",
                            success:({})=>{

                                
                            }
                        });
                    }
                });
            }
        });
    }

    #dataSets = null;
    #dataSetsBuild({dataSets}){

        let u = this;
        this.#dataSets = new DataSets({
            dataSets,
            events:[
                {
                    name:"loaded",
                    actions:[{
                        action:({k})=>{
                            
                            u.#dataSetsLoaded({});
                        }
                    }]
                }
            ],
        });
    }

    #brainBuild({}){

        /*this.#cruds.forEach(cr => {
           
            cr.brain = new CrudBrain({
                crudBody:cr.body,
            });
        });*/
    }

    #Start({}){

        this.#dataSets.Load({});
    }

    #dataSetsLoaded({}){

        var dts = this.#dataSets.dataSetsGet();

        var cr_sale = this.#group.parentGetBuild({parentName:"cr-sale"});
        var cr_items = this.#group.parentGetBuild({parentName:"cr-items"});

        cr_sale.fieldsGet().forEach(f => {
            
            if(f.load!=null){

                var ld = dts.find(d=>d.name==f.load.name);
                if(ld) {

                    var options = ld.result.map(op=>{return {value:op["value"],show:op["show"]};});
                    cr_sale.fieldSetOptions({fieldName:f.name,options});
                }
            }
        });
        cr_items.fieldsGet().forEach(f => {
            
            if(f.load!=null){

                var ld = dts.find(d=>d.name==f.load.name);
                if(ld) {

                    var options = ld.result.map(op=>{return {value:op["value"],show:op["show"]};});
                    cr_items.fieldSetOptions({fieldName:f.name,options});
                }
            }
        });

        cr_sale.stateSet({stateName:"new"});
        cr_items.stateSet({stateName:"new"});
    }

    
}