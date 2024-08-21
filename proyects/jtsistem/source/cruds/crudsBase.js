

const schemaExample = {

    table:"",
    fieldPrimary:"",
    fields:[
        {
            name:"",with:100,
            select:"",access:true,
            edit:{box:{}},
            show:{box:{}},
            filter:{box:{}},
            descripcion:"",
            tipe:"active/options",
            options:[],
            load:null,
        }
    ],
    panels:[
        {tipe:"",title:""},
    ],
}

var fieldTypes = [
    {
        tipe:"active",
        edit:{box:{tipe:6}},
        show:{box:{...bx_shw}},
        filter:{box:{tipe:4}},
    },
    {
        tipe:"options",
        edit:{box:{tipe:3}},
        show:{box:{...bx_shw}},
        filter:{box:{tipe:4}},
    },
    {
        tipe:"date",
        edit:{box:{...bx_date}},
        show:{box:{...bx_shw}},
        //filter:{box:{...bx_date}},
    },
    {
        tipe:"show",
        edit:{box:{...bx_shw}},
        show:{box:{...bx_shw}},
        filter:{box:{...bx_input}},
    },
    {
        tipe:"money",
        edit:{box:{...bx_input}},
        show:{box:{...bx_money}},
    },
    {
        tipe:"comment",
        edit:{box:{tipe:9}},
        show:{box:{...bx_shw}},
    }
];

function scr_base({schema=null,userData,fieldsSet=[],stateGeneral="show",parent,title=null,panelTipe="table",events=[]}) {

    schema.fields.forEach(field => {

        if(field.access != true) field.access = Access_Get(userData.access,field.access); 
        if(field.width == null) field.width = 100;
    });

    //set box by fieldType
    schema.fields.forEach(field => {

        var fieldTypeData = fieldTypes.find(f=>f.tipe==field.tipe);
        if(fieldTypeData){

            var options = field.options ? field.options : [];
            field.show = {box:{...fieldTypeData.show.box,options,name:field.name}};
            field.edit = {box:{...fieldTypeData.edit.box,options,name:field.name}};
            if(fieldTypeData.filter) field.filter = {box:{...fieldTypeData.filter.box,options}};
        }

    });
    

    //set state default
    schema.fields.forEach(act=>act.state=stateGeneral);

    //set state by fieldsSet
    if(fieldsSet.length>0){

        fieldsSet.forEach(fset => {
            
            //set state to field
            var actFound = schema.fields.find(act=>act.name==fset.name);
            if(actFound){

                if(fset.state == null) fset.state = stateGeneral;
                actFound.state = fset.state;
                if(actFound.access && actFound.state == "hide") actFound.access = false;
            }
        });
    };
    

    var actives = [...schema.fields.filter(fld=>fld.access == true)];

    var condCompany = {
        table:schema.table,
        field:"ID_COMPANY",
        inter:"=",
        value:userData.company.id,
    };

    var parentModalIs = parent instanceof Modal;
    var parentModalEvent = {
        name:"modalSetActive",
        actions:[{
            action:({active})=>{

                if(parent && parentModalIs) parent.SetActive({active});
            }
        }]
    };

    var panels = [{title:"main",head:false,tipe:panelTipe}];
    var stateTools = [
        {
            name:"reload",
            tools:[
                {name:"sizes",show:(panelTipe=="table"?true:!parentModalIs),value:(panelTipe=="table"?10:1)},
                {name:"reload",show:true},
                {name:"new",show:!parentModalIs},
                {name:"pages",show:!parentModalIs},
                {name:"cancel",show:parentModalIs},
                {name:"update",show:panelTipe=="form"},
            ],
        },
        {
            name:"new",
            tools:[
                {name:"cancel",show:true},
                {name:"insert",show:true},
            ],
        }
    ];

    
    var filters = [];
    if(panelTipe == "table"){

        filters = actives.filter(act=>act.filter!=null && act.filter.box!=null).map(act=>{

            return {
                name:act.name,
                select:act.select,
                box:act.filter.box,
                select:{table:(act.table?act.table:schema.table),field:act.select},
                descripcion:"buscar por " + act.descripcion,
                load:act.load?{name:act.load.name,value:"value",show:"show"}:null,
            }
        });
    }
    
    var fields = actives.map(act=>{

        return {
            panel:"main",
            name:act.name,
            select:act.select,
            box:{...(act.state=="edit"?act.edit.box:act.show.box)},
            descripcion:act.descripcion,
            attributes:(panelTipe=="table"?[{name:"style",value:"min-width: "+act.width+"px;"}]:null),
            load:(act.load?{name:act.load.name,value:"value",show:"show"}:null),
        }
    });
    
    //---selects----
    var selects = actives.map(act=>{

        return {
            table:act.table?act.table:schema.table,
            field:act.select,
            sql:act.sql,
        }
    });
    selects.push({
        table:schema.table,
        field:schema.fieldPrimary,
        primary:true,
    });

    //----joins----
    var joins = [];
    actives.filter(act=>act.conection && act.conection.joins!=null).forEach(act=>{

        act.conection.joins.forEach(join => {
           
            if(join.tipe==null) join.tipe="LEFT";
            joins.push(join);
        });
    });

    var loads = actives.filter(act=>act.load!=null).map(act=>{
        act.load.conditions = [
            {
                ...condCompany,
                table:act.load.tableMain,
            }
        ];
        return act.load;
    });

    if(parentModalIs) events.push(parentModalEvent);
    
    return {
        title:(title?title:schema.panels.find(p=>p.tipe==panelTipe).title),
        parent:(parentModalIs?parent.GetContent():parent),
        panels,
        stateStart:(parentModalIs && panelTipe=="form"?"block":"reload"),
        afterInsert:(parentModalIs && panelTipe=="form"?"block":"reload"),
        afterUpdate:(parentModalIs && panelTipe=="form"?"block":"reload"),
        afterCancel:(parentModalIs && panelTipe=="form"?"block":"reload"),
        stateTools,

        tableMain:schema.table,
        selects,
        inserts:[...ins_general],
        conditions:[
            condCompany,
        ],
        joins,
        loads,

        filters,
        fields,
        events,

    }
}


