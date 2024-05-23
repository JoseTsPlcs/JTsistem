
class Form_Base {

  #log = {
    loads:false,
    reload:true,
    save:false,
    add:false,
    delete:false,
    states:false,
  }

  _add_after_reloadstate = true;

  #conection = null;

  #primary = {
    table:0,
    as:'PRIMARY',
    data: null,
  };
  _form = null;
  _build = null;
  _data = null;
  _dataInfo = null;
  _filters = [];
  _fields = []//[]->
  // {
  //   x:0,
  //   y:0,
  //   box:{},
  //   conection:{table:0,field:0,default:0},
  // }

  _extras = {
    joins:[],
    selects:[],
    orders:[],
    conditions:[],
    groups:[],
  }

  #Data_GetOptionsByLoad({load_index=null}){

    const data = this._data.Load_GetData({load_index:load_index});
    const options = [];
    data.forEach(d => {
      
      options.push({value:d.value,show:d.show});
    });

    return options;
  }

  #log_actions = true;
  LogAction({action_name=''}) {
    
    const f_name = this._form ? this._form.Modulo_GetTitle() : ""; 

    //if(this.#log_actions) console.log(f_name + " " + action_name);
  }

  #events = [
    {name:'form_add_before', actions:[]},
    {name:'add_after', actions:[]},

    {name:'reload_before', actions:[]},
    {name:'reload_after', actions:[]},

    {name:'new_before', actions:[]},
    {name:'new_after', actions:[]},

    {name:'save_before', actions:[]},
    {name:'save_after', actions:[]},

    {name:'delete_before', actions:[]},
    {name:'delete_after', actions:[]},

    {name:'cancel_before', actions:[]},
    {name:'cancel_after', actions:[]},

    {name:'clear_before', actions:[]},
    {name:'clear_after', actions:[]},

    {name:'new_before', actions:[]},
    {name:'new_after', actions:[]},

    {name:'print_before', actions:[]},
    {name:'print_after', actions:[]},

    {name:'builded', actions:[]},
    {name:'loaded', actions:[]},

    {name:'box_update', actions:[
      {description:'load field change so update values', action:(i)=>this.FieldLoadChaged(i)},
    ]},
    {name:'edit_update', actions:[]},
  ];

  _CallEvent({event_name, event_params}) {

    let k = this;

    const resp = {
      stop:false,
      data:null,
    }

    const evnt = this.#events.find(e=>e.name == event_name);
    if(evnt){

      //k.LogAction({action_name:'call event ' + event_name});
      evnt.actions.forEach(act => {
          
        if(act.action!=null){

          const a_resp = act.action({...event_params, k:k});
          if(a_resp!= null){

            if(a_resp.stop != null && a_resp.stop == true) resp.stop = true;
            if(a_resp.data !=null) resp.data = a_resp.data;
          }
          //console.log("action: ", act.description);
        }
      });
    }

    return resp;
  }

  AddActionToEvent({name, description, action}){

    this.#events.forEach(e => {
      
      if(e.name == name){

        e.actions.push({
          description: description,
          action: action,
        });
      }
    });

  }

  //------------STATE-------------

  _states = null;
  SetState(i){

    this._states.SetState({...i, form_body:this._form});
  }

  ReloadState(i={}){

    //this.Clear();
    this._states.ReloadState({form_body:this._form, ...i});
  }

  //---------------------

  constructor(i) {

    if(i==null){

      console.log("i is null", i);
      return;
    }

    let k = this;

    this.#conection = new Form_Conection({
      page:i.page,
      recive:i.recive,
    });

    //set states
    if(i.add_after_reloadstate != null) this._add_after_reloadstate = i.add_after_reloadstate;
    k._states = new Form_States({
      title:i.title,
      base:i.state_base, 
      states:i.states, 
      log:this.#log.states,
      events:[
        {name:'reload_after', description:'',action:()=>{this.Reload();}},
        {name:'new_after',description:'',action:()=>{this._New();}},
        {name:'add_after',description:'',action:()=>{this.Clear();}},
        {name:'search_after',description:'',action:({value=null})=>{this.Search({value:value})}},
        {name:'list_after',description:'',action:({field=null,value=null})=>{this.List({field:field,value:value});}},
        {name:'block_after',description:'',action:()=>{this.Block();}},
        {name:'BaseState_GoOut',description:'go back of from', action:()=>{if(true)this.#conection.ConectToBack();console.error("-----return to back-----");}},
      ,...(i.events?i.events:[])],
    });

    //extras
    if(i.selects) this._extras.selects = i.selects;
    if(i.joins) this._extras.joins = i.joins;
    if(i.orders) this._extras.orders = i.orders;
    if(i.conditions) this._extras.conditions = i.conditions;
    if(i.groups) this._extras.groups = i.groups;

    //set events
    if(i.events !=null){

      i.events.forEach(e => {
        this.AddActionToEvent({...e});
      });
    }
    
    //create form data
    this._data = new Form_Data({
      log:this.#log.loads,
      name: i.title + ' formdata',
      tables:i.tables,
      events:[
        {
          name:'loads loaded',
          actions:[{
            description:'loads loaded by formbase',
            action:(i)=>{

              LoadedAfter(i);
            }
          }],
        }
      ],
    });

    //load loads
    if(i.loads!=null&&i.loads.length>0){

      this._data.Loads_Reload({
        loads:i.loads,
      });
    }else LoadedAfter();
    

    //when load loads
    function LoadedAfter({}={}) {

      k.#primary.table = k._data.MainTableIndex();
      k.#primary.data = k._data.MainFieldPrimary();

      k._SetFields({...i});
      k.#SetFilters({filters:i.filters});

      k._CreateBody({...i});//body was created

      k._SetBoxToFields();
      k._SetUpdateToBoxs();

        
      k._CallEvent({event_name:'loaded',event_params:{recive:i.recive}});

      k.SetRecive({recive:i.recive, state_start:i.state_start});
    }
    
  }

  SetRecive({recive=null, state_start=null}){

    console.log("--------------recive-----------", recive);

    if(recive != null && recive.name != null){
          
      this.SetState({...recive, start:true});
    }
    else
    {
      if(state_start != false) this.SetState({name:state_start, start:true});
    }

  }

  _SetFields({fields = []}){

    let k = this;
    
    fields.forEach(f => {

      f.boxs = [];//to save boxs where will be the value

      if(f.delete){

        f.box = {
          tipe:5,
          class:'btn btn-danger',
          default:icons.delete,
        }
      }

      if(f.edit && f.box == null){

        f.box = {
          tipe:5,
          class:'btn btn-primary',
          default:icons.edit,
        }
      }

      if(f.box == null) f.box = {tipe:0};

      if(f.box!=null){

        if(f.box.tipe == 0 && f.update == null) f.update = false;
        if(f.box.tipe == 6 && f.box.name == null) f.box.name = f.name;
      }

      if(f.primary){
        f.box = {
          tipe:0,
        }

        f.conection = {table:this._data.MainTableIndex(), field:this.#primary.data.index, as:this.#primary.as};
      }

      if(f.x == null) f.x = 0;
      if(f.y == null) f.y = 0;

      

      if(f.field != null){

        f.conection = {field:f.field};
      }

      if(f.conection !=null){

        if(f.conection.table == null) f.conection.table = 0;
      }

      if(f.load != null && Number.isInteger(f.load)){

        f.box.options = this.#Data_GetOptionsByLoad({load_index:f.load});
      }

    });

    this._fields = fields;
  }
  
  FieldLoadChaged({field=null}){
    
    if(field != null){

      const load = field.load;
      if(load != null && Number.isInteger(load)){

        const data = this._data.Load_GetData({load_index: load});
        if(data != null){

          for (let b = 0; b < field.boxs.length; b++) {

            const bx = field.boxs[b];
            
            const primary = bx.GetValue();
            if(primary!=null){

              const di = data.find(d=>d.value == primary);   
              if(di != null){
                
                this._fields.forEach(f => {
                
                  if(f.load != null && !Number.isInteger(f.load)){
      
                    if(f.load.index == load){
                      
                      const v = di[f.load.as];
                      //console.log(field.name + "->", di, primary, f, v);
                      f.boxs[b].SetValue(v);
                    }
                  }
                });

              }//else console.log("error could find data with value " + primary, data, field);

            }else console.log("error couldnt find primary",bx, field);
          }
          

        }else console.log("erro couldnt get data of load", field);
      }
    }
    
  }

  #SetFilters({filters=[]}){

    var count_y = 0;
    filters.forEach(f => {
      
      f.x=0;
      f.y=count_y;
      count_y++;

      if(f.box == null) f.box = {tipe:1};

      if(f.conection !=null){

        if(f.conection.table == null) f.conection.table = 0;
        if(f.conection.inter == null) f.conection.inter = '=';
      }

      if(f.load !=null){
        const ops = this.#Data_GetOptionsByLoad({load_index:f.load});
        //console.log("---------ops----------", ops);
        f.box.options = ops;
      }

    });

    this._filters = filters;
    
    //console.log("filters--------------", this._filters);
  }

  #CreateBody_GetFilters(){

    const flts = {
      cols:[],
      labels:[],
    };

    const f_y=0;
    this._filters.forEach(f => {
      
      flts.cols.push([12]);

      const f_label = {x:0,y:f_y,...f};

      flts.labels.push(f_label);
    });

    //console.log("filters.................", flts);

    return flts;
  }

  _CreateBody(i={}){

    const filters_cols = [];
    this._filters.forEach(f => {
      filters_cols.push([12]);
    });
    
    let k = this;
    this._form = new Form_Body({
      h_min:0,
      ...i,
      filters:k.#CreateBody_GetFilters(),
      actions:[
        {name:'load',action:(i)=>this.Load()},
        {name:'sizes', action:(i)=>this.#SetPages({success:()=>k.ReloadState()})},

        {name:'reload', action:(i)=>this.ReloadState()},
        {name:'save', action:(i)=>this.Save()},
        {name:'new', action:(i)=>this.SetState({name:'new'})},
        {name:'delete', action:(i)=>this.Delete()},
        {name:'add', action:(i)=>this.Add()},
        {name:'cancel', action:(i)=>this.Cancel()},

        {name:'page_back', action:(i)=>{this._form.Modulo_GetTool({name:'pages'}).BackOption();this.ReloadState()}},
        {name:'pages', action:(i)=>this.ReloadState()},
        {name:'page_next', action:(i)=>{this._form.Modulo_GetTool({name:'pages'}).NextOption();this.ReloadState()}},

        ...i.actions !=null? i.actions : [],
      ],
    });

    this._CallEvent({event_name:'builded', event_params:{form:this._form}});
    this.LogAction({action_name:'create body'});
  }

  _SetBoxToFields(){


  }

  _SetUpdateToBoxs(){

    let k=this;

    for (let x = 0; x < this._fields.length; x++) {

      let fi = this._fields[x];
      for (let y = 0; y < fi.boxs.length; y++) {

        let bx = fi.boxs[y];
       
        bx.SetUpdate(()=>{
          

          const data = k._dataInfo;
          let di = (data !=null && y < data.length) ? data[y] : null;
          //console.log("-------------------------------------set update to boxs", x, fi.boxs, di);
          const prms = {
            field:fi,
            data:di,
            x:x,
            y:y,
            state:k._states.GetState(),
          };

          if(fi.edit==true){

            var primary = null;

            const cn = fi.conection;
            if(cn){

              
              const as = cn.table + '_' + cn.field;
              console.log(data, di, as);
              primary = di[as];
            }

            const fld = fi.field;
            if(fld){

              const f_slc = k._fields.find(fu=>fu.name == fld);
              if(f_slc) {

                const bxu = f_slc.boxs[y];
                primary = bxu.GetValue(); 
              }
            }

            k._CallEvent({event_name:'edit_update',event_params:{...prms, primary:primary}});

            //send

            if(fi.send && fi.send.page){
              
              fi.send.page.PageSend({url:fi.send.url, send:{...fi.send.send, value:di['PRIMARY']}});
            }

          }
          else{

            //console.log(fi);
            k._CallEvent({event_name:'box_update',event_params:{...prms}});
          }

        });
        
      }
    }
  }

  //-------sql---settings---------

  #SetPages({success=null,joins=[],conditions=[]}){

    this._form.LoadScreen_SetState({show:true});

    let k = this;
    //get total size
    k._data.GetSizeofMainTable({
      joins:joins,
      conditions:conditions,
      success:({total = 0})=>{

        //calculate total pages
        var t = parseFloat(total);
        var sz = k._form.Modulo_GetTool({name:'sizes'}).GetValue();
        var pg_t = Math.ceil(t/sz);

        if(pg_t <= 0) pg_t = 1;

        //set pages
        const pgs = [];
        for (let pg = 1; pg <= pg_t; pg++) {
          
          pgs.push({show:'pag'+pg,value:pg});
        }

        k._form.Modulo_GetTool({name:'pages'}).SetOptions(pgs);

        //confirm if current page is in pages
        const pg_box = k._form.Modulo_GetTool({name:'pages'});
        const pg_v = pg_box.GetValue();
        const pg_found = pgs.find(p=>p.value == pg_v);
        if(pg_found == null){

          pg_box.SetValue(pgs[pgs.length-1].value);
        }

        k.LogAction({action_name:"set pages"});
        k._form.LoadScreen_SetState({show:false});
        if(success!=null) success({pages: pg_t});

    }});

  }

  #Selects_Base({extras = []}={}){

    const slcs = [];

    //primary
    slcs.push({table:this.#primary.table,field:this.#primary.data.index,as:this.#primary.as});

    //fields
    this._fields.forEach(fi => {
      
      const fc = fi.conection;
      if(fc != null){

        const as = fc.table + "_" + fc.field;
        slcs.push({table:fc.table, field:fc.field, as:as});
      }
    });

    //extras
    this._extras.selects.forEach(e => {
      slcs.push(e);
    });

    return slcs;

  }

  #Conditions_Filters({}={}){

    const cnds = [];

    //filters
    this._filters.forEach(fi => {
      
      if(fi.conection!=null){

        const filter_coldata = this._form.Filter_GetCol_Data({x:fi.x,y:fi.y});
        const input = filter_coldata.labels[0].GetBox();
        const value = input.GetValue();

        const cond = {
          and:true,
          conditions:[],
        };

        if(fi.box.tipe != 4){

          cond.conditions.push({
            and:false,
            table:fi.conection.table,
            field:fi.conection.field,
            inter:fi.conection.inter,
            value:input.GetValue(),
          });

        }else{

          input.GetValue().forEach(v => {
            
            cond.conditions.push({
              and:false,
              table:fi.conection.table,
              field:fi.conection.field,
              inter:fi.conection.inter,
              value:v,
            });
          });

          cond.conditions.push({
            and:false,
            table:fi.conection.table,
            field:fi.conection.field,
            inter:'IS',
            value:'NULL',
          });
        }

        if(fi.box.tipe == 1 && fi.conection.inter=='LIKE' && (value == '' || value == null)){

          cond.conditions.push({
            and:false,
            table:fi.conection.table,
            field:fi.conection.field,
            inter:'IS',
            value:'NULL',
          });
        }

        cnds.push(cond);
      }
      
    });

    cnds.push(...this._extras.conditions);

    return cnds;
  }

  #Limit_Pages(){
    
    var pg = this._form.Modulo_GetTool({name:'pages'}).GetValue();
    var sz = this._form.Modulo_GetTool({name:'sizes'}).GetValue();

    var pgi = (pg-1)*sz;
    var lmt = [pgi, sz];

    return lmt;
  }

  #Inserts_Base({}={}){

    const ins = [];

    //by fields
    this._fields.forEach(fi => {
      
      const fi_cn = fi.conection;
      const fi_bx_pri = fi.boxs[0];

      if(fi.edit == null && fi_cn != null && fi_cn.table == 0 && fi_bx_pri !=null /*&& fi_bx_pri.GetTipe() != 0*/){

        const v = fi_bx_pri.GetValue();
        const t = fi_bx_pri.GetTipe();
        if(t != 0 || (t == 0 && v != null)) ins.push({field: fi_cn.field, value: v});
        
      }
    });

    return ins;
  }


  //----action----


  Reload({success=null}={}){

    let k = this;
    const cnds = this.#Conditions_Filters();
    const jns = this._extras.joins;

    this.#SetPages({
      conditions:cnds,
      joins:jns,
      success:()=>{

        const lmt = this.#Limit_Pages(); 
        k.Reload_Base({
          selects:k.#Selects_Base(),
          conditions:cnds,
          joins:jns,
          limit:lmt,
          orders:k._extras.orders,
          success:success,
          groups:k._extras.groups,
        });
      }
    })
    
  }

  Reload_Base({success=null,selects=[],conditions=[],limit=[],orders=[],groups=[]}={}){

    this.LogAction({action_name:"reload"});
    this._CallEvent({event_name:"reload_before", event_params:{}});

    //----------------------------------------------

    let k = this;
    this._form.LoadScreen_SetState({show:true});
    this._data.MainLoad({
      selects:selects,
      conditions:conditions,
      limit:limit,
      joins:k._extras.joins,
      orders:orders,
      groups:groups,
      log_sql:k.#log.reload,
      log_resp:k.#log.reload,
      success:function(resp){
        
        k._form.LoadScreen_SetState({show:false});

        const e_after = k._CallEvent({event_name:'reload_after',event_params:{data:resp}});
        if(e_after!=null&&e_after.data!=null) resp = e_after.data;
        k._dataInfo = resp;

        k._Print({data:resp});
        if(success != null) success({data:resp});
        
      }
    })

  }

  Search({success=null, value = null}){

    this.Reload_Base({
      selects:this.#Selects_Base(),
      conditions:[{
        and:true,
        conditions:[{
          table:this.#primary.table,
          field:this.#primary.data.index,
          inter:'=',
          value:value,
        }],
      }],
      joins:this._extras.joins,
      limit:[0,1],
      success:success,
    });
  }

  List({success=null, field = null, value = null}){
    
    let k=this;
    const cnds = [{
      and:true,
      conditions:[{
        table:this.#primary.table,
        field:field,
        inter:'=',
        value:value,
      }],
    }];
    const jns = this._extras.joins;

    this.#SetPages({
      conditions:cnds,
      joins:jns,
      success:()=>{

        const lmt = this.#Limit_Pages();
        k.Reload_Base({
          selects:this.#Selects_Base(),
          limit:lmt,
          conditions:cnds,
          joins: jns,
          orders: k._extras.orders,
          success:success,
        }); 
      }
    });

  }

  _Print({data=[]}={}){

    const e_before = this._CallEvent({event_name:'print_before',event_params:{data:data}});
    if(e_before!=null&&e_before.data!=null) data = e_before.data; 

    for (let d = 0; d < data.length; d++) {

      const di = data[d];

      this._fields.forEach(fi => {
        
        const fi_bx = fi.boxs[d];
        const fi_cn = fi.conection;

        if(fi.edit == null && fi.edit == null && fi_bx !=null){

          var fi_as = null;
          if(fi_cn !=null) fi_as = fi_cn.as ? fi_cn.as : fi_cn.table + '_' + fi_cn.field;
          else fi_as = fi.name;

          if(fi_as != null){

            const fi_v = di[fi_as];
            if(fi_v != null) fi_bx.SetValue(fi_v);
          }

        }
        
      });
    }

    this._fields.forEach(fi=>{

      this.FieldLoadChaged({field:fi});
    });

    this._CallEvent({event_name:'print_after',event_params:{data:data}});
  }

  Clear(){

    this._CallEvent({event_name:'clear_before', params:{}});

    this._fields.forEach(fi => {
      
      fi.boxs.forEach(bx => {
        
        bx.SetDefault();
      });
    });
  }

  Cancel({}={}){

    this._CallEvent({event_name:'cancel_before',event_params:{}});
    this.Clear();
    this._states.ClearSearchData();
    this.ReloadState();
  }

  Save({justdiferents=false, success=null}={}){

    this.LogAction({action_name:'save'})

    this._CallEvent({event_name:'save_before',event_params:{}});
    this._form.LoadScreen_SetState({show:true});
  
    const d_t = this._data.MainGetData().length;
    let k = this;
    var d_count = 0;

    for (let di = 0; di < d_t; di++) {
      
      k._Save_DataOne({data_index:di, justdiferents:justdiferents, success:function(){

        SaveOne_Loaded();
        //if(success!=null) success();
      }})
    }

    function SaveOne_Loaded(){

      d_count++;
      if(d_count >= d_t){

        Save_Loaded();
      }
    }

    function Save_Loaded() {
      
      k._CallEvent({event_name:'save_after',event_params:{resp:true}});
      k._form.LoadScreen_SetState({show:false});
      
      
      k._states.ClearSearchData();
      k.ReloadState();
      if(success!=null)success();
    }

  }

  _Save_DataOne({data_index = null, justdiferents = false, success=null, useloadscreen=false}){

    this.LogAction({action_name:"save one"});
    if(useloadscreen) this._form.LoadScreen_SetState({show:true});

    const data = this._dataInfo;
    let k = this;

    if(data_index == null || data_index >= data.length){

      console.log("error we need data_index", data_index);
      if(useloadscreen) this._form.LoadScreen_SetState({show:false});
      return;
    }

    const data_line = data[data_index];

    //get primary
    const primary = data_line[this.#primary.as];
    if(primary == null){

      console.log("error we need PRIMARY", data_line);
      if(useloadscreen) this._form.LoadScreen_SetState({show:false});
      return;
    }

    //get sets of fields
    const sets = [];

    for (let f = 0; f < this._fields.length; f++) {

      const fi = this._fields[f];
      
      //get conection && get box
      const fi_c = fi.conection;
      const f_box = fi.boxs[data_index];


      if(fi.edit == null && fi.delete == null && fi_c != null && fi_c.table == this._data.MainTableIndex() && f_box !=null){

        const v_dom = f_box.GetValue();

        //put all values
        if(!justdiferents){

          sets.push({field: fi_c.field, value:v_dom});
        }
        //put just values diferents, dom != v_data
        else
        {

          //get value of data
          const fi_as = fi_c.as !=null ? fi_c.as : fi_c.table + "_" + fi_c.field;
          const v_data = data_line[fi_as];

          if(v_data != v_dom && v_data && v_dom){

            sets.push({field:fi_c.field, value:v_dom});
          }
        }

      }

    }

    if(sets.length == 0){

      //console.log("look up! sets in update is []", sets);
      SaveOne_Loaded({useloadscreen:useloadscreen});
      return;
    }

    console.log(this.#primary);

    const t_mn = this.#primary.table
    const t_mn_f_pri = this.#primary.data;
    const pri =  data_line[this.#primary.as];

    if(pri != null){

      this._data.MainUpdate({
        sets:sets,
        log_sql:this.#log.save,
        conditions:[{
          and:true,
          conditions:[{
            table:t_mn,
            field:t_mn_f_pri.index,
            inter:'=',
            value:pri,
          }]
        }],
        success: function(){

          SaveOne_Loaded({success:success,useloadscreen:useloadscreen});
        },
      });
    }
    else{

      console.log("error cant find pri", pri, data_line, t_mn_f_pri);
      SaveOne_Loaded({useloadscreen:useloadscreen});
    }  

    function SaveOne_Loaded({success=null,useloadscreen=false}) {
      
      if(useloadscreen)k._form.LoadScreen_SetState({show:false});
      if(success!=null)success();
    }

  }

  _New({success=null}={}){

    this._CallEvent({event_name:'new_before', event_params:{}});
    if(success!=null) success();
  }

  Add({success=null,temporal=[]}={}){

    let k = this;

    //if primary key is not autoincrement 
    if(true || this.#primary.data.Extra == ""){

      k._form.LoadScreen_SetState({show:true});
      this._data.Main_GetNewPrimary({success:(resp)=>{

        k._form.LoadScreen_SetState({show:false});
        Insert({nw:resp.new});
      }})

    }else {

      Insert({nw:null});
    }

    
    function Insert({nw=null}={}) {

      const ins = [...k.#Inserts_Base(), ...temporal];

      if(nw!=null) ins.push({field:k.#primary.data.index,value:nw});

      if(k._states.search.value != null) ins.push({...k._states.search});

      k.Add_Base({inserts:ins, success:success, nw:nw});
    }

  }

  Add_Base({success=null, inserts=[], nw=null}){

    let k = this;
    this.LogAction({action_name:'add'});
    this._form.LoadScreen_SetState({show:true});

    const e_resp = k._CallEvent({event_name:'form_add_before', event_params:{}});
    if(e_resp != null && e_resp.stop){

      k._form.LoadScreen_SetState({show:false}); 
      return; 
    }

    k._data.MainInsert({
      inserts: inserts,
      log_resp:k.#log.add,
      log_sql:k.#log.add,
      success:function(resp){
        
        k._CallEvent({event_name:'add_after', event_params:{resp:resp, inserts:inserts, nw:nw}});
        k._form.LoadScreen_SetState({show:false});   
        k.ReloadState(k._add_after_reloadstate? {value:nw} : null);
      }
    });
  }

  Delete({success=null, needconfirm=true}={}){

    var delete_confirm = false;
    if(needconfirm) delete_confirm = confirm("desea borrar los datos mostrados en " + this._form.Modulo_GetTitle());
    else delete_confirm = true;

    if(!delete_confirm)return;

    this._CallEvent({event_name:'delete_cancel', event_params:{needconfirm:needconfirm}});

    let k = this;
    const dt = this._data.MainGetData();
    const total = dt.length;
    var count = 0;

    for (let di = 0; di < total; di++) {
      
      k._Delete_DataOne({data_index:di, success:()=> OneDeleted()});
    }

    if(count == 0) ConfirmDelete();

    function OneDeleted() {
      
      count++;
      if(count >= total) ConfirmDelete();
    }

    function ConfirmDelete() {
      
      if(count >= total){

        k._states.ClearSearchData();
        k.ReloadState();
        if(success!=null)success();
      }
    }


  }

  _Delete_DataOne({data_index=null, success=null, useloadscreen=false, reloadafter=false}){

    if(data_index == null){

      console.log("error data_index is null", data_index);
      return;
    }

    const data = this._dataInfo;
    const max = data.length;
    if(data_index >= max){

      console.log("error data index is mayor than max: " + max, data_index);
      return;
    }

    //get data one
    const data_one = data[data_index];

    //get primary
    const primary = data_one['PRIMARY'];
    if(primary == null){

      console.log("error we need PRIMARY", data_line);
      return;
    }

    const t_mn = this.#primary.table;
    const t_f = this.#primary.data;
    if(t_f==null){

      console.log("error cant find primary field", t_f);
      return;
    }
    const f_mn = t_f.index;

    let k = this;

    this.LogAction({action_name:'delete one'});
    this._CallEvent({event_name:'delete_before',event_params:{}});
    if(useloadscreen) this._form.LoadScreen_SetState({show:true});

    this._data.MainDelete({
      conditions:[{
        and:true,
        conditions:[{
          table:t_mn,
          field:f_mn,
          inter:'=',
          value:primary,
        }]
      }],
      log_resp:false,
      log_sql:this.#log.delete,
      success:function(){

        if(useloadscreen) k._form.LoadScreen_SetState({show:false});
        k._CallEvent({event_name:'delete_after',event_params:{primary:primary}});
        if(success!=null)success();
      }
    });

    //this._data.Main
  }

  Block({success=null}={}){
    
    this.LogAction({action_name:'block'});

    this._CallEvent({event_name:'block_before'});

    if(success!=null) success();
  }

  Show(i){

    this._form.Show(i);
  }

  Toggle(){


  }

  Load({success=null}={}){

    let k = this;
    k._form.LoadScreen_SetState({show:true});
    k.LogAction({action_name:'load data'});

    /*this._data.Load_Reload({success:()=>{

      k._fields.forEach(fi => {
        
        if(fi.load!=null){

          if(Number.isInteger(fi.load)){

            fi.boxs.forEach(bx => {
              
              bx.SetOptions(k.#Data_GetOptionsByLoad({load_index:fi.load}));
              
            });
          }
        }
        
      });

      k._fields.forEach(fi=>{

        this.FieldLoadChaged({field:fi});
      });

      k._form.LoadScreen_SetState({show:false});
      
      k.ReloadState();
      if(success!=null)success();

    }});*/
  }

  //----------Conection-------------


}
