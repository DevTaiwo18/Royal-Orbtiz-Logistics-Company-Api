const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Shipment schema
const ShipmentSchema = new Schema({
    senderName: { type: String, required: true },
    senderPhoneNumber: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    receiverPhone: { type: String, required: true },
    description: { type: String, required: true },
    deliveryType: {
        type: String,
        enum: ['hubToHub', 'officeToHub'],
        required: true
    },
    originState: { type: String, required: true },
    destinationState: { type: String, required: true },
    waybillNumber: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ['Pending', 'In Transit', 'Delivered', 'Canceled'],
        default: 'Pending'
    },
    totalPrice: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['cash', 'transfer'],
        required: true
    },
    amountPaid: { type: Number, required: true },
    name: {
        type: String,
        enum: ['Document', 'Parcel', 'Cargo'],
        required: true
    },
    documentId: { type: String, unique: true, default: uuidv4 }, // Adding documentId field
    createdAt: { type: Date, default: Date.now }
});

// Create the Shipment model based on the schema
const Shipment = mongoose.model('Shipment', ShipmentSchema);

module.exports = Shipment;
