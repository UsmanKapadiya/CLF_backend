const Gallery = require('../models/Gallery');

const fs = require('fs');
const path = require('path');


// Save file buffer to uploads/ and return relative URL
async function saveToUploads(buffer, filename) {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  // Ensure unique filename
  const uniqueName = Date.now() + '-' + filename.replace(/\s+/g, '_');
  const filePath = path.join(uploadsDir, uniqueName);
  await fs.promises.writeFile(filePath, buffer);
  const url = `/uploads/${uniqueName}`;
  console.log(`Image uploaded successfully: ${url}`);
  return url;
}

exports.createGallery = async (req, res) => {
  try {
    console.log("call createGallery");
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    const { title, year, subTitle } = req.body;
    // Always auto-generate gallery id
    let galleryId = Date.now();
    let catalogThumbnail = '';
    let photos = [];
    // Parse photos field (array of {id})
    let photosField = req.body.photos;
    if (typeof photosField === 'string') {
      try {
        photosField = JSON.parse(photosField);
      } catch (e) {
        photosField = [];
      }
    }
    if (!Array.isArray(photosField)) photosField = [];

    // Map files by fieldname for easy access, and collect all 'photos' files as array
    const filesMap = {};
    let photosFiles = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        if (file.fieldname === 'catalogThumbnail') {
          filesMap['catalogThumbnail'] = file;
        } else if (file.fieldname === 'photos') {
          photosFiles.push(file);
        } else {
          filesMap[file.fieldname] = file;
        }
      });
    }


    // Handle catalogThumbnail upload (save locally)
    if (filesMap['catalogThumbnail']) {
      const thumbFile = filesMap['catalogThumbnail'];
      catalogThumbnail = await saveToUploads(thumbFile.buffer, thumbFile.originalname);
    }

    // Handle photos upload (support both id-based and 'photos' array upload)
    // 1. id-based (Postman/Frontend sends files with fieldname as id)
    for (const photo of photosField) {
      let photoId = Date.now() + Math.floor(Math.random() * 10000);
      let src = '';
      if (filesMap[photoId.toString()]) {
        const file = filesMap[photoId.toString()];
        src = await saveToUploads(file.buffer, file.originalname);
      }
      if (src) {
        photos.push({ id: photoId, src });
      }
    }
    // 2. If files sent as 'photos' array (e.g., from frontend with multiple files under 'photos')
    if (photosFiles.length > 0) {
      for (const file of photosFiles) {
        const photoId = Date.now() + Math.floor(Math.random() * 10000);
        const src = await saveToUploads(file.buffer, file.originalname);
        photos.push({ id: photoId, src });
      }
    }

    const gallery = new Gallery({ id: galleryId, title, year, subTitle, catalogThumbnail, photos });
    await gallery.save();
    res.status(201).json({
      success: true,
      message: 'Gallery created successfully',
      data: gallery
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery',
      error: err.message,
      data: null
    });
  }
};

exports.getGalleryByYear = async (req, res) => {
  try {
    const galleries = await Gallery.find({});
    // Group by year
    const grouped = {};
    galleries.forEach(gallery => {
      const year = gallery.year || 'unknown';
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push({
        id: gallery.id,
        title: gallery.title,
        year: gallery.year,
        subTitle: gallery.subTitle,
        catalogThumbnail: gallery.catalogThumbnail,
        photos: gallery.photos
      });
    });
    res.status(200).json({
      success: true,
      message: 'Gallery list grouped by year',
      data: grouped
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch galleries',
      error: err.message,
      data: null
    });
  }
};


// GET /api/gallery/:id - controller
exports.getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ id: Number(req.params.id) });
    if (gallery) {
      res.status(200).json({
        success: true,
        message: 'Gallery fetched successfully',
        data: gallery
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Gallery not found',
        data: null
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery',
      error: err.message,
      data: null
    });
  }
};

// DELETE /api/gallery/:id - controller
exports.deleteGallery = async (req, res) => {
  try {
    const result = await Gallery.findOneAndDelete({ id: Number(req.params.id) });
    if (result) {
      res.status(200).json({
        success: true,
        message: 'Gallery deleted successfully',
        data: null
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Gallery not found',
        data: null
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery',
      error: err.message,
      data: null
    });
  }
};
