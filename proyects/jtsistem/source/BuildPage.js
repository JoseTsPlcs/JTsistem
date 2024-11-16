
//------

class BuildPage extends ODD {

    constructor(i) {
        
        i.className = "buildPage";
        super(i);

        this.#Build(i);
    }

    #group = {
        script:{
            layers:[{
                grid:{
                    items:[
                        {name:"prnt-main",col:12},
                    ],
                },
            }],
            conections:[],
            groups:[],
        },
        build:null,
    }
    groupGet(){return this.#group.build;}

    #setCrudMain({mainCrud}){

        mainCrud.parent = "prnt-main";
        this.#group.script.layers.push({crud:mainCrud});
    }

    #addCrudToGrid({crud,modal=false}){

        var crudParentName = "";

        var parentName = "prnt-"+crud.name;
        crudParentName = parentName;
        this.#group.script.layers[0].grid.items.push({name:parentName,col:12});

        if(modal==true){

            var modalName = "md-"+crud.name;
            this.#group.script.layers.push({modal:{parent:parentName,name:modalName,size:"xl"}});
            crudParentName = modalName;
        }

        crud.parent = crudParentName;
        this.#group.script.layers.push({crud});
    }

    #setGroupScript(i){

        switch (i.type) {
            case "new":
                this.#setGroupScriptNew(i);
            break;
        
            case "control":
                this.#setGroupScriptControl(i);
            break;

            case "list":
                this.#setGroupScriptList(i);
            break;

            case "simple":
                this.#setGroupScriptSimple(i);
            break;

            case "free":
                this.#setGroupScriptFree(i);
            break;
        }
    }

    #setGroupScriptNew({schema,mainModVisual,mainTotalVisual,schemaItems,schemaPays,userData,payTag,mainFieldTotal,itemFieldTotal,mainFieldDscto=null,mainFieldTotalDscto=null,mainFieldPay=null,objectInfo}){
    

        let u = this;

        var acc_pay = Access_Get(userData.access,"md-box-general");
        var acc_add_item = (testNewSetAddItem ? testNewSetAddItemValue : Access_Get(userData.access,"md-items-sale-add"));
        if(testPay) acc_pay = testPaySet;

        //main crud
        var mainCrud = {
            title:schema.record.title,recordName:schema.record.title,head:false,
            parent:"prnt-main",schema,name:"cr-"+schema.record.name,
            loads:[],
            selects:[],
            panels:[
                {
                    tipe:"form",col:5,title:"informacion",
                    fields:[],
                    descripcion:"En esta sección se ingresa la información general de la "+schema.record.title,
                },
                {
                    tipe:"form",col:7,title:"detalle",h:0,
                    fields:[
                        {action:"div",name:"fld-conec",tipe:0,box:{tipe:0,class:"w-100 m-0 p-0"}},
                    ],
                    descripcion:"En esta sección se muestra los detalles de la " + schema.record.title,
                },
                {
                    tipe:"form",col:12,title:"total",
                    fields:[],
                    descripcion:"Muestra los detalles del monto de la "+schema.record.title,
                },
            ],
            states:[
                {
                    name:"reload",
                    tools:[
                        {name:"title",show:true,value:schema.record.title},
                        {name:"tutorial",show:true},
                        {name:"load",show:false},
                        {name:"update",show:true},
                        {name:"cancel",show:true},
                    ]
                },
                {
                    name:"block",
                    tools:[
                        {name:"title",show:true,value:schema.record.title},
                        {name:"tutorial",show:true},
                        {name:"insert",show:true},
                    ]
                },
            ],
            stateStart:(testNew?"reload":"block"),
            afterUpdate:"block",
            tutorials:[],
            events:[
                {
                    name:"tutorialGetElementsInfo",
                    actions:[{
                        action:({value,elementsInfo=[]})=>{

                            if(value=="use"){

                                var stepsBuild = u.#group.build.parentGet({parentName:"stps"}).build;
                                var stepsData = stepsBuild.stepsGet();

                                for (let stp = 0; stp < stepsData.length; stp++) {

                                    const stepInfo = stepsData[stp];
                                    elementsInfo.splice((2+stp+stp*1),0,{
                                        id:stepInfo.stepButton.Blocks_Get()[0].id,
                                        descripcion:stepInfo.descripcion,
                                        action:({element})=>{

                                            element.click();
                                        }
                                    });
                                    elementsInfo.splice((3+stp+stp*1),0,{
                                        id:stepInfo.conteinerDom.id,
                                        descripcion:(stp==0?"en esta seccion se muestra a detalle los items":"en esta seccion se muestra los pagos"),
                                        action:({element})=>{

                                            element.click();
                                        }
                                    });
                                }
                            }

                            return {elementsInfo};
                        }
                    }]
                },
                {
                    name:"tutorialEnd",
                    actions:[{
                        action:({value})=>{

                            if(value=="use"){

                                playTutorialToStep({stepName:"stp-items",crudName:"cr-items",descripcion:"se muestra el detalle de los items de la venta"});
                            }
                        }
                    }]
                }
            ],
        };
        mainCrud.panels[0].fields = mainModVisual.fields.map(fv=>{

            var fsch = schema.fields.find(fsch=>fsch.value==fv.value);
            if(getAccessOfField({fieldSchema:fsch,userData})){
                
                var bxstate = (acc_pay&&mainFieldPay==fv.value) ? "show" : fv.state;
                var info = getInfoByField({table:schema.table,f:fsch,userData,state:bxstate,box:fv.box});
                
                mainCrud.selects = [...mainCrud.selects,info.select];
                mainCrud.loads = [...mainCrud.loads,info.load];
                
                return info.field;
            }
            else return null;            
        }).filter(fv=>fv!=null);
        mainCrud.panels[2].fields = mainTotalVisual.fields.map(fv=>{

            var fsch = schema.fields.find(fsch=>fsch.value==fv.value);
            var info = getInfoByField({table:schema.table,f:fsch,userData,state:fv.state,box:fv.box});
            mainCrud.selects = [...mainCrud.selects,info.select];
            mainCrud.loads = [...mainCrud.loads,info.load];
            
            return info.field;
        });
        mainCrud.events = [
          {
            name:"boxUpdate",
            actions:[{
                action:({field})=>{

                    if(mainFieldDscto!=null&&field.name==mainFieldDscto)  CalculateTotal();
                }
            }]
          },
          {
            name:"setStateAfter",
            actions:[{
              action:({k,stateName})=>{

                var open = stateName!="block";
                k.bodyGet().panelsGet().forEach(panel => {

                    var build = panel.build.buildGet();
                    if(build instanceof Window){
                                                     
                        build.Conteiner_Show({show:open,slow:open,ignoreBlock:true});
                    }
                });
            }
            }]
          },
          {
            name:"tutorialInsertEnd",
            actions:[{
              action:({k})=>{

                k.tutorialPlay({value:"use"});
              }
            }]
          }
        ];

        //object
        if(objectInfo && Access_Get(userData.access,"md-vehicle-general")){

          //load
          var objLd = {...objectInfo.load};
          if(objectInfo.schema.company){

            if(objLd.conditions==null) objLd.conditions = [];
            objLd.conditions.push({
              before:(objLd.conditions.length>0?" AND ":""),
              table:objectInfo.schema.table,
              field:"ID_COMPANY",
              inter:"=",
              value:userData.company.id,
            });
          }
          mainCrud.loads.push(objLd);
          

          //field
          mainCrud.panels[0].fields.push({
            name:objectInfo.name,title:objectInfo.title,
            box:{tipe:8,class:"w-100"},
            load:{name:objLd.name,value:"value",show:"show"},
          });

          //mod
          var objCrud = {
            head:false,
            ...getCrudMult({
              schemaMain:objectInfo.schema,userData,tipe:"form",filters:false,
              fields:objectInfo.schema.fields.map(f=>{return {value:f.value,state:"edit"}}),
            }),
            states:[
              {
                name:"reload",
                tools:[
                  {name:"title",show:true,value:objectInfo.title},
                  {name:"tutorial",show:true},
                  {name:"update",show:true},
                  {name:"cancel",show:true},
                ],
              },
              {
                name:"new",
                tools:[
                  {name:"title",show:true,value:objectInfo.title},
                  {name:"tutorial",show:true},
                  {name:"insert",show:true},
                  {name:"cancel",show:true},
                ],
              },
            ],
          };
          this.#addCrudToGrid({
            crud:objCrud,
            modal:true,
          });
          this.#group.script.conections.push({
            event:"formForm",
            masterName:mainCrud.name,masterFieldName:objectInfo.name,
            masterSelect:"ID_ITEM",
            maidName:objCrud.name,
            maidSelect:objectInfo.schema.fieldPrimary,
          });

        }
        

        this.#setCrudMain({mainCrud});
        this.#group.script.conections.push({
            event:"search",masterName:mainCrud.name,
            masterSelect:schema.fieldPrimary,
            searchValue:schema.fieldPrimary,
        });
        
        //conections
        schema.fields.filter(f=>f.conect&& f.conect.type=="edit" && mainCrud.panels[0].fields.find(fc=>fc.name==f.value)).forEach(f => {
                        
            var crudConect = getCrudType({
                schema:f.conect.schema,tipe:"form",
                dependence:true,state:"edit",
                userData,modal:true,
                visualInfo:{fields:f.conect.schema.fields.map(f=>{return {value:f.value,state:(f.calculate?"show":"edit")};})},
            });
            
            this.#addCrudToGrid({
                modal:true,
                crud:crudConect
            });

            this.#group.script.conections.push({
                event:"formForm",
                masterFieldName:f.value,
                masterName:mainCrud.name,
                masterSelect:schema.fieldPrimary,
                maidName:crudConect.name,
                maidSelect:f.conect.schema.fieldPrimary,
            });
        });
        
        //steps
        this.#group.script.layers.push({
            steps:{
                name:"stps",
                parent:"fld-conec",
                items:[
                    {name:"stp-items",head:false,title:'<i class="bi bi-card-list"></i> items',descripcion:"selecciona para ver los items de la "+ schema.record.title,h:0},
                    (acc_pay?{name:"stp-pays",head:false,title:'<i class="bi bi-currency-dollar"></i> pagos',descripcion:"selecciona para ver los pagos realizados a la "+ schema.record.title,h:0}:null),
                ],
            }
        });
    
        //items
        this.#group.script.layers.push({
          grid:{
            parent:"stp-items",
            items:[
              (acc_add_item?{name:"prnt-new",col:3,name:"item-new",tipe:0,box:{tipe:5,value:"ingresar item",class:"btn btn-primary",update:()=>{u.#group.build.crudGetBuild({crudName:"cr-item"}).SetState({stateName:"new"})}}}:null),
              (acc_add_item?{name:"prnt-item-md",col:9,tipe:0,box:{tipe:0}}:null),
              {name:"prnt-items",col:12},
            ],
          }
        });
        

        var itemsCrud = getCrudType({
            schema:schemaItems,userData,
            visualInfo:{
              fields:schemaItems.fields.filter(f=>f.tipe!="key").map(f=>{return{value:f.value,state:"edit",line0:true}})
            },
            dependence:true,tipe:"table",state:"edit"
        });

        //sale-add
        if(acc_add_item){

          this.#group.script.groups.push({
            ...gp_item({
              parentName:"prnt-item-md",
              itemEvents:[
                {
                  name:"insertAfter",
                  actions:[{
                    action:({k})=>{

                      console.log("insert after block cr-item",k);
                      
                      //k.SetState({stateName:"block"});
                      u.#group.build.crudGetBuild({crudName:itemsCrud.name}).Load_Reset({});
                      //k.SetState({stateName:"new"});
                    }
                  }]
                },
                {
                  name:"updateAfter",
                  actions:[{
                    action:({k})=>{

                      u.#group.build.crudGetBuild({crudName:itemsCrud.name}).Load_Reset({});
                    }
                  }]
                }
              ],
            })
          });
          this.#group.script.conections.push({
            event:"cnx",masterAction:"edit",
            masterName:itemsCrud.name,
            masterSelect:"sales_products-ID_PRODUCT",
            maidName:"cr-item",
            maidSelect:"ID_PRODUCT",
          });
          
        }

        itemsCrud.line0 = true;
        itemsCrud.panels.forEach(pn=>{pn.fields.forEach(f=>{f.attributes=[{name:"class",value:"m-0 py-0 px-1"}]})});

        itemsCrud.parent = "prnt-items"; 
        itemsCrud.panels[0].h=600;
        itemsCrud.states.forEach(st=>{
            var toolInsert = st.tools.find(t=>t.name=="insert");
            var toolSizes = st.tools.find(t=>t.name=="sizes");

            if(toolInsert) toolInsert.value = '<i class="bi bi-plus-circle"></i> ingresar item';
            if(toolSizes) toolSizes.value=999;
            else st.tools.push({name:"sizes",value:999,show:true});
        });

        itemsCrud.events = [
            {
                name:"printAfter",
                actions:[{
                    action:()=>{CalculateTotal()}
                }]
            }
        ];

        this.#group.script.layers.push({crud:itemsCrud});
        this.#group.script.conections.push({
            event:"cnx",
            masterName:mainCrud.name,
            masterSelect:schema.fieldPrimary,
            maidName:itemsCrud.name,
            maidSelect:schema.fieldPrimary,
        });

        if(acc_pay){

            //pays
            this.#group.script.groups.push({
                ...gp_pays({
                    parent:"stp-pays",
                    masterTable:schemaPays.table,
                    masterFieldPrimary:schemaPays.fieldPrimary,
                    masterFieldJoin:schema.fieldPrimary,
                    sch_join:schemaPays,
                    masterCrud:mainCrud.name,
                    tagValue:payTag,
                    listEvents:[{
                        name:"printAfter",
                        actions:[{
                            action:()=>{

                                CalculateTotal();
                            }
                        }]
                    }],
                    formEvents:[{
                        name:"newAfter",
                        actions:[{
                            action:({k})=>{

                                var total = parseFloat(u.#group.build.crudGetBuild({crudName:mainCrud.name}).bodyGet().fieldGetValues({fieldName:mainFieldTotal})[0]);
                                var payTotal = CrudSum({crudName:"cr-list-pays",fieldName:"total"}).total;
                                var less = total - payTotal;
                                if(less < 0) less = 0;
                                less = parseFloat(less.toFixed(2));
                                k.bodyGet().fieldSetValues({fieldName:"total",values:[less]});
                            }
                        }]
                    }]
                }),
            });
        }    
        
        function CrudSum({crudName,fieldName}) {

            var crud = u.#group.build.crudGetBuild({crudName});
            var totals = crud.bodyGet().fieldGetValues({fieldName});
            var total = totals.reduce((acc,v)=>{return acc + parseFloat(v)},0);

            return {crud,total};
        }
        
        function CalculateTotal() {
            
            var crMain = u.#group.build.crudGetBuild({crudName:mainCrud.name});
            var crItems = u.#group.build.crudGetBuild({crudName:itemsCrud.name});

            var itemsTotals = crItems.bodyGet().fieldGetValues({fieldName:itemFieldTotal});
            var total = itemsTotals.reduce((acc,v)=>{return acc + parseFloat(v)},0);

            if(mainFieldTotalDscto!=null) {

                crMain.bodyGet().fieldSetValues({fieldName:mainFieldTotalDscto,values:[total]});
                crMain.Update_AddChangeField({fieldName:mainFieldTotalDscto,value:total,y:0});
            }

            if(mainFieldDscto!=null){

                var dscto = parseFloat(crMain.bodyGet().fieldGetValues({fieldName:mainFieldDscto})[0]);
                total = total * (1-dscto/100);
                total = parseFloat(total.toFixed(2));
            }
            
            crMain.bodyGet().fieldSetValues({fieldName:mainFieldTotal,values:[total]});
            crMain.Update_AddChangeField({fieldName:mainFieldTotal,value:total,y:0});

            if(acc_pay && mainFieldPay!=null){

                var crPays = u.#group.build.crudGetBuild({crudName:"cr-list-pays"});
                var paysTotals = crPays.bodyGet().fieldGetValues({fieldName:"total"});
                var totalPay = paysTotals.reduce((acc,v)=>{return acc + parseFloat(v)},0);

                var payState = totalPay == total ? 1 : 0;
                crMain.bodyGet().fieldSetValues({fieldName:mainFieldPay,values:[payState]});
                crMain.Update_AddChangeField({fieldName:mainFieldPay,value:payState,y:0});
            }

        }
    }

    #setGroupScriptControl({pageData,schema,mainControlVisual,mainDetailVisual,itemDetailVisual,schemaItems,userData,page,filters=[],fieldTotalName,eventPdf}){

        //main
        var mainCrud = getCrudType({
            schema,type:"control",
            userData,visualInfo:mainControlVisual,
            tipe:"table",state:"edit",dependence:false,fieldTotalName
        });
        mainCrud.title = pageData.title;
        mainCrud.states = [{
            name:"reload",
            tools:[
                {name:"reload",show:true},
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"sizes",show:false,value:999},
            ]
        }];
        this.#setCrudMain({mainCrud});
        this.#group.script.conections.push({
            event:"send",masterName:mainCrud.name,
            page,param:schema.fieldPrimary,
            select:schema.fieldPrimary,
        });
        //filters set value
        filters.forEach(flt => {
                    
            var fltcrud = mainCrud.filters.find(fltc=>fltc.name==flt.name);
            if(fltcrud) fltcrud.box.value = flt.value;
        });
        
        //detail
        var showCrud = getCrudType({
            schema,type:"show",visualInfo:mainDetailVisual,
            userData,visual:"control-detail",
            tipe:"form",state:"show",dependence:true,modal:true,
            eventPdf,
        });
        showCrud.events.push({
          name:"userData",
          actions:[{action:()=>{return userData;}}]
        });
        showCrud.events.push({
          name:"getGroupBuild",
          actions:[{action:()=>{return this.#group.build;}}]
        });

        this.#addCrudToGrid({crud:showCrud,modal:true});
        this.#group.script.conections.push({
            event:"cnx",masterAction:"show",
            masterName:mainCrud.name,
            masterSelect:schema.fieldPrimary,
            maidName:showCrud.name,
            maidSelect:schema.fieldPrimary,
        });

        
        //items
        showCrud.panels.push({
            tipe:"form",title:"conecciones",head:false,
            fields:[{
                name:"prnt-cnx0",tipe:0,action:"div",
                box:{tipe:0,class:"w-100 m-0 p-0"},
            }],
        });
        var itemsCrud = getCrudType({
            schema:schemaItems,visualInfo:itemDetailVisual,
            userData,visual:"detail-show",state:"show",
            tipe:"table",dependence:true
        });
        itemsCrud.parent = "prnt-cnx0";
        itemsCrud.panels[0].fields.forEach(f=>f.attributes=[{name:"class",value:"m-0 py-0 px-1"}/*,{name:"style",value:"min-width: 200px"}*/]);
        
        console.log(showCrud,itemsCrud);
        
        this.#group.script.layers.push({crud:itemsCrud});
        this.#group.script.conections.push({
            event:"cnx",type:"show",
            masterName:showCrud.name,
            masterSelect:schema.fieldPrimary,
            maidName:itemsCrud.name,
            maidSelect:schema.fieldPrimary
        });
        
    }

    #setGroupScriptList({schema,userData}){

        let u = this;

        var list = getCrudType({
            schema,userData,total:false,
            visual:"control",tipe:"table",
            state:"edit",dependence:false,
            visualInfo:{fields:schema.fields.filter(f=>f.tags&&f.tags.find(tg=>tg=="main")).map(f=>{return{value:f.value,state:"show"}})}
        });
        list.states = [{
            name:"reload",
            tools:[
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"sizes",value:10,show:true},
                {name:"pages",show:true},
                {name:"reload",show:true},
                {name:"new",show:true},
            ],
        }];
        list.tutorials=[{
          value:"insert-n",show:"¿como ingreso [registro]?",active:true,
          elementsInfo:({k})=>{

            return [{
              ...k.bodyGet().toolGetTutorialElement({toolName:"new"}),
              eventNext:()=>{

                k.bodyGet().toolGet({toolName:"new"}).dom.Blocks_Get()[0].click();
                console.log("use",u.#group.build.crudGetBuild({crudName:detail.name}));
                setTimeout(()=>{u.#group.build.crudGetBuild({crudName:detail.name}).tutorialPlay({value:"use"});},1000)
              }
            }]
          }
        }];

        this.#setCrudMain({
            mainCrud:list,
        });

        var detail = getCrudType({
            schema,userData,tipe:"form",
            visual:"detail-edit",state:"edit",
            dependence:true,modal:true,
            visualInfo:{fields:schema.fields.map(f=>{return{value:f.value,state:"edit"}})}
        });
        detail.afterUpdate = "block";
        detail.afterInsert = "block";

        this.#addCrudToGrid({
            modal:true,
            crud:detail,
        });

        this.#group.script.conections.push({
            event:"cnx",masterAction:"edit",
            masterName:list.name,masterSelect:schema.fieldPrimary,
            maidName: detail.name,maidSelect:schema.fieldPrimary,
        });
        this.#group.script.conections.push({
            event:"cnx",masterAction:"new",
            masterName:list.name,masterSelect:schema.fieldPrimary,
            maidName: detail.name,maidSelect:schema.fieldPrimary,
        });

    }

    #setGroupScriptSimple({schema,userData,simpleEvents=[]}){

        var simpleCrud = getCrudType({
            schema,userData,total:false,
            visual:"modulo",tipe:"table",
            state:"edit",dependence:false,
            visualInfo:{fields:schema.fields.map(f=>{return{value:f.value,state:"edit"}})}
        });
        simpleCrud.states = [{
            name:"reload",
            tools:[
                {name:"tutorial",show:true},
                {name:"config",show:true},
                {name:"reload",show:true},
                {name:"insert",show:true},
                {name:"pages",show:true},
                {name:"sizes",show:true,value:10},
            ]
        }]

        this.#setCrudMain({
            mainCrud:simpleCrud
        });

        if(simpleCrud.events==null) simpleCrud.events = [];
        simpleCrud.events = [...simpleCrud.events,...simpleEvents];
    }

    #setGroupScriptFree({script,layers,conections,groups,userData,pageData}){

        this.#group.script.layers = layers;
        this.#group.script.conections = conections;
        this.#group.script.groups = groups;

        if(script!=null){

            var scriptGet = script({userData,build:this,pageData});
            if(scriptGet !=null){

                this.#group.script.layers = scriptGet.layers;
                this.#group.script.conections = scriptGet.conections;
                this.#group.script.groups = scriptGet.groups;
            }
        }
    }

    #setCalculates({calculates=[]}){

        return;
        let u = this;
        var cruds = this.#group.script.layers.filter(ly=>ly.crud!=null).map(ly=>{return ly.crud;});
        this.#group.script.groups.forEach(gp => {
            
            gp.layers.filter(ly=>ly.crud!=null).forEach(ly=>{cruds.push(ly.crud);});
        });

        calculates.forEach(calc => {

            const eventAction = ({k})=>{

                console.log("trigger>---------"+calc.name+"------------");


                var total = 0;
                calc.actions.forEach(act => {
                    
                    var crudBuild = null;
                    if(act.crud){

                        crudBuild =  u.#group.build.crudGetBuild({crudName:act.crud});
                        if(!crudBuild) console.log("error no found crud " + act.crud, "cruds",cruds);
                    }

                    switch (act.cal) {
                        case "total":

                            if(crudBuild){

                                total = crudBuild.bodyGet().fieldGetValues({fieldName:act.field})[0];
                            }
                            else total = act.value;

                            
                        break;

                        case "sum":
                            var values = crudBuild.bodyGet().fieldGetValues({fieldName:act.field});
                            total = values.reduce((acc,v)=>{return acc+parseFloat(v)},0);
                        break;

                        case "dscto":
                            var dscto = crudBuild.bodyGet().fieldGetValues({fieldName:act.field})[0];
                            total = total * (1-parseFloat(dscto)/100);
                            total = parseFloat(total.toFixed(2));
                        break;

                        case "result":
                            
                            crudBuild.bodyGet().fieldSetValues({fieldName:act.field,values:[total]});
                            crudBuild.Update_AddChangeField({fieldName:act.field,value:total,y:0});

                        break;

                        case "comparate":
                            
                            var comparate = parseFloat(crudBuild.bodyGet().fieldGetValues({fieldName:act.field})[0]);
                            total = comparate==total ? 1 : 0;
                        break;
                    }

                    //console.log("total",total,"action",act.cal,"crud",act.crud,"field",act.field);
                });
            };
            
            calc.triggers.forEach(tg => {

                var eventName = tg.field!=null?"boxUpdate":"printAfter";

                var crudTrigger = cruds.find(cr=>cr.name==tg.crud);
                if(crudTrigger){

                    if(crudTrigger.events==null) crudTrigger.events = [];
                    crudTrigger.events.push({
                        name:eventName,
                        actions:[{action:eventAction}],
                    });
                }
                else console.log("error no found trigger crud " + tg.crud, cruds);
                
                
            });

        });
        
    }

    #Build(i){

      let k = this;
      let u = this;

      this.#setGroupScript(i);
      this.#setCalculates(i);

      //tutorial

      var mainCrudScript = this.#group.script.layers.filter(ly=>ly.crud!=null)[0].crud;
      
      var tutorialPlayed = false;
      const playTut = ()=>{

        if(!tutorialPlayed){

          PlayTutorialInPage({
            group:k.#group.build,
            pageData:i.pageData,
            crudName:mainCrudScript.name,
          });
          tutorialPlayed = true;
        }
      }

      if(mainCrudScript.stateStart == null || mainCrudScript.stateStart == "reload" || mainCrudScript.stateStart == "block"){

        console.log("play tutorial delay");
        
        if(mainCrudScript.events == null) mainCrudScript.events = [];
        mainCrudScript.events.push({
          name:mainCrudScript.stateStart=="block"?"blockAfter":"printAfter",
          actions:[{
            action:()=>{

              console.log("------play tutorial!!!");
              
              playTut();
            }
          }]
        });
      }
      else playTut();

      //tutorial - actions
      if(i.actionsActive==true){

        var conectionMasterMaid = this.#group.script.conections.find(cnx=>cnx.masterName==mainCrudScript.name);
        if(conectionMasterMaid.event=="cnx" && conectionMasterMaid.masterAction=="new"){

          if(mainCrudScript.events==null) mainCrudScript.events = [];
          mainCrudScript.events.push({
            name:"tutorialInsertEnd",
            actions:[{
              action:({})=>{

                setTimeout(()=>{

                  var maidCrudBuild = u.#group.build.crudGetBuild({crudName:conectionMasterMaid.maidName});
                  maidCrudBuild.tutorialPlay("insert");

                },1000);
              }
            }]
          });
        }

      }

      //------

      this.#group.build = new CrudsGroup({
          ...this.#group.script,
          ...i,parent:i.pageData.body,test,
      });
        
    }
}

