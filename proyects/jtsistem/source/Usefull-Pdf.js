



//------------pdf----------

/*
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
*/
async function generateInvoicePDF(invoiceData) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('landscape', 'pt', 'a4');

    const margin = 40;
    const startY = 50;
    const lineHeight = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;

    const fontSizeNormal = 12 * 0.85;
    const fontSizeHeader = 20 * 0.85;

    // Logo
    const logoImg = new Image();
    logoImg.src = invoiceData.companyLogo;
    logoImg.onload = function () {
        const aspectRatio = logoImg.width / logoImg.height;
        const logoWidth = 120;
        const logoHeight = logoWidth / aspectRatio;
        pdf.addImage(logoImg, 'JPEG', pageWidth - margin - logoWidth, margin, logoWidth, logoHeight);

        // Header
        pdf.setFontSize(fontSizeHeader);
        pdf.setTextColor(40, 40, 40);
        pdf.text(invoiceData.title, margin, startY);

        const renderCompanyBox = (yOffset,xOffset) => {

            var bx_y = margin - startY;
            var bx_x = pageWidth - margin - 200 - logoWidth - 10;
            pdf.setFontSize(fontSizeNormal);

            const companyBoxWidth = 200;
            const companyBoxHeight = 6 * lineHeight;
            const companyBoxX = pageWidth - margin - companyBoxWidth - logoWidth - 10;
            const companyBoxY = startY + 2 * lineHeight - 50;
            pdf.setFillColor(230, 230, 230);
            pdf.rect(companyBoxX, companyBoxY, companyBoxWidth, companyBoxHeight, 'F');
            pdf.setTextColor(40, 40, 40);
            pdf.text(`Razón Social: ${invoiceData.companyName}`, companyBoxX + 10, startY + 2.5 * lineHeight - 50);
            pdf.text(`RUC: ${invoiceData.companyRUC}`, companyBoxX + 10, startY + 3.5 * lineHeight - 50);
            pdf.text(`Dirección: ${invoiceData.companyAddress}`, companyBoxX + 10, startY + 4.5 * lineHeight - 50);
            pdf.text(`Teléfono: ${invoiceData.companyPhone}`, companyBoxX + 10, startY + 5.5 * lineHeight - 50);
        };

        renderCompanyBox(startY);

        // Customer and vehicle details
        pdf.setFontSize(fontSizeNormal);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Número: ${invoiceData.invoiceNumber}`, margin, startY + 2 * lineHeight);
        pdf.text(`Fecha: ${invoiceData.invoiceDate}`, margin, startY + 3 * lineHeight);
        pdf.text(`Cliente: ${invoiceData.customerName}`, margin, startY + 4 * lineHeight);
        pdf.text(`Tipo de Documento: ${invoiceData.customerDocumentType}`, margin, startY + 5 * lineHeight);
        pdf.text(`Número de Documento: ${invoiceData.customerDocumentNumber}`, margin, startY + 6 * lineHeight);
        pdf.text(`Número de Teléfono: ${invoiceData.customerPhone}`, margin, startY + 7 * lineHeight);
        pdf.text(`Dirección: ${invoiceData.customerAddress}`, margin, startY + 8 * lineHeight);

        if (invoiceData.vehicle) {
            pdf.text(`Placa: ${invoiceData.vehicle.placa}`, margin + 250, startY + 2 * lineHeight);
            pdf.text(`Marca: ${invoiceData.vehicle.marca}`, margin + 250, startY + 3 * lineHeight);
            pdf.text(`Modelo: ${invoiceData.vehicle.modelo}`, margin + 250, startY + 4 * lineHeight);
            pdf.text(`Nro de Motor: ${invoiceData.vehicle.nro_motor}`, margin + 250, startY + 5 * lineHeight);
            pdf.text(`Nro de Vin: ${invoiceData.vehicle.nro_vin}`, margin + 250, startY + 6 * lineHeight);
            pdf.text(`Año: ${invoiceData.vehicle.anio}`, margin + 250, startY + 7 * lineHeight);
            pdf.text(`Color: ${invoiceData.vehicle.color}`, margin + 250, startY + 8 * lineHeight);
        }

        // Table headers
        const renderTableHeaders = (yOffset) => {
            pdf.setFillColor(230, 230, 230);
            pdf.rect(margin, yOffset, usableWidth, lineHeight, 'F');
            pdf.setTextColor(0, 0, 0);
            pdf.text('Detalle', margin + 5, yOffset + lineHeight * 0.7);
            pdf.text('Tipo', margin + 250, yOffset + lineHeight * 0.7);
            pdf.text('Cantidad', margin + 330, yOffset + lineHeight * 0.7);
            pdf.text('Unidad', margin + 410, yOffset + lineHeight * 0.7);
            pdf.text('Precio Unitario', margin + 480, yOffset + lineHeight * 0.7);
            pdf.text('Precio Total', margin + 570, yOffset + lineHeight * 0.7);
        };

        renderTableHeaders(startY + 10 * lineHeight);

        // Table content
        let positionY = startY + 11.5 * lineHeight;
        const itemsPerPage = 10;
        let itemCount = 0;
        let totalServices = 0;
        let totalProducts = 0;

        invoiceData.items.forEach((item) => {
            if (itemCount > 0 && itemCount % itemsPerPage === 0) {
                pdf.addPage();
                positionY = startY + 2 * lineHeight;

                // Render Company Box and Table Headers on new page
                if(itemCount==0) renderCompanyBox(positionY - 1.5 * lineHeight);
                renderTableHeaders(positionY);
                positionY += 1.5 * lineHeight;
            }

            pdf.setTextColor(100, 100, 100);
            pdf.text(item.detail, margin + 5, positionY);
            pdf.text(item.type, margin + 250, positionY);
            pdf.text(String(item.quantity), margin + 330, positionY);
            pdf.text('und', margin + 410, positionY);
            pdf.text(`S/. ${item.unitPrice.toFixed(2)}`, margin + 480, positionY);
            pdf.text(`S/. ${item.totalPrice.toFixed(2)}`, margin + 570, positionY);

            positionY += lineHeight;
            itemCount++;

            if (item.type === 'servicio') {
                totalServices += item.totalPrice;
            } else {
                totalProducts += item.totalPrice;
            }
        });

        // Totals
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(fontSizeNormal);
        pdf.text(`Total Productos: S/. ${totalProducts.toFixed(2)}`, margin + 480, positionY + lineHeight);
        pdf.text(`Total Servicios: S/. ${totalServices.toFixed(2)}`, margin + 480, positionY + 2 * lineHeight);
        pdf.text(`Total Sin Descuento: S/. ${(totalProducts + totalServices).toFixed(2)}`, margin + 480, positionY + 3 * lineHeight);
        pdf.text(`Descuento: ${invoiceData.dscto.toFixed(2)}%`, margin + 480, positionY + 4 * lineHeight);
        pdf.text(`Total: S/. ${((totalProducts + totalServices) * (1 - invoiceData.dscto / 100)).toFixed(2)}`, margin + 480, positionY + 5 * lineHeight);

        pdf.save(`${invoiceData.title}-${invoiceData.invoiceNumber}.pdf`);
        window.open(pdf.output('bloburl'), '_blank');
    };
}




/*
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
*/

async function generateCheckInPDF(checkInData) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    //const pdf = new jsPDF('landscape', 'pt', 'a4'); // Mantener tamaño A4 horizontal

    const margin = 20;
    const startY = 20;
    const lineHeight = 15;
    const pageWidth = pdf.internal.pageSize.getWidth();
    //const pageHeigth = pdf.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;

    const fontSizeNormal = 12 * 0.85;
    const fontSizeHeader = 20 * 0.85;

    // Logo
    const logoImg = new Image();
    logoImg.src = checkInData.logo; // Logo en base64 desde checkInData
    logoImg.onload = function() {
        console.log('Logo cargado correctamente');
        const logoWidth = 80; // Ajusta el tamaño del logo según tu preferencia
        const aspectRatio = logoImg.width / logoImg.height;
        const logoHeight = logoWidth / aspectRatio;
        pdf.addImage(logoImg, 'JPEG', pageWidth - logoWidth - margin, startY + 1 * lineHeight, logoWidth, logoHeight);

        // Header
        pdf.setFontSize(fontSizeHeader);
        pdf.setTextColor(40, 40, 40);
        pdf.text('Orden de Trabajo', margin, startY);

        // Customer Details
        pdf.setFontSize(fontSizeNormal);
        pdf.setTextColor(100, 100, 100);
        var customer_y = 2;
        pdf.text(`Orden de Trabajo: ${checkInData.checkInNumber.toString().padStart(5, '0')}`, margin, startY + (customer_y+0) * lineHeight);
        pdf.text(`Fecha de Ingreso: ${checkInData.checkInDate}`, margin, startY + (customer_y+1) * lineHeight);
        pdf.text(`Fecha de Ingreso: ${checkInData.checkOutDate}`, margin, startY + (customer_y+2) * lineHeight);
        pdf.text(`Cliente: ${checkInData.customerName}`, margin, startY + (customer_y+3) * lineHeight);
        pdf.text(`Nro de Identificacion: ${checkInData.customerId}`, margin, startY + (customer_y+4) * lineHeight);
        pdf.text(`Telefono: ${checkInData.customerPhone}`, margin, startY + (customer_y+5) * lineHeight);
        pdf.text(`Direccion: ${checkInData.customerAddress}`, margin, startY + (customer_y+6) * lineHeight);

        var receptor_y = 10;
        pdf.text(`Recepcionista: ${checkInData.receptor.name}`, margin, startY +  (receptor_y+0) * lineHeight);
        pdf.text(`Celular: ${checkInData.receptor.cel}`, margin, startY +  (receptor_y+1) * lineHeight);

        // Vehicle Details
        var vehicle_y = 13;
        pdf.text('Detalles del Vehiculo:', margin, startY + (vehicle_y+0) * lineHeight);
        pdf.text(`Combustible: ${checkInData.vehicle.fuel}%`, margin, startY + (vehicle_y+1) * lineHeight);
        pdf.text(`Kilometraje: ${checkInData.vehicle.mileage}`, margin, startY + (vehicle_y+2) * lineHeight);
        pdf.text(`Kilometraje del Prox Servicio: ${checkInData.vehicle.mileage_prox}`, margin, startY + (vehicle_y+3) * lineHeight);
        pdf.text(`Placa: ${checkInData.vehicle.plate}`, margin, startY + (vehicle_y+4) * lineHeight);
        pdf.text(`Marca: ${checkInData.vehicle.brand}`, margin, startY + (vehicle_y+5) * lineHeight);
        pdf.text(`Modelo: ${checkInData.vehicle.model}`, margin, startY + (vehicle_y+6) * lineHeight);
        pdf.text(`Nro de Motor: ${checkInData.vehicle.engineNumber}`, margin, startY + (vehicle_y+7) * lineHeight);
        pdf.text(`Nro de Vin: ${checkInData.vehicle.vinNumber}`, margin, startY + (vehicle_y+8) * lineHeight);
        pdf.text(`año: ${checkInData.vehicle.year}`, margin, startY + (vehicle_y+9) * lineHeight);
        pdf.text(`Color: ${checkInData.vehicle.color}`, margin, startY + (vehicle_y+10) * lineHeight);

        // Comments
        var comment_y = 24;
        pdf.text('requerimiento:', margin, startY + (comment_y + 0) * lineHeight);
        pdf.text(`${checkInData.comments}`, margin, startY + (comment_y + 1) * lineHeight, { maxWidth: usableWidth / 2 });

        // Company Box
        const companyBoxWidth = 200;
        const companyBoxHeight = 6 * lineHeight;
        const companyBoxX = pageWidth - margin - companyBoxWidth - logoWidth - 10;
        const companyBoxY = startY + 1 * lineHeight;
        pdf.setFillColor(230, 230, 230);
        pdf.rect(companyBoxX, companyBoxY, companyBoxWidth, companyBoxHeight, 'F');
        pdf.setTextColor(40, 40, 40);
        pdf.text(`Razon Social: ${checkInData.companyName}`, companyBoxX + 10, startY + 2.5 * lineHeight);
        pdf.text(`RUC: ${checkInData.companyRUC}`, companyBoxX + 10, startY + 3.5 * lineHeight);
        pdf.text(`Direccion: ${checkInData.companyAddress}`, companyBoxX + 10, startY + 4.5 * lineHeight);
        pdf.text(`Telefono: ${checkInData.companyPhone}`, companyBoxX + 10, startY + 5.5 * lineHeight);

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
            var car_y = 26;
            pdf.addImage(image, 'PNG', margin, startY + (car_y+0) * lineHeight, targetWidth, targetHeight);

            pdf.text('observaciones:', margin, startY + (car_y+1) * lineHeight + targetHeight);
            pdf.text(`${checkInData.observations}`, margin, startY + (car_y+2) * lineHeight + targetHeight, { maxWidth: usableWidth / 2 });

            // Table Headers
            const yless = 200;
            const checkWidth = 40;
            const detailWidth = usableWidth * 0.4 - checkWidth - 20;

            pdf.setFillColor(230, 230, 230);
            pdf.rect(margin + targetWidth + 10, startY + 22 * lineHeight - yless, usableWidth * 0.6, lineHeight, 'F');
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(fontSizeNormal);
            pdf.text('Detalle', margin + targetWidth + 15, -5 + startY + 23 * lineHeight - yless);
            pdf.text('Check', margin + targetWidth + 15 + detailWidth, -5 + startY + 23 * lineHeight - yless);

            // Table Content
            let positionY = startY + 23.5 * lineHeight - yless;
            checkInData.items.forEach(item => {
                pdf.setTextColor(100, 100, 100);
                pdf.text(item.detail, margin + targetWidth + 15, positionY);
                pdf.text(item.check ? 'X' : '', margin + targetWidth + 15 + detailWidth, positionY);
                positionY += lineHeight;
            });

            const pdfHeight = pdf.internal.pageSize.height;

            const ln_weigth = (pageWidth - 2 * margin - 2 * 20)/3;

            const solicitante_ln_startX = margin;
            const solicitante_ln_startY = pdfHeight - margin - 2 * lineHeight;
            const solicitante_ln_endX = solicitante_ln_startX + ln_weigth;
            const solicitante_ln_endY = solicitante_ln_startY;

            // Dibujar la línea en la página PDF
            pdf.setLineWidth(1); // Grosor de la línea en puntos
            pdf.line(solicitante_ln_startX, solicitante_ln_startY, solicitante_ln_endX, solicitante_ln_endY); // Dibujar la línea     
            pdf.text(`Solicitante`, solicitante_ln_startX + ln_weigth/2 - 15, solicitante_ln_startY + lineHeight);   


            const vb_ln_startX = margin + ln_weigth + 20;
            const vb_ln_startY = pdfHeight - margin - 2 * lineHeight;
            const vb_ln_endX = vb_ln_startX + ln_weigth;
            const vb_ln_endY = vb_ln_startY;

            // Dibujar la línea en la página PDF
            pdf.setLineWidth(1); // Grosor de la línea en puntos
            pdf.line(vb_ln_startX, vb_ln_startY, vb_ln_endX, vb_ln_endY); // Dibujar la línea     
            pdf.text(`Visto Bueno`, vb_ln_startX + ln_weigth/2 - 15, vb_ln_startY + lineHeight);   


            const receptor_ln_startX = pageWidth - margin - ln_weigth;
            const receptor_ln_startY = pdfHeight - margin - 2 * lineHeight;
            const receptor_ln_endX = receptor_ln_startX + ln_weigth;
            const receptor_ln_endY = receptor_ln_startY;

            // Dibujar la línea en la página PDF
            pdf.setLineWidth(1); // Grosor de la línea en puntos
            pdf.line(receptor_ln_startX, receptor_ln_startY, receptor_ln_endX, receptor_ln_endY); // Dibujar la línea     
            pdf.text(`Receptor`, receptor_ln_startX + ln_weigth/2 - 15, receptor_ln_startY + lineHeight);   

            // Open PDF in a new window
            window.open(pdf.output('bloburl'), '_blank');
        }
    };

    
}

