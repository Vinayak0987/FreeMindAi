import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const NewProjectModal = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const projectTypes = [
    { value: 'classification', label: 'Classification', description: 'Predict categories or classes' },
    { value: 'regression', label: 'Regression', description: 'Predict continuous values' },
    { value: 'nlp', label: 'Natural Language Processing', description: 'Text analysis and processing' },
    { value: 'computer_vision', label: 'Computer Vision', description: 'Image and video analysis' },
    { value: 'time_series', label: 'Time Series', description: 'Temporal data forecasting' },
    { value: 'clustering', label: 'Clustering', description: 'Group similar data points' }
  ];

  const handleCreateProject = async () => {
    if (!projectName?.trim() || !projectType) return;
    
    setIsCreating(true);
    
    // Simulate project creation
    setTimeout(() => {
      setIsCreating(false);
      onClose();
      navigate('/project-workspace', { 
        state: { 
          newProject: {
            name: projectName,
            type: projectType,
            description: description
          }
        }
      });
    }, 1500);
  };

  const resetForm = () => {
    setProjectName('');
    setProjectType('');
    setDescription('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-popover border border-border rounded-lg w-full max-w-md mx-4 elevation-3">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-popover-foreground">Create New Project</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-muted rounded transition-colors duration-150"
            disabled={isCreating}
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <Input
            label="Project Name"
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e?.target?.value)}
            required
            disabled={isCreating}
          />

          <Select
            label="Project Type"
            placeholder="Select project type"
            options={projectTypes}
            value={projectType}
            onChange={setProjectType}
            required
            disabled={isCreating}
          />

          <Input
            label="Description (Optional)"
            type="text"
            placeholder="Brief description of your project"
            value={description}
            onChange={(e) => setDescription(e?.target?.value)}
            disabled={isCreating}
          />

          {projectType && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Project Type Info</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {projectTypes?.find(type => type?.value === projectType)?.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleCreateProject}
            disabled={!projectName?.trim() || !projectType || isCreating}
            loading={isCreating}
            iconName="Plus"
            iconPosition="left"
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;