
class Crud_Form extends Crud {

    
    constructor(i){

        //pass labels of windows to fields
        i.fields = [];

        if(i.windows == null) i.windows=[];

        for (let w = 0; w < i.windows.length; w++) {
            const wi = i.windows[w];

            var labels = wi.labels ? wi.labels : [];
            labels = labels.map((lb)=>{return{...lb,window:w}});

            var gridConfig = this.GetGridConfig({panels:labels});
            //console.log(w,gridConfig);
            wi.grid = {

                cols: gridConfig.cols,
                labels:[...labels],
            }
            i.fields = [...i.fields,...labels];  
        }    
        //console.log("fields form", i.fields);
        
        var windowsConfig =  this.GetGridConfig({panels:i.windows});
        //console.log("gridConfig", windowsConfig);
        i.gridCols = windowsConfig.cols;

        i.states = [
            {
                name:'reload',
                tools:[
                    {name:'cancel',show:false},
                    {name:'delete',show:true},
                ],
            }
        ]

        //console.log(i);

        super(i);
    }

    _Start_BuildComponents(i){

        super._Start_BuildComponents(i);

        this._print = new Form({
            parent:this._body.Modulo_GetColData({x:0,y:2}).col,
            gridCols:i.gridCols,
            windows:i.windows,
            events:[
                /*{
                    name:'boxUpdate',
                    actions:[
                        {
                            name:'form boxupdate',
                            action:({w,x,y,valueUpdate})=>{

                                var field = _._fields.find(f=>f.window==w&&f.x==x&&f.y==y);

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
                }*/
            ],
        });
    }

    _Action_Print_GetBoxes({fieldIndex=null,fieldName}){

        if(fieldIndex==null) fieldIndex=this._fields.findIndex(f=>f.name==fieldName);

        var field = this._fields[fieldIndex];
        var box = this._print.GetLabelBox({
            w:field.window,
            x:field.x,
            y:field.y,
        });
        return [box];
    }
}