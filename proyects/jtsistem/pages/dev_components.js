

var control = [
    {name:"window",active:false},
    {name:"form",active:false},
    {name:"editImage",active:false},
    {name:"crudBody",active:true},
    {name:"crudMaster",active:false},
];

function ControlActive(name) {
    
    var cn = control.find(c=>c.name=="window");
    return cn && cn.active;
}


control.forEach(cn => {
    
    if(cn.active){

        switch (cn.name) {
            case "window":
                
                cn.build = new Window({
                    parent:document.body,
                    blocked:false,show:false,
                    title:"titulo",
                    fields:[
                        {col:12,tipe:1,name:"field1",box:{tipe:1}},
    
                        {col:6,tipe:2,name:"field2",box:{tipe:3,options:[{value:1,show:"op1"},{value:2,show:"op2"},{value:3,show:"op3"},]}},
                        {col:6,tipe:2,name:"field3",box:{tipe:8,options:[{value:1,show:"op1"},{value:2,show:"op2"},{value:3,show:"op3"},]}},
    
                        {col:4,tipe:1,name:"field4",box:{tipe:1}},
                        {col:4,tipe:1,name:"field5",box:{tipe:1}},
                        {col:4,tipe:0,name:"field6",box:{tipe:6,value:1,name:"field6"}},
                    ],
                });
    
            break;

            case "form":

                cn.build = new Form({
                    parent:document.body,head:true,
                    blocked:false,show:true,
                    title:"formulario - titulo",
                    fields:[
                        {col:12,name:"filtro 1",box:{tipe:1}},
                    ],
                    tools:[
                        {position:"head-center",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                        {position:"head-left",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                        {position:"head-right",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                        {position:"botton-center",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                        {position:"botton-left",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                        {position:"botton-right",name:"config",box:{tipe:5,class:"btn btn-outline-primary btn-sm",value:'<i class="bi bi-gear-wide"></i>'}},
                    ],
                });

            break;

            case "editImage":

                var grid = new Grid({cols:[[6,6]]}); 
                var parent = grid.GetColData({x:0,y:0}).col;
                new EditableImage({
                    parent,
                    imageUrl:"../imagenes/vehiculo_4ruedas.png",
                });

            break;

            case "crudBody":

                new Crud_Body({
                    title:"test crud body opne",
                    filters:[
                        {name:"fecha min",box:{...bx_date}},
                        {name:"fecha max",box:{...bx_date}},
                        {name:"nombre",box:{...bx_input}},
                    ],
                    panels:[
                        {
                            col:4,name:"fm",
                            tipe:"form",title:"formulario",
                            fields:[
                                {name:"nombre",box:{...bx_input}},
                                {name:"options",box:{tipe:3}},
                            ],
                        },
                        {
                            col:8,name:"tb",
                            tipe:"table",title:"tabla",
                            fields:[
                                {name:"edit",box:{...fld_edit.box}},
                                {name:"nombre",box:{...bx_input}},
                                {name:"options",box:{tipe:3}},
                            ],

                        },
                    ],
                });

            break;

            case "crudMaster":
                
                new Crud_Master({
                    title:"lista de productos",
                    stateTools:[
                        {
                        name:"reload",
                        tools:[
                            {name:"config",show:true},
                            {name:"load",show:true},
                            {name:"sizes",show:true,value:10},
                            {name:"reload",show:true},
                            {name:"new",show:true},
                            {name:"pages",show:true},
                        ],
                        }
                    ],
                
                    tableMain:"products",
                    selects:[
                        {table:'products', field:'ID_PRODUCT',primary:true},
                        {table:'products', field:'NAME'},
                        {table:'products', field:'ID_PRODUCT_TIPE'},
                        {table:'products', field:'UNID_ID'},
                        {table:'products', field:'STOCK_TOTAL'},
                        {table:'products', field:'STOCK_LIMIT'},
                        {table:'products', field:'STOCK_ONLIMIT'},
                        {table:'products', field:'ACTIVE'},
                        {table:'products_tags', field:'NAME',as:"TAG_NAME"},
                
                    ],
                    joins:[
                        {
                        main:{table:"products",field:"ID_PRODUCT_TAG"},
                        join:{table:"products_tags",field:"ID_PRODUCT_TAG"},
                        tipe:"LEFT",
                        }
                    ],
                    loads:[
                        ld_unids,
                        ld_products_tags,
                    ],

                    configShow:false,    
                    filters:[
                        {name:"producto",box:bx_input,select:{table:"products",field:"NAME"},descripcion:"buscar por nombre de producto/servicio/insumo"},
                        {name:"tipo",box:{tipe:4,options:op_products_tipe},select:{table:"products",field:"ID_PRODUCT_TIPE"},descripcion:"buscar por producto/servicio/insumo"},
                        (true?{name:"etiqueta",box:{tipe:4,options:[]},select:{table:"products",field:"ID_PRODUCT_TAG"},load:{name:"ld-products_tags",show:"show"},descripcion:"buscar por etiqueta"}:null),
                        {name:"activo",box:{tipe:4,options:op_active,value:["activo"]},select:{table:"products",field:"ACTIVE"},descripcion:"buscar si el producto/servicio/insumo esta activo"},
                        (true?{name:"unidad",box:{tipe:4},select:{table:"products",field:"UNID_ID"},load:{name:"ld-unids",show:"show"},descripcion:"buscar por unidad"}:null),
                    ],
                    panels:[
                        {
                            col:12,title:"main",tipe:"table",
                            fields:[
                                {panel:"main",...fld_edit,descripcion:"editar informacion del producto/servicio/insumo"},
                                {panel:"main",attributes:[{name:"style",value:"min-width: 250px;"}],name:"producto",box:bx_shw,select:"NAME",descripcion:"nombre del producto/servicio/insumo"},
                                {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"tipo",box:{...bx_shw,options:op_products_tipe},select:"ID_PRODUCT_TIPE",descripcion:"puede ser producto/servicio/insumo"},
                                (true?{panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"etiqueta",box:bx_shw,select:"TAG_NAME",descripcion:"etiqueta del producto/servicio/insumo"}:null),
                        
                                (true?{panel:"main",name:"unidad",box:bx_shw,select:"UNID_ID",load:{name:"ld-unids",show:"show"},descripcion:"unidad del producto/servicio/insumo"}:null),
                                //{panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock total",box:(acc_stock_update?bx_input:{tipe:0,class:"text-center"}),select:"STOCK_TOTAL"},
                                //{panel:"main",attributes:[{name:"style",value:"min-width: 100px;"}],name:"stock minimo",box:{tipe:0,class:"text-center"},select:"STOCK_LIMIT"},
                                //{panel:"main",name:"limite",box:{tipe:0,options:[{value:0,show:"-",class:"rounded text-center bg-success text-white"},{value:1,show:"limit!",class:"rounded text-center bg-danger text-white"}]},select:"STOCK_ONLIMIT"},
                                
                                {panel:"main",attributes:[{name:"style",value:"min-width: 150px;"}],name:"activa",box:bx_active_show,select:"ACTIVE",descripcion:"si el producto/servicio/insumo esta activo, se puede vender o usar"},
                            ],
                        },
                    ],
                    
                });

            break;
        }
    }

});
