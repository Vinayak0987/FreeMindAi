const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'computer_vision',
      'nlp',
      'time_series',
      'recommendation',
      'classification',
      'regression',
      'clustering',
      'anomaly_detection',
      'sports_analytics',
      'weather_forecasting',
      'healthcare',
      'finance',
      'agriculture',
      'e_commerce',
      'social_media',
      'iot'
    ],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Brain'
  },
  thumbnail: {
    public_id: String,
    url: String
  },
  configuration: {
    modelType: String,
    framework: {
      type: String,
      enum: ['tensorflow', 'pytorch', 'scikit-learn', 'keras'],
      default: 'tensorflow'
    },
    defaultParameters: mongoose.Schema.Types.Mixed,
    requiredDataFormat: String,
    sampleDataset: {
      name: String,
      url: String,
      description: String
    }
  },
  code: {
    preprocessing: String,
    model: String,
    training: String,
    evaluation: String,
    deployment: String
  },
  requirements: {
    dependencies: [String],
    minimumDataSize: String,
    computeRequirements: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['popular', 'trending', 'new', 'featured'],
    default: 'new'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

templateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

templateSchema.index({ name: 'text', description: 'text', tags: 'text' });
templateSchema.index({ type: 1, difficulty: 1 });
templateSchema.index({ category: 1, usageCount: -1 });
templateSchema.index({ 'rating.average': -1 });

module.exports = mongoose.model('Template', templateSchema);
