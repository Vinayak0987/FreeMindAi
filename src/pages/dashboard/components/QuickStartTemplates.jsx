import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickStartTemplates = ({ templates }) => {
  const navigate = useNavigate();

  const getTemplateIcon = (type) => {
    const icons = {
      'classification': 'Target',
      'regression': 'TrendingUp',
      'nlp': 'MessageSquare',
      'computer_vision': 'Eye',
      'time_series': 'BarChart3',
      'clustering': 'GitBranch'
    };
    return icons?.[type] || 'Zap';
  };

  const getTemplateColor = (type) => {
    const colors = {
      'classification': 'bg-primary/10 text-primary border-primary/20',
      'regression': 'bg-success/10 text-success border-success/20',
      'nlp': 'bg-accent/10 text-accent border-accent/20',
      'computer_vision': 'bg-warning/10 text-warning border-warning/20',
      'time_series': 'bg-secondary/10 text-secondary border-secondary/20',
      'clustering': 'bg-purple-100 text-purple-600 border-purple-200'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground border-border';
  };

  const handleTemplateSelect = (template) => {
    // Navigate to project workspace with template data
    navigate('/project-workspace', { state: { template } });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 elevation-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Quick Start Templates</h3>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-150">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {templates?.map((template) => (
          <div
            key={template?._id || template?.id}
            className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-all duration-150 cursor-pointer group"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTemplateColor(template?.type)}`}>
                <Icon name={getTemplateIcon(template?.type)} size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-150 mb-1">
                  {template?.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {template?.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {template?.difficulty}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      ~{template?.estimatedTime}
                    </span>
                  </div>
                  <Icon name="ArrowRight" size={14} className="text-muted-foreground group-hover:text-primary transition-colors duration-150" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="Plus"
          iconPosition="left"
          onClick={() => navigate('/project-workspace')}
        >
          Create Custom Project
        </Button>
      </div>
    </div>
  );
};

export default QuickStartTemplates;