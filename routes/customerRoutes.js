const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Define routes
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.get('/phone/:phoneNumber', customerController.getCustomerByPhoneNumber); // New route for phone number
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
