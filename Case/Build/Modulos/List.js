
class List extends ODD {


    constructor(i){

        super(i);
        this.#SetValue(i);
        this.#Build(i);

        this.SetData({data:i.data});
    }   

    _fields=[];
    #title = '';
    #parent = null;
    #SetValue({fields=[],title='lista',parent=null},height=300){

        fields.forEach(f => {
            
            f.pin=false;
            if(f.box!=null){
                if(f.box.tipe==3) f.box.class='w-100 m-0 p-0';
            }
        });

        this._fields=[
            {name:'',pin:true,box:{tipe:5,class:'btn btn-danger',default:'X'}},
            ...fields,
        ];

        this.#title=title;
        this.#parent=parent?parent:document.body;
        this.#height=height;
        
    }

    #body = null;
    #table = null;
    #height = 100;

    #Build({}){

        //---build body-----
        this.#body = new Grid({
            parent:this.#parent,
            cols:[[12],[12],[12]],
            boxs:[
                {x:0,y:0,box:{tipe:0,default:this.#title,class:'w-100 text-center h4 p-0 m-0'}},
                {x:0,y:2,box:{tipe:0,default:'+',class:'w-50 btn btn-primary btn-sm',update:()=>{this.AddLine({})}}},
            ],
            attributes:[
                {x:0,y:2,attributes:[{name:'class',value:'d-flex justify-content-center'}]},
                {y:1,attributes:[{name:'style',value:'min-height:'+this.#height+'px'}]},
            ],
        });

        //---build table----
        var hd = this._fields.map((f)=>{return{name:f.name}});
        //console.log(hd);

        this.#table = new Table_Grid({
            parent:this.#body.GetColData({x:0,y:1}).col,
            headers:hd,
            h_all:true,
        });


    }

    AddLine({data=[]}){

        let k = this;
        let y = this.#table.GetData().length;
        var line = [];
        for (let f = 0; f < this._fields.length; f++) {
            const field = this._fields[f];

            var box = {
                ...field.box,
                update:(v)=>{

                    k.#Box_Update({y:y,fieldIndex:f,field:field,value:v});
                }
            };

            if(f>0 && f-1<data.length)box.default=data[f-1];

            line.push({box:box,});
        }

        this.#table.AddLines({lines:[line]});
    }

    SetData({data=[]}){

        this.#table.Clear();
        for (let y = 0; y < data.length; y++) {
            const di = data[y];
            this.AddLine({data:di});
        }

    }

    #PrintData({data=[]}){

        var domLines = this.#table.GetData()[y];

        for (let y = 0; y < data.length; y++) {
            const dataLine = data[y];
            var domLine = domLines[y];

            for (let x = 0; x < dataLine.length; x++) {
                const dataValue = dataLine[x];

                if(x < domLine.cells.length){

                    var domValue = domLine.cells[x].box;
                    domValue.SetValue(dataValue);
                }
                
                
            }
        }

    }

    #PrintOneLine({y=0,data=[]}){

        var lineData = 
        console.log(lineData);
        for (let d = 0; d < data.length; d++) {
            const di = data[d];
                        
        }

    }

    #Box_Update({y,fieldIndex,field,value}){
  
        if(fieldIndex==0){

            this.#table.DeleteLine({y:y});
        }

        this.CallEvent({name:'boxUpdate',params:{y,fieldIndex:(fieldIndex>0?fieldIndex-1:0),field,value}});

    }

    Boxs_GetByField({fieldIndex}){

        var boxs = [];
        var data = this.#table.GetData();
        for (let y = 0; y < data.length; y++) {
            const di = data[y];
            const ci = di.cells[fieldIndex+1];
            var box = ci.box;
            boxs.push(box);
        }
        return boxs;
    }


    GetDataField({fieldIndex}){

        var data = this.GetData();
        var x = fieldIndex+1;
        return data.map((di)=>{return x<di.length?di[x]:''});
    }

    GetData(){

        var data = this.#table.GetData();
        var lines = [];
        for (let y = 0; y < data.length; y++) {
            const di = data[y];
            var line = [];
            for (let X = 0; X < di.cells.length; X++) {
                const ci = di.cells[X];
                var box = ci.box;
                var value = box.GetValue();
                line.push(value);
            }
            lines.push(line);
        }

        return lines;
    }
}