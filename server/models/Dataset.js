const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
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
    enum: ['image', 'text', 'audio', 'video', 'csv', 'json', 'mixed'],
    required: true
  },
  size: {
    totalFiles: {
      type: Number,
      default: 0
    },
    totalSize: {
      type: Number,
      default: 0
    },
    sizeUnit: {
      type: String,
      enum: ['B', 'KB', 'MB', 'GB'],
      default: 'MB'
    }
  },
  files: [{
    filename: String,
    originalName: String,
    public_id: String,
    url: String,
    size: Number,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    format: String,
    encoding: String,
    columns: [String],
    classes: [String],
    features: mongoose.Schema.Types.Mixed
  },
  preprocessing: {
    steps: [{
      name: String,
      parameters: mongoose.Schema.Types.Mixed,
      appliedAt: Date
    }],
    isProcessed: {
      type: Boolean,
      default: false
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  tags: [{
    type: String,
    trim: true
  }],
  visibility: {
    type: String,
    enum: ['private', 'public', 'team'],
    default: 'private'
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'ready', 'error'],
    default: 'uploading'
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

datasetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

datasetSchema.index({ name: 'text', description: 'text', tags: 'text' });
datasetSchema.index({ owner: 1, createdAt: -1 });
datasetSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Dataset', datasetSchema);
