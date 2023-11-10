
  class Load_Table {

    #description = "";
    #database = null;
    #table_main = 0;
    
    #lastSettings = null;
    #data = [];

    #loading = false;
    #loaded = false;


    GetLoading(){

      return this.#loading;
    }
    GetLoaded(){

      return this.#loaded;
    }
    #StatetLoad(st){

      this.#loaded = !st;
      this.#loading = st;
    }
    #ErrorConection({msg=""}={}){

      const error = this.#database == null;
      if(error) console.log("error in table " + this.#table_main + " dont have database -> is null", msg, this.#description, this);
      return error;
    }

    constructor(i){

      if(i==null){

        console.log("error i{} is null");
        return;
      }

      if(i.database == null){

        console.log("error i{database:[]} is null", i);
        return;
      }

      if(i.description) this.#description = i.description;
      if(i.database) this.#database = i.database;
      if(i.table_main) this.#table_main = i.table_main;

    }

    LoadData({settings=null, success=null}){

      if(this.#ErrorConection("LoadData"))return;

      if(settings != null) this.#lastSettings = settings;
      let k = this;

      this.#StatetLoad(true);
      this.#database.Select_Sql({
        ...k.#lastSettings,
        success:function(resp){

          k.#data = resp;
          k.#StatetLoad(false);
          if(success != null) success(resp);
        }
      })
    }

    GetData(){

      return this.#data;
    }

    FieldPrimary(){

      return this.#database.Table_GetPri({table_index: this.#table_main});
    }

    GetTableMainIdex(){

      return this.#table_main;
    }

    Insert(settings){

      if(this.#ErrorConection("LoadData"))return;

      this.#database.Insert_Sql({...settings});
    }

    Update(settings){

      if(this.#ErrorConection("LoadData"))return;

      this.#database.Update_Sql({...settings});
    }

    Delete(settings){

      if(this.#ErrorConection("LoadData"))return;

      this.#database.Delete_Sql({...settings});
    }
    

  }