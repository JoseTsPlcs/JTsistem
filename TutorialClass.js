class Tutorial {
    
    constructor({ elementsInfo }) {
        this.elementsInfo = elementsInfo;
        this.currentIndex = 0;
        this.elements = [];
        this.started = false;
        this.init();
    }

    init() {
        this.elements = this.elementsInfo.map(info => info.id ? document.getElementById(info.id) : null);
        var btnNext = document.getElementById('nextBtn');
        var btnPrev = document.getElementById('prevBtn');
        if (btnNext) btnNext.addEventListener('click', () => this.focusNextElement());
        if (btnPrev) btnPrev.addEventListener('click', () => this.focusPrevElement());
    }

    startTutorial() {
        this.currentIndex = 0;
        this.started = true;
        this.showCurrentStep();
    }

    showCurrentStep() {
        const currentInfo = this.elementsInfo[this.currentIndex];
        if (currentInfo.id) {
            this.highlightElement(document.getElementById(currentInfo.id));
        } else {
            this.showPopup(currentInfo.descripcion, true);
        }
    }

    highlightElement(element) {

        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        var pageInfo = null;
        var seccInfo = null;
        if(element.href){

            var pageArr = element.href.split("/");
            var pageHref = pageArr[pageArr.length-1];            
            PagesData.forEach(secc => {
                
                secc.paginas.forEach(pg => {
                   
                    if(pg.href == pageHref){
    
                        pageInfo = pg;
                        seccInfo = secc;
                    }
                });
            });
        }        

        // Si el elemento tiene la clase 'sidebar-link', ejecuta la lógica adicional
        if (element.classList.contains('sidebar-link')) {
            this.expandSidebar();
        }

        if(seccInfo){

            const seccionId = "seccion-"+seccInfo.seccion;
            const sidebarLink = document.getElementById(seccionId);
            
            // Verificamos si el elemento existe y si tiene las clases necesarias
            if (sidebarLink && sidebarLink.classList.contains('collapsed') && sidebarLink.classList.contains('has-dropdown')) {
                // Si el enlace está colapsado, lo abrimos simulando un clic
                sidebarLink.click();
            } else {
                console.log(`No se encontró el enlace con el ID "${seccionId}" o no tiene las clases adecuadas.`);
            }
        }        

        this.applyHighlight(element);
    }

    applyHighlight(element) {
        document.querySelectorAll('.highlight').forEach(el => el.remove());
        const highlight = document.createElement('div');
        highlight.classList.add('highlight');

        const updatePositions = () => {
            var rect = element.getBoundingClientRect();
            highlight.style.top = `${rect.top + window.scrollY}px`;
            highlight.style.left = `${rect.left + window.scrollX}px`;
            highlight.style.width = `${rect.width}px`;
            highlight.style.height = `${rect.height}px`;
            this.updatePopupPosition(rect);
        };

        updatePositions();
        document.body.appendChild(highlight);
        element.focus();

        const updateLoop = () => {
            updatePositions();
            requestAnimationFrame(updateLoop);
        };
        requestAnimationFrame(updateLoop);

        this.showPopup(this.elementsInfo[this.currentIndex].descripcion);
    }

    updatePopupPosition(elementRect = null) {
        const popup = document.getElementById('popup');
        const popupRect = popup.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let top, left;

        if (elementRect) {
            top = elementRect.bottom + 10;
            left = elementRect.left;

            if (left + popupRect.width > windowWidth) {
                left = windowWidth - popupRect.width - 10;
            }

            if (left < 10) {
                left = 10;
            }

            if (top + popupRect.height > windowHeight) {
                top = elementRect.top - popupRect.height - 10;
            }
        } else {
            top = (windowHeight - popupRect.height) / 2;
            left = (windowWidth - popupRect.width) / 2;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }

    showPopup(description, center = false) {
        const popup = document.getElementById('popup');
        const popupDescription = document.getElementById('popup-description');
        popupDescription.textContent = description;
        popup.style.display = 'block';

        if (center) {
            this.updatePopupPosition();
        } else {
            const elementRect = this.elements[this.currentIndex].getBoundingClientRect();
            this.updatePopupPosition(elementRect);
        }
    }

    hidePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
    }

    focusNextElement() {
        if (!this.started) return;

        if (this.currentIndex < this.elementsInfo.length - 1) {
            this.currentIndex++;
            this.showCurrentStep();
        } else {
            this.endTutorial();
        }
    }

    focusPrevElement() {
        if (!this.started) return;

        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showCurrentStep();
        }
    }

    expandSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('expand')) {
            sidebar.classList.add('expand');
        }
    }

    endTutorial() {
        this.started = false;
        document.querySelectorAll('.highlight').forEach(el => el.remove());
        this.hidePopup();
    }
}
