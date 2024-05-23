

var gr = new Grid({
    cols:[
        [12],
        [12],
    ]
});

var wnd_conection = new windowConection({
    parent:gr.GetColData({x:0,y:0}).col,
    success:({tables})=>{

        //console.log("loaded schema:",tables);
        //console.log(wnd_request);
        wnd_request.SetTableData({tablesData:tables});
    }
});

//---------

var wnd_request = new windowRequest({
    
});