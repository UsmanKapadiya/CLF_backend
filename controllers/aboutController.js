const About = require('../models/About');

// Create new about content
exports.createAbout = async (req, res) => {
  try {
    const { name, title, category, description, parent_id, order } = req.body;

    if (!name || !title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, title, category, and description'
      });
    }

    // If parent_id is provided, verify it exists
    if (parent_id) {
      const parentExists = await About.findById(parent_id);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: 'Parent content not found'
        });
      }
    }

    const aboutContent = new About({
      name,
      title,
      category,
      description,
      parent_id: parent_id || null,
      order: order || 0
    });

    await aboutContent.save();

    res.status(201).json({
      success: true,
      message: 'About content created successfully',
      data: aboutContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating about content',
      error: error.message
    });
  }
};

// Update about content
exports.updateAbout = async (req, res) => {
  try {
    const { name, title, category, description, parent_id, order, isActive } = req.body;

    // If parent_id is being changed, verify it exists
    if (parent_id && parent_id !== req.params.id) {
      const parentExists = await About.findById(parent_id);
      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: 'Parent content not found'
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (parent_id !== undefined) updateData.parent_id = parent_id || null;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const aboutContent = await About.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('parent_id', 'name title');

    if (!aboutContent) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'About content updated successfully',
      data: aboutContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating about content',
      error: error.message
    });
  }
};

// Get about content by ID
exports.getAboutById = async (req, res) => {
  try {
    const aboutContent = await About.findById(req.params.id)
      .populate('parent_id', 'name title');

    if (!aboutContent) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    res.status(200).json({
      success: true,
      data: aboutContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching about content',
      error: error.message
    });
  }
};

// Get all about content
exports.getAllAbout = async (req, res) => {
  try {
    const { category, parent_id } = req.query;
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (parent_id !== undefined) {
      query.parent_id = parent_id === 'null' || parent_id === '' ? null : parent_id;
    }

    const aboutContent = await About.find(query)
      .populate('parent_id', 'name title')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: aboutContent.length,
      data: aboutContent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching about content',
      error: error.message
    });
  }
};

// Delete about content
exports.deleteAbout = async (req, res) => {
  try {
    // Check if there are any child items
    const childItems = await About.find({ parent_id: req.params.id });
    
    if (childItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete content with child items. Please delete or reassign child items first.'
      });
    }

    const aboutContent = await About.findByIdAndDelete(req.params.id);

    if (!aboutContent) {
      return res.status(404).json({
        success: false,
        message: 'About content not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'About content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting about content',
      error: error.message
    });
  }
};



// // Get about content by category with hierarchy
// exports.getAboutByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;

//     // Get all content for this category
//     const allContent = await About.find({ 
//       category, 
//       isActive: true 
//     }).sort({ order: 1, createdAt: -1 });

//     // Separate parent and child items
//     const parentItems = allContent.filter(item => !item.parent_id);
//     const childItems = allContent.filter(item => item.parent_id);

//     // Build hierarchy
//     const hierarchy = parentItems.map(parent => {
//       const children = childItems.filter(
//         child => child.parent_id && child.parent_id.toString() === parent._id.toString()
//       );
//       return {
//         ...parent.toObject(),
//         children: children.length > 0 ? children : []
//       };
//     });

//     res.status(200).json({
//       success: true,
//       category,
//       count: hierarchy.length,
//       data: hierarchy
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching about content by category',
//       error: error.message
//     });
//   }
// };

// // Get all categories
// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await About.distinct('category');
    
//     res.status(200).json({
//       success: true,
//       data: categories
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching categories',
//       error: error.message
//     });
//   }
// };
