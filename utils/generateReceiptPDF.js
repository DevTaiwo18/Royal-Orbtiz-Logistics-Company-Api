const { PDFDocument, rgb, degrees } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const companyName = 'Royal Orbitz Logistics';
const companySignatureImagePath = path.join(__dirname, '../assets/companysignature.png');

async function generateReceiptPDF(shipment, amountPaid, paymentMethod) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    // Load and embed Roboto fonts
    const robotoRegularPath = path.join(__dirname, '../Roboto (2)/Roboto-Regular.ttf');
    const robotoBoldPath = path.join(__dirname, '../Roboto (2)/Roboto-Light.ttf');

    const robotoRegularBytes = fs.readFileSync(robotoRegularPath);
    const robotoBoldBytes = fs.readFileSync(robotoBoldPath);

    const robotoRegular = await pdfDoc.embedFont(robotoRegularBytes);
    const robotoBold = await pdfDoc.embedFont(robotoBoldBytes);

    const { width, height } = page.getSize();
    const fontSize = 12;
    const lineHeight = 18;

    const amountPaidFormatted = `₦${amountPaid.toLocaleString()}`;

    // Draw text using the Roboto Regular font
    page.drawText(`${companyName} Receipt`, {
        x: 50,
        y: height - 100,
        font: robotoBold,
        size: fontSize + 4,
        color: rgb(0, 0, 0),
    });

    page.drawText('-------------------------------------------', {
        x: 50,
        y: height - 115,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Shipment Waybill: ${shipment.waybillNumber}`, {
        x: 50,
        y: height - 130,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    page.drawText('-------------------------------------------', {
        x: 50,
        y: height - 145,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Sender: ${shipment.sender.name}`, {
        x: 50,
        y: height - 160,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Receiver: ${shipment.receiverName}`, {
        x: 50,
        y: height - 175,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Amount Paid: ${amountPaidFormatted}`, {
        x: 50,
        y: height - 190,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Payment Method: ${paymentMethod}`, {
        x: 50,
        y: height - 205,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: height - 220,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    // Embed and draw company signature image
    const companySignatureImage = fs.readFileSync(companySignatureImagePath);
    const imageBytes = await pdfDoc.embedPng(companySignatureImage);
    const imageDims = imageBytes.scale(0.2);

    page.drawImage(imageBytes, {
        x: 50,
        y: height - 250,
        width: imageDims.width,
        height: imageDims.height,
        opacity: 0.8,
        rotate: degrees(-15),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

module.exports = generateReceiptPDF;
