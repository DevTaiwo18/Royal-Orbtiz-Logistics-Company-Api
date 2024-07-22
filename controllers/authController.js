const User = require('../models/User');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log('Login request received with:', { username, password });

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password === password) {
      console.log('Login successful');
      res.status(200).json({ message: 'Login successful', user: { username: user.username, role: user.role } });
    } else {
      console.log('Invalid credentials');
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Directly compare plain text passwords
    if (user.password !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Directly assign newPassword
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


