
class Crud_Form extends Crud {

    
    constructor(i){

        //pass labels of windows to fields
        i.fields = [];
        for (let w = 0; w < i.windows.length; w++) {
            const wi = i.windows[w];
            if(wi.grid){

                wi.grid.labels.forEach(lb => {

                    i.fields.push({
                        window:w,
                        ...lb,
                    });
                });
            }   
        }

        const eventsNew = [
            {
                name:'buildPrint',
                actions:[
                    {
                        description:'build form',
                        action:({k,gridCols,windows})=>{

                            k._print = new Form({
                                parent:k._body.Modulo_GetColData({x:0,y:2}).col,
                                gridCols:gridCols,
                                windows:windows,
                                events:[
                                    {
                                        name:'boxUpdate',
                                        actions:[
                                            {
                                                name:'form boxupdate',
                                                action:({w,x,y,valueUpdate})=>{

                                                    var field = k._fields.find(f=>f.window==w&&f.x==x&&f.y==y);

                                                    k.CallEvent({
                                                        name:'boxUpdate',
                                                        params:{
                                                            w:w,
                                                            x:x,
                                                            y:y,
                                                            valueUpdate:valueUpdate,
                                                            field:field,
                                                        }
                                                    })
                                                }
                                            }
                                        ],
                                    }
                                ],
                            });

                        }
                    }
                ],
            },
            {
                name:'new',
                actions:[
                    {
                        description:'print clear',
                        action:({k})=>{

                            k._fields.forEach(fi => {
                            
                                var box = k._print.GetLabelBox({w:fi.window,x:fi.x,y:fi.y});
                                if(box.GetTipe()!=5){

                                    box.SetDefault();
                                }
                                
                            });
                        }
                    }
                ]
            },
            {
                name:'block',
                actions:[
                    {
                        description:'block fields',
                        action:({k})=>{

                            k._fields.forEach(fi => {
                            
                                var box = k._print.GetLabelBox({w:fi.window,x:fi.x,y:fi.y});
                                box.SetDefault();
                            });
                        }
                    }
                ]
            },
            {
                name:'update',
                actions:[
                    {
                        description:'request by sql to update data',
                        action:({k})=>{

                            k.EventUpdate({y:0});
                        }
                    }
                ],
            },
            {
                name:'boxGetValue',
                actions:[
                    {
                        description:'get value of box in form',
                        action:({k,fieldIndex,y})=>{

                            var field = k._fields[fieldIndex];
                            var bx = k._print.GetLabelBox({w:field.window,x:field.x,y:field.y});
                            var value = bx.GetValue();

                            return value;
                        }
                    }
                ],
            },
            {
                name:'boxSetValue',
                actions:[
                    {
                        name:'form set value in box',
                        action:({k,value,y,fieldIndex})=>{

                            var field = k._fields[fieldIndex];
                            var box = k._print.GetLabelBox({
                                w:field.window,
                                x:field.x,
                                y:field.y
                            });
                            box.SetValue(value);
                        }
                    }
                ],
            },
            {
                name:'boxUpdate',
                actions:[],
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
                name:'delete',
                actions:[
                    {
                        name:'delete event',
                        action:({k})=>{

                            k.EventDelete({y:0,success:()=>{

                                k.CallEvent({name:'stateDefault'});
                            }});
                        }
                    }
                ],
            },
            {
                name:'setOptionsToField',
                actions:[
                    {
                        name:'set to form',
                        action:({k,fieldIndex,options})=>{
                            
                            var field = k._fields[fieldIndex];
                            var box = k._print.GetLabelBox({
                                w:field.window,
                                x:field.x,
                                y:field.y,
                            });
                            box.SetOptions(options);
                        }
                    }
                ],
            }
        ];
        if(i.events==null)i.events=[...eventsNew];
        else i.events = [...i.events,...eventsNew];

        super(i);
    }
}