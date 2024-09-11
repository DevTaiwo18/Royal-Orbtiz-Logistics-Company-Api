const Payroll = require('../models/Payroll');
const generateEmployeeId = require('../utils/generateEmployeeId');

// CREATE new payroll entry
exports.createPayroll = async (req, res) => {
    try {
        const { employeeName, employeeRole, branch, payPeriod, basicSalary, overtimePay, bonuses, taxDeductions, otherDeductions } = req.body;

        const grossPay = basicSalary + (overtimePay || 0) + (bonuses || 0);
        const totalDeductions = (taxDeductions || 0) + (otherDeductions || 0);
        const netPay = grossPay - totalDeductions;

        // Generate unique employeeId
        const employeeId = await generateEmployeeId(employeeRole);

        // Create new payroll with custom employeeId
        const newPayroll = new Payroll({
            employeeName,
            employeeRole, // Add role field
            branch,
            payPeriod,
            basicSalary,
            overtimePay,
            bonuses,
            taxDeductions,
            otherDeductions,
            grossPay,
            totalDeductions,
            netPay,
            employeeId // Add the generated employeeId
        });

        const savedPayroll = await newPayroll.save();
        res.status(201).json({ payroll: savedPayroll });
    } catch (error) {
        console.error('Error creating payroll:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET all payroll entries
exports.getAllPayrolls = async (req, res) => {
    try {
        const payrolls = await Payroll.find().sort({ createdAt: -1 }); // Sort by creation date
        res.status(200).json(payrolls);
    } catch (error) {
        console.error('Error fetching payrolls:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET payroll by ID
exports.getPayrollById = async (req, res) => {
    const payrollId = req.params.id;

    try {
        const payroll = await Payroll.findById(payrollId);
        if (!payroll) {
            return res.status(404).json({ message: `Payroll with ID ${payrollId} not found` });
        }
        res.status(200).json(payroll);
    } catch (error) {
        console.error('Error fetching payroll:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// UPDATE payroll entry// UPDATE payroll entry
exports.updatePayroll = async (req, res) => {
    const payrollId = req.params.id;
    const { employeeName, employeeRole, branch, payPeriod, basicSalary, overtimePay, bonuses, taxDeductions, otherDeductions, status } = req.body;

    try {
        // Find the existing payroll to update
        const payroll = await Payroll.findById(payrollId);
        if (!payroll) {
            return res.status(404).json({ message: `Payroll with ID ${payrollId} not found` });
        }

        // Update fields if provided
        if (employeeName !== undefined) payroll.employeeName = employeeName;
        if (employeeRole !== undefined) payroll.employeeRole = employeeRole;
        if (branch !== undefined) payroll.branch = branch;
        if (payPeriod !== undefined) payroll.payPeriod = payPeriod;
        if (basicSalary !== undefined) payroll.basicSalary = basicSalary;
        if (overtimePay !== undefined) payroll.overtimePay = overtimePay;
        if (bonuses !== undefined) payroll.bonuses = bonuses;
        if (taxDeductions !== undefined) payroll.taxDeductions = taxDeductions;
        if (otherDeductions !== undefined) payroll.otherDeductions = otherDeductions;
        if (status !== undefined) payroll.status = status;

        // Recalculate gross pay, total deductions, and net pay
        payroll.grossPay = (payroll.basicSalary || 0) + (payroll.overtimePay || 0) + (payroll.bonuses || 0);
        payroll.totalDeductions = (payroll.taxDeductions || 0) + (payroll.otherDeductions || 0);
        payroll.netPay = payroll.grossPay - payroll.totalDeductions;

        // Save the updated payroll
        const updatedPayroll = await payroll.save();

        res.status(200).json({ payroll: updatedPayroll }); // Make sure this matches the expected structure
    } catch (error) {
        console.error('Error updating payroll:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// DELETE payroll entry
exports.deletePayroll = async (req, res) => {
    const payrollId = req.params.id;

    try {
        const deletedPayroll = await Payroll.findByIdAndDelete(payrollId);
        if (!deletedPayroll) {
            return res.status(404).json({ message: `Payroll with ID ${payrollId} not found` });
        }
        res.status(200).json({ message: 'Payroll deleted successfully' });
    } catch (error) {
        console.error('Error deleting payroll:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
