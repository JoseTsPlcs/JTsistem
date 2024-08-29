
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      new CrudsGroup({
        userData,
        parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"main",col:12},
                {name:"prnt-unid",col:12},
                {name:"prnt-tag",col:12},
              ]
            },
          },
          {
            modal:{
              parent:"prnt-unid",
              name:"md-unid",
            }
          },
          {
            modal:{
              parent:"prnt-tag",
              name:"md-tag",
            }
          }
        ],
        cruds:[
          {
            parent:"main",title:"producto",
            schema:sch_items,name:"cr-item",
            panels:[
              {
                tipe:"form",title:"informacion",head:false,
                fieldsSet:[
                  {value:"name",state:"edit",col:10},
                  {value:"active",state:"edit",col:2},
                  {value:"tipe",state:"edit"},
                  {value:"tag",state:"edit"},
                  {value:"unid",state:"edit"},
                  {value:"price",state:"edit"},
                  {value:"costUnit",state:"edit"},
                  {value:"stock",state:"edit"},
                  {value:"limit",state:"edit"},
                ],
              }
            ],
          },
          {
            parent:"prnt-unid",title:"unidad",
            schema:sch_unids,name:"cr-unid",
            panels:[
              {
                tipe:"form",title:"informacion",head:false,
                fieldsSet:[
                  {value:"name",state:"edit"},
                  {value:"simbol",state:"edit"},
                ],
              }
            ],
          },
          {
            parent:"prnt-tag",title:"etiqueta",
            schema:sch_items_tag,name:"cr-tag",
            panels:[
              {
                tipe:"form",title:"informacion",head:false,
                fieldsSet:[
                  {value:"name",state:"edit"},
                ],
              }
            ],
          },
        ],
        conections:[
          {
            main:{crudName:"cr-item"},
            event:{fieldValue:"unid"},
            join:{crudName:"cr-unid"},
          },
        ],
      });
      

    }
  });

  

  

});
