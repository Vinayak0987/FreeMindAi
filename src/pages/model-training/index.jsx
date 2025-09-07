import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TrainingConfigPanel from './components/TrainingConfigPanel';
import TrainingDashboard from './components/TrainingDashboard';
import ModelComparisonPanel from './components/ModelComparisonPanel';
import AIAssistantSuggestions from './components/AIAssistantSuggestions';
import AIAssistantFAB from '../../components/AIAssistantFAB';

const ModelTraining = () => {
  const navigate = useNavigate();
  const [isTraining, setIsTraining] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState(null);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock project and training job IDs - in real app these would come from URL params or context
  const [projectId] = useState('64a7b8c9d1e2f3a4b5c6d7e8'); // Mock project ID
  const [trainingJobId, setTrainingJobId] = useState(null);

  const handleStartTraining = (config) => {
    setTrainingConfig(config);
    setIsTraining(true);
    // Generate a mock training job ID when training starts
    const newTrainingJobId = 'job_' + Date.now().toString();
    setTrainingJobId(newTrainingJobId);
    console.log('Starting training with config:', config);
  };

  const handleStopTraining = () => {
    setIsTraining(false);
    setTrainingConfig(null);
  };

  const tabs = [
    { id: 'dashboard', label: 'Training Dashboard', icon: 'Activity' },
    { id: 'comparison', label: 'Model Comparison', icon: 'BarChart3' },
    { id: 'suggestions', label: 'AI Suggestions', icon: 'Sparkles' }
  ];

  const quickActions = [
    {
      label: 'Dataset Management',
      description: 'Manage training datasets',
      icon: 'Database',
      action: () => navigate('/dataset-management'),
      color: 'bg-accent/10 text-accent'
    },
    {
      label: 'Model Deployment',
      description: 'Deploy trained models',
      icon: 'Rocket',
      action: () => navigate('/model-deployment'),
      color: 'bg-success/10 text-success'
    },
    {
      label: 'AI Assistant',
      description: 'Get ML guidance',
      icon: 'MessageSquare',
      action: () => navigate('/ai-assistant-chat'),
      color: 'bg-warning/10 text-warning'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Model Training</h1>
                <p className="text-muted-foreground">
                  Configure and monitor your automated ML training pipeline
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/project-workspace')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Workspace
                </Button>
                <Button
                  variant={isTraining ? "destructive" : "default"}
                  onClick={isTraining ? handleStopTraining : () => handleStartTraining(trainingConfig)}
                  loading={isTraining}
                  iconName={isTraining ? "Square" : "Play"}
                  iconPosition="left"
                >
                  {isTraining ? 'Stop Training' : 'Quick Start'}
                </Button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="mt-6 flex items-center space-x-6 p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isTraining ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
                <span className="text-sm font-medium text-foreground">
                  Status: {isTraining ? 'Training Active' : 'Ready'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Dataset: Customer Churn (10K samples)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Brain" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Task: Classification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last Run: {new Date()?.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Configuration Panel */}
            <div className="col-span-12 lg:col-span-4">
              <div className="space-y-6">
                <TrainingConfigPanel 
                  onStartTraining={handleStartTraining}
                  isTraining={isTraining}
                />
                
                {/* Quick Actions */}
                <div className="bg-card border border-border rounded-lg elevation-1 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {quickActions?.map((action, index) => (
                      <button
                        key={index}
                        onClick={action?.action}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-muted transition-colors duration-150 text-left"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${action?.color}`}>
                          <Icon name={action?.icon} size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{action?.label}</div>
                          <div className="text-sm text-muted-foreground">{action?.description}</div>
                        </div>
                        <Icon name="ArrowRight" size={16} className="ml-auto text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Main Dashboard */}
            <div className="col-span-12 lg:col-span-8">
              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="border-b border-border">
                  <nav className="flex space-x-8">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                          activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                      >
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'dashboard' && (
                  <TrainingDashboard 
                    isTraining={isTraining}
                    trainingConfig={trainingConfig}
                    projectId={projectId}
                    trainingJobId={trainingJobId}
                  />
                )}
                
                {activeTab === 'comparison' && (
                  <ModelComparisonPanel />
                )}
                
                {activeTab === 'suggestions' && (
                  <AIAssistantSuggestions 
                    trainingConfig={trainingConfig}
                    currentMetrics={currentMetrics}
                    isTraining={isTraining}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mobile-Responsive Bottom Actions */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isTraining ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
                <span className="text-sm font-medium text-foreground">
                  {isTraining ? 'Training...' : 'Ready'}
                </span>
              </div>
              <Button
                variant={isTraining ? "destructive" : "default"}
                size="sm"
                onClick={isTraining ? handleStopTraining : () => handleStartTraining(trainingConfig)}
                loading={isTraining}
                iconName={isTraining ? "Square" : "Play"}
                iconPosition="left"
              >
                {isTraining ? 'Stop' : 'Start'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* AI Assistant FAB */}
      <AIAssistantFAB />
    </div>
  );
};

export default ModelTraining;