function getInfoOfSchema({schema,userData,type="select"}) {

    var info = {
        name:"cr-"+schema.recordName,
        selects:[],
        fields:[],
        loads:[],
        joins:[],
        filters:[],
    };
    
    schema.fields.forEach(f=>{

        //selects
        var selectAs = schema.table+"-"+f.select;
        info.selects.push({
            table:schema.table,
            field:f.select,
            as:selectAs,
        });

        //conection -> load, join, select, field
        var loadName = null;
        if(f.conect!=null){

            switch (type) {
                case "select":                

                loadName = "ld-"+f.conect.schema.table;
                info.loads.push({
                    name:loadName,
                    tableMain:f.conect.schema.table,
                    selects:[
                        {table:f.conect.schema.table,field:f.conect.schema.fieldPrimary,as:"value"},
                        {table:f.conect.schema.table,field:f.conect.schema.fields.find(fld=>fld.detail=="main").select,as:"show"},
                    ],
                    conditions:[(f.conect.schema.company?{
                        table:f.conect.schema.table,
                        field:"ID_COMPANY",
                        inter:"=",
                        value:userData.company.id,
                    }:null)],
                });
                    
                break;
            
                case "join":

                //conect join
                var cntInfo = getInfoOfConection({
                    schemaMain:schema,
                    schemaJoin:f.conect.schema,
                });

                info.joins = [...info.joins,...cntInfo.joins];
                info.selects = [...info.selects,...cntInfo.selects];
                info.fields = [...info.fields,...cntInfo.fields];

                break;
            }

           

        }

        //fields
        info.fields.push({
            ...crudScriptGetField({field:f,box:fieldTypeGet({tipe:f.tipe}).edit.box}),
            select:selectAs,
            load:(loadName?{name:loadName,value:"value",show:"show"}:null),
            panelName:f.panel,
        });

        
    });

    return info;
}

