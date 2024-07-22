const router = require('express').Router();
const receiptController = require('../controllers/receiptController');

router.get('/:senderName', receiptController.searchReceiptsBySenderName);
router.delete('/:receiptId', receiptController.deleteReceipt);

module.exports = router;
