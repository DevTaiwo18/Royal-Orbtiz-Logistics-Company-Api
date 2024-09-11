const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Payroll schema
const PayrollSchema = new Schema({
    employeeId: { type: String, required: true, unique: true }, // Ensure employeeId is unique
    employeeName: { type: String, required: true },
    employeeRole: { type: String, required: true }, // New field for employee role
    branch: { type: String, required: true }, // Linking to the employee's branch
    payPeriod: { type: String, enum: ['weekly', 'endOfMonth'], required: true }, // Limited to valid options
    basicSalary: { type: Number, required: true },
    overtimePay: { type: Number, default: 0 }, // Optional, defaults to 0
    bonuses: { type: Number, default: 0 }, // Optional, defaults to 0
    taxDeductions: { type: Number, default: 0 }, // Optional, defaults to 0
    otherDeductions: { type: Number, default: 0 }, // Optional, for additional deductions
    grossPay: { type: Number, required: true }, // Calculated as basic + overtime + bonuses
    totalDeductions: { type: Number, required: true }, // Sum of all deductions
    netPay: { type: Number, required: true }, // Net pay after deductions
    status: {
        type: String,
        enum: ['Processed', 'Pending', 'Paid'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now } // Automatically set the creation date
});

// Create the Payroll model based on the schema
const Payroll = mongoose.model('Payroll', PayrollSchema);

module.exports = Payroll;
