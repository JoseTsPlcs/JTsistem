
class Form_States {

    #log = true;
    Log({error=false, params=null}) {
      
      if(error) console.error(this.#title, params);
      else console.log(this.#title, params);
    }

    #title = '';
    #events = null;
    #form_body = null;
    #data = [
        {name:'reload',action:null,tools:[
          {name:'filter',show:true},
          {name:'load',show:false},
          {name:'sizes',show:true},
          {name:'reload',show:true},
          {name:'save',show:false},
          {name:'new',show:false},
          {name:'delete',show:false},
          {name:'add',show:false},
          {name:'cancel',show:false},
          {name:'page_back',show:true},
          {name:'pages',show:true},
          {name:'page_next',show:true},
        ]},
        {name:'new',action:null,tools:[
          {name:'filter',show:false},
          {name:'load',show:false},
          {name:'sizes',show:false},
          {name:'reload',show:false},
          {name:'save',show:false},
          {name:'new',show:false},
          {name:'delete',show:false},
          {name:'add',show:true},
          {name:'cancel',show:true},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
        ]},
        {name:'block',action:null,tools:[
          {name:'filter',show:false},
          {name:'load',show:false},
          {name:'sizes',show:false},
          {name:'reload',show:false},
          {name:'save',show:false},
          {name:'new',show:false},
          {name:'delete',show:false},
          {name:'add',show:false},
          {name:'cancel',show:false},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
        ]},
        {name:'search',action:null,tools:[
          {name:'filter',show:false},
          {name:'load',show:false},
          {name:'sizes',show:false},
          {name:'reload',show:true},
          {name:'save',show:true},
          {name:'new',show:false},
          {name:'delete',show:true},
          {name:'add',show:false},
          {name:'cancel',show:true},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
        ]},
        {name:'add',action:null,tools:[
          {name:'filter',show:false},
          {name:'load',show:false},
          {name:'sizes',show:false},
          {name:'reload',show:false},
          {name:'save',show:false},
          {name:'new',show:false},
          {name:'delete',show:false},
          {name:'add',show:true},
          {name:'cancel',show:false},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
        ]},
        {name:'list',action:null, tools:[
          {name:'filter',show:false},
          {name:'load',show:false},
          {name:'sizes',show:false,value:999},
          {name:'reload',show:true},
          {name:'save',show:true},
          {name:'new',show:true},
          {name:'delete',show:false},
          {name:'add',show:false},
          {name:'cancel',show:false},
          {name:'page_back',show:false},
          {name:'pages',show:false},
          {name:'page_next',show:false},
        ]},
      ];

    #lastvalue = 'reload';
    #value = 'reload';
    #base = 'reload';
    GetState(){

      return this.#value;
    }
    GetStateBase(){
      return this.#base;
    }

    search = {
      field:null,
      value:null,
    }
    GetConditionsBySearch({table_main=0}){

      return [{
        and:true,
        conditions:[{
          table_main:table_main,
          field:this.search.field,
          inter:'=',
          value:this.search.value,
        }],
      }]
    }
    ClearSearchData(){

      this.search= {
        field:null,
        value:null,
      };
    }


    constructor({base='reload',events=[],states=[], title='', log=true}){

      this.#log = log;
      this.#title = title;

      //events
      var e = [
        {name:'GoTo_BaseState', actions:[]},
        {name:'BaseState_GoOut', actions:[]},
      ];

      this.#data.forEach(d => {
        
        e.push({name:d.name + '_before', actions:[]});
        e.push({name:d.name + '_after', actions:[]});
      });

      this.#events = new Events_Machie({events:e, title:this.#title + ' states'});
      this.#events.AddActionsToEvents({events:events});

      //-------
      this.#SetDatasStates({states:states});
      this.#base = base;
    }

    SetState({start=false,name=null,form_body=null,success=null,value=null,field=null}){

      if(form_body == null){

        this.Log({error:true, params:'set state ' + name + ' error {formbody} is null'});
        return;
      }  

      if(name == null || name === false){

        if(start){

          name = this.#base;
        }
        else{

          this.Log({error:true, params:' error name of state is null'});
          return;
        }        
      }
      
      const index = this.#data.findIndex(d=>d.name == name);
      if(index == -1){

        this.Log({error:true,params:['error state name: ' + name + ' no exist in data', this.#data]});
        return;
      }

      if(this.#value!=this.#base && name == this.#base){

        this.#events.CallEvent({name:'GoTo_BaseState',params:{}});
      }

      if(name != this.#base && this.#value == this.#base){

        this.#events.CallEvent({name:'BaseState_GoOut'});
      }

      this.#value = name;
      this.Log({params:['set state ' + name, this.#data.find(d=>d.name==name)]});

      let k = this;
      this.#events.CallEvent({name:this.#value + '_before', params:{}, success:()=>{

        const data = k.#data[index];

        //for each tool of state
        data.tools.forEach(t => {
          
          const bx = form_body.Modulo_GetTool(t);
          if(bx){

            if(t.value != null && (start || k.#lastvalue != k.#value)) bx.SetValue(t.value);       

            if(t.show) bx.Show();
            else bx.Hide();
            
          }else console.error('no found box', t);

        });

        k.#lastvalue = k.#value;

        //get params
        var params = {};
        switch(k.#value){

          case 'search':
            if(value == null) value = this.search.value;
            else this.search.value = value;

            if(value == null) k.SetState({name:'add', start:start, form_body:form_body});

            params={value:value};
          break;

          case 'list':
            if(value == null) value = this.search.value;
            else this.search.value = value;

            if(field == null) field = this.search.field;
            else this.search.field = field;

            if(value == null) k.SetState({name:'add', start:start, form_body:form_body});

            params={field:field,value:value};
          break;
        }

        k.#events.CallEvent({name:k.#value + '_after', params:params});

        if(success!=null) success();
      }});

    }

    #SetDataState({name=null, tools=[]}){

      const di = this.#data.find(d=>d.name == name);
      if(di){

        tools.forEach(t => {
          
          const fi = di.tools.find(tu=>tu.name == t.name);
          if(fi){

            if(t.value!=null) fi.value = t.value;
            if(t.show!=null) fi.show = t.show;
            
          }else console.error('error no found tool ' + t.name + ' of state ' + name, di);

        });

      }else console.error('error no found ' + name, this.#data);
    }

    #SetDatasStates({states=[]}){

      states.forEach(st => {
        
        this.#SetDataState({...st});
      });

    }

    ReloadState(i){

      this.SetState({name:this.#base, ...i});
    }
}