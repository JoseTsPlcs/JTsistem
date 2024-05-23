
class Crud_Body extends ODD {

  /*

    --------------------------------------------------------
    |                         title                         |
    --------------------------------------------------------
    |                                                      |
    |   ------------------------------------------------   | 
    |   |                   -config-                   |   |
    |   |                   1.filters                  |   |
    |   |                                              |   |
    |   ------------------------------------------------   |
    |   | config,loads                       excel,pdf |   |
    |   ------------------------------------------------   |
    |   |----------------------------------------------|   |
    |   |----------------------------------------------|   |
    |   ||              window(head:false)            ||   |
    |   ||                                            ||   |
    |   ||                                            ||   |
    |   ||                                            ||   |
    |   ||                                            ||   |
    |   |----------------------------------------------|   |
    |   ------------------------------------------------   |
    |   |                   reload,save            back|   |
    |   |sizes               add,insert           pages|   |
    |   |                     cancel               next|   |
    |   ------------------------------------------------   |
    |                                                      |
    --------------------------------------------------------

    */

  constructor(i){

    super(i);

    //-------start------

    this._General_SetVariables({...i});
    this.#Modal_Build({...i});
    this.#Form_Build({...i});
    this.#Config_Build({...i});
  }

  _General_SetVariables({headCrud}){

    this._head = headCrud;
  }

  _head = null;

   //---------------modal---------

   _modal = null;
   #Modal_Build({modal=false,parent,title}){

