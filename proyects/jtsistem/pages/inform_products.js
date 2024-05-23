
$(document).ready(function() {

  new Pag_Base({

    success:({userData})=>{

          
      var gr = new Grid({
        cols:[
          [12],//0-filters
          [6,6],//1-total
          [8,4],//2-prices
          [12],//3-cants
        ],
      });

      var chartParent1 = document.createElement("canvas");
      gr.GetColData({x:0,y:2}).col.appendChild(chartParent1);
      var chartPrices = new Chart(chartParent1, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange',"Mes1","mes2"],
          datasets: [
            {
              label: 'precios',
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1,
              type:"line",
            },
            {
              label: 'precios',
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1,
            },
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'productos - venta total'
            },
          },
          responsive: true,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true
            }
          }
        }
      });

      var chartParent12 = document.createElement("canvas");
      gr.GetColData({x:1,y:2}).col.appendChild(chartParent12);
      var chartPricesDoughtnut = new Chart(chartParent12, {
        type: 'doughnut',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange',"Mes1","mes2"],
          datasets: [
            {
              label: 'precios',
              data: [12, 19, 3, 5, 2, 3],
              //borderWidth: 1
            },
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'productos - venta total'
            }
          }
        }
      });

      var filters = new windowFilters({
        parent:gr.GetColData({x:0,y:0}).col,
        title:"filtros",

        filters:[
          {name:"rango de fecha",box:{tipe:3,options:op_date_ranges}},
          {col:6,name:"fecha min",box:bx_date_start,select:{table:"sales",field:"DATE_EMMIT",tipe:"min"}},
          {col:6,name:"fecha max",box:bx_date_end,select:{table:"sales",field:"DATE_EMMIT",tipe:"max"}},
          {name:"estados",box:{tipe:4,options:op_sales_status,value:['confirmado','en proceso','pagado']},select:{table:"sales",field:"ID_STATUS"}},
          //{name:"producto",box:{tipe:8}},
        ],

        events:[
          {
            name:"reload",
            actions:[{
              action:()=>{ Reload()}
            }]
          }
        ],
      });

      //--------------------------

      function Loaded({result}){

        //console.log("products-loaded",result);
        //var op_prd = result.map((rst)=>{return {value:rst.value,show:rst.show}});
        //filters.Filter_GetBox({filterName:"producto"}).SetOptions(op_prd);
      }

      function Reload() {
        
        var conditionsFilters = filters.GetConditions();
        var requestSql = db_lip.GetSql_Select({
          tableMain:"sales",
          selects:[
            {table:'sales', field:'ID_SALE'},
            {table:'sales', field:'DATE_EMMIT'},
            {table:'sales', field:'ID_STATUS'},
            {table:'sales', field:'ID_DOCUMENT'},
            {table:'sales', field:'ID_CUSTOMER'},
            {table:'sales', field:'TOTAL'},
            //{table:'sales_products', field:'ID'},
            //{table:'sales_products', field:'ID_SALE'},
            {table:'sales_products', field:'ID_PRODUCT'},
            {table:'sales_products', field:'CANT'},
            {table:'sales_products', field:'PRICE_UNIT'},
            {table:'sales_products', field:'PRICE_TOTAL'},
            {table:"products_tags",field:"NAME",as:"TAG_NAME"},
          ],
          joins:[
            {
              main:{table:"sales",field:"ID_SALE"},
              join:{table:"sales_products",field:"ID_SALE"},
              tipe:"LEFT",
            },
            {
              main:{table:"sales_products",field:"ID_PRODUCT"},
              join:{table:"products",field:"ID_PRODUCT"},
              tipe:"LEFT",
            },
            {
              main:{table:"products",field:"ID_PRODUCT_TAG"},
              join:{table:"products_tags",field:"ID_PRODUCT_TAG"},
              tipe:"LEFT",
            }
          ],
          conditions:[
            ...conditionsFilters,
            {
              before:" AND ",
              table:"sales",
              field:"ID_COMPANY",
              inter:"=",
              value:userData.company.id,
            }
          ],
          orders:[
            {field:"DATE_EMMIT",asc:true},
          ],
        });

        console.log("resquestSql:",requestSql);

        db_lip.Request({
          sql:requestSql,
          php:"row",
          success:(result)=>{

            TransformData({result});
          }
        });

      }

      Reload();

      //-----------transform data---------

      function TransformData({result}) {
        
        console.log("------result request----------");
        console.log(result);

        //var date_start = filters.Filter_GetBox({filterName:"fecha min"}).GetValue();
        //var date_end = filters.Filter_GetBox({filterName:"fecha max"}).GetValue();
        //var range = filters.Filter_GetBox({filterName:"rango de fecha"}).GetValue();

        //console.log(date_start,date_end,range);

        var resultTrasnform = obtenerTotalesPorCategoria(result);

        console.log("--------result transform--------");
        console.log(resultTrasnform);


        //----------------print------------ 

        console.log(chartPrices);
        chartPrices.data.labels = resultTrasnform.dias;

        chartPrices.data.datasets = [];

        resultTrasnform.totales.type = "line";
        resultTrasnform.totales.borderWidth = 1;
        chartPrices.data.datasets.push(resultTrasnform.totales);

        resultTrasnform.totalesPorCategoria.forEach(totalCateg => {
          
          chartPrices.data.datasets.push(totalCateg);
        });

        chartPricesDoughtnut.data.labels = resultTrasnform.etiquetas.data;
        chartPricesDoughtnut.data.datasets = [resultTrasnform.totalEtiquetas];
        
        chartPrices.update();
        chartPricesDoughtnut.update();
        
      }

      function obtenerTotalesPorCategoria(datos) {
        var resultados = {};
        var dias = [];
        var totales = [];
        var totalesPorCategoria = {};
        var etiquetas = {};

        // Obtener todos los días disponibles en los datos y todas las etiquetas
        datos.forEach(item => {
            var fecha = new Date(item.DATE_EMMIT + 'T13:00:00Z'); // Convertir la fecha a formato ISO y parsearla
            var diaSemana = obtenerDiaSemana(fecha.getDay()); // Obtener el día de la semana
            var dia = `${diaSemana}-${fecha.getDate()}`; // Formatear la fecha: 'lun-11', 'mar-12', etc.
            if (!dias.includes(dia)) {
                dias.push(dia);
            }

            var etiqueta = item.TAG_NAME || "Sin etiqueta";
            if (!etiquetas[etiqueta]) {
                etiquetas[etiqueta] = true;
            }
        });

        // Obtener la fecha máxima
        var fechaMaxima = new Date(Math.max.apply(null, datos.map(item => new Date(item.DATE_EMMIT + 'T00:00:00Z'))));
        var diaSemanaMax = obtenerDiaSemana(fechaMaxima.getDay());
        var diaMax = `${diaSemanaMax}-${fechaMaxima.getDate()}`;
        if (!dias.includes(diaMax)) {
            dias.push(diaMax);
        }

        // Inicializar totales y totales por categoría
        dias.forEach(dia => {
            resultados[dia] = { total: 0, totalesPorCategoria: {} };
        });

        // Calcular totales por día y totales por categoría
        datos.forEach(item => {
            var fecha = new Date(item.DATE_EMMIT + 'T13:00:00Z'); // Convertir la fecha a formato ISO y parsearla
            var diaSemana = obtenerDiaSemana(fecha.getDay()); // Obtener el día de la semana
            console.log(item.DATE_EMMIT,fecha);
            var dia = `${diaSemana}-${fecha.getDate()}`; // Formatear la fecha: 'lun-11', 'mar-12', etc.
            var precioTotal = parseFloat(item.PRICE_TOTAL) || 0; // Si es null, tomarlo como 0
            var etiqueta = item.TAG_NAME || "Sin etiqueta";

            resultados[dia].total += precioTotal;

            if (!resultados[dia].totalesPorCategoria[etiqueta]) {
                resultados[dia].totalesPorCategoria[etiqueta] = 0;
            }

            resultados[dia].totalesPorCategoria[etiqueta] += precioTotal;

            if (!totalesPorCategoria[etiqueta]) {
                totalesPorCategoria[etiqueta] = 0;
            }

            totalesPorCategoria[etiqueta] += precioTotal;
        });

        // Construir el array de totales por día y totales por categoría
        dias.forEach(dia => {
            totales.push(resultados[dia].total);
        });

        var totalesPorCategoriaArray = [];
        Object.keys(totalesPorCategoria).forEach(etiqueta => {
            var totalPorCategoria = [];
            dias.forEach(dia => {
                totalPorCategoria.push(resultados[dia].totalesPorCategoria[etiqueta] || 0);
            });
            totalesPorCategoriaArray.push({ label: etiqueta, data: totalPorCategoria });
        });

        // Construir el array de etiquetas encontradas
        var etiquetasArray = Object.keys(etiquetas);
        
        // Construir el array de totales solo por etiqueta (sin tener en cuenta la fecha)
        var totalesSoloPorEtiqueta = [];
        etiquetasArray.forEach(etiqueta => {
            totalesSoloPorEtiqueta.push(totalesPorCategoria[etiqueta] || 0);
        });

        return {
            dias: dias,
            totales: { label: 'Total', data: totales },
            totalesPorCategoria: totalesPorCategoriaArray,
            etiquetas: { label: 'Etiquetas', data: etiquetasArray },
            totalEtiquetas: { label: 'Total de etiquetas', data: totalesSoloPorEtiqueta }
        };
    }

    // Función para obtener el nombre del día de la semana
    function obtenerDiaSemana(dia) {
        var diasSemana = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
        return diasSemana[dia];
    }

    // Ejemplo de uso
    var datos = [
        { PRICE_TOTAL: "800", DATE_EMMIT: "2024-05-01", TAG_NAME: "Etiqueta1" },
        { PRICE_TOTAL: null, DATE_EMMIT: "2024-05-02", TAG_NAME: "Etiqueta2" },
        { PRICE_TOTAL: "1200", DATE_EMMIT: "2024-05-03", TAG_NAME: "Etiqueta1" },
        { PRICE_TOTAL: "600", DATE_EMMIT: "2024-05-04", TAG_NAME: "Etiqueta2" }
    ];

    var conjuntoDeArrays = obtenerTotalesPorCategoria(datos);
    console.log("Días:", conjuntoDeArrays.dias);
    console.log("Totales por día:", conjuntoDeArrays.totales);
    console.log("Totales por categoría:", conjuntoDeArrays.totalesPorCategoria);
    console.log("Etiquetas:", conjuntoDeArrays.etiquetas);
    console.log("Total de etiquetas:", conjuntoDeArrays.totalEtiquetas);



    }
  });


});
