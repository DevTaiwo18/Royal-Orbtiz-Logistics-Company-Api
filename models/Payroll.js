const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Payroll schema
const PayrollSchema = new Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeName: { type: String, required: true },
    branch: { type: String, required: true }, // Linking to the employee's branch

    payPeriod: { type: String, required: true }, // E.g., "September 2024", "Bi-weekly"
    paymentDate: { type: Date, required: true },

    basicSalary: { type: Number, required: true },
    overtimePay: { type: Number, default: 0 }, // If applicable
    bonuses: { type: Number, default: 0 }, // If applicable

    taxDeductions: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 }, // E.g., loans, if relevant

    grossPay: { type: Number, required: true }, // basic + overtime + bonuses
    totalDeductions: { type: Number, required: true }, // tax + other deductions
    netPay: { type: Number, required: true }, // grossPay - totalDeductions

    status: {
        type: String,
        enum: ['Processed', 'Pending', 'Paid'],
        default: 'Pending'
    },
    
    createdAt: { type: Date, default: Date.now }
});

// Create the Payroll model based on the schema
const Payroll = mongoose.model('Payroll', PayrollSchema);

module.exports = Payroll;
