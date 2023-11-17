
class Window extends ODD {

  /*
  |------------------------|
  |         title          |
  |------------------------|           body(grid)
  |                        |           |--------|
  |                        |           |  [12]  |
  |        conteiner       |   ---->   |--------|
  |                        |           |  [12]  |
  |                        |           |--------|
  |------------------------|
  */

  constructor(i){

    super(i);
  }

  #body=null;
  #conteiner=null;
  GetConteniner({}={}){
    
    return this.#conteiner;
  }

  #Build({parent=null,title='windowv2',cols=[[12]],boxs=[],labels=[],attributes=[],h_min=0}){

    this.#body = new Grid({
      parent:parent,
      title:title,
      cols:[[12],[12]],
      attributes:[
        {y:0,x:0,attributes:[{name:'class',value:'border border-secondary h' + hsz +' text-center'},{name:'style',value:'min-height:50px'}]},
        {y:1,x:0,attributes:[{name:'class',value:'border-right border-left border-bottom border-secondary '},{name:'style',value:'min-height:'+h_min+'px'}]},
      ],
    });

    const title_dom = this.#body.GetColData({x:0,y:0}).col;
    title_dom.innerHTML = this.Get_Title();

    this.#conteiner = new Grid({
      parent:this.#body.GetColData({x:0,y:1}).col,
      cols:cols,
      boxs:boxs,
      labels:labels,
      attributes:attributes,
    });



  }
  
  
}