function getCrudType({schema,userData,visualInfo=null,tipe="table",state="edit",dependence=false,modal=false,fieldTotalName=null,line0=false,eventPdf}) {

    var total = true;
    if(tipe=="form" || dependence==true) total = false;
    
    //var visualInfo = schema.visuals.find(v=>v.name==visual);
    if(!visualInfo) console.log("no found visual: "+visualInfo,"schema:",schema);
    

    var useFilters = tipe == "table" && dependence == false;
    var useTitleMain = dependence == false;
    
    var multipleRecords = tipe=="table";
    var title = visualInfo.title ? visualInfo.title : (multipleRecords?"lista de "+schema.record.title+"s":schema.record.title);
    var crud = {
        title,head:useTitleMain,
        name:"cr-"+schema.record.name+(multipleRecords?"s":""),
        tableMain:schema.table,
        selects:[{table:schema.table,field:schema.fieldPrimary,primary:true}],
        joins:[],
        loads:[],
        filters:[],
        panels:[],
        conditions:[],
        inserts:[],
        events:[],
    };

    var panelInfo = {tipe,title:"informacion",fields:[]};
    crud.panels.push(panelInfo);
    visualInfo.fields.forEach(fv => {
            
        var f = schema.fields.find(fsch=>fsch.value==fv.value);
        //get access
        if(getAccessOfField({fieldSchema:f,userData})){

            var fieldState = f.calculate == true ? "show" : fv.state;  
            if(f.value==fieldTotalName&&tipe=="table"&&dependence==false&&Access_Get(userData.access,"md-box-general")) fieldState = "show";
            
            var fieldInfo = getInfoByField({
                table:schema.table,f,
                state:fieldState,
                userData
            });  

            if((f.conect==null && fieldState == "show") || fieldState=="edit"){           

                panelInfo.fields.push(fieldInfo.field);
                crud.selects.push(fieldInfo.select);
                if(useFilters && fv.filter!=false) fieldInfo.filters.forEach(flt=>{crud.filters.push(flt);});
                if(fieldInfo.load) crud.loads.push(fieldInfo.load);
            }
            else
            {
                //return;
                var joinFound = crud.joins.find(jn=>jn.join.table==f.conect.schema.table);
                if(!joinFound){

                    crud.joins.push({
                        main:{table:schema.table,field:f.select},
                        join:{table:f.conect.schema.table,field:f.conect.schema.fieldPrimary},
                        tipe:"LEFT",
                    });
                }

                var panelOfModulo = panelInfo;
                //add panel
                if(tipe=="form"){

                    panelOfModulo = {tipe:"form",title:f.name,head:true,fields:[]};
                    crud.panels.push(panelOfModulo);
                    
                }
                
                if(tipe=="table"){

                    crud.selects.push(fieldInfo.select);
                    crud.loads.push(fieldInfo.load);
                    panelOfModulo.fields.push(fieldInfo.field);
                }
                
                f.conect.schema.fields.forEach(fv=>{

                    if(getAccessOfField({fieldSchema:fv,userData})){

                        var fieldInfo = getInfoByField({table:f.conect.schema.table,f:fv,userData});

                        if(tipe=="form" && fv.tags!=null && fv.tags.find(tg=>tg=="main")){
                            
                            fieldInfo.field.title = f.name +" " + fv.name;
                            crud.selects.push(fieldInfo.select);
                            panelOfModulo.fields.push(fieldInfo.field);
                        }
                        
                        if(useFilters && fv.tags!=null && fv.tags.find(tg=>tg=="main-flt")){

                            fieldInfo.filters.forEach(flt=>{
        
                                flt.title = f.name + " " + fv.name;
                                crud.filters.push(flt);
                            });
                        }
                    }
                });
            }
        }
        
    });

    //inserts
    if(schema.company){

        crud.inserts.push({
            table:schema.table,
            field:"ID_COMPANY",
            value:userData.company.id,
        });
    }

    //conditions
    if(schema.company){

        crud.conditions.push({
            table:schema.table,
            field:"ID_COMPANY",
            inter:"=",
            value:userData.company.id,
        });
    }

    crud.states = [
        {
            name:"reload",
            tools:[
                {name:"title",show:!useTitleMain,value:(!useTitleMain?crud.title:"")},
                {name:"tutorial",show:state=="edit"},
                {name:"config",show:useFilters},

                {name:"sizes",show:total,value:(total?999:(tipe=="table"?10:1))},
                {name:"pages",show:total},

                {name:"insert",show:(tipe=="table"&&state=="edit"&&dependence)},
                {name:"reload",show:useFilters},
                {name:"update",show:(dependence&&state=="edit"&&modal)},
                {name:"cancel",show:modal},
                {name:"pdf",show:eventPdf!=null},
            ],
        },
        {
            name:"new",
            tools:[
                {name:"title",show:!useTitleMain,value:(!useTitleMain?crud.title:"")},
                {name:"tutorial",show:state=="edit"},
                {name:"config",show:useFilters},

                {name:"sizes",show:false,value:999},

                {name:"insert",show:(dependence&&state=="edit")},
                {name:"cancel",show:modal},
            ],
        },
    ];
    if(crud.panels.length==1&&crud.panels[0].tipe=="form") crud.panels[0].head=false;

    if(eventPdf!=null){

      crud.events.push({
        name:"toolUpdate",
        actions:[{
          action:({k,tool})=>{

            if(tool.name=="pdf") eventPdf({k});
          }
        }]
      });
    }

    return crud;

}

