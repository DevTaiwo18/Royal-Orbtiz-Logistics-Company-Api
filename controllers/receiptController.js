const Receipt = require('../models/Receipt');
const Customer = require('../models/Customer'); // Assuming Customer model exists

// Search for receipts by sender's name
exports.searchReceiptsBySenderName = async (req, res) => {
    try {
        const { senderName } = req.params;

        // Find sender based on senderName
        const sender = await Customer.findOne({ name: senderName });

        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        // Search receipts where sender matches
        const receipts = await Receipt.find({ sender: sender._id });

        res.status(200).json(receipts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a receipt
exports.deleteReceipt = async (req, res) => {
    try {
        const { receiptId } = req.params;

        await Receipt.findByIdAndDelete(receiptId);

        res.status(200).json({ message: 'Receipt deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
