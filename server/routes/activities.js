const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const Activity = require('../models/Activity');

// Get activities for the authenticated user
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isString(),
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
      limit = 20,
      type,
      project
    } = req.query;

    // Build query
    const queryFilter = { user: req.user._id };
    
    if (type) {
      queryFilter.type = type;
    }

    if (project) {
      queryFilter.project = project;
    }

    const activities = await Activity.find(queryFilter)
      .populate('user', 'name email')
      .populate('project', 'name')
      .populate('dataset', 'name')
      .populate('model', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalActivities = await Activity.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalActivities / limit);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalActivities,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
});

// Get recent activities summary
router.get('/recent', auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .populate('user', 'name email')
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { activities }
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities',
      error: error.message
    });
  }
});

// Get activity statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Activity.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get activities by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await Activity.aggregate([
      { 
        $match: { 
          user: userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          count: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        typeStats: stats,
        dailyStats
      }
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity statistics',
      error: error.message
    });
  }
});

module.exports = router;
