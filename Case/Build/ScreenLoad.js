
class ScreenLoad {

    #dom = null;
    #state = false;

    constructor({parent,id,state=false}){

        this.#Build({parent:parent,id:id});
        this.SetState({state:state});
    }

    #Build({parent=null, id=''}){

        if(parent==null) parent=document.body;

        const sc_3 = document.createElement('div');
        sc_3.setAttribute('class','conteiner');
        sc_3.setAttribute('id',parent.id + '_' + id + '_loading');
        parent.appendChild(sc_3);
  
        const sc_0 = document.createElement('div');
        sc_0.setAttribute('class','d-flex justify-content-center align-items-center');
        sc_0.setAttribute('style',`
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background: 50% 50% no-repeat rgb(249,249,249);
        opacity: .8;`
        );
        sc_3.appendChild(sc_0);
  
        const sc_1 = document.createElement('div');
        sc_1.setAttribute('class','spinner-border');
        sc_1.setAttribute('role','status');
        sc_0.appendChild(sc_1);
  
        const sc_2 = document.createElement('div');
        sc_2.setAttribute('class','sr-only');
        sc_2.innerHTML = 'Loading...';
        sc_1.appendChild(sc_2);
  
        this.#dom = sc_3;
    }

    SetState({state=true}){

        this.#state = state;
        if(this.#state) $('#' + this.#dom.id).show();
        else $('#' + this.#dom.id).hide();
    
    }
}