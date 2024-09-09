
class Box {

  //0 -> div
  //1 -> input
  //2 -> date
  //3 -> options
  //4 -> selects multiple
  //5 -> buttons class:"btn btn-primary btn-sm"
  //6 -> check
  //7 -> switch
  //8 -> search
  //9 -> text area (need to build)
  //10 -> img


  #parent = undefined;
  #blocks = [];
  Blocks_Get(){return this.#blocks};
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
  #SetDomAttribute({dom,att}){

    att.forEach(att => {
      
      dom.setAttribute(att.name,att.value);
    });
  }
  #SetAttribute({dom=null}) {
    
    this.#SetDomAttribute({dom,att:this.#att});
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

    //if(i.tipe==4)console.log("value:",i.value,",default:",i.default);
    //set value by default
    var v = i.value;
    if(v==null) v=this.#dflt;

    //if(i.tipe==4)console.log("value=default:",v);

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

      //this.#att.find(att=>att.name=="style" && att.value=="file");

      break;

      //date
      case 2:

      this.#blocks[0] = document.createElement("input");
      this.#parent.appendChild(this.#blocks[0]);

      this.#blocks[0].setAttribute("class","w-100 m-0 p-0");
      this.#blocks[0].setAttribute("type","date");

      break;

      //options
      case 3:

      this.#blocks[0] = document.createElement("select");
      this.#parent.appendChild(this.#blocks[0]);

      //this.#blocks[0].setAttribute("class","w-100 m-0 p-0");

      //create options
      for(var op=0; op < this.#options.length; op++){

        var opi = this.#options[op];
        var op_nw = document.createElement("option");
        //if(opi.class) op_nw.setAttribute("class",opi.class);
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
      this.#blocks[0].setAttribute('data-actions-box','true');

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

      if(this.#options == null || this.#options.length == 0){

        this.#blocks[0] = document.createElement("button");
        this.#parent.appendChild(this.#blocks[0]);
      }
      else
      {
        var dropdown = document.createElement("div");
        dropdown.setAttribute("class","dropdown");

        this.#blocks[0] = document.createElement("button");
        this.#blocks[0].setAttribute("class","btn btn-secondary dropdown-toggle");
        this.#blocks[0].setAttribute("type","button");
        this.#blocks[0].setAttribute("class","dropdownMenuButton"+this.#id);
        this.#blocks[0].setAttribute("data-toggle","dropdown");
        this.#blocks[0].setAttribute("aria-haspopup","true");
        this.#blocks[0].setAttribute("aria-expanded","false");
        this.#blocks[0].innerHTML = this.#name;
        dropdown.appendChild(this.#blocks[0]);

        var dropdownMenu = document.createElement("div");
        dropdownMenu.setAttribute("class","dropdown-menu");
        dropdownMenu.setAttribute("aria-labelledby","dropdownMenuButton"+this.#id);
        dropdown.appendChild(dropdownMenu);

        for(var op=0; op < this.#options.length; op++){

          var opi = this.#options[op];
          var op_nw = document.createElement("a");
          op_nw.setAttribute("class","dropdown-item");
          //op_nw.setAttribute("href","#");
          op_nw.setAttribute("id",this.#parent.id + "dropdownMenuButton" + this.#id + "_op_" + op);
          op_nw.setAttribute("value",opi.value);
          op_nw.innerHTML = opi.show;

          dropdownMenu.appendChild(op_nw);
          this.#blocks.push(op_nw);
        }

        this.#parent.appendChild(dropdown);

        /*
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown button
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </div>
        */
      }

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
          op_dom.setAttribute("id",this.#parent.id + "item-op"+op);
          this.#blocks[op+1] = op_dom;
          op_dom.setAttribute("data-tokens",op_i.show);
          op_dom.setAttribute("value",op_i.value);
          op_dom.innerHTML = op_i.show;
          this.#blocks[0].appendChild(op_dom);
        }

      }
        // Add Class  
        //$('$'+this.#blocks[0].id).selectpicker('setStyle', 'btn-large', 'add');
        //$('.selectpicker').addClass('col-lg-12').selectpicker('setStyle','add');
        //$('.selectpicker').selectpicker('render');


      break;

      //text
      case 9:

        // <div>
        //     <textarea rows="5" cols="50" placeholder="Ingresa tu texto aquí..."></textarea>
        // </div>
  

        this.#blocks[0] = document.createElement("textarea");
        this.#blocks[0].setAttribute("rows","2");
        this.#blocks[0].setAttribute("cols","50");
        this.#blocks[0].setAttribute("placeholder","Ingresa tu texto aqui...");
        this.#parent.appendChild(this.#blocks[0]);

      break;

      case 10:

        this.#blocks[0] = document.createElement("img");
        this.#parent.appendChild(this.#blocks[0]);

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

        u.#CallUpdate(this.value);
      });
      break;

      case 5:

      if(this.#options.length >= 1){

        for (let op = 1; op < this.#blocks.length; op++) {

          const option  =  this.#blocks[op];
          $('#' + option.id).click(function() {
  
            u.#CallUpdate(u.#options[op-1].value);
          });
        }
      }
      else
      {
        $('#' + this.#blocks[0]['id']).click(function() {

          u.#CallUpdate();
        });
      }

