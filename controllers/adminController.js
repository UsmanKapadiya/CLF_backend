const Admin = require('../models/Admin');

// Initialize static admin (call this once to create admin in DB)
const initializeAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin already exists' 
      });
    }

    // Create static admin
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@clf.com',
      password: 'admin123', // In production, hash this password
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating admin',
      error: error.message,
    });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password',
      });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated',
      });
    }

    // Check password (in production, use bcrypt.compare for hashed passwords)
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Login successful
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

// Admin logout
const adminLogout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // This endpoint confirms the logout action
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message,
    });
  }
};


module.exports = {
  adminLogin,
  adminLogout,
};
