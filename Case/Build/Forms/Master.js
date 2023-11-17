
class Master{

  #title = '';

  #conteiner = null;
  #forms = [];
  GetForm({name=null,index=null}){

    if(index!=null) return this.#forms[index];

    return null;
  }
  //introduce forms: []
  //{
  //  tipe:0, 1-> table; 2-> modulos
  //  x:0,
  //  x:y,
  //  form: {}
  //}

  #conections = [];
  //conection -> tipe = 1
  //{
  //  master{index: 0},
  //  maid{index: 0, table:0, field:0},
  //}

  //conections tipe:
  //tipe 1 -> modulo - table
  //tipe 2 -> table - modulo
  //tipe 3 -> modulo - modulo

  #calculates = [];


  #Calculate(){

    let k = this;
    this.#calculates.forEach(c => {

      var tot = 0;

      c.sum.forEach(sm => {
        
        const fm_sm = this.GetForm({index:sm.index});
        if(fm_sm){

          const values = k.GetValues({form:fm_sm, field_name:sm.field});
          
          if(values){

            values.forEach(v => {
              if(v==null || v=='') v=0;
              tot += parseFloat(v);
            }); 
          }else console.log('error values were nulls',fm_sm, c);         
        }else console.error('error form is null, index:' + sm.index, sm);

      });

