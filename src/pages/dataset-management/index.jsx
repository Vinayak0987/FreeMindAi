import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DatasetLibrary from './components/DatasetLibrary';
import DatasetOverview from './components/DatasetOverview';
import DatasetPreview from './components/DatasetPreview';
import DatasetVisualization from './components/DatasetVisualization';
import DatasetProcessing from './components/DatasetProcessing';
import UploadZone from './components/UploadZone';
import AIAssistantFAB from '../../components/AIAssistantFAB';

const DatasetManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploadZoneVisible, setIsUploadZoneVisible] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'preview', label: 'Preview', icon: 'Table' },
    { id: 'visualization', label: 'Visualization', icon: 'PieChart' },
    { id: 'processing', label: 'Processing', icon: 'Settings' }
  ];

  const handleDatasetSelect = (dataset) => {
    setSelectedDataset(dataset);
    setActiveTab('overview');
  };

  const handleUpload = (files) => {
    console.log('Files uploaded:', files);
    setIsUploadZoneVisible(false);
    // Handle uploaded files here
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DatasetOverview dataset={selectedDataset} />;
      case 'preview':
        return <DatasetPreview dataset={selectedDataset} />;
      case 'visualization':
        return <DatasetVisualization dataset={selectedDataset} />;
      case 'processing':
        return <DatasetProcessing dataset={selectedDataset} />;
      default:
        return <DatasetOverview dataset={selectedDataset} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Panel - Dataset Library */}
          <div className="w-80 border-r border-border bg-card">
            <DatasetLibrary 
              selectedDataset={selectedDataset}
              onDatasetSelect={handleDatasetSelect}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-background">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-foreground">Dataset Management</h1>
                {selectedDataset && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Database" size={16} />
                    <span>{selectedDataset?.name}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  iconName="Upload"
                  onClick={() => setIsUploadZoneVisible(true)}
                >
                  Upload Dataset
                </Button>
                <Button variant="outline" iconName="Download">
                  Batch Export
                </Button>
                <Button variant="default" iconName="Sparkles">
                  Generate Synthetic
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            {selectedDataset && (
              <div className="flex items-center space-x-1 p-4 border-b border-border bg-card">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground elevation-1'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedDataset ? (
                renderTabContent()
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon name="Database" size={48} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                      Welcome to Dataset Management
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Upload, explore, and prepare your data for machine learning. 
                      Select a dataset from the library or upload new data to get started.
                    </p>
                    <div className="flex items-center justify-center space-x-3">
                      <Button 
                        variant="default" 
                        iconName="Upload"
                        onClick={() => setIsUploadZoneVisible(true)}
                      >
                        Upload Dataset
                      </Button>
                      <Button variant="outline" iconName="Sparkles">
                        Generate Synthetic Data
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Upload Zone Modal */}
      <UploadZone
        isVisible={isUploadZoneVisible}
        onClose={() => setIsUploadZoneVisible(false)}
        onUpload={handleUpload}
      />

      {/* AI Assistant FAB */}
      <AIAssistantFAB />
    </div>
  );
};

export default DatasetManagement;