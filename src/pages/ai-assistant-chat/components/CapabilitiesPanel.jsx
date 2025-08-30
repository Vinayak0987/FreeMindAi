import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CapabilitiesPanel = ({ isOpen, onClose }) => {
  const capabilities = [
    {
      category: "Data Analysis",
      icon: "BarChart3",
      color: "text-accent",
      features: [
        "Analyze dataset structure and quality",
        "Identify missing values and outliers",
        "Suggest data preprocessing steps",
        "Recommend feature engineering techniques",
        "Generate statistical summaries"
      ]
    },
    {
      category: "Model Development",
      icon: "Brain",
      color: "text-primary",
      features: [
        "Recommend suitable algorithms",
        "Explain model selection criteria",
        "Guide hyperparameter tuning",
        "Interpret model performance metrics",
        "Suggest optimization strategies"
      ]
    },
    {
      category: "Deployment & Monitoring",
      icon: "Rocket",
      color: "text-success",
      features: [
        "Deployment best practices",
        "Model monitoring setup",
        "Performance troubleshooting",
        "Scaling recommendations",
        "Production optimization tips"
      ]
    },
    {
      category: "Learning & Support",
      icon: "BookOpen",
      color: "text-warning",
      features: [
        "Step-by-step tutorials",
        "Concept explanations",
        "Code examples and snippets",
        "Best practice guidelines",
        "Troubleshooting assistance"
      ]
    }
  ];

  const voiceFeatures = [
    "Natural language conversations",
    "Real-time voice transcription",
    "Hands-free workflow guidance",
    "Voice-activated quick actions",
    "Multi-language support"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden elevation-3">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">AI Assistant Capabilities</h2>
            <p className="text-sm text-muted-foreground">Discover what I can help you with</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Main Capabilities */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities?.map((capability) => (
                <div key={capability?.category} className="bg-background rounded-lg p-6 border border-border">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${capability?.color}`}>
                      <Icon name={capability?.icon} size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{capability?.category}</h3>
                  </div>
                  
                  <ul className="space-y-2">
                    {capability?.features?.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Integration */}
          <div className="border-t border-border p-6">
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                  <Icon name="Mic" size={24} color="white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Voice Integration</h3>
                  <p className="text-sm text-muted-foreground">Powered by Vapi AI for natural conversations</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voiceFeatures?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name="Volume2" size={16} className="text-accent" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Tips */}
          <div className="border-t border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Usage Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="MessageSquare" size={16} className="text-primary" />
                  <span className="font-medium text-foreground">Be Specific</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Provide context about your dataset, model, or specific challenge for better assistance.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Upload" size={16} className="text-success" />
                  <span className="font-medium text-foreground">Share Files</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload code snippets, data samples, or error logs for contextual help.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Bookmark" size={16} className="text-warning" />
                  <span className="font-medium text-foreground">Save Important</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Bookmark useful responses and export conversations for future reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapabilitiesPanel;