const { PDFDocument, rgb, degrees } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const fontkit = require('fontkit');

const companyName = 'Royal Courier Logistics'; // Updated company name
const companySignatureText = 'ROYAL-C-L'; // Updated signature text

async function generateReceiptPDF(shipment, amountPaid, paymentMethod) {
    console.log(shipment);
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage();

    const robotoRegularPath = path.join(__dirname, '../Roboto (2)/Roboto-Regular.ttf');
    const robotoBoldPath = path.join(__dirname, '../Roboto (2)/Roboto-Light.ttf');

    try {
        const robotoRegularBytes = fs.readFileSync(robotoRegularPath);
        const robotoBoldBytes = fs.readFileSync(robotoBoldPath);

        const robotoRegular = await pdfDoc.embedFont(robotoRegularBytes);
        const robotoBold = await pdfDoc.embedFont(robotoBoldBytes);

        const { width, height } = page.getSize();
        const fontSize = 12;

        const amountPaidFormatted = `₦${amountPaid.toLocaleString()}`;

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

        page.drawText(`Sender: ${shipment.senderName}`, {
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

        // Draw the company signature text as a mark instead of an image
        page.drawText(companySignatureText, {
            x: 50,
            y: height - 250,
            font: robotoBold,
            size: 18,
            color: rgb(0.5, 0.5, 0.5), // Light gray color for the mark
            opacity: 0.6, // Semi-transparent
            rotate: degrees(-10),
        });

        // Optionally draw a mark or shape
        page.drawEllipse({
            x: 50,
            y: height - 250,
            width: 100,
            height: 20,
            borderColor: rgb(0.5, 0.5, 0.5),
            borderWidth: 1,
        });

        const pdfBytes = await pdfDoc.save();
        return pdfBytes; // Return the Buffer
    } catch (fontError) {
        console.error('Error embedding fonts:', fontError);
        throw fontError;
    }
}

module.exports = generateReceiptPDF;
