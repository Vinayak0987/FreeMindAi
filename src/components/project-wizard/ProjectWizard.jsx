import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Icon from '../AppIcon';

// Import wizard steps
import ProjectBasicsStep from './steps/ProjectBasicsStep';
import DataUploadStep from './steps/DataUploadStep';
import TaskSelectionStep from './steps/TaskSelectionStep';
import DataProcessingStep from './steps/DataProcessingStep';
import ModelConfigurationStep from './steps/ModelConfigurationStep';
import TrainingStep from './steps/TrainingStep';
import EvaluationStep from './steps/EvaluationStep';
import DeploymentStep from './steps/DeploymentStep';

const ProjectWizard = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectData, setProjectData] = useState({
    // Basic Info
    name: '',
    description: '',
    thumbnail: null,
    tags: [],
    
    // Data
    datasets: [],
    dataType: '',
    dataFormat: '',
    
    // Task
    taskType: '',
    modelType: '',
    
    // Processing
    preprocessing: {
      steps: [],
      validation: {}
    },
    
    // Configuration
    configuration: {
      framework: 'tensorflow',
      parameters: {}
    },
    
    // Training
    training: {
      epochs: 20,
      batchSize: 32,
      optimizer: 'adam',
      metrics: []
    },
    
    // Evaluation
    evaluation: {
      testSplit: 0.2,
      validationSplit: 0.1
    },
    
    // Deployment
    deployment: {
      type: 'api',
      environment: 'cloud'
    }
  });

  const steps = [
    {
      id: 'basics',
      title: 'Project Basics',
      description: 'Describe your AI/ML project idea',
      icon: 'FileText',
      component: ProjectBasicsStep
    },
    {
      id: 'data',
      title: 'Data Upload',
      description: 'Upload your dataset and configure data sources',
      icon: 'Upload',
      component: DataUploadStep
    },
    {
      id: 'task',
      title: 'Task Selection',
      description: 'Choose your ML task type and model category',
      icon: 'Target',
      component: TaskSelectionStep
    },
    {
      id: 'processing',
      title: 'Data Processing',
      description: 'Configure data preprocessing and validation',
      icon: 'Settings',
      component: DataProcessingStep
    },
    {
      id: 'configuration',
      title: 'Model Configuration',
      description: 'Set up model parameters and architecture',
      icon: 'Brain',
      component: ModelConfigurationStep
    },
    {
      id: 'training',
      title: 'Training Setup',
      description: 'Configure training parameters and optimization',
      icon: 'Zap',
      component: TrainingStep
    },
    {
      id: 'evaluation',
      title: 'Model Evaluation',
      description: 'Set up evaluation metrics and validation',
      icon: 'BarChart',
      component: EvaluationStep
    },
    {
      id: 'deployment',
      title: 'Deployment',
      description: 'Configure model deployment and API setup',
      icon: 'Rocket',
      component: DeploymentStep
    }
  ];

  const updateProjectData = useCallback((stepData) => {
    setProjectData(prev => ({
      ...prev,
      ...stepData
    }));
  }, []);

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

  const handleComplete = async () => {
    try {
      await onComplete(projectData);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="absolute inset-4 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Icon name="Brain" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Create New Project</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-10 h-10 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : index < currentStep
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <Icon name="Check" size={16} />
                  ) : (
                    <Icon name={step.icon} size={16} />
                  )}
                </div>
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    index === currentStep
                      ? 'text-foreground'
                      : index < currentStep
                      ? 'text-success'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CurrentStepComponent
                data={projectData}
                updateData={updateProjectData}
                stepData={steps[currentStep]}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-card/50">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button
                variant="default"
                onClick={handleComplete}
                iconName="Check"
                iconPosition="left"
                className="bg-gradient-to-r from-success to-success-foreground"
              >
                Create Project
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={nextStep}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWizard;
