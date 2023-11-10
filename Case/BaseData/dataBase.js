
class dataBase {

  #schema = [{"name":"accounts","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"ACCOUNT","Type":"varchar(30)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TOTAL","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ACTIVE","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"almacenes","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"ALMACEN","Type":"varchar(30)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DESCRIPCION","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"almacenes_movimiento","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"ALMACEN_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PRODUCTO_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"STOCK","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"MOVIMIENTO","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"FECHA","Type":"date","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ACTIVO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"buy_products","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"BUY_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PRODUCT_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CANT","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"COST_TOTAL","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ITER","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"buy_providers","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"NOMBRE","Type":"varchar(200)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DNI","Type":"varchar(20)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CEL","Type":"varchar(15)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ACTIVO","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"buys","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"PROVIDER_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DATE_EMMIT","Type":"date","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CONFIRMED","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PAYED","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TOTAL","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TRANSPORT_COST","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"COMMITED","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DATE_RECEPT","Type":"date","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"caja","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"ACTIVO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""},{"Field":"FECHA","Type":"date","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"COMMENT","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"EGRESO","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"INGRESO","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"clase_paginas","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"CLASS_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PAGE_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PREDETERMINADO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"ACCESO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"0","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"clientes","fields":[{"Field":"ID","Type":"float","Null":"NO","Key":"PRI","Default":null,"Extra":""},{"Field":"FECHA_INGRESO","Type":"timestamp","Null":"NO","Key":"","Default":"current_timestamp()","Extra":""},{"Field":"ACTIVO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""},{"Field":"NAME","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DNI","Type":"varchar(12)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DIR","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ZONE","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"REF","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CEL","Type":"varchar(15)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"GPS","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"METODO","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"RECOGE","Type":"int(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DOCUMENT","Type":"varchar(50)","Null":"NO","Key":"","Default":"nota de pago","Extra":""},{"Field":"TIPO_ID","Type":"int(11)","Null":"NO","Key":"","Default":"1","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"float","Null":"NO","Key":"PRI","Default":null,"Extra":""}}},
  {"name":"customers_types","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"TYPE","Type":"varchar(50)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PRIORITY","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DESCRIPTION","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"macro","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":""},{"Field":"MACRO","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":""}}},
  {"name":"nav_seccions","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"SECCION_NAME","Type":"varchar(50)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"SHOW_ORDER","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"paginas","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"TITLE","Type":"varchar(30)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"URL","Type":"varchar(60)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"SECCION_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ORDER_SHOW","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"productos","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"PRODUCTO","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"100g","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"250g","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"500g","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"1000g","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"1000gM","Type":"float","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"5000g","Type":"float","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"ONE","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"STOCK","Type":"float","Null":"NO","Key":"","Default":"999","Extra":""},{"Field":"UNIDAD_ID","Type":"int(11)","Null":"NO","Key":"","Default":"1","Extra":""},{"Field":"COSTO","Type":"float","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"ACTIVO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""},{"Field":"UTILIDAD_PORCENT_VENTA","Type":"float","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"STOCK_LIMIT","Type":"float","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"STOCK_ONLIMIT","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""},{"Field":"UTILIDAD","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"MOSTRAR","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""},{"Field":"TIPO_ID","Type":"int(11)","Null":"NO","Key":"","Default":"1","Extra":""},{"Field":"INSUMO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"0","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"productos_tipo","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"TIPO","Type":"varchar(30)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"providers","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"EMPRESA","Type":"varchar(40)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"RUC","Type":"varchar(20)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CEL","Type":"varchar(15)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ACTIVE","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"providers_products","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"PROVIDER_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PRODUCT_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"LAST_COST","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"COST_PROM","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"transactions","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"DATE","Type":"date","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TOTAL","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TAG_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ACCOUNT_ID","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DESCRIPTION","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"INGRESO","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"transactions_tags","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"TAG","Type":"varchar(50)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"INGRESO","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"REPORT","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"transferencias","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":""},{"Field":"DATE","Type":"datetime","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"EMISOR","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"RECEPTOR","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"METODO","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TOTAL","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"COMMENT","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CONFIRM","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ANULADO","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":""}}},
  {"name":"unidades","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"UNID","Type":"varchar(30)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"SIMBOL","Type":"varchar(10)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"usuarios","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":""},{"Field":"USER","Type":"varchar(20)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PASSWORD","Type":"varchar(20)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CLASE_ID","Type":"int(11)","Null":"NO","Key":"","Default":"1","Extra":""},{"Field":"ACTIVO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":""}}},
  {"name":"usuarios_clases","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"CLASS","Type":"varchar(15)","Null":"NO","Key":"","Default":null,"Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"ventas","fields":[{"Field":"NRO","Type":"float","Null":"NO","Key":"PRI","Default":null,"Extra":""},{"Field":"CONFIRM","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DATE","Type":"date","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"NAME","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TOTAL","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"METODO","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DELIVERY","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"TRABAJADOR","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CANCELADO","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CAJERO","Type":"int(11)","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"ARMADO","Type":"int(1)","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"ENTREGADO","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"RECOGE","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"COMMENT","Type":"longtext","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"DOCUMENT","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"SUNAT","Type":"tinyint(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ANULADO","Type":"int(11)","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"DELIVERY_GRATIS","Type":"tinyint(1)","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"DESCUENTO","Type":"float(10,0)","Null":"NO","Key":"","Default":"0","Extra":""}],"primary":{"index":0,"field":{"Field":"NRO","Type":"float","Null":"NO","Key":"PRI","Default":null,"Extra":""}}},
  {"name":"ventas_productos","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"LINE","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"NRO","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"INFO","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PRODUCTO","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"PRODUCTO_ID","Type":"int(11)","Null":"YES","Key":"","Default":null,"Extra":""},{"Field":"PRECIO","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"CANTIDAD","Type":"int(11)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"UNIDAD","Type":"float","Null":"NO","Key":"","Default":"0","Extra":""},{"Field":"ITERACTION","Type":"int(1)","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"STRIKE","Type":"int(1)","Null":"NO","Key":"","Default":"0","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"}}},
  {"name":"zonas","fields":[{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":""},{"Field":"ZONE","Type":"text","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"MACRO","Type":"int(11)","Null":"NO","Key":"","Default":"-1","Extra":""},{"Field":"DELIVERY","Type":"float","Null":"NO","Key":"","Default":null,"Extra":""},{"Field":"ACTIVO","Type":"tinyint(1)","Null":"NO","Key":"","Default":"1","Extra":""}],"primary":{"index":0,"field":{"Field":"ID","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":""}}},
  ];

  #mysql = null;
  #tables_data = [];
  GetTableData(){

    return this.#tables_data;
  }
  getTableData({index=0}={}){

    return this.#tables_data[index];
  }

  constructor({}={}) {

    this.#mysql = new Mysql();
  }

  LoadTables({success=null, tables=[], log=false, fail=null}){

    let k = this;
    var ld = 0;
    let tables_count = tables.length;

    //load all tables
    if(tables_count > 0){

      for (var i = 0; i < tables_count; i++) {

        var ti = tables[i];
  
        //create new table
        let tnw = {
          name : ti,
          fields:[],
          primary: {index:0, field:null},
        };
        k.#tables_data.push(tnw);
  
        //select one table
        this.#mysql.Mysql_Row({
          sql: 'SHOW COLUMNS FROM ' + ti,
          log_sql:false,
          log_resp:false,
          success:(resp)=>{
  
            for (var r = 0; r < resp.length; r++) {
  
              var ri = resp[r];
              tnw.fields.push(ri);
  
              if(ri['Key'] == 'PRI'){
  
                tnw.primary.index = r;
                tnw.primary.field = ri;
              }
            }  
  
            OneTableLoaded();
            AllwasLoaded();
          },
          fail:(e)=>{
            
            var msg = 'error couldnt load table' + ti;
            console.error(msg);
            if(fail!=null)fail({msg:msg});
          },
        });
  
      }

    }else{

      OneTableLoaded();
    }

    function OneTableLoaded() {

      ld++;
    }

    function AllwasLoaded() {

      if(ld >= tables_count){

        Loaded();
      }else return false;
    }

    function Loaded() {
      
      //if(log) console.log(JSON.stringify(k.#tables_data));
      if(success) success(k);
    }
  }

  SetTables({tables=[]}){

    var tb = [];
    tables.forEach(t => {
        
        var found = this.#schema.find(tu=>tu.name == t);
        if(found) tb.push(found);
    });
    
    this.#tables_data = tb;
  }

  Table_GetPri({table_index}){

    const d_t = this.Get_TableData_ByIndex({table_index:table_index});

    if(d_t == null){

      console.log("error table data is null", d_t);
      return null;
    }

    let f_pri = null;
    for (let f = 0; f < d_t.fields.length; f++) {
      const fi = d_t.fields[f];
      if(fi.Key == "PRI"){

        f_pri = {...fi, index: f};
      }
      
    }

    return f_pri;

  }

  Get_TableData_ByIndex({table_index}){

    const mx = this.#tables_data.length;
    if(table_index >= mx){

      console.log("error index(" + table_index + ") is > than max(" + mx + ")");
      return null;
    }

    return this.#tables_data[table_index];
  }

  Select_Sql(i){

    var sql = "SELECT ";

    var t_mn = i.table_main //int;
    var t_slcs = i.selects//[int,int,int];

    //insert the selects fields
    for (var e = 0; e < t_slcs.length; e++) {

      var slc_e = t_slcs[e];

      var slc_e_t = slc_e['table'];
      var slc_e_t_d = this.#tables_data[slc_e_t];
      var slc_e_t_d_nm = slc_e_t_d['name'];

      var slc_e_f = slc_e['field'];
      var slc_e_f_d = slc_e_t_d['fields'];
      var slc_e_f_d_f = slc_e_f_d[slc_e_f]['Field'];

      var slc_e_a = slc_e['as'];

      var slc_e_act = slc_e['action'];

      var coma = e < t_slcs.length - 1 ? ",": " ";

      sql+= slc_e_act ? slc_e_act + "(" : "";
      sql+= slc_e_t_d_nm + "." + slc_e_f_d_f;
      sql+= slc_e_act ? ")" : "";
      sql+= slc_e_a ? " AS " + "'" + slc_e_a + "'" : "";
      sql+= coma;
    }

    //insert table select
    var t_mn_d = this.#tables_data[t_mn];
    var t_mn_d_nm = t_mn_d['name'];
    sql += "FROM " + t_mn_d_nm + " ";

    //insert joins {main:{table:0,field:0},join:{table:0,field:0}}
    var jns = i.joins;
    if(jns != null){

      for (var e = 0; e < jns.length; e++) {

        var ji = jns[e];

        var ji_mn_t = ji['main']['table'];
        var ji_mn_t_d = this.#tables_data[ji_mn_t];
        var ji_mn_t_d_nm = ji_mn_t_d['name'];

        var ji_mn_f = ji['main']['field'];
        var ji_mn_f_d = ji_mn_t_d['fields'];
        var ji_mn_f_d_f = ji_mn_f_d[ji_mn_f]['Field'];

        var ji_jn_t = ji['join']['table'];
        var ji_jn_t_d = this.#tables_data[ji_jn_t];
        var ji_jn_t_d_nm = ji_jn_t_d['name'];

        var ji_jn_f = ji['join']['field'];
        var ji_jn_f_d = ji_jn_t_d['fields'];
        var ji_jn_f_d_f = ji_jn_f_d[ji_jn_f]['Field'];

        sql += " LEFT JOIN " + ji_jn_t_d_nm;
        sql += " ON " + ji_mn_t_d_nm + "." + ji_mn_f_d_f;
        sql += " = " + ji_jn_t_d_nm + "." + ji_jn_f_d_f + " ";

      }
    }

    //insert where
    sql += this.#Get_Where(i);

    //orders [{field:index, asc:true}]
    var ords = i.orders ? i.orders : [];
    var ord_t = ords.length;
    if(ord_t > 0){

      sql+= " ORDER BY ";

      for (let or = 0; or < ord_t; or++) {

        const ori = ords[or];

        var ori_t = ori.table;
        var ori_t_d = this.#tables_data[ori_t];
        var ori_t_d_nm = ori_t_d['name'];

        var ori_f = ori.field;
        var ori_f_d = ori_t_d['fields'][ori_f];
        var ori_f_d_f = ori_f_d['Field'];

        var ori_asc = ori.asc == null ? true : ori.asc; 

        var coma = or == ord_t -1 ? "": ",";
        sql += ori_t_d_nm + "." + ori_f_d_f + " " + (ori_asc ? "ASC":"DESC") + coma;
        
      }
    }
    
    //insert limit
    var lmt = i.limit;
    if(lmt && lmt.length > 0){

      sql+= " LIMIT " + lmt[0];
      if(lmt.length > 1) sql+= ", " + lmt[1];
    }

    this.#mysql.Mysql_Row({
      sql: sql,
      ...i,
    });
  }

  Update_Sql(i){

    var sql = "UPDATE ";

    //insert the table main
    var t_mn = i.table_main;
    var t_mn_d = this.#tables_data[t_mn];
    var t_mn_d_nm = t_mn_d['name'];
    sql+= t_mn_d_nm;

    //insert selects[SET]
    var sets = i.sets;
    sql+= " SET ";
    for (var s = 0; s < sets.length; s++) {

      var si = sets[s];

      var si_f = si['field'];
      var si_f_nm = t_mn_d['fields'][si_f]['Field'];

      var si_v = si['value'];

      var coma = s < sets.length-1 ? "," : "";
      sql+= si_f_nm + " = '" + si_v + "'" + coma + " ";

    }

    //insert conditions
    sql+= this.#Get_Where(i);

    this.#mysql.Mysql_Success({
      sql: sql,
      ...i,
    });
  }

  Insert_Sql(i){

    var sql = "INSERT INTO "

    var t_mn = i.table_main;
    var t_mn_d = this.#tables_data[t_mn];
    var t_mn_d_nm = t_mn_d['name'];

    sql+= t_mn_d_nm + " ";

    var ins = i.inserts;
    var ins_t = ins.length;

    //insert fields
    sql+= " ( ";
    for (var k = 0; k < ins_t; k++) {

      var in_i = ins[k];
      var in_i_f = in_i.field;
      var in_i_f_nm = t_mn_d['fields'][in_i_f]['Field'];

      var coma = k < ins_t - 1 ? "," : "";

      sql+= in_i_f_nm + coma + " ";
    }
    sql+=") ";

    //insert values
    sql+= "VALUES ( ";
    for (var k = 0; k < ins_t; k++) {

      var in_i = ins[k];
      var in_i_v = in_i.value;

      var coma = k < ins_t - 1 ? "," : "";

      sql+= "'" + in_i_v + "'" + coma + " ";
    }
    sql+=") ";


    this.#mysql.Mysql_Success({
      sql: sql,
      ...i,
    });
  }

  Delete_Sql(i){

    var sql = "DELETE ";

    sql += "FROM "
    var t_mn = i.table_main;
    var t_mn_d = this.#tables_data[t_mn];
    var t_mn_d_nm = t_mn_d['name'];
    sql += t_mn_d_nm;

    sql += this.#Get_Where(i);

    this.#mysql.Mysql_Success({
      sql: sql,
      ...i,
    });
  }

  //return mysql conditions
  #Get_Where(i){

    // {
    //   and:true,
    //   conditions:[],
    // }

    //individual condition
    // {
    //   table: index,
    //   field: index,
    //   inter: '=',
    //   value: 1,
    //   and: true,
    // }

    var sql = "";
    var cnd_mn = i.conditions;
    if(cnd_mn != null && cnd_mn.length > 0){

      var cnd_mn_t = cnd_mn.length;
      sql += " WHERE ";

      //main condition
      for (var c = 0; c < cnd_mn.length; c++) {

        var cnds = cnd_mn[c];
        var cnds_i_t = cnds.conditions.length;

        if(cnds_i_t > 0){

          //individual conditions
          sql += "(";

          //var ci_inv_add = cnds['and'];
          for (var e = 0; e < cnds_i_t; e++) {

            var ci = cnds.conditions[e];

            var ci_t = ci['table'];
            var ci_t_d = this.#tables_data[ci_t];

            var ci_t_d_nm = ci_t_d['name'];

            var ci_f = ci['field'];
            var ci_f_d = ci_t_d['fields'][ci_f];
            var ci_f_d_f = ci_f_d['Field'];

            var ci_int = ci['inter'];
            var ci_v = ci['value'];
            var ci_and = ci['and'] != null ? ci['and'] : true;

            var add = ci_and ? "AND" : "OR";
            var coma = e < cnds_i_t - 1 ? " " + add + " ": "";
            var exact = ci_int == 'LIKE' ? "%": "";
            var comillas = ci_v == "NULL" ? "" : "'";

            sql+= ci_t_d_nm + "." + ci_f_d_f + " " + ci_int + " " + comillas + exact + ci_v + exact + comillas + coma;
          }

          sql += ")"

          //confirm if the next condition have conditions individual
          var next = c < cnd_mn_t - 1 ? cnd_mn[c+1].conditions.length >= 1 : false;
          if(next){

            var cnd_mn_add = cnds.and != null ? cnds.and : true;
            var add_mn = cnds.and ? "AND" : "OR";
            var coma_mn = c < cnd_mn_t -1 ? " " + add_mn + " " : "";
            sql += coma_mn;
          }
        }

      }

    }

    return sql;
  }

}
