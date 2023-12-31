class Label {

    #parent = null;
    #name = "field";
    #box = null;
    #tipe = 1;
    #gridcont = null;
    #data = [
        {col:[[4,8]],label:{x:0,y:0},input:{x:1,y:0}},
        {col:[[12],[12]],label:{x:0,y:0},input:{x:0,y:1}},
    ];
    //1 -> [[4,8]]
    //2 -> [[12],[12]]

    constructor(i){

        this.#parent = i.parent ? i.parent : document.body;
        if(i.name) this.#name = i.name;
        this.#box = i.box ? i.box : {tipe:0};
        if(i.tipe) this.#tipe = i.tipe;

        this.#Build();
    }

    #Build(){

        switch(this.#tipe){

            case 1:

            this.#BuildLabel([[4,8]],{x:0,y:0},{x:1,y:0});

            break;

            case 2:

            this.#BuildLabel([[12],[12]],{x:0,y:0},{x:0,y:1});

            break;
        }

    }

    #BuildLabel(col, label_coord, input_coord){

        let k = this;

        this.#gridcont = new Grid({

            parent: k.#parent,
            cols: col,
            boxs:[
                {x:label_coord.x, y:label_coord.y, box:{tipe:0,default:k.#name + ":",class:'text-center'}},//label
                {x:input_coord.x, y:input_coord.y, box:k.#box},//input
            ],
            attributes:[
                {x:input_coord.x,y:input_coord.y,attributes:[
                    {name:'class',value:'conteiner d-flex justify-content-center align-items-center'}
                ]},    
            ],
            params:[
                {x:input_coord.x, y:input_coord.y,params:{class:'conteiner d-flex justify-content-center align-items-center'}},
              ],
        });
    }

    SetValue(v){
        
        var input = this.#data[this.#tipe-1].input;    
        this.#gridcont.Box_SetValue(input.x, input.y, v);
    }

    GetValue(v){
        
        var input_coord = this.#data[this.#tipe-1].input;
        const input_data = this.#gridcont.GetColData({x:input_coord.x, y:input_coord.y});
        const input_box = input_data.boxs[0];
        var getv = input_box.GetValue();

        return getv;
    }

    SetDefault(){
        
        var input = this.#data[this.#tipe-1].input;    
        this.#gridcont.Box_SetDefault(input.x, input.y);
    }

    SetOptions(ops){
        
        var input = this.#data[this.#tipe-1].input;    
        this.#gridcont.Box_SetOptions(input.x, input.y, ops);
    }

    GetBox(){

        const input_coord = this.#data[this.#tipe-1].input;  
        const input_coldata = this.#gridcont.GetColData({x:input_coord.x,y:input_coord.y});
        return input_coldata.boxs[0];
    }

}