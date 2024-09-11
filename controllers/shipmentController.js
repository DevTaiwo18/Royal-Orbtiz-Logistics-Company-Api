const Shipment = require('../models/Shipment');
const { sendSMS } = require('../services/smsService');
const waybillGenerator = require('../utils/waybillGenerator');

// CREATE new shipment
exports.createShipment = async (req, res) => {
    try {
        const {
            senderName, senderPhoneNumber, receiverName, receiverAddress,
            receiverPhone, description, deliveryType, originState,   
            destinationState, name, totalPrice, paymentMethod, amountPaid, BranchName, insurance, itemCondition // Added insurance and itemCondition fields
        } = req.body;

        // Validate required fields
        if (!senderName || !senderPhoneNumber || !receiverName || !receiverAddress || 
            !receiverPhone || !description || !deliveryType || !originState || 
            !destinationState || !name || !totalPrice || !paymentMethod || !amountPaid || !BranchName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate item condition
        const validConditions = ['Damaged', 'Partially Damaged', 'Not Damaged or Good'];
        if (itemCondition && !validConditions.includes(itemCondition)) {
            return res.status(400).json({ message: 'Invalid item condition' });
        }

        // Generate a waybill number
        const waybillNumber = await waybillGenerator(originState, destinationState, BranchName);

        const newShipment = new Shipment({
            senderName,
            senderPhoneNumber,
            receiverName,
            receiverAddress,
            receiverPhone,
            description,
            BranchName,
            deliveryType,
            originState,
            destinationState,
            name,
            waybillNumber,
            status: 'Pending',
            totalPrice,
            paymentMethod,
            amountPaid,
            insurance: insurance || 0, // Set insurance to the provided value or default to 0 if not provided
            itemCondition: itemCondition || 'Not Damaged or Good' // Set default item condition
        });

        const savedShipment = await newShipment.save();

        // Send SMS to the sender
        await sendSMS(
            savedShipment.senderPhoneNumber, 
            `Hello ${savedShipment.senderName}, your shipment with waybill ${savedShipment.waybillNumber} is pending confirmation of payment via ${paymentMethod}. Amount: ${amountPaid}. Visit royalorbitzlogistics.com for more details.`
        );

        res.status(201).json({ shipment: savedShipment });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// UPDATE shipment
exports.updateShipment = async (req, res) => {
    const shipmentId = req.params.id;
    const { status, insurance, itemCondition } = req.body; // Added insurance and itemCondition fields

    try {
        // Validate status
        const validStatuses = ['Pending', 'In Transit', 'Delivered', 'Canceled'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Validate item condition
        const validConditions = ['Damaged', 'Partially Damaged', 'Not Damaged or Good'];
        if (itemCondition && !validConditions.includes(itemCondition)) {
            return res.status(400).json({ message: 'Invalid item condition' });
        }

        // Update shipment fields
        const updateFields = {};
        if (status) updateFields.status = status;
        if (insurance !== undefined) updateFields.insurance = insurance; // Update insurance if provided
        if (itemCondition) updateFields.itemCondition = itemCondition; // Update item condition if provided

        // Update shipment status
        const updatedShipment = await Shipment.findByIdAndUpdate(
            shipmentId,
            updateFields,
            { new: true }
        );

        if (!updatedShipment) {
            return res.status(404).json({ message: `Shipment with ID ${shipmentId} not found` });
        }

        // Prepare SMS messages based on status
        let senderMessage = '';
        let receiverMessage = '';

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

        // Send SMS notifications if status changed
        if (senderMessage && receiverMessage) {
            await sendSMS(updatedShipment.senderPhoneNumber, senderMessage);
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
