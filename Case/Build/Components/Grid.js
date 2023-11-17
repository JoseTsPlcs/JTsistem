

class Grid extends ODD {

  //build div =class col-#

  #parent = null;
  Get_Parent(){

    return this.#parent;
  }

  #conteiner = null;
  #data = [];
  //{}
  GetAllBoxes({boxs=true,labels=true}={}){

    const total = [];

    this.#data.forEach(d => {

      d.cols.forEach(c => {
        
        if(boxs) total.push(...c.boxs);

        if(labels){

          c.labels.forEach(lb => {

            total.push(lb.GetBox());
          });
        }
      });

      
    });

    return total;
  }
  GetAllFilters({}={}){

    const total = [];

    this.#data.forEach(d => {

      d.cols.forEach(c => {
        
        total.push(...c.labels);
      });
    });

    return total;

  }

  constructor(i) {

    super(i);

    if(i.parent) this.#parent = i.parent;
    else this.#parent = document.body;

    this.#Build(i);
  }

  #DomSetAttribute({dom=null, attributes=[]}){

    attributes.forEach(atti => {
      
      if(atti.name=='class') dom.className += " " +  atti.value;
      else dom.setAttribute(atti.name, atti.value);
    });
  }
  
  #Build({cols=[[12]],attributes=[],boxs=[],labels=[]}){

    let k = this;

    //create content where going stay rows and cols
    this.#conteiner = document.createElement('div');
    this.#conteiner.id = this.#parent.id + '_conteiner';
    this.#parent.appendChild(this.#conteiner);

    //create estructure
    //for each row
    for (let y = 0; y < cols.length; y++) {
      const row = cols[y];
      
      //create row
      var row_div = document.createElement('div');
      row_div.setAttribute('class', 'row w-100 m-0 p-0');
      row_div.setAttribute('id', this.#conteiner.id + '_row_'+ y);
      this.#conteiner.appendChild(row_div);

      const row_data = {
        row:row_div,
        cols:[],
      };

      //for each columns in row
      for (let x = 0; x < cols[y].length; x++) {
        const col = cols[y][x];
        
        //create colum
        var col_div = document.createElement('div');
        col_div.setAttribute('id', row_div.id + '_div_' + x +'_' + y);
        col_div.setAttribute('class','col-' + cols[y][x] + ' m-0 p-0');
        row_div.appendChild(col_div);

        const col_data = {
          col: col_div,
          boxs:[],
          labels:[],
        }

        //put col data in row
        row_data.row.appendChild(col_data.col);
        row_data.cols.push(col_data);

      }

      //put row data in data
      this.#data.push(row_data);
    }

    //set attributes
    attributes.forEach(atts => {
      
      var dom = null;
      if(atts.x != null){

        dom = this.GetColData({x:atts.x,y:atts.y}).col;
      }else{

        dom = this.GetRowData({y:atts.y}).row;
      }

      if(dom !=null){

        if(atts!=null){

          this.#DomSetAttribute({dom:dom, attributes: atts.attributes});

        }else console.log("error no have attributes", atts);

      }else console.log("error couldnt find dom to box", box, atts);
    });

    //create boxs in cols
    boxs.forEach(box => {
      
      const col = this.GetColData({x:box.x,y:box.y});
      if(col !=null){

        const b_nw = new Box({
          parent : col.col,
          id: col.boxs.length,
          ...box.box,
          /*update:(v)=>{

            //k.CallEvent({name:'boxUpdate',params:{x:box.x,y:box.y,valueUpdate:v}});
          }*/
        });

        col.boxs.push(b_nw);

      }else console.log("error couldnt find col to box",boxs, box, col);
    });
    
    //create labels in cols
    labels.forEach(label => {
      
      const col = this.GetColData({x:label.x,y:label.y});
      if(col !=null){
        
        label.box = {
          ...label.box,
          update:(v)=>{
            
            k.CallEvent({name:'boxUpdate',params:{x:label.x,y:label.y,valueUpdate:v}});
          }
        }

        const b_nw = new Label({
          parent : col.col,
          ...label,
        });

        col.labels.push(b_nw);

      }else console.log("error couldnt find col to label", label, col);
    });

  }

  GetRowData({y=null}){

    if(y==null){
      console.log("error y is null",y);
      return;
    }

    const y_max = this.#data.length;
    if(y>=y_max){
      console.log("error y >= " + y_max,y, y_max);
      return;
    }

    return this.#data[y];
  }

  GetColData({x=null,y=null}){

    const rowdata = this.GetRowData({y:y});

    if(rowdata==null){

      console.log("error row is null", y, rowdata);
      return;
    }
    
    if(x==null){
      console.log("error x is null",x);
      return;
    }

    const x_max = rowdata.cols.length;
    if(x>=x_max){
      console.log("error x >= " + x_max,x, x_max);
      return;
    }
    
    return rowdata.cols[x];
  }

  GetParent(){

    return this.#parent;
  }

  GetLabel({name=null}={}){

    if(name == null){

      console.error("this grid need name to find label", this.#data);
      return;
    }

    var labelfound = null;

    this.#data.forEach(d => {

      d.cols.forEach(c => {

        if(labelfound == null){

          labelfound = c.labels.find(lb=>lb.GetName() == name);
        }
      });
    });

    if(labelfound == null) console.error("couldnt found label with name " + name , this.#data);

    return labelfound;
  }

}
