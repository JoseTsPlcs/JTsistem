
class PanelCards extends PanelBuild {

    constructor(i) {

        super(i);
        this._BuildingCards({parent:this._BuildGetParent({parent:i.parent})});
    }

    _window;
    windowGet(){return this._window;}
    _divConteiner;
    _BuildingCards({parent,head,h}){

        //group of grids

        this._window = new Window({
            head,h,
            parent,
            title:this._title,
            grid:{cols:[[12]]}
        });

        //var divParent = document.createElement("div");
        //parent.appendChild(divParent);       

        this._divConteiner = document.createElement("conteiner");
        this._divConteiner.setAttribute("class","m-0 p-0");
        //this._divConteiner.setAttribute("style","min-height: 300px;")
        this._window.Conteiner_GetColData({x:0,y:0}).col.appendChild(this._divConteiner);        
    }
    fieldSetValues({fieldName,values}){

        this._ItemUpdate({count:values.length});

        super.fieldSetValues({fieldName,values});
    }

    //-------

    #items = [
        //{row, grid:null},
    ];
    _ItemAdd(){

        let k = this;

        var index = this.#items.length;

        var divRow = document.createElement("div");
        divRow.setAttribute("class","row w-100 m-0 p-0");
        
        this._divConteiner.appendChild(divRow);

        var divCol = document.createElement("div");
        divCol.setAttribute("class","col-12 m-0 p-0 border");
        divCol.setAttribute("id","item" + (index + 1));
        divRow.appendChild(divCol);

        var grid = new Grid({
            parent:divCol,
            ...GetGridConfig({panels:this._fields}),
            events:[
                {
                    name:"boxUpdate",
                    actions:[{action:(params)=>{

                        params.field = this._fields.find(f=>f.x==params.x && f.y==params.y);
                        params.recordIndex = index;
                        //console.log("grid of item of cards -> box update",params);
                        k.CallEvent({name:"boxUpdate",params});
                    }}]
                }
            ],
        });
        
        var item = {
            row:divRow,
            grid,
        };

        this.#items.push(item);
    }
    _ItemRemove({index}){

        var item = this.#items[index];
        item.row.remove();
        this.#items.splice(index,1);
    }
    _ItemUpdate({count}){

        var countCurrent = this.#items.length;
        var countDif = count - countCurrent;
        for (let index = 0; index < Math.abs(countDif); index++) {
            
            if(countDif < 0) this._ItemRemove({index:(countCurrent - 1 - index)});
            else this._ItemAdd();
            
        }

        for (let f = 0; f < this._fields.length; f++) {
            
            var field = this._fields[f];
            var boxes = [];
            this.#items.forEach(itm => {
                
                var box = itm.grid.GetColData({...field}).labels[0].GetBox();
                boxes.push(box);
            });
            //console.log("fieldname",field.name,"boxes:",boxes);
            
            this._fieldSetBoxes({fieldName:field.name,boxes});
        }

        //console.log(this.#items);
        
    }
}
