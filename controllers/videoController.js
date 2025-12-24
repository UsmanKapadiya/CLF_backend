const Video = require('../models/Video');

// Add a new video
exports.addVideo = async (req, res) => {
  try {
    const { title, videoUrl, catalogThumbnail } = req.body;
    const video = new Video({ title, videoUrl, catalogThumbnail });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all videos
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json({ success: true, message: 'Video deleted successfully', data: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
