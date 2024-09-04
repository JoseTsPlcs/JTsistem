

class PanelChart extends PanelBuild {


    constructor(i) {
        
        super(i);
        this._type = "chart";
    }

    fieldSetValues({fieldName,values=[]}){

        var field = this.fieldGet({fieldName});
        field.values = values;
        this._BuildUpdate();
    }
    fieldGetValues({fieldName}){

        var field = this.fieldGet({fieldName});
        return field.values;
    }

    _BuildUpdate(){

        var chart = this._buildBlocks[0];
        
        var labels = this.fieldGetValues({fieldName:"labels"});

        var datasets = [];
        this._fields.filter(f=>f.name!="labels").forEach(f => {
            

            datasets.push({
                label:f.title,
                data:this.fieldGetValues({fieldName:f.name}),
                borderWidth: 1,
                type:(f.type?f.type:null),
            });
        });

        chart.data.labels = labels;
        chart.data.datasets = datasets;
        chart.options.plugins.title.text = this._title;
        
        chart.update();
    }
    
    _Building({parent}){
        
        super._Building({parent});

        var chartParent = document.createElement("canvas");
        parent.appendChild(chartParent);

        var chart = new Chart(chartParent, {
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
                        text:this._title,
                        font:{size:15}
                    },
                },
                responsive: true,
                scales: {
                    x: {
                    stacked: true,
                    },
                    y: {
                    stacked: true
                    }
                }
            }
        });

        this._buildBlocks.push(chart);
        this._BuildUpdate();
    }
    
}