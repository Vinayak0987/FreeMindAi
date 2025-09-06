import React from 'react';
import Icon from '../../AppIcon';

const TaskSelectionStep = ({ data, updateData, stepData }) => {
  const aiTasks = [
    {
      id: 'object-detection',
      title: 'Object Detection',
      description: 'Detect and locate objects in images using YOLOv8',
      icon: 'Eye',
      gradient: 'from-blue-500 to-cyan-500',
      popular: true,
      features: ['Real-time detection', 'Multiple object classes', 'Bounding box prediction'],
      supported: ['image', 'video']
    },
    {
      id: 'image-classification',
      title: 'Image Classification',
      description: 'Classify images into different categories',
      icon: 'Camera',
      gradient: 'from-purple-500 to-pink-500',
      popular: true,
      features: ['Multi-class prediction', 'Transfer learning', 'Data augmentation'],
      supported: ['image']
    },
    {
      id: 'text-classification',
      title: 'Text Classification',
      description: 'Classify text documents or perform sentiment analysis',
      icon: 'FileText',
      gradient: 'from-green-500 to-teal-500',
      features: ['Sentiment analysis', 'Topic classification', 'Intent detection'],
      supported: ['text']
    },
    {
      id: 'regression',
      title: 'Regression Analysis',
      description: 'Predict continuous numerical values',
      icon: 'TrendingUp',
      gradient: 'from-orange-500 to-red-500',
      features: ['Linear/Non-linear regression', 'Feature importance', 'Time series'],
      supported: ['tabular']
    },
    {
      id: 'clustering',
      title: 'Data Clustering',
      description: 'Group similar data points together',
      icon: 'GitBranch',
      gradient: 'from-indigo-500 to-purple-500',
      features: ['K-means clustering', 'Hierarchical clustering', 'DBSCAN'],
      supported: ['tabular', 'text']
    },
    {
      id: 'anomaly-detection',
      title: 'Anomaly Detection',
      description: 'Identify unusual patterns or outliers in data',
      icon: 'AlertTriangle',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Outlier detection', 'Fraud detection', 'Quality control'],
      supported: ['tabular', 'image', 'text']
    },
    {
      id: 'time-series',
      title: 'Time Series Forecasting',
      description: 'Predict future values based on historical data',
      icon: 'Clock',
      gradient: 'from-cyan-500 to-blue-500',
      features: ['LSTM networks', 'Seasonal patterns', 'Multi-step prediction'],
      supported: ['tabular']
    },
    {
      id: 'custom',
      title: 'Custom Task',
      description: 'Define your own custom AI/ML task',
      icon: 'Settings',
      gradient: 'from-gray-500 to-slate-600',
      features: ['Custom architecture', 'Flexible configuration', 'Advanced options'],
      supported: ['image', 'text', 'tabular', 'audio', 'video']
    }
  ];

  const isTaskSupported = (task) => {
    if (!data.dataType) return true;
    return task.supported.includes(data.dataType);
  };

  const handleTaskSelect = (taskId) => {
    const selectedTask = aiTasks.find(t => t.id === taskId);
    updateData({ 
      task: taskId,
      taskConfig: {
        title: selectedTask.title,
        description: selectedTask.description,
        features: selectedTask.features
      }
    });
  };

  const getTaskSpecificConfig = () => {
    if (!data.task) return null;

    switch (data.task) {
      case 'object-detection':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Model Type
              </label>
              <select 
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={data.taskConfig?.modelType || 'yolov8n'}
                onChange={(e) => updateData({
                  taskConfig: { ...data.taskConfig, modelType: e.target.value }
                })}
              >
                <option value="yolov8n">YOLOv8 Nano (Fast)</option>
                <option value="yolov8s">YOLOv8 Small (Balanced)</option>
                <option value="yolov8m">YOLOv8 Medium (Accurate)</option>
                <option value="yolov8l">YOLOv8 Large (High Accuracy)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confidence Threshold
              </label>
              <input
                type="number"
                min="0.1"
                max="1.0"
                step="0.1"
                value={data.taskConfig?.confidence || 0.5}
                onChange={(e) => updateData({
                  taskConfig: { ...data.taskConfig, confidence: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );
      
      case 'image-classification':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Number of Classes
              </label>
              <input
                type="number"
                min="2"
                max="1000"
                value={data.taskConfig?.numClasses || 10}
                onChange={(e) => updateData({
                  taskConfig: { ...data.taskConfig, numClasses: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Pre-trained Model
              </label>
              <select 
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                value={data.taskConfig?.pretrainedModel || 'resnet50'}
                onChange={(e) => updateData({
                  taskConfig: { ...data.taskConfig, pretrainedModel: e.target.value }
                })}
              >
                <option value="resnet50">ResNet-50</option>
                <option value="efficientnet">EfficientNet</option>
                <option value="mobilenet">MobileNet</option>
                <option value="vgg16">VGG-16</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Task Description
            </label>
            <textarea
              value={data.taskConfig?.customDescription || ''}
              onChange={(e) => updateData({
                taskConfig: { ...data.taskConfig, customDescription: e.target.value }
              })}
              placeholder="Describe your specific AI/ML task requirements..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        );
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Icon name={stepData.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stepData.title}</h3>
            <p className="text-muted-foreground">{stepData.description}</p>
          </div>
        </div>
      </div>

      {/* Task Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-4">
          Choose Your AI/ML Task *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {aiTasks.map((task) => {
            const isSupported = isTaskSupported(task);
            const isSelected = data.task === task.id;
            
            return (
              <div
                key={task.id}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-lg scale-[1.02]'
                    : isSupported
                    ? 'border-border hover:border-primary/50 hover:shadow-md hover:scale-[1.01]'
                    : 'border-border opacity-50 cursor-not-allowed'
                } ${!isSupported ? 'grayscale' : ''}`}
                onClick={() => isSupported && handleTaskSelect(task.id)}
              >
                {task.popular && (
                  <div className="absolute -top-3 -right-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${task.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={task.icon} size={24} color="white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground mb-2">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                    
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                        Key Features:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {task.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {!isSupported && (
                      <div className="mt-3 text-xs text-destructive">
                        Not compatible with {data.dataType} data type
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task-Specific Configuration */}
      {data.task && (
        <div className="p-6 bg-muted/30 rounded-2xl border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Settings" size={20} className="text-primary" />
            Task Configuration
          </h4>
          {getTaskSpecificConfig()}
        </div>
      )}
    </div>
  );
};

export default TaskSelectionStep;
