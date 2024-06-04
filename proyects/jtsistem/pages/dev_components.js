

var control = [
    {name:"window",active:false},
    {name:"form",active:false},
    {name:"editImage",active:true},
];

function ControlActive(name) {
    
    var cn = control.find(c=>c.name=="window");
    return cn && cn.active;
}


console.log("control:",control);

control.forEach(cn => {
    
    if(cn.active){

        switch (cn.name) {
            case "window":
                
                cn.build = new Window({
                    parent:document.body,
                    blocked:false,show:false,
                    title:"titulo",
                    fields:[
                        {col:12,tipe:1,name:"field1",box:{tipe:1}},
    
                        {col:6,tipe:2,name:"field2",box:{tipe:3,options:[{value:1,show:"op1"},{value:2,show:"op2"},{value:3,show:"op3"},]}},
                        {col:6,tipe:2,name:"field3",box:{tipe:8,options:[{value:1,show:"op1"},{value:2,show:"op2"},{value:3,show:"op3"},]}},
    
                        {col:4,tipe:1,name:"field4",box:{tipe:1}},
                        {col:4,tipe:1,name:"field5",box:{tipe:1}},
                        {col:4,tipe:0,name:"field6",box:{tipe:6,value:1,name:"field6"}},
                    ],
                });
    
            break;

            case "form":

            cn.build = new Form({
                parent:document.body,head:true,
                blocked:false,show:true,
                title:"formulario - titulo",
                fields:[
                    {col:12,name:"filtro 1",box:{tipe:1}},
                ],
                tools:[
                    {position:"head-center",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                    {position:"head-left",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                    {position:"head-right",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                    {position:"botton-center",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                    {position:"botton-left",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                    {position:"botton-right",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                ],
            });

            break;

            case "editImage":

                var grid = new Grid({cols:[[6,6]]}); 
                var parent = grid.GetColData({x:0,y:0}).col;
                new EditableImage({
                    parent,
                    imageUrl:"../imagenes/vehiculo_4ruedas.png",
                });

            break;
        }
    }

});
