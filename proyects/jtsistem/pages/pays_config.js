
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      function BlockDeafults({crudBuild,namesDefault=[],fieldName="name"}) {
        
        namesDefault.forEach(nm => {
          
          var values = crudBuild.bodyGet().fieldGetValues({fieldName});
          var index = values.findIndex(v=>v==nm);
          if(index!=-1){

            crudBuild.bodyGet().fieldsGet().forEach(f => {

              crudBuild.bodyGet().fieldGetBoxes({fieldName:f.name})[index].Block({active:true});
            });
            
          }

        });

      }

      var group = new CrudsGroup({
        userData,pageData,parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-tags",col:6},
                {name:"prnt-accounts",col:6},
              ]
            }
          },
          {
            crud:{
              parent:"prnt-tags",title:"lista de etiquetas",
              schema:shc_pay_tag,name:"cr-pay-tags",recordName:"etiqueta de transferencia",
              panels:[{
                tipe:"table",
                fieldsSet:[
                  {value:"name",state:"edit"},
                  {value:"income",state:"edit"},
                ],
              }],
              events:[
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{

                      BlockDeafults({
                        crudBuild:k,
                        namesDefault:pay_tags_default.map(p=>p.name),
                        fieldName:"name",
                      });
                    }
                  }]
                }
              ],
            }
          },
          {
            crud:{
              parent:"prnt-accounts",title:"lista de cuentas",
              schema:sch_accounts,name:"cr-accounts",recordName:"cuenta",
              panels:[{
                tipe:"table",
                fieldsSet:[
                  {value:"name",state:"edit"},
                  {value:"total",state:"edit"},
                  {value:"open",state:"edit"},
                  {value:"control",state:"edit"},
                ],
              }],
            }
          }
        ]
      });

      PlayTutorialInPage({group,pageData});
    }
  });
  

});
