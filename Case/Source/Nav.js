
const secciones = [
  {value:0,show:'ventas'},
  {value:1,show:'despacho'},
  {value:2,show:'reporte'},
  {value:3,show:'clientes'},
  {value:4,show:'productos'},
  {value:5,show:'compras'},
  {value:6,show:'almacen'},
  {value:7,show:'contabilidad'},
  {value:8,show:'administrador'},
  {value:9,show:'usuario'},
]

const paginas = [

  //{value:0,show:'',php:'',seccion:-1},

  {value:1,show:'venta', php:'Factura',seccion:0},
  {value:2,show:'control', php:'Sales_Control',seccion:0},
  {value:35,show:'caja', php:'Sales_Cash',seccion:0},
  {value:36,show:'caja ingreso', php:'Sales_CashAdd',seccion:0},
  {value:3,show:'armar', php:'Armar',seccion:0},
  {value:4,show:'cobrar', php:'Sales_Pay',seccion:0},
  {value:5,show:'entregar', php:'Sales_Commit',seccion:0},

  {value:6,show:'deliverys',php:'Delivery',seccion:1},
  {value:7,show:'zonas',php:'Delivery_Zones',seccion:1},
  //{value:0,show:'macro',php:'',seccion:1},

  {value:8,show:'ventas del mes',php:'Report_Sales',seccion:2},
  {value:9,show:'flujo de caja',php:'Report_Cont',seccion:2},

  {value:10,show:'clientes',php:'Customers',seccion:3},
  {value:11,show:'nuevo',php:'Customers_Add',seccion:3},
  {value:12,show:'tipos',php:'Customers_Types',seccion:3},

  {value:13,show:'productos',php:'Products',seccion:4},
  //{value:0,show:'receta', php:'',seccion:4},
  {value:14,show:'precios', php:'Prices',seccion:4},
  {value:15,show:'tipos', php:'Products_Types',seccion:4},
  {value:16,show:'unidades', php:'Providers_Products',seccion:4},

  {value:17,show:'compras', php:'Buy_Control',seccion:5},
  {value:18,show:'nueva', php:'Buy_Add',seccion:5},
  {value:19,show:'proveedores', php:'Providers',seccion:5},
  {value:20,show:'proveedores productos', php:'Providers_Products',seccion:5},

  {value:21,show:'control de ingreso', php:'Store_ListEnter',seccion:6},
  {value:22,show:'ingreso', php:'Store_ListEnter',seccion:6},
  {value:23,show:'stock', php:'Store_Stock',seccion:6},

  {value:28,show:'facturas',php:'Cont_Facturas',seccion:7},
  {value:29,show:'vista factura',php:'Cont_Factura_View',seccion:7},
  {value:30,show:'transacciones',php:'Cont_Transactions',seccion:7},
  {value:33,show:'nueva transaccion',php:'Cont_Add',seccion:7},
  {value:31,show:'etiquetas',php:'Cont_Tag',seccion:7},
  {value:32,show:'cuentas',php:'Cont_Account',seccion:7},

  {value:24,show:'administrador',php:'Admin_Control',seccion:8},
  {value:25,show:'usuarios',php:'Admin_Users',seccion:8},
  {value:26,show:'roles',php:'Admin_Roles',seccion:8},

  {value:27,show:'salir',php:'LogOut',seccion:9},
  //{value:0,show:'perfil',php:'',seccion:9},


];
