

class ConsCruds extends ODD {

    constructor(i){

        super(i);

        this.#SetVariables(i);
        this.#Build(i);

        //console.log("conections:",this.#conections);
        //console.log("cruds",this.#cruds);
    }

    #test=false;
    #SetVariables({cruds=[],conections=[],searchs=[],test=false}){

        this.#cruds = cruds;
        this.#conections=conections;
        this.#searchs=searchs;
        this.#test = test;

        for (let cn = 0; cn < this.#conections.length; cn++) {
            //const element = this.#conections[cn];
            this.#Conection_ModifyScript({conectionIndex:cn});
        }

        this.CallEvent({name:"mofifiedScipts"});

    }

    #Build({}){

        this.#Crud_Builds({});
    }

    //-------------------

    #conections = [
        {masterIndex:0,maidIndex:1,tipe:"fm-tb"},
    ];

    #Conection_ModifyScript({conectionIndex=0}){

        var conection = this.#conections[conectionIndex];

        var master = this.Crud_GetData({name:conection.master});
        var masterScript = master.script;
        var masterField = conection.masterField;

        var maid = this.Crud_GetData({name:conection.maid});
        var maidScript = maid.script;
        var maidField = conection.maidField;

        if(!master.active || !maid.active) return;
        //var maidBuild = maid.build;

        var tipe = conection.tipe;

        let c = this;
        switch (tipe) {
            case "fm-tb":
            
            this.#AddEventsToScript({
                script:masterScript,
                events:[
                    {
                        name:"reloadAfter",
                        actions:[
                            {
                                action:({k})=>{

                                    var data = k.Reload_GetData();
                                    if(data.length>0){

                                        var primary = data[0][masterField];
                                        var crMaid = c.Crud_GetBuild({name:conection.maid});
                                        //console.log(crMaid);
                                        if(crMaid){
                                            
                                            crMaid.CrudJoins_Set({
                                            field:maidField,
                                            value:primary,
                                            });
                                            crMaid.SetState({stateName:"reload"});
                                        }
                                    }
                                }
                            }
                        ],
                    },
                    {
                        name:"newAfter",
                        actions:[
                          {
                            action:({k})=>{
                              
                              var maidBuild = c.Crud_GetBuild({name:conection.maid});
                              if(maidBuild)maidBuild.SetState({stateName:"block"});

                              c.#ReturnToFrom({});
                            }
                          }
                        ],
                    },
                    {
                        name:"updateAfter",
                        actions:[
                          {
                            action:({k})=>{
                              
                              var maidBuild = c.Crud_GetBuild({name:conection.maid});
                              if(maidBuild)maidBuild.SetState({stateName:"block"});

                              c.#ReturnToFrom({});
                            }
                          }
                        ],
                    },
                    {
                        name:"insertAfter",
                        actions:[
                          {
                            action:({value,k})=>{
                  
                              k.CrudJoins_Set({field:maidField,value:value});
                              k.SetState({stateName:"reload"});
                            }
                          }
                        ],
                    },
                    {
                        name:"stateSetFirst",
                        actions:[
                          {
                            action:({k})=>{
                  
                              c.#Search_ByCrud({crudName:conection.master});
                            }
                          }
                        ],
                    },
                ],
            });

            break;

            case "tb-fm":

            masterScript.newActive = false;

            this.#AddEventsToScript({
                script:masterScript,
                events:[
                    {
                      name:"toolNewUpdate",
                      actions:[
                        {
                          action:({k})=>{
                            
                            var maidBuild = c.Crud_GetBuild({name:conection.maid});
                            //console.log("tb-fm: new", maidBuild);
                            if(maidBuild){
                                
                              //console.log("tb-fm -> maid new!",maidBuild);
                              maidBuild.SetState({stateName:"new"});
                            }
                          }
                        }
                      ],
                    },
                    {
                      name:"boxUpdate",
                      actions:[
                        {
                          action:({field,k,y})=>{
                
                            if(field.action=="edit"){
                
                              var data = k.Reload_GetData();
                              var maidBuild = c.Crud_GetBuild({name:conection.maid});
                              console.log("box update edit!!!!");

                              if(data.length>0){

                                var value = data[y][masterField];

                                console.log("tb-fm edit! -> value:",value,",fieldMaid:",maidField);
                                maidBuild.CrudJoins_Set({
                                    field:maidField,
                                    value,
                                });
                                maidBuild.SetState({stateName:"reload"});
                              }
                              
                            }
                          }
                        }
                      ],
                    },
                  ],
            });

            //maidScript.stateTools = stTls_fm_maid;
            //maidScript.stateStart="block";
            //maidScript.stateBase="block";

            this.#AddEventsToScript({
                script:maidScript,
                events:[
                    {
                        name:"blockAfter",
                        actions:[
                            {
                                action:({k,active})=>{

                                    if(active) k.CallEvent({name:"modalSetActive",params:{active:false}});
                                }
                            }
                        ],
                    },
                    {
                        name:"reloadBefore",
                        actions:[{
                            name:"tb-fm (maid) -> block",
                            action:({k})=>{

                                console.log("tb-fm (maid) reloadafter!!");
                                k.CallEvent({name:"modalSetActive",params:{active:true}});
                            }
                        }],
                    },
                    {
                        name:"newAfter",
                        actions:[
                            {
                                action:({k})=>{

                                    k.CallEvent({name:"modalSetActive",params:{active:true}});
                                }
                            }
                        ],
                    },
                    {
                        name:"updateAfter",
                        actions:[
                            {
                                action:({k})=>{

                                    var masteBuild = c.Crud_GetBuild({name:conection.master});
                                    masteBuild.SetState({stateName:"reload"});
                                }
                            }
                        ],
                    },
                    {
                        name:"insertAfter",
                        actions:[
                            {
                                action:({k,value})=>{

                                    var masterBuild = c.Crud_GetBuild({name:conection.master});
                                    if(masterBuild){

                                        masterBuild.Insert({
                                            inserts:[{
                                                field:masterField,
                                                value,
                                            }],
                                            success:()=>{

                                                masterBuild.SetState({stateName:"reload"});
                                            }
                                        });
                                    }
                                }
                            }
                        ],
                    }
                ],
            })

            break;

            case "tb-tb":

            this.#AddEventsToScript({
                script:masterScript,
                events:[
                    {
                        name:"boxUpdate",
                        actions:[{
                            action:({field,y,k})=>{

                                if(field.action=="edit"){

                                    var data = k.Reload_GetData();
                                    if(data && data.length>0){

                                        var value = data[y][masterField];
                                        var maidbuild = c.Crud_GetBuild({name:conection.maid});
                                        maidbuild.CrudJoins_Set({
                                            field:maidField,
                                            value,
                                        });
                                        maidbuild.SetState({stateName:"reload"});
                                    }
                                }                               
                            }
                        }]
                    },
                    {
                        name:"reloadAfter",
                        actions:[{
                            action:()=>{

                                var maidbuild = c.Crud_GetBuild({name:conection.maid});
                                maidbuild.SetState({stateName:"block"});
                            }
                        }],
                    },
                    {
                        name:"newAfter",
                        actions:[{
                            action:()=>{

                                var maidbuild = c.Crud_GetBuild({name:conection.maid});
                                maidbuild.SetState({stateName:"block"});
                            }
                        }],
                    }
                ],
            });

            maidScript.stateTools=stTls_tb_maid;
            maidScript.stateStart="block";

            break;

            case "fm-fm":

            this.#AddEventsToScript({
                script:masterScript,
                events:[
                    {
                        name:"boxUpdate",
                        actions:[{
                            action:({field,y,k})=>{

                                var maidbuild = c.Crud_GetBuild({name:conection.maid});

                                if(field.action=="edit"){

                                    var fieldValue = k.GetValue({fieldName:masterField,y:0});
                                    if(fieldValue){

                                        maidbuild.CrudJoins_Set({
                                            field:maidField,
                                            value:fieldValue,
                                        });
                                        maidbuild.SetState({stateName:"reload"});
                                    }
                                }    
                                
                                if(field.action=="add"){

                                    maidbuild.SetState({stateName:"new"});
                                }
                            }
                        }]
                    },
                ],
            });

            //-----maid--------

            this.#AddEventsToScript({
                script:maidScript,
                events:[
                    {
                        name:"updateAfter",
                        actions:[{
                            action:({k})=>{

                                k.SetState({stateName:"block"});
                                var masterBuild = c.Crud_GetBuild({name:conection.master});
                                masterBuild.Load_Reset({});                        
                            }
                        }]
                    },
                    {
                        name:"insertAfter",
                        actions:[{
                            action:({k,value})=>{

                                var masterBuild = c.Crud_GetBuild({name:conection.master});
                                masterBuild.Load_Reset({
                                    success:()=>{

                                        masterBuild.SetValuesToBox({values:[value],fieldName:masterField});
                                    }
                                });  
                            }
                        }]
                    },
                    {
                        name:"reloadBefore",
                        actions:[{
                            action:({k,value})=>{

                                k.CallEvent({name:"modalSetActive",params:{active:true}}); 
                            }
                        }]
                    },
                    {
                        name:"blockAfter",
                        actions:[{
                            action:({k,value})=>{

                                k.CallEvent({name:"modalSetActive",params:{active:false}}); 
                            }
                        }]
                    },
                    {
                        name:"newAfter",
                        actions:[{
                            action:({k,value})=>{

                                k.CallEvent({name:"modalSetActive",params:{active:true}}); 
                            }
                        }]
                    },
                ],
            });

            break;
        }

        //console.log(this.GetListEvents());
        this.CallEvent({name:"modifyScript",params:{conection,master,masterScript,maid,maidScript}});
    }

    //----------------

    #cruds = [
        {name:"",script:"",build:null},
    ];

    Crud_GetData({name}){
        
        var index = this.#cruds.findIndex(cr=>cr.name==name);
        return this.#cruds[index];
    }

    Crud_GetBuild({name}){

        var crud = this.Crud_GetData({name});
        return crud.build;
    }

    #Crud_Builds({}){

        let c = this;
        this.#cruds.forEach(crd => {

            if(crd.active){

                crd.build = new Crud_set({
                
                    ...crd.script,
                });
                //console.log(crd.script.title,":",crd.build.GetListEvents());
            }
        });
    }

    //--------------

    #searchs = [
        {crudName:"",fieldName:""},
    ];
    #from = null;

    #Search_ByCrud({crudName}){

        var search = this.#searchs.find(sch=>sch.crudName==crudName);
        var crud = this.#cruds.find(cr=>cr.name==crudName);
        var pageData = PageRecive();

        //console.log("crud "+crudName +" build is null:",crud.build == null);
        //console.log("crudName:",crudName,"crud:",crud,"pageData:",pageData);

        if(search && crud && pageData){

            var value = pageData[search.valueName];
            if(value){

                this.#from = pageData.from;
                var build = this.Crud_GetBuild({name:crud.name});

                //console.log("value:",value,",build:",build);
                build.CrudJoins_Set({
                    field:search.fieldName,
                    value:value,
                });
                build.SetState({stateName:"reload"});
                //console.log(crudName,"reload");
            }
        }
    }

    #ReturnToFrom({}){

        if(this.#from !=null){

            PageSend({url:this.#from});
        }
    }

    //----------------

    #AddEventsToScript({script,events=[]}){

        var scr_events = script.events;
        if(scr_events == null) script.events = events;
        else{

            script.events = [
                ...scr_events,
                ...events
            ];
            //console.log(script.title,script.events);
        }
    }

    
}