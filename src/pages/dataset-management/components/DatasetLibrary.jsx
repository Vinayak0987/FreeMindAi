import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DatasetLibrary = ({ selectedDataset, onDatasetSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const datasets = [
    {
      id: 1,
      name: "Customer Churn Analysis",
      type: "csv",
      size: "2.4 MB",
      rows: 10000,
      columns: 15,
      quality: 92,
      uploadDate: "2025-08-28",
      status: "processed",
      description: "Customer behavior data with churn indicators",
      tags: ["classification", "business", "customer"]
    },
    {
      id: 2,
      name: "Sales Forecasting Data",
      type: "csv",
      size: "5.1 MB",
      rows: 25000,
      columns: 8,
      quality: 88,
      uploadDate: "2025-08-27",
      status: "processing",
      description: "Historical sales data for time series analysis",
      tags: ["regression", "time-series", "sales"]
    },
    {
      id: 3,
      name: "Product Images Dataset",
      type: "image",
      size: "156 MB",
      rows: 5000,
      columns: 0,
      quality: 95,
      uploadDate: "2025-08-26",
      status: "processed",
      description: "E-commerce product images for classification",
      tags: ["computer-vision", "classification", "images"]
    },
    {
      id: 4,
      name: "Sentiment Analysis Reviews",
      type: "text",
      size: "12.3 MB",
      rows: 50000,
      columns: 3,
      quality: 85,
      uploadDate: "2025-08-25",
      status: "processed",
      description: "Customer reviews with sentiment labels",
      tags: ["nlp", "sentiment", "text"]
    },
    {
      id: 5,
      name: "Synthetic User Behavior",
      type: "csv",
      size: "3.7 MB",
      rows: 15000,
      columns: 12,
      quality: 98,
      uploadDate: "2025-08-24",
      status: "processed",
      description: "AI-generated user interaction patterns",
      tags: ["synthetic", "behavior", "classification"],
      isSynthetic: true
    }
  ];

  const publicDatasets = [
    {
      id: 'pub1',
      name: "Iris Flower Classification",
      type: "csv",
      size: "4 KB",
      rows: 150,
      columns: 5,
      quality: 100,
      description: "Classic machine learning dataset",
      tags: ["classification", "beginner", "flowers"],
      isPublic: true
    },
    {
      id: 'pub2',
      name: "Boston Housing Prices",
      type: "csv",
      size: "33 KB",
      rows: 506,
      columns: 14,
      quality: 95,
      description: "Housing price prediction dataset",
      tags: ["regression", "real-estate", "prices"],
      isPublic: true
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'csv', label: 'CSV Files' },
    { value: 'image', label: 'Images' },
    { value: 'text', label: 'Text Files' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'size', label: 'File Size' },
    { value: 'quality', label: 'Quality Score' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'text-success';
      case 'processing': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed': return 'CheckCircle';
      case 'processing': return 'Loader';
      case 'error': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'csv': return 'FileSpreadsheet';
      case 'image': return 'Image';
      case 'text': return 'FileText';
      default: return 'File';
    }
  };

  const filteredDatasets = [...datasets, ...publicDatasets]?.filter(dataset => {
    const matchesSearch = dataset?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         dataset?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesType = filterType === 'all' || dataset?.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Dataset Library</h2>
        
        {/* Search */}
        <Input
          type="search"
          placeholder="Search datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="mb-3"
        />

        {/* Filters */}
        <div className="space-y-2">
          <Select
            options={filterOptions}
            value={filterType}
            onChange={setFilterType}
            placeholder="Filter by type"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
        </div>
      </div>
      {/* Dataset List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDatasets?.map((dataset) => (
          <div
            key={dataset?.id}
            onClick={() => onDatasetSelect(dataset)}
            className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 hover:elevation-1 ${
              selectedDataset?.id === dataset?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon name={getTypeIcon(dataset?.type)} size={16} className="text-muted-foreground" />
                <h3 className="font-medium text-foreground text-sm truncate">{dataset?.name}</h3>
                {dataset?.isSynthetic && (
                  <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-xs rounded">AI</span>
                )}
                {dataset?.isPublic && (
                  <span className="px-1.5 py-0.5 bg-secondary/20 text-secondary text-xs rounded">Public</span>
                )}
              </div>
              <Icon 
                name={getStatusIcon(dataset?.status)} 
                size={14} 
                className={getStatusColor(dataset?.status)}
              />
            </div>

            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{dataset?.description}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{dataset?.size}</span>
              {dataset?.quality && (
                <span className="flex items-center space-x-1">
                  <Icon name="Star" size={12} />
                  <span>{dataset?.quality}%</span>
                </span>
              )}
            </div>

            {dataset?.rows > 0 && (
              <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                <span>{dataset?.rows?.toLocaleString()} rows</span>
                {dataset?.columns > 0 && <span>{dataset?.columns} cols</span>}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {dataset?.tags?.slice(0, 2)?.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                  {tag}
                </span>
              ))}
              {dataset?.tags?.length > 2 && (
                <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                  +{dataset?.tags?.length - 2}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" fullWidth iconName="Plus" iconPosition="left">
          Upload Dataset
        </Button>
        <Button variant="ghost" fullWidth iconName="Sparkles" iconPosition="left">
          Generate Synthetic
        </Button>
      </div>
    </div>
  );
};

export default DatasetLibrary;