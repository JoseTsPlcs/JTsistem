

class Form_Conection {

    #page = null;
    #recive = null;
    #events = null;

    constructor({recive=null, page=null, title=null}){

        this.#page = page;

        this.#events = new Events_Machie({
            title:title,
            events:[
                {name:'SetRecived',actions:[]},
            ],
        });

        this.SetRecive({recive:recive});
    }

    SetRecive({recive=null}){

        this.#events.CallEvent({name:'SetRecived', params:{recive:recive}});
        this.#recive = recive;
    }

    ConectToBack({send=null}={}){

        if(this.#page){

            if(this.#recive != null && this.#recive.from!=null){

                this.#page.PageSend({url:this.#recive.from, send:send});
            }
        }
    }
}