
class Crud_Form extends Crud_Body {

    
    constructor(i){

        super(i);
    }

    _General_SetVariables(i){

        super._General_SetVariables(i);
        this._head.States_SetToolsData({name:"reload",tools:[
            {name:"delete",show:true},
        ]});
        
    }

    Fields_Get({fieldName,fieldIndex}){

        return this._form.Fields_Get({fieldIndex,fieldName});
    }

    Fields_GetBoxes({fieldName,fieldIndex}){

        var field = this.Fields_Get({fieldName,fieldIndex});
        //console.log(field);
        var box = this._form.Window_Fields_GetBox({windowIndex:field.windowIndex,fieldName,fieldIndex});
        var boxes = [box];
        return boxes;
    }
}