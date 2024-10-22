
$(document).ready(function() {

  new Pag_Base({

    success:({userData,pageData})=>{

      var tutorialModulos = [
        {
          value:"md-sale",
          questions:[
            //{name:"saleNew",descripcion:"Cómo crear una nueva venta",page:"saleNew2"},
            {descripcion:"Cómo editar o anular un registro de ventas",page:"salesCotizacion"},
            {descripcion:"Seguimiento de ventas existentes",page:"salesCotizacion"},
            {descripcion:"Seguimiento de pagos pendientes",page:"salesPay"},
            {descripcion:"Realizar una busqueda de ventas",page:"salesControl"},
            {descripcion:"Reporte de ventas terminadas",page:"informSales"},
            {descripcion:"Como abro caja para registrar pagos",page:"box"},
            //{descripcion:"Generación de reportes de ventas"},
          ],
        },
        {
          value:"md-customer",
          questions:[
            {descripcion:"Cómo agregar y editar información de clientes",page:"customers"},
            {descripcion:"Filtrado y búsqueda de clientes",page:"customers"},
            //{descripcion:"Segmentación de clientes según compras, historial, etc.",page:"customers"},
            //{descripcion:"Exportación de la base de datos de clientes"},
          ],
        },
        {
          value:"md-buy",
          questions:[
            {descripcion:"Cómo agregar una nueva compra",page:"buyNew"},
            {descripcion:"Seguimiento de compras",page:"buyControl"},
            {descripcion:"Cómo agregar y editar información de proveedores",page:"provieeders"},
            //{descripcion:"Actualización de inventarios tras una compra"},
            //{descripcion:"Visualización y descarga de reportes de compras"},
          ],
        },
        {
          value:"md-items",
          questions:[
            {descripcion:"Cómo crear, editar o eliminar productos/servicios",page:"items"},
            {descripcion:"Control de inventarios (productos)",page:"stock"},
            {descripcion:"Definir precios",page:"prices"},
            {descripcion:"Agrupación de ítems por categorías",page:"itemsConfig"},
          ],
        },
        {
          value:"md-bills",
          questions:[
            {descripcion:"Cómo generar una factura a partir de una venta",page:"bills"},
            //{descripcion:"Generación de reportes financieros",page:"informAccounts"},
          ],
        },
        /*
        */
      ];

      //set value to questions
      tutorialModulos.forEach(modulo => {
        
        modulo.modulo = modulos.find(md=>md.value==modulo.value);
        modulo.access = false;

        for (let q = 0; q < modulo.questions.length; q++) {

          var question = modulo.questions[q];
          question.value = modulo.name + "-" + question.name;      
          var questionPage = PageDataFind({pageName:question.page});
          question.access = questionPage.state=="active";
          if(question.access) modulo.access = true;
        }

        modulo.questions = modulo.questions.filter(q=>q.access);

      });

      //filter just the access
      var tutorialAccess = tutorialModulos.filter(md=>md.access);

      //build parent
      var gr_parent = new Grid({
        parent:pageData.body,
        cols:tutorialAccess.map(t=>{return [12]}),
      });

      //build modulos
      for (let y = 0; y < tutorialAccess.length; y++) {

        var t = tutorialAccess[y];

        var parent = gr_parent.GetColData({x:0,y}).col;
        var fields = [];
        for (let q = 0; q < t.questions.length; q++) {

          const question = t.questions[q];
          let questionValue = question.value;

          fields.push({
            col:2,
            name:"questionIteaction"+q,
            tipe:0,
            box:{
              tipe:5,
              class:"btn btn-secondary btn-sm",
              value:'<i class="bi bi-question-circle"></i>',
            },
          });
          fields.push({
            col:10,
            name:"questionName"+q,
            tipe:0,
            box:{
              tipe:0,
              class:"text-left w-100 px-1",
              value:question.descripcion
            },
          });          

        };

        t.build = new Form({
          parent,blocked:false,show:true,
          title:t.modulo.show,
          fields,
          events:[{name:"fieldUpdate",actions:[{action:(value)=>{PlayTutorial({modIndex:y,questIndex:value.y})}}]}],
        });
      }

      tutorialAccess.forEach(modulo => {
        
        //console.log(modulo.build.Field_GetBox({fieldName:"questionIteaction0"}));
        
      });

      function PlayTutorial({modIndex=-1,questIndex=-1}) {
        
        var question = tutorialAccess[modIndex].questions[questIndex];
        console.log("activar tutorial ",modIndex,questIndex,question);
        InfoBetweenPagesSet({question});
        //return;

        if(question.page) TutorialGoToPage({pageName:question.page});

      }
      
    }
  });
  

});
