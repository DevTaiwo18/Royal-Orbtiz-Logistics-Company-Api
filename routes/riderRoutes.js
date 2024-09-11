const express = require('express');
const router = express.Router();
const riderController = require('../controllers/riderController');

// CREATE a new rider
router.post('/', riderController.createRider);

// GET all riders
router.get('/', riderController.getAllRiders);

// GET a single rider by ID
router.get('/:id', riderController.getRiderById);

// UPDATE a rider by ID
router.put('/:id', riderController.updateRider);

// DELETE a rider by ID
router.delete('/:id', riderController.deleteRider);

module.exports = router;
