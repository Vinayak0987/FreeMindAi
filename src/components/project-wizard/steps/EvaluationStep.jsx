import React from 'react';
import Icon from '../../AppIcon';

const EvaluationStep = ({ data, updateData, stepData }) => {
  const handleConfigChange = (key, value) => {
    updateData({
      evaluation: {
        ...data.evaluation,
        [key]: value
      }
    });
  };

  const getTaskMetrics = () => {
    switch (data.task) {
      case 'object-detection':
        return ['mAP', 'Precision', 'Recall', 'IoU'];
      case 'image-classification':
        return ['Accuracy', 'Precision', 'Recall', 'F1-Score'];
      case 'text-classification':
        return ['Accuracy', 'Precision', 'Recall', 'F1-Score'];
      default:
        return ['Accuracy', 'Loss', 'Custom'];
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <Icon name={stepData.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stepData.title}</h3>
            <p className="text-muted-foreground">{stepData.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-4">Evaluation Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getTaskMetrics().map(metric => (
              <label key={metric} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.evaluation?.metrics?.includes(metric) ?? true}
                  onChange={(e) => {
                    const currentMetrics = data.evaluation?.metrics || getTaskMetrics();
                    const updatedMetrics = e.target.checked 
                      ? [...currentMetrics, metric]
                      : currentMetrics.filter(m => m !== metric);
                    handleConfigChange('metrics', updatedMetrics);
                  }}
                  className="rounded"
                />
                <span className="text-sm text-foreground">{metric}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 bg-muted/30 rounded-2xl border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">Evaluation Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Test Split Ratio
              </label>
              <input
                type="range"
                min="0.1"
                max="0.3"
                step="0.05"
                value={data.evaluation?.testRatio || 0.2}
                onChange={(e) => handleConfigChange('testRatio', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {((data.evaluation?.testRatio || 0.2) * 100).toFixed(0)}% for testing
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.evaluation?.generateReport !== false}
                  onChange={(e) => handleConfigChange('generateReport', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-foreground">Generate Evaluation Report</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationStep;
