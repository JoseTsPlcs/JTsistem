<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear PDF con pdf-lib</title>
    <script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.16.0/dist/pdf-lib.js"></script>
</head>
<body>
    <button onclick="generatePDF()">Generar PDF</button>

    <script>
        async function generatePDF() {
            // Crear un nuevo documento PDF
            const pdfDoc = await PDFLib.PDFDocument.create();

            // Agregar una nueva página al documento
            const page = pdfDoc.addPage([300, 400]); // Tamaño de la página: ancho x alto

            // Agregar texto a la página
            page.drawText('¡Hola, mundo!', {
                x: 50,
                y: 350,
                size: 30,
            });

            // Obtener el contenido del documento como ArrayBuffer
            const pdfBytes = await pdfDoc.save();

            // Convertir ArrayBuffer a Blob
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

            // Crear una URL a partir del Blob
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Abrir el PDF en una nueva ventana
            window.open(pdfUrl, '_blank');
        }
    </script>
</body>
</html>
