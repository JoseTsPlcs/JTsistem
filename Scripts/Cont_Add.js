
$(document).ready(function() {
  
    new Pag_Base({

      success:({recive,page})=>{

        new Crud_Form({
          title:"nueva transaccion",
          tables:["transactions","accounts","transactions_tags"],
          loads:[1,
            {
              table_main:2,
              selects:[
                {table:2,field:0,as:"value"},
                {table:2,field:1,as:"show"},
                {table:2,field:2,as:"ingreso"},
              ],
            }
          ],
          windows:[
            {
              title:"informacion general",
              fields:[
                {col:3,name:"nro",sql:{field:0}},
                {col:9,name:"fecha",sql:{field:1},box:{tipe:2}},
                {name:"cuenta",tipe:1,sql:{field:4},box:{tipe:3},load:0},
                {col:6,name:"ingreso",sql:{field:6},box:{tipe:6}},
                {col:6,name:"etiqueta",tipe:1,sql:{field:3},box:{tipe:3}},
                {name:"total",sql:{field:2},box:{tipe:1}},
                {name:"descripcion",tipe:2,sql:{field:5},box:{tipe:1}},
              ],
            }
          ],
          events:[
            {
              name:"boxUpdate",
              actions:[
                {
                  name:"tag chag by ingreso",
                  action:(u)=>{

                    if(u.field.name == "ingreso"){

                      var ingresoValue = u.k.Print_GetValue({fieldName:u.field.name,y:u.y});
                      var tagsData = u.k.Loads_GetData({loadIndex:1});
                      var tagsByIngreso = tagsData.filter(tg=>tg.ingreso==ingresoValue);
                      var optionsFromTags = tagsByIngreso.map((tg)=>{return{value:tg.value,show:tg.show}});
                      var optionInitial = optionsFromTags[0];

                      u.k.Print_SetOptions({fieldName:"etiqueta",options:optionsFromTags});
                      u.k.Print_SetValue({fieldName:"etiqueta",value:optionInitial.value,y:0});
                    }
                  }
                }
              ],
            }
          ],
        });

      } 
    });
  
});