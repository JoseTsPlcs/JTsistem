<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear PDF con JavaScript</title>
</head>
<body>
    <button onclick="generatePDF()">Generar PDF</button>

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script> -->
        <!-- <script src="../../../libs/jspdf.umd.min.js"></script> -->
    <script>
        function generatePDF() {
            var doc = new jsPDF();
            doc.text(10, 10, 'Hello world!');
            doc.save('hello-world.pdf');
        }
    </script>
</body>
</html>
