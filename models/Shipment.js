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
    BranchName: { type: String, required: true },
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
    name: { type: String, required: true }, // Changed to String type for manual entry
    documentId: { type: String, unique: true, default: uuidv4 }, // Adding documentId field
    insurance: { type: Number }, // Optional insurance field
    itemCondition: { // New field for item condition
        type: String,
        enum: ['Damaged', 'Partially Damaged', 'Not Damaged or Good'],
        default: 'Not Damaged or Good'
    },
    rider: { // Reference to the Rider model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rider',
        required: true
    },
    createdBy: { // Reference to the Payroll model (staff who created the shipment)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payroll',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

// Create the Shipment model based on the schema
const Shipment = mongoose.model('Shipment', ShipmentSchema);

module.exports = Shipment;
