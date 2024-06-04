<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vehicle Check-In PDF</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>
<body>
    <script>
        async function generateCheckInPDF(checkInData) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'pt', 'a4');

            const margin = 40;
            const startY = 50;
            const lineHeight = 20;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const usableWidth = pageWidth - 2 * margin;

            const fontSizeNormal = 12 * 0.85;
            const fontSizeHeader = 20 * 0.85;

            // Header
            pdf.setFontSize(fontSizeHeader);
            pdf.setTextColor(40, 40, 40);
            pdf.text('Vehicle Check-In', margin, startY);

            // Customer Details
            pdf.setFontSize(fontSizeNormal);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Check-In Number: ${checkInData.checkInNumber}`, margin, startY + 2 * lineHeight);
            pdf.text(`Date: ${checkInData.checkInDate}`, margin, startY + 3 * lineHeight);
            pdf.text(`Customer: ${checkInData.customerName}`, margin, startY + 4 * lineHeight);
            pdf.text(`Customer ID: ${checkInData.customerId}`, margin, startY + 5 * lineHeight);
            pdf.text(`Phone: ${checkInData.customerPhone}`, margin, startY + 6 * lineHeight);
            pdf.text(`Address: ${checkInData.customerAddress}`, margin, startY + 7 * lineHeight);

            // Vehicle Details
            pdf.text('Vehicle Details:', margin, startY + 9 * lineHeight);
            pdf.text(`Plate: ${checkInData.vehicle.plate}`, margin, startY + 10 * lineHeight);
            pdf.text(`Brand: ${checkInData.vehicle.brand}`, margin, startY + 11 * lineHeight);
            pdf.text(`Model: ${checkInData.vehicle.model}`, margin, startY + 12 * lineHeight);
            pdf.text(`Engine Number: ${checkInData.vehicle.engineNumber}`, margin, startY + 13 * lineHeight);
            pdf.text(`VIN Number: ${checkInData.vehicle.vinNumber}`, margin, startY + 14 * lineHeight);
            pdf.text(`Year: ${checkInData.vehicle.year}`, margin, startY + 15 * lineHeight);
            pdf.text(`Color: ${checkInData.vehicle.color}`, margin, startY + 16 * lineHeight);

            // Comments
            pdf.text('Comments:', margin, startY + 18 * lineHeight);
            pdf.text(`${checkInData.comments}`, margin, startY + 19 * lineHeight, { maxWidth: usableWidth / 2 });

            // Company Box
            const companyBoxWidth = 200;
            const companyBoxHeight = 6 * lineHeight;
            const companyBoxX = pageWidth - margin - companyBoxWidth;
            const companyBoxY = startY + 2 * lineHeight;
            pdf.setFillColor(230, 230, 230);
            pdf.rect(companyBoxX, companyBoxY, companyBoxWidth, companyBoxHeight, 'F');
            pdf.setTextColor(40, 40, 40);
            pdf.text(`Company Name: ${checkInData.companyName}`, companyBoxX + 10, startY + 2.5 * lineHeight);
            pdf.text(`Company RUC: ${checkInData.companyRUC}`, companyBoxX + 10, startY + 3.5 * lineHeight);
            pdf.text(`Address: ${checkInData.companyAddress}`, companyBoxX + 10, startY + 4.5 * lineHeight);
            pdf.text(`Phone: ${checkInData.companyPhone}`, companyBoxX + 10, startY + 5.5 * lineHeight);

            // Load Image
            const image = new Image();
            image.src = checkInData.imageUrl;

            image.onload = function() {
                // Calculate image width and height proportionally
                const originalWidth = image.width;
                const originalHeight = image.height;
                const targetWidth = usableWidth * 0.6;
                const scaleFactor = targetWidth / originalWidth;
                const targetHeight = originalHeight * scaleFactor;

                // Add image to PDF
                pdf.addImage(image, 'PNG', margin, startY + 20 * lineHeight, targetWidth, targetHeight);

                // Table Headers
                const yless = 200;
                const checkWidth = 40;
                const detailWidth = usableWidth * 0.4 - checkWidth - 20;

                pdf.setFillColor(230, 230, 230);
                pdf.rect(margin + targetWidth + 10, startY + 20 * lineHeight - yless, usableWidth * 0.6, lineHeight, 'F');
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(fontSizeNormal);
                pdf.text('Detail', margin + targetWidth + 15, startY + 20.7 * lineHeight - yless);
                pdf.text('Check', margin + targetWidth + 15 + detailWidth, startY + 20.7 * lineHeight - yless);

                // Table Content
                let positionY = startY + 21.5 * lineHeight - yless;
                checkInData.items.forEach(item => {
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(item.detail, margin + targetWidth + 15, positionY);
                    pdf.text(item.check ? 'Yes' : 'No', margin + targetWidth + 15 + detailWidth, positionY);
                    positionY += lineHeight;
                });

                // Open PDF in a new window
                window.open(pdf.output('bloburl'), '_blank');
            }
        }

        const checkInData = {
            checkInNumber: '12345',
            checkInDate: '2024-06-01',
            customerName: 'John Doe',
            customerId: 'DNI 12345678',
            customerPhone: '987654321',
            customerAddress: '123 Main St, City, Country',
            companyName: 'My Workshop',
            companyRUC: '20123456789',
            companyAddress: '456 Workshop St, City, Country',
            companyPhone: '123456789',
            vehicle: {
                plate: 'XYZ-123',
                brand: 'Toyota',
                model: 'Corolla',
                engineNumber: 'ABC123456',
                vinNumber: '1HGBH41JXMN109186',
                year: '2020',
                color: 'Blue'
            },
            comments: 'The vehicle is in good condition. Minor scratches on the front bumper.',
            items: [
                { detail: 'Oil level', check: true, comment: 'Good condition' },
                { detail: 'Brake fluid', check: false, comment: 'Needs replacement' },
                { detail: 'Tire pressure', check: true, comment: 'Checked' },
                // More items...
            ],
            imageUrl: '../imagenes/vehiculo_4ruedas.png' // Ruta de la imagen
        };

        generateCheckInPDF(checkInData);
    </script>
</body>
</html>
