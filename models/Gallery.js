const mongoose = require('mongoose');


const PhotoSchema = new mongoose.Schema({
  src: { type: String, required: true }
});


const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: String },
  subTitle: { type: String },
  catalogThumbnail: { type: String },
  photos: [PhotoSchema]
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
