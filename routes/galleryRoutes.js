const express = require('express');
const multer = require('multer');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/gallery - create gallery with images and videos
router.post('/', upload.any(), galleryController.createGallery);

module.exports = router;
