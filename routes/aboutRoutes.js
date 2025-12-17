const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// Create new about content
router.post('/', aboutController.createAbout);

// Get all about content (with optional filters)
router.get('/', aboutController.getAllAbout);

// Get about content by ID
router.get('/:id', aboutController.getAboutById);

// Update about content
router.put('/:id', aboutController.updateAbout);

// Delete about content
router.delete('/:id', aboutController.deleteAbout);


// // Get about content by category with hierarchy
// router.get('/category/:category', aboutController.getAboutByCategory);

// // Get all categories
// router.get('/categories', aboutController.getCategories);

module.exports = router;
