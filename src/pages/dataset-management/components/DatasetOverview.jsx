import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DatasetOverview = ({ dataset }) => {
  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Icon name="Database" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a dataset to view details</p>
        </div>
      </div>
    );
  }

  const statisticalSummary = {
    totalRecords: dataset?.rows,
    totalColumns: dataset?.columns,
    missingValues: Math.floor(dataset?.rows * 0.03),
    duplicateRows: Math.floor(dataset?.rows * 0.01),
    dataTypes: {
      numeric: Math.floor(dataset?.columns * 0.6),
      categorical: Math.floor(dataset?.columns * 0.3),
      datetime: Math.floor(dataset?.columns * 0.1)
    }
  };

  const qualityMetrics = [
    { label: 'Completeness', value: 97, color: 'text-success' },
    { label: 'Consistency', value: 94, color: 'text-success' },
    { label: 'Accuracy', value: 89, color: 'text-warning' },
    { label: 'Validity', value: 92, color: 'text-success' }
  ];

  const insights = [
    {
      type: 'info',
      title: 'Data Distribution',
      message: 'Dataset shows balanced distribution across target classes with minimal skewness detected.'
    },
    {
      type: 'warning',
      title: 'Missing Values',
      message: `${statisticalSummary?.missingValues} missing values found in 3 columns. Consider imputation strategies.`
    },
    {
      type: 'success',
      title: 'Feature Quality',
      message: 'High correlation detected between features. Feature selection recommended for optimal performance.'
    },
    {
      type: 'info',
      title: 'Outlier Detection',
      message: '2.3% outliers identified in numerical columns. Review for data cleaning opportunities.'
    }
  ];

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      default: return 'Info';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-accent';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dataset Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{dataset?.name}</h2>
          <p className="text-muted-foreground mt-1">{dataset?.description}</p>
          <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>Uploaded {dataset?.uploadDate}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="HardDrive" size={16} />
              <span>{dataset?.size}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="Star" size={16} />
              <span>{dataset?.quality}% Quality</span>
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" iconName="Download">
            Export
          </Button>
          <Button variant="default" iconName="Play">
            Start Training
          </Button>
        </div>
      </div>
      {/* Statistical Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold text-foreground">{statisticalSummary?.totalRecords?.toLocaleString()}</p>
            </div>
            <Icon name="Database" size={24} className="text-primary" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Columns</p>
              <p className="text-2xl font-bold text-foreground">{statisticalSummary?.totalColumns}</p>
            </div>
            <Icon name="Columns" size={24} className="text-accent" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Missing Values</p>
              <p className="text-2xl font-bold text-warning">{statisticalSummary?.missingValues}</p>
            </div>
            <Icon name="AlertTriangle" size={24} className="text-warning" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Duplicates</p>
              <p className="text-2xl font-bold text-error">{statisticalSummary?.duplicateRows}</p>
            </div>
            <Icon name="Copy" size={24} className="text-error" />
          </div>
        </div>
      </div>
      {/* Data Types Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Types Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Hash" size={24} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{statisticalSummary?.dataTypes?.numeric}</p>
            <p className="text-sm text-muted-foreground">Numeric</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Tag" size={24} className="text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">{statisticalSummary?.dataTypes?.categorical}</p>
            <p className="text-sm text-muted-foreground">Categorical</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Icon name="Calendar" size={24} className="text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{statisticalSummary?.dataTypes?.datetime}</p>
            <p className="text-sm text-muted-foreground">DateTime</p>
          </div>
        </div>
      </div>
      {/* Quality Metrics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Quality Assessment</h3>
        <div className="space-y-4">
          {qualityMetrics?.map((metric) => (
            <div key={metric?.label} className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{metric?.label}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric?.value >= 90 ? 'bg-success' : 
                      metric?.value >= 70 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${metric?.value}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${metric?.color}`}>{metric?.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* AI Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">AI-Generated Insights</h3>
        <div className="space-y-3">
          {insights?.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
              <Icon 
                name={getInsightIcon(insight?.type)} 
                size={20} 
                className={getInsightColor(insight?.type)}
              />
              <div className="flex-1">
                <h4 className="font-medium text-foreground text-sm">{insight?.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{insight?.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DatasetOverview;