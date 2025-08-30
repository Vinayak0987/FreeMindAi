import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const DatasetProcessing = ({ dataset }) => {
  const [selectedOperations, setSelectedOperations] = useState([]);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [selectedColumns, setSelectedColumns] = useState([]);

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Icon name="Settings" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a dataset to configure processing</p>
        </div>
      </div>
    );
  }

  const processingOperations = [
    {
      id: 'missing_values',
      name: 'Handle Missing Values',
      description: 'Fill or remove missing data points',
      icon: 'AlertTriangle',
      options: [
        { value: 'drop', label: 'Drop rows with missing values' },
        { value: 'mean', label: 'Fill with mean (numeric)' },
        { value: 'median', label: 'Fill with median (numeric)' },
        { value: 'mode', label: 'Fill with mode (categorical)' },
        { value: 'forward', label: 'Forward fill' },
        { value: 'backward', label: 'Backward fill' }
      ]
    },
    {
      id: 'outliers',
      name: 'Outlier Detection',
      description: 'Identify and handle statistical outliers',
      icon: 'Target',
      options: [
        { value: 'iqr', label: 'IQR Method' },
        { value: 'zscore', label: 'Z-Score Method' },
        { value: 'isolation', label: 'Isolation Forest' },
        { value: 'remove', label: 'Remove outliers' },
        { value: 'cap', label: 'Cap outliers' }
      ]
    },
    {
      id: 'normalization',
      name: 'Data Normalization',
      description: 'Scale numerical features',
      icon: 'BarChart3',
      options: [
        { value: 'minmax', label: 'Min-Max Scaling (0-1)' },
        { value: 'standard', label: 'Standard Scaling (z-score)' },
        { value: 'robust', label: 'Robust Scaling' },
        { value: 'quantile', label: 'Quantile Transformation' }
      ]
    },
    {
      id: 'encoding',
      name: 'Categorical Encoding',
      description: 'Convert categorical variables to numerical',
      icon: 'Hash',
      options: [
        { value: 'onehot', label: 'One-Hot Encoding' },
        { value: 'label', label: 'Label Encoding' },
        { value: 'target', label: 'Target Encoding' },
        { value: 'binary', label: 'Binary Encoding' }
      ]
    },
    {
      id: 'feature_engineering',
      name: 'Feature Engineering',
      description: 'Create new features from existing data',
      icon: 'Sparkles',
      options: [
        { value: 'polynomial', label: 'Polynomial Features' },
        { value: 'interaction', label: 'Interaction Terms' },
        { value: 'binning', label: 'Feature Binning' },
        { value: 'datetime', label: 'DateTime Features' }
      ]
    },
    {
      id: 'dimensionality',
      name: 'Dimensionality Reduction',
      description: 'Reduce feature space complexity',
      icon: 'Minimize2',
      options: [
        { value: 'pca', label: 'Principal Component Analysis' },
        { value: 'lda', label: 'Linear Discriminant Analysis' },
        { value: 'tsne', label: 't-SNE' },
        { value: 'umap', label: 'UMAP' }
      ]
    }
  ];

  const columns = [
    { id: 'customer_id', name: 'Customer ID', type: 'categorical', missing: 0 },
    { id: 'age', name: 'Age', type: 'numeric', missing: 12 },
    { id: 'gender', name: 'Gender', type: 'categorical', missing: 5 },
    { id: 'income', name: 'Income', type: 'numeric', missing: 8 },
    { id: 'purchase_amount', name: 'Purchase Amount', type: 'numeric', missing: 3 },
    { id: 'category', name: 'Category', type: 'categorical', missing: 0 },
    { id: 'satisfaction', name: 'Satisfaction', type: 'numeric', missing: 15 },
    { id: 'churn', name: 'Churn', type: 'categorical', missing: 0 }
  ];

  const handleStartProcessing = () => {
    setProcessingStatus('processing');
    // Simulate processing
    setTimeout(() => {
      setProcessingStatus('completed');
    }, 3000);
  };

  const getColumnIcon = (type) => {
    switch (type) {
      case 'numeric': return 'Hash';
      case 'categorical': return 'Tag';
      case 'datetime': return 'Calendar';
      default: return 'Type';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-warning';
      case 'completed': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Processing Status */}
      {processingStatus !== 'idle' && (
        <div className={`bg-card border rounded-lg p-4 ${
          processingStatus === 'processing' ? 'border-warning' :
          processingStatus === 'completed' ? 'border-success' : 'border-error'
        }`}>
          <div className="flex items-center space-x-3">
            <Icon 
              name={processingStatus === 'processing' ? 'Loader' : 'CheckCircle'} 
              size={20} 
              className={`${getStatusColor(processingStatus)} ${
                processingStatus === 'processing' ? 'animate-spin' : ''
              }`}
            />
            <div>
              <h3 className="font-medium text-foreground">
                {processingStatus === 'processing' ? 'Processing Dataset...' : 'Processing Complete!'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {processingStatus === 'processing' ?'Applying selected transformations to your data' :'Your dataset has been successfully processed and is ready for training'
                }
              </p>
            </div>
          </div>
          {processingStatus === 'processing' && (
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Column Selection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Column Selection</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select columns to include in processing operations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {columns?.map((column) => (
            <div key={column?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Checkbox
                checked={selectedColumns?.includes(column?.id)}
                onChange={(checked) => {
                  if (checked) {
                    setSelectedColumns([...selectedColumns, column?.id]);
                  } else {
                    setSelectedColumns(selectedColumns?.filter(id => id !== column?.id));
                  }
                }}
              />
              <Icon name={getColumnIcon(column?.type)} size={16} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{column?.name}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className="capitalize">{column?.type}</span>
                  {column?.missing > 0 && (
                    <span className="text-warning">• {column?.missing} missing</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Processing Operations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Processing Operations</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select and configure data preprocessing operations
        </p>

        <div className="space-y-4">
          {processingOperations?.map((operation) => (
            <div key={operation?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedOperations?.includes(operation?.id)}
                    onChange={(checked) => {
                      if (checked) {
                        setSelectedOperations([...selectedOperations, operation?.id]);
                      } else {
                        setSelectedOperations(selectedOperations?.filter(id => id !== operation?.id));
                      }
                    }}
                  />
                  <Icon name={operation?.icon} size={20} className="text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">{operation?.name}</h4>
                    <p className="text-sm text-muted-foreground">{operation?.description}</p>
                  </div>
                </div>
              </div>

              {selectedOperations?.includes(operation?.id) && (
                <div className="ml-8 mt-3 animate-fade-in">
                  <Select
                    options={operation?.options}
                    placeholder={`Select ${operation?.name?.toLowerCase()} method`}
                    className="w-full max-w-md"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Processing Pipeline Preview */}
      {selectedOperations?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Processing Pipeline</h3>
          <div className="space-y-3">
            {selectedOperations?.map((operationId, index) => {
              const operation = processingOperations?.find(op => op?.id === operationId);
              return (
                <div key={operationId} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <Icon name={operation?.icon} size={16} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">{operation?.name}</span>
                  <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" iconName="Eye">
            Preview Changes
          </Button>
          <Button variant="outline" iconName="Save">
            Save Pipeline
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedOperations([]);
              setSelectedColumns([]);
              setProcessingStatus('idle');
            }}
          >
            Reset
          </Button>
          <Button 
            variant="default" 
            onClick={handleStartProcessing}
            disabled={selectedOperations?.length === 0 || processingStatus === 'processing'}
            loading={processingStatus === 'processing'}
            iconName="Play"
          >
            Start Processing
          </Button>
        </div>
      </div>
      {/* Processing History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Processing History</h3>
        <div className="space-y-3">
          {[
            { id: 1, name: 'Data Cleaning Pipeline', date: '2025-08-29', status: 'completed' },
            { id: 2, name: 'Feature Engineering', date: '2025-08-28', status: 'completed' },
            { id: 3, name: 'Normalization & Encoding', date: '2025-08-27', status: 'completed' }
          ]?.map((history) => (
            <div key={history?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">{history?.name}</p>
                  <p className="text-xs text-muted-foreground">Processed on {history?.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" iconName="Eye">
                  View
                </Button>
                <Button variant="ghost" size="sm" iconName="RotateCcw">
                  Revert
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatasetProcessing;