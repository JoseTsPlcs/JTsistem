
class Crud_Master extends ODD {

    constructor(i){

        super(i);
        this.BuildWorkSpace({...i});
    }

    //----------workspace---------

    #grid=null;
    _parent={info:null,build:null};
    _child={info:null,build:null};

    BuildWorkSpace({parent,child}){

      this.#grid=new Grid({
          cols:[[12],[12]],
      });
      let u = this;

      //--------------set data---------------

      
      parent.parent = this.#grid.GetColData({x:0,y:0}).col;
      child.parent = this.#grid.GetColData({x:0,y:1}).col;


      //parent(table) & child(form) 
      if(child.tipe == 2 && parent.tipe == 1){

        
        child.events=[
          {
            name:'update',
            actions:[
              {
                description:'close child and reload master',
                order:-999,
                action:({k})=>{

                  if(u._parent.build!=null) u._parent.build.CallEvent({name:'reload'});
                }
              }
            ],
          },
          {
            name:'stateDefault',
            actions:[
              {
                description:'',
                action:({k})=>{

                  k.CallEvent({name:'block'});
                }
              }
            ],
          },
          {
            name:'delete',
            actions:[
              {
                order:999,
                name:'reload parent',
                description:'reload the parent when delete',
                action:({k})=>{

                  if(u._parent.build!=null) u._parent.build.CallEvent({name:'reload'});
                }
              }
            ],
          }
        ];
        child.eventActives=[
          {eventName:'stateDefault',actionName:'reload',active:false},
        ],
        child.states = [
          {name:'reload',tools:[
            {name:'new',show:false},
            {name:'cancel',show:true},
          ]},
        ];


        parent.events=[
          {
            name:'boxUpdate',
            actions:[
              {
                description:'edit button',
                action:({k,x,y,field})=>{

                  u.ParentReload({y:y});
                }
              }
            ],
          },
          {
            name:'reload',
            actions:[
              {
                description:'block child',
                action:({k})=>{
    
                  if(u._child.build!=null) u._child.build.CallEvent({name:'block'});
                }
              }
            ],
          },       
          {
            name:'new',
            actions:[
              {
                name:'open child',
                description:'no block the child',
                action:({k})=>{

                  if(u._child.build!=null) u._child.build.CallEvent({name:'new'});
                }
              }
            ],
          },
        ];
        parent.eventActives=[
          {eventName:'new',actionName:'state new',active:false},
          {eventName:'new',actionName:'print new',active:false},
        ];

      }
      
      //parent(form) & child(table) 
      if(child.tipe == 1 && parent.tipe == 2){


        parent.events = [
          {
            name:'reload',
            actions:[
              {
                name:'parent realod',
                action:({k})=>{

                  u.ParentReload({y:0});
                }
              }
            ],
          },
          {
            name:'new',
            actions:[
              {
                name:'clear child table',
                description:'clear all lines in the table child',
                action:({k})=>{

                  if(u._child.build!=null) u._child.build.CallEvent({name:'block'});
                }
              }
            ],
          },
          {
            name:'delete',
            actions:[
              {
                name:'delete child',
                action:({k})=>{

                  if(u._child.build!=null){

                    console.log("chilld conditions",u._child.build._conditions);
                    u._child.build.RequestDeleteMysql({conditions:u._child.build._conditions});
                  }
                }
              }
            ],
          }
        ];

      }

      //--------------create--------------

      //create child
      this._child.info=child;
      switch(child.tipe){

          case 1:
              this._child.build=new Crud_Table({...child});
          break;
          case 2:
              this._child.build=new Crud_Form({...child});
          break;
      }

      this._parent.info=parent;
      switch(parent.tipe){

          case 1:
              this._parent.build=new Crud_Table({...parent});
          break;
          case 2:
              this._parent.build=new Crud_Form({...parent});
          break;
      }

    }

    ParentReload({y=0}){

      if(this._parent.build==null||this._child.build==null)return;

      //get value of field conection of parent
      var parentFieldConection = this._parent.info.conection.field;
      console.log(this._parent);
      var parentFieldValue = this._parent.build.GetDataField({y:y,fieldIndex:parentFieldConection});

      //create condition to reload in child
      var childFieldIndex = this._child.info.conection.field;
      var conditions = [{
        and:true,
        conditions:[
          {
            table:0,
            field:childFieldIndex,
            inter:'=',
            value:parentFieldValue,
          }
        ],
      }];

      //create insert to create in child
      var inserts = [
        {
          field:childFieldIndex,
          value:parentFieldValue,
        },
      ];

      //set conditions constants in child
      this._child.build.SetConstantsSettingsRequest({
        conditions:conditions,
        inserts:inserts,
      });

      //reload child with conditions
      this._child.build.CallEvent({
        name:'reload',
        params:{
          conditions:conditions,
        }
      });
      
    }
    
}
