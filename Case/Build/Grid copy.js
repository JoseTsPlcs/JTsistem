

class Grid {

  //build div =class col-#

  #parent = undefined;
  #col = [[1]];
  #col_class = '';

  #conteiner = undefined;
  #rows = [];
  #cols = []; //col {}
  #boxs_st = []; //{x:0,y:0,div:dom,box:{},col:4}
  #params_st = []; //{x:0, y:0, params: {}}
  #param_gn = {class:'m-0 p-0', style:""};

  constructor(i) {

    this.#parent = i.parent ? i.parent : document.body;
    this.#col = i.col ? i.col : [[1]];
    this.#col_class = i.col_class ? ' ' + i.col_class : '';
    this.#boxs_st = i.boxs ? i.boxs : [];
    this.#params_st = i.params ? i.params: [];
    if(i.param_gn) this.#param_gn = i.param_gn;

    this.#Build();
  }

  #DomSetAttributes({dom=null,attributes=[]}){

    attributes.forEach(att => {
      

      dom.setAttribute(att[0], att[1]);
    });
  }

  #Build({cols=[[12]]}={}){

    //create content where going stay rows and cols
    this.#conteiner = document.createElement('div');
    this.#conteiner.id = this.#parent.id + '_conteiner';
    this.#parent.appendChild(this.#conteiner);

    //create rows and columns
    for (var y = 0; y < this.#col.length; y++) {

      //create rows
      var row_div = document.createElement('div');
      row_div.setAttribute('class', 'row w-100 m-0 p-0');
      row_div.setAttribute('id', this.#parent.id + '_row_'+ y);
      this.#conteiner.appendChild(row_div);
      this.#rows[y] = row_div;

      var row_col = this.#col[y];

      for (var x = 0; x < row_col.length; x++) {

        var col_div = document.createElement('div');
        col_div.setAttribute('id', this.#parent.id + '_div_' + x +'_' + y);
        row_div.appendChild(col_div);

        //add new block
        this.#cols.push({x:x, y:y, div: col_div, box: null, col: row_col[x]});
      }
    }

    //add box
    for (var b = 0; b < this.#boxs_st.length; b++) {

      var bi = this.#boxs_st[b];
      this.#BuildBox(bi.x, bi.y, bi.box);
    }

    //set Params to cols
    for (var c = 0; c < this.#cols.length; c++) {

      var ci = this.#cols[c];
      var pi = this.#param_gn;

      var pi_e = this.#params_st.find(e=>e.x==ci.x && e.y==ci.y);
      if(pi_e != null) pi = pi_e.params;

      this.#SetColParams(ci , pi);
    }
  }

  #data = [];
  #Build_1({parent=document.body, cols=[[12],[4,4,4],[3,3,3,3],[6,6]],boxs=[],labels=[]}){

    //create content where going stay rows and cols
    this.#conteiner = document.createElement('div');
    this.#conteiner.id = parent.id + '_conteiner';
    parent.appendChild(this.#conteiner);

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
        row_div.appendChild(col_div);

        const col_data = {
          col: col_div,
          boxs:[],
        }

        //put col data in row
        row_data.appendChild(col_data);
      }

      //put row data in data
      this.#data.push(row_data);
    }

    //create boxs in cols
    boxs.forEach(box => {
      
      const col = this.#GetBlock({x:box.x,y:box.y});
      if(col !=null){

        const b_nw = new Box({
          parent : col.col,
          ...box,
        });

        col.boxs.push(col);

      }else console.log("error couldnt find col to box", box, col);
    });
    

    //create labels in cols
    labels.forEach(label => {
      
      const col = this.#GetBlock({x:label.x,y:label.y});
      if(col !=null){

        const b_nw = new Label({
          parent : col.col,
          ...label,
        });

        col.boxs.push(col);

      }else console.log("error couldnt find col to label", label, col);
    });

  }

  #GetCol({x=null,y=null}){

    if(y==null){
      console.log("error y is null",y);
      return;
    }

    const y_max = this.#data.length;
    if(y>=y_max){
      console.log("error y >= " + y_max,y, y_max);
      return;
    }
    
    if(x==null){
      console.log("error x is null",x);
      return;
    }

    const x_max = this.#data[y].cols.length;
    if(x>=x_max){
      console.log("error x >= " + x_max,x, x_max);
      return;
    }
    
    return this.#data[y].cols[x];
  }

  #GetBlock(x, y){

    if(x == null){

      console.log("cant get block because x:null");
      return null;
    }

    if(y == null){

      console.log("cant get block because y:null");
      return null;
    }

    for (var i = 0; i < this.#cols.length; i++) {

      var col_i = this.#cols[i];
      var ok_x = col_i.x == x;
      var ok_y = col_i.y == y;

      if(ok_x && ok_y) return col_i;
    }

    console.log("block ("+x+":"+y+") no exist");
    return null;
  }

  GetDiv(x,y){

    var block = this.#GetBlock(x,y);
    if(block){

      return block.div;
    }
    else{

      console.log("cant find box ("+x+":"+y+") so cant get div");
      return null;
    }
  }

  #BuildBox(x, y, box){

    if(x == null){
      console.log("no build box->x:null");
      return ;
    }

    if(y == null){
      console.log("no build box->y:null");
      return ;
    }

    if(box == null){
      console.log("no build box->box:null");
      return ;
    }

    var b = this.#GetBlock(x,y);

    if(b == null){
      console.log("no build box->("+x+":"+y+") - no exist");
      return;
    }

    box.parent = b.div;
    b.box = new Box(box);
  }

  #SetColParams(b ,prms){

    if(b.div){

      b.div.className = "col-" + b.col + " " + (prms && prms.class ? prms.class: "");
      b.div.style = prms && prms.style ? prms.style: "";
      if(prms.html != null) b.div.innerHTML = prms.html;
    }
  }

  Box_SetOptions(x,y,ops){

    var bi = this.#GetBlock(x,y);
    if(bi && bi.box) bi.box.SetOptions(ops);
  }

  Box_GetValue(x,y){

    var bi = this.#GetBlock(x,y);
    //console.log(bi);
    if(bi && bi.box) return bi.box.GetValue();
    else return null;
  }

  Box_GetTipe(x,y){

    var bi = this.#GetBlock(x,y);
    if(bi && bi.box) return bi.box.GetTipe();
    else return null;
  }

  Box_SetValue(x,y,v){

    var bi = this.#GetBlock(x,y);
    if(bi){

      if( bi.box == null){
        
        console.log("sorry block x:" + x + " y:" + y + " no exist");
        return;
      }

      bi.box.SetValue(v);
    }
  }

  Box_SetDefault(x,y){

    var bi = this.#GetBlock(x,y);
    if(bi && bi.box) bi.box.SetDefault();
  }

  Box_SetUpdate(x,y,u){

    var bi = this.#GetBlock(x,y);
    if(bi && bi.box) bi.box.SetUpdate(u);
  }

  Cols_Each(e){

    for (var i = 0; i < this.#cols.length; i++) {

      var col_i = this.#cols[i];

      if(e != null) e(col_i);
    }


  }
}
