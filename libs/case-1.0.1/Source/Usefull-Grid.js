

function GetGridConfig({panels=[],breaklevel="md"}){

    var grid = {
        cols:[],
        labels:[],
        attributes:[],
        events:[],
    };
    
    panels = panels.filter(p=>p!=null);

    var y = 0;
    var x = 0;
    var colxlrest = 12;
    var line = [];

    for (let p = 0; p < panels.length; p++) {

        let panel = panels[p];
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

        if(panel.box){

            grid.labels.push(panel);
            let updateAction = panel.update ? panel.update : panel.box.update;
            if(updateAction!=null){
                
                grid.events.push({
                    name:"labelUpdate",
                    actions:[{
                        name:panel.name,
                        action:(params)=>{

                            if(params.label.name == panel.name) updateAction(params);
                        }
                    }]
                });
            }
        }
        
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