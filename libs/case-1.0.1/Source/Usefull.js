
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

    if(field.action=="delete"){

        field.box = {
            default:"x",
            tipe:5,
            class:"btn btn-outline-danger btn-sm",
        }
        field.name="delete";
        field.action="delete";
    }

    if(field.action=="edit"){

        field.box = {
            value:"[/]",
            tipe:5,
            class:"btn btn-outline-primary btn-sm",
        }
        field.name="edit";
        field.action="edit";
    }

    if(field.action=="new"){

        field.box = {
            default:"[+]",
            tipe:5,
            class:"btn btn-outline-primary btn-sm",
        }
        field.name="new";
        field.action="new";
    }

    
    if((field.box.tipe==1 || field.box.tipe==8) && field.box.class==null) field.box.class = "w-100 m-0";

    if(field.box.tipe == 6 && field.box.name == null){
        if(field.tipe==null) field.tipe=0;
        field.box.name = field.name;
    }

    if(field.box.tipe==5&&field.tipe==null) field.tipe=0;
    if(field.box.tipe==3&&field.tipe==null) field.tipe=2;
    //if(field.box.tipe==1&&field.tipe==null) field.tipe=0;

    return field;
}

//-------

function Date_Today(days=0) {
  
    if(testing) return "2021-05-27";

    var today = new Date();
    return today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + (parseInt(today.getDate()) + days)).slice(-2);
  }

function Date_ToString({date=null}) {
  
    var todayDate = date.toISOString().slice(0, 10);
    //console.log(todayDate);
    return todayDate;
}


function Date_FirstOfMoth() {
    
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return Date_ToString({date:firstDay});
}

function Date_LastOfMoth() {
    
    var date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return Date_ToString({date:lastDay});
}


function NewChart({parent,chart,width=null,height=null}) {
        
    var ctx1 = document.createElement("canvas");
    if(width)ctx1.setAttribute("width",width);
    if(height)ctx1.setAttribute("height",height);
    parent.appendChild(ctx1);

    return new Chart(ctx1, chart);
}

function GetGridConfig({panels=[],level=1}){

    var grid = {
        cols:[],
        attributes:[],
    };

    var y = 0;
    var x = 0;
    var colxlrest = 12;
    var line = [];

    for (let p = 0; p < panels.length; p++) {

        var panel = panels[p];
        panel.x = x;
        panel.y = y;

        var col = panel.col !=null ? panel.col : 12;
        line.push(col);
        grid.attributes.push({
            x,y,
            attributes:[
                {name:"class",value:"col-12 col-md-"+col},
            ],
        });

        colxlrest -= col;

        if(colxlrest <= 0){

            y++;
            x=0;
            colxlrest=12;
            grid.cols.push(line);
            line=[];
        }
        else {

            x++;
        }

        
    }

    grid.panels = panels;

    return grid;
}