
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

      var acc_trasn = op_access.find(acc=>acc.value=="acc-1") && op_access.find(acc=>acc.value=="acc-1").value=="true";

      var gr = new Grid({
        cols:[
          [6,6],//0
          [6,6],//1
          [6,6],//2
    
          [12],//3
          [12],//4
        ],
        boxs:[
          {x:0,y:0,box:{class:"h1 text-center",value:"total:"}},
          {x:1,y:0,box:bx_incomeh1},
    
          {x:0,y:1,box:{class:"h3 text-center",value:"ingresos:"}},
          {x:1,y:1,box:{...bx_moneyh3,class:"h3 text-success"}},
    
          {x:0,y:2,box:{class:"h3 text-center",value:"egresos:"}},
          {x:1,y:2,box:{...bx_moneyh3,class:"h3 text-danger"}},
        ],
      });
      var md = new Modal({parent:gr.GetColData({x:0,y:4}).col,size:"lg"});
    
      new ConsCruds({
    
        cruds:[
          {
            name:"pagos",
            active:true,
            script:{
              parent:gr.GetColData({x:0,y:3}).col,
              title:"lista de pagos",
              panels:[{col:12,y:0,title:"main",tipe:"table"}],
              stateTools:[
                {
                    name:"reload",
                    tools:[
                        {name:"config",show:true},
                        {name:"load",show:true},
                        
                        {name:"excel",show:false},
                        {name:"pdf",show:false},
            
                        {name:"sizes",show:false,value:50},
                        {name:"reload",show:false},
                        {name:"update",show:false},
                        {name:"new",show:true},
                        {name:"insert",show:false},
                        {name:"cancel",show:false},
                        
                        {name:"pages",show:false},
                    ],
                }
              ],  
    
              tableMain:"payments",
              selects:[
                {table:'payments', field:'ID_PAY',primary:true},
                {table:'payments', field:'DATE_EMMIT'},
                {table:'payments', field:'TOTAL'},
                {table:'payments', field:'ID_ACCOUNT'},
                {table:'payments', field:'ID_PAY_TAG'},
                {table:'payments',field:'INCOME'},
                {table:'accounts', field:'NAME', as:"ACCOUNT_NAME"},
                {table:'pay_tag', field:'NAME', as:"TAG_NAME"},
              ],
              joins:[
                {main:{table:"payments",field:"ID_PAY_TAG"},join:{table:"pay_tag",field:"ID_PAY_TAG"},tipe:"LEFT"},
                {main:{table:"payments",field:"ID_ACCOUNT"},join:{table:"accounts",field:"ID_ACCOUNT"},tipe:"LEFT"},
              ],
              loads:[
                ld_pay_tag,
                ld_accounts,
              ],
              orders:[
                {field:"DATE_EMMIT",asc:false},
                {field:"ID_PAY",asc:false},
              ],
              conditions:[{
                before:" AND ",
                table:"payments",
                field:"ID_COMPANY",
                inter:"=",
                value:userData.company.id,
              }],
              
    
              configShow:false,
              filters:[
                {col:6,y:0,name:"fecha min",box:bx_date_start,select:{table:"payments",field:"DATE_EMMIT",tipe:"min"}},
                {col:6,y:0,name:"fecha max",box:bx_date_end,select:{table:"payments",field:"DATE_EMMIT",tipe:"max"}},
                {col:12,y:2,name:"etiquetas",box:{tipe:4,class:"w-100"},load:{name:"pay_tag",show:"show"},select:{table:"payments",field:"ID_PAY_TAG"}},
                {col:12,y:1,name:"cuentas",box:{tipe:4,class:"w-100"},load:{name:"accounts",show:"show"},select:{table:"payments",field:"ID_ACCOUNT"}},
              ],
              fields:[
                (acc_trasn?{panel:"main",...fld_delete}:null),
                {panel:"main",...fld_edit},
                //{panel:"main",name:"id",box:bx_shw,select:"ID_PAY"},
                {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"fecha de emision",box:bx_shw,select:"DATE_EMMIT"},
                {panel:"main",name:"total",box:bx_income,select:"TOTAL"},
                {panel:"main",name:"etiqueta",box:bx_shw,select:"TAG_NAME"},
                {panel:"main",name:"cuenta",box:bx_shw,select:"ACCOUNT_NAME"},
                {panel:"main",name:"ingreso",box:{...bx_shw,options:[{value:0,show:"egreso"},{value:1,show:"ingreso"}]},select:"INCOME"},
              ],
    
              events:[
                {
                  name:"printBefore",
                  actions:[{
                    action:({result})=>{
    
                      result.forEach(line => {
                        
                        var income = parseInt(line["INCOME"]) == 1;
                        var total = parseFloat(line["TOTAL"]);
                        line["TOTAL"] = total * (income?1:-1);
                      });
    
                      return {data:result};
                    }
                  }]
                },
                {
                  name:"calculateTotal",
                  actions:[{
                    action:({k})=>{
    
                      var data = k.GetValues({fieldName:"total"});
                      var ingreso = 0;
                      var egreso = 0;
                      data.forEach(value => {
                        
                        if(value > 0) ingreso += value;
                        else egreso += value;
                      });
                      var total = ingreso + egreso;
    
                      gr.GetColData({x:1,y:0}).boxs[0].SetValue(total);
                      gr.GetColData({x:1,y:1}).boxs[0].SetValue(ingreso);
                      gr.GetColData({x:1,y:2}).boxs[0].SetValue(egreso);
                    }
                  }]
                },
                {
                  name:"printAfter",
                  actions:[{
                    action:({k})=>{
    
                      k.CallEvent({name:"calculateTotal"});
                    }
                  }],
                }
              ],
            }
          },
          {
            name:"pay",
            active:true,
            script:{
              parent:md.GetContent(),
              ...scr_pay({
                events:[
                  {
                    name:"modalSetActive",
                    actions:[
                      {
                        action:({active})=>{
      
                          md.SetActive({active});
                        }
                      }
                    ]
                  }
                ],
              }),
            }
          }
        ],
    
        conections:[
          {
            tipe:"tb-fm",
            master:"pagos",
            masterField:"ID_PAY",
            maid:"pay",
            maidField:"ID_PAY",
          }
        ],
      });
    }
  });
  

});
