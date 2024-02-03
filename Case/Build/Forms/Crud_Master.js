
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

                  //console.log("crud_master->event boxupdate->field:",field+",y:"+y);
                  
                  if(k._master.event=="edit"){
                    
                    if(field.action=="edit"){
                      
                      k.#TriggerSearch({y});
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

                  if(k._master.event=="reload"){

                    //var masterValue = k._master.build.Data_GetValue({y:0,fieldSqlName:k._master.fieldSqlName});
                    //k.#MaidSearch({masterValue});
                    k.#TriggerSearch({y:0});
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

                  k._maid.build.States_SetState({state:"block"});
                }
              }
            ],
          },
          {
            name:"deleted",
            actions:[
              {
                name:"maid delete by master delete",
                action:(prms)=>{

                  if(k._master.deleteChild){

                    var maidFieldSqlIndex = k._maid.fieldSqlIndex;
                    var maidPrimaryValue = k._master.build.Data_GetValue({y:prms.y,selectName:k._master.selectName});
                    //console.log(maidFieldSqlIndex,maidPrimaryValue);
                    k._maid.build.Delete_Action({conditions:[
                      {
                        and:true,
                        conditions:[{
                          table:k._maid.build._primary.tableIndex,
                          field:maidFieldSqlIndex,
                          value:maidPrimaryValue,
                          inter:"=",
                        }],
                      }
                    ]});
                  }
                  
                }
              }
            ],
          }
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

                  prms.k.Body_Modal_SetActive({active:false});
                }
              }
            ],
          },
          {
            name:"updated",
            actions:[
              {
                name:"close when update",
                action:(prms)=>{

                  prms.k.Body_Modal_SetActive({active:false});
                  
                }
              }
            ],
          },
          {
            name:"deleted",
            actions:[
              {
                name:"delete parent",
                action:()=>{

                  if(k._maid.deleteParent){

                    var deleteValueofMaid = k._maid.build.Data_GetValue({fieldSqlIndex:k._maid.fieldSqlIndex});
                    var deleteFieldSqlIndexofParent = k._master.build.Selects_Get({selectName:k._master.selectName}).field;

                    //console.log(maidFieldSqlIndex,maidPrimaryValue);
                    k._master.build.Delete_Action({conditions:[
                      {
                        and:true,
                        conditions:[{
                          table:k._master.build._primary.tableIndex,
                          field:deleteFieldSqlIndexofParent,
                          value:deleteValueofMaid,
                          inter:"=",
                        }],
                      }
                    ]});
                  }
                }
              }
            ],
          }
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
  
                    if(k._master.event == "edit"){
                      
                      if(field.action=="new"){
    
                        k._maid.build.Body_Modal_SetActive({active:true});
                        k._maid.build.States_SetState({state:"new"});
                      }
                    }
                  }
                }
              ],
            },
          ],
        });

        this._maid.build.AddEvents({
          events:[
            {
              name:"updated",
              actions:[{
                name:"maid updated -> load",
                action:()=>{

                  //console.log("field name edit",k._master.fieldName);
                  var fieldEditValue = k._master.build.Fields_GetInfo({fieldName:k._master.fieldName});
                  //console.log("field edit",fieldEditValue);
                  if(fieldEditValue.load!=null){

                    let loadIndex = fieldEditValue.load.loadIndex;
                    k._master.build.Loads_OneLoad({
                      loadIndex,
                      useScreen:true,
                      success:()=>{

                        var v_edit = k._master.build.Body_GetValue({fieldName:fieldEditValue.name,y:0});
                        var data = k._master.build.Loads_GetData({loadIndex});
                        var line = data.find(d=>d.value==v_edit);
                        //console.log("maid update and master loaded",line);
                      }
                    });
                  }
                }
              }],
            },
          ],
        });
      }

      if(this._master.build._tipe=="table"&&this._maid.build._tipe=="form"){

        this._master.build._body.Form_GetBuild().SetActiveOneAction({
          eventName:"newUpdate",
          actionName:"base",
          active:false,
        });
        this._maid.build._body.Form_GetBuild().SetActiveOneAction({
          eventName:"deleteUpdate",
          actionName:"base",
          active:false,
        });

        this._master.build._body.Form_GetBuild().AddEvents({events:[
          {
            name:'newUpdate',
            actions:[
              {
                name:'master table newed',
                action:(prms)=>{

                  k._maid.build.Body_Modal_SetActive({active:true});
                  //k._maid.build.New_Action({});
                  k._maid.build.States_SetState({state:"new"});
                }
              }
            ],
          },
        ]});

        this._master.build.AddEvents({events:[
          {
            name:"inserted",
            actions:[
              {
                name:"maid insted newid to master",
                action:()=>{

                  //console.log("maid insted newid to master");
                  k._master.build.States_SetDefault({lastPage:true});
                }
              }
            ],
          },
        ]});

        this._maid.build.AddEvents({
          events:[
            {
              name:'inserted',
              actions:[
                {
                  name:'maid inserted',
                  action:(prms)=>{
                    //console.log("maid insterted");
                    if(k._master.selectName != null){

                      var masterSelect = k._master.build.Selects_Get({selectName:k._master.selectName}); 
                      //console.log("maid inserted-> masterselect:",masterSelect);

                      k._master.build.Insert_Action({
                        inserts:[
                          {
                            field:masterSelect.field,
                            value:prms.newPrimary,
                          }
                        ],
                        addFields:false,
                      });
                    }
                  }
                },
                {
                  name:"maid inserted -> close",
                  action:(prms)=>{

                    k._maid.build.Body_Modal_SetActive({active:false});
                  }
                }
              ],
            },
            {
              name:"updated",
              actions:[
                {
                  name:"maid updated -> close",
                  action:(prms)=>{

                    k._maid.build.Body_Modal_SetActive({active:false});
                    k._master.build.Reload_Action({});
                  }
                }
              ],
            },
          ],
        });

        
      }

    }

    #TriggerSearch({y}){

      var masterValue = null;

      if(this._master.fieldName!=null){

        masterValue = this._master.build.Body_GetValue({fieldName:this._master.fieldName,y});
      }

      if(this._master.selectName!=null){

        masterValue = this._master.build.Data_GetValue({selectName:this._master.selectName,y});
      }

      this.#MaidSearch({masterValue});
    }

    #MaidSearch({masterValue}){
      
      //console.log("crud_master->maidsearch->maid:", this._maid,"->mastervalue:",masterValue);

      this._maid.build.Conection_SetConection({
          name:this._master.build._name,
          fieldSqlIndex:this._maid.fieldSqlIndex,
          value:masterValue,
      });
      this._maid.build.States_SetToolsData({
        name:"reload",
        tools:[
          {name:"new",show:(this._maid.build._tipe!="form")},
          {name:"cancel",show:(this._maid.build._tipe=="form")},
          {name:"delete",show:(false)},
        ],
      });
      this._maid.build.Body_Modal_SetActive({active:true});
      //this._maid.build.Reload_Action({});
      this._maid.build.States_SetState({state:"reload"});
    }


    
}
