

class PanelKpi extends PanelBuild {


    constructor(i) {
        
        super(i);
        this._type = "kpi";
    }
    
    _Building({parent}){
        
        super._Building({parent});

        var fieldMain = this._fields[0];
        var grid = new Grid({
            parent,
            cols:[[12],[12]],
            labels:[
                {x:0,y:0,box:{...fieldMain.box},tipe:0},
                {x:0,y:1,box:{tipe:0,value:fieldMain.title},tipe:0},
            ],
        });

        this._fieldSetBoxes({
            fieldName:fieldMain.name,
            boxes:[grid.GetColData({x:0,y:0}).labels[0].GetBox()]
        })
    }
    
}