const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');


// Create News
// router.post('/news', newsController.createNews);
router.post('/', newsController.createNews);


// Get All News
router.get('/', newsController.getAllNews);

// Get News by ID
router.get('/:id', newsController.getNewsById);

// Update News
router.put('/:id', newsController.updateNews);

// Delete News
router.delete('/:id', newsController.deleteNews);

module.exports = router;
