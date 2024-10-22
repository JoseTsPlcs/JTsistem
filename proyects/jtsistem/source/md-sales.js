
var cr_sale_fm = {
    parent:"prnt-sale",name:"fm-sale",
    title:"venta",
    schema:sch_sales,
    panels:[
        {
            tipe:"form",title:"informacion",head:true,
            fieldsSet:[
                {value:"emmit",state:"edit"},
                {value:"status",state:"edit"},
                {value:"pay",state:"show"},
                {value:"comment",state:"edit"},
            ],
        },
        {
            tipe:"form",title:"total",head:true,
            fieldsSet:[
                {value:"totaldscto",state:"show"},
                {value:"dscto",state:"edit"},
                {value:"total",state:"show"},
            ],
        },
        {
            tipe:"form",title:"cliente",head:true,
            fieldsSet:[
                {
                    value:"customer",state:"edit",
                    load:{
                        name:"ld-customer",
                        tableMain:sch_customers.table,
                        selects:[
                            {table:sch_customers.table,field:sch_customers.fieldPrimary,as:"value"},
                            {table:sch_customers.table,field:"NAME",as:"show"},
                        ],
                    }
                },
                //{action:"show",name:"nro de documento"},
            ],
        },
    ],
    stateStart:"new",
    statetools:[
        {
            name:"reload",
            tools:[
                {name:"reload",show:true},
                {name:"update",show:true},
                {name:"sizes",show:false,value:1},
                {name:"pages",show:true},
            ],
        },
        {
            name:"new",
            tools:[
                {name:"insert",show:true},
            ],
        },
    ],
    conections:[
        {main:{event:"reload",select:"ID_SALE"},join:{action:"join",crud:"tb-items",select:"ID_SALE"}},
    ],
}

var cr_items_tb = {

    parent:"stp-items",name:"tb-items",
    title:"lista de items",
    schema:sch_sales_products,
    panels:[
        {
            tipe:"table",
            fieldsSet:[
                {
                    value:"item",state:"edit",
                    load:{
                        name:"ld-item",
                        tableMain:sch_items.table,
                        selects:[
                            {table:sch_items.table,field:sch_items.fieldPrimary,as:"value"},
                            {sql:("CONCAT("+sch_items.table+".NAME,' (',unids.SIMBOL,')') AS 'show'")},
                            {table:sch_items.table,field:"PRICE_UNIT",as:"priceUnit"},
                        ],
                        joins:[
                            {
                                main:{table:sch_items.table,field:"UNID_ID"},
                                join:{table:"unids",field:"ID_UNID"},
                                tipe:"LEFT",
                            }
                        ],
                    },
                },
                {value:"cant",state:"edit"},
                {value:"priceUnit",state:"show"},
                {value:"priceTotal",state:"show"},
            ],
        }
    ],
    stateStart:"block",
    statetools:[
        {
            name:"reload",
            tools:[
                {name:"reload",show:true},
                {name:"new",show:true},
                {name:"sizes",show:false,value:10},
            ]
        },
        {
            name:"new",
            tools:[
                {name:"insert",show:true},
                {name:"cancel",show:true},
            ],
        }
    ],
    conections:[
        /*{
            main:{event:"reload",fieldValue:"priceTotal",action:"sum"},
            join:{crud:"fm-sale",action:"print",fieldName:sch_sales.fields.find(f=>f.value=="totaldscto").name},
        }*/
    ],
}

var cr_pays_tb = {

    parent:"stp-pays",name:"tb-pays",
    title:"lista de pagos",
    schema:sch_pays,
    panels:[
        {
            tipe:"table",
            fieldsSet:[
                {value:"date",state:"show"},
                {value:"total",state:"show"},
                {value:"income",state:"show"},
                //{value:"tag",state:"show"},
            ],
        }
    ],
    stateStart:"block",
    statetools:[
        {
            name:"reload",
            tools:[
                {name:"reload",show:true},
                {name:"new",show:true},
                {name:"sizes",show:false,value:999},
            ]
        },
    ],
}

var cr_pay_fm = {


}

var crsg = {

    layers:[],
    cruds:[],
    conections:[],
};


var salenew2_page = {
    value:"saleNew2",
    layers:[
        {
            grid:{
                items:[
                    {name:"prnt-sale",col:4},
                    {name:"prnt-items",col:8},
                ],
            },
        },
        {
            steps:{
                parent:"prnt-items",
                items:[
                    {name:"stp-items"},
                    {name:"stp-pays"},
                ],
            }
        }
    ],
    cruds:[
        {
            ...cr_sale_fm,
        },
        {
            ...cr_items_tb,
        },
    ],
    conections:[
        {
            main:{crud:cr_sale_fm.name},
            event:{action:"event"},
            join:{crud:cr_items_tb.name},
        },
        {
            main:{crud:cr_sale_fm.name},
            event:{action:"event"},
            join:{crud:cr_pays_tb.name},
        },
        {
            main:{crud:"pays"},
            event:{field:""},
            join:{crud:""},
        }
    ],
    
};