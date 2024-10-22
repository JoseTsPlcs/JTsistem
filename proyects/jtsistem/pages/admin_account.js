
$(document).ready(function() {

  new Pag_Base({
    success:({userData,pageData})=>{

      var group = new CrudsGroup({
        userData,pageData,parent:pageData.body,
        layers:[
          {
            grid:{
              items:[
                {name:"prnt-companie",col:12},
                {name:"prnt-workers",col:7},
                {name:"prnt-areas",col:5},
              ],
            }
          },
          {
            crud:{
              parent:"prnt-companie",title:"empresa",recordName:"informacion de la empresa",
              schema:sch_companies,name:"cr-companie",
              states:[
                {
                  name:"reload",
                  tools:[
                    {name:"tutorial",show:true},
                    {name:"update",show:true},
                  ],
                }
              ],
              panels:[{
                tipe:"form",head:false,
                fieldsSet:[
                  {value:"name",state:"edit"},
                  {value:"ruc",state:"edit"},
                  {value:"nameReal",state:"edit"},
                  {value:"dir",state:"edit"},
                  {value:"cel",state:"edit"},
                  {value:"email",state:"edit"},
                ],
              }]
            }
          },
          {
            crud:{
              access:"md-workers-general",
              title:"areas de trabajo",parent:"prnt-areas",
              name:"cr-areas",schema:sch_work_areas,recordName:"area de trabajo",
              panels:[{
                tipe:"table",
                fieldsSet:[
                  {value:"name",state:"edit"},
                ],
              }]
            } 
          },
          {
            crud:{
              access:"md-workers-general",
              title:"lista de trabajadores",schema:sch_workers,
              parent:"prnt-workers",name:"cr-workers",recordName:"trabajador",
              panels:[{
                tipe:"table",
                fieldsSet:[
                  {value:"name",state:"edit"},
                  {value:"cel",state:"edit"},
                  {value:"area",state:"edit"},
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
