const Video = require('../models/Video');

// Add a new video
exports.addVideo = async (req, res) => {
  try {
    const { title, videoUrl, catalogThumbnail } = req.body;
    const video = new Video({ title, videoUrl, catalogThumbnail });
    await video.save();
    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: video
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to create video',
      error: err.message,
      data: null
    });
  }
};

// Get all videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({
      success: true,
      message: 'Videos fetched successfully',
      data: videos
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch videos',
      error: err.message,
      data: null
    });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: 'Video fetched successfully',
      data: video
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video',
      error: err.message,
      data: null
    });
  }
};

// Update video
exports.updateVideo = async (req, res) => {
  try {
    const { title, videoUrl, catalogThumbnail } = req.body;
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, videoUrl, catalogThumbnail },
      { new: true }
    );
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      data: video
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to update video',
      error: err.message,
      data: null
    });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: 'Video deleted successfully',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete video',
      error: err.message,
      data: null
    });
  }
};
