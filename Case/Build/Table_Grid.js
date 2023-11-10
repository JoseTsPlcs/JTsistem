
class Table_Grid {

  #parent = null;
  #body_space = null;
  #data = []; //-> {line:dom, cells:[{cell:dom, box:null}]}
  GetData(){

    return this.#data;
  }
  #blocks = [];

  constructor(i){


    this.#BuildTable(i)
  }

  #BuildTable({parent=null, headers=[],h_all=false}){

    if(parent == null){

      console.log("error parent is null", parent);
      return;
    }
    this.#parent = parent;

    //create table responsive
    const tb_r = document.createElement("div");
    tb_r.setAttribute("class", "table-responsive " + (h_all?"h-100":""));
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
    const header_line = document.createElement("tr");
    space_header.appendChild(header_line);
    headers.forEach(h => {
      
      const th = document.createElement("th");
      th.setAttribute("scope","col");
      header_line.appendChild(th);

      th.innerHTML = h.name;

      if(h.attributes){
        
        h.attributes.forEach(att => {
        
          th.setAttribute(att.name, att.value);
        });
      }
    });

  }

  //{lines:[]}
  //line -> {cells:[]}
  //
  AddLines({lines=[]}){

    let k = this;
    lines.forEach(ln => {
      
      k.#AddLine({cells: ln});
    });

  }

  #AddLine({cells=[]}){

    const body_line = document.createElement("tr");
    this.#body_space.appendChild(body_line);

    this.#data.push({
      line:body_line,
      cells:[],
    });
    const line_index = this.#data.length-1;

    this.#AddLine_blocks({line:body_line,index:line_index,cells:cells});

  }

  #AddLine_blocks({line=null, index=null, cells = []}){

    if(line==null){

      console.log("error we need line", line);
      return;
    }

    if(index==null){

      console.log("error we need index", index);
      return;
    }

    let k = this;
    
    //all the blocks in the line
    let x = 0;
    cells.forEach(c => {

      this.#AddCell({line:line, x:x, y:index, box:c.box, attributes:c.attributes});
      x++;
    });


  }

  #AddCell({line=null, x=null, y=null, box={}, attributes=[]}){

    const td = document.createElement("td");
    line.appendChild(td);

    attributes.forEach(att => {
        
      td.setAttribute(att.name, att.value);
    });

    //create box
    const bx = new Box({
      parent:td,
      id: this.#parent.id + "_" + "x-"+x+"_y-"+y,
      ...box,
    });

    this.#data[y].cells.push({
      td: td,
      box: bx,
    });

  }

  Clear(){

    let k = this;

    this.#body_space.innerHTML = "";
    this.#data=[];
  }

  Box_GetValue({x=-1,y=-1}){

    if(y<0){

      console.log("error y<0",y);
      return null;
    }

    if(y>=this.#data.length){

      console.log("error y>= " + this.#data.length,y);
      return null;
    }

    if(x<0){

      console.log("error x<0",x);
      return null;
    }

    if(x>=this.#data[y].cells.length){

      console.log("error x>= " + this.#data[y].cells.length,x);
      return null;
    }

    return this.#data[y].cells[x].box.GetValue();
  }

  
  
}
