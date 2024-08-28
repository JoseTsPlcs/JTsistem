

class PanelTable extends Panel {


    constructor(i) {
        
        super(i);
    }

    _BuildPanel(){

        super._BuildPanel();

        this._panel = new Table_Grid({
            parent:this._panelConteiner,
            fields:this._fields,
        });
    }

    
}