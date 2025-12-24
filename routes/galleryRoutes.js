const express = require('express');
const multer = require('multer');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/gallery - create gallery with images and videos
router.post('/', upload.any(), galleryController.createGallery);

// GET /api/gallery/list-by-year - get all galleries grouped by year
router.get('/list-by-year', galleryController.getGalleryByYear);

// DELETE /api/gallery/:id - delete a gallery by id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await galleryController.deleteGallery(req.params.id);
    if (deleted) {
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
});

// GET /api/gallery/:id - get a gallery by id
router.get('/:id', async (req, res) => {
  try {
    const gallery = await galleryController.getGalleryById(req.params.id);
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
});

module.exports = router;
