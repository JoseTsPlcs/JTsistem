
class ODD {

    _name = '';
    _setName({name=''}){this._name=name};
    _log  = true;
    #events = [];
    

    constructor({name='',log=false,events=[]}){

        this._name = name;
        this._log = log;
        this.AddEvents({events:events});
    }

    LogAction({type='log',msg='',msg1=null, msg2=null}){

        //console.log("----log action------","name:"+this._name,",msg:",msg,",type:",type);

        if(!this._log) return;
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

    #AddEvent({name=null, actions=[]}){

        if(name==null){
            this.LogAction({type:'error',msg:('error name to add event is null')});
            return;
        }

        const found = this.#events.find(e=>e.name == name);
        if(!found) this.#events.push({name:name,actions:actions});
        else
        { 
            if(actions !=null && actions.length > 0){
                
                actions.forEach(act => {
                    this.#AddActionToEvent({name:name, action:act});
                });
            }
            //else this.LogAction({type:'error',msg:('event ' + name + ' exist')});
        }
    }

    AddEvents({events=[]}){

        events.forEach(evnt => {
            this.#AddEvent({...evnt});
        });
    }

    #AddActionToEvent({name=null,description=null,action=null}){

        const nw = {
            description:description,
            action:action,
        };

        const evnt = this.#events.find(e=>e.name == name);
        if(evnt){

            evnt.actions.push(nw);
        }
    }

    AddActionsToEvents({events = []}){

        events.forEach(e => {
            
            this.#AddActionToEvent({...e});
        });
    }

    CallEvent({name=null, params=null, success=null, stop=null}){

        //console.log("---------call event ", name, this._name);
        const resp = {
            stop:false,
        }

        const event = this.#events.find(e=>e.name == name);
        if(event){

            if(event.actions.length > 0){

                event.actions.forEach(act => {
                    
                    if(act.action != null){
    
                        this.LogAction({type:'log',msg:('[event]: ' + name + ' [description]:' + act.description)});
    
                        const act_resp = act.action({...params});
                        if(act_resp){
    
                            if(!resp.stop && act_resp.stop) resp.stop = true;
                        }                   
                    }
                });

            }else this.LogAction({type:'log',msg:'[event]: ' + name});
            
        }else this.LogAction({type:'error',title:'[events]',msg:'error could found event ' + name});

        if(resp.stop){
            if(stop!=null)stop();
        }
        else if(success!=null) success();
    }

}