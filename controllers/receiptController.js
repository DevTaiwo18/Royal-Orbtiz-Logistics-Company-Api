// controllers/receiptController.js
const Receipt = require('../models/Receipt');
const Customer = require('../models/Customer'); // Assuming Customer model exists

// Get a receipt by waybill number
exports.getReceiptByWaybillNumber = async (req, res) => {
    try {
        const { waybillNumber } = req.params;
        console.log('Received waybillNumber:', waybillNumber);

        const receipt = await Receipt.findOne({ waybillNumber });

        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        res.status(200).json(receipt);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search for receipts by sender's name
exports.searchReceiptsBySenderName = async (req, res) => {
    try {
        const { senderName } = req.params;

        const sender = await Customer.findOne({ name: senderName });

        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        const receipts = await Receipt.find({ senderName });

        res.status(200).json(receipts);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a receipt
exports.deleteReceipt = async (req, res) => {
    try {
        const { receiptId } = req.params;

        const result = await Receipt.findByIdAndDelete(receiptId);

        if (!result) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        res.status(200).json({ message: 'Receipt deleted successfully' });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get the latest receipt by sender's name
exports.getMostRecentReceiptBySenderName = async (req, res) => {
    try {
        const { senderName } = req.params;

        const sender = await Customer.findOne({ name: senderName });

        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        const receipt = await Receipt.findOne({ senderName }).sort({ createdAt: -1 });

        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        res.status(200).json(receipt);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
