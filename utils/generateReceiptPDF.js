const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const fs = require('fs');

const companyName = 'Royal Orbitz Logistics';
const companySignatureImagePath = '../assest/companysignature.png'; 

async function generateReceiptPDF(shipment, amountPaid, paymentMethod) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { width, height } = page.getSize();
    const fontSize = 12;
    const lineHeight = 18;

    const amountPaidFormatted = `₦${amountPaid.toLocaleString()}`;

    const content = `
        ${companyName} Receipt
        -------------------------------------------
        Shipment Waybill: ${shipment.waybillNumber}
        -------------------------------------------
        Sender: ${shipment.sender.name}
        Receiver: ${shipment.receiverName}

        Amount Paid: ${amountPaidFormatted}
        Payment Method: ${paymentMethod}
        Date: ${new Date().toLocaleDateString()}
    `;

    page.drawText(content, {
        x: 50,
        y: height - 100,
        font: helveticaFont,
        size: fontSize,
        color: rgb(0, 0, 0),
        lineHeight: lineHeight,
    });

    const companySignatureImage = fs.readFileSync(companySignatureImagePath);
    const imageBytes = await pdfDoc.embedPng(companySignatureImage);
    const imageDims = imageBytes.scale(0.2);
    page.drawImage(imageBytes, {
        x: 50,
        y: height - 150,
        width: imageDims.width,
        height: imageDims.height,
        opacity: 0.8,
        rotate: degrees(-15),
    });

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}

module.exports = generateReceiptPDF;
