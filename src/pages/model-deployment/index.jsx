import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import DeploymentConfigPanel from './components/DeploymentConfigPanel';
import DeploymentStatusDashboard from './components/DeploymentStatusDashboard';
import DeploymentCard from './components/DeploymentCard';
import DeploymentHistory from './components/DeploymentHistory';
import APIDocumentationViewer from './components/APIDocumentationViewer';
import AIAssistantFAB from '../../components/AIAssistantFAB';

const ModelDeployment = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedModel, setSelectedModel] = useState(null);
  const [deployments, setDeployments] = useState([]);
  const [showDeploymentPanel, setShowDeploymentPanel] = useState(false);

  // Mock data for available models
  const availableModels = [
    {
      id: 'model-001',
      name: 'Customer Churn Prediction',
      version: 'v2.1.3',
      accuracy: 94.2,
      type: 'Classification',
      size: '45.2 MB',
      lastTrained: '2025-08-29T14:30:00Z'
    },
    {
      id: 'model-002',
      name: 'Sales Forecasting',
      version: 'v2.0.5',
      accuracy: 91.7,
      type: 'Regression',
      size: '32.8 MB',
      lastTrained: '2025-08-28T10:15:00Z'
    },
    {
      id: 'model-003',
      name: 'Image Classification',
      version: 'v1.5.2',
      accuracy: 96.8,
      type: 'CNN',
      size: '128.5 MB',
      lastTrained: '2025-08-27T16:45:00Z'
    }
  ];

  // Mock deployment data
  const mockDeployments = [
    {
      id: 'dep-001',
      name: 'Customer Churn API',
      modelName: 'Customer Churn Prediction',
      version: 'v2.1.3',
      status: 'running',
      description: 'Production deployment for customer churn prediction',
      endpoint: 'https://api.freemind.ai/v1/models/customer-churn',
      cloudProvider: 'AWS',
      region: 'us-east-1',
      instanceType: 'm5.large',
      instances: 3,
      autoScaling: true,
      startTime: '2025-08-30T06:00:00Z',
      lastUpdated: '2025-08-30T09:30:00Z',
      metrics: {
        requests: 1250,
        responseTime: 145,
        errorRate: 0.2
      },
      recentActivity: [
        { icon: 'TrendingUp', message: 'Auto-scaled to 3 instances', time: '10 min ago' },
        { icon: 'CheckCircle', message: 'Health check passed', time: '15 min ago' },
        { icon: 'RefreshCw', message: 'Model updated to v2.1.3', time: '2 hours ago' }
      ]
    },
    {
      id: 'dep-002',
      name: 'Sales Forecast API',
      modelName: 'Sales Forecasting',
      version: 'v2.0.5',
      status: 'running',
      description: 'Production deployment for sales forecasting',
      endpoint: 'https://api.freemind.ai/v1/models/sales-forecast',
      cloudProvider: 'GCP',
      region: 'us-west-2',
      instanceType: 'c5.xlarge',
      instances: 2,
      autoScaling: false,
      startTime: '2025-08-29T12:00:00Z',
      lastUpdated: '2025-08-30T08:45:00Z',
      metrics: {
        requests: 890,
        responseTime: 89,
        errorRate: 0.1
      },
      recentActivity: [
        { icon: 'CheckCircle', message: 'Health check passed', time: '5 min ago' },
        { icon: 'Activity', message: 'High traffic detected', time: '1 hour ago' }
      ]
    },
    {
      id: 'dep-003',
      name: 'Image Classifier API',
      modelName: 'Image Classification',
      version: 'v1.5.2',
      status: 'scaling',
      description: 'Production deployment for image classification',
      endpoint: 'https://api.freemind.ai/v1/models/image-classifier',
      cloudProvider: 'Azure',
      region: 'eu-west-1',
      instanceType: 'g4dn.xlarge',
      instances: 1,
      autoScaling: true,
      startTime: '2025-08-28T18:00:00Z',
      lastUpdated: '2025-08-30T09:40:00Z',
      metrics: {
        requests: 2100,
        responseTime: 234,
        errorRate: 0.3
      },
      recentActivity: [
        { icon: 'TrendingUp', message: 'Scaling up due to high demand', time: '2 min ago' },
        { icon: 'AlertTriangle', message: 'Response time threshold exceeded', time: '8 min ago' }
      ]
    }
  ];

  useEffect(() => {
    setDeployments(mockDeployments);
    if (mockDeployments?.length > 0) {
      setSelectedDeployment(mockDeployments?.[0]);
    }
  }, []);


  const handleDeploy = (config) => {
    const newDeployment = {
      id: `dep-${Date.now()}`,
      name: config?.apiName,
      modelName: selectedModel?.name || 'Unknown Model',
      version: selectedModel?.version || 'v1.0.0',
      status: 'deploying',
      description: config?.description,
      endpoint: `https://api.freemind.ai/v1/models/${config?.apiName}`,
      cloudProvider: config?.cloudProvider,
      region: config?.region,
      instanceType: config?.instanceType,
      instances: config?.minInstances,
      autoScaling: config?.scalingMode === 'auto',
      startTime: new Date()?.toISOString(),
      lastUpdated: new Date()?.toISOString(),
      metrics: {
        requests: 0,
        responseTime: 0,
        errorRate: 0
      },
      recentActivity: [
        { icon: 'Rocket', message: 'Deployment initiated', time: 'Just now' }
      ]
    };

    setDeployments(prev => [newDeployment, ...prev]);
    setShowDeploymentPanel(false);
    setActiveView('dashboard');
    
    // Simulate deployment progress
    setTimeout(() => {
      setDeployments(prev => 
        prev?.map(dep => 
          dep?.id === newDeployment?.id 
            ? { ...dep, status: 'running' }
            : dep
        )
      );
    }, 5000);
  };

  const handleScaleDeployment = (deploymentId) => {
    console.log('Scaling deployment:', deploymentId);
  };

  const handleUpdateDeployment = (deploymentId) => {
    console.log('Updating deployment:', deploymentId);
  };

  const handleStopDeployment = (deploymentId) => {
    setDeployments(prev => 
      prev?.map(dep => 
        dep?.id === deploymentId 
          ? { ...dep, status: 'stopped' }
          : dep
      )
    );
  };

  const handleViewLogs = (deploymentId) => {
    console.log('Viewing logs for deployment:', deploymentId);
  };

  const handleRollback = (deployment) => {
    console.log('Rolling back to deployment:', deployment);
  };

  const handleViewDetails = (deployment) => {
    setSelectedDeployment(deployment);
    setActiveView('documentation');
  };

  const viewOptions = [
    { value: 'dashboard', label: 'Dashboard Overview' },
    { value: 'deployments', label: 'Active Deployments' },
    { value: 'history', label: 'Deployment History' },
    { value: 'documentation', label: 'API Documentation' }
  ];

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DeploymentStatusDashboard deployments={deployments} />;
      
      case 'deployments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Active Deployments</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {deployments?.filter(d => d?.status === 'running')?.length} running
                </span>
                <Button
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setShowDeploymentPanel(true)}
                >
                  New Deployment
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {deployments?.map((deployment) => (
                <DeploymentCard
                  key={deployment?.id}
                  deployment={deployment}
                  onScale={handleScaleDeployment}
                  onUpdate={handleUpdateDeployment}
                  onStop={handleStopDeployment}
                  onViewLogs={handleViewLogs}
                />
              ))}
            </div>
          </div>
        );
      
      case 'history':
        return (
          <DeploymentHistory
            onRollback={handleRollback}
            onViewDetails={handleViewDetails}
          />
        );
      
      case 'documentation':
        return <APIDocumentationViewer selectedDeployment={selectedDeployment} />;
      
      default:
        return <DeploymentStatusDashboard deployments={deployments} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Model Deployment</h1>
              <p className="text-muted-foreground">
                Deploy, monitor, and manage your ML models in production
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                options={viewOptions}
                value={activeView}
                onChange={setActiveView}
                className="w-48"
              />
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6 elevation-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {deployments?.filter(d => d?.status === 'running')?.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Deployments</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 elevation-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Activity" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {deployments?.reduce((sum, d) => sum + d?.metrics?.requests, 0)?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 elevation-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(deployments?.reduce((sum, d) => sum + d?.metrics?.responseTime, 0) / deployments?.length)}ms
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 elevation-1">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {(deployments?.reduce((sum, d) => sum + d?.metrics?.errorRate, 0) / deployments?.length)?.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {renderMainContent()}
        </div>
      </main>
      {/* Deployment Configuration Panel Modal */}
      {showDeploymentPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-background border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden elevation-3 m-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Deploy New Model</h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowDeploymentPanel(false)}
              />
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Model Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Select Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableModels?.map((model) => (
                    <button
                      key={model?.id}
                      onClick={() => setSelectedModel(model)}
                      className={`p-4 border rounded-lg text-left transition-all duration-150 ${
                        selectedModel?.id === model?.id
                          ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                      }`}
                    >
                      <h4 className="font-semibold text-foreground mb-2">{model?.name}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Version: {model?.version}</p>
                        <p>Accuracy: {model?.accuracy}%</p>
                        <p>Type: {model?.type}</p>
                        <p>Size: {model?.size}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deployment Configuration */}
              {selectedModel && (
                <DeploymentConfigPanel
                  selectedModel={selectedModel}
                  onDeploy={handleDeploy}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant FAB */}
      <AIAssistantFAB />
    </div>
  );
};

export default ModelDeployment;
