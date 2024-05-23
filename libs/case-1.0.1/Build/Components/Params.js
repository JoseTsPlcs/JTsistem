
class Params {

  #dom = null;
  #clss = null;
  #style = null;
  #plch = null;
  #attbs = [];//{attribute:'',value:2}

  constructor(i) {

    if(i != null){

      this.#dom = i.dom;

      this.#clss = i.class;
      this.#style = i.style;
      this.#plch = i.placeholder;
      this.#attbs = i.attributes;
    }

    this.#SetParams();
  }

  #SetParams(){

    var b = this.#dom;
    this.SetToDom(b);
  }

  SetToDom(dom){

    if(dom==null)return;

    if(this.#clss) dom.setAttribute("class", this.#clss);
    if(this.#style) dom.setAttribute("style", this.#style);
    if(this.#plch) dom.setAttribute("placeholder", this.#plch);

    if(this.#attbs){

      for (var at = 0; at < this.#attbs.length; at++) {

        var attb_i = this.#attbs[at];
        dom.setAttribute(attb_i.attribute, attb_i.value);
      }
    }
  }

}
