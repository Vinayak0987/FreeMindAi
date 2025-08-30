import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const ProjectSidebar = ({ project, isCollapsed, onToggleCollapse }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const location = useLocation();
  const navigate = useNavigate();

  const navigationSections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      path: '/project-workspace',
      description: 'Project summary and metrics'
    },
    {
      id: 'datasets',
      label: 'Datasets',
      icon: 'Database',
      path: '/dataset-management',
      description: 'Data management and preprocessing',
      badge: project?.datasetCount
    },
    {
      id: 'models',
      label: 'Models',
      icon: 'Brain',
      path: '/model-training',
      description: 'Model training and optimization',
      badge: project?.modelCount
    },
    {
      id: 'experiments',
      label: 'Experiments',
      icon: 'FlaskConical',
      path: '/experiments',
      description: 'Experiment tracking and comparison',
      badge: project?.experimentCount
    },
    {
      id: 'deployment',
      label: 'Deployment',
      icon: 'Rocket',
      path: '/model-deployment',
      description: 'Model deployment and monitoring',
      status: project?.deploymentStatus
    }
  ];

  const quickActions = [
    { id: 'upload', label: 'Upload Data', icon: 'Upload', action: () => navigate('/dataset-management') },
    { id: 'train', label: 'Train Model', icon: 'Play', action: () => navigate('/model-training') },
    { id: 'deploy', label: 'Deploy Model', icon: 'Rocket', action: () => navigate('/model-deployment') },
    { id: 'assistant', label: 'AI Assistant', icon: 'MessageSquare', action: () => navigate('/ai-assistant-chat') }
  ];

  const handleSectionClick = (section) => {
    setActiveSection(section?.id);
    navigate(section?.path);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'pending': return 'bg-warning';
      case 'error': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 fixed left-0 top-16 h-full z-40 ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          {!isCollapsed && (
            <h2 className="text-sm font-semibold text-foreground">Project Navigation</h2>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-muted rounded-md transition-colors duration-150"
          >
            <Icon 
              name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
              size={16} 
              className="text-muted-foreground"
            />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-1">
          {navigationSections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => handleSectionClick(section)}
              className={`flex items-center w-full p-2.5 rounded-lg text-left transition-all duration-150 group ${
                activeSection === section?.id
                  ? 'bg-primary text-primary-foreground elevation-1'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
              title={isCollapsed ? section?.label : ''}
            >
              <Icon name={section?.icon} size={18} />
              {!isCollapsed && (
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{section?.label}</span>
                    {section?.badge && (
                      <span className="text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                        {section?.badge}
                      </span>
                    )}
                    {section?.status && (
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(section?.status)}`} />
                    )}
                  </div>
                  <div className="text-xs opacity-75 mt-0.5">{section?.description}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Project Stats */}
        {!isCollapsed && (
          <div className="border-t border-border p-3 mt-3">
            <h3 className="text-sm font-semibold text-foreground mb-2">Project Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Storage Used</span>
                <span className="text-foreground font-medium">{project?.storageUsed}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1">
                <div 
                  className="h-1 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(project?.storageUsed?.replace('GB', '') / 10) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Training Time</span>
                <span className="text-foreground font-medium">{project?.trainingTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">API Calls</span>
                <span className="text-foreground font-medium">{project?.apiCalls}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="border-t border-border p-3">
            <h3 className="text-sm font-semibold text-foreground mb-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {quickActions?.map((action) => (
                <button
                  key={action?.id}
                  onClick={action?.action}
                  className="flex flex-col items-center p-2.5 bg-muted/50 hover:bg-muted rounded-lg transition-colors duration-150 group"
                >
                  <Icon name={action?.icon} size={16} className="text-muted-foreground group-hover:text-foreground mb-1" />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground text-center leading-tight">
                    {action?.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;