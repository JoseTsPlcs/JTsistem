
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
            default:"[/]",
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

icons = {
    settings:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
    </svg>
    `,
    load:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16">
      <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313ZM13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 5.698ZM14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13V4Zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 8.698Zm0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525Z"/>
    </svg>
    `,  
    edit:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
    </svg>
    `,
    delete:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
    `,
    copy:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>`,
  } 

  
  function NewChart({parent,chart,width=null,height=null}) {
        
    var ctx1 = document.createElement("canvas");
    if(width)ctx1.setAttribute("width",width);
    if(height)ctx1.setAttribute("height",height);
    parent.appendChild(ctx1);

    return new Chart(ctx1, chart);
  }

   function GetGridConfig({panels=[]}){

    var grid = {
        cols:[],
    };

    var y = 0;
    var x = 0;
    var colxlrest = 12;
    var line = [];

    for (let p = 0; p < panels.length; p++) {
        const panel = panels[p];

        panels[p].x = x;
        panels[p].y = y;

        var col = panel.col !=null ? panel.col : 12;
        line.push(col);

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

    grid.panels = {...panels};

    return grid;
}