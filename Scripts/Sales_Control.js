
$(document).ready(function() {

  new Pag_Base({

    success:({page})=>{

      var grid = new Grid({
        cols:[[12],[12]],
        boxs:[
          {x:0,y:0,box:{tipe:0,default:"ventas netas:",class:"h1 w-100 text-center"}},
        ],
      });

      new Crud_Table({
        parent:grid.GetColData({x:0,y:1}).col,
        filters:[
          {name:"fecha min",box:{tipe:2,default:Date_Today()},sql:{field:2,inter:">="}},
          {name:"fecha max",box:{tipe:2,default:Date_Today()},sql:{field:2,inter:"<="}},
        ],
        ...sales_control,
        title:"control de ventas diarias",
      });

      
    }
  });

})
