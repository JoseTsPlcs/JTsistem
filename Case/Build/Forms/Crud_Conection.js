
class Crud_Conection extends ODD {

    constructor(i){

        super(i);
        this.CreateConection({...i});
    }

    _parent={
        buid:null,
        
    };
    _child=null;
    _conection=
    {
        parent:{
            trigger:{fieldName:''},
            value:{fieldSqlIndex:0},
        },
        child:{
            fieldSqlIndex:0,
        }
    };

    CreateConection({tipe=1,parent,child,conection,name}){

        this._parent=parent;
        this._child=child;
        this._conection=conection;
        let u = this;

        
        
        this.AddTrigger({
            crud:this._parent,
            fieldName:'edit',
            action:({y,field})=>{

                if(u._conection.parent.trigger.fieldName == field.name){
                                
                    u.ParentReload({y:y,name:'conection'});
                    
                }
            }
        });
        this.AddTrigger({
            crud:this._parent,
            fieldName:'new',
            action:({k})=>{

                u._child.Modal_SetActive({active:true});
                u._child.New_Action({});
            }
        });


        this._child.States_SetData({
            name:'reload',
            tools:[
                {name:'cancel',show:true},
                {name:'delete',show:false},
                {name:'new',show:false},
            ],
        });
        this.AddTrigger({
            crud:this._child,
            toolName:'cancel',
            action:()=>{
                
                u._child.Modal_SetActive({active:false});
            }
        });
        this.AddTrigger({
            crud:this._child,
            eventName:'update',
            action:(v)=>{

                //console.log('chid update', v);
                
                


                //u._parent.Loads_OneLoad({});
            }
        })

    }

    AddTrigger({crud,tipe,fieldName=null,toolName=null,eventName=null,action}){

        if(fieldName!=null)eventName='boxUpdate';
        if(toolName!=null){

            switch (toolName) {
                case 'cancel':
                    eventName='cancel';
                    break;
            }

        }

        if(eventName!=null){

            crud.AddEvents({events:[
                {
                    name:eventName,
                    actions:[
                        {
                            name:'conection',
                            action:(v)=>{
                                
                                if((fieldName!=null&&v.field.name==fieldName)||fieldName==null)if(action!=null) action({...v});
                                
                            }
                        }
                    ],
                }
            ]});
        }
        
    }


    ParentReload({y=0,name='conection'}){

        if(this._parent==null||this._child==null)return;
  
        //get value of field conection of parent
        var valueParent = this._parent.Conection_GetValue({
            y:y,
            fieldSqlIndex:this._conection.parent.value.fieldSqlIndex
        });
        
        console.log(valueParent);
        this._child.Conection_SetConection({
            name:name,
            fieldSqlIndex:this._conection.child.fieldSqlIndex,
            value:valueParent,
        });
        
        this._child.Modal_SetActive({active:true});
        this._child.Reload_Action({});
    }
    
}