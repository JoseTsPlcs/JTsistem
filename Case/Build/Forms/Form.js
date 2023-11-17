
class Form extends ODD {

    #grid = null;
    #windows = [];

    constructor(i){

        super(i);

        this.Build({...i});          
    }

    Build({parent=null,gridCols=[[12]],windows=[]}){

        let k = this;

        //build grid
        this.#grid = new Grid({
            parent:parent,
            cols:gridCols,
        });
        
        //build windows
        for (let w = 0; w < windows.length; w++) {
            const window = windows[w];

            var windowParent = k.#grid.GetColData({x:window.x,y:window.y}).col;

            if(windowParent==null){

                k.LogAction({type:'error',msg:['window no found parent', window]});
                return;
            }

            let wbuild = new Window({
                parent:windowParent,
                ...window,
                events:[
                    {
                        name:'boxUpdate',
                        actions:[
                            {
                                name:'window boxupdate',
                                action:({x,y,valueUpdate})=>{

                                    //console.log(w,x,y,valueUpdate);
                                    k.CallEvent({
                                        name:'boxUpdate',
                                        params:{
                                            w:w,
                                            x:x,
                                            y:y,
                                            valueUpdate:valueUpdate,
                                        }
                                    });
                                }
                            }
                        ],
                    }
                ],
            });

            k.#windows.push(wbuild);
        }
    }

    GetLabelBox({w,x,y}){
        
        var window = this.#windows[w];
        var data = window.Conteiner_GetColData({x:x,y:y});

        //console.log(w,x,y,window,data);
        /*this.LogAction({msg:{
            window:window,
            data:data,
        }})*/

        return data.labels[0].GetBox();
    }

}