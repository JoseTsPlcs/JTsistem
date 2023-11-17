
class Form_Bodyv2 extends ODD {

   /*
    
    ----------------------------------------------------------
    |                         TITLE                          |
    |--------------------------------------------------------|
    |                        SETTINGS                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |--------------------------------------------------------|
    |[conf]                                           [excel]|
    |--------------------------------------------------------|
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |                                                        |
    |--------------------------------------------------------|
    |                       [update]                         |
    [sizes]           [reload][new][delete]      [<][page][>]|
    |                 [cancel][insert][save]                 |
    ----------------------------------------------------------
  */


  constructor(i){

    super(i);
  }

  #sizes_options = [{show:'1',value:1},{show:'10',value:10},{show:'25',value:25},{show:'25',value:25},{show:'999',value:999},];
  #pages_options = [{show:'1',value:1},{show:'2',value:2},{show:'3',value:3},];
  #tools = [

    {x:0,y:1,name:'settings',box:{tipe:5,class:'btn btn-primary',default:icon.settings}},
    {x:2,y:1,name:'excel',box:{tipe:5,class:'btn btn-success',default:'excel'}},

    {x:0,y:3,name:'sizes',box:{tipe:3,options:this.#sizes_options,class:'btn btn-primary',default:icon.settings}},

    {x:0,y:1,name:'reload',box:{tipe:5,class:'btn btn-primary',default:'Recargar'}},

    {x:0,y:1,name:'pageBack',box:{tipe:5,class:'btn btn-primary',default:'<'}},
    {x:2,y:3,name:'pages',box:{tipe:3,options:this.#pages_options,class:'btn btn-primary',default:icon.settings}},
    {x:0,y:1,name:'pageNext',box:{tipe:5,class:'btn btn-primary',default:'>'}},
  ];

  #modulo = null;
  #filter = null;

  #Build({}){




  }
}
