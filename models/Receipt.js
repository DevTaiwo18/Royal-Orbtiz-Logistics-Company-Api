const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    pdfUrl: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'transfer'],
        required: true
    },
    waybillNumber: { 
        type: String, 
        required: true, 
        unique: true 
    }
}, { timestamps: true });

const Receipt = mongoose.model('Receipt', receiptSchema);
module.exports = Receipt;
