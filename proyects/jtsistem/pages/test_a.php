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
            const pdf = new jsPDF('p', 'pt', 'a4');

            const margin = 40;
            const startY = 50;
            const lineHeight = 20;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const usableWidth = pageWidth - 2 * margin;

            // Header
            pdf.setFontSize(20);
            pdf.setTextColor(40, 40, 40);
            pdf.text('Factura', margin, startY);

            // Company Details
            pdf.setFontSize(12);
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
            pdf.text(`Razón Social: ${invoiceData.companyName}`, pageWidth - margin - 10, startY + 2.5 * lineHeight, null, null, 'right');
            pdf.text(`RUC: ${invoiceData.companyRUC}`, pageWidth - margin - 10, startY + 3.5 * lineHeight, null, null, 'right');
            pdf.text(`Dirección: ${invoiceData.companyAddress}`, pageWidth - margin - 10, startY + 4.5 * lineHeight, null, null, 'right');
            pdf.text(`Teléfono: ${invoiceData.companyPhone}`, pageWidth - margin - 10, startY + 5.5 * lineHeight, null, null, 'right');

            // Table Headers
            pdf.setFillColor(230, 230, 230);
            pdf.rect(margin, startY + 10 * lineHeight, usableWidth, lineHeight, 'F');
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(12);
            pdf.text('Detalle', margin + 5, startY + 10.7 * lineHeight);
            pdf.text('Tipo', margin + 150, startY + 10.7 * lineHeight);
            pdf.text('Cantidad', margin + 250, startY + 10.7 * lineHeight);
            pdf.text('Precio Unitario', margin + 350, startY + 10.7 * lineHeight);
            pdf.text('Precio Total', margin + 450, startY + 10.7 * lineHeight);

            // Table Content
            let positionY = startY + 11.5 * lineHeight;
            let totalServices = 0;
            let totalProducts = 0;
            invoiceData.items.forEach(item => {
                pdf.setTextColor(100, 100, 100);
                pdf.text(item.detail, margin + 5, positionY);
                pdf.text(item.type, margin + 150, positionY);
                pdf.text(String(item.quantity), margin + 250, positionY);
                pdf.text(`S/. ${item.unitPrice.toFixed(2)}`, margin + 350, positionY);
                pdf.text(`S/. ${item.totalPrice.toFixed(2)}`, margin + 450, positionY);
                positionY += lineHeight;

                if (item.type === 'Servicio') {
                    totalServices += item.totalPrice;
                } else {
                    totalProducts += item.totalPrice;
                }
            });

            // Total
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(14);
            pdf.text(`Total Productos: S/. ${totalProducts.toFixed(2)}`, margin + 350, positionY + lineHeight);
            pdf.text(`Total Servicios: S/. ${totalServices.toFixed(2)}`, margin + 350, positionY + 2 * lineHeight);
            pdf.text(`Total: S/. ${(totalProducts + totalServices).toFixed(2)}`, margin + 350, positionY + 3 * lineHeight);

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
                    { detail: 'Servicio de Consultoría', type: 'Servicio', quantity: 1, unitPrice: 150, totalPrice: 150 },
                    { detail: 'Producto 1', type: 'Producto', quantity: 2, unitPrice: 50, totalPrice: 100 },
                    { detail: 'Producto 2', type: 'Producto', quantity: 1, unitPrice: 200, totalPrice: 200 }
                ]
            };

            generateInvoicePDF(invoiceData);
        });
    </script>
</body>
</html>