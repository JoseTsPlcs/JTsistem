

function pageCofig_zones({}) {
    
    return {
        type:"free",
        actionsActive:true,
        actions:["see","update","insert"],
        record:{
        name:"zone",
        titleOne:"zona de entrega",
        titleMult:"zonas de entrega",
        },
        script:({userData,pageData,build})=>{
            
            return {
                layers:[
                    {
                        grid:{
                            items:[{name:"main",col:12}],
                        }
                    },
                    {
                        crud:{
                            parent:"main",name:"cr-zones",title:"lista de zonas de entrega",
                            ...getCrudMult({
                                userData,tipe:"table",
                                schemaMain:sch_zones,
                                fields:sch_zones.fields.map(f=>{return {value:f.value,state:"edit"};})
                            }),
                        }
                    }
                ],
                conections:[],
            };
        }
    }
}

function pageCofig_deliverys({}) {
    
    return {
        type:"free",
        actionsActive:true,
        actions:["see","update","insert"],
        record:{
            name:"deliverys",
            titleOne:"delivery",
            titleMult:"deliverys",
        },
        script:({userData,pageData,build})=>{
            
            return {
                layers:[],
            };
        }
    }
}