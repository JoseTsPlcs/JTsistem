
class ConsInform extends ODD {

    constructor(i){

        super(i);
        this.#SetVariable(i);
        this.#Build(i);
        
        let k = this;
        this.#loads.Load({
            success:()=>{

                k.#Event_Reload({});
            }
        });
    }

    #conection = null;
    Conection_Get(){

        return this.#conection;
    }

    #loads = null;
    #SetVariable({conection,loads=[],charts=[]}){

        let k = this;
        this.#conection = conection;
        this.#loads = new Loads({
            conection:this.#conection,
            loads,
            events:[{
                name:"loaded",
                actions:[{
                    action:()=>{

                        //console.log("consInform- loads - loaded");
                        k.#Event_Loaded({});
                    }
                }]
            }],
        });

        this.#Charts_Set({charts});
    }

    #fm=null;
    #tg_config=null;
    #screenLoad = null;
    ScreenLoad_Get(){

        return this.#screenLoad;
    }
    ScreenLoad_Set({active}){

        this.#screenLoad.SetState({state:active});
    }

    #filters = null;
    Filters_Get(){

        return this.#filters;
    }

    #Build({parent,title,head,show,blocked,filters,configShow=false}){

        let k = this;

        this.#fm = new Form({
            parent,
            title,head,show,blocked,
            fields:[
                {col:12,name:"panel1",tipe:0,box:{tipe:0}},
                {col:12,name:"panel2",tipe:0,box:{tipe:0}},
                {col:12,name:"panel3",tipe:0,box:{tipe:0}},
            ],
            tools:[
                {x:0,y:0,index:0,name:"config",box:{tipe:5,value:'<i class="bi bi-gear"></i>',class:"btn btn-outline-primary btn-sm"}},
                {x:0,y:0,index:1,name:"load",box:{tipe:5,value:'<i class="bi bi-database"></i>',class:"btn btn-outline-primary btn-sm"}},        
            ],
            events:[
                {
                    name:"toolUpdate",
                    actions:[{
                        action:({tool})=>{

                            k.#Event_ToolEvent({tool});
                        }
                    }],
                }
            ],
        });


        this.#tg_config = new Toggle({
            dom:this.#fm.ContentGridGet().GetColData({x:0,y:1}).col,
            show:configShow,
        })
        

        this.#filters = new windowFilters({
            title:"configuracion",
            parent:this.#fm.ContentGridGet().GetColData({x:0,y:1}).col,
            filters,
            events:[{
                name:"reload",
                actions:[{
                    action:()=>{

                        k.#Event_Reload({});
                    }
                }]
            }],
        });
        
        this.#screenLoad = new ScreenLoad({
            parent:this.#fm.ParentWindowGet().Conteiner_Dom(),
        });

        this.#loads.ScreenLoad_SetVariables({
            screenLoad:this.#screenLoad,
        });

        this.#Charts_Build({
            parent:this.#fm.ContentGridGet().GetColData({x:0,y:2}).col,
        });
    }

    //---------charts----------

    #charts = [];
    #charts_gr = null;

    #Charts_Set({charts=[]}){

        this.#charts = charts;
    }

    Chart_SetData({chartName,labels,dataSets}){

        var chart = this.#charts.find(ch=>ch.name==chartName);
        var build = chart.build;

        switch(chart.tipe){

            case "target":
                build.GetColData({x:0,y:0}).boxs[0].SetValue(dataSets[0].data[0]);
                build.GetColData({x:0,y:1}).boxs[0].SetValue(dataSets[0].label);
            break;

            case "table":
                dataSets.forEach(d => {
                    
                    build.Fields_SetValues({values:d.data,fieldName:d.label});
                });
            break;

            default:
                build.data.datasets = dataSets;
                build.data.labels = labels;
                build.update();
            break;
        }        
    }

    Chart_GetBuild({chartName}){

        var chart = this.#charts.find(ch=>ch.name==chartName);
        var build = chart.build;
        return build;
    }

    #Charts_Build({parent}){

        var gridConfig = GetGridConfig({panels:this.#charts});
        this.#charts_gr = new Grid({
            parent,
            ...gridConfig,
        });

        this.#charts.forEach(chart => {

            var parent = this.#charts_gr.GetColData({
                x:chart.x,
                y:chart.y,
            }).col;
            
            switch (chart.tipe) {

                case "chart-evolutivo":
    
                var chartParent = document.createElement("canvas");
                parent.appendChild(chartParent);
                console.log("evol:",chart);
                chart.build = new Chart(chartParent, {
                    type: 'bar',
                    data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange',"Mes1","mes2"],
                    datasets: [
                        {
                        label: 'precios',
                        data: [12, 19, 3, 5, 2, 3],
                        borderWidth: 1,
                        type:"line",
                        },
                        {
                        label: 'precios',
                        data: [12, 19, 3, 5, 2, 3],
                        borderWidth: 1,
                        },
                    ]
                    },
                    options: {
                        plugins: {
                            title: {
                            display: true,
                            text:chart.title,
                            },
                        },
                        responsive: true,
                        scales: {
                            x: {
                            stacked: chart.stacked,
                            },
                            y: {
                            stacked: chart.stacked
                            }
                        }
                    }
                });

                break;

                case "chart-donu":
    
                var chartParent = document.createElement("canvas");
                parent.appendChild(chartParent);
    
                chart.build = new Chart(chartParent, {
                    type: 'doughnut',
                    data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange',"Mes1","mes2"],
                    datasets: [
                        {
                        label: 'precios',
                        data: [12, 19, 3, 5, 2, 3],
                        //borderWidth: 1
                        },
                    ]
                    },
                    options: {
                        scales: {
                            y: {
                            beginAtZero: true
                            }
                        },
                        plugins: {
                            legend: {
                            position: 'top',
                            },
                            title: {
                            display: true,
                            text: chart.title,
                            }
                        }
                    }
                });

                break;

                case "target":

                chart.build = new Grid({
                    parent,
                    cols:[[12],[12]],
                    attributes:[],
                    boxs:[
                        {x:0,y:0,box:{tipe:0,class:"h1 w-100 text-center",value:0}},
                        {x:0,y:1,box:{tipe:0,class:"h4 w-100 text-center",value:"title target"}},
                    ],
                });

                break;

                case "table":

                chart.build = new Table_Grid({
                    parent,
                    fields: chart.fields,
                    events:chart.events,
                });

                break;
            
                default:
                break;
            }           

        });
    }

    //---------events-------------

    #Event_ToolEvent({tool}){

        switch (tool.name) {
            case "load":
            
                this.#loads.Load({});

            break;

            case "config":
                //console.log("inform config");
                this.#tg_config.Change({});

            break;
        }  
    }

    #Event_Loaded({}){

        //console.log("consInform-eventLoaded");

        var filters = this.#filters.Filters_Get();
        var loads = this.#loads.Loads_Get();

        loads.forEach(ld => {
            
            var filtersByLoads = filters.filter(flt=>flt.load && flt.load.name==ld.name);
            if(filtersByLoads!=null){

                filtersByLoads.forEach(flt => {
                    
                    var ops = ld.result.map((rst)=>{

                        var value = rst[flt.load.value];
                        var show = rst[flt.load.show];
                        return {value,show};
                    });

                    this.#filters.Filter_SetOptions({
                        filterName:flt.name,
                        options:ops,
                        value:flt.box.value,
                    });
                });
            }
            
        });


        this.CallEvent({name:"loaded"});
    }

    #Event_Reload({}){

        this.CallEvent({name:"reload"});
    }

    

}