      const fmt = this.GetForm({index:c.total.index});
      if(fmt) this.SetValues({form:fmt, field_name:c.total.field, values:[tot]});
      else console.error('error form is null, index:' + c.total.index, c.total);

    });

  }

  constructor(i){

    if(i.calculates) this.#calculates = i.calculates;
    if(i.title) this.#title = i.title;

    this.#Build({...i});
  }

  #Build({parent=null,title='master',cols=[[12]], forms=[], conections=[]}){

    let k = this;

    var att = [];
    for (let y = 0; y < cols.length; y++) {
      const row = cols[y];
      for (let x = 0; x < row.length; x++) {
        const col = row[x];
        
        att.push({x:x,y:y,attributes:[{name:'class',value:'p-3'}]});
      }
    }

    //build conteiner
    this.#conteiner = new Window({
      parent:parent,
      title:title,
      hsz:2,
      grid:{
        attributes:att,
        cols:cols,
      }
    });

    const forms_count = forms.length;
    //set conections
    conections.forEach(cnx => {
      
      var m_master = null;
      if(cnx.master !=null){

        if(cnx.master.index!=null){

          if(cnx.master.index < forms_count)m_master = forms[cnx.master.index];
          else console.log("error index >= max(" + forms_count + ")", cnx.master);

        }else console.log("error cnx{master:{index}} is null", cnx);

      }else console.log("error no found {master} in conection", cnx);

      var m_maid = null;
      if(cnx.maid !=null){

        if(cnx.maid.index!=null){

          if(cnx.maid.index < forms_count)m_maid = forms[cnx.maid.index];
          else console.log("error index >= max(" + forms_count + ")", cnx.maid);

        }else console.log("error cnx{maid:{index}} is null", cnx);

      }else console.log("error no found {maid} in conection", cnx);

      if(m_maid != null && m_master !=null){

        switch(cnx.tipe){
        
          //modulo - table
          case 1:

          //m_maid.form.state_base = 'list';
          //m_maid.form.state_start = 'block';

          //master reload -> maid reload
          k.#AddEventToForm({form:m_master.form, events:[
            //master reload -> maid reload
            {         
              name:'reload_after', 
              description:'list maid when master reload',
              action:(i)=>{

                var f_maid = k.#forms[cnx.maid.index];
                if(f_maid != null){

                  if(i.data != null && i.data.length > 0){

                    const primary = i.data[0]['PRIMARY'];
                    if(primary != null){
  
                      f_maid.SetState({name:'list',field:cnx.maid.field,value:primary});
  
                    }else console.error("error master primary", i);
  
                  }
                  else
                  {
                    f_maid.SetState({name:'block'});
                    //console.error("error master[index:"+ cnx.master.index + "] reload resp{data}", i);
                  }
                }
                else console.error("error maid[index:" + cnx.maid.index + "]", i, k.#forms);
                
                
              },
            },
            //master new -> maid block
            {              
              name:'new_before',
              description:'master new -> maid block',
              action:(i)=>{
                
                var f_maid = k.#forms[cnx.maid.index];
                  if(f_maid != null){

                    f_maid.SetState({name:'block'});
                  }
              },
            },
            //master add -> maid block
            {              
              name:'add_after',
              description:'master new -> maid block',
              action:(i)=>{
                
                var f_maid = k.#forms[cnx.maid.index];
                if(f_maid != null){
                  console.log("set block maid by master if master is add");
                  f_maid.SetState({name:'block'});
                }
              },
            },
            //delete maid when master delete
            {
              name:'delete_before',
              description:'delete maid when master delete',
              action:(i)=>{

                var f_maid = k.#forms[cnx.maid.index];
                if(f_maid != null){

                  f_maid.Delete({needconfirm:false});
                }
              },
            },
          ]});
            
  
          break;

          //table - modulo
          case 2:

            k.#AddEventToForm({form:m_master.form, events:[
              //master reload -> maid hide
              {
                name:'reload_after',
                description:'master reload -> maid hide',
                action:()=>{

                  var f_maid = k.#forms[cnx.maid.index];
                  if(f_maid != null){

                    //f_maid.SetState({state_name:'add'});
                    f_maid.Show({show:false,slow:true});
                  }
                }
              },
              //master new -> maid new
              {
                name:'new_before',
                description:'master new -> maid new',
                action:(i)=>{

                  var f_maid = k.#forms[cnx.maid.index];
                  if(f_maid != null){

                    f_maid.Show({show:true,slow:true});
                    f_maid.SetState({name:'new'});
                  }

                  return {stop:true};
                }
              },
              //master delete -> maid delete
              {
                name:'delete_after',
                description:'master delete -> maid delete',
                action:(i)=>{

                  if(i.primary != null){

                    var f_maid = k.#forms[cnx.maid.index];
                    if(f_maid != null){

                      f_maid.Delete({needconfirm:false});
                      
                    }else console.log("error maid no exist", cnx, k.#forms);

                  }else console.log("error primary is null", i);
                }
              },
              //master edit -> maid reload
              {
                name:'edit_update',
                description:'master edit the maid',
                action:({primary=null}=i)=>{
                  
                  if(primary!=null){

                    const f_maid = k.GetForm({index:cnx.maid.index});
                    if(f_maid!=null){

                      f_maid.Show({show:true,slow:true});
                      f_maid.SetState({name:'search', primary:primary});                     
                    }

                  }else console.log("error primary is null couldnt edit",i);
                }
              },
              //master block -> maid hide
              {
                name:'block_before',
                description:'master block -> maid hide',
                action:()=>{

                  var f_maid = k.#forms[cnx.maid.index];
                  if(f_maid != null){

                    f_maid.SetState({name:'add'});
                    f_maid.Show({show:false,slow:true});
                  }
                }
              },
            ]});

            m_maid.form.state_base = 'search';
            k.#AddEventToForm({form:m_maid.form, events:[
              //maid add -> master add
              {
                name:'add_after',
                description:'maid add -> master add',
                action:(i)=>{ 

                  //console.log("------maid add", i);
                  const nw = i.nw;
                  if(nw !=null){

                    var f_master = k.#forms[cnx.master.index];
                    //console.log(".----------master add", nw, f_master);
                    if(f_master != null){

                      f_master.Add({
                        temporal:[{field:cnx.master.field, value: nw}],
                      });
                    }
                  }
                  
                }
              },
              //maid cancel -> master reload
              {
                name:'cancel_before',
                description:'maid cancel -> master reload',
                action:(i)=>{

                  var f_master = k.#forms[cnx.master.index];
                  if(f_master) f_master.ReloadState();
                }
              },
              //maid save -> master reload
              {
                name:'save_after',
                description:'maid save -> master reload',
                action:(i)=>{

                  var f_master = k.#forms[cnx.master.index];
                  if(f_master) f_master.ReloadState();
                }
              },
            ]});

          break;

          //modulo - modulo
          case 3:

            const edit_exist = false;

            //m_master.form.selects = [{table:0,field:cnx.master.field,as:'master_conection'}]
            k.#AddEventToForm({form:m_master.form, events:[
              //master reload -> maid hide
              {
                name:'reload_after',
                description:'master reload -> maid hide',
                action:(i)=>{

                  var f_maid = k.#forms[cnx.maid.index];
                  if(f_maid != null){

                    f_maid.SetState({name:'add'});
                    f_maid.Show({show:false,slow:true});
                    //console.log('--------------miad modulo modulo', i.data[0][(0 + '_' + cnx.master.field)]);
                    //f_maid.SetState({state_name:'search',primary:i.data[0][(0 + '_' + cnx.master.field)]});

                    
                  }
                }
              },
              //master clear -> maid hide
              {
                name:'clear_before',
                description:'master clear -> maid hide',
                action:()=>{

                  var f_maid = k.#forms[cnx.maid.index];
                  if(f_maid != null) f_maid.Show({show:false,slow:true});
                }
              },
              //master delete -> maid delete
              {
                name:'delete_after',
                description:'master delete -> maid delete',
                action:(i)=>{

                  if(i.primary != null){

                    var f_maid = k.#forms[cnx.maid.index];
                    if(f_maid != null){

                      f_maid.Delete({needconfirm:false});
                      
                    }else console.log("error maid no exist", cnx, k.#forms);

                  }else console.log("error primary is null", i);
                }
              },
              //master edit -> maid reload
              {
                name:'edit_update',
                description:'master edit the maid',
                action:({primary=null}=i)=>{
                  
                  if(primary!=null){

                    const f_maid = k.GetForm({index:cnx.maid.index});
                    if(f_maid!=null){

                      f_maid.Show({show:true,slow:true});
                      f_maid.SetState({name:'search', primary:primary});                     
                    }

                  }else console.log("error primary is null couldnt edit",i);
                }
              }
            ]});

            m_maid.form.state_base = 'add';
            k.#AddEventToForm({form:m_maid.form, events:[
              //maid add -> master add
              {
                name:'add_after',
                description:'maid add -> master add',
                action:(i)=>{ 

                  //console.log("------maid add", i);
                  const nw = i.nw;
                  if(nw !=null){

                    var f_master = k.#forms[cnx.master.index];
                    //console.log(".----------master add", nw, f_master);
                    if(f_master != null){

                      f_master.Add({
                        temporal:[{field:cnx.master.field, value: nw}],
                      });
                    }
                  }
                  
                }
              },
              //maid cancel -> master reload
              {
                name:'cancel_before',
                description:'maid cancel -> master reload',
                action:(i)=>{

                  var f_master = k.#forms[cnx.master.index];
                  if(f_master) f_master.SetState({name:'reload'});
                }
              },
              //maid save -> master reload
              {
                name:'save_after',
                description:'maid save -> master reload',
                action:(i)=>{

                  var f_master = k.#forms[cnx.master.index];
                  if(f_master) f_master.Load({success:f_master.ReloadState()});
                }
              },
            ]});

          break;


            m_master.form.selects = [{table:0,field:cnx.master.field,as:'master_conection'}]

            const tm_m_e1 = [
              //master reload -> maid hide
              {
                name:'reload_after',
                description:'master reload -> maid hide',
                action:()=>{

                  var f_maid = k.#forms[cnx.maid.index];
                  if(f_maid != null){

                    //f_maid.SetState({state_index:2});
                    f_maid.Show({show:false});
                  }
                }
              },
              //master edit -> maid reload
              {
                name:'box_update',
                description:'master edit the maid',
                action:(i)=>{

                  console.log("master edit", i);
                  if(i.field.edit){

                    const p_cnc = cnx.master;
                    const p_as = 'master_conection';
                    const primary = i.data[p_as];

                    if(primary!=null){

                      const f_maid = k.GetForm({index:cnx.maid.index});
                      if(f_maid!=null){

                        const cond = {
                          and:true,
                          conditions:[{
                            table:0,
                            field:cnx.maid.field,
                            inter:'=',
                            value:primary,
                          }],
                        };

                        f_maid.Show({show:true,slow:true});
                        f_maid.SetState({name:'search', conditions:[cond]});
                      }

                    }else console.log("error primary is null couldnt edit", i, p_cnc, cnx, p_as);
                  }
                }
              }
            ];

            if(m_master.form.events != null) m_master.form.events.push(...tm_m_e1);
            else m_master.form.events = tm_m_e1;

            m_maid.form.state_start = 2;
            m_maid.form.events = [
              //maid add -> master add
              {
                name:'add_after',
                description:'maid add -> master reload',
                action:(i)=>{ 

                  //console.log("------maid add", i);
                  const nw = i.new;
                  if(nw !=null){

                    var f_master = k.#forms[cnx.master.index];
                    //console.log(".----------master add", nw, f_master);
                    if(f_master != null){

                      f_master.Load();
                    }
                  }
                  
                }
              },
              //maid cancel -> master reload
              {
                name:'cancel_after',
                description:'maid cancel -> master reload',
                action:(i)=>{

                  var f_master = k.#forms[cnx.master.index];
                  if(f_master) f_master.SetState({name:'reload'});
                }
              },
              //maid save -> master reload
              {
                name:'save_after',
                description:'maid save -> master reload',
                action:(i)=>{

                  var f_master = k.#forms[cnx.master.index];
                  if(f_master) f_master.Load();
                }
              },
            ]

          break;
        }
      }      

    });

    //set calculates
    this.#calculates.forEach(c => {
      
      c.update.forEach(u => {
        
        this.#AddEventToForm({form:forms[u].form, events:[
          {
            name:'print_after',
            description:'calculate after print',
            action:()=>{this.#Calculate()},
          },
          {
            name:'box_update',
            description:'calculate after box update',
            action:()=>{this.#Calculate()},
          },
        ]});

      });

    });
    
    //build the forms
    this.#BuildForms({forms:forms});

  }
  
  #SetConection({m_maid=null, m_master=null, cnx=null}){



  }

  #BuildForms({forms=[]}){

    let k = this;

    const f_start = [];
    const fm_total = forms.length;
    var fm_count = 0;

    //build forms
    for (let f = 0; f < fm_total; f++) {
      
      const fi = forms[f];

      if(fi.form != null){

        //cancel state start
        f_start.push({index:f,start:fi.form.state_start,recive:fi.form.recive});
        fi.form.state_start = false;

        //when loaded add to list of loaded
        this.#AddEventToForm({form:fi.form, events:[{
          name:'loaded',
          description:'build when all was loaded',
          action:()=>{
            
            OneFormLoaded();
          }
        }]});

        //set parent to the build
        const m_coldata = this.#conteiner.Conteiner_GetColData({x:fi.x, y:fi.y});
        if(m_coldata){

          const f_parent = m_coldata.col;
          var f_build = null;

          switch(fi.tipe){

            case 1://table
    
            f_build = new Form_Table({parent:f_parent, ...fi.form});
    
            break;

            case 2://modulos
    
            f_build = new Form_Modulos({parent:f_parent, ...fi.form});
    
            break;
    
          }

          this.#forms.push(f_build);

        }else console.error("sorry we cant build form with out a parent coord(" + fi.x + "," + fi.y + ")");

      }else console.error("cant build if form[" + f + "] no have {form:{}}", fi, forms);

    }

    function OneFormLoaded() {
      

      fm_count++;
      if(fm_count>=fm_total){

        //set states
        f_start.forEach(st => {

          k.#forms[st.index].SetRecive({recive:null,state_start:st.start,recive:st.recive});
        });
      }      
    }
  }

  GetForm({index=null}){

    return this.#forms[index];
  }

  #AddEventToForm({form=null, events = []}){

    if(form.events==null) form.events = [];
    form.events.push(...events);

    //console.log(form);
  }

  GetValues({form=null,field_name=null}){

    if(form){

      const fi = form._fields.find(f=>f.name == field_name);
      if(fi){

        var values = [];
        fi.boxs.forEach(bx => {
          
          values.push(bx.GetValue());
        });

        return values;
      }else console.log("erro could found field:" + field_name, form); return null;
    }else console.log("error form is null coudnt found values"); return null;
  }

  SetValues({form=null,field_name=null, values=[]}){

    if(form){

      const fi = form._fields.find(f=>f.name == field_name);
      if(fi){

        for (let y = 0; y < values.length; y++) {

          const vi = values[y];
          const bx = fi.boxs[y];
          if(bx) bx.SetValue(vi);
          else console.log("error couldnt found box y:" + y, fi);
        }
      }else console.log("error couldnt found field in form", form, field_name);
    }
  }

}