      break;

      case 6:

      $('#' + this.#blocks[1]['id']).change(function() {

        //console.log(this.checked,this.value);

        u.#CallUpdate(this.checked?1:0);
      });

      break;

      case 3:

        $('#' + this.#blocks[0]['id']).change(function() {

            
          u.#CallUpdate(this.value);
          u.#Paint();
        });

      break;

      default:

      if(this.#blocks[0].type == "file"){

        this.#blocks[0].addEventListener('change', function(event) {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              const preview = document.getElementById('preview');
              u.#value = e.target.result;
              //console.log("u:", u.#value);
              u.#CallUpdate(u.#value);
            };
            reader.readAsDataURL(file);
          }
        });
      }
      else
      {

        $('#' + this.#blocks[0]['id']).change(function() {

          
          u.#CallUpdate(this.value);
        });
      }     

    }
  }

  #CallUpdate(v){

    if(this.#tipe != 5)this.#value = v;
    if(this.#update!=null)this.#update(v);
  }

  #Format_GetValue({value=null}){

    var v = value;

    if(this.#format){

      const df =  this.#format && this.#format.decimals ? 0 : '';
      if(v == null) v = df; 

      
      if(this.#format.decimals) v = parseFloat(v).toFixed(this.#format.decimals);
      if(this.#format.ceroIsNull==true && v == 0) v = "-";
      else
      {        
        if(this.#format.start) v = this.#format.start + v;
        if(this.#format.end) v =  v + this.#format.end;
      }
    }

    return v;
  }

  #Format_GetAttributes({}={}){

    var att = [];

    if(this.#format==null)return att;

    var limit = this.#format.limit;
    if(limit){

      var v = parseFloat(this.#value);
      var limitState = v >= limit.value ? limit.more : limit.less;
      att = limitState.attributes;
    }

    return att;
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

      case 3:

        for (let op = 0; op < this.#options.length; op++) {
              
          var option = this.#options[op];
          var optionDom = this.#blocks[op+1];
          if(option.class) optionDom.className = option.class;
        }

        var optionInfo = this.#options.find(op=>op.value == this.#value);
        
        if(optionInfo && optionInfo.class){

          this.#blocks[0].setAttribute("class",optionInfo.class);
        }
        else this.#blocks[0].setAttribute("class","");

      break;

      case 7:

        d = this.#blocks[2];
        //d.setAttribute("class",this.#clss);
        //d.setAttribute("style",this.#style);

      break;

      


      default:

        var op = null;
        if(this.#options != null) op = this.#options.find(p=>p.value == this.#value);

        var clss = op !=null && op.class !=null ? op.class : this.#clss;
        var style = op !=null && op.style !=null ? op.style : this.#style;

        //console.log("box, paint by op:",op);

        var format_att = this.#Format_GetAttributes();
        if(format_att.length>0){

          var f_clss = format_att.find(f=>f.name=="class");
          if(f_clss!=null) clss = f_clss.value;
          var f_style = format_att.find(f=>f.name=="style");
          if(f_style!=null) style = f_style.value;

        }

        

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

        //this.#blocks[0].setAttribute("class","selectpicker w-100 m-0 p-0");
        //this.#blocks[0].setAttribute("multiple","");

        //console.log("box id:",this.#blocks[0]," tipe multiple select, value:",this.#value);
        $('#'+this.#blocks[0].id).selectpicker('val',this.#value);
        $('#'+this.#blocks[0].id).selectpicker('render');
        //$('#'+this.#blocks[0].id).selectpicker('selectAll');

      break;

      case 6:

      var chk = this.#value == '1';
      //console.log("set value check: " + chk);
      $('#'+this.#blocks[1].id).prop('checked', chk);

      break;

      case 8:

        $('#'+this.#blocks[0].id).selectpicker('val',this.#value);
        //$('#'+this.#blocks[0].id).selectpicker('render');
        
      break;

      case 10:

        //console.log(this.#value);
        //const url = URL.createObjectURL(this.#value);
        this.#blocks[0].src = this.#value;
        //this.#blocks[0].style.display = 'block';

        
        //this.#blocks[0].src = this.#value;

      break;

      default:
        
        var isFile = this.#blocks[0].type == "file";
        //console.log(isFile,this.#blocks[0]);
        if(!isFile) this.#blocks[0].value = this.#value;
        else  this.#blocks[0].file = this.#value;
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

    //if(this.#tipe==4) console.log("box set value:",v);
    this.#value = v;
    this.#Print();
    this.#Paint();
    //if(this.#tipe==8)this.#CallUpdate(v);
  }

  GetValue(){

    switch (this.#tipe) {

      case 1:
      if(this.#blocks[0].type=="file") return this.#value;
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

    var lastvalue = this.GetValue();
    
    //update the options data
    this.#options = ops;
    if(this.#tipe == 8 || this.#tipe==4 || this.#tipe==3){


      this.#Destroy();
      this.#parent.innerHTML = "";//this is no able
      this.#Build();
      this.#Paint();
      this.SetValue(lastvalue);
      this.#Show_SetActive({show:this.#show});
      

      //console.log("set options",this.#blocks);
      //this.#Show_SetActive({show:this.#show});

      return;
    }

    //build with new options
    //console.log("box->setoptions->params->lastvalue:",lastvalue);
    this.SetValue(lastvalue);
    this.#Print();
    this.#Show_SetActive({show:this.#show});

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
    this.#blocks = [this.#blocks[0]];
  }

  SetLastOption(){

    this.SetValue(this.#options[this.#options.length -1].value);
  }

  SetDefault(){

    this.SetValue(this.#dflt);
  }

  #show = true;
  Show_Get(){

    return this.#show;
  }

  #Show_SetActive({show,slow}){
    
    this.#show=show;
    var b = this.#blocks[0];
    
    //console.log("show_setactive->","show:",show,"box:",b,"find by id",$('#'+b.id));

    if(this.#show) $('#'+b.id).show(slow ? "slow" : null);
    else $('#'+b.id).hide(slow ? "slow" : null);
  }


  Hide(slow){
    
    this.#Show_SetActive({show:false,slow});
    //console.log("!!!!!!!!!!!!hideeee");
    
    //this.Log("hide box!!");
  }

  Show(slow){

    this.#Show_SetActive({show:true,slow});
    //this.Log("show box!!");
  }

  SetUpdate(u){

    //console.log("set new update");
    //console.log(u);
    this.#update = u;
  }

  //-----------bock-----------
  #block = false;
  #Block_Action({}={}){

    var doms = [];

    switch (this.#tipe) {

      case 6:
        doms=[...this.#blocks];
      break;
    
      default:
        doms=[this.#blocks[0]];
        break;
    }

    if(doms.length>0){

      doms.forEach(dom => {

        if(this.#block) dom.setAttribute("disabled","disabled");
        else dom.removeAttribute("disabled");
      });
    }    
  }

  Block({active=true}){

    this.#block=active;
    this.#Block_Action();
  }

}
