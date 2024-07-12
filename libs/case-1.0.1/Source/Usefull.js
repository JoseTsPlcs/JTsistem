
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
    }

    if(field.box.tipe==5&&field.tipe==null) field.tipe=0;
    //if(field.box.tipe==3&&field.tipe==null) field.tipe=2;
    //if(field.box.tipe==1&&field.tipe==null) field.tipe=0;

    return field;
}

//-------

function Time_Current() {

    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}

function Date_Today(days=0) {
  
    if(testing) return "2021-05-27";

    var today = new Date();
    return today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + (parseInt(today.getDate()) + days)).slice(-2);
}

function Date_Time_Today() {
    
    return Date_Today() + " " + Time_Current();
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

function Date_StartQuarter() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let startMonth;

    if (month >= 0 && month <= 2) { // Primer trimestre: enero, febrero, marzo
        startMonth = 0;
    } else if (month >= 3 && month <= 5) { // Segundo trimestre: abril, mayo, junio
        startMonth = 3;
    } else if (month >= 6 && month <= 8) { // Tercer trimestre: julio, agosto, septiembre
        startMonth = 6;
    } else { // Cuarto trimestre: octubre, noviembre, diciembre
        startMonth = 9;
    }

    const startDate = new Date(year, startMonth, 1);
    
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return formatDate(startDate);
}

function Date_EndQuarter() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let endMonth;

    if (month >= 0 && month <= 2) { // Primer trimestre: enero, febrero, marzo
        endMonth = 2;
    } else if (month >= 3 && month <= 5) { // Segundo trimestre: abril, mayo, junio
        endMonth = 5;
    } else if (month >= 6 && month <= 8) { // Tercer trimestre: julio, agosto, septiembre
        endMonth = 8;
    } else { // Cuarto trimestre: octubre, noviembre, diciembre
        endMonth = 11;
    }

    const endDate = new Date(year, endMonth + 1, 0); // 0 obtiene el último día del mes anterior
    
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return formatDate(endDate);
}

function Date_GetPeriod({ data, dataField, period = "day" }) {
    const labelsSet = new Set();
    const uniqueLabels = [];

    for (const item of data) {
        const dateString = item[dataField];
        const label = Date_GetLabel({ dateString, period });

        if (!labelsSet.has(label)) {
            labelsSet.add(label);
            uniqueLabels.push(label);
        }
    }

    return uniqueLabels;
}

function Date_GetDetails({ dateString }) {
    const date = new Date(dateString+"T00:00:00");

    // Obtener el día del mes
    const dayOfMonth = date.getDate();

    // Obtener el día de la semana (0-6) donde 0 es Domingo
    const dayOfWeek = date.getDay();

    // Obtener el nombre del día de la semana en español
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = dayNames[dayOfWeek];

    // Obtener el mes (0-11) donde 0 es Enero
    const monthNumber = date.getMonth();

    // Obtener el nombre del mes en español
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const monthName = monthNames[monthNumber];

    // Calcular el trimestre (1-4)
    const quarter = Math.floor(monthNumber / 3) + 1;

    // Obtener el año
    const year = date.getFullYear();

    // Calcular el número de la semana
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

    return {
        dayOfMonth,
        dayOfWeek,
        dayName,
        weekNumber,
        monthNumber,
        monthName,
        quarter,
        year
    };
}

function Date_GetLabel({dateString,period="day"}) {
    
    var detail = Date_GetDetails({dateString});

    switch(period){

        case "day":
        return detail.dayName.substring(0, 3) + "-" + detail.dayOfMonth + "-" + detail.monthName.substring(0,3);

        case "week":
        return detail.monthName.substring(0, 3) + "-semana #" + detail.weekNumber;

        case "month":
        return detail.monthName.substring(0,3) + "-" + detail.year;

        case "tri":
        return "Q"+detail.quarter +"-"+detail.year;

        default:
        return dateString;
    }
}

function UniqueLabels({ data, labelField }) {
    // Utilizamos un conjunto para eliminar duplicados
    const uniqueLabels = new Set();

    data.forEach(item => {
        // Añadimos cada label al conjunto usando el campo especificado por labelField
        uniqueLabels.add(item[labelField]);
    });

    // Convertimos el conjunto a array
    const labelsArray = Array.from(uniqueLabels);

    // Colores vivos, cálidos y bonitos predefinidos
    const vibrantColors = [
        '#FF5733', // Red-Orange
        '#FF8D1A', // Orange
        '#FFC300', // Yellow
        '#DAF7A6', // Light Green
        '#FF6F61', // Coral
        '#F7CAC9', // Pink
        '#92A8D1', // Blue
        '#F5B7B1', // Light Pink
        '#B39BC8', // Purple
        '#FAE03C'  // Bright Yellow
    ];

    // Función para obtener un color aleatorio del array predefinido
    function getRandomColor() {
        const randomIndex = Math.floor(Math.random() * vibrantColors.length);
        return vibrantColors[randomIndex];
    }

    // Creamos la lista de objetos con la etiqueta y un color aleatorio
    const result = labelsArray.map(label => {
        return {
            name: label,
            color: getRandomColor()
        };
    });

    return result;
}

function NewChart({parent,chart,width=null,height=null}) {
        
    var ctx1 = document.createElement("canvas");
    if(width)ctx1.setAttribute("width",width);
    if(height)ctx1.setAttribute("height",height);
    parent.appendChild(ctx1);

    return new Chart(ctx1, chart);
}

function GetGridConfig({panels=[],breaklevel="md"}){

    var grid = {
        cols:[],
        labels:[],
        attributes:[],
    };

    //panels = panels.filter(f=>f!=null);

    var y = 0;
    var x = 0;
    var colxlrest = 12;
    var line = [];

    for (let p = 0; p < panels.length; p++) {

        var panel = panels[p];
        panel.x = x;
        panel.y = y;

        var col = panel.col !=null ? panel.col : 12;
        var colAllLevel = panel.colAllLevel == true;
        line.push(col);
        grid.attributes.push({
            x,y,
            attributes:[
                {name:"class",value:"col-"+(colAllLevel?col:12)+" col-"+breaklevel+"-"+col},
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

        if(panel.box) grid.labels.push(panel);
    }

    grid.panels = panels;

    return grid;
}

function setDomAttributes({dom,attributes=[],startAttributes=[]}) {
    
    var finshAttribbutes = [...startAttributes];

    attributes.forEach(att => {
        
        var fatt = finshAttribbutes.find(fatt=>fatt.name==att.name);
        if(fatt){

            switch (fatt.name) {
                case "class":
                    
                    fatt.value += " " + att.value;
                break;
            
                case "style":
                    
                    fatt.value += "; " + att.value;
                break;
            }
        }else{

            finshAttribbutes.push(att);
        }
    });

    //console.log("finsh:",finshAttribbutes);

    finshAttribbutes.forEach(fatt => {
        
        dom.setAttribute(fatt.name,fatt.value);
    });

}