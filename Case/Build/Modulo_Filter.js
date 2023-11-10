
class Modulo_Filter {

  #conteiner = null;

  constructor(i) {

    this.#Build(i);
  }

  #Build({parent=null, modulo={}}){

    this.#conteiner = new Modulo({
      parent:parent,
      grid:{
        cols:[[12],[4,4,4]],
        attributes:[
          {y:0,attributes:[{name:'class',value:'border border-secondary'},{name:'style',value:'min-height:200px'}]},
          {y:1,attributes:[{name:'class',value:'border border-secondary d-flex align-items-center'},{name:'style',value:'min-height:50px'}]},//foot
          {y:1,x:1,attributes:[{name:'class',value:'d-flex justify-content-center'}]},
        ],
        boxs:[
          {x:1,y:1,box:{tipe:5,value:'limpiar',id:'cancel',class:'btn btn-outline-danger btn-sm'}},
          {x:1,y:1,box:{tipe:5,value:'recargar',id:'confirm',class:'btn btn-outline-primary btn-sm'}},
        ],
      }
    });


  }



}
