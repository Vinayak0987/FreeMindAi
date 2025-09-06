const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['preparing', 'training', 'deployed', 'completed', 'error'],
    default: 'preparing'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  thumbnail: {
    public_id: String,
    url: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  datasets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset'
  }],
  models: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model'
  }],
  deployments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deployment'
  }],
  settings: {
    visibility: {
      type: String,
      enum: ['private', 'public', 'team'],
      default: 'private'
    },
    categories: [{
      type: String,
      trim: true
    }]
  },
  metrics: {
    accuracy: Number,
    loss: Number,
    trainingTime: Number,
    lastTrainingDate: Date
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

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

projectSchema.index({ name: 'text', description: 'text', tags: 'text' });
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', projectSchema);
