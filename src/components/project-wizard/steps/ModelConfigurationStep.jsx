import React from 'react';
import Icon from '../../AppIcon';

const ModelConfigurationStep = ({ data, updateData, stepData }) => {
  const getModelArchitectures = () => {
    switch (data.task) {
      case 'object-detection':
        return [
          {
            id: 'yolov8n',
            name: 'YOLOv8 Nano',
            description: 'Fastest inference, lowest accuracy',
            params: '3.2M',
            speed: 'Very Fast',
            accuracy: 'Good',
            recommended: false
          },
          {
            id: 'yolov8s',
            name: 'YOLOv8 Small',
            description: 'Balanced speed and accuracy',
            params: '11.2M',
            speed: 'Fast',
            accuracy: 'Better',
            recommended: true
          },
          {
            id: 'yolov8m',
            name: 'YOLOv8 Medium',
            description: 'Higher accuracy, moderate speed',
            params: '25.9M',
            speed: 'Medium',
            accuracy: 'Very Good',
            recommended: false
          },
          {
            id: 'yolov8l',
            name: 'YOLOv8 Large',
            description: 'Highest accuracy, slower inference',
            params: '43.7M',
            speed: 'Slow',
            accuracy: 'Excellent',
            recommended: false
          }
        ];
      
      case 'image-classification':
        return [
          {
            id: 'resnet50',
            name: 'ResNet-50',
            description: 'Deep residual network with 50 layers',
            params: '25.6M',
            speed: 'Fast',
            accuracy: 'Very Good',
            recommended: true
          },
          {
            id: 'efficientnet_b0',
            name: 'EfficientNet-B0',
            description: 'Efficient architecture with compound scaling',
            params: '5.3M',
            speed: 'Very Fast',
            accuracy: 'Good',
            recommended: false
          },
          {
            id: 'mobilenet_v3',
            name: 'MobileNet V3',
            description: 'Lightweight model for mobile deployment',
            params: '5.4M',
            speed: 'Very Fast',
            accuracy: 'Good',
            recommended: false
          },
          {
            id: 'vit_base',
            name: 'Vision Transformer',
            description: 'Transformer-based architecture for images',
            params: '86M',
            speed: 'Medium',
            accuracy: 'Excellent',
            recommended: false
          }
        ];

      default:
        return [
          {
            id: 'custom_cnn',
            name: 'Custom CNN',
            description: 'Customizable convolutional neural network',
            params: 'Variable',
            speed: 'Variable',
            accuracy: 'Variable',
            recommended: true
          }
        ];
    }
  };

  const handleModelSelect = (modelId) => {
    const selectedModel = getModelArchitectures().find(m => m.id === modelId);
    updateData({
      modelConfig: {
        ...data.modelConfig,
        architecture: modelId,
        name: selectedModel?.name,
        description: selectedModel?.description
      }
    });
  };

  const handleConfigChange = (key, value) => {
    updateData({
      modelConfig: {
        ...data.modelConfig,
        [key]: value
      }
    });
  };

  const getModelSpecificConfig = () => {
    const architecture = data.modelConfig?.architecture;
    
    if (!architecture) return null;

    if (data.task === 'object-detection') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Image Size
            </label>
            <select
              value={data.modelConfig?.imageSize || 640}
              onChange={(e) => handleConfigChange('imageSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={416}>416x416 (Faster)</option>
              <option value={640}>640x640 (Balanced)</option>
              <option value={832}>832x832 (More Accurate)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confidence Threshold
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={data.modelConfig?.confidence || 0.5}
              onChange={(e) => handleConfigChange('confidence', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground mt-1">
              {data.modelConfig?.confidence || 0.5}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              IoU Threshold
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={data.modelConfig?.iouThreshold || 0.5}
              onChange={(e) => handleConfigChange('iouThreshold', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground mt-1">
              {data.modelConfig?.iouThreshold || 0.5}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Max Detections
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={data.modelConfig?.maxDetections || 100}
              onChange={(e) => handleConfigChange('maxDetections', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      );
    }

    if (data.task === 'image-classification') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Input Resolution
            </label>
            <select
              value={data.modelConfig?.inputSize || 224}
              onChange={(e) => handleConfigChange('inputSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={224}>224x224</option>
              <option value={299}>299x299</option>
              <option value={384}>384x384</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Number of Classes
            </label>
            <input
              type="number"
              min="2"
              max="1000"
              value={data.modelConfig?.numClasses || data.taskConfig?.numClasses || 10}
              onChange={(e) => handleConfigChange('numClasses', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pretrained Weights
            </label>
            <select
              value={data.modelConfig?.pretrained || 'imagenet'}
              onChange={(e) => handleConfigChange('pretrained', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="imagenet">ImageNet</option>
              <option value="none">None (Random)</option>
              <option value="custom">Custom Weights</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dropout Rate
            </label>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.1"
              value={data.modelConfig?.dropout || 0.3}
              onChange={(e) => handleConfigChange('dropout', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground mt-1">
              {data.modelConfig?.dropout || 0.3}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Hidden Layers
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={data.modelConfig?.hiddenLayers || 3}
            onChange={(e) => handleConfigChange('hiddenLayers', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Layer Size
          </label>
          <input
            type="number"
            min="32"
            max="2048"
            step="32"
            value={data.modelConfig?.layerSize || 128}
            onChange={(e) => handleConfigChange('layerSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    );
  };

  const architectures = getModelArchitectures();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Icon name={stepData.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stepData.title}</h3>
            <p className="text-muted-foreground">{stepData.description}</p>
          </div>
        </div>
      </div>

      {/* Model Architecture Selection */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-foreground mb-4">
          Choose Model Architecture
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {architectures.map((model) => {
            const isSelected = data.modelConfig?.architecture === model.id;
            
            return (
              <div
                key={model.id}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => handleModelSelect(model.id)}
              >
                {model.recommended && (
                  <div className="absolute -top-3 -right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg">
                      Recommended
                    </span>
                  </div>
                )}

                <div>
                  <h5 className="text-lg font-semibold text-foreground mb-2">{model.name}</h5>
                  <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Parameters</div>
                      <div className="text-sm font-semibold text-foreground">{model.params}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Speed</div>
                      <div className="text-sm font-semibold text-foreground">{model.speed}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">Accuracy</div>
                      <div className="text-sm font-semibold text-foreground">{model.accuracy}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Configuration */}
      {data.modelConfig?.architecture && (
        <div className="mb-8 p-6 bg-muted/30 rounded-2xl border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Settings" size={20} className="text-primary" />
            Model Configuration
          </h4>
          {getModelSpecificConfig()}
        </div>
      )}

      {/* Advanced Options */}
      <div className="p-6 bg-card border border-border rounded-2xl">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Sliders" size={20} className="text-primary" />
          Advanced Options
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mixed Precision Training
            </label>
            <select
              value={data.modelConfig?.mixedPrecision || 'auto'}
              onChange={(e) => handleConfigChange('mixedPrecision', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="auto">Auto</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Use 16-bit precision to speed up training and reduce memory usage
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Gradient Clipping
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={data.modelConfig?.gradientClip || 1.0}
              onChange={(e) => handleConfigChange('gradientClip', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Prevent exploding gradients (0 = disabled)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Label Smoothing
            </label>
            <input
              type="range"
              min="0.0"
              max="0.3"
              step="0.01"
              value={data.modelConfig?.labelSmoothing || 0.0}
              onChange={(e) => handleConfigChange('labelSmoothing', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {data.modelConfig?.labelSmoothing || 0.0} (prevents overfitting)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Weight Decay
            </label>
            <input
              type="number"
              min="0"
              max="0.1"
              step="0.001"
              value={data.modelConfig?.weightDecay || 0.001}
              onChange={(e) => handleConfigChange('weightDecay', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              L2 regularization strength
            </p>
          </div>
        </div>

        {/* Model Summary */}
        {data.modelConfig?.architecture && (
          <div className="mt-6 p-4 bg-background rounded-xl border border-border">
            <h5 className="font-semibold text-foreground mb-3">Configuration Summary</h5>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Architecture: <span className="text-foreground font-medium">{data.modelConfig.name}</span></div>
              <div>Task: <span className="text-foreground font-medium">{data.taskConfig?.title}</span></div>
              <div>Data Type: <span className="text-foreground font-medium capitalize">{data.dataType}</span></div>
              {data.modelConfig.imageSize && (
                <div>Input Size: <span className="text-foreground font-medium">{data.modelConfig.imageSize}x{data.modelConfig.imageSize}</span></div>
              )}
              {data.modelConfig.numClasses && (
                <div>Classes: <span className="text-foreground font-medium">{data.modelConfig.numClasses}</span></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelConfigurationStep;
