import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const TrainingConfigPanel = ({ onStartTraining, isTraining }) => {
  const [selectedTask, setSelectedTask] = useState('classification');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [hyperparameterConfig, setHyperparameterConfig] = useState({
    learningRate: '0.001',
    batchSize: '32',
    epochs: '100',
    validationSplit: '0.2'
  });
  const [advancedSettings, setAdvancedSettings] = useState({
    crossValidation: true,
    earlyStoppingEnabled: true,
    autoFeatureEngineering: true,
    ensembleMethods: false
  });
  const [expandedSections, setExpandedSections] = useState({
    taskConfig: true,
    hyperparameters: false,
    advanced: false
  });

  const taskOptions = [
    { value: 'classification', label: 'Classification', description: 'Predict categories or classes' },
    { value: 'regression', label: 'Regression', description: 'Predict continuous values' },
    { value: 'nlp', label: 'Natural Language Processing', description: 'Text analysis and processing' },
    { value: 'computer_vision', label: 'Computer Vision', description: 'Image recognition and analysis' },
    { value: 'time_series', label: 'Time Series', description: 'Sequential data prediction' }
  ];

  const modelOptions = [
    { value: 'auto', label: 'Auto Select (Recommended)', description: 'AI will choose the best model' },
    { value: 'random_forest', label: 'Random Forest', description: 'Ensemble tree-based method' },
    { value: 'xgboost', label: 'XGBoost', description: 'Gradient boosting framework' },
    { value: 'neural_network', label: 'Neural Network', description: 'Deep learning approach' },
    { value: 'svm', label: 'Support Vector Machine', description: 'Kernel-based method' },
    { value: 'linear_regression', label: 'Linear Regression', description: 'Simple linear approach' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleHyperparameterChange = (field, value) => {
    setHyperparameterConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdvancedSettingChange = (setting, checked) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [setting]: checked
    }));
  };

  const handleStartTraining = () => {
    const config = {
      task: selectedTask,
      model: selectedModel,
      hyperparameters: hyperparameterConfig,
      advanced: advancedSettings
    };
    onStartTraining(config);
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Training Configuration</h2>
              <p className="text-sm text-muted-foreground">Configure your ML training pipeline</p>
            </div>
          </div>
          <Button
            variant={isTraining ? "destructive" : "default"}
            onClick={handleStartTraining}
            disabled={isTraining}
            loading={isTraining}
            iconName={isTraining ? "Square" : "Play"}
            iconPosition="left"
          >
            {isTraining ? 'Stop Training' : 'Start Training'}
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        {/* Task Configuration */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('taskConfig')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-md font-medium text-foreground">Task Configuration</h3>
            <Icon 
              name={expandedSections?.taskConfig ? "ChevronDown" : "ChevronRight"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>
          
          {expandedSections?.taskConfig && (
            <div className="space-y-4 pl-4 border-l-2 border-border animate-fade-in">
              <Select
                label="ML Task Type"
                description="Automatically detected based on your dataset"
                options={taskOptions}
                value={selectedTask}
                onChange={setSelectedTask}
                searchable
              />
              
              <Select
                label="Model Selection"
                description="Choose specific model or let AI decide"
                options={modelOptions}
                value={selectedModel}
                onChange={setSelectedModel}
                searchable
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Target Column"
                  type="text"
                  placeholder="e.g., price, category"
                  description="Column to predict"
                />
                <Input
                  label="Feature Columns"
                  type="text"
                  placeholder="Auto-detected"
                  description="Input features"
                  disabled
                />
              </div>
            </div>
          )}
        </div>

        {/* Hyperparameter Tuning */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('hyperparameters')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-md font-medium text-foreground">Hyperparameter Tuning</h3>
            <Icon 
              name={expandedSections?.hyperparameters ? "ChevronDown" : "ChevronRight"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>
          
          {expandedSections?.hyperparameters && (
            <div className="space-y-4 pl-4 border-l-2 border-border animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Learning Rate"
                  type="number"
                  value={hyperparameterConfig?.learningRate}
                  onChange={(e) => handleHyperparameterChange('learningRate', e?.target?.value)}
                  placeholder="0.001"
                  description="Step size for optimization"
                />
                <Input
                  label="Batch Size"
                  type="number"
                  value={hyperparameterConfig?.batchSize}
                  onChange={(e) => handleHyperparameterChange('batchSize', e?.target?.value)}
                  placeholder="32"
                  description="Samples per training batch"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Max Epochs"
                  type="number"
                  value={hyperparameterConfig?.epochs}
                  onChange={(e) => handleHyperparameterChange('epochs', e?.target?.value)}
                  placeholder="100"
                  description="Maximum training iterations"
                />
                <Input
                  label="Validation Split"
                  type="number"
                  value={hyperparameterConfig?.validationSplit}
                  onChange={(e) => handleHyperparameterChange('validationSplit', e?.target?.value)}
                  placeholder="0.2"
                  description="Fraction for validation"
                />
              </div>
            </div>
          )}
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <button
            onClick={() => toggleSection('advanced')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-md font-medium text-foreground">Advanced Settings</h3>
            <Icon 
              name={expandedSections?.advanced ? "ChevronDown" : "ChevronRight"} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>
          
          {expandedSections?.advanced && (
            <div className="space-y-4 pl-4 border-l-2 border-border animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <Checkbox
                  label="Cross Validation"
                  description="K-fold validation for robust evaluation"
                  checked={advancedSettings?.crossValidation}
                  onChange={(e) => handleAdvancedSettingChange('crossValidation', e?.target?.checked)}
                />
                <Checkbox
                  label="Early Stopping"
                  description="Stop training when performance plateaus"
                  checked={advancedSettings?.earlyStoppingEnabled}
                  onChange={(e) => handleAdvancedSettingChange('earlyStoppingEnabled', e?.target?.checked)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Checkbox
                  label="Auto Feature Engineering"
                  description="Automatically create new features"
                  checked={advancedSettings?.autoFeatureEngineering}
                  onChange={(e) => handleAdvancedSettingChange('autoFeatureEngineering', e?.target?.checked)}
                />
                <Checkbox
                  label="Ensemble Methods"
                  description="Combine multiple models"
                  checked={advancedSettings?.ensembleMethods}
                  onChange={(e) => handleAdvancedSettingChange('ensembleMethods', e?.target?.checked)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingConfigPanel;