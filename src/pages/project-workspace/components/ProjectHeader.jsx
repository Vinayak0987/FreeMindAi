import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProjectHeader = ({ project, onProjectUpdate, onExport, onShare }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [projectName, setProjectName] = useState(project?.name);
  const navigate = useNavigate();

  const handleSaveName = () => {
    onProjectUpdate({ ...project, name: projectName });
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSaveName();
    } else if (e?.key === 'Escape') {
      setProjectName(project?.name);
      setIsEditing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed': return 'text-success bg-success/10';
      case 'training': return 'text-warning bg-warning/10';
      case 'ready': return 'text-accent bg-accent/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'deployed': return 'CheckCircle';
      case 'training': return 'Loader';
      case 'ready': return 'Play';
      case 'error': return 'AlertCircle';
      default: return 'Clock';
    }
  };

  return (
    <div className="bg-card border-b border-border px-4 py-3">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
        <button 
          onClick={() => navigate('/dashboard')}
          className="hover:text-foreground transition-colors duration-150"
        >
          Dashboard
        </button>
        <Icon name="ChevronRight" size={14} />
        <span className="text-foreground font-medium">Project Workspace</span>
      </div>
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Project Name */}
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e?.target?.value)}
                onBlur={handleSaveName}
                onKeyDown={handleKeyPress}
                className="text-2xl font-bold bg-transparent border-b-2 border-primary focus:outline-none"
                autoFocus
              />
            ) : (
              <h1 
                className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors duration-150"
                onClick={() => setIsEditing(true)}
              >
                {project?.name}
              </h1>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-muted rounded transition-colors duration-150"
            >
              <Icon name="Edit2" size={14} className="text-muted-foreground" />
            </button>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project?.status)}`}>
            <Icon name={getStatusIcon(project?.status)} size={14} />
            <span className="capitalize">{project?.status}</span>
          </div>

          {/* Progress */}
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-muted rounded-full h-1.5">
              <div 
                className="h-1.5 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${project?.progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{project?.progress}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            iconName="Users"
            iconPosition="left"
            onClick={onShare}
          >
            Share
          </Button>
          
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export
          </Button>

          <Button
            variant="default"
            iconName="Play"
            iconPosition="left"
            onClick={() => navigate('/model-training')}
          >
            Start Training
          </Button>

          <button className="p-2 hover:bg-muted rounded-md transition-colors duration-150">
            <Icon name="MoreVertical" size={20} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      {/* Project Info */}
      <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Icon name="Calendar" size={14} />
          <span>Created {project?.createdAt}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="User" size={14} />
          <span>By {project?.owner}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={14} />
          <span>Last updated {project?.lastUpdated}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Database" size={14} />
          <span>{project?.datasetCount} datasets</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Brain" size={14} />
          <span>{project?.modelCount} models</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;