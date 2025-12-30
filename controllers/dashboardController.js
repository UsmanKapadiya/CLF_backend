const News = require('../models/News');
const Gallery = require('../models/Gallery');
const Video = require('../models/Video');

exports.getDashboardStats = async (req, res) => {
  try {
    // Count activated news (assuming 'isActive' field)
    const activatedNewsCount = await News.countDocuments({ isActive: true });
    // Count uploaded images
    const imagesCount = await Gallery.countDocuments();
    // Count uploaded videos
    const videosCount = await Video.countDocuments();

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        activatedNewsCount,
        imagesCount,
        videosCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
      data: null
    });
  }
};
