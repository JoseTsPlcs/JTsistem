
class Form_Data extends ODD{

  #db = null;
  #loads = null;
  #main = null;
  #mainIndex = 0;
  #primary = {
    as:'PRIMARY',
    data: null,
  }
  GetMainPrimary(){

    return this.#primary;
  }
  

  constructor(i){

    super(i);

    this.#mainIndex = 0;
    let k = this;

    //events
    this.AddEvents({events:[
      {name:'loads loaded',actions:[]},
    ]});

    //database
    this.#db = new dataBase();
    this.#db.SetTables({tables:i.tables});//set tables that need

    //loads
    this.#loads = new LoadsData({
      log:i.log,
      name:i.name + ' loads',
      events:[
        {
          name:'loads_end',
          actions:[{
            description:'loads loaded by form data',
            action:(i)=>{

              k.CallEvent({name:'loads loaded', params:i});
            }
          }],
        }
      ],
    });

    //main
    this.#main = new Load_Table({database:this.#db,table_main:this.#mainIndex});
    this.#primary.data = this.#db.Table_GetPri({table_index:this.#mainIndex});

  }

  Loads_Reload({loads=[]}){
    
    this.#loads.Load({database:this.#db,loads:loads});
  }

  Loads_GetData(){

    return this.#loads.GetData();
  }

  ///////////////////////////////////////////

  Load_Reload({success=null}){

    
  }

  Load_GetData({load_index=null}){

    if(load_index==null || load_index >= this.#loads.length){

      console.log("error no found load", load_index, this.#loads);
      return;
    }

    return this.#loads.GetData({index:load_index});
  }

  #GetSizeofTable({table=null, conditions=[], joins=[], log_sql=false, log_resp=false, success=null}){

    if(table == null){

      console.log("error: need table", table);
      return 0;
    }

    const field_primary = this.#db.Table_GetPri({table_index: table});

    this.#db.Select_Sql({
      table_main:table,
      selects:[{table:table, field:field_primary.index, as:'total',action:'COUNT'}],
      conditions:conditions,
      joins:joins,
      log_sql:log_sql,
      log_resp:log_resp,
      success:function(resp){

        let t = 0;
        if(resp != null && resp.length > 0) t = parseFloat(resp[0]['total']);

        if(success != null) success({total: t});
      }
    });


  }

  //-------MAIN-------

  GetSizeofMainTable(i){

    this.#GetSizeofTable({...i, table:this.#main.GetTableMainIdex()});
  }

  MainTableIndex(){

    return this.#mainIndex;
  }

  MainFieldPrimary(){

    return this.#db.Table_GetPri({table_index: this.#mainIndex});
  }

  MainLoad(i){

    this.#main.LoadData({settings:{table_main:this.#main.GetTableMainIdex(),...i}, success:i.success});
  }

  MainInsert(i){

    this.#main.Insert({table_main:this.#main.GetTableMainIdex(),...i});
  }

  MainGetData(){

    return this.#main.GetData();
  }

  MainUpdate(i){

    this.#main.Update({table_main:this.#main.GetTableMainIdex(), ...i});
  }

  MainDelete(i){

    this.#main.Delete({table_main:this.#main.GetTableMainIdex(), ...i});
  }

  Main_GetNewPrimary({success = null}){

    const t = this.MainTableIndex();
    const f_pri = this.MainFieldPrimary();
    const pri_as = 'pri';
    const selects = [{table: t, field: f_pri.index, as: pri_as, action:'MAX'}];

    this.#db.Select_Sql({
      table_main:t,
      selects:selects,
      success:function(resp){

        //console.log("new primary ", resp);
        const nw = parseFloat(resp[0][pri_as]);
        if(success != null) success({new: nw + 1});
      }
    });
  }
  

  
}