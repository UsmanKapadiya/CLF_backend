const Contact = require('../models/Contact');

// Handle contact form submission
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        data: null
      });
    }
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: contact
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message',
      error: err.message,
      data: null
    });
  }
};
