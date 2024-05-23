
class Events_Machie {

    #events = [];
    #title = '';
    #log = true;
    //{name:'',actions:[{description:'',action:()}]}


    constructor({events = [],title='',log=false}){

        this.#events = events;
        this.#title = title;
        this.#log = log;
    }

    NewEvent({name=null}){

        const found = this.#events.find(e=>e.name == name);
        if(!found) this.#events.push({name:name,actions:[]});
    }

    AddActionToEvent({name=null,description=null,action=null}){

        const nw = {
            description:description,
            action:action,
        };

        const evnt = this.#events.find(e=>e.name == name);
        if(evnt){

            evnt.actions.push(nw);
        }
        //else console.error('error couldnt found event named ' + name, this.#events);
    }

    AddActionsToEvents({events = []}){

        events.forEach(e => {
            
            this.AddActionToEvent({...e});
        });
    }

    CallEvent({name=null, params=null, success=null, stop=null}){

        //console.log('try call ' + this.#title + ' event ' + name);

        const resp = {
            stop:false,
        }

        const event = this.#events.find(e=>e.name == name);
        if(event){

            event.actions.forEach(act => {
                    
                if(act.action != null){

                    const act_resp = act.action({...params});
                    if(act_resp){

                        if(!resp.stop && act_resp.stop) resp.stop = true;
                    }

                    this.LogEvent({params:(name, event.description)});
                }
            });

        }else this.LogEvent({params:('couldnt found event ' + name, this.#events)});

        if(resp.stop){
            if(stop!=null)stop();
        }
        else if(success!=null) success();
    }

    LogEvent({params=null,error=false}){

        const print = (this.#title + " ",params);

        if(error)console.error(print);
        else console.log(print);
    }
}