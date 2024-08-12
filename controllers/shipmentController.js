const Shipment = require('../models/Shipment');
const { sendSMS } = require('../services/smsService');
const Receipt = require('../models/Receipt');
const generateReceiptPDF = require('../utils/generateReceiptPDF');
const waybillGenerator = require('../utils/waybillGenerator');
const Customer = require('../models/Customer');

// CREATE new shipment
// CREATE new shipment
exports.createShipment = async (req, res, next) => {
    try {
        const { senderName, senderPhoneNumber, receiverName, receiverAddress, receiverPhone, description, deliveryType, originState, destinationState, name, totalPrice, paymentMethod, amountPaid } = req.body;

        const waybillNumber = await waybillGenerator(originState, destinationState);

        const newShipment = new Shipment({
            senderName,
            senderPhoneNumber,
            receiverName,
            receiverAddress,
            receiverPhone,
            description,
            deliveryType,
            originState,
            destinationState,
            name,
            waybillNumber,
            status: 'Pending',
            totalPrice, // Ensure totalPrice is correctly used
            paymentMethod,
            amountPaid
        });

        const savedShipment = await newShipment.save();

        const pdfBytes = await generateReceiptPDF(savedShipment, amountPaid, paymentMethod);
        const pdfBuffer = Buffer.from(pdfBytes);

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

        const message = `Hello ${savedShipment.senderName}, your shipment with waybill ${savedShipment.waybillNumber} is pending confirmation of payment via ${paymentMethod}. Amount: ${amountPaid}. Visit royalorbitzlogistics.com for more details.`;
        await sendSMS(savedShipment.senderPhoneNumber, message);

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
        if (!['Pending', 'In Transit', 'Delivered', 'Canceled'].includes(status)) {
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

        // Prepare SMS messages
        let senderMessage, receiverMessage;

        if (status === 'In Transit') {
            senderMessage = `Hello ${updatedShipment.senderName}, your shipment with waybill number ${updatedShipment.waybillNumber} is now in transit to ${updatedShipment.receiverName}. Thank you for choosing Royal Orbitz Logistics.`;
            receiverMessage = `Hello ${updatedShipment.receiverName}, the shipment from ${updatedShipment.senderName} with waybill number ${updatedShipment.waybillNumber} is now in transit. Thank you for choosing Royal Orbitz Logistics.`;
        } else if (status === 'Delivered') {
            senderMessage = `Hello ${updatedShipment.senderName}, your shipment with waybill number ${updatedShipment.waybillNumber} has been delivered to ${updatedShipment.receiverName}. Thank you for choosing Royal Orbitz Logistics.`;
            receiverMessage = `Hello ${updatedShipment.receiverName}, the shipment from ${updatedShipment.senderName} with waybill number ${updatedShipment.waybillNumber} has been delivered. Thank you for choosing Royal Orbitz Logistics.`;
        } else if (status === 'Canceled') {
            senderMessage = `Hello ${updatedShipment.senderName}, your shipment with waybill number ${updatedShipment.waybillNumber} has been canceled. We apologize for the inconvenience.`;
            receiverMessage = `Hello ${updatedShipment.receiverName}, the shipment from ${updatedShipment.senderName} with waybill number ${updatedShipment.waybillNumber} has been canceled. We apologize for the inconvenience.`;
        }

        // Send SMS notifications
        await sendSMS(updatedShipment.senderPhoneNumber, senderMessage);
        await sendSMS(updatedShipment.receiverPhoneNumber, receiverMessage);

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
