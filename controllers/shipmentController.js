const Shipment = require('../models/Shipment');
const { sendSMS } = require('../services/smsService');
const Receipt = require('../models/Receipt');
const generateReceiptPDF = require('../utils/generateReceiptPDF');
const waybillGenerator = require('../utils/waybillGenerator');

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
        // Generate waybill number
        const waybillNumber = await waybillGenerator(originState, destinationState);

        // Create new shipment
        const newShipment = new Shipment({
            sender,
            receiverName,
            receiverAddress,
            receiverPhone,
            description,
            deliveryType,
            originState,
            destinationState,
            waybillNumber,
            status: 'Pending',
            price,
            paymentMethod,
            amountPaid
        });

        const savedShipment = await newShipment.save();

        // Generate receipt PDF
        const pdfBytes = await generateReceiptPDF(savedShipment, amountPaid, paymentMethod);

        // Create new receipt
        const newReceipt = new Receipt({
            shipment: savedShipment._id,
            sender: sender._id,
            receiverName,
            amountPaid,
            paymentMethod,
            pdf: { data: pdfBytes, contentType: 'application/pdf' }
        });

        const savedReceipt = await newReceipt.save();

        // Send SMS notification
        const message = `Hello ${sender.name}, your shipment with waybill ${savedShipment.waybillNumber} is pending confirmation of payment via ${paymentMethod}. Amount: ${amountPaid}. Visit royalorbitzlogistics.com for more details.`;
        await sendSMS(sender.phoneNumber, message);

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
        const updatedShipment = await Shipment.findByIdAndUpdate(
            shipmentId,
            { status },
            { new: true }
        );

        if (!updatedShipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Send SMS notification for shipment status update
        if (status === 'In Transit') {
            const message = `Hello ${updatedShipment.sender.name}, your shipment with waybill ${updatedShipment.waybillNumber} is now in transit. Thank you for choosing Royal Orbitz Logistics.`;
            await sendSMS(updatedShipment.sender.phoneNumber, message);
        } else if (status === 'Delivered') {
            const senderMessage = `Hello ${updatedShipment.sender.name}, your shipment with waybill ${updatedShipment.waybillNumber} has been delivered. Thank you for choosing Royal Orbitz Logistics.`;
            await sendSMS(updatedShipment.sender.phoneNumber, senderMessage);

            const receiverMessage = `Hello ${updatedShipment.receiverName}, your shipment with waybill ${updatedShipment.waybillNumber} has been delivered. Thank you for choosing Royal Orbitz Logistics.`;
            await sendSMS(updatedShipment.receiverPhone, receiverMessage);
        }

        res.status(200).json(updatedShipment);
    } catch (error) {
        console.error('Error updating shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET all shipments
exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find();
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
            return res.status(404).json({ message: 'Shipment not found' });
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
            return res.status(404).json({ message: 'Shipment not found' });
        }
        res.status(200).json({ message: 'Shipment deleted successfully' });
    } catch (error) {
        console.error('Error deleting shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
