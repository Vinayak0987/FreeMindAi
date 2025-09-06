const mongoose = require('mongoose');

const trainingJobSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['queued', 'running', 'completed', 'failed', 'cancelled'],
    default: 'queued'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  currentEpoch: {
    type: Number,
    default: 0
  },
  totalEpochs: {
    type: Number,
    required: true
  },
  elapsedTime: {
    type: Number, // in seconds
    default: 0
  },
  eta: {
    type: Number, // estimated time remaining in seconds
    default: 0
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  dataset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  configuration: {
    learningRate: {
      type: Number,
      default: 0.001
    },
    batchSize: {
      type: Number,
      default: 32
    },
    optimizer: {
      type: String,
      enum: ['adam', 'sgd', 'rmsprop', 'adagrad'],
      default: 'adam'
    },
    lossFunction: {
      type: String,
      default: 'categorical_crossentropy'
    },
    metrics: [String]
  },
  results: {
    accuracy: Number,
    loss: Number,
    valAccuracy: Number,
    valLoss: Number,
    trainingHistory: [{
      epoch: Number,
      loss: Number,
      accuracy: Number,
      valLoss: Number,
      valAccuracy: Number
    }],
    modelArtifacts: {
      weights: {
        public_id: String,
        url: String
      },
      config: {
        public_id: String,
        url: String
      }
    }
  },
  logs: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    level: {
      type: String,
      enum: ['info', 'warning', 'error', 'debug'],
      default: 'info'
    },
    message: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

trainingJobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-update progress based on current epoch
  if (this.totalEpochs > 0) {
    this.progress = Math.round((this.currentEpoch / this.totalEpochs) * 100);
  }
  
  next();
});

trainingJobSchema.index({ owner: 1, createdAt: -1 });
trainingJobSchema.index({ project: 1, status: 1 });
trainingJobSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('TrainingJob', trainingJobSchema);
