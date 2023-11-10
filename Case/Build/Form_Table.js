
class Form_Table extends Form_Base {

  constructor(i) {

    if(i.h_min==null) i.h_min = 300;

    //state start
    const st_dflt = [
      {name:'reload', tools:[{name:'sizes',value:10,show:true}]},
      {name:'search', tools:[{name:'sizes',value:10,show:true}]},
      //{name:'list', tools:[{name:'sizes',value:10,show:true}]},
    ];

    if(i.states == null){
      i.states = st_dflt
    }else i.states = [...st_dflt, ...i.states];

    super(i);
    
    this._add_after_reloadstate = false;

    //add subscripcion to box update
    let k = this;

    this.AddActionToEvent({
      name:'box_update',
      description:'this action will save the changes in the table',
      action:({x=0,y=0,state=null})=>{

        var fi = null;
        if(x < k._fields.length) fi = k._fields[x];

        //save changes
        if(fi != null && fi.delete ==null && fi.edit == null && (fi.update != false) && state != 'new' && state != 'add')k._Save_DataOne({data_index:y, justdiferents:false, useloadscreen:true, success:()=> k.ReloadState()});

        //delete if field is delete
        if(fi){
          
          if(fi.delete){

            k._Delete_DataOne({data_index:y, success:function(){

              k.ReloadState();
            }});
          }
        }
      }, 
    });
  }

  _CreateBody(i){

    super._CreateBody(i);

    let k = this;

    //---------create table-----------

    //set headers by fields
    const headers = [];
    this._fields.forEach(f => {
      
      var h_nm = "";
      if(f.name!=null) h_nm = f.name;
      headers.push({
        name:h_nm,
        attributes:f.attributes,
      });
    });

    this._build = new Table_Grid({
      parent: k._form.Modulo_GetColData({x:0,y:2}).col,
      headers:headers,
      h_all:true,
    });

  }

  #SetLinesInTable({size=0, update=true}){

    var lines = [];
    let k = this;
    var box_default={
      tipe:0,
      default:"",
    }
    
    //create a list of lines -> blocks[] x cada linea en data
    for (let c = 0; c < size; c++) {

      var line = [];//crear una linea
      //for cada fields
      for (let fi = 0; fi < k._fields.length; fi++) {

        let f = k._fields[fi];

        //get box of field
        var f_box = f.box ? {...f.box} : {...box_default};

        line.push({
          box:f_box,
          attributes:f.attributes,
        });
      }

      lines.push(line);
    }
    
    this._build.Clear();
    this._build.AddLines({lines:lines});

    const t_d = this._build.GetData();
    for (let f = 0; f < this._fields.length; f++) {
      const fi = this._fields[f];
      fi.boxs=[];
      t_d.forEach(lni => {
          
          const f_ln_bx = lni.cells[f].box;
          fi.boxs.push(f_ln_bx);
      });
    }

    this._SetUpdateToBoxs();
  }

  _SetFields(i){

    

    super._SetFields(i);
  }

  _Print({data=[]}={}){
    
    this.#SetLinesInTable({size:data.length});
    super._Print({data:data});
  }

  _Box_GetValue({x=-1,y=-1}){

    if(x<0){

      console.log("error x<0",x);
      return null;
    }

    if(y<0){

      console.log("error y<0",y);
      return null;
    }

    return this._build.Box_GetValue({x:x, y:y});

  }

  _New(){

    super._New();

    this.#SetLinesInTable({size:1, update:false});

    this._CallEvent({event_name:'new_after'});
  }

  Clear(){

    super.Clear();
    this._build.Clear();
  }

  Block(){

    super.Block();
    this.Clear();
  }

}
