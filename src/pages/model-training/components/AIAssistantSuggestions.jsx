import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIAssistantSuggestions = ({ trainingConfig, currentMetrics, isTraining }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const mockSuggestions = [
    {
      id: 'opt_001',
      type: 'optimization',
      priority: 'high',
      title: 'Increase Learning Rate',
      description: `Your current learning rate of 0.001 might be too conservative. Based on the training curve, consider increasing it to 0.01 for faster convergence.`,
      impact: 'Could reduce training time by 30-40%',
      reasoning: `The loss is decreasing steadily but slowly. A higher learning rate would help the model converge faster without overshooting the optimal solution.`,
      implementation: `Update hyperparameters:\n• learning_rate: 0.001 → 0.01\n• Consider reducing batch_size to 16 for stability\n• Monitor for oscillations in loss`,
      confidence: 0.85,
      category: 'hyperparameters'
    },
    {
      id: 'opt_002',
      type: 'feature_engineering',
      priority: 'medium',
      title: 'Add Polynomial Features',
      description: `Your dataset shows non-linear patterns. Adding polynomial features could improve model performance significantly.`,
      impact: 'Potential accuracy improvement of 5-8%',
      reasoning: `The current feature set appears to have linear relationships, but the residual analysis suggests non-linear patterns that polynomial features could capture.`,
      implementation: `Feature engineering steps:\n• Generate degree-2 polynomial features\n• Apply feature selection to avoid overfitting\n• Consider interaction terms between top features`,
      confidence: 0.72,
      category: 'features'
    },
    {
      id: 'opt_003',
      type: 'model_architecture',
      priority: 'low',
      title: 'Try Ensemble Methods',
      description: `Your single model performance is good, but ensemble methods could provide better generalization.`,
      impact: 'Improved robustness and 2-3% accuracy gain',
      reasoning: `Individual models show good performance but different strengths. Combining them could reduce overfitting and improve generalization.`,
      implementation: `Ensemble approach:\n• Combine XGBoost + Random Forest\n• Use weighted voting based on validation performance\n• Consider stacking with a meta-learner`,
      confidence: 0.68,
      category: 'architecture'
    }
  ];

  useEffect(() => {
    if (isTraining && currentMetrics) {
      setIsGenerating(true);
      // Simulate AI analysis delay
      const timer = setTimeout(() => {
        setSuggestions(mockSuggestions);
        setIsGenerating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTraining, currentMetrics]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Circle';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'hyperparameters': return 'Settings';
      case 'features': return 'Wrench';
      case 'architecture': return 'Brain';
      default: return 'Lightbulb';
    }
  };

  const handleApplySuggestion = (suggestion) => {
    // In a real app, this would apply the suggestion to the training config
    console.log('Applying suggestion:', suggestion);
  };

  const toggleExpanded = (suggestionId) => {
    setExpandedSuggestion(expandedSuggestion === suggestionId ? null : suggestionId);
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Sparkles" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Optimization Suggestions</h2>
            <p className="text-sm text-muted-foreground">
              {isGenerating ? 'Analyzing your training progress...' : `${suggestions?.length} recommendations available`}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {isGenerating ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Icon name="Brain" size={24} className="text-accent" />
            </div>
            <p className="text-foreground font-medium mb-2">AI is analyzing your training data...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        ) : suggestions?.length > 0 ? (
          <div className="space-y-4">
            {suggestions?.map((suggestion) => (
              <div key={suggestion?.id} className="border border-border rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={getPriorityIcon(suggestion?.priority)} 
                          size={16} 
                          className={getPriorityColor(suggestion?.priority)}
                        />
                        <Icon 
                          name={getCategoryIcon(suggestion?.category)} 
                          size={16} 
                          className="text-muted-foreground"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-foreground">{suggestion?.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full bg-muted ${getPriorityColor(suggestion?.priority)}`}>
                            {suggestion?.priority}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{suggestion?.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Impact: {suggestion?.impact}</span>
                          <span>Confidence: {(suggestion?.confidence * 100)?.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(suggestion?.id)}
                        iconName={expandedSuggestion === suggestion?.id ? "ChevronUp" : "ChevronDown"}
                        iconPosition="right"
                      >
                        Details
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApplySuggestion(suggestion)}
                        iconName="Check"
                        iconPosition="left"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>

                {expandedSuggestion === suggestion?.id && (
                  <div className="border-t border-border bg-muted/20 p-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Reasoning</h4>
                        <p className="text-sm text-muted-foreground">{suggestion?.reasoning}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Implementation</h4>
                        <pre className="text-xs text-muted-foreground bg-muted/50 p-3 rounded whitespace-pre-wrap font-mono">
                          {suggestion?.implementation}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Sparkles" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Suggestions Yet</h3>
            <p className="text-muted-foreground mb-4">Start training to get AI-powered optimization recommendations</p>
            <Button variant="outline" iconName="Play" iconPosition="left">
              Start Training
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantSuggestions;