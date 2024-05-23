

paginas = [
    {
        seccion:"taller",
        paginas:[
            
          {name:"ordenes de trabajo",href:"order_control.php"},
          {name:"nueva orden de trabajo",href:"order_new.php"},
          {name:"vehiculos",href:"order_new.php"},
          {name:"historial",href:"order_new.php"},
        ],
    },
];

var paginasData = [];
var paginasOptions = [];

for (let scc = 0; scc < paginas.length; scc++) {

    const seccion = paginas[scc];

    for (let pg = 0; pg < seccion.paginas.length; pg++) {

        const pagina = seccion.paginas[pg];
        var value = scc + "-" + pg;

        paginasData.push({
            value,
            seccion,
            pagina:pagina.name,
            url:pagina.href,
        });

        
        var show = seccion.seccion +"-"+pagina.name;
        paginasOptions.push({value,show});
    }
    
}



var db_lip = new Conection({
    servidor:'localhost',
    usuario:'Lip_Alonso',
    pass:'kfEq2Li-xwv3L]rP',
    baseDatos:'lip_dv',
});