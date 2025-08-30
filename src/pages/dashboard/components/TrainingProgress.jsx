import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainingProgress = ({ trainingJobs }) => {
  const getStatusColor = (status) => {
    const colors = {
      'running': 'text-warning',
      'completed': 'text-success',
      'failed': 'text-error',
      'queued': 'text-accent'
    };
    return colors?.[status] || 'text-muted-foreground';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'running': 'Loader',
      'completed': 'CheckCircle',
      'failed': 'XCircle',
      'queued': 'Clock'
    };
    return icons?.[status] || 'Circle';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 elevation-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Training Progress</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
        >
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {trainingJobs?.map((job) => (
          <div key={job?.id} className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors duration-150">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getStatusIcon(job?.status)} 
                  size={16} 
                  className={`${getStatusColor(job?.status)} ${job?.status === 'running' ? 'animate-spin' : ''}`}
                />
                <span className="font-medium text-foreground text-sm">{job?.modelName}</span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {job?.status}
              </span>
            </div>
            
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{job?.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    job?.status === 'completed' ? 'bg-success' :
                    job?.status === 'failed' ? 'bg-error' :
                    job?.status === 'running' ? 'bg-warning' : 'bg-accent'
                  }`}
                  style={{ width: `${job?.progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Epoch {job?.currentEpoch}/{job?.totalEpochs}</span>
              <span>{formatDuration(job?.elapsedTime)}</span>
            </div>
            
            {job?.status === 'running' && job?.eta && (
              <div className="mt-2 text-xs text-muted-foreground">
                ETA: {formatDuration(job?.eta)}
              </div>
            )}
          </div>
        ))}
      </div>
      {trainingJobs?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Brain" size={48} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No active training jobs</p>
        </div>
      )}
    </div>
  );
};

export default TrainingProgress;