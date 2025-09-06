import React from 'react';
import Icon from '../../AppIcon';

const DeploymentStep = ({ data, updateData, stepData }) => {
  const handleConfigChange = (key, value) => {
    updateData({
      deployment: {
        ...data.deployment,
        [key]: value
      }
    });
  };

  const deploymentOptions = [
    {
      id: 'local',
      title: 'Local Development',
      description: 'Run model locally for testing',
      icon: 'Monitor',
      features: ['Quick setup', 'Full control', 'No additional costs']
    },
    {
      id: 'vercel',
      title: 'Vercel Deployment',
      description: 'Deploy to Vercel serverless platform',
      icon: 'Globe',
      features: ['Auto-scaling', 'Global CDN', 'Easy integration']
    },
    {
      id: 'render',
      title: 'Render Platform',
      description: 'Deploy to Render cloud platform',
      icon: 'Cloud',
      features: ['Container-based', 'Persistent storage', 'Custom domains']
    },
    {
      id: 'api',
      title: 'REST API',
      description: 'Create REST API endpoints',
      icon: 'Code',
      features: ['HTTP endpoints', 'JSON responses', 'Easy integration']
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Icon name={stepData.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stepData.title}</h3>
            <p className="text-muted-foreground">{stepData.description}</p>
          </div>
        </div>
      </div>

      {/* Deployment Options */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-foreground mb-4">
          Choose Deployment Platform
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deploymentOptions.map((option) => {
            const isSelected = data.deployment?.platform === option.id;
            
            return (
              <div
                key={option.id}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-lg'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
                onClick={() => handleConfigChange('platform', option.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon name={option.icon} size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold text-foreground mb-2">{option.title}</h5>
                    <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                    
                    <div className="space-y-1">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Icon name="Check" size={16} className="text-green-500" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform-specific Configuration */}
      {data.deployment?.platform && (
        <div className="mb-8 p-6 bg-muted/30 rounded-2xl border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Settings" size={20} className="text-primary" />
            Deployment Configuration
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={data.deployment?.serviceName || `${data.name?.toLowerCase().replace(/\s+/g, '-')}-model` || 'my-model'}
                onChange={(e) => handleConfigChange('serviceName', e.target.value)}
                placeholder="my-awesome-model"
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Environment
              </label>
              <select
                value={data.deployment?.environment || 'production'}
                onChange={(e) => handleConfigChange('environment', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="development">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>

            {data.deployment?.platform !== 'local' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Auto-scaling
                  </label>
                  <select
                    value={data.deployment?.autoScaling || 'enabled'}
                    onChange={(e) => handleConfigChange('autoScaling', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Memory Limit (MB)
                  </label>
                  <select
                    value={data.deployment?.memoryLimit || 1024}
                    onChange={(e) => handleConfigChange('memoryLimit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={512}>512 MB</option>
                    <option value={1024}>1 GB</option>
                    <option value={2048}>2 GB</option>
                    <option value={4096}>4 GB</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.deployment?.enableMonitoring !== false}
                onChange={(e) => handleConfigChange('enableMonitoring', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-foreground">Enable Performance Monitoring</span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Track model performance, response times, and usage metrics
            </p>
          </div>
        </div>
      )}

      {/* Deployment Summary */}
      <div className="p-6 bg-card border border-border rounded-2xl">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-primary" />
          Deployment Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Platform</div>
            <div className="text-lg font-semibold text-foreground capitalize">
              {data.deployment?.platform || 'Not selected'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Service Name</div>
            <div className="text-lg font-semibold text-foreground">
              {data.deployment?.serviceName || 'Auto-generated'}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Environment</div>
            <div className="text-lg font-semibold text-foreground capitalize">
              {data.deployment?.environment || 'Production'}
            </div>
          </div>
        </div>

        {data.deployment?.platform && (
          <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
            <div className="text-sm text-green-700">
              <Icon name="CheckCircle" size={16} className="inline mr-2" />
              Your model will be deployed to {data.deployment.platform} after training completes.
              {data.deployment.platform !== 'local' && ' You\'ll receive deployment URLs and API endpoints.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentStep;
