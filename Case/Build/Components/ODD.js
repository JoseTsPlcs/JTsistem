
class ODD {

    #title="";
    _name = '';
    _setName({name=''}){this._name=name};
    _log  = true;
    _logControl = [
        {
            name:'general',
            log:false,
        },
        {
            name:'events',
            log:false,
        },
    ];
    _events = [];
    GetListEvents(){

        return [...this._events];
    }
    

    constructor(i){

        //------set variables-------

        if(i){

            if(i.name!=null) this._name = i.name;this.#title=i.title;
        
            //update log control
            if(i.logControl!=null){

                i.logControl.forEach(lg => {
                
                    var lgfound = this._logControl.findIndex(li=>li.name == lg.name);
        
                    if(lgfound==-1) this._logControl.push(lg);
                    else this._logControl[lgfound].log = lg.log;
                });
            }

            if(i.events!=null)this.AddEvents({events:i.events});
            if(i.eventActives!=null)this.SetActivesEvents({eventActives:i.eventActives});
        }
        
        //------start------

        this.CallEvent({name:"started",params:i});
    }

    //------------

    LogAction({type='log',msg='',logName='general'}){

        if(this.GetLogActive({logName:logName}) == false)return;

        const msg0 = this._name + "->";
        switch(type){

            case 'log':
                console.log(msg0,msg);
            break;

            case 'error':
                console.error(msg0,msg);
            break;

            default:
                console.log(msg0,msg);
        }
    }

    GetLogActive({logName='general'}){

        var logControl = this._logControl.find(lg=>lg.name == logName);
        return logControl ? logControl.log : false;
    }

    //---------------events-------------

    #AddOneActionToEvent({eventName=null,name='',description='',tag='',order=0,active=true,action=null}){

        var evnt = this._events.find(e=>e.name == eventName);
        if(evnt==null){

            evnt = {
                name: eventName,
                actions:[],
            };
            this._events.push(evnt);
        };

        evnt.actions.push({
            name:name,
            description:description,
            order:order,
            tag:tag,
            active:active,
            action:action,
        });

        evnt.actions.sort((a,b)=>{
            return b.order-a.order;
        });
    }

    #AddOneEvent({name=null, actions=[]}){

        if(actions.length > 0){

            actions.forEach(act => {
            
                this.#AddOneActionToEvent({eventName:name,...act});
            });
        }
        else
        {
            
            if(this._events.findIndex(e=>e.name==name) == -1){

                this._events.push({
                    name: name,
                    actions:[],
                });
            }
        }

        
    }

    AddEvents({events=[]}){
        
        //if(this._name!=''&&events.length>0) console.log(this._name,events);

        events.forEach(evnt => {
            this.#AddOneEvent({...evnt});
        });
    }

    SetActiveOneAction({eventName,actionName,active=true}){

        //console.log({...this._events},this._events.length);

        const event = this._events.find(e=>e.name==eventName);
        if(event!=null){

            const action = event.actions.find(act=>act.name==actionName);
            if(action!=null){

                action.active = active;

            }else this.LogAction({type:'error',msg:['no found action named "' + actionName + '" in event "' + eventName + '"', event , actionName]});

        }else this.LogAction({type:'error',msg:['no found event "' + eventName + '"']});

    }

    CallEvent({name=null, params=null, from=''}){

        //console.log("---------call event ", name, this._name);
        const resp = {
            stop:false,
            result:null,
        }

        const event = this._events.find(e=>e.name == name);
        if(event){

            if(event.actions.length > 0){

                this.LogAction({logName:'events',msg:' event: ' + event.name +' (' + from + ')'});

                event.actions.forEach(act => {
                    
                    if(act.action != null){
    
                        this.LogAction({type:'log',logName:'events',msg: '[action]: ' + act.name + ' (' + act.active + ')'});

                        if(act.active == false) return null;

                        const act_resp = act.action({k:this,...params});
                        resp.result = act_resp;
                        
                        if(act_resp !=null){
    
                            if(!resp.stop && act_resp.stop) resp.stop = true;
                            
                            return act_resp;
                        }                   
                    }
                });

            }else this.LogAction({type:'log',msg:'[event]: ' + name});
            
        }//else this.LogAction({type:'error',logName:'events',msg:'error could found event ' + name});

        return resp.result;
        
    }

    SetActivesEvents({eventActives=[]}){

        eventActives.forEach(e => {
           
            this.LogAction({msg:{e}});
            this.SetActiveOneAction({...e});
        });
    }

}