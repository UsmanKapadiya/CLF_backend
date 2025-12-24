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
router.delete('/:id', galleryController.deleteGallery);

// GET /api/gallery/:id - get a gallery by id
router.get('/:id', galleryController.getGalleryById);

module.exports = router;
