

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

function Date_GetDetails({ dateString, current=false }) {
    const date = new Date((!current?dateString+"T00:00:00":dateString));

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

function Date_GetLabel({dateString,current,period="day"}) {
    
    var detail = Date_GetDetails({dateString,current});

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

function DateGetLabelsUnique({data,labelField,period}) {
    
    const uniqueLabels = new Set();
    data.forEach(item => {
        // Añadimos cada label al conjunto usando el campo especificado por labelField
        uniqueLabels.add(
            Date_GetLabel({
                dateString:item[labelField],
                period,
            })
        );
    });

    return Array.from(uniqueLabels);
}

function DataGetCalculateByLabel({data,labelField,period,calcField}) {
    
    var result = DataGetCalculateByField({
        data,
        byField:labelField,
        calcField,
    });

    result.sort((a, b) => new Date(a.value) - new Date(b.value));
    result.forEach(rst => {
        
        rst.value = Date_GetLabel({dateString:rst.value,period});
    });

    return result;
}

function DataGetCalculateByField({data,byField,calcField}) {
    
    var result = [];

    data.forEach(itm => {
        
        var value = itm[byField];
        var cal = parseFloat(itm[calcField]);
        var resultIndex = result.findIndex(rst=>rst.value==value);
        if(resultIndex==-1){

            result.push({
                value,
                sum:cal,
                count:1,
            });
        }
        else
        {
            result[resultIndex].sum += cal;
            result[resultIndex].count++;
        }
    });

    result.forEach(rst => {
        
        rst.prom = parseFloat((rst.sum/rst.count).toFixed(2));
        rst.sum = parseFloat(rst.sum.toFixed(2));
    });

    return result;
}
