class Tutorial {
    
    constructor({ elementsInfo }) {
        this.elementsInfo = elementsInfo;
        this.currentIndex = 0;
        this.elements = [];
        this.started = false;
        this.init();
    }

    init() {
        this.elements = this.elementsInfo.map(info => document.getElementById(info.id)).filter(element => element);
        if (this.elements.length > 0) {
            var btnNext = document.getElementById('nextBtn');
            var btnPrev = document.getElementById('prevBtn');
            if (btnNext) btnNext.addEventListener('click', () => this.focusNextElement());
            if (btnPrev) btnPrev.addEventListener('click', () => this.focusPrevElement());
        }
    }

    startTutorial() {
        this.currentIndex = 0;
        this.started = true;

        if (this.elements.length > 0) {
            this.highlightElement(this.elements[this.currentIndex]);
        }
    }

    highlightElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Aplica el highlight inicial
        this.applyHighlight(element);
    }

    applyHighlight(element) {
        // Eliminar cualquier highlight existente
        document.querySelectorAll('.highlight').forEach(el => el.remove());

        // Crear el highlight
        const highlight = document.createElement('div');
        highlight.classList.add('highlight');

        // Función para actualizar la posición del highlight y popup
        const updatePositions = () => {
            var rect = element.getBoundingClientRect();

            // Actualizar posición y tamaño del highlight
            highlight.style.top = `${rect.top + window.scrollY}px`;
            highlight.style.left = `${rect.left + window.scrollX}px`;
            highlight.style.width = `${rect.width}px`;
            highlight.style.height = `${rect.height}px`;

            // Actualizar la posición del popup
            this.updatePopupPosition(rect);
        };

        // Aplica el highlight y agrega al documento
        updatePositions();
        document.body.appendChild(highlight);

        // Permitir la interacción con el elemento
        element.focus();

        // Bucle de actualización continua para seguir el elemento en movimiento
        const updateLoop = () => {
            updatePositions();
            requestAnimationFrame(updateLoop);
        };
        requestAnimationFrame(updateLoop);

        // Mostrar el popup cerca del elemento resaltado
        this.showPopup(this.elementsInfo[this.currentIndex].descripcion);
    }

    updatePopupPosition(elementRect) {
        const popup = document.getElementById('popup');
        const popupRect = popup.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Posicionar el popup debajo del elemento con margen
        let top = elementRect.bottom + 10;
        let left = elementRect.left;

        // Asegurarse de que el popup no se salga de la pantalla horizontalmente
        if (left + popupRect.width > windowWidth) {
            left = windowWidth - popupRect.width - 10;
        }

        if (left < 10) {
            left = 10;
        }

        // Asegurarse de que el popup no se salga de la pantalla verticalmente
        if (top + popupRect.height > windowHeight) {
            top = elementRect.top - popupRect.height - 10;
        }

        // Aplicar las posiciones calculadas al popup
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }

    showPopup(description) {
        const popup = document.getElementById('popup');
        const popupDescription = document.getElementById('popup-description');
        popupDescription.textContent = description;
        popup.style.display = 'block';

        // Inicializa la posición del popup
        const elementRect = this.elements[this.currentIndex].getBoundingClientRect();
        this.updatePopupPosition(elementRect);
    }

    hidePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
    }

    focusNextElement() {
        if (!this.started) return;

        if (this.currentIndex < this.elements.length - 1) {
            this.currentIndex++;
            this.highlightElement(this.elements[this.currentIndex]);
        } else {
            this.endTutorial();
        }
    }

    focusPrevElement() {
        if (!this.started) return;

        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.highlightElement(this.elements[this.currentIndex]);
        }
    }

    endTutorial() {
        this.started = false;

        // Eliminar los highlights y el popup
        document.querySelectorAll('.highlight').forEach(el => el.remove());
        this.hidePopup();
    }
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

    const sidebar = document.getElementById('sidebar');
    // Si el sidebar está cerrado (no tiene la clase 'expand'), lo expandimos
    if (sidebar && !sidebar.classList.contains('expand')) {
        sidebar.classList.add('expand');
    }

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
            {
                id:pageId,
                descripcion:"selecciona para ir a la pagina",
            }
        ],
    });
    t.startTutorial();
    
}   

