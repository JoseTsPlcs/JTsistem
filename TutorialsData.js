
var TutorialData = [
    //clientes
    {
        value:"t-sale-new",
        show:"¿como puedo añadir o editar los productos/servcios/insumo?",
        pages:[
            {
                value:"tutorial",
                elementsInfo:[           
                    {
                        id:"pos-saleNew",
                        descripcion:"aqui puedes ver todo lo de venta",
                    },
                ],
            },
            {
                value:"saleNew",
                elementsInfo:[
                    /*{
                        id:"bodyMain_conteiner_undefined_row_1_div_0_1_conteiner_undefined_row_1_div_0_1_conteiner_undefined_row_3_div_1_3_block5_btn4",
                        descripcion:"primero insertamos la venta",
                    },*/
                ],
            }
        ],
    },
    {value:"t-sale-edit",show:"¿como puedo hacer seguimiento a los pedidos?"},
    {value:"t-sale-pays",show:"¿como puedo ver los pedidos que estan pendientes a pagar?"},
    {value:"t-customer-edit",show:"¿donde puedo añadir/editar los clientes?"},
];

function TutorialPageStart() {
    

}


function TutorialGoToPage({pageName}) {
    
    var seccion = null;
    var page = null;
    PagesData.forEach(secc=>{

        secc.paginas.forEach(pag => {
            
            if(pag.name == pageName){

                seccion = secc;
                page = pag;
            }
        });
    });

    /*const sidebar = document.getElementById('sidebar');
    // Si el sidebar está cerrado (no tiene la clase 'expand'), lo expandimos
    if (sidebar && !sidebar.classList.contains('expand')) {
        sidebar.classList.add('expand');
    }*/

    const seccionId = "seccion-"+seccion.seccion;
    const sidebarLink = document.getElementById(seccionId);
    
    // Verificamos si el elemento existe y si tiene las clases necesarias
    if (sidebarLink && sidebarLink.classList.contains('collapsed') && sidebarLink.classList.contains('has-dropdown')) {
        // Si el enlace está colapsado, lo abrimos simulando un clic
        sidebarLink.click();
    } else {
        console.log(`No se encontró el enlace con el ID "${seccionId}" o no tiene las clases adecuadas.`);
    }

    var pageId = seccion.seccion + "-" +  page.name;
    var t = new Tutorial({
        elementsInfo:[
            /*{
                descripcion:"!comencemos el tutorial!",
            },*/
            {
                id:pageId,
                descripcion:"selecciona para ir a la pagina",
            },
        ],
    });
    t.startTutorial();
    
}   


function TutorialPagePlay({pageData,elementsTutorial=[]}) {
    
    var pageRecive = PageRecive();
    var tutorialPlay = (pageRecive?pageRecive.tutorialPlay:null);

    console.log("TUTORIAL PAGE PLAY",pageData,tutorialPlay);
    

    if(tutorialPlay){

        setTimeout(()=>{

            TutorialData.forEach(tutorial => {
            
                if(tutorial.value == tutorialPlay){
    
                    tutorial.pages.forEach(page => {
                    
                        if(page.value == pageData.name){
                            
                            var elementsInfo = [...page.elementsInfo];
                            
                            elementsTutorial.forEach(eTut => {
                                
                                if(eTut.crud)eTut.crud.questionTutorialElementsInfoGet().forEach(e => {elementsInfo.push(e);});
                            });
        
                            var tut = new Tutorial({elementsInfo});
                            tut.startTutorial();
                        }
                    });
                }
            });
        },5000);
        
    }

}