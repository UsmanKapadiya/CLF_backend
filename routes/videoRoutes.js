const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Add a new video
router.post('/', videoController.addVideo);

// List all videos
router.get('/', videoController.getVideos);

// Get video by ID
router.get('/:id', videoController.getVideoById);

// Update video by ID
router.put('/:id', videoController.updateVideo);

// Delete video by ID
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
