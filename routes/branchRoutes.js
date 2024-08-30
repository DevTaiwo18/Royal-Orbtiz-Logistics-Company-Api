const express = require('express');
const router = express.Router();
const { loginBranch, changePassword, createBranch, getAllBranches, getBranch } = require('../controllers/branchController');

// Route for branch login
router.post('/login', loginBranch);

// Route for changing password
router.put('/change-password', changePassword);

// Route for creating a branch
router.post('/create', createBranch);

// Route for getting all branches
router.get('/', getAllBranches);

// Route for getting a branch by name
router.get('/:name', getBranch);

module.exports = router;
