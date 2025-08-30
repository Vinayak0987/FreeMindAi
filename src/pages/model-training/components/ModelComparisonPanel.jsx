import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModelComparisonPanel = ({ experiments = [] }) => {
  const [sortBy, setSortBy] = useState('accuracy');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedExperiments, setSelectedExperiments] = useState([]);

  const mockExperiments = [
    {
      id: 'exp_001',
      name: 'XGBoost Classifier',
      model: 'XGBoost',
      status: 'completed',
      accuracy: 0.912,
      precision: 0.895,
      recall: 0.887,
      f1Score: 0.891,
      trainingTime: '4m 32s',
      resourceUsage: 'Medium',
      hyperparameters: {
        learning_rate: 0.1,
        max_depth: 6,
        n_estimators: 100
      },
      createdAt: '2025-08-30T09:30:00Z'
    },
    {
      id: 'exp_002',
      name: 'Random Forest',
      model: 'Random Forest',
      status: 'completed',
      accuracy: 0.887,
      precision: 0.872,
      recall: 0.901,
      f1Score: 0.886,
      trainingTime: '2m 18s',
      resourceUsage: 'Low',
      hyperparameters: {
        n_estimators: 200,
        max_depth: 10,
        min_samples_split: 2
      },
      createdAt: '2025-08-30T09:25:00Z'
    },
    {
      id: 'exp_003',
      name: 'Neural Network',
      model: 'Neural Network',
      status: 'training',
      accuracy: 0.856,
      precision: 0.841,
      recall: 0.863,
      f1Score: 0.852,
      trainingTime: '8m 45s',
      resourceUsage: 'High',
      hyperparameters: {
        hidden_layers: 3,
        neurons_per_layer: 128,
        learning_rate: 0.001
      },
      createdAt: '2025-08-30T09:35:00Z'
    },
    {
      id: 'exp_004',
      name: 'SVM Classifier',
      model: 'SVM',
      status: 'failed',
      accuracy: 0.743,
      precision: 0.728,
      recall: 0.756,
      f1Score: 0.742,
      trainingTime: '12m 03s',
      resourceUsage: 'Medium',
      hyperparameters: {
        kernel: 'rbf',
        C: 1.0,
        gamma: 'scale'
      },
      createdAt: '2025-08-30T09:20:00Z'
    }
  ];

  const allExperiments = experiments?.length > 0 ? experiments : mockExperiments;

  const sortedExperiments = [...allExperiments]?.sort((a, b) => {
    const aValue = a?.[sortBy];
    const bValue = b?.[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleExperimentSelect = (experimentId) => {
    setSelectedExperiments(prev => 
      prev?.includes(experimentId) 
        ? prev?.filter(id => id !== experimentId)
        : [...prev, experimentId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'training': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'training': return 'Loader';
      case 'failed': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getResourceUsageColor = (usage) => {
    switch (usage) {
      case 'High': return 'text-error';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatMetric = (value) => {
    return typeof value === 'number' ? (value * 100)?.toFixed(1) + '%' : value;
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={20} className="text-success" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Model Comparison</h2>
              <p className="text-sm text-muted-foreground">
                {allExperiments?.length} experiments • {selectedExperiments?.length} selected
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              iconName="Download" 
              iconPosition="left"
              disabled={selectedExperiments?.length === 0}
            >
              Export Selected
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              iconName="Trash2" 
              iconPosition="left"
              disabled={selectedExperiments?.length === 0}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      setSelectedExperiments(allExperiments?.map(exp => exp?.id));
                    } else {
                      setSelectedExperiments([]);
                    }
                  }}
                  checked={selectedExperiments?.length === allExperiments?.length}
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Model</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('accuracy')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Accuracy</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('f1Score')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>F1 Score</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('trainingTime')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Training Time</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('resourceUsage')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  <span>Resources</span>
                  <Icon name="ArrowUpDown" size={12} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExperiments?.map((experiment, index) => (
              <tr key={experiment?.id} className={`border-t border-border hover:bg-muted/20 ${index % 2 === 0 ? 'bg-muted/5' : ''}`}>
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    checked={selectedExperiments?.includes(experiment?.id)}
                    onChange={() => handleExperimentSelect(experiment?.id)}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">{experiment?.name}</div>
                    <div className="text-sm text-muted-foreground">{experiment?.model}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(experiment?.status)} 
                      size={16} 
                      className={getStatusColor(experiment?.status)}
                    />
                    <span className={`text-sm font-medium capitalize ${getStatusColor(experiment?.status)}`}>
                      {experiment?.status}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-foreground">{formatMetric(experiment?.accuracy)}</div>
                  <div className="text-xs text-muted-foreground">
                    P: {formatMetric(experiment?.precision)} | R: {formatMetric(experiment?.recall)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-foreground">{formatMetric(experiment?.f1Score)}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-foreground">{experiment?.trainingTime}</div>
                </td>
                <td className="p-4">
                  <span className={`text-sm font-medium ${getResourceUsageColor(experiment?.resourceUsage)}`}>
                    {experiment?.resourceUsage}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Copy">
                      Clone
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Rocket">
                      Deploy
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {allExperiments?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Experiments Yet</h3>
          <p className="text-muted-foreground mb-4">Start training models to see comparison results here</p>
          <Button variant="outline" iconName="Play" iconPosition="left">
            Start First Experiment
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModelComparisonPanel;