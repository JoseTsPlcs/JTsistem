
class Table_Grid extends ODD {

  #parent = null;
  #body_space = null;

  constructor(i){

    super(i);
    this.#SetParams(i);
    this.#Build(i);
  }

  #fields = [];
  #linesDoom = [];

  #SetParams({fields,parent}){

    if(parent==null)parent=document.body;
    //console.log(fields);
    this.#fields=fields;
    this.#fields.forEach(f=>{

      f.boxs=[];
    });

    //console.log({...fields});
  }

  Fields_Add({name,box,attributes=[]}){

    this.#fields.push({
      name,box,
    });

    var x = this.#fields.length-1;
    const th = document.createElement("th");
    th.setAttribute("id",this.#parent.id+"_header_"+x);
    //f.dom = th;
    th.setAttribute("scope","col");
    this.#header_line.appendChild(th);
    th.innerHTML = name;

    //console.log(this.#header_line);

    setDomAttributes({dom:th,attributes,startAttributes:[]});

    //console.log("tble-grid add gield", this.#fields);
  }

  //-------------------------------
  
  //#parent = null;
  #header_line =null;

  #Build({parent=null,attributes=[],h}){

    if(parent == null){

      console.log("error parent is null", parent);
      return;
    }
    this.#parent = parent;

    //create table responsive
    const tb_r = document.createElement("div");

    console.log("create tablle",attributes,tb_r);

    setDomAttributes({
      dom:tb_r,
      startAttributes:[
        {name:"class",value:"table-responsive"},
        {name:"style",value:(h!=null?"min-height: "+h+"px":"")},
      ],
      attributes,
    });

    //tb_r.setAttribute("class", "table-responsive");
    //stb_r.setAttribute("style","min-height: "+h+"px");

    parent.appendChild(tb_r);

    //create table
    const tb = document.createElement("table");
    tb.setAttribute("class","table");
    tb_r.appendChild(tb);

    //create space in header
    const space_header = document.createElement("thead");
    tb.appendChild(space_header);

    //create space of body
    this.#body_space = document.createElement("tbody");
    tb.appendChild(this.#body_space);

    //create headers
    this.#header_line = document.createElement("tr");
    space_header.appendChild(this.#header_line);

    var x = 0;
    this.#fields.forEach(f => {
      
      const th = document.createElement("th");
      th.setAttribute("id",parent.id+"_header_"+x);
      x++;
      f.dom = th;
      th.setAttribute("scope","col");
      this.#header_line.appendChild(th);

      th.innerHTML = f.name;

      if(f.attributes){
        
        f.attributes.forEach(att => {
        
          th.setAttribute(att.name, att.value);
        });
      }
    });

  }

  //-------------------------------

  Fields_SetValues({values=[],fieldName,boxNew}){

    let k = this;
    //console.log("table grid field:",fieldName," box:",boxNew);

    var field = this.#fields.find(f=>f.name==fieldName);
    if(field==null){

      console.log("error in tableGrid no found fieldName: " + fieldName, "fields:",this.#fields);
      return;
    }

    var fieldIndex = this.#fields.findIndex(f=>f.name==fieldName);

    var addlines = values.length - this.#linesDoom.length;
    if(addlines>0){

      for (let ln = 0; ln < addlines; ln++) {
        
        this.#AddLine({});
      }
    }else {

      for (let ln = 0; ln < Math.abs(addlines); ln++) {
        
        this.#linesDoom[this.#linesDoom.length - 1].line.innerHTML=""; 
        this.#linesDoom.pop();
        this.#fields.forEach(field => {
          
          field.boxs.pop();
        });   
      }
    }  

    //console.log(fieldName,field);

    field.boxs = [];
    for (let y = 0; y < values.length; y++) {

      const value = values[y];
      var parent = this.#linesDoom[y].cells[fieldIndex].td;
      parent.innerHTML = "";//delte build boxs

      var boxConfig = boxNew ? boxNew : field.box;

        field.boxs.push(new Box({
          parent,
          ...boxConfig,
          value:value,
          update:()=>{

            //console.log("box update .table grid");
            k.CallEvent({name:"boxUpdate",params:{x:fieldIndex,y,field}});
          }
        }));
    }
  }

  Fields_Add({value,fieldName,boxNew}){


  }

  #Field_ReplaceBox({fieldName,y,boxNew,value}){


  }

  Fields_GetBoxs({fieldName}){

    var field = this.#fields.find(f=>f.name==fieldName);
    return field.boxs;
  }

  Fields_GetValues({fieldName}){

    var boxs = this.Fields_GetBoxs({fieldName});
    return boxs.map((bx)=>{ return bx.GetValue()});
  }

  Fields_GetAll(){

    return this.#fields;
  }

  Clear(){

    this.#linesDoom.forEach(doom => {
      
      doom.cells.forEach(cll=>{

        cll.td.innerHTML="";
      })
    });
    this.#linesDoom=[];

  }

  //---------------------

  #AddLine({}){

    const body_line = document.createElement("tr");
    this.#body_space.appendChild(body_line);

    this.#linesDoom.push({
      line:body_line,
      cells:[],
    });
    const line_index = this.#linesDoom.length-1;
    for (let x = 0; x < this.#fields.length; x++) {
      
      var field = this.#fields[x];
      this.#AddCell({
        line:body_line,
        x,y:line_index,
        box:{},
        attributes:field.attributes,
      })      
    }

  }

  #AddCell({line=null, x=null, y=null, attributes=[]}){

    const td = document.createElement("td");
    td.setAttribute("id",this.#parent.id+ "-td-" + "_" + "x-"+x+"_y-"+y)
    line.appendChild(td);

    attributes.forEach(att => {
        
      td.setAttribute(att.name, att.value);
    });

    /*var bx = new Box({
      parent: td,
      ...this.#fields[x].box,
    });*/

    this.#linesDoom[y].cells.push({
      td: td,
      //box: bx,
    });

  }
  
  RemoveLine({y}){

    this.#fields.forEach(field => {
      
      field.boxs.splice(y,1);
    });

    var line = this.#linesDoom[y];
    console.log("line",line);
    var tr = line.line;
    tr.remove();
  }
  
}