function getAccessOfField({fieldSchema,userData}) {
    
    if(fieldSchema.access == null) return true;

    if(typeof fieldSchema.access === "boolean") return fieldSchema.access;

    return typeof fieldSchema.access === "string" && Access_Get(userData.access,fieldSchema.access);
}

function getInfoByTable({table,fields}) {
    
    var info = {
        selects:[],
        filters:[],
        fields:[],
        loads:[],
    };

    fields.forEach(f => {
        
        var fieldInfo = getInfoByField({table,f});
        info.selects.push(fieldInfo.select);
        info.fields.push(fieldInfo.field);
        fieldInfo.filters.forEach(flt => { info.filters.push(flt)}); 

    });    

    return info;
}

function getInfoByField({table,f,state="show",box=null,userData}) {
    
    //select
    var selectAs = table+"-"+f.select;
    var select = {
        table,
        field:f.select,
        as:selectAs,
    };
    
    //load
    var load = null;
    if(f.load&&f.load.schema){

        load = {...f.load};        
        if(load.schema.company){
            
            if(load.conditions==null) load.conditions = [];
            load.conditions.push({
                table:load.schema.table,
                field:"ID_COMPANY",
                inter:"=",value:userData.company.id,
            });
        }
    }

    //fields
    var ftype = fieldTypeGet({tipe:f.tipe});
    var boxField = box != null ? box : state == "show" ? ftype.show.box : ftype.edit.box;

    if(state=="edit" && f.states!=null&&f.states.edit!=null&&f.states.edit.access!=null&&!Access_Get(userData.access,f.states.edit.access)) state="show";

    var attributes = [];
    var minWidth = null;
    if(f.minWidth != null) minWidth = f.minWidth;
    if(minWidth) attributes.push({name:"style",value:"min-width:"+minWidth+"px;"});

    var maxWidth = null;
    if(f.maxWidth != null) maxWidth = f.maxWidth;
    if(maxWidth) attributes.push({name:"style",value:"max-width:"+maxWidth+"px;"});
    if(maxWidth) console.log("SET MAX WITH!!!!",f);
    

    var fieldBox = {...boxField,options:f.options};
    if(fieldBox.options!=null) fieldBox.value = fieldBox.options[0].value;

    var field = {
        name:f.value,title:f.name,
        box:{...fieldBox},
        select:selectAs,
        load:(load?{name:load.name,value:"value",show:"show"}:null),
        attributes,
        descripcion:f.descripcion,
    };

    //filter
    var filters = [];
    if(ftype.filter){

        filters.push({
            name:f.value,title:f.name,
            box:{...ftype.filter.box,options:f.options},
            select:{
                table,
                field:f.select,
            }
        });
    }
    if(f.tipe=="date"){

        filters.push({
            title:"fecha minima",name:f.value+"-min",
            box:{...bx_date_start},col:6,
            select:{
                table,
                field:f.select,
                tipe:"min",
            },
        });

        filters.push({
            title:"fecha maxima",name:f.value+"-max",
            box:{...bx_date_end},col:6,
            select:{
                table,
                field:f.select,
                tipe:"max",
            },
        });
    }

    return {select,field,filters,load};
}

