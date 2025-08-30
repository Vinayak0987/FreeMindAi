import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const DatasetPreview = ({ datasets }) => {
  const [selectedDataset, setSelectedDataset] = useState(datasets?.[0]);
  const navigate = useNavigate();

  const datasetStats = {
    totalRows: 125847,
    totalColumns: 23,
    missingValues: 342,
    duplicates: 15,
    dataTypes: {
      numerical: 12,
      categorical: 8,
      datetime: 2,
      text: 1
    }
  };

  const sampleData = [
    { id: 1, customer_id: 'C001', age: 34, income: 65000, category: 'Premium', last_purchase: '2024-08-25', status: 'Active' },
    { id: 2, customer_id: 'C002', age: 28, income: 45000, category: 'Standard', last_purchase: '2024-08-20', status: 'Active' },
    { id: 3, customer_id: 'C003', age: 42, income: 85000, category: 'Premium', last_purchase: '2024-08-28', status: 'Inactive' },
    { id: 4, customer_id: 'C004', age: 31, income: 55000, category: 'Standard', last_purchase: '2024-08-15', status: 'Active' },
    { id: 5, customer_id: 'C005', age: 39, income: 72000, category: 'Premium', last_purchase: '2024-08-22', status: 'Active' }
  ];

  const getDatasetIcon = (type) => {
    switch (type) {
      case 'csv': return 'FileText';
      case 'image': return 'Image';
      case 'text': return 'FileText';
      case 'json': return 'Braces';
      default: return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'text-success bg-success/10';
      case 'processing': return 'text-warning bg-warning/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Dataset Selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Dataset Preview</h2>
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={() => navigate('/dataset-management')}
        >
          Add Dataset
        </Button>
      </div>
      {/* Dataset Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {datasets?.map((dataset) => (
          <button
            key={dataset?.id}
            onClick={() => setSelectedDataset(dataset)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              selectedDataset?.id === dataset?.id
                ? 'bg-card text-foreground elevation-1'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={getDatasetIcon(dataset?.type)} size={16} />
            <span>{dataset?.name}</span>
            <div className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(dataset?.status)}`}>
              {dataset?.status}
            </div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Dataset Stats */}
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-4">Dataset Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Rows</span>
              <span className="text-sm font-medium text-foreground">{datasetStats?.totalRows?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Columns</span>
              <span className="text-sm font-medium text-foreground">{datasetStats?.totalColumns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Missing Values</span>
              <span className="text-sm font-medium text-warning">{datasetStats?.missingValues}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Duplicates</span>
              <span className="text-sm font-medium text-error">{datasetStats?.duplicates}</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Data Types</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Numerical</span>
                <span className="text-xs font-medium text-foreground">{datasetStats?.dataTypes?.numerical}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Categorical</span>
                <span className="text-xs font-medium text-foreground">{datasetStats?.dataTypes?.categorical}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">DateTime</span>
                <span className="text-xs font-medium text-foreground">{datasetStats?.dataTypes?.datetime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Text</span>
                <span className="text-xs font-medium text-foreground">{datasetStats?.dataTypes?.text}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button variant="outline" fullWidth iconName="Eye" iconPosition="left">
              View Details
            </Button>
            <Button variant="ghost" fullWidth iconName="Download" iconPosition="left">
              Download
            </Button>
          </div>
        </div>

        {/* Data Preview */}
        <div className="lg:col-span-3 bg-card border border-border rounded-lg p-6 elevation-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" iconName="RefreshCw">
                Refresh
              </Button>
              <Button variant="ghost" size="sm" iconName="Settings">
                Configure
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {Object.keys(sampleData?.[0])?.map((column) => (
                    <th key={column} className="text-left py-3 px-4 font-medium text-muted-foreground">
                      {column?.replace('_', ' ')?.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData?.map((row) => (
                  <tr key={row?.id} className="border-b border-border hover:bg-muted/50 transition-colors duration-150">
                    {Object.values(row)?.map((value, index) => (
                      <td key={index} className="py-3 px-4 text-foreground">
                        {typeof value === 'string' && value?.includes('2024') ? (
                          <span className="text-accent">{value}</span>
                        ) : typeof value === 'number' ? (
                          <span className="font-mono">{value?.toLocaleString()}</span>
                        ) : value === 'Active' ? (
                          <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs">
                            {value}
                          </span>
                        ) : value === 'Inactive' ? (
                          <span className="px-2 py-1 bg-error/10 text-error rounded-full text-xs">
                            {value}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing 5 of {datasetStats?.totalRows?.toLocaleString()} rows
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" iconName="ChevronLeft">
                Previous
              </Button>
              <Button variant="ghost" size="sm" iconName="ChevronRight">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Data Quality Insights */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Quality Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-success/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">Good Quality</span>
            </div>
            <p className="text-xs text-muted-foreground">
              97.3% of data is clean and ready for training
            </p>
          </div>
          <div className="p-4 bg-warning/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Minor Issues</span>
            </div>
            <p className="text-xs text-muted-foreground">
              342 missing values detected in 3 columns
            </p>
          </div>
          <div className="p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Sparkles" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">AI Recommendation</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Consider feature scaling for numerical columns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetPreview;