const Payroll = require('../models/Payroll');

// CREATE new payroll entry
exports.createPayroll = async (req, res) => {
    try {
        const {
            employeeId, employeeName, branch, payPeriod, paymentDate,
            basicSalary, overtimePay, bonuses, taxDeductions, otherDeductions
        } = req.body;

        // Calculate gross pay, total deductions, and net pay
        const grossPay = basicSalary + (overtimePay || 0) + (bonuses || 0);
        const totalDeductions = (taxDeductions || 0) + (otherDeductions || 0);
        const netPay = grossPay - totalDeductions;

        const newPayroll = new Payroll({
            employeeId,
            employeeName,
            branch,
            payPeriod,
            paymentDate,
            basicSalary,
            overtimePay,
            bonuses,
            taxDeductions,
            otherDeductions,
            grossPay,
            totalDeductions,
            netPay,
            status: 'Pending' // Default status
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

// UPDATE payroll entry
exports.updatePayroll = async (req, res) => {
    const payrollId = req.params.id;
    const { basicSalary, overtimePay, bonuses, taxDeductions, otherDeductions, status } = req.body;

    try {
        // Update payroll fields
        const updateFields = {};
        if (basicSalary !== undefined) updateFields.basicSalary = basicSalary;
        if (overtimePay !== undefined) updateFields.overtimePay = overtimePay;
        if (bonuses !== undefined) updateFields.bonuses = bonuses;
        if (taxDeductions !== undefined) updateFields.taxDeductions = taxDeductions;
        if (otherDeductions !== undefined) updateFields.otherDeductions = otherDeductions;
        if (status) updateFields.status = status;

        // Recalculate gross pay, total deductions, and net pay if necessary fields are updated
        if (basicSalary || overtimePay || bonuses || taxDeductions || otherDeductions) {
            const payroll = await Payroll.findById(payrollId);
            if (!payroll) {
                return res.status(404).json({ message: `Payroll with ID ${payrollId} not found` });
            }
            updateFields.grossPay = (basicSalary || payroll.basicSalary) + (overtimePay || payroll.overtimePay) + (bonuses || payroll.bonuses);
            updateFields.totalDeductions = (taxDeductions || payroll.taxDeductions) + (otherDeductions || payroll.otherDeductions);
            updateFields.netPay = updateFields.grossPay - updateFields.totalDeductions;
        }

        const updatedPayroll = await Payroll.findByIdAndUpdate(payrollId, updateFields, { new: true });

        res.status(200).json(updatedPayroll);
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
