
class Crud_Master extends ODD {

    constructor(i){

        super(i);
        this.BuildWorkSpace({...i});
    }

    //----------workspace---------

    _master={info:null,build:null};
    _maid={info:null,build:null};

    BuildWorkSpace({master,maid}){

      let k = this;

      //--------------set data---------------
      this._master = master;
      this._maid = maid;

      this._master.build.AddEvents({
        events:[
          {
            name:'boxUpdate',
            actions:[
              {
                name:'master boxUpdate',
                action:({field,y})=>{

                  if(k._master.fieldName != null){
                    
                    if(field.name=="edit"){
  
                      var masterValue = k._master.build.Print_GetValue({fieldName:k._master.fieldName,y});
                      k.#MaidSearch({masterValue});
                    }
                  }
                }
              }
            ],
          },
          {
            name:'reloaded',
            actions:[
              {
                name:'master reloaded',
                action:({})=>{

                  if(k._master.fieldSqlName!=null){

                    var masterValue = k._master.build.Data_GetValue({y:0,fieldSqlName:k._master.fieldSqlName});
                      k.#MaidSearch({masterValue});
                  }
                }
              }
            ],
          },
          {
            name:'newed',
            actions:[
              {
                name:'master newed',
                action:()=>{

                  k._maid.build.Block_Action({});
                }
              }
            ],
          },
        ],
      });

      this._maid.build.AddEvents({
        events:[
          {
            name:'canceled',
            actions:[
              {
                name:'maid canceled',
                action:(prms)=>{

                  prms.k.Modal_SetActive({active:false});
                }
              }
            ],
          },
        ],
      });

      if(this._master.build._tipe=="form"&&this._maid.build._tipe=="form"){

        this._master.build.AddEvents({
          events:[
            {
              name:'boxUpdate',
              actions:[
                {
                  name:'master boxUpdate',
                  action:({field,y})=>{
  
                    if(k._master.fieldName != null){
    
                      if(field.name=="add"){
    
                        k._maid.build.Modal_SetActive({active:true});
                        k._maid.build.New_Action({});
                      }
                    }
                  }
                }
              ],
            },
          ],
        })

        
      }

      if(this._master.build._tipe=="table"&&this._maid.build._tipe=="form"){

        this._master.build.SetActiveOneAction({
          eventName:'newed',
          actionName:'base newed',
          active:false,
        });

        this._master.build.AddEvents({events:[
          {
            name:'newed',
            actions:[
              {
                name:'master table newed',
                action:(prms)=>{

                  k._maid.build.Modal_SetActive({active:true});
                  k._maid.build.New_Action({});
                }
              }
            ],
          }
        ]});

        this._maid.build.AddEvents({
          events:[
            {
              name:'inserted',
              actions:[
                {
                  name:'maid inserted',
                  action:(prms)=>{

                    var masterField = k._master.build.Fields_GetInfo({fieldName:k._master.fieldName});
  
                    k._master.build.Action_Insert({
                      inserts:[
                        {
                          field:masterField.sql.field,
                          value:prms.newPrimary,
                        }
                      ],
                      addFields:false,
                    });
                  }
                }
              ],
            },
          ],
        });
      }

    }

    #MaidSearch({masterValue}){

      this._maid.build.Conection_SetConection({
          name:this._master.build._name,
          fieldSqlIndex:this._maid.fieldSqlIndex,
          value:masterValue,
      });
      this._maid.build.States_SetData({
        name:"reload",
        tools:[
          {name:"new",show:(this._maid.build._tipe!="form")},
          {name:"cancel",show:(this._maid.build._tipe=="form")},
          {name:"delete",show:(this._maid.build._tipe=="form")},
        ],
      });
      this._maid.build.Modal_SetActive({active:true});
      this._maid.build.Reload_Action({});
    }


    
}
