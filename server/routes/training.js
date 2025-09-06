const express = require('express');
const router = express.Router();
const { body, query, param, validationResult } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const TrainingJob = require('../models/TrainingJob');
const Activity = require('../models/Activity');

// Get all training jobs for the authenticated user
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['queued', 'running', 'completed', 'failed', 'cancelled']),
  query('project').optional().isMongoId()
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
      status,
      project
    } = req.query;

    // Build query
    const queryFilter = { owner: req.user._id };
    
    if (status) {
      queryFilter.status = status;
    }

    if (project) {
      queryFilter.project = project;
    }

    const trainingJobs = await TrainingJob.find(queryFilter)
      .populate('owner', 'name email')
      .populate('project', 'name')
      .populate('dataset', 'name type')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalJobs = await TrainingJob.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalJobs / limit);

    res.json({
      success: true,
      data: {
        trainingJobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalJobs,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching training jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch training jobs',
      error: error.message
    });
  }
});

// Get active training jobs
router.get('/active', auth, async (req, res) => {
  try {
    const activeJobs = await TrainingJob.find({
      owner: req.user._id,
      status: { $in: ['queued', 'running'] }
    })
    .populate('project', 'name')
    .populate('dataset', 'name type')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { trainingJobs: activeJobs }
    });
  } catch (error) {
    console.error('Error fetching active training jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active training jobs',
      error: error.message
    });
  }
});

// Get a specific training job
router.get('/:id', auth, [
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid training job ID',
        errors: errors.array()
      });
    }

    const trainingJob = await TrainingJob.findOne({
      _id: req.params.id,
      owner: req.user._id
    })
    .populate('owner', 'name email')
    .populate('project', 'name description')
    .populate('dataset', 'name type size');

    if (!trainingJob) {
      return res.status(404).json({
        success: false,
        message: 'Training job not found'
      });
    }

    res.json({
      success: true,
      data: { trainingJob }
    });
  } catch (error) {
    console.error('Error fetching training job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch training job',
      error: error.message
    });
  }
});

// Create a new training job
router.post('/', auth, [
  body('modelName').trim().notEmpty().isLength({ min: 1, max: 100 }),
  body('totalEpochs').isInt({ min: 1, max: 1000 }),
  body('project').isMongoId(),
  body('dataset').isMongoId(),
  body('configuration.learningRate').optional().isFloat({ min: 0.00001, max: 1 }),
  body('configuration.batchSize').optional().isInt({ min: 1, max: 1024 }),
  body('configuration.optimizer').optional().isIn(['adam', 'sgd', 'rmsprop', 'adagrad'])
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

    const {
      modelName,
      totalEpochs,
      project,
      dataset,
      configuration = {}
    } = req.body;

    // Create training job
    const trainingJob = new TrainingJob({
      modelName,
      totalEpochs,
      project,
      dataset,
      owner: req.user._id,
      configuration: {
        learningRate: configuration.learningRate || 0.001,
        batchSize: configuration.batchSize || 32,
        optimizer: configuration.optimizer || 'adam',
        lossFunction: configuration.lossFunction || 'categorical_crossentropy',
        metrics: configuration.metrics || ['accuracy']
      }
    });

    await trainingJob.save();

    // Create activity log
    const activity = new Activity({
      type: 'training_started',
      description: `Started training job: ${modelName}`,
      user: req.user._id,
      project: project,
      metadata: {
        trainingJobId: trainingJob._id,
        totalEpochs: totalEpochs
      },
      visibility: 'private'
    });
    await activity.save();

    // Populate the created training job
    await trainingJob.populate(['owner', 'project', 'dataset']);

    res.status(201).json({
      success: true,
      message: 'Training job created successfully',
      data: { trainingJob }
    });
  } catch (error) {
    console.error('Error creating training job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create training job',
      error: error.message
    });
  }
});

// Update training job status and progress
router.put('/:id/progress', auth, [
  param('id').isMongoId(),
  body('status').optional().isIn(['queued', 'running', 'completed', 'failed', 'cancelled']),
  body('currentEpoch').optional().isInt({ min: 0 }),
  body('elapsedTime').optional().isInt({ min: 0 }),
  body('eta').optional().isInt({ min: 0 }),
  body('results').optional().isObject()
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

    const trainingJob = await TrainingJob.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!trainingJob) {
      return res.status(404).json({
        success: false,
        message: 'Training job not found'
      });
    }

    // Update training job
    const updates = req.body;
    
    // Handle status changes
    if (updates.status) {
      if (updates.status === 'running' && !trainingJob.startedAt) {
        updates.startedAt = new Date();
      } else if (['completed', 'failed', 'cancelled'].includes(updates.status) && !trainingJob.completedAt) {
        updates.completedAt = new Date();
      }
    }

    Object.assign(trainingJob, updates);
    await trainingJob.save();

    // Create activity log for completion
    if (updates.status === 'completed') {
      const activity = new Activity({
        type: 'training_completed',
        description: `Completed training job: ${trainingJob.modelName}`,
        user: req.user._id,
        project: trainingJob.project,
        metadata: {
          trainingJobId: trainingJob._id,
          finalAccuracy: updates.results?.accuracy
        },
        visibility: 'private'
      });
      await activity.save();
    }

    await trainingJob.populate(['owner', 'project', 'dataset']);

    res.json({
      success: true,
      message: 'Training job updated successfully',
      data: { trainingJob }
    });
  } catch (error) {
    console.error('Error updating training job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update training job',
      error: error.message
    });
  }
});

// Cancel a training job
router.post('/:id/cancel', auth, [
  param('id').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid training job ID',
        errors: errors.array()
      });
    }

    const trainingJob = await TrainingJob.findOne({
      _id: req.params.id,
      owner: req.user._id,
      status: { $in: ['queued', 'running'] }
    });

    if (!trainingJob) {
      return res.status(404).json({
        success: false,
        message: 'Training job not found or cannot be cancelled'
      });
    }

    trainingJob.status = 'cancelled';
    trainingJob.completedAt = new Date();
    await trainingJob.save();

    res.json({
      success: true,
      message: 'Training job cancelled successfully',
      data: { trainingJob }
    });
  } catch (error) {
    console.error('Error cancelling training job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel training job',
      error: error.message
    });
  }
});

// Get training job logs
router.get('/:id/logs', auth, [
  param('id').isMongoId(),
  query('level').optional().isIn(['info', 'warning', 'error', 'debug'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid parameters',
        errors: errors.array()
      });
    }

    const trainingJob = await TrainingJob.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!trainingJob) {
      return res.status(404).json({
        success: false,
        message: 'Training job not found'
      });
    }

    let logs = trainingJob.logs;

    // Filter by level if specified
    if (req.query.level) {
      logs = logs.filter(log => log.level === req.query.level);
    }

    // Sort by timestamp descending
    logs = logs.sort((a, b) => b.timestamp - a.timestamp);

    res.json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    console.error('Error fetching training job logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch training job logs',
      error: error.message
    });
  }
});

module.exports = router;
