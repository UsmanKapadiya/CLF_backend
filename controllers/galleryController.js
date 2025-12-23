const Gallery = require('../models/Gallery');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
  cloud_name: 'db55ugwin',
  api_key: '951285367961346',
  api_secret: 'f3alAkUeK8HiUZvqQQ1HYu6zNZc',
});

async function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image', public_id: filename }, (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        reject(error);
      } else {
        resolve(result.secure_url);
      }
    }).end(buffer);
  });
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

    // Handle catalogThumbnail upload
    if (filesMap['catalogThumbnail']) {
      const thumbFile = filesMap['catalogThumbnail'];
      catalogThumbnail = await uploadToCloudinary(thumbFile.buffer, thumbFile.originalname);
    }

    // Handle photos upload (support both id-based and 'photos' array upload)
    // 1. id-based (Postman/Frontend sends files with fieldname as id)
    for (const photo of photosField) {
      let photoId = Date.now() + Math.floor(Math.random() * 10000);
      let src = '';
      if (filesMap[photoId.toString()]) {
        const file = filesMap[photoId.toString()];
        src = await uploadToCloudinary(file.buffer, file.originalname);
      }
      if (src) {
        photos.push({ id: photoId, src });
      }
    }
    // 2. If files sent as 'photos' array (e.g., from frontend with multiple files under 'photos')
    if (photosFiles.length > 0) {
      for (const file of photosFiles) {
        const photoId = Date.now() + Math.floor(Math.random() * 10000);
        const src = await uploadToCloudinary(file.buffer, file.originalname);
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
