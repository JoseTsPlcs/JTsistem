<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Convertir HTML a PDF</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.0/jspdf.umd.min.js"></script>


<link rel="stylesheet" href="../../../libs/icons-1.11.3/font/bootstrap-icons.css">

</head>
<body>

<i class="bi bi-house"></i>
<i class="bi bi-unlock"></i><i class="bi bi-unity"></i>
    
<!-- Contenido que deseas convertir a PDF -->
<div id="contenido">
    <h1>Ejemplo de Contenido</h1>
    <p>Este es un ejemplo de contenido que deseas convertir a PDF.</p>
</div>

<button id="generarPDF">Generar PDF</button>

<script>
document.getElementById("generarPDF").addEventListener("click", function() {
    // Verificar si jsPDF está definido
    if (typeof jsPDF !== 'undefined') {
        // Crear un nuevo documento PDF
        var doc = new jsPDF();

        // Obtener el contenido HTML que se convertirá a PDF
        var contenido = document.getElementById('contenido');

        // Convertir el contenido HTML a PDF
        doc.html(contenido, {
            callback: function () {
                // Guardar el PDF
                doc.save('documento.pdf');
            }
        });
    } else {
        // Si jsPDF no está definido, mostrar un mensaje de error
        alert('Error: jsPDF no se ha cargado correctamente.');
    }
});
</script>



</body>
</html>
