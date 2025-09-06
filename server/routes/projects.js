const express = require('express');
const router = express.Router();
const { body, validationResult, query, param } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const { uploadConfigs, cloudinaryUtils } = require('../config/cloudinary');

// Get all projects for the authenticated user
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('sort').optional().isIn(['recent', 'name', 'status']),
  query('filter').optional().isIn(['all', 'preparing', 'training', 'deployed', 'completed', 'error']),
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
      limit = 10,
      sort = 'recent',
      filter = 'all',
      search = ''
    } = req.query;

    // Build query
    const queryFilter = { owner: req.user._id };
    
    if (filter !== 'all') {
      queryFilter.status = filter;
    }

    if (search) {
      queryFilter.$text = { $search: search };
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'status':
        sortOption = { status: 1, updatedAt: -1 };
        break;
      case 'recent':
      default:
        sortOption = { updatedAt: -1 };
        break;
    }

    const projects = await Project.find(queryFilter)
      .populate('owner', 'name email')
      .populate('collaborators', 'name email')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProjects = await Project.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalProjects / limit);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalProjects,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// Get a specific project
router.get('/:id', auth, [
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
        errors: errors.array()
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { collaborators: req.user._id }
      ]
    })
    .populate('owner', 'name email')
    .populate('collaborators', 'name email')
    .populate('datasets', 'name type size status')
    .populate('models')
    .populate('deployments');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
});

// Create a new project
router.post('/', auth, uploadConfigs.images.single('thumbnail'), [
  body('name').trim().notEmpty().isLength({ min: 1, max: 100 }),
  body('description').trim().notEmpty().isLength({ min: 1, max: 500 }),
  body('tags').optional().isArray({ max: 10 }),
  body('tags.*').optional().trim().isLength({ min: 1, max: 30 })
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

    const { name, description, tags = [] } = req.body;

    // Handle thumbnail upload
    let thumbnail = null;
    if (req.file) {
      try {
        const uploadResult = await cloudinaryUtils.uploadBuffer(req.file.buffer, {
          folder: 'freemind-ai/projects',
          resource_type: 'image'
        });
        
        thumbnail = {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url
        };
      } catch (uploadError) {
        console.error('Thumbnail upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload thumbnail',
          error: uploadError.message
        });
      }
    }

    // Create project
    const project = new Project({
      name,
      description,
      tags,
      thumbnail,
      owner: req.user._id
    });

    await project.save();

    // Create activity log
    const activity = new Activity({
      type: 'project_created',
      description: `Created new project: ${name}`,
      user: req.user._id,
      project: project._id,
      visibility: 'private'
    });
    await activity.save();

    // Populate the created project
    await project.populate('owner', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// Update a project
router.put('/:id', auth, uploadConfigs.images.single('thumbnail'), [
  param('id').isMongoId(),
  body('name').optional().trim().notEmpty().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().notEmpty().isLength({ min: 1, max: 500 }),
  body('status').optional().isIn(['preparing', 'training', 'deployed', 'completed', 'error']),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  body('tags').optional().isArray({ max: 10 }),
  body('tags.*').optional().trim().isLength({ min: 1, max: 30 })
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

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Handle thumbnail upload
    if (req.file) {
      try {
        // Delete old thumbnail if exists
        if (project.thumbnail && project.thumbnail.public_id) {
          await cloudinaryUtils.deleteFile(project.thumbnail.public_id);
        }

        // Upload new thumbnail
        const uploadResult = await cloudinaryUtils.uploadBuffer(req.file.buffer, {
          folder: 'freemind-ai/projects',
          resource_type: 'image'
        });
        
        req.body.thumbnail = {
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url
        };
      } catch (uploadError) {
        console.error('Thumbnail upload error:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload thumbnail',
          error: uploadError.message
        });
      }
    }

    // Update project
    Object.assign(project, req.body);
    await project.save();

    // Create activity log
    const activity = new Activity({
      type: 'project_updated',
      description: `Updated project: ${project.name}`,
      user: req.user._id,
      project: project._id,
      visibility: 'private'
    });
    await activity.save();

    await project.populate('owner', 'name email');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// Delete a project
router.delete('/:id', auth, [
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID',
        errors: errors.array()
      });
    }

    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete thumbnail from Cloudinary if exists
    if (project.thumbnail && project.thumbnail.public_id) {
      try {
        await cloudinaryUtils.deleteFile(project.thumbnail.public_id);
      } catch (deleteError) {
        console.error('Error deleting thumbnail:', deleteError);
      }
    }

    await project.deleteOne();

    // Create activity log
    const activity = new Activity({
      type: 'project_deleted',
      description: `Deleted project: ${project.name}`,
      user: req.user._id,
      visibility: 'private'
    });
    await activity.save();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// Get project metrics/statistics
router.get('/metrics/overview', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const metrics = await Project.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          preparingProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'preparing'] }, 1, 0] }
          },
          trainingProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'training'] }, 1, 0] }
          },
          deployedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'deployed'] }, 1, 0] }
          },
          completedProjects: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = metrics[0] || {
      totalProjects: 0,
      preparingProjects: 0,
      trainingProjects: 0,
      deployedProjects: 0,
      completedProjects: 0
    };

    res.json({
      success: true,
      data: { metrics: result }
    });
  } catch (error) {
    console.error('Error fetching project metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project metrics',
      error: error.message
    });
  }
});

module.exports = router;
