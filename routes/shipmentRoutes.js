const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

// Define waybill route (ensures it is matched first)
router.get('/waybill/:waybillNumber', shipmentController.getShipmentByWaybill);

// Use regex to enforce ID format (24 hex characters for ObjectId)
router.get('/:id([0-9a-fA-F]{24})', shipmentController.getShipmentById);

router.get('/', shipmentController.getAllShipments);
router.post('/', shipmentController.createShipment);
router.put('/:id([0-9a-fA-F]{24})', shipmentController.updateShipment);
router.delete('/:id([0-9a-fA-F]{24})', shipmentController.deleteShipment);

module.exports = router;