      if(modal){

        this._modal = new Modal({parent,name:title});
      }       
   }
   
   Modal_SetActive({active=true}){
       //console.log(this._name,"modal_setactive active:"+active);
       if(this._modal!=null)this._modal.SetActive({active:active});
   }

  //----------form-----------
 
  _form = null;
  #Form_Build({parent,name,title="form body",blocked,head,show,h=500,windows=[],events=[],configShow=false}={}){
    
    if(this._modal!=null) parent = this._modal.GetContent();

    let k = this;
    //console.log("crud_body->form_build->blocked:",blocked,"show:",show);

    this._form = new Form({
      name:"conteiner(form)of "+name,
      configShow,
      parent,title,blocked,head,show,h,
      windows,
      tools:this.#tools,
      events:[
        {
          name:"boxUpdate",
          actions:[
            {
              name:"base of form",
              action:(i)=>{

                //console.log("crud_body->event boxUpdate",i);
                k._FieldsUpdate_Add({
                  fieldIndex:i.field.index,
                  value:i.valueUpdate,
                  y:0,
                });
              }
            }
          ],
        },
        ...events,
      ],
    });
  }

  Form_GetBuild(){

    return this._form;
  }

  Form_GetWindow({windowIndex}){

    return this._form.Window_GetWindow({windowIndex});
  }

  //---------print----------

  Print_BuildBoxes({data=[]}={}){

    
  }

  Clear({}={}){

    let k = this;

    var windows = this._form.Window_GetAll();
    //console.log("crud_body->clear->result; windows:",windows);

    windows.forEach(window => {
      
      window.build.Fields_Get().forEach(field=>{

        var box = k._form.Window_Fields_GetBox({
          windowIndex:field.windowIndex,
          fieldName:field.name,
        });

        if(box.GetTipe()!=5) box.SetDefault();

      });
    });


  }

  Block({active=true}={}){

    var windows = this._form.Window_GetAll();
    windows.forEach(window => {
      
      window.build.Block({active});
    });
  }

  //-----------update---------

  _fieldsUpdate = [];

  _FieldsUpdate_Add({fieldIndex,boxIndex,value,y}){

    var fupIndex = this._fieldsUpdate.findIndex(fup=>fup.y==y);
    if(fupIndex==-1){
        
        var newIndex = this._fieldsUpdate.length;
        this._fieldsUpdate.push({
            index:newIndex,
            y:y,
            fields:[{fieldIndex,value}],
        });
        this._fieldsUpdate.total = newIndex+1;

    }else
    {

        var fup = this._fieldsUpdate[fupIndex];
        var field = fup.fields.find(f=>f.fieldIndex==fieldIndex);

        if(field==null) fup.fields.push({fieldIndex,value});
        else field.value = value;
    }

  }

  FieldsUpdate_Clear({}={}){

    this._fieldsUpdate=[];
  }

  FieldsUpdate_GetData(){

    return this._fieldsUpdate;
  }

  Fields_GetBoxes({fieldName,fieldIndex}){

    return [];
  }

  Fields_GetBox({boxIndex,fieldName,fieldIndex}){

    var boxes = this.Fields_GetBoxes({fieldName,fieldIndex});
    var box = null;
    if(boxes.length > boxIndex) box = boxes[boxIndex];
    else console.error("crud_body->Fields_GetBox(boxindex:"+boxIndex+",fieldname:"+fieldName+") return ", box);

    return box;
  }

  Fields_SetOptions({fieldName,fieldIndex,options}){

    var boxes = this.Fields_GetBoxes({fieldIndex,fieldName});
    //console.log("crud_body->fields_setoptions->params; options:",options,"fieldName:",fieldName,"->result; boxes:",boxes);

    boxes.forEach(box => {
      
      box.SetOptions(options);
    });
  }

  Fields_SetValue({boxIndex,fieldName,fieldIndex,value}){

    var box = this.Fields_GetBox({boxIndex,fieldName,fieldIndex});
    if(box) box.SetValue(value);
  }

  Fields_GetValue({boxIndex,fieldName,fieldIndex}){

    var box = this.Fields_GetBox({boxIndex,fieldName,fieldIndex});
    
    if(box==null){

      console.error("crud_body - fields_getvalue(boxIndex:"+boxIndex+",fieldName:"+fieldName+",fieldIndex:"+fieldIndex+")");
      return null;
    }

    return box.GetValue();
  }

  //-----------tools--------

  #tools=[
    {name:'config',x:0,y:1,box:{tipe:5,value:icons.settings,class:'btn btn-outline-primary btn-sm'}},
    {name:'load',x:0,y:1,box:{tipe:5,value:icons.load,class:'btn btn-outline-primary btn-sm'}},

    {name:'excel',x:2,y:1,box:{tipe:5,value:"excel",class:'btn btn-outline-success btn-sm'}},
    {name:'pdf',x:2,y:1,box:{tipe:5,value:"pdf",class:'btn btn-outline-danger btn-sm'}},

    {name:'sizes',x:0,y:3,box:{tipe:3,value:1,options:[{value:1,show:'1'},{value:10,show:'10'},{value:25,show:'25'},{value:999,show:'999'},]}},

    {name:'reload',x:1,y:3,box:{tipe:5,value:'recargar',class:'btn btn-outline-primary btn-sm'}},
    {name:'save',x:1,y:3,box:{tipe:5,value:'guardar',class:'btn btn-outline-primary btn-sm'}},
    {name:'new',x:1,y:3,box:{tipe:5,value:'nuevo',class:'btn btn-outline-primary btn-sm'}},
    {name:'delete',x:1,y:3,box:{tipe:5,value:'borrar',class:'btn btn-outline-danger btn-sm'}},
    {name:'add',x:1,y:3,box:{tipe:5,value:'añadir',class:'btn btn-outline-primary btn-sm'}},
    {name:'cancel',x:1,y:3,box:{tipe:5,value:'cancelar',class:'btn btn-outline-danger btn-sm'}},

    {name:'page_back',x:2,y:3,box:{tipe:5,value:'<',class:'btn btn-outline-primary btn-sm'}},
    {name:'pages',x:2,y:3,box:{tipe:3,value:1,options:[{value:1,show:'pag1'},{value:2,show:'pag2'},{value:3,show:'pag3'}]}},
    {name:'page_next',x:2,y:3,box:{tipe:5,value:'>',class:'btn btn-outline-primary btn-sm'}},
  ];

  Tools_Get({}={}){

    return [...this.#tools];
  }

  Tools_GetBox({name}){

    return this._form.Tools_GetBox({name});    
  }

  Tools_List(){

    return this._form.Tools_Get();
  }

  Tools_Set({tools=[]}){

    //console.log("crud_body->tools_set->params; tools:",tools);

    let k = this;
    this.#tools.forEach(toolBuild => {
      
      var toolSetFound = tools.find(t=>t.name==toolBuild.name);
      var toolSet = toolSetFound ? toolSetFound : {name:toolBuild.name,show:false};
      k._Tools_OneSet(toolSet);

    });
  }

  _Tools_OneSet({name,show,value}){

    var box = this.Tools_GetBox({name});
    if(box){

        if(show!=null){

            if(show)box.Show();
            else box.Hide();
        }

        if(value!=null) box.SetValue(value);
    }
    
  }

  //----------config-----------

  #config={
    parent:null,
    build:null,
  }

  Config_GetBuild(){

    return this.#config.filter.build;
  }

  #Config_Build({filters}={}){
    
    let k = this;
    this.#config.parent = this._form.Config_Dom();
    this.#config.build = new Config({
      name:"config of "+this._name,
      parent:this.#config.parent,
      filters,
      events:[
        {
          name:"reloadUpdate",
          actions:[{
            action:()=>{

              k.CallEvent({name:"filter_reload"});
              k._head.States_SetState({state:"reload"});
            }
          }],
        }
      ],
    });
  }

  Config_Filters_GetValue({filterName,filterIndex}){

    var v = this.#config.build.Filters_GetValue({filterName,filterIndex});
    return v;
  }

  Config_Filters_GetBox({filterName,filterIndex}){

    return this.#config.build.Filters_GetBox({filterName,filterIndex});
  }

  Config_Filters_GetAll(){

    return this.#config.build.Filter_GetAll();
  }

  Config_Filters_GetConditions(){

    return this.#config.build.Filters_GetConditions();
  }  

  

}
