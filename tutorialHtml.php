<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resaltado en Modal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Overlay que está por encima del modal */
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1055; /* Mayor que el modal */
        }

        /* Elemento resaltado */
        .highlighted-element {
            z-index: 1060 !important; /* Mayor que el overlay */
            position: fixed !important; /* Lo mueves a fixed para posicionarlo en el body */
            background-color: #ffffff !important; /* Asegura un fondo blanco */
            color: #000000 !important; /* Asegura un color de texto negro */
            border: 2px solid #ffc107 !important; /* Borde amarillo */
            padding: 10px !important; /* Padding para mejor visualización */
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* Sombra */
            border-radius: 5px; /* Bordes redondeados */
        }
    </style>
</head>
<body>

    <!-- Modal de Bootstrap -->
    <div class="modal fade show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" style="display: block; z-index: 1050;" aria-modal="true" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal de Ejemplo</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Contenido del modal.</p>
                    <!-- Elemento dentro del modal que será resaltado -->
                    <div id="highlightedContent" class="highlighted-element">
                        Este es el contenido resaltado dentro del modal.
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary">Guardar cambios</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Overlay que cubre el modal -->
    <div class="overlay"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const highlightedElement = document.getElementById('highlightedContent');
            const rect = highlightedElement.getBoundingClientRect();

            // Mover el elemento al body
            document.body.appendChild(highlightedElement);

            // Posicionar el elemento donde estaba originalmente
            highlightedElement.style.top = rect.top + 'px';
            highlightedElement.style.left = rect.left + 'px';
        });
    </script>
</body>
</html>
