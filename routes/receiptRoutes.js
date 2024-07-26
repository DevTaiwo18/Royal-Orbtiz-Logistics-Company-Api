const router = require('express').Router();
const receiptController = require('../controllers/receiptController');

// Route to search for receipts by sender's name
router.get('/:senderName', receiptController.searchReceiptsBySenderName);

// Route to get the latest receipt by sender's name
router.get('/latest/sender/:senderName', receiptController.getMostRecentReceiptBySenderName);

// Route to get a receipt by waybill number
router.get('/waybill/:waybillNumber', receiptController.getReceiptByWaybillNumber);

// Route to delete a receipt
router.delete('/:receiptId', receiptController.deleteReceipt);

module.exports = router;
