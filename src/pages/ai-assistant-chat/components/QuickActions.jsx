import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick, currentContext }) => {
  const getContextualActions = () => {
    switch (currentContext) {
      case 'dataset-management':
        return [
          { id: 'analyze-data', label: 'Analyze my dataset', icon: 'BarChart3' },
          { id: 'data-quality', label: 'Check data quality', icon: 'CheckCircle' },
          { id: 'preprocessing', label: 'Suggest preprocessing', icon: 'Settings' },
          { id: 'feature-engineering', label: 'Feature engineering tips', icon: 'Zap' }
        ];
      case 'model-training':
        return [
          { id: 'model-selection', label: 'Choose best model', icon: 'Brain' },
          { id: 'hyperparameters', label: 'Tune hyperparameters', icon: 'Sliders' },
          { id: 'training-tips', label: 'Training optimization', icon: 'TrendingUp' },
          { id: 'overfitting', label: 'Prevent overfitting', icon: 'Shield' }
        ];
      case 'model-deployment':
        return [
          { id: 'deployment-guide', label: 'Deployment checklist', icon: 'Rocket' },
          { id: 'monitoring', label: 'Setup monitoring', icon: 'Activity' },
          { id: 'scaling', label: 'Scaling strategies', icon: 'Maximize' },
          { id: 'troubleshoot', label: 'Troubleshoot issues', icon: 'AlertCircle' }
        ];
      default:
        return [
          { id: 'getting-started', label: 'Getting started guide', icon: 'Play' },
          { id: 'best-practices', label: 'ML best practices', icon: 'Star' },
          { id: 'project-setup', label: 'Setup new project', icon: 'Plus' },
          { id: 'tutorials', label: 'View tutorials', icon: 'BookOpen' }
        ];
    }
  };

  const actions = getContextualActions();

  return (
    <div className="p-4 border-t border-border bg-muted/30">
      <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant="outline"
            size="sm"
            iconName={action?.icon}
            iconPosition="left"
            onClick={() => onActionClick(action)}
            className="justify-start text-left h-auto py-2 px-3"
          >
            <span className="text-xs">{action?.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;