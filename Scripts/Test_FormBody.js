
$(document).ready(function() {

    var control = {
        odd:{
            active:false,
        },
        window:{
            active:false,
        },
        form:{
            active:false,
        },
        filter:{
            active:false,
        },
        crudBody:{
            active:true,
        },
        crud:{
            active:true,
        }
    }

    if(true){

        var panel = new Grid({
            cols:[[12],[12],[12],[12],[12],[12]],
        });

        control.window.parent = panel.GetColData({x:0,y:0}).col;
        control.form.parent = panel.GetColData({x:0,y:1}).col;
        control.filter.parent = panel.GetColData({x:0,y:2}).col;
        control.crudBody.parent = panel.GetColData({x:0,y:3}).col;
    }

    if(control.odd.active){

        control.odd.build = new ODD({
            name:"odd test",
            events:[
                {
                    name:"started",
                    actions:[{
                        action:()=>{console.log("odd tester was started");}
                    }]
                }
            ],
        });
    }

    if(control.window.active){

        control.window.build = new Window({
            parent:control.window.parent,
            title:"window test",
            blocked:false,head:true,
            h:500,
            fields:[
                {name:"field 1",box:1},
                {col:6,name:"field",box:{tipe:2,default:Date_Today()}},
                {col:6,name:"field",box:1},
            ],
        });
    }

    if(control.form.active){

        control.form.build = new Form({
            parent:control.form.parent,
            title:"form test",
            h:500,
            windows:[
                {   
                    head:true,
                    title:"window 1",
                    blocked:false,
                    show:false,
                },
                {
                    col:6,h:200,head:false,
                    title:"window 2",
                },
                {
                    col:6,h:200,head:false,
                    title:"window 3",
                },
                {
                    col:4,
                    title:"window 4",
                },
                {
                    col:4,
                    title:"window 5",
                },
                {
                    col:4,
                    title:"window 6",
                },
                {
                    h:300,show:false,
                    title:"window 7",
                    blocked:false,
                },
            ],
            tools:[
                {name:'config',x:0,y:1,box:{tipe:5,value:icons.settings,class:'btn btn-outline-primary btn-sm'}},
                {name:'load',x:0,y:1,box:{tipe:5,value:icons.load,class:'btn btn-outline-primary btn-sm'}},

                {name:'excel',x:2,y:1,box:{tipe:5,value:"excel",class:'btn btn-outline-success btn-sm'}},
                {name:'pdf',x:2,y:1,box:{tipe:5,value:"pdf",class:'btn btn-outline-danger btn-sm'}},

                {name:'sizes',x:0,y:3,box:{tipe:3,value:1,options:[{value:1,show:'1'},{value:10,show:'10'},{value:25,show:'25'},{value:999,show:'999'},]}},

                {name:'reload',x:1,y:3,box:{tipe:5,value:'recargar',class:'btn btn-outline-primary btn-sm'}},
                {name:'save',x:1,y:3,box:{tipe:5,value:'guardar',class:'btn btn-outline-primary btn-sm'}},
                {name:'new',x:1,y:3,box:{tipe:5,value:'nuevo',class:'btn btn-outline-primary btn-sm'}},
                {name:'delete',x:1,y:3,box:{tipe:5,value:'borrar',class:'btn btn-outline-danger btn-sm'}},
                //{name:'add',x:1,y:3,box:{tipe:5,value:'añadir',class:'btn btn-outline-primary btn-sm'}},
                //{name:'cancel',x:1,y:3,box:{tipe:5,value:'cancelar',class:'btn btn-outline-danger btn-sm'}},

                //{name:'page_back',x:2,y:3,box:{tipe:5,value:'<',class:'btn btn-outline-primary btn-sm'}},
                {name:'pages',x:2,y:3,box:{tipe:3,value:1,options:[{value:1,show:'pag1'},{value:2,show:'pag2'},{value:3,show:'pag3'}]}},
                //{name:'page_next',x:2,y:3,box:{tipe:5,value:'>',class:'btn btn-outline-primary btn-sm'}},
            ],
        })
    }

    if(control.filter.active){

        control.filter.build = new Filters({
            parent:control.filter.parent,
            filters:[
                {name:"filter 1",box:1},
                {col:6,name:"filter 2",box:{tipe:2,default:Date_Today()}},
                {col:6,name:"filter 3",box:1},
            ],
        });
    }

    if(control.crudBody.active){

        control.crudBody.build = new Crud_Body({
            parent:control.crudBody.parent,
            title:"form body test",
            filters:[
                {name:"field 1",box:1},
                {col:6,name:"field",box:{tipe:2,default:Date_Today()}},
                {col:6,name:"field",box:1},
            ],
            windows:[
                {   
                    head:true,
                    title:"window 1",
                    blocked:false,
                    show:false,
                },
                {
                    col:6,h:200,head:true,
                    title:"window 2",
                },
                {
                    col:6,h:200,head:true,
                    title:"window 3",
                },
            ],
        });
    }

});