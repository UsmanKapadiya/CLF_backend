const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  src: { type: String, required: true }
});

const GallerySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  year: { type: String },
  subTitle: { type: String },
  catalogThumbnail: { type: String },
  photos: [PhotoSchema]
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
