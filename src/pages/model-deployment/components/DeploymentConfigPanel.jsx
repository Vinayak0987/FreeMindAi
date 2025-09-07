import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeploymentConfigPanel = ({ onDeploy, selectedModel }) => {
  const [currentStep, setCurrentStep] = useState(0); // Start with platform selection
  const [config, setConfig] = useState({
    platform: '',
    cloudProvider: '',
    region: '',
    instanceType: '',
    scalingMode: '',
    minInstances: 1,
    maxInstances: 10,
    apiName: '',
    serviceName: '',
    environment: 'development',
    taskType: 'classification',
    dataType: 'tabular',
    description: ''
  });
  const [isDeploying, setIsDeploying] = useState(false);

  // Local deployment handler
  const handleLocalDeployment = async () => {
    setIsDeploying(true);
    try {
      const deploymentData = {
        platform: 'local',
        serviceName: config.serviceName || selectedModel?.name?.toLowerCase().replace(/\s+/g, '-') || 'ml-model',
        environment: config.environment,
        taskType: config.taskType,
        dataType: config.dataType,
        modelConfig: {
          name: selectedModel?.name,
          version: selectedModel?.version,
          type: selectedModel?.type,
          accuracy: selectedModel?.accuracy
        },
        deploymentConfig: {
          autoScaling: false // Not applicable for local
        }
      };

      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deploymentData)
      });

      if (response.ok) {
        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${deploymentData.serviceName}-local-deployment.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Notify parent component
        onDeploy({ 
          ...deploymentData, 
          status: 'downloaded',
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Local deployment failed:', error);
      alert('Failed to generate deployment package. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  const deploymentPlatforms = [
    { value: 'local', label: 'Local Development', icon: 'Monitor', description: 'Download project package for local deployment' },
    { value: 'aws', label: 'Amazon Web Services', icon: 'Cloud', description: 'Deploy to AWS cloud infrastructure' },
    { value: 'gcp', label: 'Google Cloud Platform', icon: 'Cloud', description: 'Deploy to Google Cloud Platform' },
    { value: 'azure', label: 'Microsoft Azure', icon: 'Cloud', description: 'Deploy to Microsoft Azure' },
    { value: 'freemind', label: 'FreeMind Cloud', icon: 'Zap', description: 'Deploy to FreeMind managed cloud' }
  ];
  
  const cloudProviders = deploymentPlatforms.filter(p => p.value !== 'local');

  const regions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' }
  ];

  const instanceTypes = [
    { value: 't3.micro', label: 't3.micro (1 vCPU, 1 GB RAM) - $0.0104/hour' },
    { value: 't3.small', label: 't3.small (2 vCPU, 2 GB RAM) - $0.0208/hour' },
    { value: 'm5.large', label: 'm5.large (2 vCPU, 8 GB RAM) - $0.096/hour' },
    { value: 'c5.xlarge', label: 'c5.xlarge (4 vCPU, 8 GB RAM) - $0.17/hour' }
  ];

  const scalingModes = [
    { value: 'fixed', label: 'Fixed Instances' },
    { value: 'auto', label: 'Auto Scaling' },
    { value: 'serverless', label: 'Serverless' }
  ];

  const steps = [
    { id: 1, title: 'Cloud Provider', icon: 'Cloud' },
    { id: 2, title: 'Configuration', icon: 'Settings' },
    { id: 3, title: 'Scaling', icon: 'TrendingUp' },
    { id: 4, title: 'Review', icon: 'CheckCircle' }
  ];

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDeploy = () => {
    onDeploy({
      ...config,
      modelId: selectedModel?.id,
      timestamp: new Date()?.toISOString()
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return config?.cloudProvider && config?.region;
      case 2:
        return config?.instanceType && config?.apiName;
      case 3:
        return config?.scalingMode;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Platform selection
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">Choose Deployment Platform</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deploymentPlatforms.map((platform) => {
                  const isSelected = config.platform === platform.value;
                  return (
                    <div
                      key={platform.value}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-border hover:border-primary/50 hover:shadow-md'
                      }`}
                      onClick={() => handleInputChange('platform', platform.value)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon name={platform.icon} size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground mb-2">{platform.label}</h4>
                          <p className="text-sm text-muted-foreground">{platform.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {config.platform && config.platform !== 'local' && (
              <div className="mt-6 text-center">
                <Button
                  onClick={() => setCurrentStep(1)}
                  iconName="ChevronRight"
                  iconPosition="right"
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue with {deploymentPlatforms.find(p => p.value === config.platform)?.label}
                </Button>
              </div>
            )}
            
            {config.platform === 'local' && (
              <div className="mt-6 p-6 bg-muted/30 rounded-2xl border border-border">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Settings" size={20} className="text-primary" />
                  Local Deployment Configuration
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Service Name"
                      type="text"
                      value={config.serviceName || selectedModel?.name?.toLowerCase().replace(/\s+/g, '-') || 'ml-model'}
                      onChange={(e) => handleInputChange('serviceName', e.target.value)}
                      placeholder="my-awesome-model"
                      description="Name for your local deployment package"
                    />
                  </div>
                  
                  <div>
                    <Select
                      label="Environment"
                      options={[
                        { value: 'development', label: 'Development' },
                        { value: 'staging', label: 'Staging' },
                        { value: 'production', label: 'Production' }
                      ]}
                      value={config.environment}
                      onChange={(value) => handleInputChange('environment', value)}
                    />
                  </div>
                  
                  <div>
                    <Select
                      label="Task Type"
                      options={[
                        { value: 'classification', label: 'Classification' },
                        { value: 'regression', label: 'Regression' },
                        { value: 'image_classification', label: 'Image Classification' },
                        { value: 'text_classification', label: 'Text Classification' },
                        { value: 'sentiment_analysis', label: 'Sentiment Analysis' },
                        { value: 'object_detection', label: 'Object Detection' }
                      ]}
                      value={config.taskType}
                      onChange={(value) => handleInputChange('taskType', value)}
                    />
                  </div>
                  
                  <div>
                    <Select
                      label="Data Type"
                      options={[
                        { value: 'tabular', label: 'Tabular Data' },
                        { value: 'image', label: 'Image Data' },
                        { value: 'text', label: 'Text Data' },
                        { value: 'audio', label: 'Audio Data' },
                        { value: 'video', label: 'Video Data' }
                      ]}
                      value={config.dataType}
                      onChange={(value) => handleInputChange('dataType', value)}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button
                    onClick={handleLocalDeployment}
                    disabled={isDeploying}
                    iconName={isDeploying ? "Loader2" : "Download"}
                    iconPosition="left"
                    className="bg-success hover:bg-success/90"
                  >
                    {isDeploying ? 'Generating Package...' : 'Download Deployment Package'}
                  </Button>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-700">
                    <Icon name="Info" size={16} className="inline mr-2" />
                    This will download a complete Python project with Flask API, Docker support, and setup instructions.
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Select Cloud Provider</h3>
              <Select
                label="Cloud Provider"
                placeholder="Choose your cloud provider"
                options={cloudProviders}
                value={config?.cloudProvider}
                onChange={(value) => handleInputChange('cloudProvider', value)}
                required
              />
            </div>
            <div>
              <Select
                label="Region"
                placeholder="Select deployment region"
                options={regions}
                value={config?.region}
                onChange={(value) => handleInputChange('region', value)}
                required
                disabled={!config?.cloudProvider}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Instance Configuration</h3>
              <Select
                label="Instance Type"
                placeholder="Choose instance type"
                options={instanceTypes}
                value={config?.instanceType}
                onChange={(value) => handleInputChange('instanceType', value)}
                required
              />
            </div>
            <div>
              <Input
                label="API Endpoint Name"
                type="text"
                placeholder="my-model-api"
                value={config?.apiName}
                onChange={(e) => handleInputChange('apiName', e?.target?.value)}
                description="This will be used in your API URL"
                required
              />
            </div>
            <div>
              <Input
                label="Description"
                type="text"
                placeholder="Brief description of your deployment"
                value={config?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Scaling Configuration</h3>
              <Select
                label="Scaling Mode"
                placeholder="Choose scaling strategy"
                options={scalingModes}
                value={config?.scalingMode}
                onChange={(value) => handleInputChange('scalingMode', value)}
                required
              />
            </div>
            {config?.scalingMode === 'auto' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Instances"
                  type="number"
                  min="1"
                  max="100"
                  value={config?.minInstances}
                  onChange={(e) => handleInputChange('minInstances', parseInt(e?.target?.value))}
                />
                <Input
                  label="Maximum Instances"
                  type="number"
                  min="1"
                  max="100"
                  value={config?.maxInstances}
                  onChange={(e) => handleInputChange('maxInstances', parseInt(e?.target?.value))}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Review Configuration</h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{selectedModel?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cloud Provider:</span>
                  <span className="font-medium">{cloudProviders?.find(p => p?.value === config?.cloudProvider)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="font-medium">{regions?.find(r => r?.value === config?.region)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instance Type:</span>
                  <span className="font-medium">{config?.instanceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Name:</span>
                  <span className="font-medium">{config?.apiName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scaling:</span>
                  <span className="font-medium">{scalingModes?.find(s => s?.value === config?.scalingMode)?.label}</span>
                </div>
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className="text-accent" />
                <span className="font-medium text-accent">Estimated Cost</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Approximately $0.15 - $0.45 per hour based on your configuration
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Deploy Model</h2>
        {currentStep > 0 && (
          <div className="flex items-center space-x-2">
            <Icon name="Rocket" size={20} className="text-primary" />
            <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
          </div>
        )}
      </div>
      
      {/* Progress Steps - Only show for cloud deployments */}
      {currentStep > 0 && config.platform !== 'local' && (
        <div className="flex items-center justify-between mb-8">
          {steps?.map((step, index) => (
            <div key={step?.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
                currentStep >= step?.id
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-border text-muted-foreground'
              }`}>
                <Icon name={step?.icon} size={16} />
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step?.id ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step?.title}
                </p>
              </div>
              {index < steps?.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step?.id ? 'bg-primary' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>
      
      {/* Navigation Buttons - Only show for cloud deployments after platform selection */}
      {currentStep > 0 && config.platform !== 'local' && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>
          
          <div className="flex space-x-3">
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleDeploy}
                iconName="Rocket"
                iconPosition="left"
                className="bg-success hover:bg-success/90"
              >
                Deploy Model
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Back to Platform Selection - Show when on cloud deployment steps */}
      {currentStep > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(0)}
            iconName="ArrowLeft"
            iconPosition="left"
            size="sm"
          >
            Back to Platform Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeploymentConfigPanel;