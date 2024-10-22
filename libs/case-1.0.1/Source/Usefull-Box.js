
const testing = false;

function Options_Dual({show=null,show2=null,colorinverse=false}) {
    
    return [
        {value:1,show:show,class:(colorinverse?'text-danger':'text-success')},
        {value:0,show:(show2?show2:('no ' + show)),class:(!colorinverse?'text-danger':'text-success')},
    ];
}

function Box_MutipleDual({show=null,show2=null, dlft=null}) {
    
    return {
        tipe:4,
        options: Options_Dual({show:show,show2:show2}),
        default:dlft,
    }
}

function Box_Soles({total=0, decimals=2,clss=null,limit=false}={}) {
    
    var bx = {
        tipe:0,
        class:clss,
        default:total,
        format:{
            decimals:decimals,
            start:'S/.',
            
        }
    }

    if(limit){

        bx.format.limit={
            value:0,
            less:{attributes:[
                {name:"class",value:"text-danger"},
            ]},
            more:{attributes:[
                {name:"class",value:"text-success"},
            ]},
        };
    }

    return {...bx};
}

function Box_Dual(i){
    return {
        tipe:0,
        options:Options_Dual({...i}),
    };
}

function Box_ShowOptions(i) {
    
    return {
        tipe:0,
        options:Options_Dual({...i}),
    };
}

function Param_GetBox(box) {
    
    var result = {tipe:0};

    if(box!=null){

        if(Number.isInteger(box)){

            result.tipe = box;
        }
        else result = box;
    }

    if(result.tipe==2&&result.default==null) result.default = Date_Today(0);

    return result;
}

function Param_GetSql(sql) {
    
    if(sql!=null){

        if(Number.isInteger(sql)){

            return {table:0,field:sql};
        }
        else{

            if(sql.table==null) sql.table=0;
            
            return sql;
        }
    }
    else return null;
}

function Param_GetLoad(load) {
    
    if(load!=null){

        if(Number.isInteger(load)){

            return {loadIndex:load};
        }
        else return load;
    }
    else return null;
}

function Param_GetAction(action) {
    
    var box = null;


}

function Param_GetField(field) {
    
    field.box = Param_GetBox(field.box);

    if(field.action != null) field.colAllLevel = true;
    
    if((field.box.tipe==1 || field.box.tipe==8) && field.box.class==null) field.box.class = "w-100 m-0";

    if(field.box.tipe == 6 && field.box.name == null){
        if(field.tipe==null) field.tipe=0;
        field.box.name = field.name;
        field.box.title = field.title;
    }

    if(field.box.tipe==5&&field.tipe==null) field.tipe=0;
    //if(field.box.tipe==3&&field.tipe==null) field.tipe=2;
    //if(field.box.tipe==1&&field.tipe==null) field.tipe=0;

    return field;
}

//-------
