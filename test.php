<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejemplo con Selectpicker</title>
    <!-- Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Select CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.18/css/bootstrap-select.min.css" rel="stylesheet">
    <style>
        /* Establecer un ancho máximo para el select */
        .bootstrap-select {
            max-width: 300px;
            width: 100%;  /* El select ocupa el 100% del contenedor */
        }

        /* Hacer que el menú desplegable tenga el mismo ancho que el select */
        .bootstrap-select .dropdown-menu {
            width: 100%;
            max-width: 300px;  /* Limitar ancho del menú */
            overflow-x: auto;  /* Scroll horizontal si es necesario */
        }

        /* Asegurar que el contenido de las opciones no se corte */
        .bootstrap-select .dropdown-menu.inner {
            white-space: nowrap;
            max-width: none;
        }

        /* Evitar que el texto se corte en opciones activas o seleccionadas */
        .bootstrap-select .dropdown-item.active,
        .bootstrap-select .dropdown-item.active.selected {
            white-space: normal;  /* Mostrar texto completo en múltiples líneas si es necesario */
            overflow: visible;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <h2>Ejemplo de Select con Barra de Búsqueda y Ancho Máximo</h2>
        <form>
            <div class="form-group">
                <label for="selectExample">Selecciona una opción:</label>
                <select class="selectpicker" data-live-search="true">
                    <option data-tokens="option1">Option 1: A very long description for testing the responsive behavior of the dropdown select component</option>
                    <option data-tokens="option2">Option 2: This is another example of a lengthy option text to check if the dropdown works correctly</option>
                    <option data-tokens="option3">Option 3: A longer text for the third option, which is meant to see how well the select component handles various text lengths</option>
                    <option data-tokens="option4">Option 4: Example with even longer text to test the scrolling behavior when the content exceeds the maximum width of the dropdown menu</option>
                    <option data-tokens="option5">Option 5: Testing the select with long option text to ensure that the selected item is displayed properly and that no text is hidden</option>
                    <option data-tokens="option6">Option 6: Yet another example to see if the select and dropdown menu can handle long text without clipping or hiding content</option>
                    <option data-tokens="option7">Option 7: Option text that stretches beyond the typical length to evaluate the select's ability to remain user-friendly</option>
                    <option data-tokens="option8">Option 8: Lengthy option text example for the eighth option, which tests the overall appearance and usability of the dropdown</option>
                    <option data-tokens="option9">Option 9: Trying a very descriptive option here to test the visual aspect and the behavior of the select component with Bootstrap</option>
                    <option data-tokens="option10">Option 10: The last example with an extended description to assess how the selectpicker displays long option texts responsively</option>
                </select>
            </div>
        </form>
    </div>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <!-- Bootstrap JS -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
    <!-- Bootstrap Select JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.18/js/bootstrap-select.min.js"></script>

    <script>
        $(document).ready(function() {
            // Inicializar Selectpicker
            $('.selectpicker').selectpicker();
        });
    </script>
</body>
</html>