function getGroupBySchema({parentName,schema,userData}) {
    
    var layers = [
        {
            grid:{
                parent:parentName,
                items:[],
            },
        }
    ];
    var conections = [];
    
    function addToGrid({crudScript,type="grid"}) {

        var gridName = "prnt-" + crudScript.name;
        layers[0].grid.items.push({name:gridName,col:12});

        var crudParentName = gridName;

        if(type=="modal"){

            var modalName = "md-" + crudScript.name;
            layers.push({modal:{parent:gridName,name:modalName,size:"xl"}});
            crudParentName = modalName;
        }
        
        crudScript.parent = crudParentName;
        layers.push({crud:{...crudScript}});
    }

    var mainCrud = getCrudType({schema,userData,type:"form"});
    addToGrid({crudScript:mainCrud,type:"grid"});
    

    //conections by field
    schema.fields.filter(f=>f.conect!=null).forEach(f=>{

        var cnxCrud = getCrudType({schema:f.conect.schema,userData,type:"form"});
        addToGrid({crudScript:cnxCrud,type:"modal"});

        conections.push({
            event:"formForm",masterFieldName:f.value,
            masterName:mainCrud.name,
            masterSelect:f.select,
            maidName:cnxCrud.name,
            maidSelect:f.conect.schema.fieldPrimary,
        });
    });

    //conections by schema
    schema.conections.forEach(cn=>{

        var cnCrud = getCrudType({schema:cn.schema,userData,type:"table"});
        addToGrid({crudScript:cnCrud});

        conections.push({
            event:"cnx",
            masterName:mainCrud.name,
            masterSelect:schema.fieldPrimary,
            maidName:cnCrud.name,
            maidSelect:schema.fieldPrimary,
        });
    });

    return {layers,conections}

}

