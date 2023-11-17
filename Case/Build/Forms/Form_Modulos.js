
class Form_Modulos extends Form_Base {

  _modulos = {
    conteiner:null,
    windows:[],
  };

  constructor(i) {

    //state start
    const st_dflt = [
      {name:'reload', tools:[{name:'sizes',value:1,show:false}]},
      {name:'search', tools:[{name:'sizes',value:1,show:false}]},
      {name:'list', tools:[{name:'sizes',value:1,show:false}]},
    ];

    if(i.states == null){
      i.states = st_dflt
    }else i.states = [...i.states, ...st_dflt];

    super(i);
  }

  _CreateBody(i){
    
    super._CreateBody(i);
    this._CreateModulos(i);
  }

  
  _CreateModulos({modulos = {cols:[[12]]}}){

    let k = this;
    const grid_parent = this._form.Modulo_GetColData({x:0,y:2}).col;

    //create grid when will there the windows
    this._modulos.conteiner = new Grid({...modulos, parent: grid_parent});

    //build windows
    for (let wi = 0; wi < modulos.windows.length; wi++) {

      const w = modulos.windows[wi];
      
      const w_coldata = this._modulos.conteiner.GetColData({x:w.x, y:w.y});
      if(w_coldata != null){

        const w_parent = w_coldata.col;

        const labels = [];
        k._fields.forEach(fi => {
          
          if(fi.window == wi)labels.push(fi);
        });
        
        const w_build = new Window({...w, hsz:5, parent: w_parent, grid:{cols:w.cols, labels:labels}});

        this._modulos.windows.push(w_build);

      }else console.log("error no find coldata of ", w);

    }

  }

  _SetFields(i){

    var fields = [];
    if(i.modulos != null && i.modulos.windows!=null){

      for (let w = 0; w < i.modulos.windows.length; w++) {
        const wi = i.modulos.windows[w];
        wi.fields.forEach(fi => {
          
          fields.push({...fi, window: w});
        });
      }
    }

    //console.log("------modulos form fields-----", fields);
    super._SetFields({fields: fields});

  }

  _SetBoxToFields(){

    let k = this;
    this._fields.forEach(fi => {
      
      const window = this._modulos.windows[fi.window];
      const w_coldata = window.Conteiner_GetColData({...fi});

      const bxs = [];
      w_coldata.labels.forEach(lb => {
        
        const w_bx = w_coldata.labels[0].GetBox();
        bxs.push(w_bx);
      });

      fi.boxs = bxs;
    });
  }

  _Box_Get({x=null, y=null, window=null}){

    if(window == null){

      console.log("error to get box -> window is null");
      return null;
    }

    if(x == null){

      console.log("error to get box -> x is null");
      return null;
    }

    if(y == null){

      console.log("error to get box -> y is null");
      return null;
    }

    const coldata = this._modulos.windows[window].Conteiner_GetColData({x:x,y:y});
    return coldata.labels[0].GetBox();
  }

  //--------actions-----------

  _New(){

    super._New();

    this._fields.forEach(fi => {
      
      fi.boxs.forEach(bx => {
        
        bx.SetDefault();
      });
    });
  }

  Block(){

    super.Block();

    this._fields.forEach(fi => {
      
      fi.boxs.forEach(bx => {
        
        bx.SetDefault();
      });
    });
  }

}
