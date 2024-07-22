const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    receiverName: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    description: { type: String, required: true },
    deliveryType: { type: String, enum: ['Home Delivery', 'Office Pickup'], required: true },
    originState: { type: String, required: true },
    destinationState: { type: String, required: true },
    waybillNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], default: 'Pending' },
    price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    amountPaid: { type: Number, required: true },    
    createdAt: { type: Date, default: Date.now }
});

const Shipment = mongoose.model('Shipment', ShipmentSchema);

module.exports = Shipment;
