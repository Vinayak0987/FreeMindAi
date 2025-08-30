import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeploymentConfigPanel = ({ onDeploy, selectedModel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState({
    cloudProvider: '',
    region: '',
    instanceType: '',
    scalingMode: '',
    minInstances: 1,
    maxInstances: 10,
    apiName: '',
    description: ''
  });

  const cloudProviders = [
    { value: 'aws', label: 'Amazon Web Services' },
    { value: 'gcp', label: 'Google Cloud Platform' },
    { value: 'azure', label: 'Microsoft Azure' },
    { value: 'freemind', label: 'FreeMind Cloud' }
  ];

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
        <div className="flex items-center space-x-2">
          <Icon name="Rocket" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
        </div>
      </div>
      {/* Progress Steps */}
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
      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>
      {/* Navigation Buttons */}
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
    </div>
  );
};

export default DeploymentConfigPanel;