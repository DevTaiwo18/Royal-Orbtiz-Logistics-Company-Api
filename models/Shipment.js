const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Shipment schema
const ShipmentSchema = new Schema({
    senderName: { type: String, required: true }, // Name of the sender
    senderPhoneNumber: { type: String, required: true }, // Sender's phone number
    receiverName: { type: String, required: true }, // Name of the receiver
    receiverAddress: { type: String, required: true }, // Address of the receiver
    receiverPhone: { type: String, required: true }, // Receiver's phone number
    description: { type: String, required: true }, // Description of the shipment
    deliveryType: {
        type: String,
        enum: ['hubToHub', 'officeToHub'], // Match enums with delivery types in Price
        required: true
    }, // Type of delivery
    originState: { type: String, required: true }, // Origin state
    destinationState: { type: String, required: true }, // Destination state
    waybillNumber: { type: String, required: true, unique: true }, // Unique waybill number
    status: {
        type: String,
        enum: ['Pending', 'In Transit', 'Delivered', 'Canceled'],
        default: 'Pending'
    }, // Current status of the shipment
    totalPrice: { type: Number, required: true }, // Total price for the shipment
    paymentMethod: {
        type: String,
        enum: ['cash', 'transfer'], // Match enums with payment methods in Price
        required: true
    }, // Method of payment
    amountPaid: { type: Number, required: true }, // Amount paid for the shipment
    documentId: { type: String, unique: true }, // Unique identifier for related documents
    name: {
        type: String,
        enum: ['Document', 'Parcel', 'Cargo'], // Match enums with category types in Price
        required: true
    }, // Type of the shipment (document, parcel, or cargo)
    createdAt: { type: Date, default: Date.now } // Date of creation
});

// Create the Shipment model based on the schema
const Shipment = mongoose.model('Shipment', ShipmentSchema);

module.exports = Shipment;
