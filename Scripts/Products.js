
$(document).ready(function() {

  new Pag_Base({
    success:()=>{

      const panel = new Grid({cols:[[12],[12]]});

      var control = {
        list:{active:true},
        form:{active:true},
      }

      control.list.parent = panel.GetColData({x:0,y:0}).col;

      if(control.list.active){

        control.list.build = new Crud({
          parent:control.list.parent,
          tipe:"table",
          title:"productos",
          tables:["productos","productos_tipo","unidades"],
          loads:[1,2],configShow:false,
          filters:[
            {name:'producto',box:1,sql:1},
            {name:'tipo',box:{tipe:1},box:{tipe:4},load:0,sql:{field:18}},
            {name:'unidad',box:{tipe:1},box:{tipe:4},load:1,sql:{field:10}},
            {name:'activo',box:{...Box_MutipleDual({show:'activo'}),default:['activo']},sql:{field:12}},
            {name:'publico',box:{...Box_MutipleDual({show:'publico',show2:'oculto'}),default:['publico']},sql:{field:17}},
          ],
          fields:[
            {action:"delete"},
            {action:"edit"},
            {name:'producto',size:500,box:1,sql:1},
            {name:'tipo',sql:18,load:0,box:3},
            {name:'unidad',sql:10,load:1,box:3},
            {name:'activo',box:6,sql:12},
            {name:'publico',box:6,sql:17},
          ],
        });
      }

      if(control.form.active){

        control.form.build = new Crud({
          parent:panel.GetColData({x:0,y:1}).col,
          tipe:"form",
          modal:control.list.active,
          title:"producto",
          tables:["productos","productos_tipo","unidades"],
          loads:[1,2],
          stateStart:((control.list.active)?"new":"reload"),
          windows:[
            {
              title:"informacion general",
              fields:[
                
                {col:6,name:'activo',box:6,sql:12},
                {col:6,name:'publico',box:6,sql:17},
                {name:'producto',size:500,box:1,sql:1},
                {col:6,name:'tipo',sql:18,load:0,box:3},
                {col:6,name:'unidad',sql:10,load:1,box:3},
              ],
            },
            {
              title:"precios",
              fields:[
                {col:3,name:"1kg",tipe:2,box:1,sql:5},
                {col:3,name:"500g",tipe:2,box:1,sql:4},
                {col:3,name:"250g",tipe:2,box:1,sql:3},
                {col:3,name:"100g",tipe:2,box:1,sql:2},
  
                {col:6,name:"1kg>",tipe:2,box:1,sql:6},
                {col:6,name:"5kg>",tipe:2,box:1,sql:7},
              ],
            },
            {
              title:"inventario",
              fields:[
                {col:3,tipe:2,name:"unidad_",sql:10,load:1},
                {col:3,name:"stock",tipe:2,box:1,sql:9},
                {col:3,name:"limite",tipe:2,box:1,sql:14},
                {col:3,name:"en el limite",tipe:2,sql:15},
              ],
            },
            {
              title:"contabilidad",
              fields:[
                {col:6,name:"%utilidad",tipe:2,box:1,sql:13},
                {col:6,name:"costo",tipe:2,box:1,sql:11},
              ],
            }
          ],
        });
      }

      if(control.form.active && control.list.active){

        new Crud_Master({
          master:{
            event:"edit",
            selectName:"primary",
            build:control.list.build,
          },
          maid:{
            fieldSqlIndex:0,
            build:control.form.build,
          }
        });
      }
    }
  });

});
