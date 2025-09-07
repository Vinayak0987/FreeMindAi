import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Upload, Target, Settings, Zap, BarChart3, Rocket, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import ProjectBasicsStep from '../components/project-wizard/steps/ProjectBasicsStep';
import DataUploadStep from '../components/project-wizard/steps/DataUploadStep';
import TaskSelectionStep from '../components/project-wizard/steps/TaskSelectionStep';
import DataProcessingStep from '../components/project-wizard/steps/DataProcessingStep';
import ModelConfigurationStep from '../components/project-wizard/steps/ModelConfigurationStep';
import TrainingSetupStep from '../components/project-wizard/steps/TrainingSetupStep';
import EvaluationStep from '../components/project-wizard/steps/EvaluationStep';
import DeploymentStep from '../components/project-wizard/steps/DeploymentStep';
import apiService from '../utils/api';

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    tags: [],
    thumbnail: null,
    dataType: '',
    datasets: [],
    task: '',
    taskConfig: {},
    preprocessing: {},
    modelConfig: {},
    training: {},
    evaluation: {},
    deployment: {}
  });

  const steps = [
    {
      id: 'basics',
      title: 'Project Basics',
      description: 'Set up your project name, description and basic details',
      icon: 'FileText',
      component: ProjectBasicsStep
    },
    {
      id: 'data',
      title: 'Data Upload',
      description: 'Upload your dataset or choose from samples',
      icon: 'Upload',
      component: DataUploadStep
    },
    {
      id: 'task',
      title: 'Task Selection',
      description: 'Choose the AI/ML task you want to perform',
      icon: 'Target',
      component: TaskSelectionStep
    },
    {
      id: 'preprocessing',
      title: 'Data Processing',
      description: 'Configure data preprocessing and cleaning',
      icon: 'Settings',
      component: DataProcessingStep
    },
    {
      id: 'model',
      title: 'Model Configuration',
      description: 'Select and configure your AI model',
      icon: 'Zap',
      component: ModelConfigurationStep
    },
    {
      id: 'training',
      title: 'Training Setup',
      description: 'Configure training parameters and settings',
      icon: 'BarChart3',
      component: TrainingSetupStep
    },
    {
      id: 'evaluation',
      title: 'Evaluation',
      description: 'Set up model evaluation metrics',
      icon: 'Check',
      component: EvaluationStep
    },
    {
      id: 'deployment',
      title: 'Deployment',
      description: 'Configure deployment options',
      icon: 'Rocket',
      component: DeploymentStep
    }
  ];

  const updateProjectData = (newData) => {
    setProjectData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    const currentStepData = steps[currentStep];
    
    switch (currentStepData.id) {
      case 'basics':
        return projectData.name && projectData.description;
      case 'data':
        return projectData.dataType && projectData.datasets && projectData.datasets.length > 0;
      case 'task':
        return projectData.task && projectData.taskConfig;
      case 'preprocessing':
        return true; // Optional step
      case 'model':
        return projectData.modelConfig && projectData.modelConfig.architecture;
      case 'training':
        return projectData.training && projectData.training.epochs;
      case 'evaluation':
        return true; // Optional step
      case 'deployment':
        return true; // Optional step
      default:
        return true;
    }
  };

  const handleCreateProject = async () => {
    try {
      // Create project with regular API
      const projectResponse = await apiService.projects.create({
        name: projectData.name,
        description: projectData.description,
        tags: projectData.tags,
        thumbnail: projectData.thumbnail?.file,
        dataType: projectData.dataType,
        task: projectData.task,
        status: 'created'
      });

      const projectId = projectResponse.data.id;

      // If we have preprocessing configuration, start the ML pipeline
      if (projectData.preprocessing?.processed || projectData.modelConfig?.architecture) {
        // Start training job with nebula backend
        const trainingConfig = {
          projectId: projectId,
          dataType: projectData.dataType,
          task: projectData.task,
          taskConfig: projectData.taskConfig,
          modelConfig: projectData.modelConfig,
          training: projectData.training || {
            epochs: 50,
            batchSize: 32,
            learningRate: 0.001
          },
          preprocessing: projectData.preprocessing,
          evaluation: projectData.evaluation || {
            metrics: ['accuracy', 'loss']
          }
        };

        const trainingResponse = await apiService.nebula.trainModel(trainingConfig);
        console.log('Training job started:', trainingResponse.data);
      }

      // If deployment configuration is provided, handle deployment
      if (projectData.deployment?.platform) {
        try {
          if (projectData.deployment.platform === 'local') {
            // Handle local deployment with ZIP file download
            console.log('Generating local deployment package...');
            
            const localDeploymentConfig = {
              platform: 'local',
              serviceName: projectData.deployment.serviceName || `${projectData.name.toLowerCase().replace(/\s+/g, '-')}-model`,
              environment: projectData.deployment.environment || 'development',
              taskType: projectData.task,
              dataType: projectData.dataType,
              modelConfig: {
                ...projectData.modelConfig,
                dataset: {
                  name: projectData.name,
                  samples: projectData.datasets?.[0]?.samples || 'N/A',
                  features: projectData.datasets?.[0]?.features || 'N/A',
                  size: projectData.datasets?.[0]?.size || 'N/A'
                }
              },
              deploymentConfig: {
                autoScaling: projectData.deployment.autoScaling,
                memoryLimit: projectData.deployment.memoryLimit,
                enableMonitoring: projectData.deployment.enableMonitoring
              }
            };
            
            // Make API call to generate and download ZIP
            const response = await fetch('http://localhost:5000/api/deploy', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(localDeploymentConfig)
            });
            
            if (response.ok) {
              // Handle ZIP file download
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              
              // Get filename from Content-Disposition header
              const contentDisposition = response.headers.get('Content-Disposition');
              let filename = `${localDeploymentConfig.serviceName}-deployment.zip`;
              if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match) filename = match[1];
              }
              
              link.download = filename;
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(downloadUrl);
              
              console.log('Local deployment package downloaded successfully');
              
              // Show success message and navigate
              alert('Local deployment package generated successfully! Check your downloads folder.');
              navigate('/projects');
              return; // Exit early for local deployment
            } else {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to generate local deployment package');
            }
          } else {
            // Handle cloud platform deployments
            const deploymentConfig = {
              projectId: projectId,
              platform: projectData.deployment.platform,
              serviceName: projectData.deployment.serviceName || `${projectData.name.toLowerCase().replace(/\s+/g, '-')}-model`,
              environment: projectData.deployment.environment || 'production',
              autoScaling: projectData.deployment.autoScaling,
              memoryLimit: projectData.deployment.memoryLimit,
              enableMonitoring: projectData.deployment.enableMonitoring
            };

            const deploymentResponse = await apiService.deployment.create(deploymentConfig);
            console.log('Deployment started:', deploymentResponse.data);
          }
        } catch (deploymentError) {
          console.error('Deployment failed:', deploymentError);
          alert(`Deployment failed: ${deploymentError.message}. Project was created successfully, but deployment could not be started.`);
        }
      }

      console.log('Project created successfully:', projectResponse.data);
      
      // Navigate to project workspace or projects page
      navigate(`/project-workspace/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    const StepComponent = currentStepData.component;

    if (StepComponent) {
      return (
        <StepComponent
          data={projectData}
          updateData={updateProjectData}
          stepData={currentStepData}
        />
      );
    }

    // Placeholder for steps not yet implemented
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Icon name={currentStepData.icon} size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">{currentStepData.title}</h3>
        <p className="text-muted-foreground mb-8">{currentStepData.description}</p>
        <div className="p-8 bg-muted/30 rounded-2xl border border-border">
          <p className="text-lg text-muted-foreground">This step is coming soon!</p>
          <p className="text-sm text-muted-foreground mt-2">
            We're working on implementing {currentStepData.title.toLowerCase()} functionality.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/projects')}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Back to Projects
              </Button>
              <div className="w-px h-6 bg-border" />
              <h1 className="text-2xl font-bold text-foreground">Create New Project</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Step Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold text-foreground mb-6">Project Setup</h3>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      index === currentStep
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : index < currentStep
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                      index === currentStep
                        ? 'bg-primary-foreground text-primary'
                        : index < currentStep
                        ? 'bg-green-100 text-green-600'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index < currentStep ? (
                        <Check size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className={`text-xs ${
                        index === currentStep
                          ? 'text-primary-foreground/80'
                          : 'text-muted-foreground'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-8 p-4 bg-card border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {renderStepContent()}

              {/* Navigation Footer */}
              <div className="flex items-center justify-between p-6 bg-muted/30 border-t border-border">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index <= currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {currentStep === steps.length - 1 ? (
                  <Button
                    onClick={handleCreateProject}
                    disabled={!isStepValid()}
                    iconName="Check"
                    iconPosition="right"
                  >
                    Create Project
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    iconName="ArrowRight"
                    iconPosition="right"
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
