const Customer = require('../models/Customer');
const { sendSMS } = require('../services/smsService');

// GET all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET customer by ID
exports.getCustomerById = async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET customer by phone number
exports.getCustomerByPhoneNumber = async (req, res) => {
  // Extract and clean phone number from request parameters
  let phoneNumber = req.params.phoneNumber.trim();

  try {
    // Find the customer with the exact phone number match
    const customer = await Customer.findOne({ phoneNumber });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// CREATE new customer// CREATE new customer
exports.createCustomer = async (req, res) => {
  const { name, address, phoneNumber } = req.body;

  try {
    // Ensure phoneNumber is treated as a string
    const newCustomer = new Customer({
      name,
      address,
      phoneNumber: phoneNumber.trim() // Ensure no extra spaces
    });

    const savedCustomer = await newCustomer.save();

    // Send a welcome SMS to the customer
    const welcomeMessage = `Hello ${name}, welcome to Royal Courier Logistics! Your account has been successfully created. We are thrilled to have you on board.`;
    sendSMS(phoneNumber, welcomeMessage);

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



// UPDATE customer
exports.updateCustomer = async (req, res) => {
  const customerId = req.params.id;
  const { name, address, phoneNumber } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { name, address, phoneNumber: phoneNumber.trim() }, // Ensure no extra spaces
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// DELETE customer
exports.deleteCustomer = async (req, res) => {
  const customerId = req.params.id;

  try {
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
