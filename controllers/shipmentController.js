const Shipment = require('../models/Shipment');
const { sendSMS } = require('../services/smsService');
const Receipt = require('../models/Receipt');
const generateReceiptPDF = require('../utils/generateReceiptPDF');
const waybillGenerator = require('../utils/waybillGenerator');
const Customer = require('../models/Customer');

// CREATE new shipment
exports.createShipment = async (req, res, next) => {
    const {
        sender,
        receiverName,
        receiverAddress,
        receiverPhone,
        description,
        deliveryType,
        originState,
        destinationState,
        price,
        paymentMethod,
        amountPaid
    } = req.body;

    try {
        // Fetch sender information
        const senderInfo = await Customer.findById(sender);
        if (!senderInfo) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        // Generate waybill number
        const waybillNumber = await waybillGenerator(originState, destinationState);

        // Create new shipment
        const newShipment = new Shipment({
            senderName: senderInfo.name,
            senderPhoneNumber: senderInfo.phoneNumber,
            receiverName,
            receiverAddress,
            receiverPhone,
            description,
            deliveryType,
            originState,
            destinationState,
            waybillNumber,
            status: 'Pending',
            totalPrice: price, // Changed from price to totalPrice
            paymentMethod,
            amountPaid
        });

        const savedShipment = await newShipment.save();

        // Generate receipt PDF
        const pdfBytes = await generateReceiptPDF(savedShipment, amountPaid, paymentMethod);
        const pdfBuffer = Buffer.from(pdfBytes);

        // Create new receipt
        const newReceipt = new Receipt({
            pdf: {
                data: pdfBuffer,
                contentType: 'application/pdf'
            },
            senderName: savedShipment.senderName,
            paymentMethod,
            waybillNumber
        });

        const savedReceipt = await newReceipt.save();

        // Send SMS notification
        const message = `Hello ${savedShipment.senderName}, your shipment with waybill ${savedShipment.waybillNumber} is pending confirmation of payment via ${paymentMethod}. Amount: ${amountPaid}. Visit royalorbitzlogistics.com for more details.`;
        await sendSMS(savedShipment.senderPhoneNumber, message);

        // Respond with shipment and receipt
        res.status(201).json({ shipment: savedShipment, receipt: savedReceipt });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// UPDATE shipment
exports.updateShipment = async (req, res) => {
    const shipmentId = req.params.id;
    const { status } = req.body;

    try {
        // Validate status
        if (!['Pending', 'In Transit', 'Delivered'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Update shipment status
        const updatedShipment = await Shipment.findByIdAndUpdate(
            shipmentId,
            { status },
            { new: true }
        );

        if (!updatedShipment) {
            return res.status(404).json({ message: `Shipment with ID ${shipmentId} not found` });
        }

        // Send SMS notification for status update
        let message;
        if (status === 'In Transit') {
            message = `Hello ${updatedShipment.senderName}, your shipment with waybill ${updatedShipment.waybillNumber} is now in transit. Thank you for choosing Royal Orbitz Logistics.`;
        } else if (status === 'Delivered') {
            message = `Hello ${updatedShipment.senderName}, your shipment with waybill ${updatedShipment.waybillNumber} has been delivered. Thank you for choosing Royal Orbitz Logistics.`;
            await sendSMS(updatedShipment.receiverPhone, message); // Notify receiver
        }

        // Notify sender
        await sendSMS(updatedShipment.senderPhoneNumber, message);

        res.status(200).json(updatedShipment);
    } catch (error) {
        console.error('Error updating shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET all shipments
exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ createdAt: -1 }); // Sort by creation date
        res.status(200).json(shipments);
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET shipment by ID
exports.getShipmentById = async (req, res) => {
    const shipmentId = req.params.id;

    try {
        const shipment = await Shipment.findById(shipmentId);
        if (!shipment) {
            return res.status(404).json({ message: `Shipment with ID ${shipmentId} not found` });
        }
        res.status(200).json(shipment);
    } catch (error) {
        console.error('Error fetching shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE shipment
exports.deleteShipment = async (req, res) => {
    const shipmentId = req.params.id;

    try {
        const deletedShipment = await Shipment.findByIdAndDelete(shipmentId);
        if (!deletedShipment) {
            return res.status(404).json({ message: `Shipment with ID ${shipmentId} not found` });
        }
        res.status(200).json({ message: 'Shipment deleted successfully' });
    } catch (error) {
        console.error('Error deleting shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
