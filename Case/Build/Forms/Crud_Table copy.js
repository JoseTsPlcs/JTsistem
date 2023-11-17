
class Crud_Table extends Crud {

    constructor(i){

        if(i.fields!=null){

            i.fields.forEach(fi => {
                
                if(fi.delete){

                    fi.box = {
                        tipe:5,
                        value:'x',
                        class:'btn btn-outline-danger btn-sm'
                    }
                    fi.name='';
                }

                if(fi.edit){

                    fi.name='';
                    fi.box={
                        tipe:5,
                        class:'btn btn-outline-primary btn-sm',
                        value:'[/]'
                    };
                }
            });
        }

        const eventsNew = [
            {
                name:'buildPrint',
                actions:[
                    {
                        description:'build table',
                        action:({k,title})=>{

                            var headers = k._fields.map((fi)=>{return {name:fi.name}});
                            k._print = new Table_Grid({
                                parent: k._body.Modulo_GetColData({x:0,y:2}).col,
                                headers:headers,
                                name:(i.title+' [table]'),
                                log:i.log,
                            });

                        }
                    },
                ],
            },
            {
                name:'print',
                actions:[
                    {
                        name:'print data of load',
                        action:({k,data})=>{
                            
                            var lines = [];
                            for (let y = 0; y < data.length; y++) {
                                const d = data[y];
                                
                                var ln = [];

                                for (let x = 0; x < k._fields.length; x++) {
                                    const fi = k._fields[x];
                                    
                                    //read data to put value in print
                                    var value = fi.box.value;
                                    if(fi.sql != null){

                                        var fieldInfo = k._mysql.GetFieldInfo({...fi.sql});
                                        var fieldName = fieldInfo['Field'];
                                        value = d[fieldName];
                                    }

                                    ln.push({
                                        box:{
                                            ...fi.box,
                                            value:value,
                                            update:(updateValue)=>{

                                                k.CallEvent({name:'boxUpdate',params:{x:x,y:y,updateValue:updateValue,field:fi}});                            
                                            }
                                        }
                                    });
                                }

                                lines.push(ln);
                            }

                            this.LogAction({msg:[data,lines,k]})
                            k._print.Clear();//first clear old lines
                            k._print.AddLines({lines:lines});//print new lines
                        }
                    }
                ],
            },
            {
                name:'new',
                actions:[
                    {
                        name: 'print new',
                        description:'create one line to create',
                        action:({k})=>{

                            var ln = k._fields.map((fi)=>{

                                //read data to put value in print
                                var fieldInfo = k._mysql.GetFieldInfo({...fi.sql});
                                var fieldName = fieldInfo['Field'];
                    
                                return {
                                    box:{
                                        ...fi.box,
                                    }
                                }
                            });
                            var lines = [ln];
                    
                            //this.LogAction({msg:[data,lines]})
                            this._print.Clear();//first clear old lines
                            this._print.AddLines({lines:lines});//print new lines
                        }
                    }
                ]
            },
            {
                name:'boxUpdate',
                actions:[
                    {
                        name:'delete by button delete',
                        action:({k,x,y,field})=>{

                            k.LogAction({msg:[x,y,field]});
                            if(field.delete){

                                k.EventDelete({y:y,success:()=>{

                                    k.CallEvent({name:'stateDefault'});
                                }});
                            }
                        }
                    },
                    {
                        name:'update when box was updated',
                        action:({k,x,y,field})=>{

                            if(field.sql == null)return;

                            k.EventUpdate({y:y,success:()=>{

                                k.CallEvent({name:'stateDefault'});
                            }});
                        }
                    }
                ],
            },
            {
                name:'boxGetValue',
                actions:[
                    {
                        description:'get value of table',
                        action:({k,fieldIndex,y})=>{

                            return k._print.Box_GetValue({x:fieldIndex,y:y});
                        }
                    }
                ],
            },
            {
                name:'stateDefault',
                actions:[
                    {
                        name:'reload',
                        action:({k})=>{

                            k.CallEvent({name:'reload'});
                        }
                    }
                ],
            },
            {
                name:'block',
                actions:[
                    {
                        name:'clear table',
                        description:'delete all lines in the table',
                        action:({k})=>{

                            if(k._print!=null)k._print.Clear();
                        }
                    }
                ],
            }
        ];
        if(i.events==null)i.events=[...eventsNew];
        else i.events=[...i.events,...eventsNew];

        super(i);

        var st_reload = this._statesData.find(st=>st.name=='reload');
        st_reload['tools'].find(t=>t.name=='save')['show']=false;
        st_reload['tools'].find(t=>t.name=='delete')['show']=false;

        this._body.Modulo_GetTool({name:'sizes'}).SetValue(10);
    }
    
}