
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      var crudsofTable = [
        {
          tableName:"sales",
          tipe:"table",
          fields:[
            //{action:"show",crud:"form"},
            {name:"DATE_EMMIT",state:"show"},
            {name:"ID_STATUS",state:"show"},
            {name:"PAID",state:"show"},
            //{name:"ID_CUSTOMER",state:"show"},
            {name:"TOTAL",state:"show"},
            {name:"COMMENT",state:"show"},
          ],
        },
        {
          tableName:"sales",
          tipe:"form",
          fields:[
            {name:"DATE_EMMIT",state:"show"},
            {name:"ID_STATUS",state:"show"},
            {name:"PAID",state:"show"},
            {name:"ID_CUSTOMER",state:"show"},
            {name:"TOTAL",state:"show"},
            {name:"COMMENT",state:"show"},
            {name:"ID_WORK_PROCESS",state:"show"},
            {name:"DSCTO",state:"show"},
            {name:"TOTAL_WITHOUT_DSCTO",state:"show"},
          ],
        },
      ];

      crudsofTable = [
        {
          tableName:"sales",
          tipe:"form",
          fields:[
            {name:"DATE_EMMIT",state:"edit"},
            {name:"ID_STATUS",state:"edit"},
            {name:"PAID",state:"show"},
            {name:"COMMENT",state:"edit"},

            {name:"TOTAL",state:"show"},
          ],
        },
        {
          tableName:"sales_products",
          tipe:"table",
          fields:[
            {name:"product",state:"edit"},
          ],
        }
      ];

      var gridCols = crudsofTable.map(crd=>{return [12]});
      var grid = new Grid({
        parent:pageData.body,
        cols:gridCols,
      });


      var cruds = [];
      for (let c = 0; c < crudsofTable.length; c++) {
        const crd = crudsofTable[c];
        crd.script = {};
        
        var tableName = crd.tableName;
        var tableMainSchema = schema.find(t=>t.name == tableName);
        var fieldPrimary = tableMainSchema.fields.find(f=>f.primary == true);
        var selects = [];
        var fields = [];
        tableMainSchema.fields.forEach(f => {

          if(f.active){

            var fieldSet = crd.fields.find(fset=>fset.name== f.name);
            if(fieldSet){

              var stateField = DataTipeGet({tipeName:f.tipe, stateName:fieldSet.state,fieldOfSchema:f});

              selects.push({
                table:tableName,
                field:f.name,
                primary:f.primary,
              });
      
              fields.push({
                panel:"main",
                name:f.title,
                box: {...stateField.box},
                attributes:stateField.attributes,
                select:f.name,
              });

            }            
          }

        });

        if(!selects.find(slc=>slc.field == fieldPrimary.name)){
          selects.push({
            table:tableName,
            field:fieldPrimary.name,
            primary:true,
          });
        }

        crd.script.title = "crud (" + c + ")";
        crd.script.parent = grid.GetColData({x:0,y:c}).col,
        crd.script.panels = [{col:12,y:0,title:"main",tipe:crd.tipe}];
        crd.script.stateTools = stTls_tb;
        crd.script.tableMain = tableName;
        crd.script.selects = selects;
        crd.script.fields = fields;

        cruds.push({
          name:"crudName" + (c+1),
          active:true,
          script:crd.script, 
        });
      }

      new ConsCruds({
        cruds,
      });
      
      

    }
  });

  

  

});
