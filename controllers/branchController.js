const Branch = require('../models/Branch');

// Login Controller
const loginBranch = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Find branch by name
    const branch = await Branch.findOne({ name });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Check if password matches
    if (branch.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Branch Controller
const createBranch = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check if branch already exists
    const existingBranch = await Branch.findOne({ name });
    if (existingBranch) {
      return res.status(400).json({ message: 'Branch already exists' });
    }

    // Create new branch
    const newBranch = new Branch({ name, password });
    await newBranch.save();

    res.status(201).json({ message: 'Branch created successfully', branch: newBranch });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change Password Controller
const changePassword = async (req, res) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Find branch by name
    const branch = await Branch.findOne({ name });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Check if old password matches
    if (branch.password !== oldPassword) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Update with new password
    branch.password = newPassword;
    await branch.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Branches Controller
const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Branch Controller
const getBranch = async (req, res) => {
  try {
    const { name } = req.params;

    // Find branch by name
    const branch = await Branch.findOne({ name });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  loginBranch,
  createBranch,
  changePassword,
  getAllBranches,
  getBranch
};
