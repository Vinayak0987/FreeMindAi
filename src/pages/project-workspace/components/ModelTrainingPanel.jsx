import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ModelTrainingPanel = ({ models }) => {
  const [selectedModel, setSelectedModel] = useState(models?.[0]);
  const [isTraining, setIsTraining] = useState(false);
  const navigate = useNavigate();

  const trainingMetrics = [
    { epoch: 1, accuracy: 0.65, loss: 0.45, val_accuracy: 0.62, val_loss: 0.48 },
    { epoch: 2, accuracy: 0.72, loss: 0.38, val_accuracy: 0.69, val_loss: 0.41 },
    { epoch: 3, accuracy: 0.78, loss: 0.32, val_accuracy: 0.75, val_loss: 0.35 },
    { epoch: 4, accuracy: 0.85, loss: 0.25, val_accuracy: 0.82, val_loss: 0.28 },
    { epoch: 5, accuracy: 0.89, loss: 0.18, val_accuracy: 0.87, val_loss: 0.21 }
  ];

  const modelConfigurations = [
    {
      id: 1,
      name: 'Random Forest',
      type: 'Classification',
      status: 'completed',
      accuracy: 0.892,
      trainingTime: '2.4h',
      parameters: { n_estimators: 100, max_depth: 10, random_state: 42 }
    },
    {
      id: 2,
      name: 'Neural Network',
      type: 'Classification',
      status: 'training',
      accuracy: 0.856,
      trainingTime: '1.2h',
      parameters: { layers: 3, neurons: 128, dropout: 0.2 }
    },
    {
      id: 3,
      name: 'XGBoost',
      type: 'Classification',
      status: 'queued',
      accuracy: null,
      trainingTime: null,
      parameters: { max_depth: 6, learning_rate: 0.1, n_estimators: 200 }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success/10';
      case 'training': return 'text-warning bg-warning/10';
      case 'queued': return 'text-accent bg-accent/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'training': return 'Loader';
      case 'queued': return 'Clock';
      case 'error': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Model Training</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            iconName="Settings"
            iconPosition="left"
            onClick={() => navigate('/model-training')}
          >
            Configure
          </Button>
          <Button
            variant="default"
            iconName="Play"
            iconPosition="left"
            loading={isTraining}
            onClick={handleStartTraining}
          >
            {isTraining ? 'Training...' : 'Start Training'}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Selection */}
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-4">Model Configurations</h3>
          <div className="space-y-3">
            {modelConfigurations?.map((model) => (
              <div
                key={model?.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
                  selectedModel?.id === model?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground hover:bg-muted/50'
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{model?.name}</h4>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getStatusColor(model?.status)}`}>
                    <Icon name={getStatusIcon(model?.status)} size={12} />
                    <span className="capitalize">{model?.status}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{model?.type}</p>
                {model?.accuracy && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="font-medium text-foreground">{(model?.accuracy * 100)?.toFixed(1)}%</span>
                  </div>
                )}
                {model?.trainingTime && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium text-foreground">{model?.trainingTime}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            fullWidth
            iconName="Plus"
            iconPosition="left"
            className="mt-4"
            onClick={() => navigate('/model-training')}
          >
            Add New Model
          </Button>
        </div>

        {/* Training Progress */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 elevation-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Training Progress</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" iconName="RefreshCw">
                Refresh
              </Button>
              <Button variant="ghost" size="sm" iconName="Download">
                Export
              </Button>
            </div>
          </div>

          {/* Metrics Chart */}
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="epoch" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  name="Training Accuracy"
                />
                <Line 
                  type="monotone" 
                  dataKey="val_accuracy" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  name="Validation Accuracy"
                />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="var(--color-error)" 
                  strokeWidth={2}
                  name="Training Loss"
                />
                <Line 
                  type="monotone" 
                  dataKey="val_loss" 
                  stroke="var(--color-warning)" 
                  strokeWidth={2}
                  name="Validation Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Current Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">89.2%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-error">0.18</p>
              <p className="text-sm text-muted-foreground">Loss</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-accent">87.5%</p>
              <p className="text-sm text-muted-foreground">Val Accuracy</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-2xl font-bold text-warning">0.21</p>
              <p className="text-sm text-muted-foreground">Val Loss</p>
            </div>
          </div>
        </div>
      </div>
      {/* Model Parameters */}
      {selectedModel && (
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-4">Model Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(selectedModel?.parameters)?.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground capitalize">
                  {key?.replace('_', ' ')}:
                </span>
                <span className="text-sm font-medium text-foreground font-mono">
                  {typeof value === 'number' ? value?.toLocaleString() : value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Training Queue */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Training Queue</h3>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
        </div>
        <div className="space-y-3">
          {modelConfigurations?.filter(m => m?.status !== 'completed')?.map((model) => (
            <div key={model?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name={getStatusIcon(model?.status)} size={16} className={getStatusColor(model?.status)?.split(' ')?.[0]} />
                <div>
                  <p className="font-medium text-foreground">{model?.name}</p>
                  <p className="text-sm text-muted-foreground">{model?.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {model?.status === 'training' && (
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div className="h-2 bg-warning rounded-full animate-pulse" style={{ width: '65%' }} />
                  </div>
                )}
                <Button variant="ghost" size="sm" iconName="MoreVertical" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelTrainingPanel;