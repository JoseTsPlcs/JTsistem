
class Crud_Form extends Crud {

    
    constructor(i){
        
        //pass labels of windows to fields
        i.fields = [];

        if(i.windows == null) i.windows=[];

        for (let w = 0; w < i.windows.length; w++) {
            const wi = i.windows[w];

            var labels = wi.labels ? wi.labels : [];
            labels = labels.map((lb)=>{return{...lb,window:w}});

            var gridConfig = GetGridConfig({panels:labels});
            //console.log(w,gridConfig);
            wi.grid = {

                cols: gridConfig.cols,
                labels:[...labels],
            }
            i.fields = [...i.fields,...labels];  
        }    
        //console.log("fields form", i.fields);
        
        var windowsConfig = GetGridConfig({panels:i.windows});
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
        ];

        const eventsNew = [];
        if(i.events == null) i.events = [...eventsNew];
        else i.events = [...i.events,...eventsNew];

        //console.log(i);

        super(i);
        this._tipe="form";
    }

    _Start_BuildComponents(i){

        super._Start_BuildComponents(i);

        this._print = new Form({
            parent:this._body.Modulo_GetColData({x:0,y:2}).col,
            gridCols:i.gridCols,
            windows:i.windows,
            events:[
                
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