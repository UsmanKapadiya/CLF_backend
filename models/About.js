const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['style', 'history', 'philosophy', 'techniques', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    required: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'About',
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
aboutSchema.index({ category: 1, order: 1 });
aboutSchema.index({ parent_id: 1 });

const About = mongoose.model('About', aboutSchema);

module.exports = About;
