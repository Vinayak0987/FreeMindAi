const express = require('express');
const router = express.Router();
const { query, param, body, validationResult } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const Template = require('../models/Template');

// Get all public templates (no auth required)
router.get('/public', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isString(),
  query('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
  query('category').optional().isIn(['popular', 'trending', 'new', 'featured']),
  query('search').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      type,
      difficulty,
      category,
      search = ''
    } = req.query;

    // Build query
    const queryFilter = { 
      isPublic: true, 
      isActive: true 
    };

    if (type) {
      queryFilter.type = type;
    }

    if (difficulty) {
      queryFilter.difficulty = difficulty;
    }

    if (category) {
      queryFilter.category = category;
    }

    if (search) {
      queryFilter.$text = { $search: search };
    }

    // Build sort
    let sortOption = { usageCount: -1, 'rating.average': -1, createdAt: -1 };

    if (category === 'popular') {
      sortOption = { usageCount: -1, 'rating.average': -1 };
    } else if (category === 'trending') {
      sortOption = { usageCount: -1, updatedAt: -1 };
    } else if (category === 'new') {
      sortOption = { createdAt: -1 };
    } else if (category === 'featured') {
      sortOption = { 'rating.average': -1, usageCount: -1 };
    }

    const templates = await Template.find(queryFilter)
      .populate('author', 'name email')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-code'); // Exclude code for listing

    const totalTemplates = await Template.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalTemplates / limit);

    res.json({
      success: true,
      data: {
        templates,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalTemplates,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching public templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates',
      error: error.message
    });
  }
});

// Get a specific template with full details
router.get('/public/:id', [
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID',
        errors: errors.array()
      });
    }

    const template = await Template.findOne({
      _id: req.params.id,
      isPublic: true,
      isActive: true
    }).populate('author', 'name email');

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Increment usage count
    template.usageCount += 1;
    await template.save();

    res.json({
      success: true,
      data: { template }
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template',
      error: error.message
    });
  }
});

// Get user's templates (requires auth)
router.get('/my', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10
    } = req.query;

    const templates = await Template.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalTemplates = await Template.countDocuments({ author: req.user._id });
    const totalPages = Math.ceil(totalTemplates / limit);

    res.json({
      success: true,
      data: {
        templates,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalTemplates,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user templates',
      error: error.message
    });
  }
});

// Create a new template (requires auth)
router.post('/', auth, [
  body('name').trim().notEmpty().isLength({ min: 1, max: 100 }),
  body('description').trim().notEmpty().isLength({ min: 1, max: 500 }),
  body('type').isIn([
    'computer_vision', 'nlp', 'time_series', 'recommendation', 'classification',
    'regression', 'clustering', 'anomaly_detection', 'sports_analytics',
    'weather_forecasting', 'healthcare', 'finance', 'agriculture', 'e_commerce',
    'social_media', 'iot'
  ]),
  body('difficulty').isIn(['Beginner', 'Intermediate', 'Advanced']),
  body('estimatedTime').trim().notEmpty(),
  body('configuration').optional().isObject(),
  body('code').optional().isObject(),
  body('requirements').optional().isObject(),
  body('tags').optional().isArray({ max: 10 }),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const templateData = {
      ...req.body,
      author: req.user._id
    };

    const template = new Template(templateData);
    await template.save();

    await template.populate('author', 'name email');

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: { template }
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create template',
      error: error.message
    });
  }
});

// Get template categories and types
router.get('/meta', async (req, res) => {
  try {
    const categories = ['popular', 'trending', 'new', 'featured'];
    const types = [
      'computer_vision', 'nlp', 'time_series', 'recommendation', 'classification',
      'regression', 'clustering', 'anomaly_detection', 'sports_analytics',
      'weather_forecasting', 'healthcare', 'finance', 'agriculture', 'e_commerce',
      'social_media', 'iot'
    ];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    // Get counts for each type
    const typeCounts = await Template.aggregate([
      { $match: { isPublic: true, isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeCountMap = {};
    typeCounts.forEach(item => {
      typeCountMap[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        categories,
        types: types.map(type => ({
          value: type,
          label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          count: typeCountMap[type] || 0
        })),
        difficulties
      }
    });
  } catch (error) {
    console.error('Error fetching template metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch template metadata',
      error: error.message
    });
  }
});

// Get popular templates
router.get('/popular', async (req, res) => {
  try {
    const popularTemplates = await Template.find({
      isPublic: true,
      isActive: true
    })
    .populate('author', 'name email')
    .sort({ usageCount: -1, 'rating.average': -1 })
    .limit(6)
    .select('-code');

    res.json({
      success: true,
      data: { templates: popularTemplates }
    });
  } catch (error) {
    console.error('Error fetching popular templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular templates',
      error: error.message
    });
  }
});

module.exports = router;
