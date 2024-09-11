const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController'); // Adjust the path as needed

// Route to create a new payroll entry
router.post('/', payrollController.createPayroll);

// Route to get all payroll entries
router.get('/', payrollController.getAllPayrolls);

// Route to get a payroll entry by ID
router.get('/:id', payrollController.getPayrollById);

// Route to update a payroll entry by ID
router.put('/:id', payrollController.updatePayroll);

// Route to delete a payroll entry by ID
router.delete('/:id', payrollController.deletePayroll);

module.exports = router;