//

function getCrudMult({schemaMain,fields,tipe="table",filters=true,userData,eventEnd}) {
  
  if(userData)console.log("ERROR IN CRUD MULT, no exist userData");
  

  var crud = {
    tableMain:schemaMain.table,
    selects:[{table:schemaMain.table,field:schemaMain.fieldPrimary,primary:true}],
    loads:[],
    joins:[],
    filters:[],
    panels:[{tipe:tipe,title:"informacion",head:false,fields:[]}],
    inserts:[(schemaMain.company?{table:schemaMain.table,field:"ID_COMPANY",value:userData.company.id}:null)],
    conditions:[(schemaMain.company?{table:schemaMain.table,field:"ID_COMPANY",inter:"=",value:userData.company.id}:null)]
  };

  fields.forEach(f => {
    
    if(f.type==null){

      var fsch = schemaMain.fields.find(fsch=>fsch.value==f.value);
      if(fsch==null) console.log("field "+f.value + " no found in schema",schemaMain.fields);
      
      var facc = (fsch.access !=null && typeof fsch.access === "string") ? Access_Get(userData.access,fsch.access) : true;
      if(facc){

        var sch_conect = fsch.conect ? fsch.conect.schema : null;

        //type of conect
        if(f.fields!=null){

          //join
          var joinExist = crud.joins.find(jn=>jn.join.table==sch_conect.table);
          if(!joinExist){

            crud.joins.push({
              main:{table:schemaMain.table,field:fsch.select},
              join:{table:sch_conect.table,field:sch_conect.fieldPrimary},
              tipe:"LEFT",
            });
          }

          f.fields.forEach(fcnx => {
            
            var fcnxsch = sch_conect.fields.find(f=>f.value==fcnx);
            var fcnxacc = typeof fcnxsch.access === "string" ? Access_Get(userData.access,fcnxsch.access) : true;
            if(fcnxacc){

              //select
              var selectAscnx = sch_conect.table + "-" + fcnxsch.select;
              crud.selects.push({
                table:sch_conect.table,
                field:fcnxsch.select,
                as:selectAscnx,
              });

              //fields
              var fcnxtype = fieldTypeGet({tipe:fsch.tipe});

              crud.panels[0].fields.push({
                name:fsch.value+"-"+fcnxsch.value,
                title:fsch.name+"-"+fcnxsch.name,
                box:{...fcnxtype.show.box},
                select:selectAscnx,
              });

              //filter
              if(filters && fcnxtype.filter){

                crud.filters.push({
                  name:fsch.value+"-"+fcnxsch.value,
                  title:fsch.name+"-"+fcnxsch.name,
                  box:{...fcnxtype.filter.box},
                  select:{
                    table:sch_conect.table,
                    field:fcnxsch.select,
                  }
                });
              }
              

            }

          });

        }
        else
        {

          //load
          var fld = null;
          if(f.load != null){

            fld = {...f.load};
            if(sch_conect.company){

              if(fld.conditions==null)fld.conditions=[];
              fld.conditions.push({
                before:(fld.conditions.length>0?" AND ":""),
                table:sch_conect.table,
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              });
            }
          }
          else
          {
            if(sch_conect!=null){

              var loadSelectShow = sch_conect.selectShow? sch_conect.selectShow :"NAME";
              fld = {
                name:"ld-"+sch_conect.table,
                tableMain:sch_conect.table,
                selects:[
                  {table:sch_conect.table,field:sch_conect.fieldPrimary,as:"value"},
                  {table:sch_conect.table,field:loadSelectShow,as:"show"},
                ],
                conditions:[(sch_conect.company?{
                  table:sch_conect.table,
                  field:"ID_COMPANY",
                  inter:"=",
                  value:userData.company.id,
                }:null)]
              }
            }
          }
          if(fld) crud.loads.push(fld); 

          //select
          var selectAs = schemaMain.table + "-" + fsch.select;
          crud.selects.push({
            table:schemaMain.table,
            field:fsch.select,
            as:selectAs,
          });

          //field
          var ftype = fieldTypeGet({tipe:fsch.tipe});

          fstate = f.state ? f.state : "show";
          var fbox = {...(fstate=="show"?ftype.show.box:ftype.edit.box)};
          if(fsch.options!=null){

            fbox.options = fsch.options;
            fbox.value = fbox.options[0].value;
          }
          crud.panels[0].fields.push({
            panel:f.panel,
            name:fsch.value,
            title:fsch.name,
            box:fbox,col:f.col?f.col:12,
            select:selectAs,
            attributes:f.attributes?f.attributes:[],
            load:(fld?{name:fld.name,show:"show",value:"value"}:null),
          });


          //filter
          if(filters && f.filter != false){

            var flts = [];
            if(ftype.filter){

              fltbx = {...ftype.filter.box};
              if(f.filter!=null&&f.filter.boxTipe!=null) fltbx.tipe = f.filter.boxTipe;
              if(fsch.options!=null) fltbx.options = fsch.options;

              flts.push({
                name:fsch.value,title:fsch.name,
                box:fltbx,
                select:{
                  table:schemaMain.table,
                  field:fsch.select,
                },
                load:(fld?{name:fld.name,show:"show",value:"value"}:null),
              });
            }
            if(fsch.value=="date"){

              flts.push({
                name:"min-"+fsch.value,title:"fecha minima "+fsch.name,
                box:{...bx_date_start},col:6,
                select:{
                  table:schemaMain.table,
                  field:fsch.select,
                  tipe:"min",
                },
              });

              flts.push({
                name:"max-"+fsch.value,title:"fecha maxima "+fsch.name,
                box:{...bx_date_end},col:6,
                select:{
                  table:schemaMain.table,
                  field:fsch.select,
                  tipe:"max",
                },
              });
            }

            flts.forEach(flt => {crud.filters.push(flt)});
            
          }

        }

      }
    }
    else
    {

      var ftype = {
        name:f.name,action:f.type,
        panel:f.panel,
        box:{},
      };

      switch (f.type) {
        case "div":

          ftype.tipe=2;
          ftype.box.tipe=0;
          ftype.box.class="w-100 p-0 m-0";

        break;
      }

      crud.panels[0].fields.push(ftype);
    }

  });

  if(eventEnd!=null){

    var cr = eventEnd({crud});    
    crud = cr;
  }

  return crud;

}