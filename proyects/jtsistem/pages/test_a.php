<!DOCTYPE html>
<html>
<head>
    <title>Generar Factura PDF</title>
</head>
<body>
    <button id="generate">Generar PDF</button>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        async function generateInvoicePDF(invoiceData) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'pt', 'a3');  // Mantener tamaño A3

            const margin = 40;
            const startY = 50;
            const lineHeight = 20;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const usableWidth = pageWidth - 2 * margin;

            const fontSizeNormal = 12 * 0.85;  // Incremento del 15%
            const fontSizeHeader = 20 * 0.85;  // Incremento del 15%

            // Header
            pdf.setFontSize(fontSizeHeader);
            pdf.setTextColor(40, 40, 40);
            pdf.text('Factura', margin, startY);

            // Company Details
            pdf.setFontSize(fontSizeNormal);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Número de Factura: ${invoiceData.invoiceNumber}`, margin, startY + 2 * lineHeight);
            pdf.text(`Fecha: ${invoiceData.invoiceDate}`, margin, startY + 3 * lineHeight);
            pdf.text(`Cliente: ${invoiceData.customerName}`, margin, startY + 4 * lineHeight);
            pdf.text(`Tipo de Documento: ${invoiceData.customerDocumentType}`, margin, startY + 5 * lineHeight);
            pdf.text(`Número de Documento: ${invoiceData.customerDocumentNumber}`, margin, startY + 6 * lineHeight);
            pdf.text(`Número de Teléfono: ${invoiceData.customerPhone}`, margin, startY + 7 * lineHeight);
            pdf.text(`Dirección: ${invoiceData.customerAddress}`, margin, startY + 8 * lineHeight);
            
            // Company Box
            const companyBoxWidth = 200;
            const companyBoxHeight = 6 * lineHeight;
            const companyBoxX = pageWidth - margin - companyBoxWidth;
            const companyBoxY = startY + 2 * lineHeight;
            pdf.setFillColor(230, 230, 230);
            pdf.rect(companyBoxX, companyBoxY, companyBoxWidth, companyBoxHeight, 'F');
            pdf.setTextColor(40, 40, 40);
            pdf.text(`Razón Social: ${invoiceData.companyName}`, companyBoxX + 10, startY + 2.5 * lineHeight);
            pdf.text(`RUC: ${invoiceData.companyRUC}`, companyBoxX + 10, startY + 3.5 * lineHeight);
            pdf.text(`Dirección: ${invoiceData.companyAddress}`, companyBoxX + 10, startY + 4.5 * lineHeight);
            pdf.text(`Teléfono: ${invoiceData.companyPhone}`, companyBoxX + 10, startY + 5.5 * lineHeight);

            // Table Headers
            const precioUnitarioWidth = 480 + 50;
            const precioTotalWidth = 570 + 100;

            pdf.setFillColor(230, 230, 230);
            pdf.rect(margin, startY + 10 * lineHeight, usableWidth, lineHeight, 'F');
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(fontSizeNormal);
            pdf.text('Detalle', margin + 5, startY + 10.7 * lineHeight);
            pdf.text('Tipo', margin + 250, startY + 10.7 * lineHeight);
            pdf.text('Cantidad', margin + 330, startY + 10.7 * lineHeight);
            pdf.text('Unidad', margin + 410, startY + 10.7 * lineHeight);
            pdf.text('Precio Unitario', margin + precioUnitarioWidth, startY + 10.7 * lineHeight);
            pdf.text('Precio Total', margin + precioTotalWidth, startY + 10.7 * lineHeight);

            // Table Content
            let positionY = startY + 11.5 * lineHeight;
            let totalServices = 0;
            let totalProducts = 0;
            invoiceData.items.forEach(item => {
                pdf.setTextColor(100, 100, 100);
                pdf.text(item.detail, margin + 5, positionY);
                pdf.text(item.type, margin + 250, positionY);
                pdf.text(String(item.quantity), margin + 330, positionY);
                pdf.text('und', margin + 410, positionY);
                pdf.text(`S/. ${item.unitPrice.toFixed(2)}`, margin + precioUnitarioWidth, positionY);
                pdf.text(`S/. ${item.totalPrice.toFixed(2)}`, margin + precioTotalWidth, positionY);
                positionY += lineHeight;

                if (item.type === 'servicio') {
                    totalServices += item.totalPrice;
                } else {
                    totalProducts += item.totalPrice;
                }
            });

            // Total
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(fontSizeNormal);
            pdf.text(`Total Productos: S/. ${totalProducts.toFixed(2)}`, margin + precioUnitarioWidth, positionY + lineHeight);
            pdf.text(`Total Servicios: S/. ${totalServices.toFixed(2)}`, margin + precioUnitarioWidth, positionY + 2 * lineHeight);
            pdf.text(`Total: S/. ${(totalProducts + totalServices).toFixed(2)}`, margin + precioUnitarioWidth, positionY + 3 * lineHeight);

            // Open PDF in New Tab
            const pdfDataUri = pdf.output('datauristring');
            const newTab = window.open();
            newTab.document.body.innerHTML = '<embed width="100%" height="100%" src="' + pdfDataUri + '" type="application/pdf">';
        }

        document.getElementById('generate').addEventListener('click', () => {
            const invoiceData = {
                invoiceNumber: '001-001-0000001',
                invoiceDate: '01/06/2024',
                companyName: 'Razón Social S.A.',
                companyRUC: '12345678901',
                companyAddress: 'Calle Falsa 123',
                companyPhone: '555-1234',
                customerName: 'Juan Pérez',
                customerDocumentType: 'DNI',
                customerDocumentNumber: '12345678',
                customerPhone: '555-5678',
                customerAddress: 'Av. Principal 456',
                items: [
                    { detail: 'Servicio de Consultoría', type: 'servicio', quantity: 1, unitPrice: 150, totalPrice: 150 },
                    { detail: 'Producto 1', type: 'producto', quantity: 2, unitPrice: 50, totalPrice: 100 },
                    { detail: 'Producto 2', type: 'producto', quantity: 1, unitPrice: 200, totalPrice: 200 }
                ]
            };

            generateInvoicePDF(invoiceData);
        });
    </script>
</body>
</html>
