
class Toggle extends ODD {

    constructor(i){

        super(i);
        this._SetVariables(i);

        if(i.show!=null) this.Show({show:i.show,slow:false});
    }

    #dom=null;
    #show=true;
    #block=false;

    _SetVariables({dom}){

        this.#dom=dom;
    }

    Show({show=true,slow=false}){

        if(this.#block==true) return;

        this.#show=show;
        console.log(this.#dom,this.#show);
        if(this.#show) $('#'+this.#dom.id).show(slow?'slow':null);
        else $('#'+this.#dom.id).hide(slow?'slow':null);
    }

    Change({slow=true}){

        this.Show({show:!this.#show,slow});
    }
}