
class Window extends ODD {

  /*

  --------------------------
  |          head          |
  --------------------------
  |                        |
  |                        |
  |                        |
  |          body          |
  |                        |
  |                        |
  |                        |
  --------------------------

  */

  constructor(i){
    
    super(i);
    this._General_SetVariables(i);
    this._General_Start(i);
  }

  //----------------general----------------

  _General_SetVariables(i){

    //console.log("window->",i);

    var fields = i.fields;
    if(fields!=null){

      var grid = {
        cols:[[]],
        labels:[],
      }

      var y=0;
      var x=0;
      var colLess = 12;

      fields.forEach(field => {
        
        field.x = x;
        field.y = y;
        var col = field.col;
        if(col == null) col = 12;

        var box = Param_GetBox(field.box);

        grid.cols[y].push(col);
        grid.labels.push({
          x,y,box,
          name:field.name,
        });

        colLess -= col;
        x++;
        if(colLess<=0){
          y++;
          x=0;
          colLess=12;
          grid.cols.push([]);
        }

      });
      grid.cols.splice(grid.cols.length-1,1);

      i.grid = grid;
      i.fields = fields;
    }

    return i;
  }

  _General_Start(i){

    
    this.#Fields_SetParams({...i});
    if(i.blocked !=null) this.#conteiner.blocked=i.blocked;

    this.#Body_Build({...i});

    if(i.show!=null) this.Conteiner_Show({show:i.show,slow:false});
    if(i.head!=null) this.Head_Show({show:i.head,slow:false});
  }

  //-----------------body----------------

  #body=null;

  #Body_Build({parent=null,title="window",id="w",grid={},titleSize=3,h=100}){
    
    let k = this;

    //build head - body
    this.#body = new Grid({
      id:"_body_of_window_"+id,
      name:"body of [window]"+title,
      parent,
      cols:[[12],[12]],
      attributes:[
        {y:0,x:0,attributes:[{name:'class',value:'border border-secondary h' + titleSize +' text-center'},{name:'style',value:'min-height:50px'}]},
        {y:1,x:0,attributes:[{name:'class',value:'border-right border-left border-bottom border-secondary '},{name:'style',value:'min-height:'+h+'px'}]},
      ],
      events:[
        {
          name:"rowClick",
          actions:[{
            name:"conteinerShow",
            action:({y,dom})=>{
              
              if(y==0) k.Conteiner_ShowToogle(); 
            }
          }],
        },
      ],
    });
    this.#head.dom = this.#body.GetColData({x:0,y:0}).col;
    this.#conteiner.dom = this.#body.GetColData({x:0,y:1}).col;

    //print title in head
    this.#head.dom.innerHTML = title;

    //build the conteiner
    this.#conteiner.grid = new Grid({
      name:"conteiner of [window]"+title,
      parent: this.#body.GetColData({x:0,y:1}).col,
      ...grid,
      events:[
        {
          name:'boxUpdate',
          actions:[
            {
              name:'Modulo boxUpdate',
              action:(i)=>{
                
                i.field = k._fields.find(f=>f.x==i.x&&f.y==i.y);
                //console.log("window->event boxUpdate->params:",i);
                k.CallEvent({name:'boxUpdate',params:{...i}});
              }
            }
          ],
        }
      ],
    });
   
  }

  //----------------head---------------------

  #head = {
    dom:null,
    show:true,
  };

  Head_Show({show=true,slow=false}){

    this.#head.show = show;
    const slw = slow ? 'slow' : null;
    if(this.#head.show) $('#'+this.#head.dom.id).show(slw);
    else $('#'+this.#head.dom.id).hide(slw);
  }

  //---------------fields-------------

  _fields = []
  #Fields_SetParams({fields=[]}){

    fields.forEach(field => {
      
      field = Param_GetField(field);

      //console.log("window->fields_setparams->foreach fields->field:",field);

    });

    this._fields = fields;
  }

  Fields_Get(){

    return this._fields;
  }

  Fields_GetInfo({fieldName,fieldIndex}){

    if(fieldName!=null) fieldIndex=this._fields.findIndex(f=>f.name==fieldName);
    var info = fieldIndex < 0 ? null : this._fields[fieldIndex];    
    if(info==null) console.error("window->fields_getinfo(fieldName:"+fieldName+",fieldIndex:"+fieldIndex+")",this._fields);
    return info;
  }

  Fields_GetBox({fieldName,fieldIndex}){

    //console.log("window->fieldName:",fieldName);
    //console.log("window->field: estado", this._fields.find(f=>f.name="estado"));
    
    var field = this.Fields_GetInfo({fieldIndex,fieldName});
    //console.log(field);
    var grid = this.Conteiner_Grid();
    var coldata = grid.GetColData({x:field.x,y:field.y});
    
    if(coldata==null)console.log("window - fields_getbox, params:",this._fields,fieldName,fieldIndex,"results:",coldata);
    var label = coldata.labels[0];
    return label.GetBox();
  }

  Fields_GetValue({fieldName,fieldIndex}){

    var box = this.Fields_GetBox({fieldName,fieldIndex});
    if(box==null)console.log("window-fields_getvalue, params:",fieldName,fieldIndex,"results:",box);
    return box.GetValue();
  }

  //------------------------------------

  Block({active=true}={}){

    let k = this;
    this._fields.forEach(field => {
      
      var box = k.Fields_GetBox({fieldName:field.name});
      box.Block({active});
    });
  }

  //----------------conteiner--------------------

  #conteiner= {
    show:true,
    dom:null,
    blocked:true,
    grid:null,
  };
  Conteiner_Show({show=true,slow=true,ignoreBlock=false}){

    //console.log("window->conteiner_show->params; show:",show);

    if(this.#conteiner.blocked == true && ignoreBlock == false) return;

    this.#conteiner.show = show;
    const sw = slow ? 'slow' : null;
    if(show) $('#'+this.#conteiner.dom.id).show(sw);
    else  $('#'+this.#conteiner.dom.id).hide(sw);
  }

  Conteiner_ShowToogle({}={}){

    this.Conteiner_Show({show:!this.#conteiner.show,slow:true,ignoreBlock:false});
  }

  Conteiner_Grid(){

    return this.#conteiner.grid;
  }

  Conteiner_GetColData({x=null,y=null}){
    
    return this.Conteiner_Grid().GetColData({x:x,y:y});
  }

  Conteiner_GetAllBoxes(){

    return this.Conteiner_Grid().GetAllBoxes();
  }

  Conteiner_Dom(){

    return this.#conteiner.dom;
  }

  

}