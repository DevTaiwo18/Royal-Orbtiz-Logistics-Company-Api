const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController'); // Adjust the path as needed

// Create a new price entry
router.post('/', priceController.createPrice);

// Get all price entries
router.get('/', priceController.getAllPrices);

// Get a specific price entry by ID
router.get('/:id', priceController.getPriceById);

// Update a price entry by ID
router.put('/:id', priceController.updatePrice);

// Delete a price entry by ID
router.delete('/:id', priceController.deletePrice);

// Calculate price based on shipment details
router.post('/calculate', priceController.calculatePrice);

module.exports = router;
