
class Box {

  //0 -> div
  //1 -> input
  //2 -> date
  //3 -> options
  //4 -> selects multiple
  //5 -> buttons
  //6 -> check
  //7 -> switch
  //8 -> search
  //9 -> text area (need to build)

  #parent = undefined;
  #blocks = [];
  #name = "";
  #id = "";

  #tipe = 0;
  #value = 0;
  #dflt = 0;
  #options = []; //{value:"", show:""}

  #clss = "";
  #style = "";
  #prms = null;
  #format = null;

  #update = null;
  #att = [];
  #SetAttribute({dom=null}) {
    
    this.#att.forEach(att => {
      
      dom.setAttribute(att.name,att.value);
    });
  }

  constructor(i) {

    if(i.tipe) this.#tipe = i.tipe;
    this.#parent = i.parent;
    if(i.name) this.#name = i.name;
    if(i.id) this.#id = i.id;
    if(i.options) this.#options = i.options;
    if(i.class) this.#clss = i.class;
    if(i.style) this.#style = i.style;
    if(i.update) this.#update = i.update;
    if(i.format) this.#format = i.format;
    if(i.attributes) this.#att = i.attributes;

    this.#prms = new Params(i.params);

    this.#Build();
    //this.#Print();

    //set default
    if(i.default == null){

      switch (this.#tipe) {

        case 3:
          
        this.#dflt = this.#options.length > 0 ? [this.#options[0].value] : 1;
        break;

        case 4:
        
        var rn = [];
        for (let op = 0; op < this.#options.length; op++) {
          const opi = this.#options[op];
          rn.push(opi.show);
        }

        this.#dflt = rn;

        break;

        case 6:
        this.#dflt = 0;
        break;

        default:
        this.#dflt = "";

      }
    }
    else this.#dflt = i.default;

    //set value by default
    var v = i.value;
    if(v==null) v=this.#dflt;

    this.SetValue(v);

    //console.log(this.#options);
  }

  #Build(){

    //build dooms
    switch (this.#tipe) {
      //div
      case 0:

      this.#blocks[0] = document.createElement("div");
      this.#parent.appendChild(this.#blocks[0]);

      this.#blocks[0].setAttribute("class","w-100 m-0 p-0 text-center");

      break;

      //input
      case 1:

      this.#blocks[0] = document.createElement("input");
      this.#parent.appendChild(this.#blocks[0]);

      this.#blocks[0].setAttribute("class","w-100 m-0 p-0");

      break;

      //date
      case 2:

      this.#blocks[0] = document.createElement("input");
      this.#parent.appendChild(this.#blocks[0]);

      this.#blocks[0].setAttribute("class","w-100 m-0 p-0");
      this.#blocks[0].setAttribute("type","date");

      break;

      //date
      case 3:

      this.#blocks[0] = document.createElement("select");
      this.#parent.appendChild(this.#blocks[0]);

      this.#blocks[0].setAttribute("class","w-100 m-0 p-0");

      //create options
      for(var op=0; op < this.#options.length; op++){

        var opi = this.#options[op];
        var op_nw = document.createElement("option");
        this.#blocks[0].appendChild(op_nw);
        this.#blocks[op+1] = op_nw;
        op_nw.value = opi.value;
        op_nw.innerHTML = opi.show;
      }

      break;

      //selects
      case 4:

      this.#blocks[0] = document.createElement("select");
      this.#parent.appendChild(this.#blocks[0]);

      this.#blocks[0].setAttribute("class","selectpicker w-100 m-0 p-0");
      this.#blocks[0].setAttribute("multiple","");

      //create options
      for(var op=0; op < this.#options.length; op++){

        var opi = this.#options[op];
        var op_nw = document.createElement("option");
        this.#blocks[0].appendChild(op_nw);
        this.#blocks[op+1] = op_nw;
        //op_nw.value = opi.value;
        op_nw.innerHTML = opi.show;
      }

      break;

      //buttons
      case 5:

      this.#blocks[0] = document.createElement("button");
      this.#parent.appendChild(this.#blocks[0]);

      this.#blocks[0].setAttribute("class","w-100 m-0 p-0 btn btn-primary btn-sm");

      break;

      //check
      case 6:

      this.#blocks[0] = document.createElement("div");
      this.#blocks[0].setAttribute("class","form-check " + this.#clss);
      this.#parent.appendChild(this.#blocks[0]);

      var chk_id = this.#parent.id + "_" + this.#id + "_flexCheckDefault";

      this.#blocks[1] = document.createElement("input");
      this.#blocks[1].setAttribute("class","form-check-input");
      this.#blocks[1].setAttribute("type","checkbox");
      this.#blocks[1].setAttribute("value","");
      this.#blocks[1].setAttribute("id", chk_id);
      this.#blocks[0].appendChild(this.#blocks[1]);

      this.#blocks[2] = document.createElement("label");
      this.#blocks[2].setAttribute("class","form-check-label");
      this.#blocks[2].setAttribute("for", chk_id);
      this.#blocks[2].innerHTML = this.#name;
      this.#blocks[0].appendChild(this.#blocks[2]);

      break;

      //search
      case 8:

      // <select class="selectpicker" data-live-search="true">
      //   <option data-tokens="ketchup mustard">Hot Dog, Fries and a Soda</option>
      //   <option data-tokens="mustard">Burger, Shake and a Smile</option>
      //   <option data-tokens="frosting">Sugar, Spice and all things nice</option>
      // </select>

      this.#blocks[0] = document.createElement("select");
      this.#blocks[0].setAttribute('class','selectpicker');
      this.#blocks[0].setAttribute('data-live-search','true');
      this.#parent.appendChild(this.#blocks[0]);

      if(this.#options){

        for (var op = 0; op < this.#options.length; op++) {

          var op_i = this.#options[op];
          var op_dom = document.createElement("option");
          this.#blocks[op+1] = op_dom;
          op_dom.setAttribute("data-tokens",op_i.show);
          op_dom.setAttribute("value",op_i.value);
          op_dom.innerHTML = op_i.show;
          this.#blocks[0].appendChild(op_dom);
        }

      }

      break;

      default:

    }

    //set id to the first block
    this.#blocks[0].id = this.#parent.id +"_block" + this.#tipe + "_" + this.#id;

    //load select boostrap to multi select
    if(this.#tipe == 4 || this.#tipe == 8) $('#'+this.#blocks[0].id).selectpicker('refresh');

    //set atributes
    this.#SetAttribute({dom:this.#blocks[0]});

    //set update
    let u = this;
    switch (this.#tipe) {

      case 0:
      $('#' + this.#blocks[0]['id']).click(function() {

        SetUpdate(this.value);
      });
      break;

      case 5:

      $('#' + this.#blocks[0]['id']).click(function() {

        SetUpdate();
      });

      break;

      case 6:

      $('#' + this.#blocks[1]['id']).change(function() {

        //console.log(this.checked);

        SetUpdate(this.value);
      });

      break;

      default:
      $('#' + this.#blocks[0]['id']).change(function() {

        SetUpdate(this.value);
      });

    }

    function SetUpdate(v) {

      u.#value = v;
      if(u.#update)u.#update(v);
    }
  }

  #Format_GetValue({value=null}){

    var v = value;

    if(this.#format){

      const df =  this.#format && this.#format.decimals ? 0 : '';
      if(v == null) v = df; 

      if(this.#format.decimals) v = parseFloat(v).toFixed(this.#format.decimals);
      if(this.#format.start) v = this.#format.start + v;
    }

    return v;
  }

  #Paint(){

    var d = this.#blocks[0];

    switch(this.#tipe){

      case 8:

        // Add Class
        var d_id = d.id;
        if(this.#clss) $('#'+d_id).addClass(this.#clss);
        $('#'+d_id).selectpicker('refresh');

      break;

      case 6:

        d = this.#blocks[2];
        //d.setAttribute("class",this.#clss);
        //d.setAttribute("style",this.#style);

      break;

      case 7:

        d = this.#blocks[2];
        //d.setAttribute("class",this.#clss);
        //d.setAttribute("style",this.#style);

      break;


      default:

        var op = null;
        if(this.#options != null && this.#value < this.#options.length) op = this.#options.find(p=>p.value == this.#value);

        const clss = op !=null && op.class !=null ? op.class : this.#clss;
        const style = op !=null && op.style !=null ? op.style : this.#style;

        //console.log(clss, op,'------paint');

        d.setAttribute("class",clss);
        d.setAttribute("style",style);

        

    }

    //this.#prms.SetToDom(d);
  }

  SetClass({clss=''}){

    this.#clss = clss;
    this.#Paint();
    //console.log("-----set class----");
  }

  #Print(){

    switch (this.#tipe) {
      case 0:

        var p_op = this.#options.find(op=>op.value == this.#value);
        this.#blocks[0].innerHTML = p_op !=null ? p_op.show : this.#Format_GetValue({value:this.#value});
      break;

      case 5:

        this.#blocks[0].innerHTML = this.#value;
      break;

      case 4:

        $('#'+this.#blocks[0].id).selectpicker('val',this.#value);
        $('#'+this.#blocks[0].id).selectpicker('render');
      break;

      case 6:

      var chk = this.#value == '1';
      //console.log("set value check: " + chk);
      $('#'+this.#blocks[1].id).prop('checked', chk);

      break;

      case 8:

        $('#'+this.#blocks[0].id).selectpicker('val',this.#value);
        $('#'+this.#blocks[0].id).selectpicker('render');
      break;

      default:
        this.#blocks[0].value = this.#value;
    }
  }

  #GetOptionShow(v){

    if(this.#options == null || this.#options.length == 0) return null;
    else {

      var op_f = this.#options.find(op=>op.value == v);
      return op_f ? op_f.show : null;
    }
  }

  SetValue(v){

    if(Array.isArray(v) && v.length > 0 && this.#tipe == 3) v = v[v.length-1];

    this.#value = v;
    this.#Print();
    this.#Paint();
  }

  GetValue(){

    switch (this.#tipe) {

      case 1:
      return this.#blocks[0].value;

      case 3:
        
      return this.#blocks[0].value;

      case 4:
      var st = "";

      var chk_t = $('#'+this.#blocks[0].id).val();
      //console.log(chk_t);

      var rst = [];
      var op_t = this.#options.length;
      for (var op = 0; op < op_t; op++) {

        var opi = this.#options[op];
        var opi_chk = chk_t.findIndex(e => e == opi['show']) != -1;
        if(opi_chk) rst.push(opi.value);
      }

      return rst;

      case 6:
      var chk = $('#'+this.#blocks[1].id).prop('checked');
      //console.log("checked: " + chk);
      return chk ? 1 : 0;

      default:
      return this.#value;
    }

  }

  GetTipe(){

    return this.#tipe;
  }

  SetOptions(ops){

    //update the options data
    this.#options = ops;
    if(this.#tipe == 8){

      this.#Destroy();
      this.#parent.innerHTML = "";//this is no able
      this.#Build();
      this.#Paint();
    }

    if(this.#tipe == 3 || this.#tipe == 4){

      for (let op = 1; op < this.#blocks.length; op++) {
        const bc = this.#blocks[op];
        bc.remove();
      }

      this.#blocks = [this.#blocks[0]];

      //create options
      for(var op=0; op < this.#options.length; op++){

        var opi = this.#options[op];
        var op_nw = document.createElement("option");
        this.#blocks[0].appendChild(op_nw);
        this.#blocks[op+1] = op_nw;
        op_nw.value = opi.value;
        op_nw.innerHTML = opi.show;
      }
    }

    this.#Print();

  }

  GetOption_Index({value=null}){

    var op_index = -1;
    const op_count = this.#options.length;
    for (var op = 0; op < op_count; op++) {
      const opi = this.#options[op];
      if(opi.value == value){
        op_index = op;
        break;
      }
    }

    return op_index;
  }

  BackOption(){

    const v = this.GetValue();
    const op_index = this.GetOption_Index({value:v});

    if(op_index != -1){

      const op_select = op_index - 1;
      if(0 <= op_select & op_select < this.#options.length) this.SetValue(this.#options[op_select].value);
    }
  }

  NextOption(){

    const op_index = this.GetOption_Index({value:this.#value});

    if(op_index != -1){

      const op_select = op_index + 1;
      if(0 <= op_select & op_select < this.#options.length) this.SetValue(this.#options[op_select].value);
    }
  }

  GetOptions(){

    return [...this.#options];
  }

  #Destroy(){

    //delete all blocks
    for (var b = this.#blocks.length-1; b >= 0; b--) {

      this.#blocks[b].remove();
    }

    //clear data build
    this.#blocks = [];
  }

  SetLastOption(){

    this.SetValue(this.#options[this.#options.length -1].value);
  }

  SetDefault(){

    this.SetValue(this.#dflt);
  }

  Hide(slow){

    $('#'+this.#blocks[0].id).hide(slow ? "slow" : null);
  }

  Show(slow){

    $('#'+this.#blocks[0].id).show(slow ? "slow" : null);
  }

  SetUpdate(u){

    //console.log("set new update");
    //console.log(u);
    this.#update = u;
  }

}
