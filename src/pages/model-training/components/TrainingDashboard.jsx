import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainingDashboard = ({ isTraining, trainingConfig }) => {
  const [currentPhase, setCurrentPhase] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState('--:--');
  const [elapsedTime, setElapsedTime] = useState(0);

  const trainingPhases = [
    { id: 'preprocessing', label: 'Data Preprocessing', icon: 'Database', duration: 15 },
    { id: 'feature_engineering', label: 'Feature Engineering', icon: 'Wrench', duration: 20 },
    { id: 'model_selection', label: 'Model Selection', icon: 'Brain', duration: 25 },
    { id: 'hyperparameter_tuning', label: 'Hyperparameter Tuning', icon: 'Settings', duration: 30 },
    { id: 'evaluation', label: 'Final Evaluation', icon: 'CheckCircle', duration: 10 }
  ];

  const mockMetricsData = [
    { epoch: 1, accuracy: 0.65, loss: 0.8, val_accuracy: 0.62, val_loss: 0.85 },
    { epoch: 2, accuracy: 0.72, loss: 0.65, val_accuracy: 0.68, val_loss: 0.72 },
    { epoch: 3, accuracy: 0.78, loss: 0.55, val_accuracy: 0.74, val_loss: 0.62 },
    { epoch: 4, accuracy: 0.82, loss: 0.48, val_accuracy: 0.79, val_loss: 0.58 },
    { epoch: 5, accuracy: 0.85, loss: 0.42, val_accuracy: 0.81, val_loss: 0.52 },
    { epoch: 6, accuracy: 0.87, loss: 0.38, val_accuracy: 0.83, val_loss: 0.49 },
    { epoch: 7, accuracy: 0.89, loss: 0.35, val_accuracy: 0.85, val_loss: 0.46 },
    { epoch: 8, accuracy: 0.91, loss: 0.32, val_accuracy: 0.87, val_loss: 0.43 }
  ];

  const mockLogs = [
    { id: 1, timestamp: '09:44:16', level: 'INFO', message: 'Training session initialized successfully' },
    { id: 2, timestamp: '09:44:17', level: 'INFO', message: 'Dataset loaded: 10,000 samples, 15 features' },
    { id: 3, timestamp: '09:44:18', level: 'INFO', message: 'Data preprocessing started...' },
    { id: 4, timestamp: '09:44:25', level: 'SUCCESS', message: 'Data preprocessing completed (7.2s)' },
    { id: 5, timestamp: '09:44:26', level: 'INFO', message: 'Feature engineering in progress...' },
    { id: 6, timestamp: '09:44:35', level: 'SUCCESS', message: 'Generated 8 new features automatically' },
    { id: 7, timestamp: '09:44:36', level: 'INFO', message: 'Model selection phase started' },
    { id: 8, timestamp: '09:44:45', level: 'INFO', message: 'Testing Random Forest model...' },
    { id: 9, timestamp: '09:44:52', level: 'INFO', message: 'Testing XGBoost model...' },
    { id: 10, timestamp: '09:45:01', level: 'SUCCESS', message: 'Best model selected: XGBoost (accuracy: 0.91)' }
  ];

  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setProgress(prev => Math.min(prev + 0.5, 100));
        
        // Simulate phase progression
        if (progress < 15) setCurrentPhase('preprocessing');
        else if (progress < 35) setCurrentPhase('feature_engineering');
        else if (progress < 60) setCurrentPhase('model_selection');
        else if (progress < 90) setCurrentPhase('hyperparameter_tuning');
        else setCurrentPhase('evaluation');
        
        // Update metrics
        if (progress > 60 && metrics?.length < 8) {
          setMetrics(mockMetricsData?.slice(0, Math.floor((progress - 60) / 4)));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTraining, progress, metrics?.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getPhaseStatus = (phaseId) => {
    const currentIndex = trainingPhases?.findIndex(p => p?.id === currentPhase);
    const phaseIndex = trainingPhases?.findIndex(p => p?.id === phaseId);
    
    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'SUCCESS': return 'text-success';
      case 'ERROR': return 'text-error';
      case 'WARNING': return 'text-warning';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Progress Overview */}
      <div className="bg-card border border-border rounded-lg elevation-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Training Progress</h2>
              <p className="text-sm text-muted-foreground">
                {isTraining ? `Phase: ${trainingPhases?.find(p => p?.id === currentPhase)?.label || 'Initializing'}` : 'Ready to start training'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{progress?.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">
              Elapsed: {formatTime(elapsedTime)} | ETA: {estimatedTime}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-accent h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Training Phases */}
        <div className="grid grid-cols-5 gap-4">
          {trainingPhases?.map((phase, index) => {
            const status = getPhaseStatus(phase?.id);
            return (
              <div key={phase?.id} className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  status === 'completed' ? 'bg-success text-success-foreground' :
                  status === 'active' ? 'bg-accent text-accent-foreground animate-pulse' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={phase?.icon} size={20} />
                </div>
                <div className={`text-xs font-medium ${
                  status === 'completed' ? 'text-success' :
                  status === 'active'? 'text-accent' : 'text-muted-foreground'
                }`}>
                  {phase?.label}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ~{phase?.duration}s
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Performance Metrics Chart */}
      {metrics?.length > 0 && (
        <div className="bg-card border border-border rounded-lg elevation-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Training Metrics</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">Training</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-muted-foreground">Validation</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Accuracy Chart */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Accuracy</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
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
                    <Line type="monotone" dataKey="accuracy" stroke="var(--color-accent)" strokeWidth={2} dot={{ fill: 'var(--color-accent)' }} />
                    <Line type="monotone" dataKey="val_accuracy" stroke="var(--color-warning)" strokeWidth={2} dot={{ fill: 'var(--color-warning)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Loss Chart */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Loss</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
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
                    <Line type="monotone" dataKey="loss" stroke="var(--color-accent)" strokeWidth={2} dot={{ fill: 'var(--color-accent)' }} />
                    <Line type="monotone" dataKey="val_loss" stroke="var(--color-warning)" strokeWidth={2} dot={{ fill: 'var(--color-warning)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Training Logs */}
      <div className="bg-card border border-border rounded-lg elevation-1">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Training Logs</h3>
            <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
              Export Logs
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm max-h-64 overflow-y-auto">
            {(isTraining ? mockLogs : [])?.map((log) => (
              <div key={log?.id} className="flex items-start space-x-3 py-1">
                <span className="text-muted-foreground text-xs">{log?.timestamp}</span>
                <span className={`text-xs font-medium ${getLogLevelColor(log?.level)}`}>
                  [{log?.level}]
                </span>
                <span className="text-foreground flex-1">{log?.message}</span>
              </div>
            ))}
            {!isTraining && (
              <div className="text-center text-muted-foreground py-8">
                <Icon name="FileText" size={32} className="mx-auto mb-2 opacity-50" />
                <p>Training logs will appear here when training starts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;