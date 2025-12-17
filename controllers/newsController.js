const News = require('../models/News');
const mongoose = require('mongoose'); // Import mongoose

// Create News
exports.createNews = async (req, res) => {
    try {
        const { title, description, date, slug, isActive } = req.body;

        const existing = await News.findOne({ slug });
        if (existing) {
            return res.status(400).json({ 
                success: false,
                message: 'News with this slug already exists'
            });
        }

        // Ensure date is in ISO format
        const isoDate = new Date(date).toISOString();

        const news = new News({ title, description, date: isoDate, slug, isActive });
        await news.save();
        return res.status(201).json({
            success: true, 
            message: 'News added successfully', 
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating News content',
            error: error.message
        });
    }
};


// Update News
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params; // Use id instead of _id
        const { title, description, date, slug, isActive } = req.body;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid News ID'
            });
        }

        const updatedNews = await News.findByIdAndUpdate(
            id, // Use id here
            { title, description, date, slug, isActive },
            { new: true, runValidators: true } // Return the updated document and validate input
        );

        if (!updatedNews) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'News updated successfully',
            data: updatedNews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating News content',
            error: error.message
        });
    }
};

// Get All News
exports.getAllNews = async (req, res) => {
    try {
        const newsList = await News.find({}).sort({ date: -1 }); // Latest news at the top
        const count = newsList.length;

        // Remove `id` field and use `_id` instead
        const formattedNewsList = newsList.map(news => {
            const { id, ...rest } = news.toObject();
            return rest;
        });

        res.status(200).json({ 
            success: true, 
            count, 
            data: formattedNewsList
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get News by ID
exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findOne({ id });
        if (!news) {
            return res.status(404).json({ success: false, message: 'News not found' });
        }
        res.status(200).json({ 
            success: true,
            data: news 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete News
exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findOneAndDelete({ id });
        if (!news) {
            return res.status(404).json({ success: false, message: 'News not found' });
        }
        res.status(200).json({ success: true, message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};