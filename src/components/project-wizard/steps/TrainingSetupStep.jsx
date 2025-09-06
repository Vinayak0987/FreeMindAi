import React, { useState } from 'react';
import Icon from '../../AppIcon';
import Button from '../../ui/Button';

const TrainingSetupStep = ({ data, updateData, stepData }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleConfigChange = (key, value) => {
    updateData({
      training: {
        ...data.training,
        [key]: value
      }
    });
  };

  const getRecommendedSettings = () => {
    const task = data.task;
    const datasetSize = data.datasets?.length || 1;
    
    switch (task) {
      case 'object-detection':
        return {
          epochs: datasetSize > 1000 ? 100 : 50,
          batchSize: 16,
          learningRate: 0.001,
          optimizer: 'adamw',
          scheduler: 'cosine',
          augmentation: true,
          earlyStopping: true
        };
      case 'image-classification':
        return {
          epochs: datasetSize > 1000 ? 80 : 40,
          batchSize: 32,
          learningRate: 0.001,
          optimizer: 'adam',
          scheduler: 'step',
          augmentation: true,
          earlyStopping: true
        };
      default:
        return {
          epochs: 50,
          batchSize: 32,
          learningRate: 0.001,
          optimizer: 'adam',
          scheduler: 'step',
          augmentation: false,
          earlyStopping: true
        };
    }
  };

  const applyRecommendedSettings = () => {
    const recommended = getRecommendedSettings();
    updateData({ training: { ...data.training, ...recommended } });
  };

  const estimateTrainingTime = () => {
    const epochs = data.training?.epochs || 50;
    const batchSize = data.training?.batchSize || 32;
    const datasetSize = data.datasets?.reduce((total, dataset) => total + (dataset.size || 1000), 0) || 1000;
    
    // Rough estimation based on typical training speeds
    const samplesPerEpoch = Math.ceil(datasetSize / 1000); // Assuming ~1000 samples per file
    const batchesPerEpoch = Math.ceil(samplesPerEpoch / batchSize);
    const secondsPerBatch = data.task === 'object-detection' ? 2 : 1; // YOLO is slower
    
    const totalMinutes = (epochs * batchesPerEpoch * secondsPerBatch) / 60;
    
    if (totalMinutes < 60) {
      return `~${Math.ceil(totalMinutes)} minutes`;
    } else if (totalMinutes < 1440) {
      return `~${Math.ceil(totalMinutes / 60)} hours`;
    } else {
      return `~${Math.ceil(totalMinutes / 1440)} days`;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Icon name={stepData.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stepData.title}</h3>
            <p className="text-muted-foreground">{stepData.description}</p>
          </div>
        </div>
      </div>

      {/* Quick Setup */}
      <div className="mb-8 p-6 bg-card border border-border rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Quick Setup</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={applyRecommendedSettings}
            iconName="Zap"
            iconPosition="left"
          >
            Apply Recommended
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-sm text-blue-600">Task Type</div>
            <div className="text-lg font-semibold text-blue-800 capitalize">{data.task?.replace('-', ' ') || 'Not selected'}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="text-sm text-green-600">Model</div>
            <div className="text-lg font-semibold text-green-800">{data.modelConfig?.name || 'Not selected'}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="text-sm text-purple-600">Estimated Time</div>
            <div className="text-lg font-semibold text-purple-800">{estimateTrainingTime()}</div>
          </div>
        </div>
      </div>

      {/* Basic Training Parameters */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-foreground mb-4">
          Training Parameters
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Epochs *
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={data.training?.epochs || 50}
              onChange={(e) => handleConfigChange('epochs', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Number of training cycles</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Batch Size
            </label>
            <select
              value={data.training?.batchSize || 32}
              onChange={(e) => handleConfigChange('batchSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={8}>8 (Small GPU)</option>
              <option value={16}>16 (Medium GPU)</option>
              <option value={32}>32 (Large GPU)</option>
              <option value={64}>64 (Very Large GPU)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">Samples processed together</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Learning Rate
            </label>
            <select
              value={data.training?.learningRate || 0.001}
              onChange={(e) => handleConfigChange('learningRate', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={0.01}>0.01 (High)</option>
              <option value={0.003}>0.003 (Medium-High)</option>
              <option value={0.001}>0.001 (Standard)</option>
              <option value={0.0003}>0.0003 (Low)</option>
              <option value={0.0001}>0.0001 (Very Low)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">How fast the model learns</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Optimizer
            </label>
            <select
              value={data.training?.optimizer || 'adam'}
              onChange={(e) => handleConfigChange('optimizer', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="adam">Adam</option>
              <option value="adamw">AdamW</option>
              <option value="sgd">SGD</option>
              <option value="rmsprop">RMSprop</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">Optimization algorithm</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Validation Split
            </label>
            <input
              type="range"
              min="0.1"
              max="0.4"
              step="0.05"
              value={data.training?.validationSplit || 0.2}
              onChange={(e) => handleConfigChange('validationSplit', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {((data.training?.validationSplit || 0.2) * 100).toFixed(0)}% for validation
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Save Frequency
            </label>
            <select
              value={data.training?.saveFrequency || 'best'}
              onChange={(e) => handleConfigChange('saveFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="best">Best Model Only</option>
              <option value="epoch">Every Epoch</option>
              <option value="5">Every 5 Epochs</option>
              <option value="10">Every 10 Epochs</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">When to save checkpoints</p>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Advanced Settings</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Learning Rate Scheduler
              </label>
              <select
                value={data.training?.scheduler || 'step'}
                onChange={(e) => handleConfigChange('scheduler', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="none">No Scheduler</option>
                <option value="step">Step Decay</option>
                <option value="cosine">Cosine Annealing</option>
                <option value="exponential">Exponential Decay</option>
                <option value="plateau">Reduce on Plateau</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Warmup Epochs
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={data.training?.warmupEpochs || 3}
                onChange={(e) => handleConfigChange('warmupEpochs', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.training?.earlyStopping !== false}
                  onChange={(e) => handleConfigChange('earlyStopping', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-foreground">Enable Early Stopping</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1">Stop training if no improvement</p>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.training?.augmentation !== false}
                  onChange={(e) => handleConfigChange('augmentation', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-foreground">Data Augmentation</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1">Apply random transformations</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Patience (Early Stopping)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={data.training?.patience || 10}
                onChange={(e) => handleConfigChange('patience', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={data.training?.earlyStopping === false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Min Learning Rate
              </label>
              <input
                type="number"
                min="0.000001"
                max="0.001"
                step="0.000001"
                value={data.training?.minLearningRate || 0.00001}
                onChange={(e) => handleConfigChange('minLearningRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Training Summary */}
      <div className="p-6 bg-muted/30 rounded-2xl border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-primary" />
          Training Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Total Epochs</div>
            <div className="text-lg font-semibold text-foreground">{data.training?.epochs || 50}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Batch Size</div>
            <div className="text-lg font-semibold text-foreground">{data.training?.batchSize || 32}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Learning Rate</div>
            <div className="text-lg font-semibold text-foreground">{data.training?.learningRate || 0.001}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Estimated Time</div>
            <div className="text-lg font-semibold text-foreground">{estimateTrainingTime()}</div>
          </div>
        </div>

        {data.training?.earlyStopping !== false && (
          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-sm text-blue-700">
              <Icon name="Info" size={16} className="inline mr-2" />
              Early stopping is enabled. Training may finish before {data.training?.epochs || 50} epochs if the model stops improving.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingSetupStep;
