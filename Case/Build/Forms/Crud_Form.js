
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

    Fields_GetBoxes({fieldName,fieldIndex}){

        var field = this._head.Fields_GetInfo({fieldIndex,fieldName});
        if(field==null)console.error("crud_form->Fields_GetBoxes(fieldName:"+fieldName+",fieldIndex:"+fieldIndex+")");

        var box = this._form.Window_Fields_GetBox({windowIndex:field.windowIndex,fieldName,fieldIndex});
        
        var boxes = [box];
        return boxes;
    }
}