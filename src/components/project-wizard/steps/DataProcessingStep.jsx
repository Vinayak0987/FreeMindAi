import React, { useState } from 'react';
import Icon from '../../AppIcon';
import Button from '../../ui/Button';
import apiService from '../../../utils/api';

const DataProcessingStep = ({ data, updateData, stepData }) => {
  const [processing, setProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState(null);

  const preprocessingOptions = [
    {
      id: 'normalize',
      title: 'Data Normalization',
      description: 'Scale data to standard range',
      icon: 'BarChart3',
      enabled: true,
      config: {
        method: 'minmax',
        range: [0, 1]
      }
    },
    {
      id: 'augmentation',
      title: 'Data Augmentation',
      description: 'Increase dataset size with transformations',
      icon: 'Shuffle',
      enabled: false,
      config: {
        rotation: true,
        flip: true,
        zoom: true,
        brightness: true
      }
    },
    {
      id: 'cleaning',
      title: 'Data Cleaning',
      description: 'Remove duplicates and handle missing values',
      icon: 'Filter',
      enabled: true,
      config: {
        removeDuplicates: true,
        fillMissing: 'mean',
        outlierRemoval: false
      }
    },
    {
      id: 'splitting',
      title: 'Data Splitting',
      description: 'Split data into train/validation/test sets',
      icon: 'GitBranch',
      enabled: true,
      config: {
        trainRatio: 0.7,
        validationRatio: 0.2,
        testRatio: 0.1,
        stratify: true
      }
    }
  ];

  const handleOptionToggle = (optionId) => {
    const currentOptions = data.preprocessing?.options || [];
    const updatedOptions = currentOptions.some(opt => opt.id === optionId)
      ? currentOptions.filter(opt => opt.id !== optionId)
      : [...currentOptions, preprocessingOptions.find(opt => opt.id === optionId)];
    
    updateData({
      preprocessing: {
        ...data.preprocessing,
        options: updatedOptions
      }
    });
  };

  const handleConfigChange = (optionId, configKey, value) => {
    const currentOptions = data.preprocessing?.options || [];
    const updatedOptions = currentOptions.map(opt => 
      opt.id === optionId 
        ? { ...opt, config: { ...opt.config, [configKey]: value }}
        : opt
    );
    
    updateData({
      preprocessing: {
        ...data.preprocessing,
        options: updatedOptions
      }
    });
  };

  const handleProcessData = async () => {
    if (!data.datasets || data.datasets.length === 0) {
      alert('Please upload datasets first');
      return;
    }

    setProcessing(true);
    try {
      const formData = new FormData();
      
      // Add dataset files
      data.datasets.forEach((dataset, index) => {
        if (dataset.file) {
          formData.append(`dataset_${index}`, dataset.file);
        }
      });

      // Add preprocessing configuration
      formData.append('preprocessing_config', JSON.stringify({
        dataType: data.dataType,
        task: data.task,
        options: data.preprocessing?.options || [],
        customConfig: data.preprocessing?.customConfig || {}
      }));

      const response = await apiService.nebula.processDataset(formData);
      const results = response.data;

      setProcessingResults(results);
      updateData({
        preprocessing: {
          ...data.preprocessing,
          processed: true,
          results: results,
          processedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Data processing failed:', error);
      alert('Data processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const isOptionEnabled = (optionId) => {
    const currentOptions = data.preprocessing?.options || [];
    return currentOptions.some(opt => opt.id === optionId);
  };

  const getOptionConfig = (optionId) => {
    const currentOptions = data.preprocessing?.options || [];
    const option = currentOptions.find(opt => opt.id === optionId);
    return option?.config || preprocessingOptions.find(opt => opt.id === optionId)?.config || {};
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Icon name={stepData.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stepData.title}</h3>
            <p className="text-muted-foreground">{stepData.description}</p>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="mb-8 p-6 bg-card border border-border rounded-2xl">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Database" size={20} className="text-primary" />
          Data Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-xl">
            <div className="text-sm text-muted-foreground">Data Type</div>
            <div className="text-lg font-semibold text-foreground capitalize">{data.dataType || 'Not selected'}</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl">
            <div className="text-sm text-muted-foreground">Datasets</div>
            <div className="text-lg font-semibold text-foreground">{data.datasets?.length || 0} files</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-xl">
            <div className="text-sm text-muted-foreground">Task</div>
            <div className="text-lg font-semibold text-foreground">{data.taskConfig?.title || 'Not selected'}</div>
          </div>
        </div>
      </div>

      {/* Preprocessing Options */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-foreground mb-4">
          Preprocessing Options
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {preprocessingOptions.map((option) => {
            const isEnabled = isOptionEnabled(option.id);
            const config = getOptionConfig(option.id);
            
            return (
              <div key={option.id} className="p-6 bg-card border border-border rounded-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name={option.icon} size={18} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{option.title}</h5>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOptionToggle(option.id)}
                    className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      isEnabled ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                      isEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {isEnabled && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    {option.id === 'normalize' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Method</label>
                          <select
                            value={config.method}
                            onChange={(e) => handleConfigChange(option.id, 'method', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                          >
                            <option value="minmax">Min-Max</option>
                            <option value="zscore">Z-Score</option>
                            <option value="robust">Robust</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {option.id === 'augmentation' && (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.keys(config).map(key => (
                          <label key={key} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={config[key]}
                              onChange={(e) => handleConfigChange(option.id, key, e.target.checked)}
                              className="rounded"
                            />
                            <span className="text-sm text-foreground capitalize">{key}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {option.id === 'splitting' && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Train</label>
                          <input
                            type="number"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={config.trainRatio}
                            onChange={(e) => handleConfigChange(option.id, 'trainRatio', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Validation</label>
                          <input
                            type="number"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={config.validationRatio}
                            onChange={(e) => handleConfigChange(option.id, 'validationRatio', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Test</label>
                          <input
                            type="number"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={config.testRatio}
                            onChange={(e) => handleConfigChange(option.id, 'testRatio', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Process Data Button */}
      <div className="mb-8 p-6 bg-muted/30 rounded-2xl border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Ready to Process</h4>
            <p className="text-sm text-muted-foreground">
              Apply selected preprocessing steps to your dataset
            </p>
          </div>
          <Button
            onClick={handleProcessData}
            disabled={processing || !data.datasets || data.datasets.length === 0}
            iconName={processing ? "Loader2" : "Play"}
            iconPosition="left"
            className={processing ? "animate-spin" : ""}
          >
            {processing ? 'Processing...' : 'Process Data'}
          </Button>
        </div>
      </div>

      {/* Processing Results */}
      {processingResults && (
        <div className="p-6 bg-card border border-border rounded-2xl">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="CheckCircle" size={20} className="text-green-500" />
            Processing Complete
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-sm text-green-600">Total Samples</div>
              <div className="text-xl font-bold text-green-700">{processingResults.totalSamples || 'N/A'}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-sm text-blue-600">Features</div>
              <div className="text-xl font-bold text-blue-700">{processingResults.features || 'N/A'}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-sm text-purple-600">Data Quality</div>
              <div className="text-xl font-bold text-purple-700">{processingResults.quality || 'Good'}</div>
            </div>
          </div>
          
          {processingResults.warnings && processingResults.warnings.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="text-sm font-medium text-yellow-700 mb-2">Warnings:</div>
              <ul className="text-sm text-yellow-600 space-y-1">
                {processingResults.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataProcessingStep;
