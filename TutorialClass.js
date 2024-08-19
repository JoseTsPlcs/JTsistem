class Tutorial {

    constructor({ elementsInfo }) {
        this.elementsInfo = elementsInfo;
        this.currentIndex = 0;
        this.elements = [];
        this.started = false;
        this.init();
    }

    // Inicializa los elementos y asigna eventos
    init() {
        this.elements = this.elementsInfo.map(info => document.getElementById(info.id)).filter(element => element);
        if (this.elements.length > 0) {
            var btnNext =  document.getElementById('nextBtn');
            var btnPrev = document.getElementById('prevBtn');
            if(btnNext) btnNext.addEventListener('click', () => this.focusNextElement());
            if(btnPrev) btnPrev.addEventListener('click', () => this.focusPrevElement());
        }
    }

    // Inicia el tutorial
    startTutorial() {
        this.currentIndex = 0;
        this.started = true;
        document.body.classList.add('no-scroll'); // Bloquear el scroll

        if (this.elements.length > 0) {
            this.highlightElement(this.elements[this.currentIndex]);
        }
    }


    highlightElement(element) {
        const isInResponsiveTable = this.isElementInResponsiveTable(element);

        if (isInResponsiveTable && (this.isElementHiddenInResponsiveTable(element) || this.isElementPartiallyVisibleInResponsiveTable(element))) {
            const tableResponsive = element.closest('.table-responsive');
            const initialScrollPosition = tableResponsive.scrollLeft;

            // Intenta desplazar el elemento a la parte visible de la tabla responsive
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Espera un momento para que el desplazamiento ocurra y verifica si se desplazó correctamente
            setTimeout(() => {
                // Verifica si el elemento ahora está visible
                if (this.isElementHiddenInResponsiveTable(element)) {
                    
                    // Si no está visible, intenta desplazarse manualmente
                    const elementRect = element.getBoundingClientRect();
                    const tableRect = tableResponsive.getBoundingClientRect();

                    if (elementRect.left < tableRect.left) {
                        tableResponsive.scrollLeft = initialScrollPosition - (tableRect.left - elementRect.left);
                    } else if (elementRect.right > tableRect.right) {
                        tableResponsive.scrollLeft = initialScrollPosition + (elementRect.right - tableRect.right);
                    }

                    // Espera nuevamente para aplicar el resaltado
                    setTimeout(() => {
                        this.applyHighlight(element);
                    }, 500);
                } else {
                    this.applyHighlight(element);
                }
            }, 500);
        } else {
            this.applyHighlight(element);
        }
    }

    // Verifica si un elemento está parcialmente visible en una tabla responsive
    isElementPartiallyVisibleInResponsiveTable(element) {
        const tableResponsive = element.closest('.table-responsive');
        if (!tableResponsive) return false; // Si no está en una tabla responsive, retorna false
    
        const elementRect = element.getBoundingClientRect();
        const tableResponsiveRect = tableResponsive.getBoundingClientRect();
    
        const isPartiallyVisible = (
            elementRect.left < tableResponsiveRect.right &&
            elementRect.right > tableResponsiveRect.left &&
            (elementRect.left < tableResponsiveRect.left || elementRect.right > tableResponsiveRect.right)
        );
    
        return isPartiallyVisible;
    }
    
    // Aplica el resaltado al elemento
    applyHighlight(element) {
        element = document.getElementById(element.id);
        var rect = element.getBoundingClientRect();
        // Remover cualquier superposición y resaltado existente
        document.querySelectorAll('.overlay, .highlight').forEach(el => el.remove());
        document.querySelectorAll('.highlighted-element').forEach(el => el.classList.remove('highlighted-element'));

        // Crear la superposición
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);

        // Crear un contenedor que resalte el elemento
        const highlight = document.createElement('div');
        highlight.classList.add('highlight');
        highlight.style.top = `${rect.top + window.scrollY}px`;
        highlight.style.left = `${rect.left + window.scrollX}px`;
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;

        document.body.appendChild(highlight);

        // Enfocar el elemento, incluso si es un div
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Determinar si se necesita esperar para mostrar el popup
        const isInResponsiveTable = this.isElementInResponsiveTable(element);
        const delay = isInResponsiveTable ? 500 : 300;

        this.hidePopup();

        // Espera antes de mostrar el popup si es necesario
        setTimeout(() => {
            // Mostrar la ventana emergente con la descripción
            this.showPopup(this.elementsInfo[this.currentIndex].descripcion, element);
        }, delay);
    }

    // Verifica si un elemento está en una tabla responsive
    isElementInResponsiveTable(element) {
        return element.closest('.table-responsive') !== null;
    }

    // Verifica si un elemento está oculto en una tabla responsive
    isElementHiddenInResponsiveTable(element) {
        const elementRect = element.getBoundingClientRect();
        const tableResponsiveRect = element.closest('.table-responsive').getBoundingClientRect();
        return elementRect.left > tableResponsiveRect.right || elementRect.right < tableResponsiveRect.left;
    }

    // Avanzar al siguiente elemento
    focusNextElement() {
        if (!this.started) return;

        if (this.currentIndex < this.elements.length - 1) {
            this.currentIndex++;
            this.highlightElement(this.elements[this.currentIndex]);
        } else {
            document.querySelectorAll('.overlay, .highlight').forEach(el => el.remove());
            document.querySelectorAll('.highlighted-element').forEach(el => el.classList.remove('highlighted-element'));
            this.hidePopup();
            this.started = false;
            document.body.classList.remove('no-scroll'); // Desbloquear el scroll
        }
    }

    // Retroceder al elemento anterior
    focusPrevElement() {
        if (!this.started) return;

        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.highlightElement(this.elements[this.currentIndex]);
        }
    }

    // Mostrar la ventana emergente y posicionarla
    showPopup(description, element) {
        const popup = document.getElementById('popup');
        const popupDescription = document.getElementById('popup-description');
        popupDescription.textContent = description;
        popup.style.display = 'block';
    
        const popupRect = popup.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
    
        // Posicionar el popup debajo del elemento
        let top = elementRect.bottom + 10; // 10px de margen debajo del elemento
        let left = elementRect.left;
    
        // Asegurarse de que el popup no se salga de la pantalla horizontalmente
        if (left + popupRect.width > windowWidth) {
            left = windowWidth - popupRect.width - 10; // Ajustar si se sale por la derecha
        }
    
        if (left < 10) {
            left = 10; // Ajustar si se sale por la izquierda
        }
    
        // Asegurarse de que el popup no se salga de la pantalla verticalmente
        if (top + popupRect.height > windowHeight) {
            top = elementRect.top - popupRect.height - 10; // Moverlo arriba si se sale por abajo
        }
    
        // Aplicar las posiciones calculadas
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }
    
    hidePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
        
    }
}
