const { config, uploader } = require('cloudinary').v2;
const { PDFDocument, rgb, degrees } = require('pdf-lib');
const fontkit = require('fontkit');
const fs = require('fs');
const path = require('path');
const Receipt = require('../models/Receipt');

// Cloudinary configuration
config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

async function generateReceiptPDF(shipment, amountPaid, paymentMethod) {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage();
    const robotoRegularPath = path.join(__dirname, '../Roboto (2)/Roboto-Regular.ttf');
    const robotoBoldPath = path.join(__dirname, '../Roboto (2)/Roboto-Light.ttf');

    const robotoRegularBytes = fs.readFileSync(robotoRegularPath);
    const robotoBoldBytes = fs.readFileSync(robotoBoldPath);

    const robotoRegular = await pdfDoc.embedFont(robotoRegularBytes);
    const robotoBold = await pdfDoc.embedFont(robotoBoldBytes);

    const { width, height } = page.getSize();
    const fontSize = 12;

    page.drawText(`Royal Courier Logistics Receipt`, {
        x: 50,
        y: height - 100,
        font: robotoBold,
        size: fontSize + 4,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Shipment Waybill: ${shipment.waybillNumber}`, {
        x: 50,
        y: height - 130,
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

    page.drawText(`Amount Paid: ₦${amountPaid.toLocaleString()}`, {
        x: 50,
        y: height - 190,
        font: robotoRegular,
        size: fontSize,
        color: rgb(0, 0, 0),
    });

    page.drawText('ROYAL-C-L', {
        x: 50,
        y: height - 250,
        font: robotoBold,
        size: 18,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.6,
        rotate: degrees(-10),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

async function generateAndSavePDF(shipment, amountPaid, paymentMethod) {
    try {
        const pdfBytes = await generateReceiptPDF(shipment, amountPaid, paymentMethod);
        const dataUriContent = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;

        const uploadResult = await uploader.upload(dataUriContent, {
            resource_type: "raw"
        });

        const newReceipt = new Receipt({
            pdfUrl: uploadResult.secure_url,
            senderName: shipment.senderName,
            paymentMethod,
            waybillNumber: shipment.waybillNumber
        });

        const savedReceipt = await newReceipt.save();
        return savedReceipt;

    } catch (error) {
        console.error('Error generating and saving PDF:', error);
        throw new Error('Failed to generate and save PDF');
    }
}

module.exports = generateAndSavePDF;
