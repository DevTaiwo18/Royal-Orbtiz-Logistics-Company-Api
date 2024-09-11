const Payroll = require('../models/Payroll'); // Adjust the path to your Payroll model

// Function to generate a role code based on the role
const generateRoleCode = (role) => {
    const roleCodes = {
        Driver: 'DRV',
        Warehouse: 'WH',
        Operations: 'OPS',
        Admin: 'ADM',
        Sales: 'SAL',
        Logistics: 'LOG',
        Manager: 'MGR',
        Accountant: 'ACC',
        // Add more roles as needed
    };

    // Return the role code if it exists, otherwise default to 'UNK' for unknown roles
    return roleCodes[role] || 'UNK';
};

// Function to generate a unique employee ID
const generateEmployeeId = async (role) => {
    // Use company name abbreviation
    const companyAbbreviation = 'RCL'; // Replace with your company abbreviation

    // Generate the role code using the generateRoleCode function
    const roleCode = generateRoleCode(role);

    // Count the existing payroll entries to use as a sequential number
    const totalEmployees = await Payroll.countDocuments();

    // Generate a sequential number and pad to 4 digits
    const sequentialNumber = (totalEmployees + 1).toString().padStart(4, '0');

    // Combine all parts to form the employee ID
    const employeeId = `${companyAbbreviation}-${roleCode}-${sequentialNumber}`;

    // Check if the generated ID already exists
    const existingPayroll = await Payroll.findOne({ employeeId });
    if (existingPayroll) {
        // If it exists, recursively generate a new one
        return generateEmployeeId(role);
    }

    return employeeId;
};

module.exports = generateEmployeeId;
