const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'project_created',
      'project_updated',
      'project_deleted',
      'model_trained',
      'model_deployed',
      'dataset_uploaded',
      'dataset_processed',
      'collaboration',
      'training_started',
      'training_completed',
      'deployment_created',
      'deployment_updated',
      'file_uploaded',
      'user_joined'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  dataset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset'
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Model'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  visibility: {
    type: String,
    enum: ['private', 'team', 'public'],
    default: 'private'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ project: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });
activitySchema.index({ visibility: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
