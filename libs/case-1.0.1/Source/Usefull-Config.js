

function getPath({}) {
    
    var arr = window.location.pathname.split('/');
    var path = "";
    var indexStart = arr.findIndex(a=>a=="JTsistem");
    var indexPhp = arr.findIndex(a=>a.includes(".php"));
    var jumps = indexPhp-indexStart-1;
    //console.log("split path:","jumps",jumps);

    for (let i = 0; i < jumps; i++) path += "../";

    return path;
}