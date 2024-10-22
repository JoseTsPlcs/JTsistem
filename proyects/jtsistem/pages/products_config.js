
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      /*var gr = new Grid({
        parent:pageData.body,
        cols:[[6,6]],
        attributes:[
          {x:0,y:0,attributes:[{name:"class",value:"col-12 col-md-6"}]},
          {x:1,y:0,attributes:[{name:"class",value:"col-12 col-md-6 px-0 px-md-"+paddinForms+" pt-"+paddinForms +" pt-md-0"}]},
        ],
      });*/
    
      var group = new CrudsGroup({
        pageData,
        userData,parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-unids",col:6},
                {name:"prnt-tags",col:6},
              ],
            }
          },
          {
            crud:{
              parent:"prnt-unids",name:"cr-unids",
              title:"lista de unidades",schema:sch_unids,
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"name",state:"edit"},
                    {value:"simbol",state:"edit"},
                  ],
                },
              ],
            }
          },
          {
            crud:{
              parent:"prnt-tags",name:"cr-item-tags",
              title:"lista de etiquetas",schema:sch_items_tag,
              panels:[
                {
                  tipe:"table",
                  fieldsSet:[
                    {value:"name",state:"edit"},
                  ],
                },
              ],
            }
          },
        ],
      });

      PlayTutorialInPage({group,pageData});
    }
  });
  

});
