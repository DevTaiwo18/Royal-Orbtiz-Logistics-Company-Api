const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipment', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    receiverName: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Transfer'], required: true },
    pdf: { data: Buffer, contentType: String },  
    createdAt: { type: Date, default: Date.now }
});

const Receipt = mongoose.model('Receipt', ReceiptSchema);

module.exports = Receipt;
